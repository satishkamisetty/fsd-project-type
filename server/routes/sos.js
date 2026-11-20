const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateSosLogPayload } = require('../validation');

// GET /api/sos/logs - Get student de-escalation history
router.get('/logs', (req, res) => {
  try {
    const logs = db.getSosLogs();
    res.json({ success: true, count: logs.length, logs });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve SOS logs.' });
  }
});

// POST /api/sos/log - Record pre/post SOS stress reduction
router.post('/log', (req, res) => {
  const validation = validateSosLogPayload(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ success: false, errors: validation.errors });
  }

  try {
    const saved = db.addSosLog(validation.sanitized);
    res.status(201).json({ success: true, log: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to record SOS de-escalation.' });
  }
});

module.exports = router;
