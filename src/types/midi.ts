export interface ParsedNote {
  midiNote: number;       // 0-127 (21=A0, 108=C8 for 88 keys)
  startTime: number;      // seconds from song start
  duration: number;       // seconds
  velocity: number;       // 0-127
  hand: 'left' | 'right' | 'unknown';
}

export interface ParsedTrack {
  name: string;
  hand: 'left' | 'right' | 'unknown';
  notes: ParsedNote[];
}

export interface ParsedSong {
  name: string;
  durationSeconds: number;
  bpm: number;
  timeSignature: [number, number];
  tracks: ParsedTrack[];
  allNotes: ParsedNote[];  // flattened + sorted by startTime
}
