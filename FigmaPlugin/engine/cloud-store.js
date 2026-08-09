/**
 * Morph — Cloud / Local Storage Abstraction
 *
 * Single read/write API for project files that works both on a local
 * long-running server (plain filesystem) and on Vercel serverless
 * (Vercel Blob cloud storage).
 *
 * On Vercel the deploy filesystem is read-only and ephemeral, so generated
 * artifacts (screens/components/tokens and project local config) are stored
 * in the Vercel Blob store attached to the project. Blob keys use the same
 * relative paths as the local layout, e.g. `<Project>/screens/feed.js`.
 *
 * Reads fall back to the deploy filesystem so files baked into the repo at
 * deploy time (committed demo projects like `Instagram/`) keep working.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

const SYSTEM_DIRS = ['plugin', 'core', 'global', 'node_modules', '.git', 'engine', 'local', 'screens', 'components', 'tokens', 'public', 'static', '_users'];

const isCloudEnv = process.env.VERCEL === '1' || process.env.CLOUD_STORE === '1';
const blob = isCloudEnv ? require('@vercel/blob') : null;

const BLOB_ACCESS = 'private';

function isCloud() {
  return isCloudEnv;
}

function localPath(relPath) {
  return path.normalize(path.join(ROOT_DIR, relPath));
}

function assertsBlobConfigured() {
  if (!blob) {
    throw new Error('Cloud storage is not available outside Vercel. Run the server locally or deploy to Vercel with a Blob store.');
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('Cloud storage is not configured: attach the Vercel Blob store to your project (Vercel injects BLOB_READ_WRITE_TOKEN automatically).');
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function blobText(result) {
  if (!result) return null;
  if (typeof result.text === 'function') return await result.text();
  if (result.stream && typeof Response !== 'undefined') return await new Response(result.stream).text();
  if (result.blob && result.blob.url) {
    try {
      const res = await fetch(result.blob.url);
      return res.ok ? await res.text() : null;
    } catch (e) {
      return null;
    }
  }
  return null;
}

async function readText(relPath, options = {}) {
  // `retry: false` is used for best-effort/existence reads where an instant
  // miss is the expected outcome (new user records, config files). The retry
  // loop is only worth it for freshly-generated scripts served right after a write.
  const maxAttempts = options.retry === false ? 1 : 6;
  const waitMs = options.retry === false ? 0 : 300;
  if (isCloud()) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const result = await blob.get(relPath, { access: BLOB_ACCESS });
        const text = await blobText(result);
        if (text != null) return text;
      } catch (e) { /* retry transient errors */ }
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
    assertsBlobConfigured();
    await blob.put(relPath, content, {
      access: BLOB_ACCESS,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType,
    });
    return relPath;
  }
  const fp = localPath(relPath);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, content, 'utf8');
  return relPath;
}

async function exists(relPath) {
  if (isCloud()) {
    try {
      await blob.head(relPath);
      return true;
    } catch (e) {
      return fs.existsSync(localPath(relPath));
    }
  }
  return fs.existsSync(localPath(relPath));
}

async function deletePath(relPath) {
  if (isCloud()) {
    assertsBlobConfigured();
    try {
      await blob.del(relPath);
    } catch (e) {
      // Ignore already-deleted blobs.
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

async function deletePrefix(relPrefix) {
  if (isCloud()) {
    assertsBlobConfigured();
    let cursor;
    let count = 0;
    try {
      do {
        const page = await blob.list({ prefix: relPrefix, cursor });
        const keys = page.blobs.map(b => b.pathname);
        count += keys.length;
        if (keys.length > 0) await blob.del(keys);
        cursor = page.cursor;
      } while (cursor);
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
 * Single-pass scan of every stored file under a prefix (Vercel Blob + deploy
 * filesystem, deduped). Returns relative paths (empty prefix => full relative
 * paths like `Instagram/screens/feed.js`). This replaces the previous loop of
 * many per-folder list() calls that made /api/projects take ~10s.
 * @param {string} relPrefix
 * @returns {Promise<string[]>}
 */
async function scanTree(relPrefix = '') {
  const out = new Set();
  const prefix = relPrefix.endsWith('/') || relPrefix === '' ? relPrefix : relPrefix + '/';
  if (isCloud()) {
    try {
      let cursor;
      do {
        const page = await blob.list({ prefix, cursor, limit: 1000 });
        for (const b of page.blobs) {
          const rel = b.pathname.startsWith(prefix) ? b.pathname.slice(prefix.length) : b.pathname;
          if (rel) out.add(rel);
        }
        cursor = page.cursor;
      } while (cursor);
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
  return names;
}

let projectCache = null;
let projectCacheAt = 0;

async function listProjectNames() {
  if (isCloud()) {
    const now = Date.now();
    if (projectCache && now - projectCacheAt < 20000) return projectCache;
    const names = new Set();
    try {
      let cursor;
      do {
        const page = await blob.list({ prefix: '', cursor, limit: 1000 });
        for (const b of page.blobs) {
          const parts = b.pathname.split('/').filter(Boolean);
          if (parts.length >= 3) names.add(parts[0]);
        }
        cursor = page.cursor;
      } while (cursor);
    } catch (e) { /* ignore */ }
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