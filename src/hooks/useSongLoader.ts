import { useCallback } from 'react';
import { useSongStore } from '../stores/songStore';
import { parseMidiFile } from '../services/midiParser';

export function useSongLoader() {
  const { setSong, setLoading, setError } = useSongStore();

  const loadFile = useCallback(async (file: File) => {
    setLoading(true);
    try {
      const song = await parseMidiFile(file);
      setSong(song);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse MIDI file');
    }
  }, []);

  return { loadFile };
}
