/**
 * Morph — User Registry & Activity Tracker
 *
 * Records every plugin user (name + IP + first/last seen) so the developer
 * can see who is using the plugin and how many of their daily credits they
 * have burned per IP.
 *
 * Storage is two-tier:
 *  - Supabase Postgres `users` table when SUPABASE_URL +
 *    SUPABASE_SERVICE_ROLE_KEY are set (production, survives serverless).
 *  - Local `_users/<ip>.json` files via cloud-store otherwise (plain local
 *    development without Supabase).
 *
 * Daily credit usage lives in the same `users.usage` jsonb column and is
 * consumed atomically by the rate limiter (see rate-limiter.js).
 */

const store = require('./cloud-store');
const supabase = require('./supabase');

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

  if (supabase.isConfigured()) {
    await recordUserDb({ name, ip });
    return;
  }

  await recordUserLocal({ name, ip, model });
}

/**
 * Postgres-backed upsert. Never touches `usage` (the rate limiter owns it)
 * so a concurrent credit bump is never overwritten. Swallows DB errors so a
 * missing `users` table (migration not run yet) never breaks the app.
 */
async function recordUserDb({ name, ip }) {
  const payload = { ip, last_seen: new Date().toISOString() };
  const cleanName = name && String(name).trim() ? String(name).trim() : '';
  if (cleanName) payload.name = cleanName;
  try {
    const { error } = await supabase.getClient().from('users').upsert(payload, { onConflict: 'ip' });
    if (error) console.warn('[UserTracker] Upsert failed:', error.message);
  } catch (e) {
    console.warn('[UserTracker] Upsert failed:', e.message);
  }
}

/**
 * Local-file fallback used without Supabase credentials.
 */
async function recordUserLocal({ name, ip, model }) {
  const key = userKey(ip);
  let user = {};
  // `retry: false` -> an instant miss is expected on first arrival.
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
 * Look up the registered user for an IP (null when the IP has no record).
 * @param {string} ip
 * @returns {Promise<object|null>}
 */
async function getUserByIp(ip) {
  if (!ip) return null;
  if (supabase.isConfigured()) {
    try {
      const { data, error } = await supabase.getClient()
        .from('users')
        .select('*')
        .eq('ip', ip)
        .maybeSingle();
      if (error) return null;
      return data || null;
    } catch (e) {
      return null;
    }
  }
  const raw = await store.readText(userKey(ip), { retry: false });
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

/**
 * List all recorded users.
 * @returns {Promise<Array<object>>}
 */
async function listUsers() {
  if (supabase.isConfigured()) {
    try {
      const { data, error } = await supabase.getClient()
        .from('users')
        .select('*')
        .order('last_seen', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.warn('[UserTracker] List failed:', e.message);
      return [];
    }
  }

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
 * Delete the record for an IP.
 * @param {string} ip
 */
async function deleteUser(ip) {
  if (!ip) return;
  if (supabase.isConfigured()) {
    try {
      await supabase.getClient().from('users').delete().eq('ip', ip);
    } catch (e) {
      console.warn('[UserTracker] Delete failed:', e.message);
    }
    return;
  }
  await store.deletePath(userKey(ip));
}

module.exports = {
  USERS_PREFIX,
  recordUser,
  getUserByIp,
  listUsers,
  deleteUser,
};
