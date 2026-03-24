import { useState } from 'react';
import { useMidiConnection } from './hooks/useMidiConnection';
import { useSongStore } from './stores/songStore';
import { useGameStore } from './stores/gameStore';
import { MidiStatus } from './components/MidiStatus';
import { DevicePicker } from './components/DevicePicker';
import { SongSelect } from './components/SongSelect';
import { GameView } from './components/GameView';
import { SpeedSelector } from './components/SpeedSelector';
import { DEMO_SONGS } from './utils/demoSong';
import { setPlaybackSpeed as setAudioSpeed } from './services/audioPlayback';

type View = 'home' | 'game';

const difficultyColors: Record<string, { bg: string; text: string; emoji: string }> = {
  Beginner: { bg: '#e6f9f1', text: '#2d9b73', emoji: '🌱' },
  Easy: { bg: '#ede6fa', text: '#7c6bc4', emoji: '🎵' },
  Medium: { bg: '#fef0e4', text: '#d4845f', emoji: '🔥' },
};

function App() {
  const [view, setView] = useState<View>('home');
  const song = useSongStore((s) => s.song);
  const playbackSpeed = useGameStore((s) => s.playbackSpeed);
  const learningMode = useGameStore((s) => s.learningMode);
  const waitMode = useGameStore((s) => s.waitMode);
  const setSpeed = useGameStore((s) => s.setPlaybackSpeed);
  const setLearningMode = useGameStore((s) => s.setLearningMode);
  const setWaitMode = useGameStore((s) => s.setWaitMode);
  useMidiConnection();

  const handleSpeedChange = (speed: number) => {
    setSpeed(speed);
    setAudioSpeed(speed);
  };

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

        {/* Settings */}
        <section className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <SectionHeading emoji="⚙️">Settings</SectionHeading>
          <div
            className="rounded-2xl p-5 space-y-5"
            style={{
              background: 'var(--kf-surface)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            {/* Speed */}
            <div>
              <SpeedSelector value={playbackSpeed} onChange={handleSpeedChange} variant="light" />
            </div>

            {/* Learning Mode */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display font-bold text-sm" style={{ color: 'var(--kf-text-bright)' }}>
                  Learning Mode
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--kf-text-dim)' }}>
                  Note names, hand labels on falling notes
                </div>
              </div>
              <button
                onClick={() => setLearningMode(!learningMode)}
                className="relative w-12 h-7 rounded-full transition-colors duration-200"
                style={{ background: learningMode ? 'var(--kf-accent)' : '#d4cce2' }}
              >
                <div
                  className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ transform: learningMode ? 'translateX(22px)' : 'translateX(4px)' }}
                />
              </button>
            </div>

            {/* Wait Mode (only when learning mode is on) */}
            {learningMode && (
              <div className="flex items-center justify-between pl-4 border-l-2" style={{ borderColor: 'var(--kf-accent)' }}>
                <div>
                  <div className="font-display font-bold text-sm" style={{ color: 'var(--kf-text-bright)' }}>
                    Wait Mode
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--kf-text-dim)' }}>
                    Pauses until you play the right note
                  </div>
                </div>
                <button
                  onClick={() => setWaitMode(!waitMode)}
                  className="relative w-12 h-7 rounded-full transition-colors duration-200"
                  style={{ background: waitMode ? 'var(--kf-mint)' : '#d4cce2' }}
                >
                  <div
                    className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                    style={{ transform: waitMode ? 'translateX(22px)' : 'translateX(4px)' }}
                  />
                </button>
              </div>
            )}
          </div>
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
        <footer className="text-center pb-10 space-y-3">
          <a
            href="https://github.com/patpalingo/keyflow"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: 'var(--kf-surface)',
              color: 'var(--kf-text-bright)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Fork on GitHub
          </a>
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
