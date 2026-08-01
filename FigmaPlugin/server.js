const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3003;
const SCRIPTS_DIR = path.join(__dirname, 'scripts');

// Ensure scripts directory exists
if (!fs.existsSync(SCRIPTS_DIR)) {
  fs.mkdirSync(SCRIPTS_DIR, { recursive: true });
}

// Store all connected SSE clients (Figma UI frames)
let clients = [];

// Watch directory for changes using standard Node.js FS watcher
fs.watch(SCRIPTS_DIR, (eventType, filename) => {
  if (filename && filename.endsWith('.js')) {
    console.log(`[Watcher] File changed: ${filename}`);
    
    // Notify all connected Figma clients about the file change
    clients.forEach(client => {
      client.write(`data: ${JSON.stringify({ event: 'change', filename })}\n\n`);
    });
  }
});

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // SSE Watch Stream Endpoint
  if (req.url === '/api/watch') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    
    clients.push(res);
    console.log(`[Server] Figma client connected (Active: ${clients.length})`);

    req.on('close', () => {
      clients = clients.filter(c => c !== res);
      console.log(`[Server] Figma client disconnected (Active: ${clients.length})`);
    });
    return;
  }

  // Get list of scripts
  if (req.url === '/api/scripts') {
    fs.readdir(SCRIPTS_DIR, (err, files) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Could not read directory' }));
        return;
      }
      const jsFiles = files.filter(f => f.endsWith('.js'));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ scripts: jsFiles }));
    });
    return;
  }

  // Get script content
  if (req.url.startsWith('/api/scripts/')) {
    const fileName = decodeURIComponent(req.url.substring('/api/scripts/'.length));
    const filePath = path.join(SCRIPTS_DIR, fileName);

    if (!filePath.startsWith(SCRIPTS_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Access Denied');
      return;
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.end(data);
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Figma Live Reload Server Running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📁 Watching scripts in: ${SCRIPTS_DIR}`);
  console.log(`======================================================\n`);
});
