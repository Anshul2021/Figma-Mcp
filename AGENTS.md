# AGENTS.md — Figma AI Screen Generator System Directives

> **CRITICAL DIRECTIVE FOR ALL AI AGENTS & SESSION INSTANCES:**
> This repository is a self-contained AI-powered Figma screen generation platform.
> Every AI agent operating in this repository MUST read and follow these directives automatically without requiring prior chat context or asking unnecessary clarifying questions.

---

## 1. System Overview & Architecture

The system generates production-quality Figma UI scripts from natural language prompts, writes them to project directories, and streams them live to a Figma plugin via a Node.js bridge server.

```
Figma-Mcp/
├── AGENTS.md                             📄 Master AI Directive Document (This File)
├── README.md                             📄 User Quickstart & Setup Guide
├── architecture.md                       📄 Repository Directory Structure Document
├── example.md                            📄 Prompting Examples & Code Snippets
│
└── FigmaPlugin/                          📁 Primary Plugin Workspace
    ├── plugin/                           📁 Figma Plugin Client (manifest.json, code.js, ui.html)
    ├── server.js                         📜 Local Bridge Server (Port 3003, SSE Watcher, Dynamic API)
    │
    ├── core/                             📁 Immutable System Rules (DO NOT MODIFY)
    │   ├── command.md                    📄 Command syntax & priority resolution
    │   ├── instruction.md                📄 Core generation rules & icon protocols
    │   └── autolayout.md                 📄 Auto Layout execution protocol & anti-patterns
    │
    ├── global/                            📁 Default Global Context Templates
    │   ├── fonts.md                      📄 Font scale (DM Sans, even sizes only)
    │   ├── colors.md                     📄 Color tokens
    │   ├── taste.md                      📄 Visual styling & radii
    │   └── brief.md                      📄 App brief template
    │
    └── <Project_Name>/                    📁 Dynamic User Project Directories
        ├── screens/                      📁 Screen Scripts (<screen_name>.js)
        └── local/                        📁 Project Local Overrides (fonts, colors, taste, brief)
```

---

## 2. Command Protocol & Auto-Scaffolding Workflow

User prompts may contain `@` commands (case-insensitive). Execute commands instantly without asking superfluous clarifying questions:

### 1. `@newproject <ProjectName>` (Project Creation)
- **Action:** Immediately scaffold the directory structure for `<ProjectName>` under `FigmaPlugin/<ProjectName>/`:
  - Create `FigmaPlugin/<ProjectName>/screens/`
  - Create `FigmaPlugin/<ProjectName>/local/`
  - Copy default context templates from `FigmaPlugin/global/` (`taste.md`, `colors.md`, `fonts.md`, `brief.md`) into `FigmaPlugin/<ProjectName>/local/`.
- **Response Rule:** Inform the user cleanly that `<ProjectName>` is scaffolded and ready for screen generation prompts. **DO NOT ask clarifying questions.**

### 2. `@skip-autolayout`
- **Action:** Generate static layout using absolute `x`, `y` coordinates and fixed `resize(width, height)`. Do NOT set `layoutMode` or Auto Layout sizing properties.

### 3. `@font <FontName1>[, <FontName2>]`
- **Action:** Override typography font family for the generation session.

### 4. `@color <PrimaryHex>, <SecondaryHex>`
- **Action:** Override primary and secondary brand colors.

### 5. `@taste <style description>`
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
3. **CRITICAL EXECUTION RULE (NO TERMINAL CURL CALLS):**
   - **NEVER** run terminal `curl` or shell commands to trigger `/api/run`.
   - Writing the `.js` file to disk is 100% sufficient and prevents IDE permission popups.

---

## 4. Mandatory UI Design System & Technical Rules

Every generated script (`<screen_name>.js`) MUST strictly adhere to the following rules:

### A. Font & Typography Scale Rule
- **Default Font:** DM Sans (must load `Regular`, `Medium`, `Bold` styles via `await figma.loadFontAsync()`).
- **STRICT EVEN FONT SCALE:** Font sizes MUST ONLY be even numbers: `10`, `12`, `14`, `16`, `20`, `24`, `32`.
- **NO ODD FONT SIZES:** Never use `11`, `13`, `15`, `17` or decimal font sizes.

### B. Strict Zero Emoji & Vector Iconography Rule
- **NEVER** use emojis anywhere in generated scripts or UI frames.
- Use vector SVG icons via `loadLucideIcon(iconName, size, color, strokeWidth = 1.5)` (`https://unpkg.com/lucide-static@latest/icons/${iconName}.svg`).
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

## 5. Summary Checklist for AI Agents

When handling a user request in a new chat:
1. Check if `@newproject` is invoked → Scaffold directories under `FigmaPlugin/<ProjectName>/` immediately without asking questions.
2. Check if a screen generation is requested → Read `core/instruction.md`, `core/autolayout.md`, `core/command.md`, and project `local/` files.
3. Write script to `FigmaPlugin/<Project_Name>/screens/<screen_name>.js`.
4. End turn with a concise summary. Do NOT run terminal `curl` commands.
