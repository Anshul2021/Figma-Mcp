# AGENTS.md — Figma AI Screen Generator System Directives

> **CRITICAL DIRECTIVE FOR ALL AI AGENTS & SESSION INSTANCES:**
> This repository is a self-contained AI-powered Figma screen generation platform.
> Every AI agent operating in this repository MUST read and follow these directives automatically without requiring prior chat context or asking unnecessary clarifying questions.

---

## 1. System Overview & Architecture

The system generates production-quality Figma UI scripts from natural language prompts, writes them to project directories, and streams them live to a Figma plugin via a Node.js bridge server.

```
Figma-Mcp/
├── AGENTS.md                             📄 Master AI Directive & Orchestrator Document (This File)
├── README.md                             📄 User Quickstart & Setup Guide
├── architecture.md                       📄 Repository Directory Structure Document
├── example.md                            📄 Prompting Examples & Code Snippets
│
├── .agents/skills/                       📁 Workspace AI Skill Registry (Orchestrator Skills)
│   ├── frontend-design/                  📄 Anti-Slop Visual Direction & Tone Skill
│   ├── design-taste-frontend/            📄 Editorial Craft, Micro-Paddings & Subtle Borders Skill
│   ├── ui-design-system/                 📄 Component States, Tokens & Accessibility Skill
│   └── figma-screen-generator/           📄 Auto Layout Execution & Plugin Bridge Skill
│
└── FigmaPlugin/                          📁 Primary Plugin Workspace
    ├── plugin/                           📁 Figma Plugin Client (manifest.json, code.js, ui.html)
    ├── server.js                         📜 Local Bridge Server (Port 3003, SSE Watcher)
    │
    ├── core/                             📁 Immutable Engine Protocols (DO NOT MODIFY)
    │   ├── command.md                    📄 Command syntax & priority resolution
    │   ├── instruction.md                📄 Core generation rules & icon protocols
    │   ├── autolayout.md                 📄 Auto Layout execution protocol & anti-patterns
    │   ├── component.md                  📄 Master component creation & instance reuse protocol
    │   └── variables.md                  📄 Native Figma Variables & Local Styles publishing protocol
    │
    ├── global/                            📁 Default Global Context Templates
    │   ├── fonts.md                      📄 Font scale (DM Sans / Instrument Sans)
    │   ├── colors.md                     📄 Color tokens
    │   ├── taste.md                      📄 Visual styling & radii
    │   └── brief.md                      📄 App brief template
    │
    └── <Project_Name>/                    📁 Dynamic User Project Directories
        ├── screens/                      📁 Screen Scripts (<screen_name>.js)
        ├── components/                   📁 Master Reusable Components Library (<ComponentName>.js)
        ├── tokens/                       📁 Figma Local Variables Generator (variables.js, styles.js)
        └── local/                        📁 Project Local Overrides (fonts, colors, taste, brief)
```

---

## 2. Master Skill Orchestrator Decision Matrix

When handling any user prompt, the AI Agent acts as an **Orchestrator** and automatically triggers skills according to this matrix:

| Trigger Condition / Command | Primary Skill Active | Purpose & Execution Strategy |
| :--- | :--- | :--- |
| **New Screen or UI Prompt (DEFAULT)** | `frontend-design` + `design-taste-frontend` | **MANDATORY BY DEFAULT**: Applies visual identity, Slate text scale (`#0F172A`), micro-padding (`16-24px`), 1px subtle borders (`#E5E7EB`), and anti-slop rules. |
| **`@designsystem`** | `ui-design-system` | **Full Design System Pipeline**: Reads `.agents/skills/ui-design-system/SKILL.md`, publishes color/typography variables to `tokens/variables.js`, inspects project `screens/*.js` to extract candidate components, builds master `ComponentSetNode` variants in `components/DesignSystem.js`, and rewrites screens to use `createInstance()`. |
| **`@gen-variables`, `@gen-components`, `@use-components`** | `ui-design-system` | Defines component variant architecture, button/card state standards (default, hover, active, disabled), token scales, and component reuse. |
| **Script Writing (`screens/*.js`, `components/*.js`, `tokens/*.js`)** | `figma-screen-generator` | Enforces Auto Layout execution order, strict even font scale (`10, 12, 14, 16, 20, 24, 32`), Lucide vector icons, and SSE bridge server auto-sync. |

---

## 2. Command Protocol & Auto-Scaffolding Workflow

User prompts may contain `@` commands (case-insensitive). Execute commands instantly without asking superfluous clarifying questions:

### 1. `@newproject <ProjectName>` (Project Creation)
- **Action:** Immediately scaffold the directory structure for `<ProjectName>` under `FigmaPlugin/<ProjectName>/`:
  - Create `FigmaPlugin/<ProjectName>/screens/`
  - Create `FigmaPlugin/<ProjectName>/components/`
  - Create `FigmaPlugin/<ProjectName>/tokens/`
  - Create `FigmaPlugin/<ProjectName>/local/`
  - Copy default context templates from `FigmaPlugin/global/` (`taste.md`, `colors.md`, `fonts.md`, `brief.md`) into `FigmaPlugin/<ProjectName>/local/`.
- **Response Rule:** Inform the user cleanly that `<ProjectName>` is scaffolded and ready for prompts. **DO NOT ask clarifying questions.**

### 1.5. `@brief <Product Description>` (Product Purpose & Domain Context)
- **Action:** Populates/updates `FigmaPlugin/<ProjectName>/local/brief.md` with the product brief (what the app is, who it is for, problem it solves, and overall application domain context).
- **Execution Strategy:** All subsequent screen generations, component sets, and design decisions automatically consume `local/brief.md` so UI outputs stay aligned with the product's purpose.
- **Combining with `@newproject`:** Users can combine `@newproject <Name>` and `@brief <Description>` in a single prompt!

### 2. `@gen-variables`
- **Action:** Generates/publishes native Figma Variables (`tokens/variables.js`) and Text Styles (`tokens/styles.js`) directly to Figma's native panel using `figma.variables` API. Reads color palette from project `local/colors.md` and font scale from `local/fonts.md`.

### 3. `@gen-components`
- **Action:** Generates master reusable components (`components/<ComponentName>.js`) inside `FigmaPlugin/<Project_Name>/components/` using `figma.createComponent()`.

### 4. `@use-components`
- **Action:** Instructs screen scripts to inspect `components/` and instantiate existing master components via `componentNode.createInstance()` instead of creating raw inline frames.

### 5. `@designsystem` (End-to-End Design System Pipeline)
- **Action:** Runs the complete 4-step Design System generation workflow:
  1. **Skill Reference**: Automatically reads `.agents/skills/ui-design-system/SKILL.md` for token scales and variant guidelines.
  2. **Token Publishing**: Generates `tokens/variables.js` (native color variables and text styles referencing `local/colors.md` and `local/fonts.md`).
  3. **Project Analysis**: Scans all `.js` files in `FigmaPlugin/<Project_Name>/screens/` to identify repeated UI components (Buttons, Avatars, Cards, Search Bars, Nav Items).
  4. **Master Component Sets**: Builds master `ComponentSetNode` variants in `components/DesignSystem.js`.
  5. **Screen Instance Update**: Rewrites project screens to instantiate components via `componentNode.createInstance()`.

### 6. `@skip-autolayout`
- **Action:** Generate static layout using absolute `x`, `y` coordinates and fixed `resize(width, height)`. Do NOT set `layoutMode` or Auto Layout sizing properties.

### 7. `@font <FontName1>[, <FontName2>]`
- **Action:** Override typography font family for the generation session.

### 8. `@color <PrimaryHex>, <SecondaryHex>`
- **Action:** Override primary and secondary brand colors.

### 9. `@taste <style description>`
- **Action:** Override visual styling (e.g. glassmorphism, dark mode, soft shadows).

---

## 3. Screen Generation & Execution Pipeline Protocol

When generating or updating any screen script for a project:

1. **Target File Path:** Always save generated JavaScript screen files to:
   `FigmaPlugin/<Project_Name>/screens/<screen_name>.js`
2. **Auto-Sync Mechanism:**
   - `FigmaPlugin/server.js` automatically watches `<Project_Name>/screens/` for file writes.
   - When a `.js` file is written via `write_to_file`, `server.js` emits an SSE event over `/api/watch` to `plugin/ui.html`.
   - `plugin/ui.html` automatically fetches and executes the script live on the Figma canvas.
3. **CRITICAL EXECUTION RULE (STRICT ZERO TERMINAL COMMANDS):**
   - **NEVER** run terminal `curl`, `node -c`, or shell commands to verify scripts or trigger `/api/run` or `/api/projects`.
   - Writing the `.js` file to disk via `write_to_file` is 100% sufficient. `server.js` automatically detects file writes and streams them live to Figma.
   - Refraining from shell execution completely eliminates IDE permission popups for the user.

---

## 4. Mandatory UI Design System & Technical Rules

Every generated script (`<screen_name>.js`) MUST strictly adhere to the following rules:

### A. Font & Typography Scale Rule
- **Default Font:** DM Sans (must load `Regular`, `Medium`, `Bold` styles via `await figma.loadFontAsync()`).
- **STRICT EVEN FONT SCALE:** Font sizes MUST ONLY be even numbers: `10`, `12`, `14`, `16`, `20`, `24`, `32`.
- **NO ODD FONT SIZES:** Never use `11`, `13`, `15`, `17` or decimal font sizes.

### B. Strict Zero Emoji & Vector Iconography Rule
- **NEVER** use emojis anywhere in generated scripts or UI frames. This includes text labels, pins (📍), dollar signs (💵), charts (📈), clocks (🕒), checkmarks (✓), or arrows (→).
- **Use Real Vector SVG Icons**: Use vector SVG icons via `loadLucideIcon(iconName, size, color, strokeWidth = 1.5)` (`https://unpkg.com/lucide-static@latest/icons/${iconName}.svg`).
- **Icon Stroke Weight:** Lightweight `1.5px` stroke width (`stroke-width="1.5"`).
- **Safe Res.ok Validation:** `loadLucideIcon()` MUST validate `res.ok` and `svgText.includes("<svg")` before calling `figma.createNodeFromSvg()`. If fetch fails or icon name is invalid, return `createFallbackIcon()`.

### C. Auto Layout Execution Protocol (MANDATORY ORDER & HUG HEIGHT RULE)
Every Auto Layout frame MUST be constructed following this exact order:

```
1. Create frame                       const frame = figma.createFrame();
2. Set layoutMode FIRST               frame.layoutMode = "VERTICAL" | "HORIZONTAL";
3. Set visual properties              frame.fills, frame.strokes, frame.cornerRadius
4. Set padding & itemSpacing          frame.paddingLeft/Right/Top/Bottom, frame.itemSpacing
5. Set alignment properties           frame.primaryAxisAlignItems, frame.counterAxisAlignItems
   ⚠️ counterAxisAlignItems MUST ONLY be "MIN" | "MAX" | "CENTER" | "BASELINE". NEVER "STRETCH"!
6. Append ALL children FIRST           parent.appendChild(child);
7. Set AUTO sizing modes AFTER append  
   - ⚠️ ALWAYS append children BEFORE setting "AUTO" sizing modes! Setting "AUTO" on an empty node leaves Figma's default 100px x 100px fixed size intact!
   - For HORIZONTAL rows (headers, pill rows, grid rows, tab bars):
     frame.primaryAxisSizingMode = "FIXED"; (width = 375 or FILL)
     frame.counterAxisSizingMode = "AUTO";  (HUG height - set AFTER append!)
   - For VERTICAL containers (header block, media shelf, form stack):
     frame.primaryAxisSizingMode = "AUTO";  (HUG height - set AFTER append!)
     frame.counterAxisSizingMode = "FIXED"; (width = 375 or FILL)
   - For Buttons, Pills, Badges, Chips, Swatch Cards:
     frame.primaryAxisSizingMode = "AUTO";  (HUG width - set AFTER append!)
     frame.counterAxisSizingMode = "AUTO";  (HUG height - set AFTER append!)
     ⚠️ NEVER call resize() on Buttons, Badges, or Chips!
8. Set child sizing AFTER append      child.layoutSizingHorizontal = "FILL";
```

### D. Absolute Overlay Order Rule (Anti-Pattern #6)
- In Figma API, `layoutPositioning = "ABSOLUTE"` can **ONLY** be called on a child node **AFTER** it has been appended to an Auto Layout parent (`parentFrame.appendChild(child)`).
- **NEVER** call `layoutPositioning = "ABSOLUTE"` before `parentFrame.appendChild(child)`.

### E. Immediate Parent Appending Rule (Prevent Floating Frames)
- Whenever creating container frames (`scrollArea`, `gridRow`, `card`, `imgFrame`), append them to their parent frame **IMMEDIATELY** upon creation.
- This prevents orphan frames from floating at the root `figma.currentPage` level if an async call or layout calculation fails.

### F. MANDATORY AUTO LAYOUT HELPER FUNCTIONS IN EVERY SCRIPT (PREVENT 100px SQUEEZE BUG)
Every generated screen script (`screens/*.js`) MUST include these 5 helper functions verbatim and use them to construct ALL headers, cards, and row containers:
```javascript
function makeSpaceBetweenRow(name, fixedWidth) {
  const row = figma.createFrame();
  row.name = name; row.layoutMode = "HORIZONTAL"; row.fills = [];
  row.resize(fixedWidth, 1);
  row.primaryAxisSizingMode = "FIXED";
  row.counterAxisSizingMode = "AUTO";
  row.primaryAxisAlignItems = "SPACE_BETWEEN";
  row.counterAxisAlignItems = "CENTER";
  return row;
}

function makeHugContainer(name, direction = "HORIZONTAL", spacing = 8) {
  const frame = figma.createFrame();
  frame.name = name; frame.layoutMode = direction; frame.fills = [];
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.itemSpacing = spacing;
  frame.counterAxisAlignItems = "CENTER";
  return frame;
}

function makeContentCard(name, fixedWidth, options = {}) {
  const card = figma.createFrame();
  card.name = name; card.layoutMode = "VERTICAL";
  card.fills = options.fills || [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  if (options.cornerRadius) card.cornerRadius = options.cornerRadius;
  if (options.strokes) { card.strokes = options.strokes; card.strokeWeight = options.strokeWeight || 1; }
  card.itemSpacing = options.itemSpacing || 0;
  if (options.paddingLeft !== undefined) card.paddingLeft = options.paddingLeft;
  if (options.paddingRight !== undefined) card.paddingRight = options.paddingRight;
  if (options.paddingTop !== undefined) card.paddingTop = options.paddingTop;
  if (options.paddingBottom !== undefined) card.paddingBottom = options.paddingBottom;
  card.resize(fixedWidth, 1);
  card.counterAxisSizingMode = "FIXED";
  return card;
}

function finalizeHugHeight(frame) { frame.primaryAxisSizingMode = "AUTO"; }

function setChildFillWidth(child) {
  child.layoutAlign = "STRETCH";
  try { child.layoutSizingHorizontal = "FILL"; } catch (e) {}
}
```
### G. MANDATORY ONLINE IMAGE FILLS PROTOCOL (REAL PHOTOGRAPHY)
Every generated screen script (`screens/*.js`) MUST include this helper function and use `applyOnlineImage(frameNode, imageUrl)` to populate all photo thumbnails, hero banners, hotel cards, user avatars, and media previews with real online Unsplash images instead of flat gray placeholder boxes:

```javascript
async function applyOnlineImage(frameNode, imageUrl) {
  try {
    const image = await figma.createImageAsync(imageUrl);
    frameNode.fills = [{
      type: 'IMAGE',
      scaleMode: 'FILL',
      imageHash: image.hash
    }];
  } catch (err) {
    console.warn(`[Image Load] ${imageUrl}:`, err);
    frameNode.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.95 } }];
  }
}
```
⚠️ **REAL PHOTOGRAPHY MANDATE:** NEVER leave hotel cards, food dishes, user avatars, or reel thumbnails as plain solid gray boxes! Always invoke `applyOnlineImage(node, "https://images.unsplash.com/...")` so Figma canvas renders actual high-res photography!



---

## 5. Frontend Design Analysis & Orchestration Protocol

Whenever a user requests a new screen or UI update, the AI Agent MUST automatically perform the **Frontend Design Pre-Flight Analysis**:

1. **Read Workspace Skills**: Always consume `.agents/skills/frontend-design/SKILL.md` and `.agents/skills/design-taste-frontend/SKILL.md`.
2. **Read Local Context Files**: Inspect the project's `local/brief.md`, `local/colors.md`, `local/fonts.md`, and `local/taste.md` before generating code.
3. **Declare Design Read**: Before outputting code, state a concise 1-line Design Read:
   *"Reading this as: <page kind> for <audience>, with a <vibe> language, leaning toward <aesthetic direction>."*
4. **Enforce 3 Dials**: Align layout density, motion, and visual variance (`DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY`) with the product domain.
5. **Strict HUG Height Compliance**: Guarantee every sub-container row, pill group, grid row, header bar, and footer tab bar uses `counterAxisSizingMode = "AUTO"` or `primaryAxisSizingMode = "AUTO"` so NO elements collapse or render as `height: 100px` fixed boxes.

---

## 6. Component-Driven Execution Protocol & Design System 3-Pillars Rule
- **Design System Core Foundations Mandate**: Whenever `@gen-components`, `@gen-variables`, or a Design System is requested, the AI MUST reference `.agents/skills/ui-design-system/SKILL.md` and `FigmaPlugin/core/` protocols (`component.md`, `variables.md`), generating BOTH tokens and components:
  1. 🎨 **Color Token Scale System** (Brand Primary, Dark/Light Surfaces, Neutral Scale, Semantic status colors published to `tokens/variables.js` via `figma.variables.createVariableCollection` and visual swatches).
  2. 🔤 **Typography Scale System** (Strict EVEN scale: `32`, `24`, `20`, `16`, `14`, `12`, `10` published to `tokens/variables.js` via `figma.createTextStyle()` and visual font specimens).
  3. 🧩 **Master Components with Parent-Child Hierarchy** (Native `ComponentSetNode` via `figma.combineAsVariants()` published to `components/DesignSystem.js` with Auto Layout enabled on every `ComponentSetNode` so variants NEVER overlap).
     - Default Design System Components: **Button** (`Variant=Primary|Secondary|Outline`, `State=Default|Hover|Disabled`) and **FilterPill** (`State=Default|Active`).
- **Context Persistence & Design System Recall Protocol**:
  - Whenever design tokens or components are created/updated, the AI Agent MUST update project local memory files under `FigmaPlugin/<Project_Name>/local/`:
    - `local/colors.md` (Color tokens quick-map)
    - `local/fonts.md` (Font family & scale quick-map)
    - `local/taste.md` (Visual radii, borders, dark theme rules)
    - `local/components.md` (Master component set registry & `createInstance` lookup snippets)
  - **REUSE RULE:** When generating new screens or components, the AI Agent MUST inspect `local/` FIRST and REUSE previously generated colors, fonts, spacing, and master components (`componentNode.createInstance()`) instead of reinventing them from scratch!
- Obey High-End Design Taste: high-contrast text scale (`#0F172A`, `#334155` or dark mode `#FFFFFF`, `#B3B3B3`), micro-paddings, subtle 1px inner borders (`#E5E7EB` / `#333333`), and zero emojis.

---

## 7. Summary Checklist for AI Agents

When handling a user request in a new chat:
1. Check if `@newproject` is invoked → Scaffold directories (`screens/`, `components/`, `tokens/`, `local/`) under `FigmaPlugin/<ProjectName>/` immediately without asking questions.
2. Check if `@gen-variables` or `@gen-components` is invoked → Write script to `tokens/variables.js` or `components/<ComponentName>.js`.
3. Check if a screen generation is requested → Read `frontend-design` & `design-taste-frontend` skills, project `local/` files, state the 1-line **Design Read**, enforce Auto Layout **HUG Height** rules, and generate `FigmaPlugin/<Project_Name>/screens/<screen_name>.js`.
4. End turn with a concise summary. Do NOT run terminal `curl` commands.
