import { create } from 'zustand';
import type { ParsedSong } from '../types/midi';

interface SongState {
  song: ParsedSong | null;
  isLoading: boolean;
  error: string | null;
  setSong: (song: ParsedSong) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useSongStore = create<SongState>((set) => ({
  song: null,
  isLoading: false,
  error: null,
  setSong: (song) => set({ song, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  clear: () => set({ song: null, isLoading: false, error: null }),
}));
