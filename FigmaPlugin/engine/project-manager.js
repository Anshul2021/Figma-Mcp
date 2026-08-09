/**
 * Morph — Project Manager
 *
 * Handles all project CRUD operations:
 *  - Scaffold new project workspaces (screens/, components/, tokens/, local/)
 *  - Read/write project configuration files (local/*.md) by blending global templates
 *    with user-provided project configurations.
 *  - Cleanly extract user input fields for UI forms while keeping full baseline markdown intact.
 *  - List all projects with metadata
 *
 * Storage is abstracted through cloud-store so the same code runs locally
 * (filesystem) and on Vercel serverless (Vercel Blob).
 */

const fs = require('fs');
const path = require('path');

const store = require('./cloud-store');

const ROOT_DIR = path.join(__dirname, '..');

// Directories that are NOT user projects
const SYSTEM_DIRS = ['plugin', 'core', 'global', 'node_modules', '.git', 'engine', 'local', 'screens', 'components', 'tokens', 'public', 'static', '_users'];

/**
 * Validate that a project name is a safe alphanumeric string and not a reserved system directory.
 */
function isValidProjectName(projectName) {
  if (!projectName || typeof projectName !== 'string') return false;
  const clean = projectName.trim();
  if (!/^[a-zA-Z0-9_-]+$/.test(clean)) return false;
  if (SYSTEM_DIRS.includes(clean.toLowerCase())) return false;
  return true;
}

/**
 * Scaffold a new project with standard directory structure and rich local config files.
 * @param {string} projectName — Project name (used as directory name)
 * @param {object} config — { brief, colors, fonts, taste }
 * @returns {{ success: boolean, message: string }}
 */
async function createProject(projectName, config = {}) {
  if (!isValidProjectName(projectName)) {
    return { success: false, message: `Invalid or reserved project name: "${projectName}". Use alphanumeric characters only.` };
  }

  const projectDir = path.join(ROOT_DIR, projectName);
  const exists = store.isCloud()
    ? await store.exists(`${projectName}/local/brief.md`)
    : fs.existsSync(projectDir);

  if (exists) {
    return { success: false, message: `Project "${projectName}" already exists.` };
  }

  if (!store.isCloud()) {
    const subDirs = ['screens', 'components', 'tokens', 'local'];
    fs.mkdirSync(projectDir, { recursive: true });
    for (const sub of subDirs) {
      fs.mkdirSync(path.join(projectDir, sub), { recursive: true });
    }
  }

  await writeBrief(projectName, config.brief || '');
  await writeColors(projectName, config.colors || []);
  await writeFonts(projectName, config.fonts || '');
  await writeTaste(projectName, config.taste || '');

  return { success: true, message: `Project "${projectName}" created successfully.` };
}

/**
 * Read a project's configuration from local/*.md files.
 * Returns clean plain user fields for UI inputs while providing raw markdown.
 * @param {string} projectName
 * @returns {Promise<object|null>} — { brief, colors, fonts, taste, raw }
 */
async function getProjectConfig(projectName) {
  const briefPath = `${projectName}/local/brief.md`;
  if (!(await store.exists(briefPath))) {
    return null;
  }

  const [rawBrief, rawColors, rawFonts, rawTaste] = await Promise.all([
    store.readText(`${projectName}/local/brief.md`),
    store.readText(`${projectName}/local/colors.md`),
    store.readText(`${projectName}/local/fonts.md`),
    store.readText(`${projectName}/local/taste.md`),
  ]);

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
async function updateProjectConfig(projectName, config) {
  if (!(await store.exists(`${projectName}/local/brief.md`))) {
    return { success: false, message: `Project "${projectName}" not found.` };
  }

  if (config.brief !== undefined) await writeBrief(projectName, config.brief);
  if (config.colors !== undefined) await writeColors(projectName, config.colors);
  if (config.fonts !== undefined) await writeFonts(projectName, config.fonts);
  if (config.taste !== undefined) await writeTaste(projectName, config.taste);

  return { success: true, message: 'Project configuration updated.' };
}

/**
 * List all user projects with metadata (screen count, component count, etc.)
 * Built from a SINGLE storage scan so it stays fast on Blob/serverless
 * (previously ~9 sequential list calls made /api/projects take ~10s).
 * @returns {Promise<Array<object>>}
 */
async function listProjects() {
  const scan = await store.scanTree('');
  const byProject = new Map();
  for (const rel of scan) {
    const parts = rel.split('/').filter(Boolean);
    if (parts.length < 3) continue;
    const proj = parts[0];
    const sub = parts[1];
    if (SYSTEM_DIRS.includes(proj.toLowerCase())) continue;
    if (!byProject.has(proj)) {
      byProject.set(proj, { screens: [], components: [], tokens: [], hasLocalConfig: false });
    }
    const entry = byProject.get(proj);
    const fileName = parts[parts.length - 1];
    if (sub === 'screens' && fileName.endsWith('.js')) entry.screens.push(fileName);
    else if (sub === 'components' && fileName.endsWith('.js')) entry.components.push(fileName);
    else if (sub === 'tokens' && fileName.endsWith('.js')) entry.tokens.push(fileName);
    else if (sub === 'local' && fileName.endsWith('.md')) entry.hasLocalConfig = true;
  }
  const projects = [];
  for (const [name, entry] of byProject) {
    const screenCount = entry.screens.length;
    const componentCount = entry.components.length;
    const tokenCount = entry.tokens.length;
    projects.push({
      name,
      screenCount,
      componentCount,
      tokenCount,
      screens: entry.screens,
      components: entry.components,
      tokens: entry.tokens,
      hasLocalConfig: entry.hasLocalConfig,
    });
  }
  return projects.filter(p => p.screenCount > 0 || p.componentCount > 0 || p.tokenCount > 0 || p.hasLocalConfig);
}

/**
 * Delete a project (all directories and stored cloud blobs).
 * @param {string} projectName
 */
async function deleteProject(projectName) {
  if (!isValidProjectName(projectName)) {
    return { success: false, message: `Access denied: Cannot delete system or invalid path "${projectName}".` };
  }

  if (store.isCloud()) {
    const deleted = await store.deletePrefix(`${projectName}/`);
    return { success: true, message: `Project "${projectName}" deleted (${deleted} files).` };
  }

  const projectDir = path.join(ROOT_DIR, projectName);
  if (!fs.existsSync(projectDir)) {
    return { success: false, message: `Project "${projectName}" does not exist.` };
  }
  try {
    fs.rmSync(projectDir, { recursive: true, force: true });
    return { success: true, message: `Project "${projectName}" deleted successfully.` };
  } catch (e) {
    return { success: false, message: `Failed to delete project: ${e.message}` };
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

function loadGlobalTemplate(filename) {
  const globalPath = path.join(ROOT_DIR, 'global', filename);
  try {
    return fs.existsSync(globalPath) ? fs.readFileSync(globalPath, 'utf8') : '';
  } catch {
    return '';
  }
}

function configRelPaths(projectName) {
  return {
    brief: `${projectName}/local/brief.md`,
    colors: `${projectName}/local/colors.md`,
    fonts: `${projectName}/local/fonts.md`,
    taste: `${projectName}/local/taste.md`,
  };
}

async function writeBrief(projectName, briefText) {
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

  const rel = configRelPaths(projectName).brief;
  if (store.isCloud()) await store.writeText(rel, content, 'text/markdown');
  else {
    const fp = path.join(ROOT_DIR, rel);
    fs.mkdirSync(path.dirname(fp), { recursive: true });
    fs.writeFileSync(fp, content, 'utf8');
  }
}

async function writeColors(projectName, colors) {
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

  const rel = configRelPaths(projectName).colors;
  if (store.isCloud()) await store.writeText(rel, content, 'text/markdown');
  else {
    const fp = path.join(ROOT_DIR, rel);
    fs.mkdirSync(path.dirname(fp), { recursive: true });
    fs.writeFileSync(fp, content, 'utf8');
  }
}

async function writeFonts(projectName, fonts) {
  let template = loadGlobalTemplate('fonts.md');
  const fontFamily = (typeof fonts === 'string' && fonts.trim()) ? fonts.trim() : 'DM Sans';

  if (!template) {
    template = `# Typography System — ${projectName}\n\n> Typography definitions and scale for generated Figma screens.\n\n---\n\n## 🔤 Primary Font Family\n\n- **Font Family:** \`${fontFamily}\`\n\n## 📐 Strict Even-Number Typography Scale\n\n| Token | Size | Weight |\n|:------|:-----|:-------|\n| \`micro\` | **10px** | Medium |\n| \`caption\` | **12px** | Regular |\n| \`body\` | **14px** | Regular |\n| \`subhead\` | **16px** | Medium |\n| \`title\` | **20px** | Bold |\n| \`heading\` | **24px** | Bold |\n| \`hero\` | **32px** | Bold |\n`;
  }

  let content = template
    .replace(/# Typography System.*/i, `# Typography System — ${projectName}`)
    .replace(/- \*\*Font Family:\*\* `[^`]+`/i, `- **Font Family:** \`${fontFamily}\``)
    .replace(/family: "[^"]+"/g, `family: "${fontFamily}"`);

  const rel = configRelPaths(projectName).fonts;
  if (store.isCloud()) await store.writeText(rel, content, 'text/markdown');
  else {
    const fp = path.join(ROOT_DIR, rel);
    fs.mkdirSync(path.dirname(fp), { recursive: true });
    fs.writeFileSync(fp, content, 'utf8');
  }
}

async function writeTaste(projectName, taste) {
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

  const rel = configRelPaths(projectName).taste;
  if (store.isCloud()) await store.writeText(rel, content, 'text/markdown');
  else {
    const fp = path.join(ROOT_DIR, rel);
    fs.mkdirSync(path.dirname(fp), { recursive: true });
    fs.writeFileSync(fp, content, 'utf8');
  }
}

module.exports = {
  createProject,
  getProjectConfig,
  updateProjectConfig,
  listProjects,
  deleteProject,
};