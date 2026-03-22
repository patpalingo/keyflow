export const COLORS = {
  // Note colors by hand — soft pastels
  leftHand: '#7c6bc4',       // soft purple
  leftHandActive: '#a99be0',
  rightHand: '#f0a0c0',      // soft pink
  rightHandActive: '#f5c0d5',
  unknown: '#b4a7e0',        // lavender

  // Hit feedback — friendly pastels
  perfect: '#5ec4a8',  // mint
  good: '#fbbf8e',     // peach
  miss: '#f2889b',     // soft rose

  // UI
  hitZone: 'rgba(124, 107, 196, 0.12)',
  hitZoneLine: 'rgba(124, 107, 196, 0.6)',
  background: '#1a1730',
  keyWhite: '#faf7f2',
  keyBlack: '#2d2843',
  keyPressed: '#7c6bc4',
  keyExpected: 'rgba(124, 107, 196, 0.25)',
  text: '#e8e2f0',
  textDim: '#9490a3',
};

export function getNoteColor(hand: 'left' | 'right' | 'unknown', active = false): string {
  switch (hand) {
    case 'left': return active ? COLORS.leftHandActive : COLORS.leftHand;
    case 'right': return active ? COLORS.rightHandActive : COLORS.rightHand;
    default: return COLORS.unknown;
  }
}

export function getHitColor(result: 'perfect' | 'good' | 'miss'): string {
  return COLORS[result];
}
