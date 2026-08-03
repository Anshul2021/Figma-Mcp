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
| **`@skip-design-taste` (or `@quick`)** | `figma-screen-generator` (fast mode) | Disables visual taste rules for ultra-fast generation and minimal token usage. |
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

### 2. `@gen-variables`
- **Action:** Generates/publishes native Figma Variables (`tokens/variables.js`) and Text Styles (`tokens/styles.js`) directly to Figma's native panel using `figma.variables` API.

### 3. `@gen-components`
- **Action:** Generates master reusable components (`components/<ComponentName>.js`) inside `FigmaPlugin/<Project_Name>/components/` using `figma.createComponent()`.

### 4. `@use-components`
- **Action:** Instructs screen scripts to inspect `components/` and instantiate existing master components via `componentNode.createInstance()` instead of creating raw inline frames.

### 5. `@skip-autolayout`
- **Action:** Generate static layout using absolute `x`, `y` coordinates and fixed `resize(width, height)`. Do NOT set `layoutMode` or Auto Layout sizing properties.

### 6. `@font <FontName1>[, <FontName2>]`
- **Action:** Override typography font family for the generation session.

### 7. `@color <PrimaryHex>, <SecondaryHex>`
- **Action:** Override primary and secondary brand colors.

### 8. `@taste <style description>`
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

### C. Auto Layout Execution Protocol (MANDATORY ORDER)
Every Auto Layout frame MUST be constructed following this exact order:

```
1. Create frame                       const frame = figma.createFrame();
2. Set layoutMode FIRST               frame.layoutMode = "VERTICAL" | "HORIZONTAL";
3. Set visual properties              frame.fills, frame.strokes, frame.cornerRadius
4. Set padding & itemSpacing          frame.paddingLeft/Right/Top/Bottom, frame.itemSpacing
5. Set alignment properties           frame.primaryAxisAlignItems, frame.counterAxisAlignItems
6. Call resize() FIRST (if fixed)     frame.resize(width, height);
   ⚠️ NEVER call resize() on Buttons, Badges, or Chips! Let them HUG width & height automatically.
6.5 Set sizing modes AFTER resize()   frame.primaryAxisSizingMode, frame.counterAxisSizingMode
7. Append ALL children                frame.appendChild(child);
8. Set child sizing AFTER append      child.layoutSizingHorizontal = "FILL" | "STRETCH";
9. Set parent HUG LAST                finalizeHugHeight(frame);
```

### D. Absolute Overlay Order Rule (Anti-Pattern #6)
- In Figma API, `layoutPositioning = "ABSOLUTE"` can **ONLY** be called on a child node **AFTER** it has been appended to an Auto Layout parent (`parentFrame.appendChild(child)`).
- **NEVER** call `layoutPositioning = "ABSOLUTE"` before `parentFrame.appendChild(child)`.

### E. Immediate Parent Appending Rule (Prevent Floating Frames)
- Whenever creating container frames (`scrollArea`, `gridRow`, `card`, `imgFrame`), append them to their parent frame **IMMEDIATELY** upon creation.
- This prevents orphan frames from floating at the root `figma.currentPage` level if an async call or layout calculation fails.

---

## 5. Component-Driven Execution Protocol & Design System 3-Pillars Rule
- **Design System Mandate (3 Pillars)**: Whenever generating a Design System, the AI MUST reference `.agents/skills/ui-design-system/SKILL.md` and ALWAYS include all 3 pillars:
  1. 🎨 **Color Token Scale System** (Brand Primary, Slate Scale `#0F172A`/`#334155`/`#64748B`, Semantic status colors).
  2. 🔤 **Typography Scale System** (Strict EVEN scale: `32`, `24`, `20`, `16`, `14`, `12`, `10`).
  3. 🧩 **ComponentSets with Interactive States** (Native `ComponentSetNode` via `figma.combineAsVariants()` with Auto Layout enabled on the `ComponentSetNode` so variants NEVER overlap).
- When `@use-components` is triggered, inspect `components/` first and use `componentNode.createInstance()` to instantiate master components.
- When `@gen-variables` is triggered, generate `tokens/variables.js` to publish native Figma Variables collections.
- Obey High-End Design Taste: high-contrast text scale (`#0F172A`, `#334155`), micro-paddings, subtle 1px inner borders (`#E5E7EB`), and zero emojis.

---

## 6. Summary Checklist for AI Agents

When handling a user request in a new chat:
1. Check if `@newproject` is invoked → Scaffold directories (`screens/`, `components/`, `tokens/`, `local/`) under `FigmaPlugin/<ProjectName>/` immediately without asking questions.
2. Check if `@gen-variables` or `@gen-components` is invoked → Write script to `tokens/variables.js` or `components/<ComponentName>.js`.
3. Check if a screen generation is requested → Read `core/instruction.md`, `core/autolayout.md`, `core/command.md`, `core/component.md`, `core/variables.md`, and project `local/` files.
4. Write script to `FigmaPlugin/<Project_Name>/screens/<screen_name>.js`.
5. End turn with a concise summary. Do NOT run terminal `curl` commands.
