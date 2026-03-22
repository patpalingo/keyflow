import { useGameStore } from '../stores/gameStore';

export function GameHUD() {
  const score = useGameStore((s) => s.score);
  const combo = useGameStore((s) => s.combo);
  const hitCounts = useGameStore((s) => s.hitCounts);
  const status = useGameStore((s) => s.status);

  if (status !== 'playing' && status !== 'paused') return null;

  const total = hitCounts.perfect + hitCounts.good + hitCounts.miss;
  const accuracy = total > 0
    ? Math.round(((hitCounts.perfect + hitCounts.good * 0.5) / total) * 100)
    : 100;

  return (
    <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-start pointer-events-none">
      {/* Left: Score */}
      <div
        className="px-4 py-3 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
      >
        <div
          className="font-display text-3xl font-bold tracking-tight"
          style={{ color: '#fff' }}
        >
          {score.toLocaleString()}
        </div>
        <div className="text-[11px] font-semibold tracking-wide mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {accuracy}% accuracy
        </div>
      </div>

      {/* Right: Combo + Counts */}
      <div className="text-right">
        {combo > 1 && (
          <div
            className="px-4 py-2 rounded-2xl mb-2 inline-block"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
          >
            <span className="font-display text-2xl font-bold" style={{ color: '#fbbf8e' }}>
              {combo}x
            </span>
          </div>
        )}
        <div
          className="flex gap-3 text-[11px] font-bold tracking-wide px-3 py-2 rounded-full justify-end"
          style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
        >
          <span style={{ color: '#6ee7b7' }}>{hitCounts.perfect}</span>
          <span style={{ color: '#fbbf8e' }}>{hitCounts.good}</span>
          <span style={{ color: '#fca5a5' }}>{hitCounts.miss}</span>
        </div>
      </div>
    </div>
  );
}
