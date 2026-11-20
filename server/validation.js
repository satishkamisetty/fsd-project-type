/**
 * Server-Side Input Validation and Sanitization Module
 * Protects against XSS injection, enforces data integrity, and validates schema constraints.
 */

// Escapes special HTML characters to prevent Stored & Reflected XSS
function sanitizeString(input, maxLength = 500) {
  if (typeof input !== 'string') return '';
  const trimmed = input.trim().slice(0, maxLength);
  return trimmed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Validates a mood journal entry payload
function validateMoodPayload(body) {
  const errors = [];

  // Stress level must be an integer between 1 and 5
  const stressLevel = Number(body.stressLevel);
  if (!Number.isInteger(stressLevel) || stressLevel < 1 || stressLevel > 5) {
    errors.push('Stress level must be an integer between 1 and 5.');
  }

  // Mood emoji selection must be one of the recognized categories
  const validMoods = ['calm', 'content', 'neutral', 'anxious', 'overwhelmed'];
  const mood = (body.mood || '').toString().toLowerCase().trim();
  if (!validMoods.includes(mood)) {
    errors.push(`Mood must be one of: ${validMoods.join(', ')}.`);
  }

  // Reflection notes (optional, max 1000 characters)
  const notes = sanitizeString(body.notes || '', 1000);

  // Tags array (optional, max 5 tags)
  let tags = [];
  if (Array.isArray(body.tags)) {
    tags = body.tags.slice(0, 5).map(t => sanitizeString(String(t), 30)).filter(Boolean);
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      stressLevel,
      mood,
      notes,
      tags,
      date: body.date ? new Date(body.date).toISOString() : new Date().toISOString()
    }
  };
}

// Validates a session log entry (Meditation or Box Breathing)
function validateSessionPayload(body) {
  const errors = [];

  const validTypes = ['Meditation', 'Box Breathing', 'Desk Yoga', 'SOS De-escalation'];
  const type = (body.type || '').toString().trim();
  if (!validTypes.includes(type)) {
    errors.push(`Session type must be one of: ${validTypes.join(', ')}.`);
  }

  const durationSeconds = Number(body.durationSeconds);
  if (isNaN(durationSeconds) || durationSeconds < 10 || durationSeconds > 7200) {
    errors.push('Duration must be between 10 seconds and 2 hours.');
  }

  const title = sanitizeString(body.title || 'Mindful Practice', 100);

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      type,
      title,
      durationSeconds: Math.round(durationSeconds),
      completed: Boolean(body.completed ?? true),
      completedAt: body.completedAt ? new Date(body.completedAt).toISOString() : new Date().toISOString()
    }
  };
}

// Validates a Campus Calm Wall message
function validateCalmWallPayload(body) {
  const errors = [];

  const rawMessage = (body.message || '').toString().trim();
  if (!rawMessage || rawMessage.length < 3) {
    errors.push('Calm message must be at least 3 characters long.');
  }
  if (rawMessage.length > 280) {
    errors.push('Calm message cannot exceed 280 characters.');
  }

  const author = sanitizeString(body.author || 'Anonymous Student', 50);
  const tag = sanitizeString(body.tag || 'Encouragement', 30);
  const message = sanitizeString(rawMessage, 280);

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      author: author || 'Anonymous Student',
      tag: tag || 'Encouragement',
      message,
      likes: 0,
      createdAt: new Date().toISOString()
    }
  };
}

// Validates SOS Mode de-escalation log
function validateSosLogPayload(body) {
  const errors = [];
  const preStress = Number(body.preStress);
  const postStress = Number(body.postStress);

  if (!Number.isInteger(preStress) || preStress < 1 || preStress > 5) {
    errors.push('Pre-session stress rating must be an integer between 1 and 5.');
  }
  if (!Number.isInteger(postStress) || postStress < 1 || postStress > 5) {
    errors.push('Post-session stress rating must be an integer between 1 and 5.');
  }

  const reflection = sanitizeString(body.reflection || '', 500);

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      preStress,
      postStress,
      stressDelta: preStress - postStress,
      reflection,
      timestamp: new Date().toISOString()
    }
  };
}

module.exports = {
  sanitizeString,
  validateMoodPayload,
  validateSessionPayload,
  validateCalmWallPayload,
  validateSosLogPayload
};
