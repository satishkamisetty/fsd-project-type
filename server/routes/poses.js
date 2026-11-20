const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/poses - Return 10 desk-friendly yoga poses
router.get('/', (req, res) => {
  try {
    const poses = db.getDeskPoses();
    const { targetArea, difficulty } = req.query;

    let filtered = poses;
    if (targetArea) {
      filtered = filtered.filter(p => p.targetArea.toLowerCase().includes(targetArea.toLowerCase()));
    }
    if (difficulty) {
      filtered = filtered.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    res.json({
      success: true,
      count: filtered.length,
      poses: filtered
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve poses.' });
  }
});

// GET /api/poses/:id - Single pose details
router.get('/:id', (req, res) => {
  const pose = db.getDeskPoseById(req.params.id);
  if (!pose) {
    return res.status(404).json({ success: false, error: 'Pose not found.' });
  }
  res.json({ success: true, pose });
});

module.exports = router;
