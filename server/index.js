/**
 * ZenZone - Node.js Backend Server
 * Provides REST API endpoints, input validation, persistent data tier,
 * and static asset hosting.
 * Designed with dual-mode execution: seamlessly runs with Express when installed,
 * or effortlessly uses Node's native HTTP module when running standalone.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const db = require('./db');
const {
  validateMoodPayload,
  validateSessionPayload,
  validateCalmWallPayload,
  validateSosLogPayload
} = require('./validation');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// MIME types for static asset serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

// Sets permissive CORS & JSON response headers
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Parses JSON body from incoming request
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) { // 1MB limit for DOS protection
        req.connection.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', err => reject(err));
  });
}

// Serves static files from the public folder
function serveStaticFile(res, filePath) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

// Core HTTP request dispatcher
async function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // Handle CORS pre-flight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // --- REST API ROUTES ---

  // Healthcheck
  if (pathname === '/api/health' && method === 'GET') {
    return sendJson(res, 200, {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  }

  // Poses
  if (pathname === '/api/poses' && method === 'GET') {
    const poses = db.getDeskPoses();
    const targetArea = parsedUrl.query.targetArea;
    let filtered = poses;
    if (targetArea) {
      filtered = filtered.filter(p => p.targetArea.toLowerCase().includes(targetArea.toLowerCase()));
    }
    return sendJson(res, 200, { success: true, count: filtered.length, poses: filtered });
  }

  if (pathname.startsWith('/api/poses/') && method === 'GET') {
    const id = pathname.replace('/api/poses/', '');
    const pose = db.getDeskPoseById(id);
    if (!pose) {
      return sendJson(res, 404, { success: false, error: 'Pose not found' });
    }
    return sendJson(res, 200, { success: true, pose });
  }

  // Affirmations
  if (pathname === '/api/affirmations' && method === 'GET') {
    const affirmations = db.getAffirmations();
    return sendJson(res, 200, { success: true, count: affirmations.length, affirmations });
  }

  if (pathname === '/api/affirmations/random' && method === 'GET') {
    const list = db.getAffirmations();
    const random = list[Math.floor(Math.random() * list.length)];
    return sendJson(res, 200, { success: true, affirmation: random });
  }

  // Mood Journal
  if (pathname === '/api/moods' && method === 'GET') {
    const result = db.getMoods(parsedUrl.query);
    return sendJson(res, 200, { success: true, ...result });
  }

  if (pathname === '/api/moods/analytics' && method === 'GET') {
    const analytics = db.getMoodAnalytics();
    return sendJson(res, 200, { success: true, analytics });
  }

  if (pathname === '/api/moods' && method === 'POST') {
    const body = await parseRequestBody(req);
    const validation = validateMoodPayload(body);
    if (!validation.isValid) {
      return sendJson(res, 400, { success: false, errors: validation.errors });
    }
    const saved = db.addMood(validation.sanitized);
    return sendJson(res, 201, { success: true, entry: saved });
  }

  if (pathname.startsWith('/api/moods/') && method === 'DELETE') {
    const id = pathname.replace('/api/moods/', '');
    const deleted = db.deleteMood(id);
    if (!deleted) {
      return sendJson(res, 404, { success: false, error: 'Mood entry not found' });
    }
    return sendJson(res, 200, { success: true, message: 'Deleted successfully' });
  }

  // Sessions
  if (pathname === '/api/sessions' && method === 'GET') {
    const sessions = db.getSessions();
    return sendJson(res, 200, { success: true, count: sessions.length, sessions });
  }

  if (pathname === '/api/sessions' && method === 'POST') {
    const body = await parseRequestBody(req);
    const validation = validateSessionPayload(body);
    if (!validation.isValid) {
      return sendJson(res, 400, { success: false, errors: validation.errors });
    }
    const saved = db.addSession(validation.sanitized);
    return sendJson(res, 201, { success: true, session: saved });
  }

  // Campus Calm Wall
  if (pathname === '/api/calm-wall' && method === 'GET') {
    const posts = db.getCalmWallMessages();
    return sendJson(res, 200, { success: true, count: posts.length, posts });
  }

  if (pathname === '/api/calm-wall' && method === 'POST') {
    const body = await parseRequestBody(req);
    const validation = validateCalmWallPayload(body);
    if (!validation.isValid) {
      return sendJson(res, 400, { success: false, errors: validation.errors });
    }
    const post = db.addCalmWallMessage(validation.sanitized);
    return sendJson(res, 201, { success: true, post });
  }

  if (pathname.startsWith('/api/calm-wall/') && pathname.endsWith('/like') && method === 'POST') {
    const parts = pathname.split('/');
    const id = parts[3];
    const updated = db.likeCalmWallMessage(id);
    if (!updated) {
      return sendJson(res, 404, { success: false, error: 'Post not found' });
    }
    return sendJson(res, 200, { success: true, post: updated });
  }

  // SOS Mode Logs
  if (pathname === '/api/sos/logs' && method === 'GET') {
    const logs = db.getSosLogs();
    return sendJson(res, 200, { success: true, count: logs.length, logs });
  }

  if (pathname === '/api/sos/log' && method === 'POST') {
    const body = await parseRequestBody(req);
    const validation = validateSosLogPayload(body);
    if (!validation.isValid) {
      return sendJson(res, 400, { success: false, errors: validation.errors });
    }
    const saved = db.addSosLog(validation.sanitized);
    return sendJson(res, 201, { success: true, log: saved });
  }

  // --- STATIC ASSET SERVING ---
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, safePath);
  serveStaticFile(res, filePath);
}

// Start HTTP Server
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🌿 ZenZone CalmCode Retreat Full-Stack Server Running`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📊 Health Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`=================================================\n`);
});

module.exports = server;
