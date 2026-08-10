/**
 * Morph — Cloud / Local Storage Abstraction
 *
 * Single read/write API for project files that works both on a local
 * long-running server (plain filesystem) and on Vercel serverless
 * (Supabase Storage cloud bucket).
 *
 * On Vercel the deploy filesystem is read-only and ephemeral, so generated
 * artifacts (screens/components/tokens and project local config) are stored
 * in a private Supabase Storage bucket. Bucket keys use the same relative
 * paths as the local layout, e.g. `<Project>/screens/feed.js`.
 *
 * Reads fall back to the deploy filesystem so files baked into the repo at
 * deploy time (committed demo projects like `Instagram/`) keep working.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const ROOT_DIR = path.join(__dirname, '..');

const SYSTEM_DIRS = ['plugin', 'core', 'global', 'node_modules', '.git', 'engine', 'local', 'screens', 'components', 'tokens', 'public', 'static', '_users'];

const isCloudEnv = process.env.VERCEL === '1' || process.env.CLOUD_STORE === '1';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'morph';

// Lazy singleton so a missing env var in local mode never crashes the server.
let supabaseClient = null;
let storageBucket = null;

function getStorage() {
  if (storageBucket) return storageBucket;
  if (!isCloudEnv || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  storageBucket = supabaseClient.storage.from(SUPABASE_BUCKET);
  return storageBucket;
}

function isCloud() {
  return isCloudEnv;
}

function localPath(relPath) {
  return path.normalize(path.join(ROOT_DIR, relPath));
}

function assertsSupabaseConfigured() {
  if (!getStorage()) {
    throw new Error('Cloud storage is not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, and create a private "morph" bucket in the Supabase dashboard.');
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Download a file from Supabase Storage and decode it as utf8 text.
 * @param {string} relPath
 * @returns {Promise<string|null>}
 */
async function downloadText(relPath) {
  const { data, error } = await getStorage().download(relPath);
  if (error || !data) return null;
  try {
    return await data.text();
  } catch (e) {
    return null;
  }
}

async function readText(relPath, options = {}) {
  // `retry: false` is used for best-effort/existence reads where an instant
  // miss is the expected outcome (new user records, config files). Supabase is
  // strongly consistent, so the retry loop is only a safety net for transient
  // errors; a miss returns null immediately.
  const maxAttempts = options.retry === false ? 1 : 6;
  const waitMs = options.retry === false ? 0 : 300;
  if (isCloud() && getStorage()) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const text = await downloadText(relPath);
      if (text != null) return text;
      if (attempt < maxAttempts - 1 && waitMs) await sleep(waitMs);
    }
    const fp = localPath(relPath);
    return fs.existsSync(fp) ? fs.readFileSync(fp, 'utf8') : null;
  }
  const fp = localPath(relPath);
  return fs.existsSync(fp) ? fs.readFileSync(fp, 'utf8') : null;
}

async function writeText(relPath, content, contentType = 'text/plain') {
  if (isCloud()) {
    assertsSupabaseConfigured();
    const { error } = await getStorage().upload(relPath, content, {
      upsert: true,
      contentType,
    });
    if (error) throw error;
    return relPath;
  }
  const fp = localPath(relPath);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, content, 'utf8');
  return relPath;
}

async function exists(relPath) {
  if (isCloud() && getStorage()) {
    try {
      const { data } = await getStorage().exists(relPath);
      if (data) return true;
    } catch (e) {
      // Fall through to the deploy filesystem.
    }
    return fs.existsSync(localPath(relPath));
  }
  return fs.existsSync(localPath(relPath));
}

async function deletePath(relPath) {
  if (isCloud()) {
    assertsSupabaseConfigured();
    try {
      await getStorage().remove([relPath]);
    } catch (e) {
      // Ignore already-deleted objects.
    }
    return;
  }
  const fp = localPath(relPath);
  if (fs.existsSync(fp)) {
    try {
      fs.unlinkSync(fp);
    } catch (e) { /* ignore */ }
  }
}

/**
 * Recursively list every object key under a folder prefix.
 * Supabase lists one folder at a time (non-recursive), so walk the tree by
 * drilling into folder entries until every leaf file is found.
 * @param {string} prefix — folder path, e.g. `''` or `Instagram/`
 * @returns {Promise<string[]>} — full object keys, e.g. `Instagram/screens/feed.js`
 */
async function listCloudKeys(prefix) {
  const files = [];
  const pending = [prefix.replace(/\/+$/, '')];
  while (pending.length) {
    const folder = pending.pop();
    let offset = 0;
    for (;;) {
      const { data, error } = await getStorage().list(folder, { limit: 1000, offset });
      if (error || !data || data.length === 0) break;
      for (const item of data) {
        if (!item || !item.name) continue;
        // Folder entries have no id/metadata; files always do.
        const key = folder ? `${folder}/${item.name}` : item.name;
        if (item.id === null || item.metadata === null) {
          pending.push(key);
        } else {
          files.push(key);
        }
      }
      if (data.length < 1000) break;
      offset += data.length;
    }
  }
  return files;
}

async function deletePrefix(relPrefix) {
  if (isCloud()) {
    assertsSupabaseConfigured();
    let count = 0;
    try {
      const keys = await listCloudKeys(relPrefix);
      for (let i = 0; i < keys.length; i += 1000) {
        const { error } = await getStorage().remove(keys.slice(i, i + 1000));
        if (!error) count += Math.min(1000, keys.length - i);
      }
    } catch (e) { /* ignore */ }
    return count;
  }
  const dir = localPath(relPrefix);
  if (fs.existsSync(dir)) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch (e) { /* ignore */ }
  }
  return 1;
}

function walkLocal(dirAbs, relPrefix, out, skipSystem) {
  let entries;
  try { entries = fs.readdirSync(dirAbs, { withFileTypes: true }); } catch (e) { return; }
  for (const entry of entries) {
    const rel = relPrefix + entry.name;
    if (entry.isDirectory()) {
      if (skipSystem && (entry.name.startsWith('.') || SYSTEM_DIRS.includes(entry.name))) continue;
      walkLocal(path.join(dirAbs, entry.name), rel + '/', out, false);
    } else {
      out.add(rel);
    }
  }
}

/**
 * Single-pass scan of every stored file under a prefix (Supabase Storage +
 * deploy filesystem, deduped). Returns relative paths (empty prefix => full
 * relative paths like `Instagram/screens/feed.js`). This replaces the previous
 * loop of many per-folder list() calls that made /api/projects take ~10s.
 * @param {string} relPrefix
 * @returns {Promise<string[]>}
 */
async function scanTree(relPrefix = '') {
  const out = new Set();
  const prefix = relPrefix.endsWith('/') || relPrefix === '' ? relPrefix : relPrefix + '/';
  if (isCloud() && getStorage()) {
    try {
      const keys = await listCloudKeys(prefix);
      for (const key of keys) {
        const rel = key.startsWith(prefix) ? key.slice(prefix.length) : key;
        if (rel) out.add(rel);
      }
    } catch (e) { /* ignore */ }
  }
  const dirAbs = localPath(prefix);
  if (fs.existsSync(dirAbs)) {
    walkLocal(dirAbs, prefix, out, prefix === '');
  }
  let paths = Array.from(out);
  if (prefix) {
    // Normalize to prefix-relative paths (cloud slice + local walk must agree).
    paths = paths.map(p => p.startsWith(prefix) ? p.slice(prefix.length) : p);
  }
  return paths;
}

async function listFileNames(relPrefix) {
  const paths = await scanTree(relPrefix);
  const names = [];
  for (const p of paths) {
    if (!p.includes('/')) names.push(p);
  }
  // Hide scaffolding placeholder files (e.g. .gitkeep) from "real" listings.
  return names.filter(n => !n.startsWith('.'));
}

let projectCache = null;
let projectCacheAt = 0;

async function listProjectNames() {
  if (isCloud()) {
    const now = Date.now();
    if (projectCache && now - projectCacheAt < 20000) return projectCache;
    const names = new Set();
    if (getStorage()) {
      try {
        const keys = await listCloudKeys('');
        for (const key of keys) {
          const parts = key.split('/').filter(Boolean);
          if (parts.length >= 3) names.add(parts[0]);
        }
      } catch (e) { /* ignore */ }
    }
    try {
      const entries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
      for (const e of entries) {
        if (e.isDirectory() && !e.name.startsWith('.') && !SYSTEM_DIRS.includes(e.name)) names.add(e.name);
      }
    } catch (e) { /* ignore */ }
    projectCache = Array.from(names);
    projectCacheAt = now;
    return projectCache;
  }

  try {
    const entries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
    return entries
      .filter(e => e.isDirectory() && !e.name.startsWith('.') && !SYSTEM_DIRS.includes(e.name))
      .map(e => e.name);
  } catch (err) {
    return [];
  }
}

module.exports = {
  isCloud,
  readText,
  writeText,
  exists,
  deletePath,
  deletePrefix,
  listFileNames,
  listProjectNames,
  scanTree,
};
