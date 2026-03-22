import { useMidiDeviceStore } from '../stores/midiDeviceStore';
import { useMidiConnection } from '../hooks/useMidiConnection';

export function DevicePicker() {
  const { devices, connectedDeviceId, connectionStatus, error } = useMidiDeviceStore();
  const { connect, disconnect } = useMidiConnection();

  if (error) {
    return (
      <div
        className="rounded-2xl px-5 py-4 text-sm"
        style={{ background: 'var(--kf-surface)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}
      >
        <p className="font-semibold" style={{ color: 'var(--kf-text-bright)' }}>{error}</p>
        <p className="mt-1.5 text-xs" style={{ color: 'var(--kf-text-dim)' }}>
          {error.includes('not supported')
            ? 'Please use Chrome or Edge browser.'
            : 'You can still load a MIDI file and play without a keyboard.'}
        </p>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div
        className="rounded-2xl px-5 py-4 text-sm"
        style={{ background: 'var(--kf-surface)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', color: 'var(--kf-text-dim)' }}
      >
        No MIDI devices found. Connect your keyboard via USB and refresh.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={connectedDeviceId ?? ''}
        onChange={(e) => e.target.value ? connect(e.target.value) : disconnect()}
        className="rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 transition-shadow"
        style={{
          background: 'var(--kf-surface)',
          border: 'none',
          boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
          color: 'var(--kf-text)',
          '--tw-ring-color': 'var(--kf-accent)',
        } as React.CSSProperties}
      >
        <option value="">Select device...</option>
        {devices.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name} {d.manufacturer ? `(${d.manufacturer})` : ''}
          </option>
        ))}
      </select>

      {connectionStatus === 'connected' && (
        <button
          onClick={disconnect}
          className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-200 hover:bg-[var(--kf-surface-2)]"
          style={{ color: 'var(--kf-text-dim)' }}
        >
          Disconnect
        </button>
      )}
    </div>
  );
}
