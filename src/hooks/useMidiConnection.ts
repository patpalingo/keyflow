import { useEffect, useCallback } from 'react';
import { useMidiDeviceStore } from '../stores/midiDeviceStore';
import { useGameStore } from '../stores/gameStore';
import {
  requestMidiAccess,
  connectToDevice,
  disconnectDevice,
  onNoteOn,
  onNoteOff,
  onDeviceChange,
} from '../services/midiInput';
import { evaluateHit } from '../services/scoringEngine';
import { addHitEffect } from '../engine/EffectsRenderer';

export function useMidiConnection() {
  const { setDevices, setConnected, setDisconnected, setError, setConnecting } = useMidiDeviceStore();

  useEffect(() => {
    requestMidiAccess()
      .then((devices) => {
        setDevices(devices);
        // Auto-connect if there's exactly one device
        if (devices.length === 1) {
          connect(devices[0].id);
        }
      })
      .catch((err) => {
        setError(err.message);
      });

    onDeviceChange((devices) => {
      setDevices(devices);
    });

    // Wire up MIDI note callbacks to game store
    onNoteOn((note, _velocity, _timestamp) => {
      const gameState = useGameStore.getState();
      gameState.addActiveNote(note);

      if (gameState.status === 'playing') {
        const hit = evaluateHit(note, gameState.currentTime, gameState.gameNotes, gameState.currentTime);
        if (hit) {
          gameState.recordHit(hit.result);
          addHitEffect(note, hit.result);
        }
      }
    });

    onNoteOff((note) => {
      useGameStore.getState().removeActiveNote(note);
    });
  }, []);

  const connect = useCallback((deviceId: string) => {
    setConnecting();
    const success = connectToDevice(deviceId);
    if (success) {
      setConnected(deviceId);
    } else {
      setError('Failed to connect to device');
    }
  }, []);

  const disconnect = useCallback(() => {
    disconnectDevice();
    setDisconnected();
  }, []);

  return { connect, disconnect };
}
