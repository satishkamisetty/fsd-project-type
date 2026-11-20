/**
 * ZenZone Daily Mood & Stress Journal Controller
 * Captures stress ratings (1-5), mood emojis, reflections,
 * and renders interactive weekly trend curves using Chart.js.
 */

class MoodJournalController {
  constructor() {
    this.selectedMood = 'calm';
    this.currentStress = 3;
    this.chartInstance = null;
    this.currentPage = 1;

    this.initDOM();
    this.loadData();
  }

  initDOM() {
    this.form = document.getElementById('moodCheckInForm');
    this.stressSlider = document.getElementById('journalStressSlider');
    this.stressValDisplay = document.getElementById('journalStressValDisplay');
    this.moodBtns = document.querySelectorAll('.mood-btn');
    this.notesInput = document.getElementById('journalNotesInput');
    this.chartCanvas = document.getElementById('stressTrendChart');
    this.entriesList = document.getElementById('journalEntriesList');

    // Metrics displays
    this.avgStressEl = document.getElementById('metricAvgStress');
    this.totalLogsEl = document.getElementById('metricTotalLogs');
    this.dominantMoodEl = document.getElementById('metricDominantMood');

    if (this.stressSlider && this.stressValDisplay) {
      this.stressSlider.addEventListener('input', (e) => {
        this.currentStress = parseInt(e.target.value);
        this.stressValDisplay.textContent = `${this.currentStress} / 5`;
      });
    }

    if (this.moodBtns) {
      this.moodBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.moodBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.selectedMood = btn.dataset.mood;
        });
      });
    }

    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    const notes = this.notesInput ? this.notesInput.value.trim() : '';
    const tags = ['daily-checkin'];
    if (this.currentStress >= 4) tags.push('high-stress');
    if (this.currentStress <= 2) tags.push('calm');

    const payload = {
      stressLevel: this.currentStress,
      mood: this.selectedMood,
      notes,
      tags
    };

    if (window.apiService) {
      await window.apiService.addMood(payload);
      if (this.notesInput) this.notesInput.value = '';
      this.loadData();
    }
  }

  async loadData() {
    if (!window.apiService) return;

    // Load list entries
    const moodsData = await window.apiService.getMoods(this.currentPage, 10);
    this.renderEntries(moodsData.items || []);

    // Load analytics & render chart
    const analytics = await window.apiService.getMoodAnalytics();
    this.updateMetrics(analytics);
    this.renderChart(analytics.recentTrends || []);
  }

  updateMetrics(analytics) {
    if (!analytics) return;

    if (this.avgStressEl) {
      this.avgStressEl.textContent = analytics.averageStress ? `${analytics.averageStress} / 5` : 'N/A';
    }
    if (this.totalLogsEl) {
      this.totalLogsEl.textContent = analytics.count || '0';
    }
    if (this.dominantMoodEl && analytics.distribution) {
      const dist = analytics.distribution;
      let topMood = 'Calm';
      let maxCount = -1;
      Object.keys(dist).forEach(m => {
        if (dist[m] > maxCount) {
          maxCount = dist[m];
          topMood = m.charAt(0).toUpperCase() + m.slice(1);
        }
      });
      this.dominantMoodEl.textContent = topMood;
    }
  }

  renderChart(trends) {
    if (!this.chartCanvas) return;

    // Format dates & scores
    const labels = trends.map(t => {
      const d = new Date(t.date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });
    const scores = trends.map(t => t.stressLevel);

    // If Chart.js is loaded from CDN
    if (window.Chart) {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      const ctx = this.chartCanvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 260);
      gradient.addColorStop(0, 'rgba(82, 107, 88, 0.35)');
      gradient.addColorStop(1, 'rgba(232, 239, 229, 0.02)');

      this.chartInstance = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: labels.length ? labels : ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
          datasets: [{
            label: 'Stress Level (1-5)',
            data: scores.length ? scores : [4, 5, 3, 4, 2, 2, 1],
            borderColor: '#526B58',
            backgroundColor: gradient,
            borderWidth: 2.8,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#526B58',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `Stress Level: ${ctx.parsed.y} / 5`
              }
            }
          },
          scales: {
            y: {
              min: 1,
              max: 5,
              ticks: {
                stepSize: 1,
                callback: (val) => {
                  const map = { 1: '1 (Calm)', 2: '2', 3: '3 (Neutral)', 4: '4', 5: '5 (High Panic)' };
                  return map[val] || val;
                }
              },
              grid: { color: 'rgba(169, 191, 168, 0.2)' }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      });
    } else {
      // Fallback SVG chart if CDN was blocked or offline
      this.renderFallbackSVG(trends);
    }
  }

  renderFallbackSVG(trends) {
    const parent = this.chartCanvas.parentElement;
    if (!parent) return;

    const data = trends.length ? trends : [
      { stressLevel: 4 }, { stressLevel: 5 }, { stressLevel: 3 },
      { stressLevel: 4 }, { stressLevel: 2 }, { stressLevel: 2 }, { stressLevel: 1 }
    ];

    const width = 500;
    const height = 220;
    const stepX = width / (data.length - 1 || 1);

    const points = data.map((d, i) => {
      const x = i * stepX;
      const y = height - ((d.stressLevel - 1) / 4) * (height - 40) - 20;
      return `${x},${y}`;
    }).join(' ');

    parent.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:100%; overflow:visible;">
        <polyline fill="none" stroke="#526B58" stroke-width="3" points="${points}" />
      </svg>
    `;
  }

  renderEntries(items) {
    if (!this.entriesList) return;

    if (!items.length) {
      this.entriesList.innerHTML = `<p style="padding:1rem; text-align:center;">No mood entries recorded yet. Complete your first check-in above!</p>`;
      return;
    }

    const emojiMap = {
      calm: '😊',
      content: '😌',
      neutral: '😐',
      anxious: '😰',
      overwhelmed: '😫'
    };

    this.entriesList.innerHTML = items.map(entry => {
      const d = new Date(entry.date);
      const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      const emoji = emojiMap[entry.mood] || '🌿';

      return `
        <div class="card" style="padding: 1.2rem; margin-bottom: 0.9rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.35rem;">
              <span style="font-size: 1.5rem;">${emoji}</span>
              <strong>Stress Level: ${entry.stressLevel} / 5</strong>
              <span class="badge badge-sage" style="font-size: 0.75rem;">${entry.mood}</span>
            </div>
            <p style="margin: 0; font-size: 0.9rem; color: var(--color-charcoal);">${entry.notes || 'No reflection note attached.'}</p>
            <small style="color: var(--color-charcoal-muted); font-size: 0.78rem;">${dateStr}</small>
          </div>
          <button class="btn btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick="window.journalController.deleteEntry('${entry.id}')">
            Delete
          </button>
        </div>
      `;
    }).join('');
  }

  async deleteEntry(id) {
    if (confirm('Delete this journal check-in?')) {
      if (window.apiService) {
        await window.apiService.deleteMood(id);
        this.loadData();
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.journalController = new MoodJournalController();
});
