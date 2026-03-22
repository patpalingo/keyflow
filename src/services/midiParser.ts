import { Midi } from '@tonejs/midi';
import type { ParsedSong, ParsedTrack, ParsedNote } from '../types/midi';
import { MIDDLE_C } from '../utils/noteMapping';

function inferHand(trackName: string, notes: ParsedNote[]): 'left' | 'right' | 'unknown' {
  const lower = trackName.toLowerCase();
  if (lower.includes('left') || lower.includes('lh') || lower.includes('bass')) return 'left';
  if (lower.includes('right') || lower.includes('rh') || lower.includes('treble')) return 'right';

  // Heuristic: if most notes are below middle C, it's likely left hand
  if (notes.length === 0) return 'unknown';
  const belowMiddle = notes.filter(n => n.midiNote < MIDDLE_C).length;
  const ratio = belowMiddle / notes.length;
  if (ratio > 0.7) return 'left';
  if (ratio < 0.3) return 'right';
  return 'unknown';
}

export async function parseMidiFile(file: File): Promise<ParsedSong> {
  const buffer = await file.arrayBuffer();
  const midi = new Midi(buffer);

  const tracks: ParsedTrack[] = [];

  for (const track of midi.tracks) {
    if (track.notes.length === 0) continue;

    const notes: ParsedNote[] = track.notes.map(n => ({
      midiNote: n.midi,
      startTime: n.time,
      duration: n.duration,
      velocity: n.velocity * 127, // @tonejs/midi normalizes to 0-1
      hand: 'unknown' as const,
    }));

    const hand = inferHand(track.name, notes);
    // Assign hand to each note
    for (const note of notes) {
      note.hand = hand;
    }

    tracks.push({
      name: track.name || `Track ${tracks.length + 1}`,
      hand,
      notes,
    });
  }

  // If there's only one track with 'unknown' hand, split by note range
  if (tracks.length === 1 && tracks[0].hand === 'unknown') {
    for (const note of tracks[0].notes) {
      note.hand = note.midiNote < MIDDLE_C ? 'left' : 'right';
    }
  }

  // Flatten all notes, sorted by start time
  const allNotes = tracks
    .flatMap(t => t.notes)
    .sort((a, b) => a.startTime - b.startTime || a.midiNote - b.midiNote);

  // Get tempo
  const bpm = midi.header.tempos.length > 0 ? Math.round(midi.header.tempos[0].bpm) : 120;

  // Get time signature
  const ts = midi.header.timeSignatures.length > 0
    ? midi.header.timeSignatures[0].timeSignature as [number, number]
    : [4, 4] as [number, number];

  // Duration = last note end time
  const durationSeconds = allNotes.length > 0
    ? Math.max(...allNotes.map(n => n.startTime + n.duration))
    : 0;

  return {
    name: midi.name || file.name.replace(/\.mid$/i, ''),
    durationSeconds,
    bpm,
    timeSignature: ts,
    tracks,
    allNotes,
  };
}
