import type { HitResult } from '../types/game';
import { getHitColor } from '../utils/colorScheme';
import { HIT_ZONE_Y_RATIO, EFFECT_DURATION_MS } from './constants';
import { getNoteXAndWidth } from './KeyboardRenderer';

interface HitEffect {
  midiNote: number;
  result: HitResult;
  startTime: number;  // performance.now()
}

const activeEffects: HitEffect[] = [];

export function addHitEffect(midiNote: number, result: HitResult): void {
  activeEffects.push({
    midiNote,
    result,
    startTime: performance.now(),
  });
}

export function drawEffects(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
) {
  const now = performance.now();
  const hitZoneY = canvasHeight * HIT_ZONE_Y_RATIO;

  // Remove expired effects
  let i = activeEffects.length;
  while (i--) {
    if (now - activeEffects[i].startTime > EFFECT_DURATION_MS) {
      activeEffects.splice(i, 1);
    }
  }

  for (const effect of activeEffects) {
    const pos = getNoteXAndWidth(effect.midiNote, canvasWidth);
    if (!pos) continue;

    const elapsed = now - effect.startTime;
    const progress = elapsed / EFFECT_DURATION_MS;
    const alpha = 1 - progress;
    const spread = progress * 30;

    const color = getHitColor(effect.result);

    ctx.save();
    ctx.globalAlpha = alpha * 0.6;
    ctx.fillStyle = color;

    // Expanding glow at hit zone
    ctx.fillRect(
      pos.x - spread,
      hitZoneY - 15 - spread,
      pos.width + spread * 2,
      30 + spread * 2,
    );

    ctx.restore();
  }
}
