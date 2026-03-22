import type { ParsedSong, ParsedNote } from '../types/midi';

function buildSong(
  name: string,
  bpm: number,
  noteData: { midi: number; start: number; dur: number; hand: 'left' | 'right' }[],
): ParsedSong {
  const notes: ParsedNote[] = noteData.map(n => ({
    midiNote: n.midi,
    startTime: n.start,
    duration: n.dur,
    velocity: 80,
    hand: n.hand,
  }));

  notes.sort((a, b) => a.startTime - b.startTime || a.midiNote - b.midiNote);

  const duration = notes.length > 0
    ? Math.max(...notes.map(n => n.startTime + n.duration))
    : 0;

  return {
    name,
    durationSeconds: duration,
    bpm,
    timeSignature: [4, 4],
    tracks: [{ name: 'Piano', hand: 'unknown', notes }],
    allNotes: notes,
  };
}

// Helper: place notes sequentially with a gap
function seq(
  midis: number[],
  startTime: number,
  dur: number,
  gap: number,
  hand: 'left' | 'right',
): { midi: number; start: number; dur: number; hand: 'left' | 'right' }[] {
  return midis.map((midi, i) => ({
    midi,
    start: startTime + i * gap,
    dur,
    hand,
  }));
}

// Helper: chord at a time
function chord(
  midis: number[],
  start: number,
  dur: number,
  hand: 'left' | 'right',
): { midi: number; start: number; dur: number; hand: 'left' | 'right' }[] {
  return midis.map(midi => ({ midi, start, dur, hand }));
}

export function createTwinkleTwinkle(): ParsedSong {
  // Twinkle Twinkle Little Star in C major
  // Right hand melody
  const melody = [
    60, 60, 67, 67, 69, 69, 67, // Twin-kle twin-kle lit-tle star
    65, 65, 64, 64, 62, 62, 60, // How I won-der what you are
    67, 67, 65, 65, 64, 64, 62, // Up a-bove the world so high
    67, 67, 65, 65, 64, 64, 62, // Like a dia-mond in the sky
    60, 60, 67, 67, 69, 69, 67, // Twin-kle twin-kle lit-tle star
    65, 65, 64, 64, 62, 62, 60, // How I won-der what you are
  ];

  const gap = 0.5; // each note
  const dur = 0.4;
  const notes: { midi: number; start: number; dur: number; hand: 'left' | 'right' }[] = [];

  // Melody (right hand)
  let t = 0;
  for (let i = 0; i < melody.length; i++) {
    // Half notes on certain beats (end of each phrase)
    const isHeld = (i % 7 === 6); // last note of each line
    notes.push({ midi: melody[i], start: t, dur: isHeld ? 0.9 : dur, hand: 'right' });
    t += isHeld ? 1.0 : gap;
  }

  // Simple bass (left hand) — root notes on each phrase
  const bassPattern = [
    { midi: 48, start: 0 },     // C
    { midi: 43, start: 3.5 },   // G
    { midi: 45, start: 7.0 },   // A
    { midi: 48, start: 10.0 },  // C
    { midi: 43, start: 14.0 },  // G
    { midi: 45, start: 17.5 },  // A
    { midi: 43, start: 21.0 },  // G
    { midi: 43, start: 24.5 },  // G
    { midi: 45, start: 28.0 },  // A
    { midi: 43, start: 31.0 },  // G
    { midi: 48, start: 35.0 },  // C
    { midi: 43, start: 38.5 },  // G
  ];

  for (const b of bassPattern) {
    notes.push({ midi: b.midi, start: b.start, dur: 1.5, hand: 'left' });
  }

  return buildSong('Twinkle Twinkle Little Star', 100, notes);
}

export function createMaryHadALittleLamb(): ParsedSong {
  // Mary Had a Little Lamb in C major
  const melody = [
    64, 62, 60, 62, 64, 64, 64, // Ma-ry had a lit-tle lamb
    62, 62, 62,                   // lit-tle lamb
    64, 67, 67,                   // lit-tle lamb
    64, 62, 60, 62, 64, 64, 64, // Ma-ry had a lit-tle lamb its
    64, 62, 62, 64, 62, 60,     // fleece was white as snow
  ];

  const gap = 0.45;
  const dur = 0.35;
  const notes: { midi: number; start: number; dur: number; hand: 'left' | 'right' }[] = [];

  let t = 0;
  for (let i = 0; i < melody.length; i++) {
    // Hold the phrase-ending notes
    const isEnd = [6, 9, 12, 19, 25].includes(i);
    notes.push({ midi: melody[i], start: t, dur: isEnd ? 0.8 : dur, hand: 'right' });
    t += isEnd ? 0.9 : gap;
  }

  return buildSong('Mary Had a Little Lamb', 110, notes);
}

export function createHotCrossBuns(): ParsedSong {
  // Hot Cross Buns — very simple, great for beginners
  const melody = [
    64, 62, 60,       // Hot cross buns
    64, 62, 60,       // Hot cross buns
    60, 60, 60, 60,   // One a pen-ny
    62, 62, 62, 62,   // Two a pen-ny
    64, 62, 60,       // Hot cross buns
  ];

  const gap = 0.5;
  const dur = 0.4;
  const notes: { midi: number; start: number; dur: number; hand: 'left' | 'right' }[] = [];

  let t = 0;
  for (let i = 0; i < melody.length; i++) {
    const isHeld = [2, 5, 16].includes(i);
    const isShort = (i >= 6 && i <= 13); // fast section
    notes.push({
      midi: melody[i],
      start: t,
      dur: isHeld ? 0.9 : (isShort ? 0.25 : dur),
      hand: 'right',
    });
    t += isHeld ? 1.0 : (isShort ? 0.3 : gap);
  }

  return buildSong('Hot Cross Buns', 100, notes);
}

export function createOdeToJoy(): ParsedSong {
  // Beethoven's Ode to Joy — simplified right hand
  const melody = [
    64, 64, 65, 67, 67, 65, 64, 62, // line 1
    60, 60, 62, 64, 64, 62, 62,     // line 2 (held D)
    64, 64, 65, 67, 67, 65, 64, 62, // line 3
    60, 60, 62, 64, 62, 60, 60,     // line 4 (held C)
  ];

  const gap = 0.45;
  const dur = 0.35;
  const notes: { midi: number; start: number; dur: number; hand: 'left' | 'right' }[] = [];

  let t = 0;
  for (let i = 0; i < melody.length; i++) {
    const isHeld = [14, 30].includes(i); // held notes at phrase ends
    notes.push({ midi: melody[i], start: t, dur: isHeld ? 0.8 : dur, hand: 'right' });
    t += isHeld ? 0.9 : gap;
  }

  // Simple left hand bass on downbeats
  const bassBeats = [0, 1.8, 3.6, 5.4, 7.2, 9.0, 10.8];
  for (const bt of bassBeats) {
    notes.push({ midi: 48, start: bt, dur: 1.2, hand: 'left' });
  }

  return buildSong('Ode to Joy (Simplified)', 105, notes);
}

export interface DemoSongEntry {
  id: string;
  name: string;
  difficulty: 'Beginner' | 'Easy' | 'Medium';
  noteCount: number;
  create: () => ParsedSong;
}

export const DEMO_SONGS: DemoSongEntry[] = [
  {
    id: 'hot-cross-buns',
    name: 'Hot Cross Buns',
    difficulty: 'Beginner',
    noteCount: 17,
    create: createHotCrossBuns,
  },
  {
    id: 'mary-lamb',
    name: 'Mary Had a Little Lamb',
    difficulty: 'Beginner',
    noteCount: 26,
    create: createMaryHadALittleLamb,
  },
  {
    id: 'twinkle',
    name: 'Twinkle Twinkle Little Star',
    difficulty: 'Easy',
    noteCount: 54,
    create: createTwinkleTwinkle,
  },
  {
    id: 'ode-to-joy',
    name: 'Ode to Joy (Simplified)',
    difficulty: 'Easy',
    noteCount: 38,
    create: createOdeToJoy,
  },
];
