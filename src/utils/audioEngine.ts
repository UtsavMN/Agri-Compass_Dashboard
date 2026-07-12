class AudioEngine {
  private ctx: AudioContext | null = null;
  private ambienceGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private windLfo: OscillatorNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private birdTimer: ReturnType<typeof setTimeout> | null = null;

  public init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  public getContext() {
    return this.ctx;
  }

  // --- UI SOUNDS ---

  public playClick() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.04, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  public playGlass() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    
    // Two oscillators slightly detuned for a glassy shimmer
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = "sine";
    osc2.type = "triangle";

    osc1.frequency.setValueAtTime(2200, t);
    osc2.frequency.setValueAtTime(2220, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.02, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.4);
    osc2.stop(t + 0.4);
  }

  public playTransition() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(100, t + 1.5);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.03, t + 0.5);
    gain.gain.linearRampToValueAtTime(0, t + 1.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 1.5);
  }

  // --- AMBIENCE (WIND + BIRDS) ---

  public startAmbience() {
    this.init();
    if (!this.ctx) return;
    if (this.ambienceGain) return; // Already running

    const t = this.ctx.currentTime;
    this.ambienceGain = this.ctx.createGain();
    this.ambienceGain.gain.setValueAtTime(0, t);
    this.ambienceGain.gain.linearRampToValueAtTime(0.3, t + 3); // Fade in over 3s
    this.ambienceGain.connect(this.ctx.destination);

    // 1. Generate White Noise Buffer (for wind)
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;

    // 2. Wind Filter (Lowpass)
    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = "lowpass";
    this.windFilter.Q.value = 1;
    this.windFilter.frequency.value = 300;

    // 3. LFO to modulate Wind Filter (Simulates gusts)
    this.windLfo = this.ctx.createOscillator();
    this.windLfo.type = "sine";
    this.windLfo.frequency.value = 0.1; // 10 seconds per cycle

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 150; // Sweeps filter between 150Hz and 450Hz

    this.windLfo.connect(lfoGain);
    lfoGain.connect(this.windFilter.frequency);

    this.noiseSource.connect(this.windFilter);
    this.windFilter.connect(this.ambienceGain);

    this.windLfo.start(t);
    this.noiseSource.start(t);

    // 4. Random Birds
    const scheduleBird = () => {
      this.playBirdChirp();
      const nextDelay = Math.random() * 8000 + 4000; // 4 to 12 seconds
      this.birdTimer = setTimeout(scheduleBird, nextDelay);
    };
    scheduleBird();
  }

  public stopAmbience() {
    if (!this.ctx || !this.ambienceGain) return;
    const t = this.ctx.currentTime;
    
    // Fade out over 2 seconds
    this.ambienceGain.gain.cancelScheduledValues(t);
    this.ambienceGain.gain.setValueAtTime(this.ambienceGain.gain.value, t);
    this.ambienceGain.gain.linearRampToValueAtTime(0, t + 2);

    setTimeout(() => {
      if (this.noiseSource) {
        this.noiseSource.stop();
        this.noiseSource.disconnect();
        this.noiseSource = null;
      }
      if (this.windLfo) {
        this.windLfo.stop();
        this.windLfo.disconnect();
        this.windLfo = null;
      }
      if (this.windFilter) {
        this.windFilter.disconnect();
        this.windFilter = null;
      }
      if (this.ambienceGain) {
        this.ambienceGain.disconnect();
        this.ambienceGain = null;
      }
    }, 2100);

    if (this.birdTimer) {
      clearTimeout(this.birdTimer);
      this.birdTimer = null;
    }
  }

  private playBirdChirp() {
    if (!this.ctx || !this.ambienceGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    // Random high pitch
    const baseFreq = 3000 + Math.random() * 1000;
    osc.frequency.setValueAtTime(baseFreq, t);
    // Quick swoop up and down
    osc.frequency.exponentialRampToValueAtTime(baseFreq + 500, t + 0.1);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, t + 0.2);

    // Envelope
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.015, t + 0.05); // Very quiet
    gain.gain.linearRampToValueAtTime(0, t + 0.2);

    osc.connect(gain);
    // Route bird through the ambience gain so it fades out with the wind
    gain.connect(this.ambienceGain);

    osc.start(t);
    osc.stop(t + 0.2);
  }
}

export const audio = new AudioEngine();
