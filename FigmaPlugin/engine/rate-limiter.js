/**
 * Morph — Daily Rate Limiter Engine
 * 
 * Manages daily credit allocation: 10 generations per model per day.
 * Usage is stored in `.rate-limit.json` and automatically resets at midnight.
 */

const fs = require('fs');
const path = require('path');

const LIMIT_PER_MODEL_PER_DAY = 10;
const STORAGE_FILE = path.join(__dirname, '..', '.rate-limit.json');

function getTodayString() {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function loadState() {
  const today = getTodayString();
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8'));
      if (data.date === today && data.usage) {
        return data;
      }
    }
  } catch (e) {
    console.warn('[RateLimiter] Error loading state, resetting:', e.message);
  }
  // Reset for a new day
  return { date: today, usage: {} };
}

function saveState(state) {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (e) {
    console.warn('[RateLimiter] Error saving state:', e.message);
  }
}

/**
 * Get credit info for a single model.
 * @param {string} modelId 
 * @returns {{ remaining: number, total: number, used: number, date: string }}
 */
function getCredits(modelId) {
  const state = loadState();
  const used = state.usage[modelId] || 0;
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
 * @returns {Object.<string, { remaining: number, total: number, used: number }>}
 */
function getAllCredits(models = []) {
  const state = loadState();
  const result = {};
  for (const m of models) {
    const used = state.usage[m.id] || 0;
    result[m.id] = {
      remaining: Math.max(0, LIMIT_PER_MODEL_PER_DAY - used),
      total: LIMIT_PER_MODEL_PER_DAY,
      used,
    };
  }
  return result;
}

/**
 * Consume 1 credit for a model.
 * @param {string} modelId 
 * @returns {{ success: boolean, remaining: number, message?: string }}
 */
function consumeCredit(modelId) {
  const state = loadState();
  const used = state.usage[modelId] || 0;
  if (used >= LIMIT_PER_MODEL_PER_DAY) {
    return {
      success: false,
      remaining: 0,
      message: `Daily limit of ${LIMIT_PER_MODEL_PER_DAY} generations reached for model "${modelId}". Resets at midnight.`,
    };
  }

  state.usage[modelId] = used + 1;
  saveState(state);

  const remaining = LIMIT_PER_MODEL_PER_DAY - state.usage[modelId];
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
