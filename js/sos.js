/**
 * ZenZone Exam Panic SOS Mode - 2-Minute Crisis De-escalation Routine
 * Quickly alleviates pre-exam panic attacks and acute cognitive overwhelm:
 * 1. Initial Stress Assessment (1-5)
 * 2. 5-4-3-2-1 Sensory Grounding Protocol
 * 3. 60-Second Guided Box Breathing with soothing Rain audio
 * 4. Cognitive Reframing Affirmation
 * 5. Post-session Relief Assessment & Stress Delta Logger
 */

class ExamPanicSOSController {
  constructor() {
    this.overlay = document.getElementById('sosOverlay');
    this.currentStep = 1;
    this.preStress = 5;
    this.postStress = 2;
    this.breathingCountdown = 60;
    this.breathingInterval = null;

    this.initDOM();
  }

  initDOM() {
    this.openBtns = document.querySelectorAll('.open-sos-btn');
    this.closeBtn = document.getElementById('sosCloseBtn');

    this.stepPanes = {
      1: document.getElementById('sosStep1'),
      2: document.getElementById('sosStep2'),
      3: document.getElementById('sosStep3'),
      4: document.getElementById('sosStep4'),
      5: document.getElementById('sosStep5')
    };

    // Sliders
    this.preSlider = document.getElementById('sosPreStressSlider');
    this.preValDisplay = document.getElementById('sosPreStressVal');
    this.postSlider = document.getElementById('sosPostStressSlider');
    this.postValDisplay = document.getElementById('sosPostStressVal');

    // Step 1 -> 2
    this.btnToStep2 = document.getElementById('sosBtnToStep2');
    // Step 2 -> 3
    this.btnToStep3 = document.getElementById('sosBtnToStep3');
    // Step 3 -> 4
    this.btnToStep4 = document.getElementById('sosBtnToStep4');
    // Step 4 -> 5
    this.btnToStep5 = document.getElementById('sosBtnToStep5');
    // Complete
    this.btnFinish = document.getElementById('sosBtnFinish');

    this.bindEvents();
  }

  bindEvents() {
    if (this.openBtns) {
      this.openBtns.forEach(btn => btn.addEventListener('click', () => this.open()));
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.preSlider && this.preValDisplay) {
      this.preSlider.addEventListener('input', (e) => {
        this.preStress = parseInt(e.target.value);
        this.preValDisplay.textContent = this.preStress;
      });
    }

    if (this.postSlider && this.postValDisplay) {
      this.postSlider.addEventListener('input', (e) => {
        this.postStress = parseInt(e.target.value);
        this.postValDisplay.textContent = this.postStress;
      });
    }

    if (this.btnToStep2) this.btnToStep2.addEventListener('click', () => this.goToStep(2));
    if (this.btnToStep3) this.btnToStep3.addEventListener('click', () => this.startSOSBreathing());
    if (this.btnToStep4) this.btnToStep4.addEventListener('click', () => this.showAffirmation());
    if (this.btnToStep5) this.btnToStep5.addEventListener('click', () => this.goToStep(5));
    if (this.btnFinish) this.btnFinish.addEventListener('click', () => this.completeSOS());
  }

  open() {
    if (!this.overlay) return;
    this.overlay.classList.add('active');
    this.goToStep(1);

    // Play initial soothing chime and activate gentle rain background
    if (window.zenAudio) {
      window.zenAudio.ensureContext();
      window.zenAudio.playSingingBowlChime(0.9);
      window.zenAudio.startRain(0.4);
    }
  }

  close() {
    if (!this.overlay) return;
    this.overlay.classList.remove('active');
    if (this.breathingInterval) {
      clearInterval(this.breathingInterval);
    }
    // Stop rain sound
    if (window.zenAudio) {
      window.zenAudio.stopRain();
    }
  }

  goToStep(stepNum) {
    this.currentStep = stepNum;
    Object.keys(this.stepPanes).forEach(k => {
      const pane = this.stepPanes[k];
      if (pane) {
        if (parseInt(k) === stepNum) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      }
    });
  }

  startSOSBreathing() {
    this.goToStep(3);
    this.breathingCountdown = 60; // 60 seconds of box breathing
    const timerText = document.getElementById('sosBreathingCountdown');
    const phaseText = document.getElementById('sosBreathingPhase');
    const circle = document.getElementById('sosBreathingCircle');

    const phases = ['Inhale (4s)', 'Hold (4s)', 'Exhale (4s)', 'Hold (4s)'];
    let phaseIdx = 0;
    let secInPhase = 0;

    if (this.breathingInterval) clearInterval(this.breathingInterval);

    this.breathingInterval = setInterval(() => {
      this.breathingCountdown--;
      secInPhase++;

      if (secInPhase >= 4) {
        secInPhase = 0;
        phaseIdx = (phaseIdx + 1) % 4;
        if (window.zenAudio) {
          window.zenAudio.playSoftCue(phaseIdx === 0 ? 'inhale' : phaseIdx === 2 ? 'exhale' : 'hold');
        }
      }

      if (timerText) timerText.textContent = `${this.breathingCountdown}s remaining`;
      if (phaseText) phaseText.textContent = phases[phaseIdx];

      // Update circle scale
      if (circle) {
        if (phaseIdx === 0 || phaseIdx === 1) {
          circle.style.transform = 'scale(1.3)';
        } else {
          circle.style.transform = 'scale(0.85)';
        }
      }

      if (this.breathingCountdown <= 0) {
        clearInterval(this.breathingInterval);
        if (window.zenAudio) {
          window.zenAudio.playSingingBowlChime(1.1);
        }
        if (this.btnToStep4) this.btnToStep4.style.display = 'inline-flex';
      }
    }, 1000);
  }

  async showAffirmation() {
    this.goToStep(4);
    const quoteEl = document.getElementById('sosAffirmationQuote');
    const promptEl = document.getElementById('sosAffirmationPrompt');

    if (window.apiService) {
      const aff = await window.apiService.getRandomAffirmation();
      if (quoteEl && aff) quoteEl.textContent = `"${aff.quote}"`;
      if (promptEl && aff) promptEl.textContent = aff.prompt;
    }
  }

  async completeSOS() {
    const delta = this.preStress - this.postStress;
    const reflectionText = document.getElementById('sosReflectionNotes')?.value || 'SOS De-escalation routine completed.';

    // Log to backend SOS and Mood endpoints
    if (window.apiService) {
      await window.apiService.logSos({
        preStress: this.preStress,
        postStress: this.postStress,
        reflection: reflectionText
      });

      // Also log as daily mood entry
      await window.apiService.addMood({
        stressLevel: this.postStress,
        mood: this.postStress <= 2 ? 'calm' : this.postStress === 3 ? 'neutral' : 'anxious',
        notes: `[Exam SOS Protocol] Stress reduced from ${this.preStress}/5 down to ${this.postStress}/5. ${reflectionText}`,
        tags: ['sos-relief', 'exam-panic']
      });
    }

    if (window.showToast) {
      window.showToast(`SOS De-escalation complete! Stress level dropped by ${Math.max(0, delta)} points.`);
    }

    // Refresh journal charts and entries
    if (window.journalController) {
      window.journalController.loadData();
    }

    this.close();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.examSOS = new ExamPanicSOSController();
});
