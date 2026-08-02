/**
 * Figma Plugin Bridge Server — Core Immutable Engine
 * 
 * DESIGN PRINCIPLE:
 * This server is 100% project-agnostic. You NEVER need to edit or modify this server
 * when creating new projects (FoodDeliveryApp, SaaSDashboard, CryptoWallet, etc.).
 * 
 * Responsibilities:
 * 1. Automatically watches all `<ProjectName>/screens/` directories for .js changes
 * 2. Serves script contents to the Figma plugin via `/api/scripts/<path>`
 * 3. Emits real-time SSE events over `/api/watch` to trigger auto-execution in Figma
 * 4. Dynamically lists all project workspaces and screens via `/api/projects`
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3003;
const ROOT_DIR = __dirname;

// SSE client connections (Figma plugin instances)
let clients = [];
const watchedDirs = new Set();

// Broadcast a script update to all connected plugin instances
function notifyClients(filename) {
  console.log(`[Watcher] Auto-syncing script update: ${filename}`);
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify({ event: 'change', filename })}\n\n`);
  });
}

// Dynamically scan for project directories containing a screens/ subfolder
function watchProjectScreens() {
  try {
    const entries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
    
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      // Skip system/core folders
      if (['plugin', 'core', 'global', 'node_modules', '.git'].includes(entry.name)) continue;
      
      const screensDir = path.join(ROOT_DIR, entry.name, 'screens');
      if (fs.existsSync(screensDir) && fs.statSync(screensDir).isDirectory()) {
        if (!watchedDirs.has(screensDir)) {
          watchedDirs.add(screensDir);
          console.log(`[Watcher] Dynamically watching project: ${entry.name}/screens/`);
          try {
            fs.watch(screensDir, (eventType, filename) => {
              if (filename && filename.endsWith('.js')) {
                notifyClients(`${entry.name}/screens/${filename}`);
              }
            });
          } catch (e) {
            console.warn(`[Watcher Notice] Could not watch ${screensDir}:`, e.message);
          }
        }
      }
    }
  } catch (err) {
    console.warn('[Watcher Scan Notice]:', err.message);
  }
}

// Initial scan
watchProjectScreens();

// Periodic re-scan for newly created projects (every 10 seconds)
setInterval(watchProjectScreens, 10000);

// CORS headers for Figma plugin requests
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Resolve relative script filename to absolute path
// Example: "FoodDeliveryApp/screens/cart.js" → "/Users/.../FoodDeliveryApp/screens/cart.js"
function resolveScriptPath(filename) {
  const filePath = path.normalize(path.join(ROOT_DIR, filename));
  if (filePath.startsWith(ROOT_DIR) && fs.existsSync(filePath)) {
    return filePath;
  }
  return null;
}

const server = http.createServer((req, res) => {
  setCorsHeaders(res);

  const reqUrl = url.parse(req.url).pathname;

  // Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // SSE endpoint — Figma plugin connects here for live auto-sync
  if (reqUrl === '/api/watch') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write(`data: ${JSON.stringify({ event: 'connected' })}\n\n`);
    clients.push(res);
    console.log(`[Server] Figma Plugin Client Connected (Active: ${clients.length})`);

    req.on('close', () => {
      clients = clients.filter(c => c !== res);
      console.log(`[Server] Figma Plugin Client Disconnected (Active: ${clients.length})`);
    });
    return;
  }

  // Health Check
  if (reqUrl === '/api/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      clientCount: clients.length,
      pluginConnected: clients.length > 0
    }));
    return;
  }

  // Serve script code to plugin
  if (reqUrl.startsWith('/api/scripts/')) {
    const fileName = decodeURIComponent(reqUrl.substring('/api/scripts/'.length));
    const filePath = resolveScriptPath(fileName);

    if (!filePath) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`Script Not Found: ${fileName}`);
      return;
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error reading file');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.end(data);
    });
    return;
  }

  // Trigger execution of any project screen script
  if (reqUrl === '/api/run' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const filename = payload.filename;

        console.log(`[Server] Explicit trigger request for script: ${filename}`);
        notifyClients(filename);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, filename }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // List all project workspaces and their screen scripts dynamically
  if (reqUrl === '/api/projects' && req.method === 'GET') {
    try {
      const entries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
      const projects = entries
        .filter(e => e.isDirectory())
        .filter(e => !['plugin', 'core', 'global', 'node_modules', '.git'].includes(e.name))
        .filter(e => fs.existsSync(path.join(ROOT_DIR, e.name, 'screens')))
        .map(e => {
          const screensDir = path.join(ROOT_DIR, e.name, 'screens');
          const screens = fs.readdirSync(screensDir).filter(f => f.endsWith('.js'));
          return { name: e.name, screenCount: screens.length, screens };
        });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ projects }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log('');
  console.log('==============================================');
  console.log('  🚀 Figma Plugin Bridge Server (Immutable)');
  console.log(`  Running at: http://localhost:${PORT}`);
  console.log('==============================================');
  console.log('');
});
