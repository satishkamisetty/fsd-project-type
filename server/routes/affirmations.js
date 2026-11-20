const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/affirmations - All affirmations or random subset
router.get('/', (req, res) => {
  try {
    const affirmations = db.getAffirmations();
    res.json({ success: true, count: affirmations.length, affirmations });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve affirmations.' });
  }
});

// GET /api/affirmations/random - Get one random cognitive reframing prompt
router.get('/random', (req, res) => {
  try {
    const list = db.getAffirmations();
    if (!list.length) {
      return res.status(404).json({ success: false, error: 'No affirmations available.' });
    }
    const randomIndex = Math.floor(Math.random() * list.length);
    res.json({ success: true, affirmation: list[randomIndex] });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to pick affirmation.' });
  }
});

module.exports = router;
