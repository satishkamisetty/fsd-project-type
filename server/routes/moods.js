const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateMoodPayload } = require('../validation');

// GET /api/moods - List mood journal entries with pagination
router.get('/', (req, res) => {
  try {
    const result = db.getMoods(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve mood entries.' });
  }
});

// GET /api/moods/analytics - Aggregated mood distribution & trend curve data
router.get('/analytics', (req, res) => {
  try {
    const analytics = db.getMoodAnalytics();
    res.json({ success: true, analytics });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to compute mood analytics.' });
  }
});

// POST /api/moods - Create a new daily mood & stress check-in
router.post('/', (req, res) => {
  const validation = validateMoodPayload(req.body);
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      errors: validation.errors
    });
  }

  try {
    const saved = db.addMood(validation.sanitized);
    res.status(201).json({ success: true, entry: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to save mood entry.' });
  }
});

// DELETE /api/moods/:id - Remove an entry
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.deleteMood(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Mood entry not found.' });
    }
    res.json({ success: true, message: 'Mood entry deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete mood entry.' });
  }
});

module.exports = router;
