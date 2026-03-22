import { HIT_ZONE_Y_RATIO, HIT_ZONE_HEIGHT } from './constants';

export function drawHitZone(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
) {
  const hitZoneY = canvasHeight * HIT_ZONE_Y_RATIO;

  // Soft glow area
  const gradient = ctx.createLinearGradient(0, hitZoneY - 40, 0, hitZoneY + 40);
  gradient.addColorStop(0, 'transparent');
  gradient.addColorStop(0.3, 'rgba(124, 107, 196, 0.05)');
  gradient.addColorStop(0.5, 'rgba(124, 107, 196, 0.12)');
  gradient.addColorStop(0.7, 'rgba(124, 107, 196, 0.05)');
  gradient.addColorStop(1, 'transparent');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, hitZoneY - 40, canvasWidth, 80);

  // Main line — soft purple
  ctx.fillStyle = 'rgba(169, 155, 224, 0.7)';
  ctx.fillRect(0, hitZoneY - HIT_ZONE_HEIGHT / 2, canvasWidth, HIT_ZONE_HEIGHT);

  // Thin bright center line
  ctx.fillStyle = 'rgba(180, 167, 224, 0.85)';
  ctx.fillRect(0, hitZoneY - 0.5, canvasWidth, 1);
}
