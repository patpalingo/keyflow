import type { ParsedSong } from '../types/midi';
import type { GameNote } from '../types/game';

let idCounter = 0;

export function scheduleNotes(song: ParsedSong): GameNote[] {
  idCounter = 0;
  return song.allNotes.map(note => ({
    ...note,
    id: `note-${idCounter++}`,
    state: 'upcoming' as const,
    hitResult: undefined,
  }));
}
