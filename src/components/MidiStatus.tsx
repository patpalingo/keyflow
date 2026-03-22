import { useMidiDeviceStore } from '../stores/midiDeviceStore';

export function MidiStatus() {
  const { connectionStatus, devices, connectedDeviceId } = useMidiDeviceStore();
  const connectedDevice = devices.find(d => d.id === connectedDeviceId);

  const configs = {
    disconnected: { color: 'var(--kf-text-dim)', bg: 'var(--kf-surface)', dot: '#c4c0d0', label: 'No device' },
    connecting: { color: 'var(--kf-accent)', bg: 'var(--kf-surface-2)', dot: 'var(--kf-accent)', label: 'Connecting...' },
    connected: { color: 'var(--kf-mint)', bg: '#e6f9f1', dot: 'var(--kf-mint)', label: connectedDevice?.name ?? 'Connected' },
    error: { color: 'var(--kf-text-dim)', bg: 'var(--kf-surface)', dot: '#c4c0d0', label: 'MIDI unavailable' },
  };

  const { color, bg, dot, label } = configs[connectionStatus];

  return (
    <div
      className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-full"
      style={{ color, background: bg }}
    >
      <div
        className="w-2 h-2 rounded-full"
        style={{
          background: dot,
          boxShadow: connectionStatus === 'connected' ? `0 0 8px ${dot}` : 'none',
        }}
      />
      <span>{label}</span>
    </div>
  );
}
