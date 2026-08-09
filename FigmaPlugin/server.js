/**
 * Morph — Backend Server
 * 
 * Full API backend that handles:
 *  1. File watching + SSE bridge for Figma auto-execution
 *  2. Project CRUD (scaffold, config read/write)
 *  3. AI generation (Gemini Flash models with 10 daily credits / model)
 *  4. Rate Limiter (Midnight UTC/Local auto-reset)
 *  5. Script serving + manual trigger
 */

require('dotenv').config();

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const projectManager = require('./engine/project-manager');
const promptBuilder = require('./engine/prompt-builder');
const geminiClient = require('./engine/gemini-client');
const rateLimiter = require('./engine/rate-limiter');
const cloudStore = require('./engine/cloud-store');
const userTracker = require('./engine/user-tracker');

const PORT = process.env.PORT || 3003;
const ROOT_DIR = __dirname;

// Initialize Gemini client
geminiClient.initialize(process.env.GEMINI_API_KEY);

// ── SSE Client Pool ──────────────────────────────────────────────

let clients = [];
const watchedDirs = new Set();

function notifyClients(filename) {
  console.log(`[Watcher] Auto-syncing: ${filename}`);
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify({ event: 'change', filename })}\n\n`);
  });
}

// ── File Watcher ─────────────────────────────────────────────────

function watchProjectDirs() {
  // On Vercel serverless the filesystem is read-only and fs.watch is useless.
  // The plugin polls instead (see plugin/ui.html).
  if (cloudStore.isCloud()) return;
  try {
    const entries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (['plugin', 'core', 'global', 'node_modules', '.git', 'engine'].includes(entry.name)) continue;

      const subDirs = ['screens', 'components', 'tokens'];
      for (const sub of subDirs) {
        const targetDir = path.join(ROOT_DIR, entry.name, sub);
        if (fs.existsSync(targetDir) && fs.statSync(targetDir).isDirectory()) {
          if (!watchedDirs.has(targetDir)) {
            watchedDirs.add(targetDir);
            console.log(`[Watcher] Watching: ${entry.name}/${sub}/`);
            try {
              fs.watch(targetDir, (eventType, filename) => {
                if (filename && filename.endsWith('.js')) {
                  // Skip deletion events (file no longer exists) — prevents
                  // executing a script that was just removed from the project.
                  const fullPath = path.join(targetDir, filename);
                  if (eventType === 'rename' && !fs.existsSync(fullPath)) return;
                  notifyClients(`${entry.name}/${sub}/${filename}`);
                }
              });
            } catch (e) {
              console.warn(`[Watcher] Could not watch ${targetDir}:`, e.message);
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('[Watcher]:', err.message);
  }
}

watchProjectDirs();
setInterval(watchProjectDirs, 10000);

// ── Helpers ──────────────────────────────────────────────────────

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function resolveScriptPath(filename) {
  if (!filename || typeof filename !== 'string') return null;
  if (filename.includes('..')) return null;

  const normalized = path.normalize(filename);
  const parts = normalized.split(path.sep).filter(Boolean);

  // Must have structure: <ProjectName>/<subfolder>/<filename.js>
  if (parts.length < 3) return null;

  const [projName, subFolder, scriptFile] = parts;
  const SYSTEM_DIRS = ['plugin', 'core', 'global', 'node_modules', '.git', 'engine'];
  if (SYSTEM_DIRS.includes(projName.toLowerCase())) return null;
  if (!['screens', 'components', 'tokens'].includes(subFolder.toLowerCase())) return null;
  if (!scriptFile.endsWith('.js')) return null;

  return path.join(projName, subFolder, scriptFile);
}

function deriveScreenName(prompt) {
  const cleaned = prompt
    .toLowerCase()
    .replace(/@\w+/g, '')            // remove @commands
    .replace(/[^a-z0-9\s]/g, '')     // remove special chars
    .trim()
    .split(/\s+/)
    .slice(0, 4)                     // take first 4 words
    .join('_');
  return cleaned || 'generated_screen';
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || req.socket.remoteAddress || '127.0.0.1';
}

function isAdminAuthed(req) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const provided = parsedUrlQueryToken(req) || req.headers['x-admin-token'] || '';
  return String(provided) === String(expected);
}

function parsedUrlQueryToken(req) {
  const q = url.parse(req.url, true).query;
  return (q && q.token) ? String(q.token) : '';
}

function renderAdminPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Morph — Users & Activity</title>
<style>
  :root { --ink:#0F172A; --muted:#64748B; --line:#E2E8F0; --card:#FFFFFF; --bg:#F1F5F9; --primary:#cc785c; }
  * { box-sizing: border-box; }
  body { margin:0; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; background:var(--bg); color:var(--ink); }
  header { background:var(--card); border-bottom:1px solid var(--line); padding:16px 24px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
  h1 { font-size:18px; margin:0; }
  .bar { display:flex; align-items:center; gap:10px; }
  input[type=password] { padding:7px 10px; border:1px solid var(--line); border-radius:8px; font-size:13px; }
  button { padding:7px 14px; border:none; border-radius:8px; background:var(--primary); color:#fff; font-size:13px; font-weight:600; cursor:pointer; }
  button.ghost { background:transparent; color:var(--muted); border:1px solid var(--line); }
  main { padding:24px; max-width:1100px; margin:0 auto; }
  .cards { display:flex; gap:12px; margin-bottom:18px; flex-wrap:wrap; }
  .stat { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:14px 18px; min-width:150px; }
  .stat b { font-size:22px; display:block; }
  .stat span { font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:.4px; }
  table { width:100%; border-collapse:collapse; background:var(--card); border-radius:12px; overflow:hidden; border:1px solid var(--line); }
  th, td { text-align:left; padding:10px 12px; border-bottom:1px solid var(--line); font-size:13px; vertical-align:top; }
  th { background:#F8FAFC; font-size:11px; text-transform:uppercase; letter-spacing:.5px; color:var(--muted); }
  tr:last-child td { border-bottom:none; }
  .pill { display:inline-block; padding:1px 7px; border-radius:999px; font-size:11px; font-weight:600; }
  .pill.ok { background:#ECFDF5; color:#047857; }
  .pill.warn { background:#FEF3C7; color:#B45309; }
  .pill.none { background:#FEE2E2; color:#B91C1C; }
  .code { font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:12px; }
  .muted { color:var(--muted); }
  .del { color:#B91C1C; background:none; border:none; cursor:pointer; font-size:12px; text-decoration:underline; padding:0; }
</style>
</head>
<body>
<header>
  <h1>Morph — Users &amp; Activity</h1>
  <div class="bar">
    <input type="password" id="token" placeholder="Admin token" autocomplete="off" />
    <button onclick="load()">Load users</button>
    <button class="ghost" onclick="load()">Refresh</button>
  </div>
</header>
<main id="main">
  <div class="cards">
    <div class="stat"><span>Users</span><b id="statUsers">-</b></div>
    <div class="stat"><span>Total generations</span><b id="statGens">-</b></div>
    <div class="stat"><span>Online plugins</span><b id="statOnline">-</b></div>
  </div>
  <div id="status" class="muted" style="margin-bottom:12px;font-size:13px;"></div>
  <div id="tableWrap"></div>
</main>
<script>
  function tokenFromUrl() {
    var m = window.location.search.match(/[?&]token=([^&]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }
  function qs(s, v) {
    if (!v) v = document.getElementById('token').value.trim() || tokenFromUrl();
    if (v) return s + (s.indexOf('?') >= 0 ? '&' : '?') + 'token=' + encodeURIComponent(v);
    return s;
  }
  function fmt(iso) {
    if (!iso) return '-';
    try { return new Date(iso).toLocaleString(); } catch (e) { return iso; }
  }
  async function load() {
    var status = document.getElementById('status');
    status.textContent = 'Loading...';
    var token = document.getElementById('token').value.trim() || tokenFromUrl();
    if (!token) { status.textContent = 'Enter the admin token first (same as ADMIN_TOKEN on the server).'; return; }
    try {
      var res = await fetch(qs('/api/users', token));
      var data = await res.json();
      if (!res.ok) { status.textContent = 'Access denied: ' + (data.message || 'HTTP ' + res.status); return; }
      var users = data.users || [];
      document.getElementById('statUsers').textContent = users.length;
      var totalGens = 0;
      users.forEach(function (u) { totalGens += Object.values(u.usage || {}).reduce(function (a, b) { return a + b; }, 0); });
      document.getElementById('statGens').textContent = totalGens;
      document.getElementById('statOnline').textContent = (data.onlineClients != null ? data.onlineClients : '?');
      status.textContent = 'Loaded ' + users.length + ' user(s). "Used/Rem" = per-user total across all models (10/day/model).';
      render(users);
    } catch (e) {
      status.textContent = 'Error: ' + e.message;
    }
  }
  function usedTotal(u) {
    return Object.values(u.usage || {}).reduce(function (a, b) { return a + b; }, 0);
  }
  function remainingTotal(u) {
    var credits = u.credits || {};
    var rem = 0;
    Object.keys(credits).forEach(function (k) { rem += (credits[k].remaining || 0); });
    return rem;
  }
  function render(users) {
    var html = '<table><thead><tr>' +
      '<th>User</th><th>IP</th><th>First seen</th><th>Last seen</th>' +
      '<th>Generated</th><th>Remaining</th><th>Per-model usage</th><th></th>' +
      '</tr></thead><tbody>';
    users.forEach(function (u) {
      var total = usedTotal(u);
      var rem = remainingTotal(u);
      var pill = total === 0 ? '<span class="pill none">never</span>' : (rem === 0 ? '<span class="pill warn">used up</span>' : '<span class="pill ok">active</span>');
      var modelCell = Object.keys(u.usage || {}).map(function (m) {
        var c = (u.credits && u.credits[m]) || {};
        return '<div><span class="code">' + m + '</span>: ' + u.usage[m] + ' used / ' + (c.remaining != null ? c.remaining : '?') + ' left</div>';
      }).join('') || '<span class="muted">none yet</span>';
      html += '<tr>' +
        '<td><b>' + (u.name || 'Guest') + '</b></td>' +
        '<td><span class="code">' + (u.ip || '-') + '</span></td>' +
        '<td class="muted">' + fmt(u.firstSeen) + '</td>' +
        '<td class="muted">' + fmt(u.lastSeen) + '</td>' +
        '<td>' + total + ' ' + pill + '</td>' +
        '<td>' + rem + '</td>' +
        '<td>' + modelCell + '</td>' +
        '<td><button class="del" onclick="delUser(\'' + u.ip.replace(/'/g, '') + "')" + '">remove</button></td>' +
        '</tr>';
    });
    html += '</tbody></table>';
    document.getElementById('tableWrap').innerHTML = users.length ? html : '<div class="muted">No users recorded yet.</div>';
  }
  async function delUser(ip) {
    if (!confirm('Remove this user record?')) return;
    var token = document.getElementById('token').value.trim() || tokenFromUrl();
    var res = await fetch(qs('/api/users/' + encodeURIComponent(ip), token), { method: 'DELETE' });
    var data = await res.json();
    load();
  }
  if (tokenFromUrl()) { document.getElementById('token').value = tokenFromUrl(); load(); }
</script>
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════
// ██ HTTP SERVER
// ══════════════════════════════════════════════════════════════

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  const parsedUrl = url.parse(req.url, true);
  // Normalize path by stripping trailing slashes
  const reqPath = (parsedUrl.pathname.length > 1 && parsedUrl.pathname.endsWith('/'))
    ? parsedUrl.pathname.slice(0, -1)
    : parsedUrl.pathname;

  // Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const clientIp = getClientIp(req);

  try {
    // ── Health & SSE Endpoints ────────────────────────────────────

    // SSE endpoint for live Figma canvas updates
    if (reqPath === '/api/watch') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });
      res.write(`data: ${JSON.stringify({ event: 'connected' })}\n\n`);
      clients.push(res);
      console.log(`[Server] Plugin connected (Active: ${clients.length})`);
      req.on('close', () => {
        clients = clients.filter(c => c !== res);
        console.log(`[Server] Plugin disconnected (Active: ${clients.length})`);
      });
      return;
    }

    // Health check
    if (reqPath === '/api/status' && req.method === 'GET') {
      return sendJson(res, 200, {
        status: 'online',
        clientCount: clients.length,
        pluginConnected: clients.length > 0,
        geminiReady: geminiClient.isReady(),
        credits: rateLimiter.getAllCredits(geminiClient.getAvailableModels(), clientIp),
      });
    }

    // Serve script files to plugin
    if (reqPath.startsWith('/api/scripts/') && req.method === 'GET') {
      const fileName = decodeURIComponent(reqPath.substring('/api/scripts/'.length));
      const relPath = resolveScriptPath(fileName);
      if (!relPath) {
        return sendJson(res, 404, { success: false, message: `Script Not Found: ${fileName}` });
      }
      const content = await cloudStore.readText(relPath);
      if (content == null) {
        return sendJson(res, 404, { success: false, message: `Script Not Found: ${fileName}` });
      }
      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
      res.end(content);
      return;
    }

    // Delete a generated script file (screens/components/tokens .js)
    if (reqPath.startsWith('/api/scripts/') && req.method === 'DELETE') {
      const fileName = decodeURIComponent(reqPath.substring('/api/scripts/'.length));
      const relPath = resolveScriptPath(fileName);
      if (!relPath || !fileName.endsWith('.js')) {
        return sendJson(res, 404, { success: false, message: `File Not Found: ${fileName}` });
      }
      try {
        await cloudStore.deletePath(relPath);
        console.log(`[Delete] Removed: ${fileName}`);
        return sendJson(res, 200, { success: true, filename: fileName });
      } catch (err) {
        console.error('[Delete] Error:', err.message);
        return sendJson(res, 500, { success: false, message: err.message });
      }
    }

    // Manual script trigger
    if (reqPath === '/api/run' && req.method === 'POST') {
      const payload = await readBody(req);
      notifyClients(payload.filename);
      return sendJson(res, 200, { success: true, filename: payload.filename });
    }

    // List all project workspaces
    if (reqPath === '/api/projects' && req.method === 'GET') {
      const projects = await projectManager.listProjects();
      return sendJson(res, 200, { projects });
    }

    // ── Project CRUD Endpoints ───────────────────────────────────

    // Create project
    if (reqPath === '/api/projects' && req.method === 'POST') {
      const body = await readBody(req);
      if (!body.name) {
        return sendJson(res, 400, { success: false, message: 'Project name is required.' });
      }
      const result = await projectManager.createProject(body.name, {
        brief: body.brief,
        colors: body.colors,
        fonts: body.fonts,
        taste: body.taste,
      });
      watchProjectDirs();
      return sendJson(res, result.success ? 201 : 409, result);
    }

    // Get project config
    const configMatch = reqPath.match(/^\/api\/projects\/([^/]+)\/config$/);
    if (configMatch && req.method === 'GET') {
      const projectName = decodeURIComponent(configMatch[1]);
      const config = await projectManager.getProjectConfig(projectName);
      if (!config) return sendJson(res, 404, { success: false, message: 'Project not found' });
      return sendJson(res, 200, config);
    }

    // Update project config
    if (configMatch && req.method === 'PUT') {
      const projectName = decodeURIComponent(configMatch[1]);
      const body = await readBody(req);
      const result = await projectManager.updateProjectConfig(projectName, body);
      return sendJson(res, result.success ? 200 : 404, result);
    }

    // Delete a project
    const projMatch = reqPath.match(/^\/api\/projects\/([^/]+)$/);
    if (projMatch && req.method === 'DELETE') {
      const projectName = decodeURIComponent(projMatch[1]);
      const result = await projectManager.deleteProject(projectName);
      return sendJson(res, result.success ? 200 : 404, result);
    }

    // ── AI Models & Rate Limiting Endpoints ─────────────────────

    // Get models + remaining daily credits per model
    if (reqPath === '/api/models' && req.method === 'GET') {
      const models = geminiClient.getAvailableModels();
      const credits = rateLimiter.getAllCredits(models, clientIp);
      return sendJson(res, 200, { models, credits });
    }

    // Get credit status
    if (reqPath === '/api/credits' && req.method === 'GET') {
      const models = geminiClient.getAvailableModels();
      const credits = rateLimiter.getAllCredits(models, clientIp);
      return sendJson(res, 200, { credits });
    }

    // ── User Registry & Admin Endpoints ─────────────────────────

    // Register the user (name + IP) when they open/launch the plugin
    if (reqPath === '/api/users/register' && req.method === 'POST') {
      const body = await readBody(req);
      await userTracker.recordUser({ name: body.name, ip: clientIp });
      return sendJson(res, 200, { success: true, ip: clientIp, name: body.name || '' });
    }

    // Admin: list recorded users with their usage/remaining credits per model
    if (reqPath === '/api/users' && req.method === 'GET') {
      if (!isAdminAuthed(req)) {
        return sendJson(res, 403, { success: false, message: 'Admin token missing or invalid. Set ADMIN_TOKEN on the server and request /api/users?token=<ADMIN_TOKEN>.' });
      }
      const users = await userTracker.listUsers();
      const models = geminiClient.getAvailableModels();
      const enriched = users.map(u => ({
        ...u,
        credits: rateLimiter.getAllCredits(models, u.ip),
      }));
      return sendJson(res, 200, {
        users: enriched,
        onlineClients: clients.length,
        adminTokenSet: !!process.env.ADMIN_TOKEN,
      });
    }

    // Admin: delete a user record by IP
    const userDelMatch = reqPath.match(/^\/api\/users\/((?:[^/])+)$/);
    if (userDelMatch && req.method === 'DELETE') {
      if (!isAdminAuthed(req)) {
        return sendJson(res, 403, { success: false, message: 'Admin token missing or invalid.' });
      }
      const ip = decodeURIComponent(userDelMatch[1]);
      await userTracker.deleteUser(ip);
      return sendJson(res, 200, { success: true, ip });
    }

    // Admin HTML dashboard (human-readable user list)
    if (reqPath === '/admin' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(renderAdminPage());
      return;
    }

    // ── AI Generation Endpoints ──────────────────────────────────

    // Generate screen
    if (reqPath === '/api/generate/screen' && req.method === 'POST') {
      if (!geminiClient.isReady()) {
        return sendJson(res, 503, { success: false, message: 'Gemini API key not configured. Set GEMINI_API_KEY in .env' });
      }

      const body = await readBody(req);
      const { project, prompt, model, image, imageBase64 } = body;
      const refImage = image || imageBase64;
      const modelId = model || process.env.GEMINI_MODEL || 'gemini-3.6-flash';

      if (!project || !prompt) {
        return sendJson(res, 400, { success: false, message: 'project and prompt are required.' });
      }

      // Check daily rate limit for model (10 credits per day per IP)
      const creditCheck = rateLimiter.consumeCredit(modelId, clientIp);
      if (!creditCheck.success) {
        return sendJson(res, 429, {
          success: false,
          message: creditCheck.message,
          remaining: 0,
        });
      }

      try {
        const skipAutolayout = /@skip-autolayout/i.test(prompt);
        const systemPrompt = await promptBuilder.buildScreenPrompt(project, { skipAutolayout });
        const result = await geminiClient.generate({ systemPrompt, userPrompt: prompt, model: modelId, imageBase64: refImage });

        const screenName = deriveScreenName(prompt);
        const fileRelPath = `${project}/screens/${screenName}.js`;
        await cloudStore.writeText(fileRelPath, result.code, 'application/javascript');
        await userTracker.recordUser({ name: body.name, ip: clientIp, model: modelId });

        console.log(`[Generate] Wrote ${screenName}.js (${result.code.length} chars, model: ${result.model}, credits left: ${creditCheck.remaining})`);

        notifyClients(fileRelPath);

        return sendJson(res, 200, {
          success: true,
          filename: `${project}/screens/${screenName}.js`,
          model: result.model,
          codeLength: result.code.length,
          remainingCredits: creditCheck.remaining,
        });
      } catch (err) {
        console.error('[Generate] Error:', err);
        return sendJson(res, 500, { success: false, message: err.message });
      }
    }

    // Generate design system
    if (reqPath === '/api/generate/designsystem' && req.method === 'POST') {
      if (!geminiClient.isReady()) {
        return sendJson(res, 503, { success: false, message: 'Gemini API key not configured.' });
      }

      const body = await readBody(req);
      const { project, model, options } = body;
      const opts = options || { variables: true, colors: true, typography: true, components: true };
      const modelId = model || process.env.GEMINI_MODEL || 'gemini-3.6-flash';

      if (!project) {
        return sendJson(res, 400, { success: false, message: 'project is required.' });
      }

      // Check daily rate limit
      const creditCheck = rateLimiter.consumeCredit(modelId, clientIp);
      if (!creditCheck.success) {
        return sendJson(res, 429, {
          success: false,
          message: creditCheck.message,
          remaining: 0,
        });
      }

      try {
        const systemPrompt = await promptBuilder.buildDesignSystemPrompt(project);

        // 1. Generate Native Variables & Styles if selected
        if (opts.variables !== false) {
          const varResult = await geminiClient.generate({
            systemPrompt,
            userPrompt: `Generate native Figma Variables & Text Styles (tokens/variables.js) for ${project}. Create variable collections for colors (primary, secondary, neutral 900-white scale, status colors), spacing (xs..2xl), radii (xs..full), font size (micro..hero), AND call figma.createTextStyle() for Hero(32), Heading(24), Title(20), Subhead(16), Body(14), Caption(12), Micro(10). Output ONLY clean JS code inside (async () => { ... })();`,
            model: modelId,
          });

          const varRelPath = `${project}/tokens/variables.js`;
          await cloudStore.writeText(varRelPath, varResult.code, 'application/javascript');
          notifyClients(varRelPath);
        }

        // 2. Generate Master Design System Board (Visual Swatches, Typography Scale, Component Sets)
        const dsResult = await geminiClient.generate({
          systemPrompt,
          userPrompt: `Generate Master Design System board (components/DesignSystem.js) for ${project}. 1180px wide board. ${opts.colors !== false ? 'MUST include Section 1: Color Palette Swatches (primary, secondary, neutral 900-white scale, success, warning, error swatches with hex labels).' : ''} ${opts.typography !== false ? 'MUST include Section 2: Typography Scale Specimens (Hero 32px, Heading 24px, Title 20px, Subhead 16px, Body 14px, Caption 12px, Micro 10px rendered sample rows).' : ''} ${opts.components !== false ? 'MUST include Section 3: Master ComponentSets (Button & FilterPill with full variant state matrices).' : ''} Output ONLY clean JS code inside (async () => { ... })();`,
          model: modelId,
        });

        const dsRelPath = `${project}/components/DesignSystem.js`;
        await cloudStore.writeText(dsRelPath, dsResult.code, 'application/javascript');
        notifyClients(dsRelPath);
        await userTracker.recordUser({ name: body.name, ip: clientIp, model: modelId });

        return sendJson(res, 200, {
          success: true,
          variablesFile: opts.variables !== false ? `${project}/tokens/variables.js` : null,
          designSystemFile: `${project}/components/DesignSystem.js`,
          model: dsResult.model,
          remainingCredits: creditCheck.remaining,
        });
      } catch (err) {
        console.error('[Generate DS] Error:', err);
        return sendJson(res, 500, { success: false, message: err.message });
      }
    }

    // ── Root: friendly landing so browsing the bare URL is not an error ──
    if (reqPath === '/') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({
        success: true,
        service: 'Morph Figma Cloud Server',
        status: 'running',
        docs: ['/api/status', '/admin (requires ADMIN_TOKEN)'],
      }));
    }

    // ── 404 (Always return clean JSON) ───────────────────────────
    return sendJson(res, 404, { success: false, message: `Endpoint not found: ${req.method} ${reqPath}` });

  } catch (err) {
    console.error('[Server] Unhandled error:', err);
    return sendJson(res, 500, { success: false, message: err.message });
  }
});

server.listen(PORT, () => {
  console.log('');
  console.log('══════════════════════════════════════════════');
  console.log('  ✦ Morph Server (Direct Mode)');
  console.log(`  Running at: http://localhost:${PORT}`);
  console.log(`  Rate Limit: 10 credits / model / day`);
  console.log(`  Gemini: ${geminiClient.isReady() ? 'Ready' : 'Not configured (set GEMINI_API_KEY)'}`);
  console.log('══════════════════════════════════════════════');
  console.log('');
});
