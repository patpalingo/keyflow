import { useGameStore } from '../stores/gameStore';
import { startPlayback, pausePlayback, stopPlayback, setPlaybackSpeed } from '../services/audioPlayback';
import { LOOK_AHEAD_SECONDS } from '../engine/constants';
import { SpeedSelector } from './SpeedSelector';

export function GameControls() {
  const status = useGameStore((s) => s.status);
  const playbackSpeed = useGameStore((s) => s.playbackSpeed);
  const setStatus = useGameStore((s) => s.setStatus);
  const setSpeed = useGameStore((s) => s.setPlaybackSpeed);
  const setCurrentTime = useGameStore((s) => s.setCurrentTime);

  const handlePlayPause = () => {
    if (status === 'playing') {
      setStatus('paused');
      pausePlayback();
    } else if (status === 'paused') {
      setStatus('playing');
      startPlayback();
    }
  };

  const handleRestart = () => {
    stopPlayback();
    setCurrentTime(-LOOK_AHEAD_SECONDS);
    setStatus('countdown');
  };

  const handleSpeedChange = (speed: number) => {
    setSpeed(speed);
    setPlaybackSpeed(speed);
  };

  if (status !== 'playing' && status !== 'paused') return null;

  const btnStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    backdropFilter: 'blur(12px)',
  };

  return (
    <div className="absolute bottom-[14%] left-0 right-0 flex justify-center gap-3 pointer-events-auto">
      <button
        onClick={handlePlayPause}
        className="px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 hover:scale-105 active:scale-95"
        style={btnStyle}
      >
        {status === 'playing' ? '⏸ Pause' : '▶ Resume'}
      </button>

      <button
        onClick={handleRestart}
        className="px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 hover:scale-105 active:scale-95"
        style={btnStyle}
      >
        🔄 Restart
      </button>

      <div
        className="px-4 py-2 rounded-full"
        style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
      >
        <SpeedSelector value={playbackSpeed} onChange={handleSpeedChange} variant="dark" />
      </div>
    </div>
  );
}
