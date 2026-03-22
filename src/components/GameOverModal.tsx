import { useGameStore } from '../stores/gameStore';
import { useSongStore } from '../stores/songStore';

export function GameOverModal({ onPlayAgain, onSelectSong }: {
  onPlayAgain: () => void;
  onSelectSong: () => void;
}) {
  const score = useGameStore((s) => s.score);
  const maxCombo = useGameStore((s) => s.maxCombo);
  const hitCounts = useGameStore((s) => s.hitCounts);
  const playbackSpeed = useGameStore((s) => s.playbackSpeed);
  const song = useSongStore((s) => s.song);

  const total = hitCounts.perfect + hitCounts.good + hitCounts.miss;
  const accuracy = total > 0
    ? Math.round(((hitCounts.perfect + hitCounts.good * 0.5) / total) * 100)
    : 0;

  let grade = 'F';
  if (accuracy >= 95) grade = 'S';
  else if (accuracy >= 90) grade = 'A';
  else if (accuracy >= 80) grade = 'B';
  else if (accuracy >= 70) grade = 'C';
  else if (accuracy >= 60) grade = 'D';

  const gradeConfig: Record<string, { color: string; bg: string; emoji: string }> = {
    S: { color: '#f59e0b', bg: '#fef3c7', emoji: '🌟' },
    A: { color: '#10b981', bg: '#d1fae5', emoji: '🎉' },
    B: { color: '#7c6bc4', bg: '#ede6fa', emoji: '👏' },
    C: { color: '#6b7280', bg: '#f3f4f6', emoji: '👍' },
    D: { color: '#f4845f', bg: '#fef0e4', emoji: '💪' },
    F: { color: '#f2889b', bg: '#fef0ee', emoji: '🎯' },
  };

  const gc = gradeConfig[grade];

  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-10 animate-scale-in"
      style={{ background: '#faf7f2' }}
    >
      <div
        className="max-w-sm w-full mx-4 p-8 text-center rounded-3xl"
        style={{
          background: '#fff',
          boxShadow: '0 24px 64px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
        }}
      >
        {/* Title */}
        <p className="text-sm font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--kf-text-dim)' }}>
          Song Complete!
        </p>

        {song && (
          <h2 className="font-display text-xl font-bold mb-6" style={{ color: 'var(--kf-text-bright)' }}>
            {song.name}
          </h2>
        )}

        {/* Grade */}
        <div
          className="inline-flex items-center justify-center w-28 h-28 rounded-3xl mb-3"
          style={{ background: gc.bg }}
        >
          <div className="text-center">
            <div className="text-lg">{gc.emoji}</div>
            <div
              className="font-display text-5xl font-bold leading-none"
              style={{ color: gc.color }}
            >
              {grade}
            </div>
          </div>
        </div>

        {/* Score */}
        <div className="font-display text-3xl font-bold mb-6" style={{ color: 'var(--kf-text-bright)' }}>
          {score.toLocaleString()}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <StatCell value={hitCounts.perfect} label="Perfect" color="#10b981" bg="#d1fae5" />
          <StatCell value={hitCounts.good} label="Good" color="#f59e0b" bg="#fef3c7" />
          <StatCell value={hitCounts.miss} label="Miss" color="#f2889b" bg="#fef0ee" />
        </div>

        <div className="flex justify-center gap-4 text-xs font-bold mb-8" style={{ color: 'var(--kf-text-dim)' }}>
          <span>{accuracy}%</span>
          <span>{maxCombo}x combo</span>
          <span>{playbackSpeed}x speed</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onPlayAgain}
            className="px-7 py-3 rounded-2xl font-bold text-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, var(--kf-accent), #9b8ee0)',
              color: '#fff',
              boxShadow: '0 4px 16px rgba(124, 107, 196, 0.25)',
            }}
          >
            🔄 Play Again
          </button>
          <button
            onClick={onSelectSong}
            className="px-7 py-3 rounded-2xl font-bold text-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: 'var(--kf-surface-2)',
              color: 'var(--kf-text)',
            }}
          >
            🎵 New Song
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCell({ value, label, color, bg }: { value: number; label: string; color: string; bg: string }) {
  return (
    <div className="py-4 px-3 rounded-xl" style={{ background: bg }}>
      <div className="font-display text-xl font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide font-bold mt-1" style={{ color: 'var(--kf-text-dim)' }}>{label}</div>
    </div>
  );
}
