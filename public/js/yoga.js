/**
 * ZenZone Curated Micro-Yoga Pose Gallery Controller
 * Manages 10 authentic desk- and chair-friendly yoga poses,
 * filterable by anatomical target, with a modal popup and stretch timer.
 */

class DeskYogaController {
  constructor() {
    this.poses = [];
    this.currentFilter = 'all';
    this.activePose = null;
    this.stretchTimerInterval = null;
    this.secondsRemaining = 0;

    this.initDOM();
    this.loadPoses();
  }

  initDOM() {
    this.grid = document.getElementById('yogaPosesGrid');
    this.filterButtons = document.querySelectorAll('.yoga-filter-btn');
    this.modal = document.getElementById('yogaModal');
    this.closeModalBtn = document.getElementById('yogaModalCloseBtn');

    // Modal elements
    this.modalTitle = document.getElementById('modalPoseTitle');
    this.modalSanskrit = document.getElementById('modalPoseSanskrit');
    this.modalTarget = document.getElementById('modalPoseTarget');
    this.modalDesc = document.getElementById('modalPoseDesc');
    this.modalBenefit = document.getElementById('modalPoseBenefit');
    this.modalBreathing = document.getElementById('modalPoseBreathing');
    this.modalCues = document.getElementById('modalPoseCues');
    this.modalContra = document.getElementById('modalPoseContra');
    this.modalTimerDisplay = document.getElementById('modalStretchTimerDisplay');
    this.modalTimerBtn = document.getElementById('modalStretchTimerBtn');

    if (this.filterButtons) {
      this.filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.filterButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentFilter = btn.dataset.filter;
          this.renderGrid();
        });
      });
    }

    if (this.closeModalBtn) {
      this.closeModalBtn.addEventListener('click', () => this.closeModal());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });
    }

    if (this.modalTimerBtn) {
      this.modalTimerBtn.addEventListener('click', () => this.toggleStretchTimer());
    }
  }

  async loadPoses() {
    if (window.apiService) {
      this.poses = await window.apiService.getPoses();
      this.renderGrid();
    }
  }

  renderGrid() {
    if (!this.grid) return;

    let filtered = this.poses;
    if (this.currentFilter !== 'all') {
      filtered = this.poses.filter(p => {
        const target = (p.targetArea || '').toLowerCase();
        return target.includes(this.currentFilter.toLowerCase());
      });
    }

    if (!filtered.length) {
      this.grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No poses found for this filter category.</p>`;
      return;
    }

    this.grid.innerHTML = filtered.map(pose => `
      <div class="yoga-card">
        <div class="yoga-card-body">
          <div class="yoga-card-target">${pose.targetArea}</div>
          <h3 class="yoga-card-title">${pose.name}</h3>
          <div class="yoga-card-sanskrit">${pose.sanskrit}</div>
          <p class="yoga-card-desc">${pose.description}</p>
          <div class="yoga-card-footer">
            <span class="badge badge-sage">⏱ ${pose.durationSeconds}s</span>
            <button class="btn btn-outline" style="padding: 0.4rem 0.9rem; font-size: 0.85rem;" onclick="window.deskYoga.openModal('${pose.id}')">
              Practice Pose →
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  openModal(poseId) {
    const pose = this.poses.find(p => p.id === poseId);
    if (!pose || !this.modal) return;

    this.activePose = pose;
    this.secondsRemaining = pose.durationSeconds || 60;

    if (this.modalTitle) this.modalTitle.textContent = pose.name;
    if (this.modalSanskrit) this.modalSanskrit.textContent = pose.sanskrit;
    if (this.modalTarget) this.modalTarget.textContent = pose.targetArea;
    if (this.modalDesc) this.modalDesc.textContent = pose.description;
    if (this.modalBenefit) this.modalBenefit.textContent = pose.studyBenefit;
    if (this.modalBreathing) this.modalBreathing.textContent = pose.breathingCue;
    if (this.modalContra) this.modalContra.textContent = pose.contraindications;

    if (this.modalCues && pose.alignmentCues) {
      this.modalCues.innerHTML = pose.alignmentCues.map(cue => `<li>${cue}</li>`).join('');
    }

    this.updateTimerDisplay();
    if (this.modalTimerBtn) this.modalTimerBtn.textContent = 'Start Stretch Timer';

    this.modal.classList.add('active');

    // Chime
    if (window.zenAudio) {
      window.zenAudio.playSingingBowlChime(1.0);
    }
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    if (this.stretchTimerInterval) {
      clearInterval(this.stretchTimerInterval);
      this.stretchTimerInterval = null;
    }
  }

  toggleStretchTimer() {
    if (this.stretchTimerInterval) {
      clearInterval(this.stretchTimerInterval);
      this.stretchTimerInterval = null;
      if (this.modalTimerBtn) this.modalTimerBtn.textContent = 'Resume Stretch';
    } else {
      if (this.modalTimerBtn) this.modalTimerBtn.textContent = 'Pause Stretch';
      if (window.zenAudio) {
        window.zenAudio.ensureContext();
      }

      this.stretchTimerInterval = setInterval(() => {
        if (this.secondsRemaining > 0) {
          this.secondsRemaining--;
          this.updateTimerDisplay();
        } else {
          clearInterval(this.stretchTimerInterval);
          this.stretchTimerInterval = null;
          if (window.zenAudio) {
            window.zenAudio.playSingingBowlChime(1.2);
          }
          if (this.modalTimerBtn) this.modalTimerBtn.textContent = 'Stretch Complete! ✓';

          // Log session
          if (window.apiService && this.activePose) {
            window.apiService.logSession({
              type: 'Desk Yoga',
              title: `Desk Yoga: ${this.activePose.name}`,
              durationSeconds: this.activePose.durationSeconds,
              completed: true
            });
            if (window.showToast) {
              window.showToast(`Completed ${this.activePose.name}! Mindful movement logged.`);
            }
          }
        }
      }, 1000);
    }
  }

  updateTimerDisplay() {
    if (this.modalTimerDisplay) {
      const mins = Math.floor(this.secondsRemaining / 60);
      const secs = this.secondsRemaining % 60;
      this.modalTimerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.deskYoga = new DeskYogaController();
});
