/**
 * Morph — Daily Rate Limiter Engine
 *
 * Manages daily credit allocation: 10 generations per model per user IP/ID
 * per day. Resets automatically at midnight UTC.
 *
 * Storage is two-tier:
 *  - Supabase Postgres: usage lives in the `users.usage` jsonb column as
 *    `{ "<YYYY-MM-DD>": { "<model>": count } }`. Credits are consumed
 *    atomically via the `bump_usage` DB function (row-locked), so it works
 *    reliably on serverless and survives cold starts.
 *  - Local `.rate-limit.json` file fallback when Supabase is not configured.
 */

const fs = require('fs');
const path = require('path');
const supabase = require('./supabase');

const LIMIT_PER_MODEL_PER_DAY = 10;
const STORAGE_FILE = path.join(__dirname, '..', '.rate-limit.json');

function getTodayString() {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

// ── Local file fallback state ─────────────────────────────────

let inMemoryState = { date: getTodayString(), usage: {} };
// Set to true the first time bump_usage is detected as broken/stale, so every
// subsequent consume skips the RPC and uses the reliable direct table write.
let rpcBroken = false;

function loadState() {
  const today = getTodayString();
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8'));
      if (data.date === today && data.usage) {
        inMemoryState = data;
        return data;
      }
    }
  } catch (e) {
    // Fallback to in-memory state if serverless disk is read-only
  }

  if (inMemoryState.date !== today) {
    inMemoryState = { date: today, usage: {} };
  }
  return inMemoryState;
}

function saveState(state) {
  inMemoryState = state;
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (e) {
    // Ignore read-only filesystem warnings on serverless platforms like Vercel
  }
}

// ── Supabase Postgres helpers ─────────────────────────────────

async function dbUsage(clientId) {
  const { data, error } = await supabase.getClient()
    .from('users')
    .select('usage')
    .eq('ip', clientId)
    .maybeSingle();
  if (error) return null;
  return (data && data.usage) || {};
}

/**
 * Get credit info for a single model.
 * @param {string} modelId
 * @param {string} [clientId] - User IP or User ID
 * @returns {Promise<{ remaining: number, total: number, used: number, date: string }>}
 */
async function getCredits(modelId, clientId = 'global') {
  if (supabase.isConfigured()) {
    const today = getTodayString();
    let usage = {};
    try { usage = await dbUsage(clientId); } catch (e) { usage = null; }
    // DB unavailable (missing table/migration) → mirror local limiter state so
    // the badge always reflects what consumeCredit actually decremented.
    if (usage === null || typeof usage !== 'object') {
      const state = loadState();
      const key = `${clientId}:${modelId}`;
      const used = state.usage[key] || 0;
      return {
        modelId,
        remaining: Math.max(0, LIMIT_PER_MODEL_PER_DAY - used),
        total: LIMIT_PER_MODEL_PER_DAY,
        used,
        date: state.date,
      };
    }
    const used = (usage[today] && usage[today][modelId]) || 0;
    return {
      modelId,
      remaining: Math.max(0, LIMIT_PER_MODEL_PER_DAY - used),
      total: LIMIT_PER_MODEL_PER_DAY,
      used,
      date: today,
    };
  }

  const state = loadState();
  const key = `${clientId}:${modelId}`;
  const used = state.usage[key] || state.usage[modelId] || 0;
  const remaining = Math.max(0, LIMIT_PER_MODEL_PER_DAY - used);
  return {
    modelId,
    remaining,
    total: LIMIT_PER_MODEL_PER_DAY,
    used,
    date: state.date,
  };
}

/**
 * Get credit info for an array of model objects.
 * @param {Array<{ id: string, label: string }>} models
 * @param {string} [clientId] - User IP or User ID
 * @returns {Promise<Object.<string, { remaining: number, total: number, used: number }>>}
 */
async function getAllCredits(models = [], clientId = 'global') {
  if (supabase.isConfigured()) {
    const today = getTodayString();
    let usage = {};
    try { usage = await dbUsage(clientId); } catch (e) { usage = null; }
    // DB unavailable → mirror local limiter state.
    if (usage === null || typeof usage !== 'object') {
      const state = loadState();
      const result = {};
      for (const m of models) {
        const key = `${clientId}:${m.id}`;
        const used = state.usage[key] || state.usage[m.id] || 0;
        result[m.id] = {
          remaining: Math.max(0, LIMIT_PER_MODEL_PER_DAY - used),
          total: LIMIT_PER_MODEL_PER_DAY,
          used,
        };
      }
      return result;
    }
    const usedByModel = usage[today] || {};
    const result = {};
    for (const m of models) {
      const used = usedByModel[m.id] || 0;
      result[m.id] = {
        remaining: Math.max(0, LIMIT_PER_MODEL_PER_DAY - used),
        total: LIMIT_PER_MODEL_PER_DAY,
        used,
      };
    }
    return result;
  }

  const state = loadState();
  const result = {};
  for (const m of models) {
    const key = `${clientId}:${m.id}`;
    const used = state.usage[key] || state.usage[m.id] || 0;
    result[m.id] = {
      remaining: Math.max(0, LIMIT_PER_MODEL_PER_DAY - used),
      total: LIMIT_PER_MODEL_PER_DAY,
      used,
    };
  }
  return result;
}

/**
 * Consume 1 credit for a model for a specific client IP / ID.
 * @param {string} modelId
 * @param {string} [clientId] - User IP or User ID
 * @returns {Promise<{ success: boolean, remaining: number, message?: string }>}
 */
async function consumeCredit(modelId, clientId = 'global') {
  if (supabase.isConfigured()) {
    const today = getTodayString();
    const client = supabase.getClient();

    // Once a broken/stale bump_usage has been detected, skip the RPC and go
    // straight to the reliable direct write for the rest of the process.
    if (rpcBroken) {
      return await consumeCreditDirect(modelId, clientId, today);
    }

    try {
      const { data, error } = await client.rpc('bump_usage', {
        p_ip: clientId,
        p_day: today,
        p_model: modelId,
        p_limit: LIMIT_PER_MODEL_PER_DAY,
      });
      if (!error && data && data.success === true) {
        // The RPC claimed success — but a stale/broken bump_usage function can
        // return success while silently failing to persist (e.g. row inserted
        // by the RPC but the jsonb UPDATE never lands). Verify the write; if it
        // did not persist, fall back to a direct table write so credits really
        // decrement.
        const ver = await client.from('users').select('usage').eq('ip', clientId).maybeSingle();
        const persisted = ver.data && ver.data.usage && ver.data.usage[today] && ver.data.usage[today][modelId];
        if (persisted === data.used) {
          return { success: true, remaining: data.remaining };
        }
        rpcBroken = true;
        console.warn('[RateLimiter] bump_usage returned success but did not persist usage; using direct fallback.');
        return await consumeCreditDirect(modelId, clientId, today);
      }
      if (!error && data && data.success === false) {
        return {
          success: false,
          remaining: data.remaining || 0,
          message: `Daily limit of ${LIMIT_PER_MODEL_PER_DAY} generations reached for model "${modelId}". Resets at midnight UTC.`,
        };
      }
      // bump_usage is missing (supabase/schema.sql not installed yet) → fall
      // back to a direct table write so credits STILL decrement instead of
      // silently allowing unlimited generations.
      rpcBroken = true;
      console.warn('[RateLimiter] bump_usage RPC unavailable, using direct DB fallback:', error ? error.message : 'unknown');
      return await consumeCreditDirect(modelId, clientId, today);
    } catch (e) {
      rpcBroken = true;
      console.warn('[RateLimiter] bump_usage failed, using direct DB fallback:', e.message);
      return await consumeCreditDirect(modelId, clientId, today);
    }
  }

  const state = loadState();
  const key = `${clientId}:${modelId}`;
  const used = state.usage[key] || 0;
  if (used >= LIMIT_PER_MODEL_PER_DAY) {
    return {
      success: false,
      remaining: 0,
      message: `Daily limit of ${LIMIT_PER_MODEL_PER_DAY} generations reached for model "${modelId}". Resets at midnight UTC.`,
    };
  }

  state.usage[key] = used + 1;
  saveState(state);

  const remaining = LIMIT_PER_MODEL_PER_DAY - state.usage[key];
  return {
    success: true,
    remaining,
  };
}

/**
 * Fallback credit consumption against the `users` table directly (no RPC).
 * Reads the jsonb usage, enforces the limit, and writes it back. Used when
 * the `bump_usage` SQL function is missing because schema.sql has not been
 * run yet, so rate limiting works even before the migration.
 */
async function consumeCreditDirect(modelId, clientId, today) {
  const client = supabase.getClient();
  try {
    let usage = {};
    const { data, error } = await client.from('users').select('usage').eq('ip', clientId).maybeSingle();
    if (!error && data && data.usage) usage = data.usage;
    const used = (usage[today] && usage[today][modelId]) || 0;
    if (used >= LIMIT_PER_MODEL_PER_DAY) {
      return {
        success: false,
        remaining: 0,
        message: `Daily limit of ${LIMIT_PER_MODEL_PER_DAY} generations reached for model "${modelId}". Resets at midnight UTC.`,
      };
    }
    usage[today] = usage[today] || {};
    usage[today][modelId] = used + 1;
    const { error: upErr } = await client.from('users').upsert(
      { ip: clientId, usage, last_seen: new Date().toISOString() },
      { onConflict: 'ip' }
    );
    if (upErr) throw upErr;
    return { success: true, remaining: LIMIT_PER_MODEL_PER_DAY - (used + 1) };
  } catch (e) {
    // Even the direct table write failed (users table missing) → enforce with
    // the local file / in-memory limiter so credits still decrement.
    console.warn('[RateLimiter] Direct DB fallback failed, using local limiter:', e.message);
    const state = loadState();
    const key = `${clientId}:${modelId}`;
    const used = state.usage[key] || 0;
    if (used >= LIMIT_PER_MODEL_PER_DAY) {
      return {
        success: false,
        remaining: 0,
        message: `Daily limit of ${LIMIT_PER_MODEL_PER_DAY} generations reached for model "${modelId}". Resets at midnight UTC.`,
      };
    }
    state.usage[key] = used + 1;
    saveState(state);
    return { success: true, remaining: LIMIT_PER_MODEL_PER_DAY - state.usage[key] };
  }
}

module.exports = {
  LIMIT_PER_MODEL_PER_DAY,
  getCredits,
  getAllCredits,
  consumeCredit,
};
