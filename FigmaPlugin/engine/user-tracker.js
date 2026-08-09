/**
 * Morph — User Registry & Activity Tracker
 *
 * Records every plugin user (name + IP + first/last seen + per-model usage)
 * so the developer can see who is using the plugin and how many of their
 * 10 daily credits they have burned per IP.
 *
 * Stored under `_users/<ip>.json` through cloud-store, so it works on both
 * the local filesystem and Vercel Blob.
 */

const store = require('./cloud-store');

const USERS_PREFIX = '_users/';

function sanitizeIp(ip) {
  return String(ip || 'unknown').replace(/[^a-zA-Z0-9]/g, '_');
}

function userKey(ip) {
  return `${USERS_PREFIX}${sanitizeIp(ip)}.json`;
}

/**
 * Upsert a user record tied to an IP address.
 * @param {object} opts — { name?, ip, model? }
 */
async function recordUser({ name, ip, model }) {
  if (!ip || ip === 'unknown') return;
  const key = userKey(ip);
  let user = {};
  // `retry: false` -> an instant miss is expected on first arrival (no Blob
  // eventual-consistency wait, keeps /api/users/register snappy).
  const existing = await store.readText(key, { retry: false });
  if (existing) {
    try {
      user = JSON.parse(existing);
    } catch (e) { /* start fresh */ }
  }
  user.ip = ip;
  if (name && String(name).trim()) user.name = String(name).trim();
  if (!user.firstSeen) user.firstSeen = new Date().toISOString();
  user.lastSeen = new Date().toISOString();
  user.usage = user.usage || {};
  if (model) user.usage[model] = (user.usage[model] || 0) + 1;
  await store.writeText(key, JSON.stringify(user, null, 2), 'application/json');
}

/**
 * List all recorded users.
 * @returns {Promise<Array<object>>}
 */
async function listUsers() {
  const paths = await store.scanTree(USERS_PREFIX);
  const users = [];
  for (const f of paths) {
    if (!f.endsWith('.json')) continue;
    const full = f.startsWith(USERS_PREFIX) ? f : USERS_PREFIX + f;
    const raw = await store.readText(full, { retry: false });
    if (!raw) continue;
    try {
      users.push(JSON.parse(raw));
    } catch (e) { /* skip corrupt */ }
  }
  return users;
}

/**
 * Delete the record for an IP (used by the admin dashboard).
 * @param {string} ip
 */
async function deleteUser(ip) {
  if (!ip) return;
  await store.deletePath(userKey(ip));
}

module.exports = {
  USERS_PREFIX,
  recordUser,
  listUsers,
  deleteUser,
};