# 🎨 Figma AI Screen & Design System Generator

![Figma Plugin](https://img.shields.io/badge/Figma-Plugin-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![Node.js Bridge](https://img.shields.io/badge/Node.js-Port_3003-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![SSE Live Sync](https://img.shields.io/badge/SSE-Live_Auto_Sync-007ACC?style=for-the-badge)
![Auto Layout 5.0](https://img.shields.io/badge/Auto_Layout-5.0-FF7700?style=for-the-badge)
![Iconography](https://img.shields.io/badge/Vector_Icons-Lucide_SVG-10B981?style=for-the-badge)

> **Self-Contained AI Platform for Figma:** Transform natural language prompts into production-ready Figma UI screens, master component libraries (`figma.combineAsVariants`), and native Figma Variables (`figma.variables`), streamed live to your Figma Desktop canvas via a local Node.js bridge server.

---

## ⚡ How It Works

```
┌─────────────────┐      ┌────────────────────┐      ┌──────────────────────────────┐
│  User Prompt    │ ───> │  AI Agent          │ ───> │ Writes JavaScript File       │
│  (Chat Window)  │      │  (Orchestrator)    │      │ FigmaPlugin/<Project>/...    │
└─────────────────┘      └────────────────────┘      └──────────────────────────────┘
                                                                    │
                                                                    ▼
┌─────────────────┐      ┌────────────────────┐      ┌──────────────────────────────┐
│ Live UI Render  │ <─── │  Figma Plugin      │ <─── │ Node.js Bridge Server        │
│ (Figma Canvas)  │      │  (ui.html / SSE)   │      │ (server.js / Port 3003)      │
└─────────────────┘      └────────────────────┘      └──────────────────────────────┘
```

1. 💬 **You Prompt the Agent**: Type a screen prompt or command (`@newproject`, `@brief`, `@gen-variables`, `@gen-components`).
2. 🤖 **AI Agent Writes Script**: Applies Auto Layout & design taste rules, saving a `.js` file under `FigmaPlugin/<Project_Name>/`.
3. 📡 **Bridge Server Watches Writes**: `server.js` detects file changes and emits a Server-Sent Event (SSE) over `/api/watch`.
4. 🎨 **Figma Plugin Auto-Executes**: `plugin/ui.html` receives the SSE signal and renders the UI live on your Figma canvas in real time.

---

## 🚦 Getting Started (Step-by-Step Workflow)

![Step 1](https://img.shields.io/badge/Step_1-Start_Server-339933?style=flat-square) → ![Step 2](https://img.shields.io/badge/Step_2-Load_Plugin-F24E1E?style=flat-square) → ![Step 3](https://img.shields.io/badge/Step_3-%40newproject_%2B_%40brief-FF7700?style=flat-square) → ![Step 4](https://img.shields.io/badge/Step_4-Generate_Screens-007ACC?style=flat-square) → ![Step 5](https://img.shields.io/badge/Step_5-%40gen--variables-8E44AD?style=flat-square) → ![Step 6](https://img.shields.io/badge/Step_6-%40gen--components-10B981?style=flat-square)

### 1️⃣ Start Bridge Server
```bash
cd FigmaPlugin && node server.js
```
*Runs on `http://localhost:3003` and watches `screens/`, `components/`, and `tokens/` for writes.*

### 2️⃣ Load Plugin in Figma Desktop
Open Figma Desktop → **Plugins > Development > Import plugin from manifest...** → Select `FigmaPlugin/plugin/manifest.json`.

### 3️⃣ Scaffold Project with Product Brief (`@newproject` + `@brief`)
```text
@newproject Crusource
@brief Crusource is an enterprise AI-powered HR tech platform for candidate job search, multi-step application tracking, and automated onboarding.
```
*Creates project folder structure under `FigmaPlugin/Crusource/` with `screens/`, `components/`, `tokens/`, and updates `local/brief.md` with domain context.*

> **Flexible Setup:** You can also include `@color`, `@font`, or `@taste` in the initial prompt if you wish. If omitted, default project scaffolding defaults apply automatically!

### 4️⃣ Generate UI Screens
```text
Generate candidate job description screen for Crusource with hero role header, salary pill ($190k-$240k), company overview column, and hiring manager sidebar card.
```
*Saves `FigmaPlugin/Crusource/screens/job_description.js` and streams live to Figma canvas.*

### 5️⃣ Publish Native Variables (`@gen-variables`)
```text
@gen-variables
```
*Creates native `figma.variables` collections in Figma containing Brand Colors, Slate Text Scale, Spacing, Radii, and Text Styles.*

### 6️⃣ Generate Master Component Sets (`@gen-components`)
```text
@gen-components
```
*Generates master `ComponentSetNode` objects via `figma.combineAsVariants()`. Selecting any button or input on canvas displays interactive **`Variant`** and **`State`** dropdown selectors in the Inspector panel.*

### 7️⃣ Iterate with Component Reuse (`@use-components`)
```text
@use-components
```
*Instructs screen scripts to instantiate existing master components from `components/` instead of building raw inline frames.*

---

## 🛠️ Complete Command Reference

| Visual Chip | Command | Syntax | When to Use | What It Does |
|:---|:---|:---|:---|:---|
| ![New Project](https://img.shields.io/badge/%40newproject-Scaffold-FF7700?style=flat-square) | `@newproject` | `@newproject <Name>` | Starting a new app | Scaffolds directory structure and copies local context files. |
| ![Product Brief](https://img.shields.io/badge/%40brief-Product_Context-2980B9?style=flat-square) | `@brief` | `@brief <Product Brief>` | Setting app domain context | Defines product purpose, target audience, and updates `local/brief.md` for accurate UI generation. |
| ![Design System](https://img.shields.io/badge/%40designsystem-End_to_End_DS-E74C3C?style=flat-square) | `@designsystem` | `@designsystem` | Generating complete DS | Reads `ui-design-system` skill, publishes tokens, scans project `screens/*.js`, builds master `ComponentSetNode` sets, and links instances. |
| ![Gen Variables](https://img.shields.io/badge/%40gen--variables-Native_Tokens-8E44AD?style=flat-square) | `@gen-variables` | `@gen-variables` | Publishing tokens | Creates native `figma.variables` collections and Text Styles. |
| ![Gen Components](https://img.shields.io/badge/%40gen--components-Design_System-10B981?style=flat-square) | `@gen-components` | `@gen-components` | Building design system | Builds master component sets via `figma.combineAsVariants()`. |
| ![Use Components](https://img.shields.io/badge/%40use--components-Re-use-007ACC?style=flat-square) | `@use-components` | `@use-components` | Reusing master UI assets | Instantiates master components via `createInstance()`. |
| ![Static Layout](https://img.shields.io/badge/%40skip--autolayout-Absolute-95A5A6?style=flat-square) | `@skip-autolayout` | `@skip-autolayout` | Absolute coordinates | Generates static x/y positioning without Auto Layout. |
| ![Font Override](https://img.shields.io/badge/%40font-Typography-34495E?style=flat-square) | `@font` | `@font Instrument Sans` | Overriding font | Overrides font family for the generation session. |
| ![Color Override](https://img.shields.io/badge/%40color-Brand_Hex-E74C3C?style=flat-square) | `@color` | `@color #FF7700, #0F172A` | Overriding brand hex | Overrides primary and secondary brand colors. |
| ![Taste Override](https://img.shields.io/badge/%40taste-Visual_Style-D35400?style=flat-square) | `@taste` | `@taste glassmorphism` | Overriding visual taste | Overrides visual aesthetic style. |

---

## 💡 Key Prompting Rules

> [!IMPORTANT]
> - 🎯 **Product Brief Alignment (`@brief`)**: Define what your product is and who it is for. All screen and component decisions use this context for high accuracy.
> - 🚫 **Zero Emoji Rule**: The engine automatically replaces text emojis with lightweight Lucide vector SVG icons (`map-pin`, `dollar-sign`, `check-circle`, `clock`). Never place emojis inside text strings.
> - 📐 **Strict EVEN Typography Scale**: Font sizes MUST be even numbers: `10`, `12`, `14`, `16`, `20`, `24`, `32`.
> - 🎨 **High-Contrast Slate Scale**: Headings use `#0F172A` Slate-900, body copy uses `#334155` Slate-700, and captions use `#64748B` Slate-500 over `#FFFFFF` surface cards and `#F8FAFC` slate canvas.
> - ⚡ **Zero Terminal Popups**: Writing `.js` files via `write_to_file` automatically triggers SSE auto-sync. Zero shell commands or IDE popups required.

---

## 📁 Directory Architecture

```
Figma-Mcp/
├── AGENTS.md                             📄 Master AI Directives & Orchestrator Document
├── README.md                             📄 Complete Getting Started & Workflow Guide
├── architecture.md                       📄 Repository Directory Structure Document
├── example.md                            📄 Practical Prompting Examples & Workflows
│
├── .agents/skills/                       📁 AI Skill Registry
│   ├── frontend-design/                  🎨 Visual Tone & Anti-Slop Skill
│   ├── design-taste-frontend/            🎨 Micro-Padding & Subtle Border Skill
│   ├── ui-design-system/                 🧩 Tokens & ComponentSets Architecture Skill
│   └── figma-screen-generator/           ⚡ Auto Layout & Plugin Bridge Skill
│
└── FigmaPlugin/                          📁 Primary Plugin Workspace
    ├── plugin/                           📁 Figma Plugin Client (manifest.json, code.js, ui.html)
    ├── server.js                         📜 Local Bridge Server (Port 3003, SSE Watcher)
    │
    ├── core/                             📁 Immutable Engine Protocols
    │   ├── command.md                    📄 Command syntax specs
    │   ├── instruction.md                📄 Core generation & vector icon rules
    │   ├── autolayout.md                 📄 Auto Layout execution protocol & anti-patterns
    │   ├── component.md                  📄 ComponentSet & Variant dropdown protocol
    │   └── variables.md                  📄 Native Figma Variables publishing protocol
    │
    └── <Project_Name>/                    📁 Dynamic User Project Directories
        ├── screens/                      📁 Generated Screen Scripts (<screen_name>.js)
        ├── components/                   📁 Master Component Sets (<ComponentName>.js)
        ├── tokens/                       📁 Figma Local Variables (variables.js)
        └── local/                        📁 Project Overrides (colors, fonts, taste, brief)
```

---

## 🔗 Related Resources

- 💡 **[example.md](./example.md)** — Copy-paste prompt templates and end-to-end user journeys.
- 🏗️ **[architecture.md](./architecture.md)** — Data flow and directory structure docs.
- 🤖 **[AGENTS.md](./AGENTS.md)** — Master AI orchestrator decision matrix.