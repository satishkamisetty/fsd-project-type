/**
 * ZenZone Ambient Soundscape & Binaural Beats Mixer
 * Multi-track audio mixer providing Gentle Rain, Forest Birds,
 * White Noise, Temple Bells, and 10Hz Alpha Binaural Beats.
 */

class SoundscapeController {
  constructor() {
    this.tracks = {
      rain: { active: false, volume: 0.5 },
      forest: { active: false, volume: 0.5 },
      whiteNoise: { active: false, volume: 0.4 },
      bells: { active: false, volume: 0.5 },
      binaural: { active: false, volume: 0.4, freq: 10 }
    };

    this.initDOM();
  }

  initDOM() {
    // Rain
    this.setupTrack('rain', 'toggleRainBtn', 'rainVolumeSlider', (on, vol) => {
      if (on) window.zenAudio.startRain(vol);
      else window.zenAudio.stopRain();
    });

    // Forest Birds
    this.setupTrack('forest', 'toggleForestBtn', 'forestVolumeSlider', (on, vol) => {
      if (on) window.zenAudio.startForest(vol);
      else window.zenAudio.stopForest();
    });

    // White Noise
    this.setupTrack('whiteNoise', 'toggleWhiteNoiseBtn', 'whiteNoiseVolumeSlider', (on, vol) => {
      if (on) window.zenAudio.startWhiteNoise(vol);
      else window.zenAudio.stopWhiteNoise();
    });

    // Temple Bells
    this.setupTrack('bells', 'toggleBellsBtn', 'bellsVolumeSlider', (on, vol) => {
      if (on) window.zenAudio.startTempleBells(vol);
      else window.zenAudio.stopTempleBells();
    });

    // Binaural Beats
    this.setupTrack('binaural', 'toggleBinauralBtn', 'binauralVolumeSlider', (on, vol) => {
      if (on) window.zenAudio.startBinauralBeats(this.tracks.binaural.freq, vol);
      else window.zenAudio.stopBinauralBeats();
    });

    // Binaural Frequency pills
    const freqPills = document.querySelectorAll('.binaural-freq-pill');
    if (freqPills) {
      freqPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
          freqPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.tracks.binaural.freq = parseInt(pill.dataset.freq || '10');
          if (this.tracks.binaural.active) {
            window.zenAudio.stopBinauralBeats();
            window.zenAudio.startBinauralBeats(this.tracks.binaural.freq, this.tracks.binaural.volume);
          }
        });
      });
    }

    // Master volume
    const masterSlider = document.getElementById('masterVolumeSlider');
    if (masterSlider) {
      masterSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (window.zenAudio) window.zenAudio.setMasterVolume(val);
      });
    }
  }

  setupTrack(trackKey, btnId, sliderId, callback) {
    const btn = document.getElementById(btnId);
    const slider = document.getElementById(sliderId);

    if (btn) {
      btn.addEventListener('click', () => {
        if (!window.zenAudio) return;
        window.zenAudio.ensureContext();

        this.tracks[trackKey].active = !this.tracks[trackKey].active;
        const active = this.tracks[trackKey].active;

        if (active) {
          btn.textContent = 'Playing ⏸';
          btn.classList.add('btn-primary');
          btn.classList.remove('btn-outline');
        } else {
          btn.textContent = 'Play ▶';
          btn.classList.remove('btn-primary');
          btn.classList.add('btn-outline');
        }

        callback(active, this.tracks[trackKey].volume);
      });
    }

    if (slider) {
      slider.addEventListener('input', (e) => {
        const vol = parseFloat(e.target.value);
        this.tracks[trackKey].volume = vol;
        if (this.tracks[trackKey].active && window.zenAudio) {
          window.zenAudio.setTrackVolume(trackKey, vol);
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.soundscapeController = new SoundscapeController();
});
