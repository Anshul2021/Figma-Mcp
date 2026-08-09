# FrameForge — AI-Powered Figma Screen Generator

Generate production-quality Figma UI screens from natural language prompts. Works directly inside the **Figma plugin** (primary) and through an **IDE-based workflow** (advanced).

---

## Quick Start

### 1. Install Dependencies

```bash
cd FigmaPlugin
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
GEMINI_API_KEY=your-gemini-api-key
PORT=3003
GEMINI_MODEL=gemini-3.6-flash
```

> Get your API key from [Google AI Studio](https://aistudio.google.com/apikey).

### 3. Start the Server

```bash
cd FigmaPlugin
node server.js
```

Server output:

```
══════════════════════════════════════════════
  ⚡ FrameForge Server (Direct Mode)
  Running at: http://localhost:3003
  Rate Limit: 10 credits / model / day
  Gemini: Ready
══════════════════════════════════════════════
```

### 4. Load the Plugin in Figma

1. Open Figma Desktop → **Plugins** → **Development** → **Import plugin from manifest**
2. Select `FigmaPlugin/plugin/manifest.json`
3. Run **FrameForge** from the Figma plugins menu.

---

## Plugin Workflow (Direct Mode)

### Direct Launch
The plugin opens directly into the **Home Dashboard** — no sign-in required.

### Create a Project
1. Click **New Project**
2. Fill in: Project Name, Brief, Colors (4 color pickers), Font, Taste
3. Click **Create Project** — project directories are scaffolded on disk under `FigmaPlugin/<ProjectName>/`

### Generate a Screen
1. Open your project from the home dashboard
2. Type a screen description (e.g., *"Instagram-style profile page with photo grid"*)
3. Select your preferred Gemini Flash model from the dropdown
4. Click **Generate Screen** — the AI generates a Figma script and renders it on your canvas

### Daily Rate Limit (10 Credits / Model / Day)
- Each Gemini Flash model gets **10 credits per day**.
- Credits auto-reset every night at midnight.
- The UI displays live credit badges (e.g. `⚡ 10/10 today`).

---

## Supported Gemini Models

| Model | ID | Daily Credits |
|---|---|---|
| **Gemini 3.6 Flash** *(Recommended)* | `gemini-3.6-flash` | 10 credits/day |
| **Gemini 3.5 Flash** | `gemini-3.5-flash` | 10 credits/day |
| **Gemini 3.5 Flash Lite** | `gemini-3.5-flash-lite` | 10 credits/day |
| **Gemini 3.1 Flash Lite** | `gemini-3.1-flash-lite` | 10 credits/day |
| **Gemini 3 Flash** | `gemini-3-flash` | 10 credits/day |
| **Gemini 2.5 Flash** | `gemini-2.5-flash` | 10 credits/day |
| **Gemini 2.5 Flash Lite** | `gemini-2.5-flash-lite` | 10 credits/day |

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/status` | GET | Server health check + credits summary |
| `/api/projects` | GET | List all projects |
| `/api/projects` | POST | Create new project |
| `/api/projects/:name/config` | GET/PUT | Read or update project configuration |
| `/api/generate/screen` | POST | Generate a screen via Gemini |
| `/api/generate/designsystem` | POST | Generate design system via Gemini |
| `/api/models` | GET | List Gemini Flash models + remaining credits |
| `/api/credits` | GET | Get model credit status |
| `/api/watch` | GET | SSE stream for live Figma auto-sync |
| `/api/scripts/:path` | GET | Serve script file contents |