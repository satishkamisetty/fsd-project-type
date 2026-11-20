/**
 * ZenZone – Session Log Manager
 * Handles local storage persistence, table rendering,
 * and practice statistics (Total sessions, total minutes, streak).
 */

class SessionLogManager {
  constructor() {
    this.storageKey = 'zenzone_session_logs';
    this.tableBody = document.getElementById('sessionTableBody');
    this.totalMinutesEl = document.getElementById('totalMinutesCount');
    this.totalSessionsEl = document.getElementById('totalSessionsCount');
    this.clearBtn = document.getElementById('clearHistoryBtn');

    this.sessions = this.loadSessions();
    this.init();
  }

  init() {
    this.render();

    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset your meditation history?")) {
          this.clearSessions();
        }
      });
    }
  }

  loadSessions() {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error("Error reading session logs from localStorage:", e);
      }
    }

    // Default sample data as referenced in project requirements
    const defaultSessions = [
      { id: 1, date: "17 Nov", title: "Morning Meditation", duration: 5, category: "Meditation", completed: true },
      { id: 2, date: "18 Nov", title: "Stress Relief", duration: 10, category: "Meditation", completed: true },
      { id: 3, date: "19 Nov", title: "Focus Meditation", duration: 15, category: "Meditation", completed: true }
    ];

    this.saveSessions(defaultSessions);
    return defaultSessions;
  }

  saveSessions(sessions) {
    localStorage.setItem(this.storageKey, JSON.stringify(sessions));
  }

  addSession(sessionData) {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    const newSession = {
      id: Date.now(),
      date: formattedDate,
      title: sessionData.title || "Custom Meditation",
      duration: sessionData.duration || 5,
      category: sessionData.category || "Meditation",
      completed: sessionData.completed !== undefined ? sessionData.completed : true
    };

    this.sessions.unshift(newSession); // Add to beginning
    this.saveSessions(this.sessions);
    this.render();
  }

  clearSessions() {
    this.sessions = [];
    localStorage.removeItem(this.storageKey);
    this.render();
  }

  render() {
    if (!this.tableBody) return;

    if (this.sessions.length === 0) {
      this.tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--color-muted); padding: 2rem;">
            No meditation sessions recorded yet. Start the timer above to log your first practice!
          </td>
        </tr>
      `;
    } else {
      this.tableBody.innerHTML = this.sessions.map(s => `
        <tr>
          <td><strong>${s.date}</strong></td>
          <td>${s.title}</td>
          <td>⏱ ${s.duration} min</td>
          <td><span class="badge badge-sage">${s.category}</span></td>
          <td><span class="status-badge-done">✓ Completed</span></td>
        </tr>
      `).join('');
    }

    // Calculate metrics
    const totalMinutes = this.sessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    const totalCount = this.sessions.length;

    if (this.totalMinutesEl) {
      this.totalMinutesEl.textContent = `${totalMinutes} min`;
    }
    if (this.totalSessionsEl) {
      this.totalSessionsEl.textContent = totalCount;
    }
  }
}

// Instantiate upon DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.sessionLogManager = new SessionLogManager();
});
