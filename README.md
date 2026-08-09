# Morph — AI-Powered Figma Screen Generator

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
  ✦ Morph Server (Direct Mode)
  Running at: http://localhost:3003
  Rate Limit: 10 credits / model / day
  Gemini: Ready
══════════════════════════════════════════════
```

### 4. Load the Plugin in Figma

1. Open Figma Desktop → **Plugins** → **Development** → **Import plugin from manifest**
2. Select `FigmaPlugin/plugin/manifest.json`
3. Run **Morph** from the Figma plugins menu.

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

## Deploy to Vercel (Cloud Mode — no local machine needed)

The server runs in **two modes automatically**:

- **Local mode** (`node server.js`): projects/screens are stored in the filesystem and synced to Figma via SSE. Great for development.
- **Cloud mode** (deployed to Vercel): projects/screens are stored in **Vercel Blob** cloud storage, and the plugin **polls** for updates instead of using SSE. The plugin works for end users even when your computer and code editor are closed.

> Vercel serverless runs are stateless with a read-only filesystem, so generated files *must* live in Blob to survive. When `VERCEL=1` is set, all project reads/writes automatically route to the attached Blob store; files committed to the repo (e.g. the `Instagram/` demo) still resolve from the deploy filesystem as a fallback.

### One-time setup (from `FigmaPlugin/`)

```bash
npm install                                  # installs @vercel/blob
vercel link                                  # link your Vercel project
vercel blobs add                             # create a Blob store (injects BLOB_READ_WRITE_TOKEN)
```

Then add these environment variables in the Vercel dashboard (Project → Settings → Environment Variables):

| Variable | Value |
|---|---|
| `GEMINI_API_KEY` | your Google AI Studio key (required) |
| `GEMINI_MODEL` | `gemini-3.6-flash` (optional, defaults to this) |
| `ADMIN_TOKEN` | a secret you choose (e.g. the one generated in your `.env`) to view the users/usage dashboard |

Deploy:

```bash
vercel deploy --prod
```

> If your production URL differs from `https://figma-mcp-topaz.vercel.app`, update `const SERVER = ...` at the top of `plugin/ui.html` and redeploy.

### Reload the plugin in Figma

Because `plugin/manifest.json` now lists your Vercel domain in `networkAccess.allowedDomains`, **re-import the plugin from the manifest** (Plugins → Development → Import plugin from manifest → select `FigmaPlugin/plugin/manifest.json`) so the new network permissions take effect.

The plugin now:
1. Generates screens/design systems through the cloud server (Gemini).
2. Saves them to Vercel Blob (persistent across serverless instances).
3. Polls every 8 seconds so new screens appear without SSE.
4. Renders on the canvas immediately after generation.

---

## User Tracking & Admin Dashboard

Every user is recorded automatically:

- **On first launch** the plugin asks for a name (or "Continue as a guest"). That name + their **IP** is sent to `POST /api/users/register` and stored under `_users/<ip>.json` (Vercel Blob in cloud mode, local `_users/` folder otherwise).
- **Usage limits stay IP-based**: each IP gets **10 credits per model per day**. Each successful generation also records the per-model count on the user's record (name, IP, first seen, last seen, used per model, credits remaining).

### View the data

| Where | How |
|---|---|
| **Plugin "Activity" panel** | Home screen → the users icon in the top-right. Enter the `ADMIN_TOKEN` once (persisted in Figma via `clientStorage`); shows name, IP, generated count, credits left, first/last seen, and a remove button. Token only lives on your Figma install, not end users'. |
| **Browser dashboard** | Open `https://figma-mcp-topaz.vercel.app/admin` (or `/admin` on your server) in a browser and enter the same box, or append `?token=<ADMIN_TOKEN>`. |
| **API** | `GET /api/users?token=<ADMIN_TOKEN>` returns JSON; `DELETE /api/users/<ip>?token=<ADMIN_TOKEN>` removes a record. |

> `ADMIN_TOKEN` must be set (same value in local `.env` and Vercel env vars) or the endpoints return `403`. Records are stored for the *current* Blob store; note that Blob's directory listing can lag a moment after a write, so a freshly generated screen may take a few seconds to appear in the list (it still renders on canvas instantly).

### Known serverless trade-off
The 10-credits/day rate counter is kept in-memory on Vercel (each warm instance holds its own snapshot), so limits are enforced per instance rather than globally. For precise global limits, wire `engine/rate-limiter.js` to a shared store such as Vercel KV — everything else (users, projects, screens) is already persisted in Blob.

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