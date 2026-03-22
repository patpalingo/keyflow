import { create } from 'zustand';
import type { GameNote, GameState, HitResult } from '../types/game';
import { getScoreForHit } from '../services/scoringEngine';

interface GameStoreState extends GameState {
  gameNotes: GameNote[];
  // Actions
  initGame: (notes: GameNote[]) => void;
  setStatus: (status: GameState['status']) => void;
  setCurrentTime: (time: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  addActiveNote: (midi: number) => void;
  removeActiveNote: (midi: number) => void;
  recordHit: (result: HitResult) => void;
  recordMiss: () => void;
  finishGame: (finalTime: number) => void;
  setCountdown: (value: number) => void;
  reset: () => void;
}

const initialState: GameState & { gameNotes: GameNote[] } = {
  status: 'idle',
  currentTime: 0,
  playbackSpeed: 1.0,
  score: 0,
  combo: 0,
  maxCombo: 0,
  hitCounts: { perfect: 0, good: 0, miss: 0 },
  activeInputNotes: new Set(),
  countdownValue: 0,
  gameNotes: [],
};

export const useGameStore = create<GameStoreState>((set, get) => ({
  ...initialState,

  initGame: (notes) => set({
    ...initialState,
    gameNotes: notes,
    status: 'countdown',
    activeInputNotes: new Set(),
  }),

  setStatus: (status) => set({ status }),

  setCurrentTime: (time) => set({ currentTime: time }),

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  addActiveNote: (midi) => {
    const notes = new Set(get().activeInputNotes);
    notes.add(midi);
    set({ activeInputNotes: notes });
  },

  removeActiveNote: (midi) => {
    const notes = new Set(get().activeInputNotes);
    notes.delete(midi);
    set({ activeInputNotes: notes });
  },

  recordHit: (result) => {
    const state = get();
    const combo = result === 'miss' ? 0 : state.combo + 1;
    const points = getScoreForHit(result, combo);
    set({
      score: state.score + points,
      combo,
      maxCombo: Math.max(state.maxCombo, combo),
      hitCounts: {
        ...state.hitCounts,
        [result]: state.hitCounts[result] + 1,
      },
    });
  },

  recordMiss: () => {
    const state = get();
    set({
      combo: 0,
      hitCounts: {
        ...state.hitCounts,
        miss: state.hitCounts.miss + 1,
      },
    });
  },

  finishGame: (finalTime) => set({ currentTime: finalTime, status: 'finished' }),

  setCountdown: (value) => set({ countdownValue: value }),

  reset: () => set({ ...initialState, activeInputNotes: new Set() }),
}));
