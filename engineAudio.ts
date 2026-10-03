/**
 * Web Audio API synthesizer for Hero MotoCorp motorcycle engine sound simulation
 * Provides realistic start-up crank, steady idle thrum, and throttle revving.
 */

export type EngineSoundType = 'commuter' | 'sports' | 'adventure' | 'cruiser' | 'scooter' | 'ev';

export function getEngineTypeForVehicle(category: string, vehicleId: string, engineSpec: string): EngineSoundType {
  if (category === 'ev' || vehicleId.includes('vida')) return 'ev';
  if (vehicleId.includes('mavrick') || vehicleId.includes('harley')) return 'cruiser';
  if (vehicleId.includes('xpulse')) return 'adventure';
  if (vehicleId.includes('karizma') || vehicleId.includes('xtreme')) return 'sports';
  if (category === 'scooter' || vehicleId.includes('destini') || vehicleId.includes('pleasure') || vehicleId.includes('xoom')) return 'scooter';
  return 'commuter';
}

class EngineAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private currentRpm = 1200;
  private rpmListeners: Set<(rpm: number) => void> = new Set();
  private rpmInterval: number | null = null;

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public subscribeRpm(listener: (rpm: number) => void): () => void {
    this.rpmListeners.add(listener);
    listener(this.currentRpm);
    return () => this.rpmListeners.delete(listener);
  }

  private notifyRpm(rpm: number) {
    this.currentRpm = rpm;
    this.rpmListeners.forEach(l => l(rpm));
  }

  public async startEngine(type: EngineSoundType = 'commuter'): Promise<boolean> {
    if (this.isPlaying) return true;

    try {
      const ctx = this.initContext();
      this.isPlaying = true;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.001, ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.4);
      master.connect(ctx.destination);
      this.masterGain = master;

      if (type === 'ev') {
        this.startEvSound(ctx, master);
      } else {
        this.startIceSound(ctx, master, type);
      }

      return true;
    } catch (e) {
      console.warn('Audio context playback failed:', e);
      this.isPlaying = false;
      return false;
    }
  }

  private startIceSound(ctx: AudioContext, master: GainNode, type: EngineSoundType) {
    const baseFreq = type === 'cruiser' ? 24 : type === 'sports' ? 38 : type === 'adventure' ? 32 : 30;
    this.notifyRpm(1250);

    // Fundamental pulse oscillator (exhaust pulses)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(baseFreq * 0.5, ctx.currentTime);

    // Low-pass filter simulating engine block and muffler resonance
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, ctx.currentTime);
    filter.Q.setValueAtTime(3.5, ctx.currentTime);

    // Distortion/Overdrive waveshaper for exhaust rasp
    const waveshaper = ctx.createWaveShaper();
    waveshaper.curve = this.makeDistortionCurve(18);

    // Low rumble noise generator (exhaust air turbulence)
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.15;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(120, ctx.currentTime);
    noiseFilter.Q.setValueAtTime(1.0, ctx.currentTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, ctx.currentTime);

    // Connect nodes
    osc1.connect(waveshaper);
    osc2.connect(waveshaper);
    waveshaper.connect(filter);
    filter.connect(master);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);

    osc1.start();
    osc2.start();
    noise.start();

    // Store references
    this.activeNodes.push(osc1, osc2, noise, filter);

    // Subtle idle RPM fluctuation
    const id = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;
      const jitter = (Math.random() - 0.5) * 40;
      this.notifyRpm(Math.round(1250 + jitter));
    }, 200);
    this.rpmInterval = id;
  }

  private startEvSound(ctx: AudioContext, master: GainNode) {
    this.notifyRpm(800);
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, ctx.currentTime);

    const subOsc = ctx.createOscillator();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(440, ctx.currentTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    osc.start();
    subOsc.start();
    this.activeNodes.push(osc, subOsc, filter, gain);
  }

  public revEngine(type: EngineSoundType = 'commuter', targetRpm = 6500) {
    if (!this.isPlaying || !this.ctx || !this.masterGain) {
      this.startEngine(type).then(() => {
        setTimeout(() => this.revEngine(type, targetRpm), 300);
      });
      return;
    }

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const peakRpm = targetRpm || (type === 'sports' ? 8500 : type === 'cruiser' ? 5500 : 7000);
    const baseFreq = type === 'cruiser' ? 24 : type === 'sports' ? 38 : 30;
    const peakFreq = baseFreq * (peakRpm / 1250);

    // Animate RPM
    let current = 1250;
    const startTime = Date.now();
    const duration = 1600; // ms
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed < 500) {
        // Accelerating
        const progress = elapsed / 500;
        current = Math.round(1250 + (peakRpm - 1250) * Math.sin((progress * Math.PI) / 2));
      } else if (elapsed < duration) {
        // Decelerating back to idle
        const progress = (elapsed - 500) / (duration - 500);
        current = Math.round(peakRpm - (peakRpm - 1250) * progress);
      } else {
        current = 1250;
        clearInterval(interval);
      }
      this.notifyRpm(Math.max(1200, current));
    }, 40);

    // Pitch ramp
    this.activeNodes.forEach(node => {
      if (node instanceof OscillatorNode) {
        node.frequency.cancelScheduledValues(now);
        node.frequency.setValueAtTime(node.frequency.value, now);
        node.frequency.exponentialRampToValueAtTime(peakFreq, now + 0.45);
        node.frequency.exponentialRampToValueAtTime(baseFreq, now + 1.5);
      } else if (node instanceof BiquadFilterNode) {
        node.frequency.cancelScheduledValues(now);
        node.frequency.setValueAtTime(node.frequency.value, now);
        node.frequency.exponentialRampToValueAtTime(800, now + 0.45);
        node.frequency.exponentialRampToValueAtTime(180, now + 1.5);
      }
    });

    // Volume surge on throttle open
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0.55, now + 0.35);
    this.masterGain.gain.linearRampToValueAtTime(0.35, now + 1.5);
  }

  public stopEngine() {
    if (!this.isPlaying) return;
    if (this.rpmInterval) {
      clearInterval(this.rpmInterval);
      this.rpmInterval = null;
    }
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(0.001, now + 0.3);
      setTimeout(() => {
        this.activeNodes.forEach(node => {
          if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
            try {
              node.stop();
              node.disconnect();
            } catch {
              // ignore
            }
          }
        });
        this.activeNodes = [];
        this.isPlaying = false;
        this.notifyRpm(0);
      }, 350);
    } else {
      this.isPlaying = false;
      this.notifyRpm(0);
    }
  }

  public getStatus(): { isPlaying: boolean; rpm: number } {
    return {
      isPlaying: this.isPlaying,
      rpm: this.currentRpm
    };
  }

  private makeDistortionCurve(amount = 20): Float32Array {
    const k = typeof amount === 'number' ? amount : 50;
    const nSamples = 44100;
    const curve = new Float32Array(nSamples);
    const deg = Math.PI / 180;
    for (let i = 0; i < nSamples; ++i) {
      const x = (i * 2) / nSamples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }
}

export const engineAudio = new EngineAudioEngine();
