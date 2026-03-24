const SPEED_PRESETS = [0.25, 0.5, 0.75, 1] as const;

interface SpeedSelectorProps {
  value: number;
  onChange: (speed: number) => void;
  variant?: 'light' | 'dark';
}

export function SpeedSelector({ value, onChange, variant = 'light' }: SpeedSelectorProps) {
  const isLight = variant === 'light';

  return (
    <div className="flex items-center gap-2">
      <span
        className="text-[11px] font-bold uppercase tracking-wide mr-1"
        style={{ color: isLight ? 'var(--kf-text-dim)' : 'rgba(255,255,255,0.5)' }}
      >
        Speed
      </span>
      {SPEED_PRESETS.map((speed) => {
        const isActive = Math.abs(value - speed) < 0.01;
        return (
          <button
            key={speed}
            onClick={() => onChange(speed)}
            className="px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 hover:scale-105 active:scale-95"
            style={
              isActive
                ? {
                    background: isLight
                      ? 'var(--kf-accent)'
                      : 'rgba(124, 107, 196, 0.9)',
                    color: '#fff',
                  }
                : {
                    background: isLight
                      ? 'var(--kf-surface)'
                      : 'rgba(255,255,255,0.12)',
                    color: isLight ? 'var(--kf-text-bright)' : 'rgba(255,255,255,0.7)',
                    boxShadow: isLight ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                  }
            }
          >
            {speed === 1 ? '1x' : `${speed}x`}
          </button>
        );
      })}
    </div>
  );
}
