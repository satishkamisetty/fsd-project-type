/**
 * Persistent Data Tier Module
 * Provides indexed collections, atomic persistence, pagination, and trend aggregations.
 */

const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, 'data', 'store.json');
const POSES_FILE = path.join(__dirname, 'data', 'deskPoses.json');
const AFFIRMATIONS_FILE = path.join(__dirname, 'data', 'affirmations.json');

// Initial state and realistic sample data for student demo evaluation
function getSeedData() {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  return {
    moods: [
      {
        id: 'm1',
        stressLevel: 4,
        mood: 'anxious',
        notes: 'Finals week kicking off. Linear Algebra proof exam tomorrow morning.',
        tags: ['exam', 'sleep-deprived'],
        date: new Date(now - 6 * day).toISOString()
      },
      {
        id: 'm2',
        stressLevel: 5,
        mood: 'overwhelmed',
        notes: 'Stuck on Algorithms dynamic programming assignments. Feeling chest tightness.',
        tags: ['study-fatigue', 'exam'],
        date: new Date(now - 5 * day).toISOString()
      },
      {
        id: 'm3',
        stressLevel: 3,
        mood: 'neutral',
        notes: 'Used ZenZone box breathing for 6 minutes before heading into lab quiz.',
        tags: ['breathing', 'midterms'],
        date: new Date(now - 4 * day).toISOString()
      },
      {
        id: 'm4',
        stressLevel: 4,
        mood: 'anxious',
        notes: 'Late night revision. Shoulders and neck feeling very tense.',
        tags: ['cramming', 'posture'],
        date: new Date(now - 3 * day).toISOString()
      },
      {
        id: 'm5',
        stressLevel: 2,
        mood: 'content',
        notes: 'Practiced 10-minute chair yoga stretches and Tibetan bell meditation.',
        tags: ['desk-yoga', 'calm'],
        date: new Date(now - 2 * day).toISOString()
      },
      {
        id: 'm6',
        stressLevel: 2,
        mood: 'calm',
        notes: 'Review complete. Feeling much more grounded and mentally centered.',
        tags: ['focus', 'prepared'],
        date: new Date(now - 1 * day).toISOString()
      },
      {
        id: 'm7',
        stressLevel: 1,
        mood: 'calm',
        notes: 'Exam went smoothly. Grateful for taking intentional micro-breaks!',
        tags: ['success', 'relief'],
        date: new Date(now).toISOString()
      }
    ],
    sessions: [
      {
        id: 's1',
        type: 'Box Breathing',
        title: 'Morning 4-4-4-4 Nervous System Reset',
        durationSeconds: 240,
        completed: true,
        completedAt: new Date(now - 2 * day).toISOString()
      },
      {
        id: 's2',
        type: 'Meditation',
        title: 'Exam Anxiety Decompression',
        durationSeconds: 600,
        completed: true,
        completedAt: new Date(now - 1 * day).toISOString()
      },
      {
        id: 's3',
        type: 'Desk Yoga',
        title: 'Neck & Upper Back Relief Flow',
        durationSeconds: 300,
        completed: true,
        completedAt: new Date(now).toISOString()
      }
    ],
    calmWall: [
      {
        id: 'cw1',
        author: 'CS Sophomore',
        tag: 'Exams',
        message: 'Remember that your brain cannot solve complex problems in fight-or-flight mode. Take 3 deep breaths before starting section 2.',
        likes: 14,
        createdAt: new Date(now - 2 * day).toISOString()
      },
      {
        id: 'cw2',
        author: 'Pre-Med Senior',
        tag: 'Solidarity',
        message: 'No grade defines your humanity or future success. Drink a glass of water, unclamp your jaw, and give yourself credit for trying hard.',
        likes: 22,
        createdAt: new Date(now - 1 * day).toISOString()
      },
      {
        id: 'cw3',
        author: 'Engineering Junior',
        tag: 'Breathwork',
        message: 'Did the 2-minute SOS breathing right before my database test today—it honestly stopped my hands from shaking. You got this!',
        likes: 9,
        createdAt: new Date(now).toISOString()
      }
    ],
    sosLogs: [
      {
        id: 'sos1',
        preStress: 5,
        postStress: 2,
        stressDelta: 3,
        reflection: 'Acute anxiety before morning exam reduced significantly after grounding & box breathing cycle.',
        timestamp: new Date(now - 1 * day).toISOString()
      }
    ]
  };
}

class Database {
  constructor() {
    this.data = null;
    this.deskPoses = [];
    this.affirmations = [];
    this.init();
  }

  init() {
    // Ensure data directory exists
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Load or seed the primary database
    if (fs.existsSync(STORE_PATH)) {
      try {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.warn('[DB] Could not parse existing store, re-seeding...', err);
        this.data = getSeedData();
        this.persist();
      }
    } else {
      this.data = getSeedData();
      this.persist();
    }

    // Load static datasets
    try {
      if (fs.existsSync(POSES_FILE)) {
        this.deskPoses = JSON.parse(fs.readFileSync(POSES_FILE, 'utf-8'));
      }
    } catch (e) {
      this.deskPoses = [];
    }

    try {
      if (fs.existsSync(AFFIRMATIONS_FILE)) {
        this.affirmations = JSON.parse(fs.readFileSync(AFFIRMATIONS_FILE, 'utf-8'));
      }
    } catch (e) {
      this.affirmations = [];
    }
  }

  // Atomic file persistence
  persist() {
    try {
      const tempPath = `${STORE_PATH}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, STORE_PATH);
    } catch (err) {
      console.error('[DB] Failed to persist database:', err);
    }
  }

  // --- MOOD JOURNAL COLLECTION ---
  getMoods(query = {}) {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 10));

    // Sort newest first
    const sorted = [...this.data.moods].sort((a, b) => new Date(b.date) - new Date(a.date));

    const total = sorted.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = sorted.slice(startIndex, startIndex + limit);

    return {
      items: paginatedItems,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  addMood(entry) {
    const newEntry = {
      id: 'm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      ...entry
    };
    this.data.moods.push(newEntry);
    this.persist();
    return newEntry;
  }

  deleteMood(id) {
    const initialLen = this.data.moods.length;
    this.data.moods = this.data.moods.filter(m => m.id !== id);
    const deleted = this.data.moods.length < initialLen;
    if (deleted) this.persist();
    return deleted;
  }

  getMoodAnalytics() {
    const moods = this.data.moods;
    if (!moods.length) {
      return {
        count: 0,
        averageStress: 0,
        distribution: {},
        recentTrends: []
      };
    }

    const totalStress = moods.reduce((sum, m) => sum + m.stressLevel, 0);
    const averageStress = Number((totalStress / moods.length).toFixed(1));

    const distribution = {
      calm: moods.filter(m => m.mood === 'calm').length,
      content: moods.filter(m => m.mood === 'content').length,
      neutral: moods.filter(m => m.mood === 'neutral').length,
      anxious: moods.filter(m => m.mood === 'anxious').length,
      overwhelmed: moods.filter(m => m.mood === 'overwhelmed').length
    };

    // Sort chronological for trend line
    const chronological = [...moods]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-14) // Last 14 entries
      .map(m => ({
        date: m.date,
        stressLevel: m.stressLevel,
        mood: m.mood
      }));

    return {
      count: moods.length,
      averageStress,
      distribution,
      recentTrends: chronological
    };
  }

  // --- PRACTICE SESSIONS COLLECTION ---
  getSessions() {
    return [...this.data.sessions].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  }

  addSession(session) {
    const newSession = {
      id: 's_' + Date.now(),
      ...session
    };
    this.data.sessions.push(newSession);
    this.persist();
    return newSession;
  }

  // --- CAMPUS CALM WALL ---
  getCalmWallMessages() {
    return [...this.data.calmWall].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  addCalmWallMessage(msg) {
    const newMsg = {
      id: 'cw_' + Date.now(),
      ...msg
    };
    this.data.calmWall.unshift(newMsg);
    this.persist();
    return newMsg;
  }

  likeCalmWallMessage(id) {
    const post = this.data.calmWall.find(p => p.id === id);
    if (!post) return null;
    post.likes = (post.likes || 0) + 1;
    this.persist();
    return post;
  }

  // --- SOS LOGS ---
  addSosLog(log) {
    const newLog = {
      id: 'sos_' + Date.now(),
      ...log
    };
    this.data.sosLogs.unshift(newLog);
    this.persist();
    return newLog;
  }

  getSosLogs() {
    return this.data.sosLogs;
  }

  // --- DESK POSES & AFFIRMATIONS ---
  getDeskPoses() {
    return this.deskPoses;
  }

  getDeskPoseById(id) {
    return this.deskPoses.find(p => p.id === id) || null;
  }

  getAffirmations() {
    return this.affirmations;
  }
}

const db = new Database();
module.exports = db;
