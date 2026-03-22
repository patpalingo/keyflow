import { useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useSongStore } from '../stores/songStore';
import { scheduleNotes } from '../services/noteScheduler';
import { scheduleSong, startPlayback, stopPlayback, clearSchedule } from '../services/audioPlayback';
import { useGameLoop } from '../hooks/useGameLoop';
import { GameCanvas } from './GameCanvas';
import { GameHUD } from './GameHUD';
import { GameControls } from './GameControls';
import { GameOverModal } from './GameOverModal';
import { COUNTDOWN_SECONDS } from '../engine/constants';

let startGameGeneration = 0;

export function GameView({ onBack }: { onBack: () => void }) {
  const song = useSongStore((s) => s.song);
  const status = useGameStore((s) => s.status);
  const initGame = useGameStore((s) => s.initGame);
  const setStatus = useGameStore((s) => s.setStatus);
  const setCountdown = useGameStore((s) => s.setCountdown);
  const reset = useGameStore((s) => s.reset);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useGameLoop();

  const cleanupGame = useCallback(() => {
    // Increment generation to invalidate any in-flight startGame
    startGameGeneration++;
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    stopPlayback();
    clearSchedule();
  }, []);

  const startGame = useCallback(async () => {
    if (!song) return;

    cleanupGame();

    // Capture the generation at the start of this invocation
    const myGeneration = startGameGeneration;

    const notes = scheduleNotes(song);
    initGame(notes);

    const speed = useGameStore.getState().playbackSpeed;
    await scheduleSong(song, speed);

    // If a newer startGame was called while we were awaiting, bail
    if (myGeneration !== startGameGeneration) return;

    let count = COUNTDOWN_SECONDS;
    setCountdown(count);

    countdownRef.current = setInterval(() => {
      // Check if this interval belongs to the current generation
      if (myGeneration !== startGameGeneration) {
        clearInterval(countdownRef.current!);
        countdownRef.current = null;
        return;
      }
      count--;
      if (count <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        countdownRef.current = null;
        setCountdown(0);
        setStatus('playing');
        startPlayback();
      } else {
        setCountdown(count);
      }
    }, 1000);
  }, [song, initGame, setStatus, setCountdown, cleanupGame]);

  useEffect(() => {
    startGame();
    return cleanupGame;
  }, []);

  const handlePlayAgain = useCallback(() => {
    cleanupGame();
    reset();
    startGame();
  }, [startGame, reset, cleanupGame]);

  const handleSelectSong = useCallback(() => {
    cleanupGame();
    reset();
    onBack();
  }, [onBack, reset, cleanupGame]);

  return (
    <div className="relative w-full h-screen" style={{ background: '#1a1730' }}>
      <GameCanvas />
      <GameHUD />
      <GameControls />

      {status === 'finished' && (
        <GameOverModal
          onPlayAgain={handlePlayAgain}
          onSelectSong={handleSelectSong}
        />
      )}

      <button
        onClick={handleSelectSong}
        className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-bold tracking-wide z-20 pointer-events-auto px-5 py-2 rounded-full transition-all duration-200 hover:scale-105"
        style={{
          background: 'rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(8px)',
        }}
      >
        ← Back to Songs
      </button>
    </div>
  );
}
