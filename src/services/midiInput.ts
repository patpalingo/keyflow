export type MIDINoteCallback = (note: number, velocity: number, timestamp: number) => void;

export interface MidiDevice {
  id: string;
  name: string;
  manufacturer: string;
}

let midiAccess: MIDIAccess | null = null;
let activeInput: MIDIInput | null = null;
let noteOnCallback: MIDINoteCallback | null = null;
let noteOffCallback: MIDINoteCallback | null = null;
let stateChangeCallback: ((devices: MidiDevice[]) => void) | null = null;

function handleMIDIMessage(event: MIDIMessageEvent) {
  const data = event.data;
  if (!data || data.length < 3) return;

  const status = data[0] & 0xf0;
  const note = data[1];
  const velocity = data[2];
  const timestamp = event.timeStamp ?? performance.now();

  if (status === 0x90 && velocity > 0) {
    // Note On
    noteOnCallback?.(note, velocity, timestamp);
  } else if (status === 0x80 || (status === 0x90 && velocity === 0)) {
    // Note Off (or Note On with velocity 0 — Roland FP-10 does this)
    noteOffCallback?.(note, 0, timestamp);
  }
}

function getDeviceList(): MidiDevice[] {
  if (!midiAccess) return [];
  const devices: MidiDevice[] = [];
  midiAccess.inputs.forEach((input) => {
    devices.push({
      id: input.id,
      name: input.name ?? 'Unknown MIDI Device',
      manufacturer: input.manufacturer ?? '',
    });
  });
  return devices;
}

export async function requestMidiAccess(): Promise<MidiDevice[]> {
  if (!navigator.requestMIDIAccess) {
    throw new Error('Web MIDI API not supported. Please use Chrome or Edge.');
  }

  midiAccess = await navigator.requestMIDIAccess({ sysex: false });

  midiAccess.onstatechange = () => {
    stateChangeCallback?.(getDeviceList());
  };

  return getDeviceList();
}

export function connectToDevice(deviceId: string): boolean {
  if (!midiAccess) return false;

  // Disconnect previous
  if (activeInput) {
    activeInput.onmidimessage = null;
    activeInput = null;
  }

  const input = midiAccess.inputs.get(deviceId);
  if (!input) return false;

  input.onmidimessage = handleMIDIMessage;
  activeInput = input;
  return true;
}

export function disconnectDevice(): void {
  if (activeInput) {
    activeInput.onmidimessage = null;
    activeInput = null;
  }
}

export function onNoteOn(cb: MIDINoteCallback): void {
  noteOnCallback = cb;
}

export function onNoteOff(cb: MIDINoteCallback): void {
  noteOffCallback = cb;
}

export function onDeviceChange(cb: (devices: MidiDevice[]) => void): void {
  stateChangeCallback = cb;
}

export function getConnectedDeviceName(): string | null {
  return activeInput?.name ?? null;
}
