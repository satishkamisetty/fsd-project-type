/**
 * ZenZone Web Audio API Synthesis Engine
 * Provides synthesized Tibetan singing bowl chimes, multi-channel ambient soundscapes
 * (Gentle Rain, Forest Stream/Birds, White Noise, Temple Bells), and 10Hz Alpha Binaural Beats.
 * Runs 100% offline without external audio files.
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.soundscapes = {};
    this.binaural = null;
    this.isMuted = false;
  }

  // Ensure AudioContext is initialized upon explicit user gesture
  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- TIBETAN SINGING BOWL CHIME ---
  playSingingBowlChime(pitchModifier = 1.0) {
    try {
      this.ensureContext();
      const now = this.ctx.currentTime;

      // Resonant harmonic partials of a handcrafted Tibetan metal bowl
      const harmonics = [
        { freq: 261.63 * pitchModifier, gain: 0.35, decay: 4.5 }, // Fundamental (C4)
        { freq: 523.25 * pitchModifier, gain: 0.22, decay: 3.8 }, // Octave
        { freq: 784.88 * pitchModifier, gain: 0.14, decay: 3.0 }, // Fifth
        { freq: 1046.5 * pitchModifier, gain: 0.08, decay: 2.2 }  // Second Octave
      ];

      harmonics.forEach(h => {
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = 'sine';
        // Add subtle natural detune for authentic shimmer
        osc.frequency.setValueAtTime(h.freq + (Math.random() - 0.5) * 1.5, now);

        gainNode.gain.setValueAtTime(0.0001, now);
        gainNode.gain.exponentialRampToValueAtTime(h.gain, now + 0.06);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + h.decay);

        osc.connect(gainNode);
        gainNode.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + h.decay + 0.1);
      });
    } catch (e) {
      console.warn('[Audio] Bowl chime playback error:', e);
    }
  }

  // Gentle soft woodblock / bell transition tick for breathing stages
  playSoftCue(type = 'inhale') {
    try {
      this.ensureContext();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const freq = type === 'inhale' ? 440 : type === 'hold' ? 523.25 : 349.23;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch (e) {
      // Audio context policy fallback
    }
  }

  // --- AMBIENT SOUNDSCAPE SYNTHESIZERS ---

  // 1. Gentle Rain (Synthesized Pink Noise through Bandpass Filter)
  startRain(volume = 0.5) {
    this.ensureContext();
    if (this.soundscapes.rain) return;

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Pink noise generation algorithm (Paul Kellet's filtered white noise)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter simulating rainfall acoustics
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(volume * 0.4, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    whiteNoise.start();

    this.soundscapes.rain = { source: whiteNoise, gain: gainNode };
  }

  stopRain() {
    if (this.soundscapes.rain) {
      try {
        this.soundscapes.rain.source.stop();
        this.soundscapes.rain.source.disconnect();
      } catch (e) {}
      delete this.soundscapes.rain;
    }
  }

  // 2. White / Pink Noise generator
  startWhiteNoise(volume = 0.4) {
    this.ensureContext();
    if (this.soundscapes.whiteNoise) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.15, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start();

    this.soundscapes.whiteNoise = { source, gain };
  }

  stopWhiteNoise() {
    if (this.soundscapes.whiteNoise) {
      try {
        this.soundscapes.whiteNoise.source.stop();
        this.soundscapes.whiteNoise.source.disconnect();
      } catch (e) {}
      delete this.soundscapes.whiteNoise;
    }
  }

  // 3. Forest Stream & Birds (Water stream + periodic chirps)
  startForest(volume = 0.5) {
    this.ensureContext();
    if (this.soundscapes.forest) return;

    // Stream bubbling simulation
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const streamSource = this.ctx.createBufferSource();
    streamSource.buffer = buffer;
    streamSource.loop = true;

    const streamFilter = this.ctx.createBiquadFilter();
    streamFilter.type = 'bandpass';
    streamFilter.frequency.setValueAtTime(450, this.ctx.currentTime);
    streamFilter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    const streamGain = this.ctx.createGain();
    streamGain.gain.setValueAtTime(volume * 0.35, this.ctx.currentTime);

    streamSource.connect(streamFilter);
    streamFilter.connect(streamGain);
    streamGain.connect(this.masterGain);
    streamSource.start();

    // Periodic gentle bird chirp interval
    const birdInterval = setInterval(() => {
      if (!this.soundscapes.forest || Math.random() > 0.6) return;
      try {
        const now = this.ctx.currentTime;
        const birdOsc = this.ctx.createOscillator();
        const birdGain = this.ctx.createGain();
        birdOsc.type = 'sine';
        birdOsc.frequency.setValueAtTime(2400 + Math.random() * 600, now);
        birdOsc.frequency.exponentialRampToValueAtTime(3200 + Math.random() * 400, now + 0.15);

        birdGain.gain.setValueAtTime(0.0001, now);
        birdGain.gain.linearRampToValueAtTime(volume * 0.08, now + 0.03);
        birdGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

        birdOsc.connect(birdGain);
        birdGain.connect(this.masterGain);
        birdOsc.start(now);
        birdOsc.stop(now + 0.3);
      } catch (e) {}
    }, 3500);

    this.soundscapes.forest = { source: streamSource, gain: streamGain, interval: birdInterval };
  }

  stopForest() {
    if (this.soundscapes.forest) {
      try {
        clearInterval(this.soundscapes.forest.interval);
        this.soundscapes.forest.source.stop();
        this.soundscapes.forest.source.disconnect();
      } catch (e) {}
      delete this.soundscapes.forest;
    }
  }

  // 4. Temple Bells (Periodic mellow meditation chimes)
  startTempleBells(volume = 0.5) {
    this.ensureContext();
    if (this.soundscapes.bells) return;

    const playBell = () => {
      if (!this.soundscapes.bells) return;
      this.playSingingBowlChime(0.85);
    };

    playBell();
    const interval = setInterval(playBell, 9000);
    this.soundscapes.bells = { interval, volume };
  }

  stopTempleBells() {
    if (this.soundscapes.bells) {
      clearInterval(this.soundscapes.bells.interval);
      delete this.soundscapes.bells;
    }
  }

  // 5. Binaural Beats (8Hz - 12Hz Alpha Wave study focus generator)
  startBinauralBeats(alphaFreq = 10, volume = 0.4) {
    this.ensureContext();
    if (this.binaural) return;

    // Carrier frequency in left ear = 200 Hz, right ear = 200 + alphaFreq Hz
    const carrier = 200;
    const leftOsc = this.ctx.createOscillator();
    const rightOsc = this.ctx.createOscillator();

    leftOsc.type = 'sine';
    leftOsc.frequency.setValueAtTime(carrier, this.ctx.currentTime);

    rightOsc.type = 'sine';
    rightOsc.frequency.setValueAtTime(carrier + alphaFreq, this.ctx.currentTime);

    // Stereo Panning
    const leftPanner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    const rightPanner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

    if (leftPanner && rightPanner) {
      leftPanner.pan.setValueAtTime(-1, this.ctx.currentTime);
      rightPanner.pan.setValueAtTime(1, this.ctx.currentTime);
    }

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(volume * 0.2, this.ctx.currentTime);

    if (leftPanner && rightPanner) {
      leftOsc.connect(leftPanner);
      leftPanner.connect(gainNode);

      rightOsc.connect(rightPanner);
      rightPanner.connect(gainNode);
    } else {
      leftOsc.connect(gainNode);
      rightOsc.connect(gainNode);
    }

    gainNode.connect(this.masterGain);

    leftOsc.start();
    rightOsc.start();

    this.binaural = { leftOsc, rightOsc, gain: gainNode };
  }

  stopBinauralBeats() {
    if (this.binaural) {
      try {
        this.binaural.leftOsc.stop();
        this.binaural.rightOsc.stop();
        this.binaural.gain.disconnect();
      } catch (e) {}
      this.binaural = null;
    }
  }

  // Adjust volume for an active track
  setTrackVolume(trackName, volume) {
    if (trackName === 'binaural' && this.binaural) {
      this.binaural.gain.gain.setValueAtTime(volume * 0.2, this.ctx.currentTime);
    } else if (this.soundscapes[trackName] && this.soundscapes[trackName].gain) {
      this.soundscapes[trackName].gain.gain.setValueAtTime(volume * 0.4, this.ctx.currentTime);
    }
  }

  setMasterVolume(val) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }
}

// Global singleton instance
window.zenAudio = new AudioEngine();
