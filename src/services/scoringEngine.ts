import type { GameNote, HitResult } from '../types/game';

// Timing windows in seconds
const PERFECT_WINDOW = 0.05;  // ±50ms
const GOOD_WINDOW = 0.12;     // ±120ms
const MISS_WINDOW = 0.20;     // after 200ms past, auto-miss

export function evaluateHit(
  inputNote: number,
  inputTime: number,
  gameNotes: GameNote[],
  currentTime: number,
): { note: GameNote; result: HitResult } | null {
  let bestMatch: GameNote | null = null;
  let bestDelta = Infinity;

  for (const gn of gameNotes) {
    if (gn.state !== 'upcoming' && gn.state !== 'active') continue;
    if (gn.midiNote !== inputNote) continue;

    const delta = Math.abs(gn.startTime - inputTime);
    if (delta < bestDelta && delta <= GOOD_WINDOW) {
      bestDelta = delta;
      bestMatch = gn;
    }
  }

  if (!bestMatch) return null;

  const result: HitResult = bestDelta <= PERFECT_WINDOW ? 'perfect' : 'good';
  bestMatch.state = 'hit';
  bestMatch.hitResult = result;

  return { note: bestMatch, result };
}

export function checkMissedNotes(gameNotes: GameNote[], currentTime: number): GameNote[] {
  const missed: GameNote[] = [];

  for (const gn of gameNotes) {
    if (gn.state !== 'upcoming' && gn.state !== 'active') continue;
    if (currentTime - gn.startTime > MISS_WINDOW) {
      gn.state = 'missed';
      gn.hitResult = 'miss';
      missed.push(gn);
    }
  }

  return missed;
}

export function getScoreForHit(result: HitResult, combo: number): number {
  const base = result === 'perfect' ? 100 : 50;
  const multiplier = Math.min(Math.floor(combo / 10) + 1, 4);
  return base * multiplier;
}
