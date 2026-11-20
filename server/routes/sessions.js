const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateSessionPayload } = require('../validation');

// GET /api/sessions - Retrieve practice history
router.get('/', (req, res) => {
  try {
    const sessions = db.getSessions();
    res.json({ success: true, count: sessions.length, sessions });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve sessions.' });
  }
});

// POST /api/sessions - Log completed meditation, breathing or desk yoga practice
router.post('/', (req, res) => {
  const validation = validateSessionPayload(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ success: false, errors: validation.errors });
  }

  try {
    const saved = db.addSession(validation.sanitized);
    res.status(201).json({ success: true, session: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to record session.' });
  }
});

module.exports = router;
