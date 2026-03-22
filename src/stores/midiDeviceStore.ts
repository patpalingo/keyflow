import { create } from 'zustand';
import type { MidiDevice } from '../services/midiInput';

interface MidiDeviceState {
  devices: MidiDevice[];
  connectedDeviceId: string | null;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  error: string | null;
  setDevices: (devices: MidiDevice[]) => void;
  setConnected: (deviceId: string) => void;
  setDisconnected: () => void;
  setError: (error: string) => void;
  setConnecting: () => void;
}

export const useMidiDeviceStore = create<MidiDeviceState>((set) => ({
  devices: [],
  connectedDeviceId: null,
  connectionStatus: 'disconnected',
  error: null,
  setDevices: (devices) => set({ devices }),
  setConnected: (deviceId) => set({ connectedDeviceId: deviceId, connectionStatus: 'connected', error: null }),
  setDisconnected: () => set({ connectedDeviceId: null, connectionStatus: 'disconnected' }),
  setError: (error) => set({ error, connectionStatus: 'error' }),
  setConnecting: () => set({ connectionStatus: 'connecting' }),
}));
