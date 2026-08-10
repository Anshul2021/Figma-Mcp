/**
 * Morph — Shared Supabase Client
 *
 * Single lazy singleton for the Supabase JavaScript client. Used by the
 * user tracker (Postgres `users` table) and the rate limiter. Reads the
 * same SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars as cloud-store.
 *
 * The client is only created when both env vars are present, so the server
 * still runs in plain local mode without any Supabase configuration.
 */

const { createClient } = require('@supabase/supabase-js');

let client = null;

/**
 * Whether Supabase credentials are available for DB-backed features.
 * @returns {boolean}
 */
function isConfigured() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Lazily create and return the Supabase client (or null if not configured).
 * @returns {object|null}
 */
function getClient() {
  if (client) return client;
  if (!isConfigured()) return null;
  client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}

/**
 * Best-effort startup check: confirms the `users` table exists so the user
 * knows to run supabase/schema.sql if it does not. Never throws.
 */
async function warnIfTableMissing() {
  if (!isConfigured()) return;
  try {
    const { error } = await getClient().from('users').select('id').limit(1);
    if (error && /relation.*does not exist/i.test(error.message)) {
      console.warn('[Supabase] The "users" table does not exist. Open the Supabase SQL editor and run FigmaPlugin/supabase/schema.sql to enable user tracking and daily rate limiting.');
    }
  } catch (e) { /* ignore */ }
}

module.exports = {
  isConfigured,
  getClient,
  warnIfTableMissing,
};
