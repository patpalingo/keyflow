import type { GameNote } from '../types/game';
import { getNoteColor } from '../utils/colorScheme';
import { getNoteXAndWidth } from './KeyboardRenderer';
import { HIT_ZONE_Y_RATIO, LOOK_AHEAD_SECONDS, NOTE_BORDER_RADIUS, NOTE_MIN_HEIGHT } from './constants';
import { midiToNoteName } from '../utils/noteMapping';

export function drawNotes(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  gameNotes: GameNote[],
  currentTime: number,
  learningMode: boolean = false,
) {
  const hitZoneY = canvasHeight * HIT_ZONE_Y_RATIO;
  const pixelsPerSecond = hitZoneY / LOOK_AHEAD_SECONDS;

  for (const note of gameNotes) {
    // Skip notes that are already handled
    if (note.state === 'hit' || note.state === 'missed') continue;

    // Calculate Y position: note falls from top to hit zone
    const timeUntilHit = note.startTime - currentTime;

    // Cull notes too far above or below
    if (timeUntilHit > LOOK_AHEAD_SECONDS + 0.5) continue;
    if (timeUntilHit < -0.5) continue;

    const noteY = hitZoneY - (timeUntilHit * pixelsPerSecond);
    const noteHeight = Math.max(note.duration * pixelsPerSecond, NOTE_MIN_HEIGHT);

    const pos = getNoteXAndWidth(note.midiNote, canvasWidth);
    if (!pos) continue;

    // Draw the note rectangle (bottom at noteY, extends upward by duration)
    const drawY = noteY - noteHeight;
    const isActive = timeUntilHit <= 0 && timeUntilHit > -note.duration;
    const color = getNoteColor(note.hand, isActive);

    ctx.fillStyle = color;
    ctx.globalAlpha = isActive ? 1 : 0.85;

    // Rounded rectangle
    roundRect(ctx, pos.x + 1, drawY, pos.width - 2, noteHeight, NOTE_BORDER_RADIUS);
    ctx.fill();

    // Learning mode: draw note name and hand label
    if (learningMode) {
      const noteW = pos.width - 2;
      const fontSize = Math.min(noteW * 0.65, 13);
      if (fontSize >= 6) {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.font = `bold ${fontSize}px Quicksand, Nunito, system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 2;

        // Note name — show short form for narrow notes
        const fullName = midiToNoteName(note.midiNote);
        const label = noteW < 16 ? fullName.replace(/\d+$/, '') : fullName;
        const centerX = pos.x + 1 + noteW / 2;

        if (noteHeight >= 28) {
          // Enough room: name centered, hand badge at top
          ctx.fillText(label, centerX, drawY + noteHeight / 2);
          if (note.hand !== 'unknown') {
            ctx.font = `bold ${Math.max(fontSize * 0.7, 7)}px Quicksand, system-ui`;
            ctx.globalAlpha = 0.7;
            ctx.fillText(note.hand === 'left' ? 'L' : 'R', centerX, drawY + 8);
          }
        } else {
          // Short note: just the name
          ctx.fillText(label, centerX, drawY + noteHeight / 2);
        }
        ctx.restore();
      }
    }

    ctx.globalAlpha = 1;
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
