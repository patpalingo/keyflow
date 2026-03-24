import * as Tone from 'tone';
import type { ParsedSong } from '../types/midi';
import { LOOK_AHEAD_SECONDS } from '../engine/constants';

let sampler: Tone.Sampler | null = null;
let scheduledEvents: number[] = [];
let isReady = false;

async function ensureSampler(): Promise<Tone.Sampler> {
  if (sampler && isReady) return sampler;

  sampler = new Tone.Sampler({
    urls: {
      A0: 'A0.mp3',
      C1: 'C1.mp3',
      'D#1': 'Ds1.mp3',
      'F#1': 'Fs1.mp3',
      A1: 'A1.mp3',
      C2: 'C2.mp3',
      'D#2': 'Ds2.mp3',
      'F#2': 'Fs2.mp3',
      A2: 'A2.mp3',
      C3: 'C3.mp3',
      'D#3': 'Ds3.mp3',
      'F#3': 'Fs3.mp3',
      A3: 'A3.mp3',
      C4: 'C4.mp3',
      'D#4': 'Ds4.mp3',
      'F#4': 'Fs4.mp3',
      A4: 'A4.mp3',
      C5: 'C5.mp3',
      'D#5': 'Ds5.mp3',
      'F#5': 'Fs5.mp3',
      A5: 'A5.mp3',
      C6: 'C6.mp3',
      'D#6': 'Ds6.mp3',
      'F#6': 'Fs6.mp3',
      A6: 'A6.mp3',
      C7: 'C7.mp3',
      'D#7': 'Ds7.mp3',
      'F#7': 'Fs7.mp3',
      A7: 'A7.mp3',
      C8: 'C8.mp3',
    },
    release: 1,
    baseUrl: 'https://tonejs.github.io/audio/salamander/',
    onload: () => {
      isReady = true;
    },
  }).toDestination();

  // Wait for samples to load
  await Tone.loaded();
  isReady = true;
  return sampler;
}

export async function scheduleSong(song: ParsedSong, speed: number): Promise<void> {
  const s = await ensureSampler();
  clearSchedule();

  await Tone.start();
  Tone.getTransport().bpm.value = song.bpm * speed;
  Tone.getTransport().cancel();

  for (const note of song.allNotes) {
    const midiNote = Tone.Frequency(note.midiNote, 'midi').toNote();
    const time = (note.startTime + LOOK_AHEAD_SECONDS) / speed;
    const duration = note.duration / speed;

    const eventId = Tone.getTransport().schedule((t) => {
      s.triggerAttackRelease(midiNote, duration, t, note.velocity / 127);
    }, time);
    scheduledEvents.push(eventId);
  }
}

export function startPlayback(): void {
  Tone.getTransport().start();
}

export function pausePlayback(): void {
  Tone.getTransport().pause();
}

export function stopPlayback(): void {
  Tone.getTransport().stop();
  Tone.getTransport().position = 0;
}

export function seekTo(seconds: number): void {
  Tone.getTransport().seconds = seconds;
}

export function setPlaybackSpeed(speed: number): void {
  Tone.getTransport().bpm.value = 120 * speed;
}

export function clearSchedule(): void {
  for (const id of scheduledEvents) {
    Tone.getTransport().clear(id);
  }
  scheduledEvents = [];
  Tone.getTransport().cancel();
  Tone.getTransport().stop();
  Tone.getTransport().position = 0;
}

export function setVolume(db: number): void {
  if (sampler) {
    sampler.volume.value = db;
  }
}

export async function initAudio(): Promise<void> {
  await ensureSampler();
}
