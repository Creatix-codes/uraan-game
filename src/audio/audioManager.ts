type ToneShape = 'sine' | 'triangle' | 'square' | 'sawtooth';

/**
 * A tiny, dependency-free Web Audio soundscape.
 *
 * Nothing is created until the player's first gesture. The background music is
 * an original, gently looping pentatonic melody with a soft drone and hand-drum
 * style percussion, designed to sit under the game rather than fight with it.
 */
class AudioManager {
  private ctx: AudioContext | null = null;
  private musicBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private droneNodes: OscillatorNode[] = [];
  private musicTimer: number | null = null;
  private nextNoteTime = 0;
  private step = 0;
  private musicEnabled = true;
  private sfxEnabled = true;
  private unlocked = false;

  private static readonly MELODY: Array<number | null> = [
    62, null, 65, 69, 67, 65, 64, 62,
    60, null, 62, 65, 67, 69, 67, 65,
    69, null, 72, 74, 72, 69, 67, 65,
    64, null, 65, 67, 62, null, 60, null,
  ];

  configure(settings: { music: boolean; sfx: boolean }): void {
    const musicChanged = this.musicEnabled !== settings.music;
    this.musicEnabled = settings.music;
    this.sfxEnabled = settings.sfx;
    if (!this.unlocked) return;

    if (musicChanged) {
      if (this.musicEnabled) this.startMusic();
      else this.stopMusic();
    }
    if (this.sfxBus && this.ctx) {
      this.sfxBus.gain.setTargetAtTime(this.sfxEnabled ? 0.8 : 0, this.ctx.currentTime, 0.03);
    }
  }

  unlock(): void {
    if (this.unlocked && this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;

    try {
      const ctx = new Ctor();
      const master = ctx.createGain();
      master.gain.value = 0.62;
      master.connect(ctx.destination);

      const musicBus = ctx.createGain();
      musicBus.gain.value = 0.5;
      musicBus.connect(master);

      const sfxBus = ctx.createGain();
      sfxBus.gain.value = this.sfxEnabled ? 0.8 : 0;
      sfxBus.connect(master);

      // A short echo gives the plucked melody a warm, courtyard feel.
      const delay = ctx.createDelay(0.5);
      const feedback = ctx.createGain();
      const wet = ctx.createGain();
      delay.delayTime.value = 0.29;
      feedback.gain.value = 0.18;
      wet.gain.value = 0.2;
      musicBus.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(wet);
      wet.connect(master);

      this.ctx = ctx;
      this.musicBus = musicBus;
      this.sfxBus = sfxBus;
      this.unlocked = true;
      this.noiseBuffer = this.createNoiseBuffer(ctx);

      if (this.musicEnabled) this.startMusic();
      if (ctx.state === 'suspended') void ctx.resume();
    } catch {
      this.unlocked = false;
    }
  }

  private createNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const length = Math.floor(ctx.sampleRate * 0.4);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      // Slightly pink noise is less harsh for wing and impact sounds.
      last = 0.97 * last + 0.03 * white;
      data[i] = white * 0.6 + last * 1.8;
    }
    return buffer;
  }

  private midiToHz(note: number): number {
    return 440 * 2 ** ((note - 69) / 12);
  }

  private pluck(note: number, when: number, duration: number, volume: number): void {
    const ctx = this.ctx;
    const bus = this.musicBus;
    if (!ctx || !bus) return;
    const freq = this.midiToHz(note);

    const osc = ctx.createOscillator();
    const shimmer = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    shimmer.type = 'sine';
    osc.frequency.setValueAtTime(freq, when);
    shimmer.frequency.setValueAtTime(freq * 2.001, when);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2800, when);
    filter.frequency.exponentialRampToValueAtTime(700, when + duration);

    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(volume, when + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = 0.12;
    osc.connect(filter);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(filter);
    filter.connect(gain);
    gain.connect(bus);

    osc.start(when);
    shimmer.start(when);
    osc.stop(when + duration + 0.05);
    shimmer.stop(when + duration + 0.05);
  }

  private drum(when: number, kind: 'low' | 'tick'): void {
    const ctx = this.ctx;
    const bus = this.musicBus;
    if (!ctx || !bus) return;

    if (kind === 'low') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(118, when);
      osc.frequency.exponentialRampToValueAtTime(44, when + 0.2);
      gain.gain.setValueAtTime(0.0001, when);
      gain.gain.exponentialRampToValueAtTime(0.23, when + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.24);
      osc.connect(gain);
      gain.connect(bus);
      osc.start(when);
      osc.stop(when + 0.27);
      return;
    }

    if (!this.noiseBuffer) return;
    const noise = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    noise.buffer = this.noiseBuffer;
    filter.type = 'bandpass';
    filter.frequency.value = 2400;
    filter.Q.value = 1.1;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(0.13, when + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.08);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(bus);
    noise.start(when);
    noise.stop(when + 0.1);
  }

  private scheduleMusicStep(step: number, when: number): void {
    const note = AudioManager.MELODY[step];
    if (note !== null) {
      const accent = step % 8 === 0 ? 0.14 : 0.1;
      this.pluck(note, when, 0.72, accent);
      if (step % 16 === 4) this.pluck(note + 12, when + 0.19, 0.5, 0.035);
    }
    if (step % 8 === 0 || step % 8 === 5) this.drum(when, 'low');
    if (step % 8 === 3 || step % 8 === 6) this.drum(when, 'tick');
    if (step % 16 === 12) this.drum(when + 0.16, 'tick');
  }

  private startMusic(): void {
    if (!this.ctx || !this.musicBus || this.musicTimer !== null) return;
    const ctx = this.ctx;
    this.musicBus.gain.cancelScheduledValues(ctx.currentTime);
    this.musicBus.gain.setValueAtTime(this.musicBus.gain.value, ctx.currentTime);
    this.musicBus.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.2);

    this.startDrone();
    this.step = 0;
    this.nextNoteTime = ctx.currentTime + 0.15;

    const scheduler = (): void => {
      if (!this.ctx || !this.musicBus) return;
      const stepDuration = 60 / 74 / 2;
      const now = this.ctx.currentTime;
      // If the tab was asleep, skip the backlog instead of firing minutes of
      // notes at once when it wakes up.
      if (this.nextNoteTime < now - 0.5) this.nextNoteTime = now + 0.05;
      let scheduled = 0;
      while (this.nextNoteTime < now + 0.45 && scheduled < 6) {
        this.scheduleMusicStep(this.step, this.nextNoteTime);
        this.step = (this.step + 1) % AudioManager.MELODY.length;
        this.nextNoteTime += stepDuration;
        scheduled += 1;
      }
    };
    scheduler();
    this.musicTimer = window.setInterval(scheduler, 120);
  }

  private startDrone(): void {
    if (!this.ctx || !this.musicBus) return;
    const ctx = this.ctx;
    const bus = this.musicBus;
    const notes = [73.42, 110, 146.83];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = index === 2 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      filter.type = 'lowpass';
      filter.frequency.value = 380;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(index === 2 ? 0.018 : 0.03, ctx.currentTime + 2.2);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(bus);
      osc.start();
      this.droneNodes.push(osc);
    });
  }

  private stopDrone(): void {
    for (const osc of this.droneNodes) {
      try {
        osc.stop();
      } catch {
        // Already stopped.
      }
    }
    this.droneNodes = [];
  }

  private stopMusic(): void {
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.musicBus && this.ctx) {
      this.musicBus.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicBus.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.12);
    }
    this.stopDrone();
  }

  private sfxTone(
    frequency: number,
    duration: number,
    volume: number,
    options: {
      type?: ToneShape;
      when?: number;
      endFrequency?: number;
      attack?: number;
      destination?: AudioNode;
    } = {},
  ): void {
    if (!this.ctx || !this.sfxBus) return;
    const ctx = this.ctx;
    const when = options.when ?? ctx.currentTime;
    const target = options.destination ?? this.sfxBus;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = options.type ?? 'sine';
    osc.frequency.setValueAtTime(Math.max(20, frequency), when);
    if (options.endFrequency) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, options.endFrequency), when + duration);
    }
    const attack = options.attack ?? 0.006;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), when + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    osc.connect(gain);
    gain.connect(target);
    osc.start(when);
    osc.stop(when + duration + 0.03);
  }

  private noise(
    duration: number,
    volume: number,
    options: { frequency?: number; q?: number; type?: BiquadFilterType; when?: number } = {},
  ): void {
    if (!this.ctx || !this.sfxBus || !this.noiseBuffer) return;
    const ctx = this.ctx;
    const when = options.when ?? ctx.currentTime;
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = this.noiseBuffer;
    filter.type = options.type ?? 'lowpass';
    filter.frequency.setValueAtTime(options.frequency ?? 1600, when);
    filter.Q.value = options.q ?? 0.7;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), when + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxBus);
    source.start(when);
    source.stop(when + duration + 0.03);
  }

  private playSfx(name: string): void {
    if (!this.sfxEnabled) return;
    if (!this.unlocked) this.unlock();
    if (!this.ctx || !this.sfxBus) return;
    const now = this.ctx.currentTime;

    switch (name) {
      case 'flap':
        this.noise(0.16, 0.25, { frequency: 1200, type: 'bandpass', q: 0.6 });
        this.sfxTone(520, 0.12, 0.08, { type: 'sine', endFrequency: 300 });
        break;
      case 'star':
        this.sfxTone(1174.7, 0.2, 0.1, { type: 'triangle', when: now });
        this.sfxTone(1568, 0.24, 0.09, { type: 'triangle', when: now + 0.055 });
        this.sfxTone(2349.3, 0.3, 0.06, { type: 'sine', when: now + 0.11 });
        break;
      case 'heart':
        this.sfxTone(392, 0.22, 0.08, { type: 'sine', endFrequency: 523 });
        this.sfxTone(784, 0.3, 0.05, { type: 'triangle', when: now + 0.08 });
        break;
      case 'hit':
        this.noise(0.24, 0.4, { frequency: 900, type: 'lowpass' });
        this.sfxTone(180, 0.3, 0.26, { type: 'sine', endFrequency: 55 });
        this.sfxTone(95, 0.25, 0.14, { type: 'triangle', when: now + 0.02 });
        break;
      case 'click':
        this.sfxTone(880, 0.045, 0.06, { type: 'triangle', endFrequency: 660 });
        this.noise(0.035, 0.05, { frequency: 2800, type: 'highpass' });
        break;
      case 'start':
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          this.sfxTone(freq, 0.34, 0.08, { type: 'triangle', when: now + i * 0.07 });
        });
        break;
      case 'victory':
        [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, i) => {
          this.sfxTone(freq, 0.6, 0.08, { type: 'triangle', when: now + i * 0.11 });
          this.sfxTone(freq / 2, 0.7, 0.04, { type: 'sine', when: now + i * 0.11 });
        });
        this.sfxTone(1568, 1.2, 0.05, { type: 'sine', when: now + 0.62 });
        break;
      case 'lose':
        [392, 349.23, 293.66, 220].forEach((freq, i) => {
          this.sfxTone(freq, 0.4, 0.08, { type: 'triangle', when: now + i * 0.13 });
        });
        break;
      case 'unlock':
        [659.25, 783.99, 987.77, 1318.5].forEach((freq, i) => {
          this.sfxTone(freq, 0.5, 0.07, { type: 'triangle', when: now + i * 0.09 });
        });
        break;
      case 'page':
        this.noise(0.18, 0.06, { frequency: 1700, type: 'bandpass', q: 0.5 });
        break;
      default:
        break;
    }
  }

  flap(): void {
    this.playSfx('flap');
  }
  star(): void {
    this.playSfx('star');
  }
  heart(): void {
    this.playSfx('heart');
  }
  hit(): void {
    this.playSfx('hit');
  }
  click(): void {
    this.playSfx('click');
  }
  start(): void {
    this.playSfx('start');
  }
  victory(): void {
    this.playSfx('victory');
  }
  lose(): void {
    this.playSfx('lose');
  }
  unlockChime(): void {
    this.playSfx('unlock');
  }
  page(): void {
    this.playSfx('page');
  }
}

export const audio = new AudioManager();
