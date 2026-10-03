// Web Audio API Synthesizer - 100% pure audio synthesis with zero external files

let audioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Synthesizes a natural, pleasant water "tõm" sound (water plop into glass).
 */
export function playWaterDropSound(enabled: boolean = true): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Primary water bubble oscillator (frequency sweep up then settle like a clean "tõm")
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.07);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.18);

    // Gain envelope for a crisp "tõm"
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);

    // Secondary subtle overtone for crisp water droplet surface resonance
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(1200, now);
    subOsc.frequency.exponentialRampToValueAtTime(1900, now + 0.04);
    subOsc.frequency.exponentialRampToValueAtTime(800, now + 0.13);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.12, now + 0.015);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);

    subOsc.start(now);
    subOsc.stop(now + 0.17);
  } catch (err) {
    console.warn('Audio playback error', err);
  }
}

/**
 * Synthesizes a gentle, uplifting chord when the user completes daily target.
 */
export function playSuccessChime(enabled: boolean = true): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Harmonic notes: C5, E5, G5, C6 (523Hz, 659Hz, 784Hz, 1046Hz)
    const notes = [523.25, 659.25, 783.99, 1046.5];

    notes.forEach((freq, index) => {
      const noteOsc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const delay = index * 0.09;

      noteOsc.type = 'sine';
      noteOsc.frequency.setValueAtTime(freq, now + delay);

      noteGain.gain.setValueAtTime(0.001, now + delay);
      noteGain.gain.linearRampToValueAtTime(0.2, now + delay + 0.03);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.8);

      noteOsc.connect(noteGain);
      noteGain.connect(ctx.destination);

      noteOsc.start(now + delay);
      noteOsc.stop(now + delay + 0.85);
    });
  } catch (err) {
    console.warn('Success chime error', err);
  }
}

/**
 * Synthesizes a friendly, mellow notification chime for drink reminders.
 */
export function playReminderChime(enabled: boolean = true): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Friendly two-tone bell (E5 to A5)
    const tones = [
      { freq: 659.25, time: 0, duration: 0.35 },
      { freq: 880.0, time: 0.16, duration: 0.5 },
    ];

    tones.forEach((tone) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(tone.freq, now + tone.time);

      gain.gain.setValueAtTime(0.001, now + tone.time);
      gain.gain.linearRampToValueAtTime(0.22, now + tone.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + tone.time + tone.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + tone.time);
      osc.stop(now + tone.time + tone.duration + 0.05);
    });
  } catch (err) {
    console.warn('Reminder chime error', err);
  }
}

/**
 * Chill Ambient Music Engine using pure Web Audio API.
 * Synthesizes a serene, spa/wellness ambient soundscape:
 * - Warm soothing chord pads (Fmaj9 / Cmaj9 harmonic drone)
 * - Gentle LFO filter movement
 * - Very soft crystal water chimes that periodically twinkle
 * - Smooth fade-in and fade-out
 */
class ChillMusicEngine {
  private active = false;
  private masterGain: GainNode | null = null;
  private padOscillators: OscillatorNode[] = [];
  private filterNode: BiquadFilterNode | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private timerId: number | null = null;
  private currentVolume = 0.35;

  public isPlaying(): boolean {
    return this.active;
  }

  public start(volume: number = 0.35): void {
    if (this.active) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    this.active = true;
    this.currentVolume = Math.max(0, Math.min(1, volume));

    const now = ctx.currentTime;

    // Master Gain for Chill Music with fade-in
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, now);
    this.masterGain.gain.linearRampToValueAtTime(this.currentVolume * 0.45, now + 1.8);
    this.masterGain.connect(ctx.destination);

    // Warm Lowpass Filter
    this.filterNode = ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(650, now);
    this.filterNode.Q.setValueAtTime(1.5, now);
    this.filterNode.connect(this.masterGain);

    // LFO for slow dreamy breathing filter sweep (0.12 Hz = ~8 seconds per cycle)
    this.lfoOsc = ctx.createOscillator();
    this.lfoGain = ctx.createGain();
    this.lfoOsc.type = 'sine';
    this.lfoOsc.frequency.setValueAtTime(0.12, now);
    this.lfoGain.gain.setValueAtTime(220, now); // modulates cutoff by +/- 220Hz
    this.lfoOsc.connect(this.lfoGain);
    this.lfoGain.connect(this.filterNode.frequency);
    this.lfoOsc.start(now);

    // Warm Ambient Pad Oscillators: Chord F3, C4, E4, A4 (Fmaj7 peace chord)
    const padFrequencies = [174.61, 261.63, 329.63, 440.0];
    this.padOscillators = [];

    padFrequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      // Alternate sine and smooth triangle for warm acoustic presence
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      // Slight detune for analog lush warmth
      osc.frequency.setValueAtTime(freq + (idx === 0 ? 0.3 : -0.25), now);

      oscGain.gain.setValueAtTime(0.08, now);
      osc.connect(oscGain);
      oscGain.connect(this.filterNode!);

      osc.start(now);
      this.padOscillators.push(osc);
    });

    // Schedule soothing ambient crystalline notes
    this.scheduleAmbientChimes();
  }

  private scheduleAmbientChimes(): void {
    if (!this.active) return;
    const ctx = getAudioContext();
    if (!ctx || !this.filterNode) return;

    // Soothing pentatonic scale notes: F4, G4, A4, C5, D5, E5, G5
    const chimePitches = [349.23, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99];

    const playRandomChime = () => {
      if (!this.active || !this.masterGain) return;
      const currentCtx = getAudioContext();
      if (!currentCtx) return;

      const t = currentCtx.currentTime;
      const pitch = chimePitches[Math.floor(Math.random() * chimePitches.length)];

      const osc = currentCtx.createOscillator();
      const gain = currentCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, t);

      // Soft crystalline envelope
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.06 * this.currentVolume, t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 2.9);

      // Next chime after random peaceful delay (2.5 to 4.5 seconds)
      const nextDelay = 2500 + Math.random() * 2000;
      this.timerId = window.setTimeout(playRandomChime, nextDelay);
    };

    // First chime in 1.5s
    this.timerId = window.setTimeout(playRandomChime, 1500);
  }

  public setVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      const ctx = getAudioContext();
      if (ctx) {
        this.masterGain.gain.setTargetAtTime(
          this.currentVolume * 0.45,
          ctx.currentTime,
          0.1
        );
      }
    }
  }

  public stop(): void {
    if (!this.active) return;
    this.active = false;

    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }

    const ctx = getAudioContext();
    if (ctx && this.masterGain) {
      const now = ctx.currentTime;
      // Gentle fade-out
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);

      setTimeout(() => {
        try {
          this.padOscillators.forEach((osc) => {
            try {
              osc.stop();
              osc.disconnect();
            } catch {}
          });
          this.padOscillators = [];

          if (this.lfoOsc) {
            try {
              this.lfoOsc.stop();
              this.lfoOsc.disconnect();
            } catch {}
            this.lfoOsc = null;
          }
          if (this.filterNode) {
            this.filterNode.disconnect();
            this.filterNode = null;
          }
          if (this.masterGain) {
            this.masterGain.disconnect();
            this.masterGain = null;
          }
        } catch (e) {
          console.warn('Error stopping ambient music', e);
        }
      }, 1250);
    }
  }
}

export const chillMusicPlayer = new ChillMusicEngine();
