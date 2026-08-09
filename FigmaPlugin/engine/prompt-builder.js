/**
 * Morph — Prompt Builder
 * 
 * Constructs the full system prompt for Gemini by reading and concatenating:
 *  1. Role & Output Format
 *  2. Master AI Directives (AGENTS.md)
 *  3. Core Protocols (instruction.md, autolayout.md, command.md, component.md, variables.md)
 *  4. Project Local Config (brief.md, colors.md, fonts.md, taste.md)
 *  5. Complete Skill Files (.agents/skills/*)
 * 
 * The assembled prompt instructs Gemini to output a single valid Figma plugin
 * JavaScript file that can be eval'd directly inside the Figma sandbox.
 */

const fs = require('fs');
const path = require('path');

const store = require('./cloud-store');

const ROOT_DIR = path.join(__dirname, '..');
const REPO_ROOT = path.join(ROOT_DIR, '..');

/**
 * Build the complete system prompt for screen generation.
 * @param {string} projectName — e.g. "Instagram"
 * @param {object} options — { skipAutolayout?: boolean }
 * @returns {Promise<string>} — Full system prompt text
 */
async function buildScreenPrompt(projectName, options = {}) {
  const sections = [];

  // ── 1. Role & Output Format ──
  sections.push(buildRoleSection());

  // ── 2. Master Directives & Core Protocols (AGENTS.md + FigmaPlugin/core/*) ──
  sections.push(buildCoreSection(options));

  // ── 3. Project Local Config (local/*.md + global/*.md) ──
  sections.push(await buildLocalSection(projectName));

  // ── 4. Design & Generator Skills (.agents/skills/*) ──
  sections.push(buildSkillsSection());

  // ── 5. Output Rules ──
  sections.push(buildOutputRules());

  return sections.filter(Boolean).join('\n\n---\n\n');
}

/**
 * Build the system prompt specifically for design system generation.
 * @param {string} projectName
 * @returns {Promise<string>}
 */
async function buildDesignSystemPrompt(projectName) {
  const sections = [];

  sections.push(buildRoleSection());
  sections.push(buildCoreSection({}));
  sections.push(await buildLocalSection(projectName));

  // Read the ui-design-system skill specifically
  const dsSkillPath = path.join(REPO_ROOT, '.agents', 'skills', 'ui-design-system', 'SKILL.md');
  const dsSkill = safeRead(dsSkillPath);
  if (dsSkill) {
    sections.push(`## UI Design System Skill\n\n${dsSkill}`);
  }

  // Scan existing screens for component extraction
  const screenFiles = await store.listFileNames(`${projectName}/screens/`);
  if (screenFiles.length > 0) {
    const screenContents = [];
    for (const f of screenFiles) {
      const content = await store.readText(`${projectName}/screens/${f}`);
      if (content) {
        screenContents.push(`### ${f}\n\`\`\`javascript\n${content}\n\`\`\``);
      }
    }
    if (screenContents.length > 0) {
      sections.push(`## Existing Project Screens (Analyze for Component Extraction)\n\n${screenContents.join('\n\n')}`);
    }
  }

  sections.push(buildDesignSystemOutputRules());

  return sections.filter(Boolean).join('\n\n---\n\n');
}

// ── Section Builders ──────────────────────────────────────────────

function buildRoleSection() {
  return `# System Role

You are **Morph**, an expert Figma plugin script generator. You produce production-quality JavaScript code that runs inside the Figma Plugin API sandbox.

Your output MUST be a single, self-contained JavaScript file wrapped in an async IIFE:
\`\`\`javascript
(async () => {
  // ... all code here ...
})();
\`\`\`

The code will be executed via \`new AsyncFunction('figma', code)\` with the global \`figma\` object injected. You have full access to:
- \`figma.createFrame()\`, \`figma.createText()\`, \`figma.createComponent()\`
- \`figma.loadFontAsync()\`, \`figma.createImageAsync()\`
- \`figma.createNodeFromSvg()\`, \`figma.variables.*\`
- \`fetch()\` for loading external resources (icons, images)
- All Figma Plugin API methods`;
}

function buildCoreSection(options) {
  const parts = [];

  // 1. Master System Directives from AGENTS.md (Auto Layout execution rules, zero emoji, Lucide icons, even font scale)
  const agentsMd = safeRead(path.join(REPO_ROOT, 'AGENTS.md'));
  if (agentsMd) {
    parts.push(`## Master System Directives (AGENTS.md)\n\n${agentsMd}`);
  }

  // 2. Core Protocols from FigmaPlugin/core/
  const instruction = safeRead(path.join(ROOT_DIR, 'core', 'instruction.md'));
  if (instruction) parts.push(`## Core Instructions (instruction.md)\n\n${instruction}`);

  if (!options.skipAutolayout) {
    const autolayout = safeRead(path.join(ROOT_DIR, 'core', 'autolayout.md'));
    if (autolayout) parts.push(`## Auto Layout Execution Protocol (autolayout.md)\n\n${autolayout}`);
  } else {
    parts.push(`## Layout Mode: SKIP AUTO LAYOUT\nUse absolute x/y positioning and fixed resize(w, h). Do NOT set layoutMode or any Auto Layout properties.`);
  }

  const command = safeRead(path.join(ROOT_DIR, 'core', 'command.md'));
  if (command) parts.push(`## Command Reference (command.md)\n\n${command}`);

  const component = safeRead(path.join(ROOT_DIR, 'core', 'component.md'));
  if (component) parts.push(`## Component Protocol (component.md)\n\n${component}`);

  const variables = safeRead(path.join(ROOT_DIR, 'core', 'variables.md'));
  if (variables) parts.push(`## Variables Protocol (variables.md)\n\n${variables}`);

  return parts.join('\n\n');
}

async function buildLocalSection(projectName) {
  const globalDir = path.join(ROOT_DIR, 'global');

  const mergeDirective = `## Context Merge Directive (CRITICAL)
The user's project-specific details ALWAYS take priority over the global defaults, while retaining 100% of global layout parameters and design system quality floors.

- The **global/ folder** below defines the minimum quality floor: strict even font scale (10, 12, 14, 16, 20, 24, 32), zero-emoji + Lucide vector icon protocol, auto layout execution order, 8pt grid, and subtle border / micro-padding taste.
- The **Project Local Config** below is the user's authoritative source for this specific app. Follow the user's brief, brand colors, and font choices exactly.
- When local files lack a field, fall back to global defaults.`;

  const globalConfig = buildConfigFromDir(globalDir, 'Global Baseline Defaults (quality floor — always apply)');
  const localConfig = await buildProjectLocalConfig(projectName);

  return [mergeDirective, globalConfig, localConfig]
    .filter(Boolean)
    .join('\n\n');
}

async function buildProjectLocalConfig(projectName) {
  const files = ['brief.md', 'colors.md', 'fonts.md', 'taste.md'];
  const parts = [`## Project Local Config (${projectName}) — USER AUTHORITATIVE`];
  for (const file of files) {
    const content = await store.readText(`${projectName}/local/${file}`);
    if (content) parts.push(`### ${file}\n${content}`);
  }
  return parts.length > 1 ? parts.join('\n\n') : '';
}

function buildConfigFromDir(dir, label) {
  const files = ['brief.md', 'colors.md', 'fonts.md', 'taste.md'];
  const parts = [`## ${label}`];
  for (const file of files) {
    const content = safeRead(path.join(dir, file));
    if (content) parts.push(`### ${file}\n${content}`);
  }
  return parts.join('\n\n');
}

function buildSkillsSection() {
  const skillsDir = path.join(REPO_ROOT, '.agents', 'skills');
  if (!fs.existsSync(skillsDir)) return '';

  const designSkills = ['frontend-design', 'design-taste-frontend', 'figma-screen-generator', 'ui-design-system'];
  const parts = ['## Workspace AI Skill Directives'];

  for (const skillName of designSkills) {
    const skillPath = path.join(skillsDir, skillName, 'SKILL.md');
    const content = safeRead(skillPath);
    if (content) {
      parts.push(`### Skill: ${skillName}\n${content}`);
    }
  }

  return parts.join('\n\n');
}

function buildOutputRules() {
  return `## Output Rules (MANDATORY)

1. Output ONLY valid JavaScript code inside \`(async () => { ... })();\`. No markdown fences, no text before or after code.
2. ALWAYS pre-load fonts first: \`await figma.loadFontAsync({ family: "DM Sans", style: "Regular" });\`
3. Font sizes MUST be even numbers only: 10, 12, 14, 16, 20, 24, 32
4. NEVER use emojis in text nodes. Use Lucide SVG vector icons via \`loadLucideIcon(iconName, size, color, strokeWidth = 1.5)\`.
5. Use real Unsplash images via \`applyOnlineImage(node, url)\` for all photo cards, food dishes, avatars, and hero banners.
6. Include ALL mandatory Auto Layout helper functions:
   - \`makeSpaceBetweenRow(name, fixedWidth)\`
   - \`makeHugContainer(name, direction, spacing)\`
   - \`makeContentCard(name, fixedWidth, options)\`
   - \`finalizeHugHeight(frame)\`
   - \`setChildFillWidth(child)\`
7. Header top padding must be 16px (no 44px/48px safe area padding). Screen width: 375px.
8. SCREEN FRAME NAMING & NO WRAPPER RULE:
   - NEVER wrap screens in a generic outer frame named "Generated UI Screens" or "Root Container".
   - Create screen frames directly on figma.currentPage and name them cleanly after the screen content (e.g. "YouTube Feed", "Video Detail Screen").
   - Set screenFrame.clipsContent = false so layout elements are never visually cut off.
9. AUTO LAYOUT ORDER RULE:
   - Create frame -> Set layoutMode FIRST -> Set visual fills/strokes -> Set padding & itemSpacing -> Set alignment -> APPEND ALL CHILDREN -> Set AUTO sizing modes -> Set child layoutSizingHorizontal = "FILL".
   - ALWAYS append children BEFORE setting "AUTO" sizing modes to prevent 100px fixed height squishing!`;
}

function buildDesignSystemOutputRules(options = {}) {
  const includeColors = options.colors !== false;
  const includeTypography = options.typography !== false;
  const includeComponents = options.components !== false;

  return `## Master Design System Board Specification (MANDATORY)

Output MUST be a single 1100px wide master container frame named "Master Design System / ${options.project || 'Project'}".
Follow this 3-Pillar Layout Architecture verbatim:

### 1. Board Container Architecture
- Main Outer Frame: \`width: 1100px\`, \`layoutMode = "VERTICAL"\`, \`itemSpacing = 36\`, \`padding = 32\`, \`clipsContent = false\`.
- Theme Modes (Respect project local taste/colors):
  - Light Theme (default unless dark specified): Board fill = \`#F8FAFC\`, Section Card fill = \`#FFFFFF\`, Primary Text = \`#0F172A\`, Muted Text = \`#64748B\`, Border = \`1px #E2E8F0\`.
  - Dark Theme: Board fill = \`#121212\`, Section Card fill = \`#181818\`, Primary Text = \`#FFFFFF\`, Muted Text = \`#B3B3B3\`, Border = \`1px #333333\`.

### 2. Header Block
- Title: \`${options.project || 'Project'} — Core Design System Foundations\` (32px Bold, brand primary color fill).
- Subtitle: \`Foundational Specification: Color Token Scales, Strict Even Typography Scale, and Default Master Components (Button & FilterPill)\` (14px Regular, muted text).

${includeColors ? `### 3. 🎨 PILLAR 1: COLOR TOKEN SCALES
- Section Title: \`🎨 PILLAR 1: COLOR TOKEN SCALES\` (20px Bold).
- Horizontal Swatch Row (\`layoutMode = "HORIZONTAL"\`, \`itemSpacing = 14\`).
- Swatch Card (\`width: 115px\`, \`padding: 10px\`, \`background: SectionCardFill\`, \`cornerRadius: 8px\`, \`layoutMode = "VERTICAL"\`, \`itemSpacing = 8px\`):
  - Color Box: \`width: 95px\`, \`height: 48px\`, \`cornerRadius: 6px\`, fill = target hex color. (Add 1px border if color is white/light).
  - Label: 12px Bold (e.g. \`Primary Brand\`, \`Brand Hover\`, \`Canvas Dark\`, \`Surface Base\`, \`Surface Elev\`, \`Border Dark\`, \`Pure White\`).
  - Hex Tag: 10px Medium (e.g. \`#FF0000\`, \`#282828\`, \`#121212\`).` : ''}

${includeTypography ? `### 4. 🔤 PILLAR 2: STRICT EVEN TYPOGRAPHY SCALE
- Section Title: \`🔤 PILLAR 2: STRICT EVEN TYPOGRAPHY SCALE\` (20px Bold).
- Specimen Container Frame (\`width: 1036px\`, \`padding: 20px\`, \`background: SectionCardFill\`, \`cornerRadius: 8px\`, \`layoutMode = "VERTICAL"\`, \`itemSpacing = 12px\`):
  - 7 Horizontal Specimen Rows (\`layoutMode = "HORIZONTAL"\`, \`primaryAxisAlignItems = "SPACE_BETWEEN"\`, \`counterAxisAlignItems = "CENTER"\`):
    1. Left: \`Hero Title (32px Bold) — Millions of videos.\` (32px Bold) | Right: \`HERO (32px)\` badge tag (10px Bold, brand primary color fill)
    2. Left: \`Primary Heading (24px Bold) — Trending Now\` (24px Bold) | Right: \`HEADING (24px)\` badge tag (10px Bold, brand primary color fill)
    3. Left: \`Section Title (20px Bold) — Subscriptions\` (20px Bold) | Right: \`TITLE (20px)\` badge tag (10px Bold, brand primary color fill)
    4. Left: \`Sub-Header (16px Bold) — Recommended Channels\` (16px Bold) | Right: \`SUBHEAD (16px)\` badge tag (10px Bold, brand primary color fill)
    5. Left: \`Body Text (14px Regular) — 1.2M views · 2 hours ago\` (14px Regular) | Right: \`BODY (14px)\` badge tag (10px Bold, brand primary color fill)
    6. Left: \`Caption Label (12px Medium) — Search YouTube\` (12px Medium) | Right: \`CAPTION (12px)\` badge tag (10px Bold, brand primary color fill)
    7. Left: \`Micro Tag (10px Bold) — LIVE NOW\` (10px Bold) | Right: \`MICRO (10px)\` badge tag (10px Bold, brand primary color fill)` : ''}

${includeComponents ? `### 5. 🧩 PILLAR 3: DEFAULT MASTER COMPONENTS
- Section Title: \`🧩 PILLAR 3: DEFAULT MASTER COMPONENTS\` (20px Bold).
- Sub-Section 1: \`1. Button ComponentSet (Variant: Primary|Secondary|Outline x State: Default|Hover|Disabled)\`
- Sub-Section 2: \`2. Filter Pill ComponentSet (Active & Default States)\`
- Combine component variants using \`figma.combineAsVariants()\`, set Auto Layout with HUG sizing on each ComponentSetNode.` : ''}

### 6. Execution & Syntax Rules
- Output ONLY valid JavaScript code inside \`(async () => { ... })();\`. No markdown fences, no text before/after.
- ALWAYS set \`clipsContent = false\` on the main board and all sub-containers so NO components or swatches are ever clipped!`;
}

// ── Utilities ─────────────────────────────────────────────────────

function safeRead(filePath) {
  try {
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  } catch {
    return '';
  }
}

module.exports = {
  buildScreenPrompt,
  buildDesignSystemPrompt,
};
