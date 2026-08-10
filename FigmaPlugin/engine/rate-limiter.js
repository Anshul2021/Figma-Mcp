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
    try { usage = await dbUsage(clientId); } catch (e) { usage = {}; }
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
    try { usage = await dbUsage(clientId); } catch (e) { usage = {}; }
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
    try {
      const { data, error } = await supabase.getClient().rpc('bump_usage', {
        p_ip: clientId,
        p_day: today,
        p_model: modelId,
        p_limit: LIMIT_PER_MODEL_PER_DAY,
      });
      if (error) {
        console.warn('[RateLimiter] bump_usage failed (is supabase/schema.sql installed?):', error.message);
        return { success: true, remaining: LIMIT_PER_MODEL_PER_DAY };
      }
      if (!data || data.success === false) {
        return {
          success: false,
          remaining: data ? data.remaining : 0,
          message: `Daily limit of ${LIMIT_PER_MODEL_PER_DAY} generations reached for model "${modelId}". Resets at midnight UTC.`,
        };
      }
      return { success: true, remaining: data.remaining };
    } catch (e) {
      console.warn('[RateLimiter] bump_usage failed:', e.message);
      return { success: true, remaining: LIMIT_PER_MODEL_PER_DAY };
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

module.exports = {
  LIMIT_PER_MODEL_PER_DAY,
  getCredits,
  getAllCredits,
  consumeCredit,
};
