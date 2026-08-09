/**
 * Morph — Daily Rate Limiter Engine
 * 
 * Manages daily credit allocation: 10 generations per model per user IP/ID per day.
 * Resets automatically at midnight.
 */

const fs = require('fs');
const path = require('path');

const LIMIT_PER_MODEL_PER_DAY = 10;
const STORAGE_FILE = path.join(__dirname, '..', '.rate-limit.json');

function getTodayString() {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

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

/**
 * Get credit info for a single model.
 * @param {string} modelId 
 * @param {string} [clientId] - User IP or User ID
 * @returns {{ remaining: number, total: number, used: number, date: string }}
 */
function getCredits(modelId, clientId = 'global') {
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
 * @returns {Object.<string, { remaining: number, total: number, used: number }>}
 */
function getAllCredits(models = [], clientId = 'global') {
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
 * @returns {{ success: boolean, remaining: number, message?: string }}
 */
function consumeCredit(modelId, clientId = 'global') {
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
