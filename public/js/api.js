/**
 * ZenZone Client API Service
 * Handles communication with the Express backend REST API,
 * with seamless offline fallback to LocalStorage when running statically.
 */

const API_BASE = window.location.origin.startsWith('http') ? '/api' : 'http://localhost:3000/api';

// Toast Notification Manager
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : '⚠️'}</span>
    <div>${message}</div>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Fallback LocalStorage Keys
const LS_KEYS = {
  MOODS: 'zenzone_local_moods',
  SESSIONS: 'zenzone_local_sessions',
  CALM_WALL: 'zenzone_local_calm_wall',
  SOS_LOGS: 'zenzone_local_sos_logs'
};

const apiService = {
  // Poses
  async getPoses(targetArea = '') {
    try {
      const url = targetArea ? `${API_BASE}/poses?targetArea=${encodeURIComponent(targetArea)}` : `${API_BASE}/poses`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return data.poses || [];
      }
    } catch (e) {
      console.info('[API] Backend offline, fetching static poses...');
    }

    // Static fallback
    try {
      const res = await fetch('data/deskPoses.json');
      if (res.ok) return await res.json();
    } catch (e) {}

    return [];
  },

  // Affirmations
  async getRandomAffirmation() {
    try {
      const res = await fetch(`${API_BASE}/affirmations/random`);
      if (res.ok) {
        const data = await res.json();
        return data.affirmation;
      }
    } catch (e) {}

    // Static local fallback
    return {
      quote: "One exam does not define your worth, creative capability, or future possibilities.",
      category: "Perspective",
      prompt: "Place one hand over your chest, breathe slowly, and remind yourself that you are capable."
    };
  },

  // Mood Journal
  async getMoods(page = 1, limit = 10) {
    try {
      const res = await fetch(`${API_BASE}/moods?page=${page}&limit=${limit}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    // LocalStorage fallback
    const local = JSON.parse(localStorage.getItem(LS_KEYS.MOODS) || '[]');
    return {
      success: true,
      items: local.slice((page - 1) * limit, page * limit),
      pagination: { total: local.length, page, limit, totalPages: Math.ceil(local.length / limit) || 1 }
    };
  },

  async getMoodAnalytics() {
    try {
      const res = await fetch(`${API_BASE}/moods/analytics`);
      if (res.ok) {
        const data = await res.json();
        return data.analytics;
      }
    } catch (e) {}

    // Fallback analytics calculation
    const local = JSON.parse(localStorage.getItem(LS_KEYS.MOODS) || '[]');
    const total = local.reduce((sum, m) => sum + (m.stressLevel || 3), 0);
    return {
      count: local.length,
      averageStress: local.length ? Number((total / local.length).toFixed(1)) : 0,
      distribution: {},
      recentTrends: local.slice(-14)
    };
  },

  async addMood(entry) {
    try {
      const res = await fetch(`${API_BASE}/moods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      if (res.ok) {
        const data = await res.json();
        showToast('Daily mood check-in recorded successfully!');
        return data.entry;
      }
    } catch (e) {}

    // Offline save
    const local = JSON.parse(localStorage.getItem(LS_KEYS.MOODS) || '[]');
    const newEntry = { id: 'm_' + Date.now(), ...entry, date: new Date().toISOString() };
    local.unshift(newEntry);
    localStorage.setItem(LS_KEYS.MOODS, JSON.stringify(local));
    showToast('Mood check-in saved locally (offline mode).');
    return newEntry;
  },

  async deleteMood(id) {
    try {
      const res = await fetch(`${API_BASE}/moods/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch (e) {}

    const local = JSON.parse(localStorage.getItem(LS_KEYS.MOODS) || '[]');
    const filtered = local.filter(m => m.id !== id);
    localStorage.setItem(LS_KEYS.MOODS, JSON.stringify(filtered));
    return true;
  },

  // Sessions
  async logSession(session) {
    try {
      const res = await fetch(`${API_BASE}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const local = JSON.parse(localStorage.getItem(LS_KEYS.SESSIONS) || '[]');
    local.unshift({ id: 's_' + Date.now(), ...session, completedAt: new Date().toISOString() });
    localStorage.setItem(LS_KEYS.SESSIONS, JSON.stringify(local));
  },

  // Calm Wall
  async getCalmWall() {
    try {
      const res = await fetch(`${API_BASE}/calm-wall`);
      if (res.ok) {
        const data = await res.json();
        return data.posts || [];
      }
    } catch (e) {}

    return JSON.parse(localStorage.getItem(LS_KEYS.CALM_WALL) || '[]');
  },

  async postCalmNote(post) {
    try {
      const res = await fetch(`${API_BASE}/calm-wall`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
      if (res.ok) {
        const data = await res.json();
        showToast('Solidarity note posted to Campus Calm Wall!');
        return data.post;
      }
    } catch (e) {}

    const local = JSON.parse(localStorage.getItem(LS_KEYS.CALM_WALL) || '[]');
    const newPost = { id: 'cw_' + Date.now(), ...post, likes: 0, createdAt: new Date().toISOString() };
    local.unshift(newPost);
    localStorage.setItem(LS_KEYS.CALM_WALL, JSON.stringify(local));
    showToast('Note posted locally (offline mode)!');
    return newPost;
  },

  async likeCalmNote(id) {
    try {
      const res = await fetch(`${API_BASE}/calm-wall/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        return data.post;
      }
    } catch (e) {}

    const local = JSON.parse(localStorage.getItem(LS_KEYS.CALM_WALL) || '[]');
    const item = local.find(i => i.id === id);
    if (item) {
      item.likes = (item.likes || 0) + 1;
      localStorage.setItem(LS_KEYS.CALM_WALL, JSON.stringify(local));
      return item;
    }
  },

  // SOS Log
  async logSos(payload) {
    try {
      await fetch(`${API_BASE}/sos/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      const local = JSON.parse(localStorage.getItem(LS_KEYS.SOS_LOGS) || '[]');
      local.unshift(payload);
      localStorage.setItem(LS_KEYS.SOS_LOGS, JSON.stringify(local));
    }
  }
};

window.apiService = apiService;
window.showToast = showToast;
