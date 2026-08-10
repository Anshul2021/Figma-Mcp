/**
 * Morph — Gemini Client
 * 
 * Thin wrapper around @google/generative-ai SDK.
 * Accepts a system prompt + user prompt + optional multimodal image reference,
 * calls Gemini Flash, and returns clean JavaScript code ready to write to disk.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Supported Gemini Flash models (10 credits / model / day)
const AVAILABLE_MODELS = [
  { id: 'gemini-3.6-flash',      label: 'Gemini 3.6 Flash (Recommended)', tier: 'flash' },
  { id: 'gemini-3.5-flash',      label: 'Gemini 3.5 Flash',                tier: 'flash' },
  { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash Lite',           tier: 'flash' },
  { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash Lite',           tier: 'flash' },
  { id: 'gemini-3-flash',        label: 'Gemini 3 Flash',                  tier: 'flash' },
  { id: 'gemini-2.5-flash',      label: 'Gemini 2.5 Flash',                tier: 'flash' },
  { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite',           tier: 'flash' },
];

let genAI = null;

/**
 * Initialize the Gemini client with an API key.
 * Called once at server startup.
 * @param {string} apiKey
 */
function initialize(apiKey) {
  if (!apiKey) {
    console.warn('[Gemini] No API key provided — generation will be unavailable.');
    return;
  }
  genAI = new GoogleGenerativeAI(apiKey);
  console.log('[Gemini] Client initialized with Gemini Flash models.');
}

/**
 * Check if the client is ready for generation.
 * @returns {boolean}
 */
function isReady() {
  return genAI !== null;
}

/**
 * Generate a Figma plugin script from a user prompt + optional image reference.
 * @param {object} params
 * @param {string} params.systemPrompt — Full system prompt from prompt-builder
 * @param {string} params.userPrompt — User's screen brief / request
 * @param {string} [params.model] — Gemini model ID (default from env)
 * @param {string} [params.imageBase64] — Optional base64-encoded image string
 * @returns {Promise<{ code: string, model: string }>}
 */
async function generate({ systemPrompt, userPrompt, model, imageBase64 }) {
  if (!genAI) {
    throw new Error('Gemini client not initialized. Set GEMINI_API_KEY in .env');
  }

  const modelId = model || process.env.GEMINI_MODEL || 'gemini-3.6-flash';

  console.log(`[Gemini] Generating with model: ${modelId} ${imageBase64 ? '(with Image Reference)' : ''}`);
  console.log(`[Gemini] User prompt: ${userPrompt.substring(0, 120)}...`);

  const generativeModel = genAI.getGenerativeModel({
    model: modelId,
    systemInstruction: systemPrompt,
  });

  let contents = [userPrompt];
  if (imageBase64) {
    let cleanBase64 = imageBase64;
    let mimeType = 'image/png';
    const match = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.*)$/);
    if (match) {
      mimeType = match[1];
      cleanBase64 = match[2];
    }

    contents = [
      userPrompt + "\n\n(Note: The user has attached a UI reference image. Visually analyze its layout, components, colors, typography, and structure to generate a matching production-quality Figma UI script.)",
      {
        inlineData: {
          mimeType: mimeType,
          data: cleanBase64,
        }
      }
    ];
  }

  const result = await generativeModel.generateContent(contents);
  const response = result.response;
  const text = response.text();

  // Extract JavaScript code from the response
  let code = extractJavaScript(text);

  // Validate the extracted code BEFORE writing to disk. If Gemini produced a
  // syntax error (e.g. `itemSpacing = 12` inside an object literal), retry once
  // with a corrective hint instead of shipping a broken script to Figma.
  const check = validateJavaScript(code);
  if (!check.valid) {
    console.warn(`[Gemini] Generated code failed syntax check: ${check.message}`);
    try {
      const fixPrompt = `${userPrompt}\n\n---\n\nThe JavaScript code you just generated has a SYNTAX ERROR:\n${check.message}\n\nCarefully fix the syntax error (e.g. object properties MUST use colons "key: value", NEVER "key = value") and output the COMPLETE corrected script in full. Do not truncate.`;
      const retryResult = await generativeModel.generateContent([fixPrompt]);
      const retryText = retryResult.response.text();
      code = extractJavaScript(retryText);
      const recheck = validateJavaScript(code);
      if (!recheck.valid) {
        console.warn(`[Gemini] Retry still failed syntax check: ${recheck.message}`);
      } else {
        console.log(`[Gemini] Retry produced valid JavaScript.`);
      }
    } catch (retryErr) {
      console.warn('[Gemini] Retry failed:', retryErr.message);
    }
  }

  console.log(`[Gemini] Generated ${code.length} chars of JavaScript.`);
  return { code, model: modelId };
}

/**
 * Validate that generated code is syntactically valid JavaScript.
 * Uses `new Function` which parses (but does not execute) the body, so
 * broken scripts are caught before they are written to disk and before
 * Figma tries to eval them.
 * @param {string} code
 * @returns {{ valid: boolean, message?: string }}
 */
function validateJavaScript(code) {
  if (!code || typeof code !== 'string') return { valid: false, message: 'Empty generated code' };
  try {
    // eslint-disable-next-line no-new-func
    new Function('figma', code);
    return { valid: true };
  } catch (e) {
    return { valid: false, message: e.message };
  }
}

/**
 * Extract clean JavaScript from Gemini's response.
 * Handles cases where the model wraps code in markdown fences.
 * @param {string} rawText
 * @returns {string} — Clean JS code
 */
function extractJavaScript(rawText) {
  const fencePatterns = [
    /```(?:javascript|js)\s*\n([\s\S]*?)```/i,
    /```\s*\n([\s\S]*?)```/i,
  ];

  for (const pattern of fencePatterns) {
    const match = rawText.match(pattern);
    if (match && match[1] && match[1].includes('figma.')) {
      return match[1].trim();
    }
  }

  const trimmed = rawText.trim();
  if (trimmed.startsWith('(async') || trimmed.includes('figma.createFrame')) {
    return trimmed;
  }

  return trimmed;
}

/**
 * Get the list of available models for the plugin UI dropdown.
 * @returns {Array<{ id: string, label: string, tier: string }>}
 */
function getAvailableModels() {
  return AVAILABLE_MODELS;
}

module.exports = {
  initialize,
  isReady,
  generate,
  getAvailableModels,
  extractJavaScript,
  validateJavaScript,
};
