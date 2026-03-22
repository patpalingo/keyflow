import type { ParsedNote } from './midi';

export type HitResult = 'perfect' | 'good' | 'miss';
export type NoteState = 'upcoming' | 'active' | 'hit' | 'missed';
export type GameStatus = 'idle' | 'loading' | 'countdown' | 'playing' | 'paused' | 'finished';

export interface GameNote extends ParsedNote {
  id: string;
  state: NoteState;
  hitResult?: HitResult;
}

export interface GameState {
  status: GameStatus;
  currentTime: number;
  playbackSpeed: number;
  score: number;
  combo: number;
  maxCombo: number;
  hitCounts: { perfect: number; good: number; miss: number };
  activeInputNotes: Set<number>;
  countdownValue: number;
}

export interface UserProfile {
  name: string;
  scores: ScoreRecord[];
}

export interface ScoreRecord {
  songName: string;
  score: number;
  accuracy: number;
  maxCombo: number;
  date: string;
  speed: number;
}
