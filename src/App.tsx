import { useState } from 'react';
import { useMidiConnection } from './hooks/useMidiConnection';
import { useSongStore } from './stores/songStore';
import { MidiStatus } from './components/MidiStatus';
import { DevicePicker } from './components/DevicePicker';
import { SongSelect } from './components/SongSelect';
import { GameView } from './components/GameView';
import { DEMO_SONGS } from './utils/demoSong';

type View = 'home' | 'game';

const difficultyColors: Record<string, { bg: string; text: string; emoji: string }> = {
  Beginner: { bg: '#e6f9f1', text: '#2d9b73', emoji: '🌱' },
  Easy: { bg: '#ede6fa', text: '#7c6bc4', emoji: '🎵' },
  Medium: { bg: '#fef0e4', text: '#d4845f', emoji: '🔥' },
};

function App() {
  const [view, setView] = useState<View>('home');
  const song = useSongStore((s) => s.song);
  useMidiConnection();

  const handleQuickPlay = (id: string) => {
    const entry = DEMO_SONGS.find(s => s.id === id);
    if (entry) {
      useSongStore.getState().setSong(entry.create());
      setView('game');
    }
  };

  if (view === 'game' && song) {
    return <GameView onBack={() => setView('home')} />;
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--kf-bg)' }}>
      {/* Soft gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #e0d4f5 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 -left-48 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #c4e8dc 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-24 right-1/4 w-72 h-72 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #fce4d6 0%, transparent 70%)' }}
        />
      </div>

      {/* Header */}
      <header className="relative px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight" style={{ color: 'var(--kf-text-bright)' }}>
            Key<span style={{ color: 'var(--kf-accent)' }}>Flow</span>
            <span className="ml-2 text-lg">🎹</span>
          </h1>
          <p className="text-sm mt-0.5 font-medium" style={{ color: 'var(--kf-text-dim)' }}>
            Learn piano the fun way
          </p>
        </div>
        <MidiStatus />
      </header>

      {/* Main content */}
      <main className="relative max-w-2xl mx-auto px-8 py-8 space-y-12">

        {/* MIDI Connection */}
        <section className="animate-fade-up" style={{ animationDelay: '0.05s' }}>
          <SectionHeading emoji="🎹">Keyboard</SectionHeading>
          <DevicePicker />
        </section>

        {/* Quick Play Songs */}
        <section className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <SectionHeading emoji="⚡">Quick Play</SectionHeading>
          <div className="grid grid-cols-2 gap-4">
            {DEMO_SONGS.map((entry) => {
              const dc = difficultyColors[entry.difficulty] ?? difficultyColors.Easy;
              return (
                <button
                  key={entry.id}
                  onClick={() => handleQuickPlay(entry.id)}
                  className="playful-card text-left rounded-2xl p-5 group"
                  style={{
                    background: 'var(--kf-surface)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)',
                  }}
                >
                  <div
                    className="font-display font-bold text-base group-hover:text-[var(--kf-accent)] transition-colors"
                    style={{ color: 'var(--kf-text-bright)' }}
                  >
                    {entry.name}
                  </div>
                  <div className="flex items-center gap-2.5 mt-3">
                    <span
                      className="text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full"
                      style={{ background: dc.bg, color: dc.text }}
                    >
                      {dc.emoji} {entry.difficulty}
                    </span>
                    <span className="text-xs font-mono" style={{ color: 'var(--kf-text-dim)' }}>
                      {entry.noteCount} notes
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Load your own */}
        <section className="animate-fade-up" style={{ animationDelay: '0.25s' }}>
          <SectionHeading emoji="📂">Load Your Own</SectionHeading>
          <SongSelect />
        </section>

        {/* Play button for loaded MIDI files */}
        {song && (
          <div className="flex justify-center animate-fade-up">
            <button
              onClick={() => setView('game')}
              className="font-display font-bold text-lg px-10 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background: 'linear-gradient(135deg, var(--kf-accent), #9b8ee0)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(124, 107, 196, 0.3)',
              }}
            >
              🎮 Start Playing
            </button>
          </div>
        )}

        {/* MIDI Song Sources */}
        <section className="animate-fade-up" style={{ animationDelay: '0.35s' }}>
          <SectionHeading emoji="🔍">Find More Songs</SectionHeading>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Mutopia Project', desc: 'Free classical sheet music with MIDI', url: 'https://www.mutopiaproject.org/' },
              { name: 'piano-midi.de', desc: 'Classical piano MIDI (Chopin, Bach...)', url: 'https://www.piano-midi.de/' },
              { name: 'MIDI World', desc: 'Categorized MIDI file library', url: 'https://www.midiworld.com/classic.htm' },
              { name: 'FreeMIDI', desc: 'Pop, rock & modern songs as MIDI', url: 'https://freemidi.org/' },
            ].map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="playful-card rounded-xl px-4 py-3.5 block group"
                style={{
                  background: 'var(--kf-surface)',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.03)',
                }}
              >
                <div className="font-display font-bold text-sm flex items-center gap-1.5" style={{ color: 'var(--kf-text-bright)' }}>
                  {link.name}
                  <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: 'var(--kf-text-dim)' }} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 9L9 3M9 3H4M9 3V8" />
                  </svg>
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--kf-text-dim)' }}>{link.desc}</div>
              </a>
            ))}
          </div>
          <p className="text-xs mt-3 text-center" style={{ color: 'var(--kf-text-dim)' }}>
            Download .mid files from these sites, then drop them above ☝️
          </p>
        </section>

        {/* Footer */}
        <footer className="text-center pb-8">
          <p className="text-xs font-medium" style={{ color: 'var(--kf-text-dim)', opacity: 0.6 }}>
            Works best in Chrome or Edge 🌐
          </p>
        </footer>
      </main>
    </div>
  );
}

function SectionHeading({ children, emoji }: { children: React.ReactNode; emoji?: string }) {
  return (
    <h2
      className="font-display text-xl font-bold mb-4"
      style={{ color: 'var(--kf-text-bright)' }}
    >
      {emoji && <span className="mr-2">{emoji}</span>}{children}
    </h2>
  );
}

export default App;
