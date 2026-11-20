const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateCalmWallPayload } = require('../validation');

// GET /api/calm-wall - Retrieve student solidarity board messages
router.get('/', (req, res) => {
  try {
    const posts = db.getCalmWallMessages();
    res.json({ success: true, count: posts.length, posts });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve messages.' });
  }
});

// POST /api/calm-wall - Post a new supportive note
router.post('/', (req, res) => {
  const validation = validateCalmWallPayload(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ success: false, errors: validation.errors });
  }

  try {
    const post = db.addCalmWallMessage(validation.sanitized);
    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to post message.' });
  }
});

// POST /api/calm-wall/:id/like - Upvote / send heart to a supportive message
router.post('/:id/like', (req, res) => {
  try {
    const updated = db.likeCalmWallMessage(req.params.id);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Message not found.' });
    }
    res.json({ success: true, post: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to like message.' });
  }
});

module.exports = router;
