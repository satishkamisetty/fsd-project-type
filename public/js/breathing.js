/**
 * ZenZone Box Breathing (4-4-4-4) State Machine & Visualizer
 * Regulates the autonomic nervous system via paced respiration:
 * Inhale 4s -> Hold In 4s -> Exhale 4s -> Hold Out 4s.
 * Includes defensive DOM lookups and Web Audio API synchronization.
 */

class BoxBreathingController {
  constructor() {
    this.phaseDuration = 4; // 4 seconds per phase
    this.phases = [
      { name: 'Inhale', class: 'inhale', cue: 'Breathe in slowly through your nose...', audio: 'inhale' },
      { name: 'Hold In', class: 'hold-in', cue: 'Hold gently with lungs full...', audio: 'hold' },
      { name: 'Exhale', class: 'exhale', cue: 'Release smoothly through parted lips...', audio: 'exhale' },
      { name: 'Hold Out', class: 'hold-out', cue: 'Rest in the quiet stillness...', audio: 'hold' }
    ];

    this.currentPhaseIdx = 0;
    this.secondsLeftInPhase = this.phaseDuration;
    this.completedCycles = 0;
    this.totalSeconds = 0;
    this.isRunning = false;
    this.timerId = null;

    this.initDOM();
  }

  initDOM() {
    this.orbEl = document.getElementById('breathingOrb');
    this.phaseTextEl = document.getElementById('breathingPhaseText');
    this.countdownEl = document.getElementById('breathingCountdown');
    this.cueEl = document.getElementById('breathingCue');
    this.cycleCountEl = document.getElementById('breathingCycleCount');
    this.durationCountEl = document.getElementById('breathingTotalDuration');
    this.startBtn = document.getElementById('breathingStartBtn');
    this.stopBtn = document.getElementById('breathingStopBtn');
    this.timelineSteps = document.querySelectorAll('.timeline-step');

    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => this.start());
    }
    if (this.stopBtn) {
      this.stopBtn.addEventListener('click', () => this.stop());
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    if (window.zenAudio) {
      window.zenAudio.ensureContext();
      window.zenAudio.playSingingBowlChime(1.0);
    }

    if (this.startBtn) this.startBtn.style.display = 'none';
    if (this.stopBtn) this.stopBtn.style.display = 'inline-flex';

    this.currentPhaseIdx = 0;
    this.secondsLeftInPhase = this.phaseDuration;
    this.updateUI();

    this.timerId = setInterval(() => this.tick(), 1000);
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.timerId);

    if (this.startBtn) this.startBtn.style.display = 'inline-flex';
    if (this.stopBtn) this.stopBtn.style.display = 'none';

    // Log practice session if ran for at least 30 seconds
    if (this.totalSeconds >= 30 && window.apiService) {
      window.apiService.logSession({
        type: 'Box Breathing',
        title: `Box Breathing (${this.completedCycles} cycles)`,
        durationSeconds: this.totalSeconds,
        completed: true
      });
      if (window.showToast) {
        window.showToast(`Recorded ${this.completedCycles} box breathing cycles!`);
      }
    }

    // Reset visualizer to rest
    if (this.orbEl) {
      this.orbEl.className = 'breathing-circle';
    }
    if (this.phaseTextEl) this.phaseTextEl.textContent = 'Ready';
    if (this.countdownEl) this.countdownEl.textContent = '4s';
    if (this.cueEl) this.cueEl.textContent = 'Click "Start Box Breathing" to begin';
  }

  tick() {
    this.totalSeconds++;
    this.secondsLeftInPhase--;

    if (this.secondsLeftInPhase <= 0) {
      // Transition to next phase
      this.secondsLeftInPhase = this.phaseDuration;
      this.currentPhaseIdx = (this.currentPhaseIdx + 1) % 4;

      if (this.currentPhaseIdx === 0) {
        this.completedCycles++;
        if (window.zenAudio) {
          window.zenAudio.playSingingBowlChime(1.1);
        }
      } else {
        if (window.zenAudio) {
          window.zenAudio.playSoftCue(this.phases[this.currentPhaseIdx].audio);
        }
      }
    }

    this.updateUI();
  }

  updateUI() {
    const currentPhase = this.phases[this.currentPhaseIdx];

    if (this.orbEl) {
      this.orbEl.className = `breathing-circle ${currentPhase.class}`;
    }
    if (this.phaseTextEl) {
      this.phaseTextEl.textContent = currentPhase.name;
    }
    if (this.countdownEl) {
      this.countdownEl.textContent = `${this.secondsLeftInPhase}s`;
    }
    if (this.cueEl) {
      this.cueEl.textContent = currentPhase.cue;
    }
    if (this.cycleCountEl) {
      this.cycleCountEl.textContent = this.completedCycles;
    }
    if (this.durationCountEl) {
      const mins = Math.floor(this.totalSeconds / 60);
      const secs = this.totalSeconds % 60;
      this.durationCountEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Update timeline pill indicators
    if (this.timelineSteps) {
      this.timelineSteps.forEach((step, idx) => {
        if (idx === this.currentPhaseIdx) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.boxBreathing = new BoxBreathingController();
});
