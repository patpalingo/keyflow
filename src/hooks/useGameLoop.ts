import { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';

export function useGameLoop() {
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let frameId: number;

    const tick = (timestamp: number) => {
      const state = useGameStore.getState();

      if (state.status === 'playing') {
        if (lastTimeRef.current !== null) {
          const delta = (timestamp - lastTimeRef.current) / 1000; // seconds
          const scaledDelta = delta * state.playbackSpeed;
          const newTime = state.currentTime + scaledDelta;

          // Check if song is over — single atomic update to avoid double re-render
          const lastNote = state.gameNotes[state.gameNotes.length - 1];
          if (lastNote && newTime > lastNote.startTime + lastNote.duration + 2) {
            state.finishGame(newTime);
          } else {
            state.setCurrentTime(newTime);
          }
        }
        lastTimeRef.current = timestamp;
      } else {
        lastTimeRef.current = null;
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Handle visibility change - pause when tab is backgrounded
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        const state = useGameStore.getState();
        if (state.status === 'playing') {
          state.setStatus('paused');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);
}
