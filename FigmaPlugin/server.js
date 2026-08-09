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

  const filePath = path.normalize(path.join(ROOT_DIR, projName, subFolder, scriptFile));
  if (filePath.startsWith(ROOT_DIR) && fs.existsSync(filePath)) return filePath;
  return null;
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
      const filePath = resolveScriptPath(fileName);
      if (!filePath) {
        return sendJson(res, 404, { success: false, message: `Script Not Found: ${fileName}` });
      }
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          return sendJson(res, 500, { success: false, message: 'Error reading file' });
        }
        res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
        res.end(data);
      });
      return;
    }

    // Delete a generated script file (screens/components/tokens .js)
    if (reqPath.startsWith('/api/scripts/') && req.method === 'DELETE') {
      const fileName = decodeURIComponent(reqPath.substring('/api/scripts/'.length));
      const filePath = resolveScriptPath(fileName);
      if (!filePath || !fileName.endsWith('.js')) {
        return sendJson(res, 404, { success: false, message: `File Not Found: ${fileName}` });
      }
      try {
        fs.unlinkSync(filePath);
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
      const projects = projectManager.listProjects();
      return sendJson(res, 200, { projects });
    }

    // ── Project CRUD Endpoints ───────────────────────────────────

    // Create project
    if (reqPath === '/api/projects' && req.method === 'POST') {
      const body = await readBody(req);
      if (!body.name) {
        return sendJson(res, 400, { success: false, message: 'Project name is required.' });
      }
      const result = projectManager.createProject(body.name, {
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
      const config = projectManager.getProjectConfig(projectName);
      if (!config) return sendJson(res, 404, { success: false, message: 'Project not found' });
      return sendJson(res, 200, config);
    }

    // Update project config
    if (configMatch && req.method === 'PUT') {
      const projectName = decodeURIComponent(configMatch[1]);
      const body = await readBody(req);
      const result = projectManager.updateProjectConfig(projectName, body);
      return sendJson(res, result.success ? 200 : 404, result);
    }

    // Delete a project
    const projMatch = reqPath.match(/^\/api\/projects\/([^/]+)$/);
    if (projMatch && req.method === 'DELETE') {
      const projectName = decodeURIComponent(projMatch[1]);
      const result = projectManager.deleteProject(projectName);
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
        const systemPrompt = promptBuilder.buildScreenPrompt(project, { skipAutolayout });
        const result = await geminiClient.generate({ systemPrompt, userPrompt: prompt, model: modelId, imageBase64: refImage });

        const screenName = deriveScreenName(prompt);
        const screensDir = path.join(ROOT_DIR, project, 'screens');
        if (!fs.existsSync(screensDir)) {
          fs.mkdirSync(screensDir, { recursive: true });
        }

        const filePath = path.join(screensDir, `${screenName}.js`);
        fs.writeFileSync(filePath, result.code, 'utf8');

        console.log(`[Generate] Wrote ${screenName}.js (${result.code.length} chars, model: ${result.model}, credits left: ${creditCheck.remaining})`);

        notifyClients(`${project}/screens/${screenName}.js`);

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
        const systemPrompt = promptBuilder.buildDesignSystemPrompt(project, { ...opts, project });

        // 1. Generate Native Variables & Styles if selected
        if (opts.variables !== false) {
          const varResult = await geminiClient.generate({
            systemPrompt,
            userPrompt: `Generate native Figma Variables & Text Styles (tokens/variables.js) for ${project}. Create variable collections for colors (primary, secondary, neutral 900-white scale, status colors), spacing (xs..2xl), radii (xs..full), font size (micro..hero), AND call figma.createTextStyle() for Hero(32), Heading(24), Title(20), Subhead(16), Body(14), Caption(12), Micro(10). Output ONLY clean JS code inside (async () => { ... })();`,
            model: modelId,
          });

          const tokensDir = path.join(ROOT_DIR, project, 'tokens');
          if (!fs.existsSync(tokensDir)) fs.mkdirSync(tokensDir, { recursive: true });
          fs.writeFileSync(path.join(tokensDir, 'variables.js'), varResult.code, 'utf8');
          notifyClients(`${project}/tokens/variables.js`);
        }

        // 2. Generate Master Design System Board (Visual Swatches, Typography Scale, Component Sets)
        const dsResult = await geminiClient.generate({
          systemPrompt,
          userPrompt: `Generate Master Design System board (components/DesignSystem.js) for ${project}. 1180px wide board. ${opts.colors !== false ? 'MUST include Section 1: Color Palette Swatches (primary, secondary, neutral 900-white scale, success, warning, error swatches with hex labels).' : ''} ${opts.typography !== false ? 'MUST include Section 2: Typography Scale Specimens (Hero 32px, Heading 24px, Title 20px, Subhead 16px, Body 14px, Caption 12px, Micro 10px rendered sample rows).' : ''} ${opts.components !== false ? 'MUST include Section 3: Master ComponentSets (Button & FilterPill with full variant state matrices).' : ''} Output ONLY clean JS code inside (async () => { ... })();`,
          model: modelId,
        });

        const componentsDir = path.join(ROOT_DIR, project, 'components');
        if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });
        fs.writeFileSync(path.join(componentsDir, 'DesignSystem.js'), dsResult.code, 'utf8');
        notifyClients(`${project}/components/DesignSystem.js`);

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
