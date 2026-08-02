# Figma AI Screen Generator

AI-powered Figma plugin that generates production-quality UI screens directly on your Figma canvas from natural language prompts.

---

## Quick Start

### 1. Start the Bridge Server

```bash
cd FigmaPlugin
node server.js
```

The server runs on `http://localhost:3003` and watches for generated script changes.

### 2. Load the Plugin in Figma

1. Open Figma Desktop
2. Go to **Plugins > Development > Import plugin from manifest**
3. Select `FigmaPlugin/plugin/manifest.json`
4. Run the plugin — it connects to the bridge server automatically

### 3. Generate a Screen

The AI agent generates a `.js` script, writes it to `FigmaPlugin/<Project_Name>/screens/<screen_name>.js`, and the plugin auto-executes it live on your Figma canvas.

---

## 🤖 AI Agent Self-Contained Architecture

This repository uses [`AGENTS.md`](file:///Users/fwcuser/Desktop/Figma-Mcp/AGENTS.md) and [`.agents/skills/`](file:///Users/fwcuser/Desktop/Figma-Mcp/.agents/skills/figma-screen-generator/SKILL.md) as master directives.
Any AI agent or new conversation session opening this repository will **automatically read these directives** and know how to scaffold projects (`@newproject`), follow Auto Layout rules, use lightweight vector icons, and generate screens without needing prior chat context!

---

## Project Structure

```
Figma-Mcp/
├── AGENTS.md                Master AI Directive Document (Self-contained context)
├── README.md                Quickstart & setup guide
├── architecture.md          Repository directory structure
├── example.md               Prompt examples & copy-paste templates
│
└── FigmaPlugin/
    ├── plugin/              Figma plugin (code.js, ui.html, manifest.json)
    ├── server.js            Bridge server (SSE watcher + dynamic API)
    │
    ├── core/                System Rules (do not edit)
    │   ├── instruction.md   Iconography, SVG validation, grid, API rules
    │   ├── command.md       All @ commands reference
    │   └── autolayout.md    Auto Layout execution protocol & anti-patterns
    │
    ├── global/              Default Design Tokens
    │   ├── fonts.md         Typography system (DM Sans, even scale only)
    │   ├── colors.md        Color token system
    │   ├── taste.md         Visual style preferences
    │   └── brief.md         Default project brief (375x812 iOS)
    │
    └── <ProjectName>/       Per-project folders (created via @newproject)
        ├── screens/         Generated .js screen files
        └── local/           Project-specific local overrides
        ├── fonts.md
        ├── colors.md
        ├── taste.md
        └── brief.md
```

---

## Commands

Use these in your prompts to control generation behavior:

| Command | Syntax | Description |
|:--------|:-------|:------------|
| `@skip-autolayout` | `@skip-autolayout` | Use static x/y positioning instead of Auto Layout |
| `@font` | `@font Inter, Playfair Display` | Override the default font for this generation |
| `@color` | `@color #FF6B6B, #4ECDC4` | Override primary and secondary colors |
| `@taste` | `@taste glassmorphism with frosted cards` | Override visual style preferences |
| `@newproject` | `@newproject FoodDeliveryApp` | Scaffold a new project folder structure |

---

## How It Works

```
You (prompt) → AI Agent → generates .js script → writes to scripts/
                                                        ↓
                                              server.js detects change
                                                        ↓
                                              SSE event → plugin/ui.html
                                                        ↓
                                              plugin/code.js evaluates script
                                                        ↓
                                              UI renders on Figma canvas
```

---

## Config Resolution

When generating screens, the agent reads config in this priority:

```
Inline commands (@font, @color, @taste)
        ↓ (if not set)
<Project>/local/*.md
        ↓ (if not found)
global/*.md
```

---

## Creating a New Project

Use `@newproject` to scaffold a project with its own design tokens:

```
@newproject FoodDeliveryApp
```

This creates:
```
FigmaPlugin/FoodDeliveryApp/
├── screens/          (ready for generated screen scripts)
└── local/
    ├── fonts.md      (copied from global — edit to customize)
    ├── colors.md     (copied from global — edit to customize)
    ├── taste.md      (copied from global — edit to customize)
    └── brief.md      (copied from global — edit to customize)
```

Then edit the `local/*.md` files to set project-specific fonts, colors, and styling.

---

## Example Prompts

```
Generate a food delivery home screen with categories and restaurant cards

@font Poppins @color #E91E63, #9C27B0 Generate a music player with album art

@skip-autolayout Generate an Uber ride booking screen

@taste brutalist, sharp corners Generate a developer dashboard
```

See [example.md](./example.md) for a complete copy-paste ready example.