import { useGameStore } from '../stores/gameStore';
import { startPlayback, pausePlayback, stopPlayback, setPlaybackSpeed } from '../services/audioPlayback';

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
    setCurrentTime(0);
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
        className="flex items-center gap-3 px-5 py-2.5 rounded-full"
        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}
      >
        <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.6)' }}>Speed</span>
        <input
          type="range"
          min="0.25"
          max="1"
          step="0.05"
          value={playbackSpeed}
          onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
          className="w-16"
        />
        <span className="text-xs font-mono font-bold w-7" style={{ color: '#fbbf8e' }}>
          {playbackSpeed}x
        </span>
      </div>
    </div>
  );
}
