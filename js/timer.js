/**
 * ZenZone Guided Meditation Circular Timer
 * Features SVG countdown ring, synthesized Tibetan bowl chime,
 * preset selectors, and session persistence.
 */

class MeditationTimer {
  constructor() {
    this.totalDuration = 5 * 60; // 5 minutes default
    this.timeRemaining = this.totalDuration;
    this.isRunning = false;
    this.timerId = null;
    this.sessionTitle = 'Micro-Meditation (5m)';
    this.circumference = 2 * Math.PI * 110; // r = 110 => ~691.15

    this.initDOM();
  }

  initDOM() {
    this.digitsEl = document.getElementById('timerDigits');
    this.progressRing = document.getElementById('timerProgressRing');
    this.startBtn = document.getElementById('timerStartBtn');
    this.pauseBtn = document.getElementById('timerPauseBtn');
    this.resetBtn = document.getElementById('timerResetBtn');
    this.sessionLabel = document.getElementById('timerSessionLabel');
    this.presetPills = document.querySelectorAll('.preset-pill');

    if (this.progressRing) {
      this.progressRing.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
      this.progressRing.style.strokeDashoffset = '0';
    }

    if (this.startBtn) this.startBtn.addEventListener('click', () => this.start());
    if (this.pauseBtn) this.pauseBtn.addEventListener('click', () => this.pause());
    if (this.resetBtn) this.resetBtn.addEventListener('click', () => this.reset());

    if (this.presetPills) {
      this.presetPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
          const mins = parseInt(e.currentTarget.dataset.minutes || '5');
          this.setDuration(mins);
          this.presetPills.forEach(p => p.classList.remove('active'));
          e.currentTarget.classList.add('active');
        });
      });
    }

    this.updateDisplay();
  }

  setDuration(minutes) {
    this.pause();
    this.totalDuration = minutes * 60;
    this.timeRemaining = this.totalDuration;
    this.sessionTitle = `Guided Session (${minutes}m)`;
    if (this.sessionLabel) this.sessionLabel.textContent = this.sessionTitle;
    this.updateDisplay();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    if (window.zenAudio) {
      window.zenAudio.ensureContext();
      window.zenAudio.playSingingBowlChime(1.0);
    }

    if (this.startBtn) this.startBtn.style.display = 'none';
    if (this.pauseBtn) this.pauseBtn.style.display = 'inline-flex';

    this.timerId = setInterval(() => this.tick(), 1000);
  }

  pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.timerId);

    if (this.startBtn) this.startBtn.style.display = 'inline-flex';
    if (this.pauseBtn) this.pauseBtn.style.display = 'none';
  }

  reset() {
    this.pause();
    this.timeRemaining = this.totalDuration;
    this.updateDisplay();
  }

  tick() {
    if (this.timeRemaining > 0) {
      this.timeRemaining--;
      this.updateDisplay();
    } else {
      this.onComplete();
    }
  }

  onComplete() {
    this.pause();
    if (window.zenAudio) {
      window.zenAudio.playSingingBowlChime(1.2);
    }

    if (window.apiService) {
      window.apiService.logSession({
        type: 'Meditation',
        title: this.sessionTitle,
        durationSeconds: this.totalDuration,
        completed: true
      });
    }

    if (window.showToast) {
      window.showToast('Meditation session completed! Mindful pause logged.');
    }

    this.reset();
  }

  updateDisplay() {
    if (this.digitsEl) {
      const mins = Math.floor(this.timeRemaining / 60);
      const secs = this.timeRemaining % 60;
      this.digitsEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    if (this.progressRing) {
      const fraction = 1 - (this.timeRemaining / this.totalDuration);
      const offset = this.circumference * (1 - fraction);
      this.progressRing.style.strokeDashoffset = offset;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.meditationTimer = new MeditationTimer();
});
