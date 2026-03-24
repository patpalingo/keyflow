import { create } from 'zustand';
import type { GameNote, GameState, HitResult } from '../types/game';
import { getScoreForHit } from '../services/scoringEngine';
import { LOOK_AHEAD_SECONDS } from '../engine/constants';

interface GameStoreState extends GameState {
  gameNotes: GameNote[];
  learningMode: boolean;
  waitMode: boolean;
  wrongNotes: Map<number, number>; // midiNote -> timestamp
  // Actions
  initGame: (notes: GameNote[]) => void;
  setStatus: (status: GameState['status']) => void;
  setCurrentTime: (time: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setLearningMode: (on: boolean) => void;
  setWaitMode: (on: boolean) => void;
  addWrongNote: (midi: number) => void;
  addActiveNote: (midi: number) => void;
  removeActiveNote: (midi: number) => void;
  recordHit: (result: HitResult) => void;
  recordMiss: () => void;
  finishGame: (finalTime: number) => void;
  setCountdown: (value: number) => void;
  reset: () => void;
}

const savedSpeed = parseFloat(localStorage.getItem('kf-playback-speed') || '1');
const savedLearning = localStorage.getItem('kf-learning-mode') === 'true';
const savedWait = localStorage.getItem('kf-wait-mode') === 'true';

const initialState: GameState & { gameNotes: GameNote[]; learningMode: boolean; waitMode: boolean; wrongNotes: Map<number, number> } = {
  status: 'idle',
  currentTime: 0,
  playbackSpeed: savedSpeed,
  score: 0,
  combo: 0,
  maxCombo: 0,
  hitCounts: { perfect: 0, good: 0, miss: 0 },
  activeInputNotes: new Set(),
  countdownValue: 0,
  gameNotes: [],
  learningMode: savedLearning,
  waitMode: savedWait,
  wrongNotes: new Map(),
};

export const useGameStore = create<GameStoreState>((set, get) => ({
  ...initialState,

  initGame: (notes) => {
    const state = get();
    set({
      ...initialState,
      playbackSpeed: state.playbackSpeed,
      learningMode: state.learningMode,
      waitMode: state.waitMode,
      gameNotes: notes,
      status: 'countdown',
      currentTime: -LOOK_AHEAD_SECONDS,
      activeInputNotes: new Set(),
      wrongNotes: new Map(),
    });
  },

  setStatus: (status) => set({ status }),

  setCurrentTime: (time) => set({ currentTime: time }),

  setPlaybackSpeed: (speed) => {
    localStorage.setItem('kf-playback-speed', String(speed));
    set({ playbackSpeed: speed });
  },

  setLearningMode: (on) => {
    localStorage.setItem('kf-learning-mode', String(on));
    set({ learningMode: on });
  },

  setWaitMode: (on) => {
    localStorage.setItem('kf-wait-mode', String(on));
    set({ waitMode: on });
  },

  addWrongNote: (midi) => {
    const wrongNotes = new Map(get().wrongNotes);
    wrongNotes.set(midi, performance.now());
    set({ wrongNotes });
  },

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

  reset: () => {
    const state = get();
    set({
      ...initialState,
      playbackSpeed: state.playbackSpeed,
      learningMode: state.learningMode,
      waitMode: state.waitMode,
      activeInputNotes: new Set(),
      wrongNotes: new Map(),
    });
  },
}));
