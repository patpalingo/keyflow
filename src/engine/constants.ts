// Canvas layout constants
export const KEYBOARD_HEIGHT_RATIO = 0.12;  // Bottom 12% of canvas = piano
export const HIT_ZONE_Y_RATIO = 1 - KEYBOARD_HEIGHT_RATIO; // Just above the keyboard
export const LOOK_AHEAD_SECONDS = 3;  // How many seconds of notes to show above hit zone

// Timing
export const COUNTDOWN_SECONDS = 3;
export const PRE_ROLL_SECONDS = 1; // Extra second before first note

// Visual
export const NOTE_BORDER_RADIUS = 4;
export const NOTE_MIN_HEIGHT = 8;
export const HIT_ZONE_HEIGHT = 4;
export const EFFECT_DURATION_MS = 400;

// Scoring
export const PERFECT_WINDOW = 0.05;
export const GOOD_WINDOW = 0.12;
