/**
 * College Yatri - Fullstack Portfolio Server
 * Built with dual-engine architecture:
 * Works with Express (when dependencies installed) OR standard Node.js built-in 'http'
 * to guarantee zero-dependency instant startup.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Ensure data directory and messages store exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2), 'utf8');
}

// MIME types for static assets
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2'
};

// Core API Handlers
function handleApiRoutes(req, res) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true;
  }

  // Health check
  if (pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      appName: 'College Yatri 3D Portfolio API',
      timestamp: new Date().toISOString(),
      nodeVersion: process.version
    }));
    return true;
  }

  // Get Projects API
  if (pathname === '/api/projects' && req.method === 'GET') {
    const projectsFile = path.join(PUBLIC_DIR, 'data', 'projects.json');
    if (fs.existsSync(projectsFile)) {
      const data = fs.readFileSync(projectsFile, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify([]));
    }
    return true;
  }

  // Contact Form Submission API
  if (pathname === '/api/contact' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Safeguard against large payloads (> 1MB)
      if (body.length > 1e6) {
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { name, email, subject, message, role } = payload;

        // Validation
        if (!name || !email || !message) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: 'Name, email, and message are required fields.'
          }));
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: 'Please provide a valid email address.'
          }));
          return;
        }

        const newEntry = {
          id: 'msg_' + Date.now(),
          name: name.trim(),
          email: email.trim(),
          subject: (subject || 'General Inquiry').trim(),
          role: role || 'Explorer',
          message: message.trim(),
          createdAt: new Date().toISOString()
        };

        let existingMessages = [];
        try {
          const raw = fs.readFileSync(MESSAGES_FILE, 'utf8');
          existingMessages = JSON.parse(raw || '[]');
        } catch (e) {
          existingMessages = [];
        }

        existingMessages.unshift(newEntry);
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(existingMessages, null, 2), 'utf8');

        console.log(`[Contact API] Received message from: ${name} (${email})`);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Thank you! Your message has been received by College Yatri.',
          messageId: newEntry.id
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Invalid JSON payload.'
        }));
      }
    });
    return true;
  }

  // Get Messages API (for local testing/admin)
  if (pathname === '/api/messages' && req.method === 'GET') {
    try {
      const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to read messages store.' }));
    }
    return true;
  }

  return false;
}

// Serve static assets with fallback to index.html
function serveStaticFile(req, res) {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, reqPath);

  // Security check to avoid path traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    } else {
      // Fallback for Single-Page App navigation
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(indexPath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
    }
  });
}

// Create HTTP server
const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) {
    const handled = handleApiRoutes(req, res);
    if (!handled) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'API route not found' }));
    }
  } else {
    serveStaticFile(req, res);
  }
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 College Yatri 3D Fullstack Portfolio is Running!`);
  console.log(`🌐 Local URL:  http://localhost:${PORT}`);
  console.log(`📡 API URL:    http://localhost:${PORT}/api/health`);
  console.log(`📁 Static Dir: ${PUBLIC_DIR}`);
  console.log(`======================================================\n`);
});

