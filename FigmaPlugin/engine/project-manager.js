/**
 * FrameForge — Project Manager
 * 
 * Handles all project CRUD operations:
 *  - Scaffold new project directories (screens/, components/, tokens/, local/)
 *  - Read/write project configuration files (local/*.md) by blending global templates
 *    with user-provided project configurations.
 *  - Cleanly extract user input fields for UI forms while keeping full baseline markdown intact.
 *  - List all projects with metadata
 * 
 * This module is file-system-only — no network calls.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

// Directories that are NOT user projects
const SYSTEM_DIRS = ['plugin', 'core', 'global', 'node_modules', '.git', 'engine'];

/**
 * Scaffold a new project with standard directory structure and rich local config files.
 * @param {string} projectName — Project name (used as directory name)
 * @param {object} config — { brief, colors, fonts, taste }
 * @returns {{ success: boolean, message: string }}
 */
function createProject(projectName, config = {}) {
  const projectDir = path.join(ROOT_DIR, projectName);

  if (fs.existsSync(projectDir)) {
    return { success: false, message: `Project "${projectName}" already exists.` };
  }

  // Create directory scaffold
  const subDirs = ['screens', 'components', 'tokens', 'local'];
  fs.mkdirSync(projectDir, { recursive: true });
  for (const sub of subDirs) {
    fs.mkdirSync(path.join(projectDir, sub), { recursive: true });
  }

  const localDir = path.join(projectDir, 'local');

  writeBrief(localDir, projectName, config.brief || '');
  writeColors(localDir, projectName, config.colors || []);
  writeFonts(localDir, projectName, config.fonts || '');
  writeTaste(localDir, projectName, config.taste || '');

  return { success: true, message: `Project "${projectName}" created successfully.` };
}

/**
 * Read a project's configuration from local/*.md files.
 * Returns clean plain user fields for UI inputs while providing raw markdown.
 * @param {string} projectName
 * @returns {object} — { brief, colors, fonts, taste, raw }
 */
function getProjectConfig(projectName) {
  const localDir = path.join(ROOT_DIR, projectName, 'local');
  if (!fs.existsSync(localDir)) {
    return null;
  }

  const rawBrief = readFileContent(path.join(localDir, 'brief.md'));
  const rawColors = readFileContent(path.join(localDir, 'colors.md'));
  const rawFonts = readFileContent(path.join(localDir, 'fonts.md'));
  const rawTaste = readFileContent(path.join(localDir, 'taste.md'));

  return {
    brief: extractUserBrief(rawBrief),
    colors: extractUserColors(rawColors),
    fonts: extractUserFont(rawFonts),
    taste: extractUserTaste(rawTaste),
    raw: {
      brief: rawBrief,
      colors: rawColors,
      fonts: rawFonts,
      taste: rawTaste,
    }
  };
}

/**
 * Update specific project configuration fields while preserving global template structure.
 * @param {string} projectName
 * @param {object} config — partial { brief?, colors?, fonts?, taste? }
 */
function updateProjectConfig(projectName, config) {
  const localDir = path.join(ROOT_DIR, projectName, 'local');
  if (!fs.existsSync(localDir)) {
    return { success: false, message: `Project "${projectName}" not found.` };
  }

  if (config.brief !== undefined) writeBrief(localDir, projectName, config.brief);
  if (config.colors !== undefined) writeColors(localDir, projectName, config.colors);
  if (config.fonts !== undefined) writeFonts(localDir, projectName, config.fonts);
  if (config.taste !== undefined) writeTaste(localDir, projectName, config.taste);

  return { success: true, message: 'Project configuration updated.' };
}

/**
 * List all user projects with metadata (screen count, component count, etc.)
 * @returns {Array<object>}
 */
function listProjects() {
  try {
    const entries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
    return entries
      .filter(e => e.isDirectory() && !SYSTEM_DIRS.includes(e.name) && !e.name.startsWith('.'))
      .map(e => {
        const projectDir = path.join(ROOT_DIR, e.name);
        const screensDir = path.join(projectDir, 'screens');
        const componentsDir = path.join(projectDir, 'components');
        const tokensDir = path.join(projectDir, 'tokens');

        const screens = safeListJs(screensDir);
        const components = safeListJs(componentsDir);
        const tokens = safeListJs(tokensDir);
        const hasLocal = fs.existsSync(path.join(projectDir, 'local'));

        return {
          name: e.name,
          screenCount: screens.length,
          componentCount: components.length,
          tokenCount: tokens.length,
          screens,
          components,
          tokens,
          hasLocalConfig: hasLocal,
        };
      })
      .filter(p => p.screenCount > 0 || p.componentCount > 0 || p.tokenCount > 0 || p.hasLocalConfig);
  } catch (err) {
    console.warn('[ProjectManager] listProjects error:', err.message);
    return [];
  }
}

// ── Extractors for UI Form Input Cleanliness ──────────────────────

function extractUserBrief(rawMd) {
  if (!rawMd) return '';
  const match = rawMd.match(/- \*\*Brief \/ Description:\*\*\s*(.+)/i);
  if (match && match[1]) {
    const val = match[1].trim();
    if (val && !val.startsWith('Standard mobile')) return val;
  }
  const sec1 = rawMd.indexOf('## 1.');
  const sec2 = rawMd.indexOf('## 2.');
  if (sec1 !== -1 && sec2 !== -1) {
    let chunk = rawMd.substring(sec1, sec2);
    chunk = chunk.replace(/^#+ .*/gm, '').replace(/## 1\..*/g, '').replace(/- \*\*Project Name:\*\*.*/g, '').replace(/- \*\*Brief \/ Description:\*\*/g, '').trim();
    if (chunk) return chunk;
  }
  return rawMd.replace(/^#+ .*/gm, '').replace(/^> .*/gm, '').replace(/^---/gm, '').trim();
}

function extractUserColors(rawMd) {
  if (!rawMd) return [];
  const matches = rawMd.match(/#[0-9A-Fa-f]{6}/g);
  return matches ? Array.from(new Set(matches)).slice(0, 4) : [];
}

function extractUserFont(rawMd) {
  if (!rawMd) return 'DM Sans';
  const match = rawMd.match(/- \*\*Font Family:\*\* `?([^`\n]+)`?/i);
  return match ? match[1].trim() : 'DM Sans';
}

function extractUserTaste(rawMd) {
  if (!rawMd) return '';
  const secIdentity = rawMd.indexOf('## 🎨 Project Visual Identity');
  const secPhilosophy = rawMd.indexOf('## 🎨 Design Philosophy');
  if (secIdentity !== -1 && secPhilosophy !== -1) {
    const chunk = rawMd.substring(secIdentity + '## 🎨 Project Visual Identity'.length, secPhilosophy).trim();
    if (chunk) return chunk;
  }
  return rawMd.replace(/^#+ .*/gm, '').replace(/^> .*/gm, '').replace(/^---/gm, '').trim();
}

// ── Internal Helpers ──────────────────────────────────────────────

function readFileContent(filePath) {
  try {
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  } catch {
    return '';
  }
}

function safeListJs(dir) {
  try {
    return fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.js')) : [];
  } catch {
    return [];
  }
}

function loadGlobalTemplate(filename) {
  const globalPath = path.join(ROOT_DIR, 'global', filename);
  try {
    return fs.existsSync(globalPath) ? fs.readFileSync(globalPath, 'utf8') : '';
  } catch {
    return '';
  }
}

function writeBrief(localDir, projectName, briefText) {
  let template = loadGlobalTemplate('brief.md');
  let userBriefSection = briefText ? briefText.trim() : 'Standard mobile application';
  
  userBriefSection = userBriefSection
    .replace(/^# Project Brief — .*/gm, '')
    .replace(/^# Brief — .*/gm, '')
    .replace(/^> App Purpose .*/gm, '')
    .replace(/^---/gm, '')
    .replace(/^## 1\. Project Overview .*/gm, '')
    .replace(/- \*\*Project Name:\*\*.*/g, '')
    .replace(/- \*\*Brief \/ Description:\*\*/g, '')
    .trim();

  if (!template) {
    template = `# Project Brief — ${projectName}\n\n> App Purpose & Specific Requirements for ${projectName}.\n\n---\n\n## 1. Project Overview & Specific Requirements\n\n- **Project Name:** ${projectName}\n- **Brief / Description:** ${userBriefSection || 'Standard mobile application'}\n\n---\n\n## 2. Platform & Target Specs\n\n- **Primary Platform:** Mobile (iOS App)\n- **Screen Dimensions:** \`375px × 812px\` (standard iPhone mobile screen frame)\n- **Safe Area Insets:** Top \`0px\` (Clean top header flush with screen edge), Bottom \`20px\` (home indicator bar)\n- **Orientation:** Portrait (fixed)\n\n---\n\n## 3. Screen Layout Architecture\n\nEvery mobile screen follows the **3-Part Stack**:\n\n\`\`\`\n┌─────────────────────────────────────────┐\n│  TOP HEADER BAR                         │  Height: HUG content (top padding: 12px-16px)\n│  (Navigation, location, screen title)   │  Width: FIXED 375px\n├─────────────────────────────────────────┤\n│                                         │\n│  MIDDLE SCROLL CONTENT                  │  Height: FIXED (remaining viewport)\n│  (Cards, feeds, menus, forms)           │  Width: FIXED 375px\n│                                         │  clipsContent: true\n├─────────────────────────────────────────┤\n│  BOTTOM NAVIGATION / FOOTER CTA         │  Height: HUG content\n│  (Tab bar or primary action button)     │  Width: FIXED 375px\n└─────────────────────────────────────────┘\n\`\`\`\n\n---\n\n## 4. Default Layout & Design Parameters\n\n| Property | Default Value | Notes |\n|:---------|:--------------|:------|\n| Device Width | \`375px\` | Standard mobile width |\n| Device Height | \`812px\` | Standard mobile height |\n| Header Height | \`~48px - 56px\` | Standard mobile header (flush top padding 12px-16px) |\n| Footer Height | \`~64px - 84px\` | Plus bottom safe padding |\n| Horizontal Screen Margin | \`16px - 20px\` | Side padding for cards |\n| Card Spacing (Vertical) | \`12px - 16px\` | Gap between list items |\n`;
  }

  let content = template
    .replace(/# Project Brief — .*/i, `# Project Brief — ${projectName}`)
    .replace(/- \*\*Project Name:\*\*.*/i, `- **Project Name:** ${projectName}`)
    .replace(/- \*\*Brief \/ Description:\*\*.*/i, `- **Brief / Description:** ${userBriefSection || 'Standard mobile application'}`);

  if (!content.includes(`- **Project Name:** ${projectName}`)) {
    content = `# Project Brief — ${projectName}\n\n> App Purpose & Specific Requirements for ${projectName}.\n\n---\n\n## 1. Project Overview & Specific Requirements\n\n- **Project Name:** ${projectName}\n- **Brief / Description:** ${userBriefSection || 'Standard mobile application'}\n\n` + template.substring(template.indexOf('## 2. Platform'));
  }

  fs.writeFileSync(path.join(localDir, 'brief.md'), content, 'utf8');
}

function writeColors(localDir, projectName, colors) {
  let template = loadGlobalTemplate('colors.md');

  let hexList = [];
  if (Array.isArray(colors)) {
    hexList = colors.map(c => {
      if (typeof c === 'string' && !c.includes('[object')) return c.trim();
      if (c && typeof c === 'object') return (c.hex || c.color || c.primary || '#FF0000');
      return String(c);
    }).filter(h => h && typeof h === 'string' && !h.includes('[object'));
  } else if (typeof colors === 'string' && colors.trim() && !colors.includes('[object')) {
    const hexes = colors.match(/#[0-9A-Fa-f]{6}/g);
    if (hexes && hexes.length > 0) {
      hexList = hexes;
    } else {
      hexList = colors.split(',').map(s => s.trim()).filter(s => s && !s.includes('[object'));
    }
  }

  const labels = ['Primary', 'Secondary', 'Accent', 'Surface/Neutral', 'Highlight'];
  let customColorText = '';
  if (hexList.length > 0) {
    customColorText = hexList.map((hex, i) => {
      const label = i === 0 ? 'Primary' : (labels[Math.min(i, labels.length - 1)]);
      const formattedHex = hex.startsWith('#') ? hex : `#${hex}`;
      return `- **${label}**: \`${formattedHex}\``;
    }).join('\n');
  } else {
    customColorText = '- **Primary**: `#FF0000` (Brand Primary)\n- **Secondary**: `#282828` (Brand Secondary)';
  }

  if (!template) {
    template = `# Color System — ${projectName}\n\n> Brand & UI Color Tokens specifically customized for ${projectName}.\n\n---\n\n## 🎨 Brand Colors (Project Specific)\n\n${customColorText}\n\n---\n\n## ⚪ Neutral Colors\n\n- **\`neutral-900\`** | \`#1A1A1B\` | \`{ r: 0.102, g: 0.102, b: 0.106 }\` — Main headings & post titles\n- **\`neutral-700\`** | \`#374151\` | \`{ r: 0.216, g: 0.255, b: 0.318 }\` — Secondary body text & comments\n- **\`neutral-500\`** | \`#787C7E\` | \`{ r: 0.471, g: 0.486, b: 0.494 }\` — Muted text, timestamps, comment counts\n- **\`neutral-300\`** | \`#EDEFF1\` | \`{ r: 0.929, g: 0.937, b: 0.945 }\` — Borders, dividers\n- **\`neutral-100\`** | \`#F6F7F8\` | \`{ r: 0.965, g: 0.969, b: 0.973 }\` — Card fills, search bar background\n- **\`white\`**       | \`#FFFFFF\` | \`{ r: 1.000, g: 1.000, b: 1.000 }\` — Card backgrounds & button text\n\n---\n\n## 🚦 Semantic Status Colors\n\n- **\`success\`** | \`#46D160\` | \`{ r: 0.275, g: 0.820, b: 0.376 }\` — Online active status, success alerts\n- **\`warning\`** | \`#FFB000\` | \`{ r: 1.000, g: 0.690, b: 0.000 }\` — Mod warnings, pinned posts\n- **\`error\`**   | \`#EA0027\` | \`{ r: 0.918, g: 0.000, b: 0.153 }\` — Deleted / removed posts\n`;
  }

  let content = template.replace(/# Color System.*/i, `# Color System — ${projectName}`);
  const brandSecIndex = content.indexOf('## 🎨 Brand Colors');
  const neutralSecIndex = content.indexOf('## ⚪ Neutral Colors');

  if (brandSecIndex !== -1 && neutralSecIndex !== -1) {
    content = content.substring(0, brandSecIndex) +
      `## 🎨 Brand Colors (Project Specific)\n\n${customColorText}\n\n` +
      content.substring(neutralSecIndex);
  }

  fs.writeFileSync(path.join(localDir, 'colors.md'), content, 'utf8');
}

function writeFonts(localDir, projectName, fonts) {
  let template = loadGlobalTemplate('fonts.md');
  const fontFamily = (typeof fonts === 'string' && fonts.trim()) ? fonts.trim() : 'DM Sans';

  if (!template) {
    template = `# Typography System — ${projectName}\n\n> Typography definitions and scale for generated Figma screens.\n\n---\n\n## 🔤 Primary Font Family\n\n- **Font Family:** \`${fontFamily}\`\n\n## 📐 Strict Even-Number Typography Scale\n\n| Token | Size | Weight |\n|:------|:-----|:-------|\n| \`micro\` | **10px** | Medium |\n| \`caption\` | **12px** | Regular |\n| \`body\` | **14px** | Regular |\n| \`subhead\` | **16px** | Medium |\n| \`title\` | **20px** | Bold |\n| \`heading\` | **24px** | Bold |\n| \`hero\` | **32px** | Bold |\n`;
  }

  let content = template
    .replace(/# Typography System.*/i, `# Typography System — ${projectName}`)
    .replace(/- \*\*Font Family:\*\* `[^`]+`/i, `- **Font Family:** \`${fontFamily}\``)
    .replace(/family: "[^"]+"/g, `family: "${fontFamily}"`);

  fs.writeFileSync(path.join(localDir, 'fonts.md'), content, 'utf8');
}

function writeTaste(localDir, projectName, taste) {
  let template = loadGlobalTemplate('taste.md');
  let userTaste = taste ? taste.trim() : 'Clean, modern, aesthetic UI with rounded corners, subtle borders, and smooth depth.';

  userTaste = userTaste
    .replace(/^# Visual Taste .*/gm, '')
    .replace(/^> Project-specific .*/gm, '')
    .replace(/^---/gm, '')
    .replace(/^## 🎨 Project Visual Identity/gm, '')
    .trim();

  if (!template) {
    template = `# Visual Taste & Design Preferences — ${projectName}\n\n> Project-specific visual style layered on top of global anti-slop directives.\n\n---\n\n## 🎨 Project Visual Identity\n\n${userTaste}\n\n---\n\n## 🎨 Design Philosophy & Anti-Slop Directive\n\n- **Style:** Modern community forum & media platform, clean high-contrast readability, structured cards.\n- **Density:** Comfortable Community (micro-padding \`12px - 16px\`).\n`;
  }

  let content = template.replace(/# Visual Taste.*/i, `# Visual Taste & Design Preferences — ${projectName}`);
  const identityIndex = content.indexOf('## 🎨 Project Visual Identity');
  const philosophyIndex = content.indexOf('## 🎨 Design Philosophy');

  if (identityIndex !== -1 && philosophyIndex !== -1) {
    content = content.substring(0, identityIndex) +
      `## 🎨 Project Visual Identity\n\n${userTaste || 'Clean modern UI'}\n\n` +
      content.substring(philosophyIndex);
  }

  fs.writeFileSync(path.join(localDir, 'taste.md'), content, 'utf8');
}

module.exports = {
  createProject,
  getProjectConfig,
  updateProjectConfig,
  listProjects,
};
