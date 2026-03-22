import { useGameStore } from '../stores/gameStore';
import { COLORS } from '../utils/colorScheme';
import { drawNotes } from './NoteRenderer';
import { drawHitZone } from './HitZoneRenderer';
import { drawKeyboard } from './KeyboardRenderer';
import { drawEffects } from './EffectsRenderer';
import { checkMissedNotes } from '../services/scoringEngine';

export class GameRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animFrameId: number = 0;
  private running = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D context');
    this.ctx = ctx;
  }

  start() {
    this.running = true;
    this.tick();
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.animFrameId);
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  private tick = () => {
    if (!this.running) return;

    const state = useGameStore.getState();
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Clear
    this.ctx.clearRect(0, 0, w, h);
    this.ctx.fillStyle = COLORS.background;
    this.ctx.fillRect(0, 0, w, h);

    if (state.status === 'finished') {
      // Draw static frame behind the opaque modal, keep loop alive for Play Again
      drawKeyboard(this.ctx, w, h, new Set(), new Set());
      drawHitZone(this.ctx, w, h);
      this.animFrameId = requestAnimationFrame(this.tick);
      return;
    }

    if (state.status === 'playing' || state.status === 'paused') {
      // Check for missed notes
      if (state.status === 'playing') {
        const missed = checkMissedNotes(state.gameNotes, state.currentTime);
        if (missed.length > 0) {
          for (const _ of missed) {
            state.recordMiss();
          }
        }
      }

      // Build expected notes set (notes about to be hit in next 0.3s)
      const expectedNotes = new Set<number>();
      for (const note of state.gameNotes) {
        if (note.state !== 'upcoming') continue;
        const delta = note.startTime - state.currentTime;
        if (delta >= 0 && delta < 0.3) {
          expectedNotes.add(note.midiNote);
        }
      }

      // Draw layers
      drawNotes(this.ctx, w, h, state.gameNotes, state.currentTime);
      drawHitZone(this.ctx, w, h);
      drawEffects(this.ctx, w, h);
      drawKeyboard(this.ctx, w, h, state.activeInputNotes, expectedNotes);

      // Draw countdown if active
    } else if (state.status === 'countdown') {
      drawKeyboard(this.ctx, w, h, state.activeInputNotes, new Set());
      drawHitZone(this.ctx, w, h);

      // Big countdown number
      if (state.countdownValue > 0) {
        this.ctx.save();
        this.ctx.fillStyle = COLORS.text;
        this.ctx.font = 'bold 120px Quicksand, Nunito, system-ui';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.globalAlpha = 0.8;
        this.ctx.fillText(
          String(state.countdownValue),
          w / 2,
          h * 0.4,
        );
        this.ctx.restore();
      }
    } else {
      // Idle state — draw keyboard only
      drawKeyboard(this.ctx, w, h, state.activeInputNotes, new Set());
    }

    this.animFrameId = requestAnimationFrame(this.tick);
  };
}
