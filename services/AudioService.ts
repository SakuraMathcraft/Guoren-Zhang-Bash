
type Note = { f: number; d: number };

class AudioService {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private currentTrackIndex = 0;
  private timerId: number | null = null;
  private currentOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];

  private tracks: Note[][] = [
    // Track 1: Classic Birthday
    [
      { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.2 }, { f: 293.66, d: 0.6 }, { f: 261.63, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 329.63, d: 1.2 },
      { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.2 }, { f: 293.66, d: 0.6 }, { f: 261.63, d: 0.6 }, { f: 392.00, d: 0.6 }, { f: 349.23, d: 1.2 },
      { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.2 }, { f: 523.25, d: 0.6 }, { f: 440.00, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 329.63, d: 0.6 }, { f: 293.66, d: 1.2 },
      { f: 466.16, d: 0.4 }, { f: 466.16, d: 0.2 }, { f: 440.00, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 392.00, d: 0.6 }, { f: 349.23, d: 1.2 }
    ],
    // Track 2: Jubilant New Year
    [
      { f: 392.00, d: 0.3 }, { f: 440.00, d: 0.3 }, { f: 493.88, d: 0.3 }, { f: 523.25, d: 0.6 },
      { f: 587.33, d: 0.3 }, { f: 659.25, d: 0.3 }, { f: 698.46, d: 0.9 },
      { f: 659.25, d: 0.3 }, { f: 587.33, d: 0.3 }, { f: 523.25, d: 0.9 }
    ],
    // Track 3: Starlight Waltz
    [
      { f: 349.23, d: 0.5 }, { f: 440.00, d: 0.5 }, { f: 523.25, d: 1.0 },
      { f: 466.16, d: 0.5 }, { f: 440.00, d: 0.5 }, { f: 349.23, d: 1.0 },
      { f: 392.00, d: 1.5 }
    ],
    [{ f: 523.25, d: 0.2 }, { f: 659.25, d: 0.2 }, { f: 783.99, d: 0.2 }, { f: 1046.5, d: 0.8 }],
    [{ f: 440.00, d: 0.8 }, { f: 493.88, d: 0.8 }, { f: 523.25, d: 1.6 }],
    [{ f: 659.25, d: 0.4 }, { f: 587.33, d: 0.4 }, { f: 523.25, d: 0.4 }],
    [{ f: 261.63, d: 0.2 }, { f: 329.63, d: 0.2 }, { f: 392.00, d: 0.2 }],
    [{ f: 349.23, d: 1.2 }, { f: 440.00, d: 1.2 }, { f: 392.00, d: 1.2 }]
  ];

  async init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
  }

  playCountdownTick(isFinal: boolean = false) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = isFinal ? 'square' : 'sine';
    osc.frequency.setValueAtTime(isFinal ? 880 : 440, this.audioCtx.currentTime);
    
    gain.gain.setValueAtTime(1.0, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.15);
  }

  async startMicMonitoring(onBlow: () => void) {
    await this.init();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      const source = this.audioCtx!.createMediaStreamSource(stream);
      const analyser = this.audioCtx!.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      
      const check = () => {
        if (!this.audioCtx) return;
        analyser.getByteFrequencyData(data);
        const lowEnd = data.slice(0, Math.floor(data.length * 0.2));
        const avgLow = lowEnd.reduce((a, b) => a + b, 0) / lowEnd.length;
        
        // Increased threshold from 35 to 65 for better blowing detection
        if (avgLow > 65) {
          onBlow();
          stream.getTracks().forEach(t => t.stop());
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    } catch (e) { 
      // Fallback for no mic access
      setTimeout(onBlow, 5000);
    }
  }

  playTrack(index: number) {
    this.stop();
    this.currentTrackIndex = index % this.tracks.length;
    this.isPlaying = true;
    this.loopCurrentTrack();
  }

  private loopCurrentTrack() {
    if (!this.isPlaying || !this.audioCtx) return;
    const notes = this.tracks[this.currentTrackIndex];
    let time = this.audioCtx.currentTime + 0.1;
    let durationSum = 0;

    notes.forEach(n => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, time);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(1.0, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + n.d);
      osc.connect(gain);
      gain.connect(this.audioCtx!.destination);
      osc.start(time);
      osc.stop(time + n.d);
      this.currentOscillators.push({ osc, gain });
      time += n.d * 0.9;
      durationSum += n.d * 0.9;
    });

    this.timerId = window.setTimeout(() => {
      if (this.isPlaying) this.loopCurrentTrack();
    }, durationSum * 1000 + 500);
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) clearTimeout(this.timerId);
    this.currentOscillators.forEach(({ osc, gain }) => {
      try { osc.stop(); osc.disconnect(); gain.disconnect(); } catch (e) {}
    });
    this.currentOscillators = [];
  }

  getCurrentTrack() { return this.currentTrackIndex; }
}

export const audioService = new AudioService();
