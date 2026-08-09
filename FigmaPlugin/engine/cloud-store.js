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

async function readText(relPath) {
  if (isCloud()) {
    // Blob can lag momentarily right after a write; retry briefly before falling
    // back to the deployment filesystem (committed files).
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        const result = await blob.get(relPath, { access: BLOB_ACCESS });
        const text = await blobText(result);
        if (text != null) return text;
      } catch (e) { /* retry transient errors */ }
      if (attempt < 5) await sleep(300);
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

async function listFileNames(relPrefix) {
  const names = [];
  if (isCloud()) {
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        let cursor;
        do {
          const page = await blob.list({ prefix: relPrefix, cursor });
          for (const b of page.blobs) {
            const base = b.pathname.startsWith(relPrefix)
              ? b.pathname.slice(relPrefix.length)
              : b.pathname.split('/').pop();
            if (base && !base.includes('/') && !names.includes(base)) names.push(base);
          }
          cursor = page.cursor;
        } while (cursor);
      } catch (e) { /* retry transient errors */ }
      if (names.length > 0 || attempt === 5) break;
      await sleep(400);
    }
  }
  const dir = localPath(relPrefix);
  if (fs.existsSync(dir)) {
    try {
      for (const f of fs.readdirSync(dir)) {
        if (!names.includes(f)) names.push(f);
      }
    } catch (e) { /* ignore */ }
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
};