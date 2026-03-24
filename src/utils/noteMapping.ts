const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Piano range: MIDI 21 (A0) to 108 (C8)
export const PIANO_MIN = 21;
export const PIANO_MAX = 108;
export const TOTAL_KEYS = PIANO_MAX - PIANO_MIN + 1; // 88

export function midiToNoteName(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  const note = NOTE_NAMES[midi % 12];
  return `${note}${octave}`;
}

export function isBlackKey(midi: number): boolean {
  const note = midi % 12;
  return [1, 3, 6, 8, 10].includes(note);
}

// Middle C = MIDI 60
export const MIDDLE_C = 60;

// Build a layout map for the 88 keys
// Returns the x-position (0-1 normalized) and width for each key
export interface KeyLayout {
  midi: number;
  x: number;
  width: number;
  isBlack: boolean;
}

export function buildKeyboardLayout(): KeyLayout[] {
  const layout: KeyLayout[] = [];

  // Count white keys in range
  let whiteCount = 0;
  for (let m = PIANO_MIN; m <= PIANO_MAX; m++) {
    if (!isBlackKey(m)) whiteCount++;
  }

  const whiteWidth = 1 / whiteCount;
  const blackWidth = whiteWidth * 0.6;

  let whiteIndex = 0;
  for (let m = PIANO_MIN; m <= PIANO_MAX; m++) {
    if (!isBlackKey(m)) {
      layout.push({
        midi: m,
        x: whiteIndex * whiteWidth,
        width: whiteWidth,
        isBlack: false,
      });
      whiteIndex++;
    }
  }

  // Now place black keys relative to their white keys
  whiteIndex = 0;
  for (let m = PIANO_MIN; m <= PIANO_MAX; m++) {
    if (isBlackKey(m)) {
      // Black key sits between the previous white key and the next
      // whiteIndex was already incremented by the preceding white key,
      // so the previous white key is at (whiteIndex - 1)
      const prevWhiteX = (whiteIndex - 1) * whiteWidth;
      layout.push({
        midi: m,
        x: prevWhiteX + whiteWidth - blackWidth / 2,
        width: blackWidth,
        isBlack: true,
      });
    } else {
      whiteIndex++;
    }
  }

  return layout;
}

// Pre-computed layout
export const KEYBOARD_LAYOUT = buildKeyboardLayout();

// Quick lookup: midi number -> layout
const layoutMap = new Map<number, KeyLayout>();
for (const key of KEYBOARD_LAYOUT) {
  layoutMap.set(key.midi, key);
}

export function getKeyLayout(midi: number): KeyLayout | undefined {
  return layoutMap.get(midi);
}
