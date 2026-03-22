import { useCallback, useRef, useState } from 'react';
import { useSongStore } from '../stores/songStore';
import { useSongLoader } from '../hooks/useSongLoader';

export function SongSelect() {
  const { song, isLoading, error } = useSongStore();
  const { loadFile } = useSongLoader();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file.name.endsWith('.mid') || file.name.endsWith('.midi') || file.type === 'audio/midi') {
      loadFile(file);
    }
  }, [loadFile]);

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        className="rounded-2xl p-8 text-center cursor-pointer transition-all duration-300"
        style={{
          background: isDragging ? 'var(--kf-surface-2)' : 'var(--kf-surface)',
          border: `2px dashed ${isDragging ? 'var(--kf-accent)' : 'var(--kf-border)'}`,
          boxShadow: isDragging ? '0 4px 20px rgba(124, 107, 196, 0.12)' : '0 1px 6px rgba(0,0,0,0.03)',
        }}
      >
        <div className="text-3xl mb-2">🎶</div>
        <p className="text-sm font-semibold" style={{ color: 'var(--kf-text-bright)' }}>
          {isLoading ? 'Loading...' : 'Drop a MIDI file here or click to browse'}
        </p>
        <p className="text-xs mt-1.5" style={{ color: 'var(--kf-text-dim)' }}>
          .mid and .midi files
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".mid,.midi,audio/midi"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {error && (
        <div
          className="px-4 py-3 rounded-xl text-sm font-medium"
          style={{ background: '#fef0ee', color: 'var(--kf-rose)' }}
        >
          {error}
        </div>
      )}

      {song && (
        <div
          className="rounded-2xl p-5 space-y-3 animate-fade-up"
          style={{ background: 'var(--kf-surface)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
          <h3 className="font-display text-lg font-bold" style={{ color: 'var(--kf-text-bright)' }}>
            🎵 {song.name}
          </h3>
          <div className="flex flex-wrap gap-3 text-xs font-mono" style={{ color: 'var(--kf-text-dim)' }}>
            <Pill>{formatDuration(song.durationSeconds)}</Pill>
            <Pill>{song.allNotes.length} notes</Pill>
            <Pill>{song.bpm} bpm</Pill>
            <Pill>{song.tracks.length} track{song.tracks.length !== 1 ? 's' : ''}</Pill>
            <Pill>{song.timeSignature[0]}/{song.timeSignature[1]}</Pill>
          </div>
          {song.tracks.map((t, i) => (
            <div key={i} className="text-xs" style={{ color: 'var(--kf-text-dim)' }}>
              {t.name}: {t.notes.length} notes ({t.hand})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{ background: 'var(--kf-surface-2)', color: 'var(--kf-text)' }}
    >
      {children}
    </span>
  );
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
