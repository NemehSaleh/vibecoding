import { safeGetItem, safeSetItem, safeRemoveItem } from './storage';
// Web Audio API Sound Generator for Vibe Coding Arabic Platform
// Synthetic tones generated dynamically without external assets or dependencies.

let audioCtx: AudioContext | null = null;
let soundMuted = false;

// Initialize or resume AudioContext safely upon user interaction
const getAudioContext = (): AudioContext | null => {
  if (soundMuted) return null;
  
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }

  return audioCtx;
};

// Toggle Mute State
export const isSoundMuted = (): boolean => {
  if (typeof window !== 'undefined') {
    const stored = safeGetItem('vibe_coding_sound_muted');
    if (stored !== null) {
      soundMuted = stored === 'true';
    }
  }
  return soundMuted;
};

export const setSoundMuted = (muted: boolean) => {
  soundMuted = muted;
  if (typeof window !== 'undefined') {
    safeSetItem('vibe_coding_sound_muted', String(muted));
  }
};

/**
 * Play Level Complete Fanfare (Major Triad Cascade: C5 - E5 - G5 - C6)
 */
export const playLevelCompleteSound = () => {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1);

    gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.1);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + index * 0.1 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.1 + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + index * 0.1);
    osc.stop(ctx.currentTime + index * 0.1 + 0.5);
  });
};

/**
 * Play Badge Unlock Sound Effect (Sparkly High Octave Chime: G5 - C6 - E6 - G6)
 */
export const playBadgeUnlockSound = () => {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [783.99, 1046.50, 1318.51, 1567.98]; // G5, C6, E6, G6
  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);

    gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.08);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + index * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + index * 0.08);
    osc.stop(ctx.currentTime + index * 0.08 + 0.45);
  });
};

/**
 * Play Quick Success Beep
 */
export const playQuizSuccessSound = () => {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.25);
};

/**
 * Play XP Gain Sound Effect (Ascending Arpeggio chime)
 */
export const playXPGainSound = () => {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.06);

    gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.06);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + index * 0.06 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.06 + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + index * 0.06);
    osc.stop(ctx.currentTime + index * 0.06 + 0.35);
  });
};

/**
 * Play Soft Tactile UI Click Tone
 */
export const playClickSound = () => {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, ctx.currentTime);

  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.05);
};
