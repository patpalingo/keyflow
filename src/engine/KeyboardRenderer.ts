import { KEYBOARD_LAYOUT, PIANO_MIN, PIANO_MAX, midiToNoteName } from '../utils/noteMapping';
import { COLORS } from '../utils/colorScheme';
import { KEYBOARD_HEIGHT_RATIO } from './constants';

const WRONG_NOTE_DURATION = 300; // ms

export function drawKeyboard(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  activeInputNotes: Set<number>,
  expectedNotes: Set<number>,
  learningMode: boolean = false,
  wrongNotes: Map<number, number> = new Map(),
) {
  const kbHeight = canvasHeight * KEYBOARD_HEIGHT_RATIO;
  const kbTop = canvasHeight - kbHeight;

  // Draw background — dark purple-tinted
  ctx.fillStyle = '#13111f';
  ctx.fillRect(0, kbTop, canvasWidth, kbHeight);

  // Draw white keys first, then black keys on top
  const whiteKeys = KEYBOARD_LAYOUT.filter(k => !k.isBlack);
  const blackKeys = KEYBOARD_LAYOUT.filter(k => k.isBlack);

  const now = performance.now();

  for (const key of whiteKeys) {
    const x = key.x * canvasWidth;
    const w = key.width * canvasWidth;

    const isPressed = activeInputNotes.has(key.midi);
    const isExpected = expectedNotes.has(key.midi);
    const wrongTime = wrongNotes.get(key.midi);
    const isWrong = wrongTime !== undefined && (now - wrongTime) < WRONG_NOTE_DURATION;

    if (isWrong) {
      ctx.fillStyle = '#f2889b';
    } else if (isPressed) {
      ctx.fillStyle = COLORS.keyPressed;
    } else if (isExpected) {
      ctx.fillStyle = COLORS.keyExpected;
    } else {
      ctx.fillStyle = COLORS.keyWhite;
    }

    // Rounded top corners for white keys
    const r = 3;
    ctx.beginPath();
    ctx.moveTo(x + 0.5 + r, kbTop);
    ctx.lineTo(x + w - 1 - r, kbTop);
    ctx.quadraticCurveTo(x + w - 1, kbTop, x + w - 1, kbTop + r);
    ctx.lineTo(x + w - 1, kbTop + kbHeight - 1);
    ctx.lineTo(x + 0.5, kbTop + kbHeight - 1);
    ctx.lineTo(x + 0.5, kbTop + r);
    ctx.quadraticCurveTo(x + 0.5, kbTop, x + 0.5 + r, kbTop);
    ctx.closePath();
    ctx.fill();

    // Subtle key border
    ctx.strokeStyle = '#d4cce2';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Learning mode: note name labels on expected keys + all C keys
    if (learningMode) {
      const isC = key.midi % 12 === 0;
      if (isExpected || isC) {
        const name = midiToNoteName(key.midi);
        const fontSize = Math.min(w * 0.55, 10);
        ctx.save();
        ctx.font = `bold ${fontSize}px Quicksand, system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = isExpected ? '#5e4a9e' : '#999';
        ctx.fillText(name, x + w / 2, kbTop + kbHeight - 3);
        ctx.restore();
      }
    }
  }

  for (const key of blackKeys) {
    const x = key.x * canvasWidth;
    const w = key.width * canvasWidth;
    const h = kbHeight * 0.6;

    const isPressed = activeInputNotes.has(key.midi);
    const isExpected = expectedNotes.has(key.midi);
    const wrongTime = wrongNotes.get(key.midi);
    const isWrong = wrongTime !== undefined && (now - wrongTime) < WRONG_NOTE_DURATION;

    if (isWrong) {
      ctx.fillStyle = '#e05070';
    } else if (isPressed) {
      ctx.fillStyle = COLORS.keyPressed;
    } else if (isExpected) {
      ctx.fillStyle = '#4a3d6e';
    } else {
      ctx.fillStyle = COLORS.keyBlack;
    }

    // Rounded top corners for black keys
    const r = 2;
    ctx.beginPath();
    ctx.moveTo(x + r, kbTop);
    ctx.lineTo(x + w - r, kbTop);
    ctx.quadraticCurveTo(x + w, kbTop, x + w, kbTop + r);
    ctx.lineTo(x + w, kbTop + h);
    ctx.lineTo(x, kbTop + h);
    ctx.lineTo(x, kbTop + r);
    ctx.quadraticCurveTo(x, kbTop, x + r, kbTop);
    ctx.closePath();
    ctx.fill();

    // Learning mode: labels on expected black keys
    if (learningMode && isExpected) {
      const name = midiToNoteName(key.midi).replace(/\d+$/, '');
      const fontSize = Math.min(w * 0.5, 8);
      ctx.save();
      ctx.font = `bold ${fontSize}px Quicksand, system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = '#ddd';
      ctx.fillText(name, x + w / 2, kbTop + h - 2);
      ctx.restore();
    }
  }
}

// Get pixel X and width for a given MIDI note
export function getNoteXAndWidth(midi: number, canvasWidth: number): { x: number; width: number } | null {
  if (midi < PIANO_MIN || midi > PIANO_MAX) return null;

  const key = KEYBOARD_LAYOUT.find(k => k.midi === midi);
  if (!key) return null;

  return {
    x: key.x * canvasWidth,
    width: key.width * canvasWidth,
  };
}
