/**
 * ZenZone Posture Break & Screen Dimmer
 * Protects students from eye strain and cervical fatigue by prompting
 * a gentle screen dimmer rest every 45 minutes of continuous study.
 */

class ScreenDimmerController {
  constructor() {
    this.intervalMinutes = 45;
    this.timerId = null;
    this.overlay = document.getElementById('screenDimmerOverlay');
    this.testBtn = document.getElementById('testScreenDimmerBtn');
    this.dismissBtn = document.getElementById('dismissDimmerBtn');
    this.toggleCheckbox = document.getElementById('enableScreenDimmerToggle');

    this.init();
  }

  init() {
    if (this.testBtn) {
      this.testBtn.addEventListener('click', () => this.triggerBreak());
    }

    if (this.dismissBtn) {
      this.dismissBtn.addEventListener('click', () => this.dismissBreak());
    }

    if (this.toggleCheckbox) {
      this.toggleCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.startStudyTimer();
          if (window.showToast) window.showToast('45-minute Posture Break timer activated.');
        } else {
          this.stopStudyTimer();
          if (window.showToast) window.showToast('Posture Break timer disabled.');
        }
      });

      // Default enabled
      if (this.toggleCheckbox.checked) {
        this.startStudyTimer();
      }
    }
  }

  startStudyTimer() {
    this.stopStudyTimer();
    this.timerId = setTimeout(() => {
      this.triggerBreak();
      this.startStudyTimer();
    }, this.intervalMinutes * 60 * 1000);
  }

  stopStudyTimer() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  triggerBreak() {
    if (!this.overlay) return;
    this.overlay.classList.add('active');
    if (window.zenAudio) {
      window.zenAudio.playSingingBowlChime(0.8);
    }
  }

  dismissBreak() {
    if (!this.overlay) return;
    this.overlay.classList.remove('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.screenDimmer = new ScreenDimmerController();
});
