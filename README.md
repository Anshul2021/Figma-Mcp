# Morph — AI-Powered Figma Screen Generator

> Turn natural language prompts into production-quality, Auto Layout Figma screens in seconds. Morph is a self-contained AI system that transforms text prompts into editable UI layouts, master component sets, and native Figma variables with minimal token consumption.

<p align="left">
  <img src="https://img.shields.io/badge/Status-MVP--Active-orange?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Engine-Gemini_Flash-4285F4?style=for-the-badge&logo=google" alt="Engine">
  <img src="https://img.shields.io/badge/Output-Auto_Layout-059669?style=for-the-badge&logo=figma" alt="Output">
  <img src="https://img.shields.io/badge/Tokens-Code_Driven-7C3AED?style=for-the-badge" alt="Tokens">
</p>

---

## Quick Start & User Guide

<p align="left">
  <img src="https://img.shields.io/badge/Workflow-Designer-EC4899?style=for-the-badge" alt="Designer">
  <img src="https://img.shields.io/badge/Workflow-Developer-2563EB?style=for-the-badge" alt="Developer">
</p>

Morph supports two distinct workflows tailored for designers and developers.

---

### Designer Workflow (Plugin-Only)

Designers can create full UI screens and design systems directly inside Figma without touching code or running local servers.

<p align="left">
  <img src="https://img.shields.io/badge/Feature-No_Code_Required-059669?style=for-the-badge" alt="No Code">
</p>

| Step | Action Tag | Instruction |
|---|---|---|
| **Step 1** | <img src="https://img.shields.io/badge/Step_1-Install_Plugin-2563EB?style=for-the-badge" alt="Step 1"> | Import `FigmaPlugin/plugin/manifest.json` into Figma Desktop (`Plugins → Development → Import plugin from manifest`). |
| **Step 2** | <img src="https://img.shields.io/badge/Step_2-Setup_Project-059669?style=for-the-badge" alt="Step 2"> | Click `New Project` and define the project name, domain brief, color palette, typography, and visual taste. |
| **Step 3** | <img src="https://img.shields.io/badge/Step_3-Generate_Screens-D97706?style=for-the-badge" alt="Step 3"> | Describe desired UI screens using natural language prompts. |
| **Step 4** | <img src="https://img.shields.io/badge/Step_4-Build_Design_System-7C3AED?style=for-the-badge" alt="Step 4"> | Click `Build Design System` after generating screens. Morph automatically extracts colors, typography, and component patterns into master variants. |
| **Step 5** | <img src="https://img.shields.io/badge/Step_5-Publish_Tokens-DB2777?style=for-the-badge" alt="Step 5"> | Export native Figma Variables and Text Styles directly to your Figma file. |

---

### Developer Workflow (IDE & Agent-Driven)

Developers can run Morph locally using their preferred AI coding assistant (Claude, Cursor, Copilot) with existing subscriptions, avoiding third-party API costs.

<p align="left">
  <img src="https://img.shields.io/badge/Feature-Zero_API_Fees-2563EB?style=for-the-badge" alt="Zero API Fees">
  <img src="https://img.shields.io/badge/Integrations-Claude_%2F_Cursor_%2F_Copilot-7C3AED?style=for-the-badge" alt="Integrations">
</p>

| Step | Action Tag | Instruction |
|---|---|---|
| **Step 1** | <img src="https://img.shields.io/badge/Step_1-Clone_%26_Install-2563EB?style=for-the-badge" alt="Step 1"> | Clone repository and install dependencies:<br>`git clone https://github.com/Anshul2021/Figma-Mcp.git`<br>`cd Figma-Mcp/FigmaPlugin && npm install` |
| **Step 2** | <img src="https://img.shields.io/badge/Step_2-Start_Bridge-059669?style=for-the-badge" alt="Step 2"> | Launch local Node bridge server:<br>`node server.js` |
| **Step 3** | <img src="https://img.shields.io/badge/Step_3-Orchestrate_Agent-D97706?style=for-the-badge" alt="Step 3"> | Use any coding assistant to execute commands against project directories without third-party API fees. |
| **Step 4** | <img src="https://img.shields.io/badge/Step_4-Realtime_Sync-7C3AED?style=for-the-badge" alt="Step 4"> | Generated scripts automatically sync to the Figma canvas in real-time via the local SSE bridge. |

---

## Supported Commands

Commands can be passed directly inside prompts or executed via AI coding agents.

| Command | Category Tag | Purpose |
|---|---|---|
| `@newproject <Name>` | <img src="https://img.shields.io/badge/Command-Scaffolding-2563EB?style=for-the-badge" alt="Scaffolding"> | Initializes project directory structure (`screens/`, `components/`, `tokens/`, `local/`). |
| `@brief <Description>` | <img src="https://img.shields.io/badge/Command-Context-4F46E5?style=for-the-badge" alt="Context"> | Defines product domain, target audience, and core features in `local/brief.md`. |
| `@gen-variables` | <img src="https://img.shields.io/badge/Command-Design_Tokens-059669?style=for-the-badge" alt="Tokens"> | Publishes native Figma color variables and text styles to the Figma file. |
| `@gen-components` | <img src="https://img.shields.io/badge/Command-Components-D97706?style=for-the-badge" alt="Components"> | Generates master reusable components inside `components/`. |
| `@use-components` | <img src="https://img.shields.io/badge/Command-Optimization-7C3AED?style=for-the-badge" alt="Optimization"> | Forces screen scripts to instantiate master components (`createInstance()`). |
| `@designsystem` | <img src="https://img.shields.io/badge/Command-Pipeline-DB2777?style=for-the-badge" alt="Pipeline"> | Runs full pipeline: token extraction, component set generation, and screen updates. |
| `@font <FontName>` | <img src="https://img.shields.io/badge/Command-Override-0284C7?style=for-the-badge" alt="Override"> | Overrides font family for the generation session. |
| `@color <Hex1>, <Hex2>` | <img src="https://img.shields.io/badge/Command-Override-0284C7?style=for-the-badge" alt="Override"> | Overrides brand primary and secondary color tokens. |
| `@taste <Description>` | <img src="https://img.shields.io/badge/Command-Styling-65A30D?style=for-the-badge" alt="Styling"> | Overrides visual styling attributes (radii, borders, shadows). |
| `@skip-autolayout` | <img src="https://img.shields.io/badge/Command-Fallback-DC2626?style=for-the-badge" alt="Fallback"> | Disables Auto Layout and uses absolute X/Y positioning. |
| `@skip-design-taste` | <img src="https://img.shields.io/badge/Command-Performance-4B5563?style=for-the-badge" alt="Performance"> | Bypasses extended design guidelines for minimal token generation. |

---

## MVP Notice & Troubleshooting

Morph is currently an **MVP**. Auto Layout generation is heavily optimized, but occasional layout edge cases may occur depending on prompt complexity.

<p align="left">
  <img src="https://img.shields.io/badge/Notice-MVP_Release-orange?style=for-the-badge" alt="MVP Notice">
</p>

| Issue | Quick Fix Tag | Action |
|---|---|---|
| **Auto Layout Collapse** | <img src="https://img.shields.io/badge/Fix-Use_%40skip--autolayout-DC2626?style=for-the-badge" alt="Skip Autolayout"> | Use `@skip-autolayout` to generate static absolute positioning, or manually adjust **Hug Contents** / **Fill Container** in Figma's right-hand Auto Layout panel. |
| **Cropped Canvas** | <img src="https://img.shields.io/badge/Fix-Ungroup_Frame_Once-2563EB?style=for-the-badge" alt="Ungroup Frame"> | If a generated frame is named **"Generated UI Screen"** and appears cropped, select the frame and **ungroup it once** (`Cmd + Shift + G` / `Ctrl + Shift + G`) to reveal the complete screen structure. |

---

## Technical Details & Architecture

### The Problem: Screenshot-Based AI Generation

Most Figma MCP tools rely on image analysis loops (*prompt → screenshot → analyze image → code → repeat*). Vision models consume thousands of tokens per iteration, add 30-60 seconds of latency per loop, and struggle to infer exact padding and alignment constraints from pixels.

<p align="left">
  <img src="https://img.shields.io/badge/Problem-High_Token_Cost-DC2626?style=for-the-badge" alt="High Token Cost">
  <img src="https://img.shields.io/badge/Problem-30--60s_Latency-D97706?style=for-the-badge" alt="High Latency">
  <img src="https://img.shields.io/badge/Problem-Imprecise_Bounds-4B5563?style=for-the-badge" alt="Imprecise Bounds">
</p>

---

### The Solution: Code-Driven Direct Execution

Morph eliminates image analysis by generating structured Figma API scripts directly. LLMs understand code far better than raw pixels. Colors, font sizes, paddings, and layout relationships are explicit in code, allowing the model to produce exact, Auto Layout-correct screens in 3-5 seconds with minimal token consumption.

<p align="left">
  <img src="https://img.shields.io/badge/Solution-Direct_Code_Synthesis-059669?style=for-the-badge" alt="Direct Code Synthesis">
  <img src="https://img.shields.io/badge/Solution-3--5s_Execution-2563EB?style=for-the-badge" alt="Fast Execution">
  <img src="https://img.shields.io/badge/Solution-Minimal_Tokens-7C3AED?style=for-the-badge" alt="Minimal Tokens">
</p>

---

### Technical Comparison

| Metric | Screenshot-Based Tools | Morph (Code-Driven) | Advantage Tag |
|---|---|---|---|
| **Input Format** | Heavy Pixel Images | Structured Code Scripts | <img src="https://img.shields.io/badge/Format-Code_Scripts-2563EB?style=for-the-badge" alt="Format"> |
| **Fidelity** | Estimated Pixel Bounds | Exact Auto Layout Constraints | <img src="https://img.shields.io/badge/Precision-Exact_Auto_Layout-059669?style=for-the-badge" alt="Precision"> |
| **Cost Efficiency** | High Cost Per Iteration | Minimal Token Usage | <img src="https://img.shields.io/badge/Cost-Minimal_Tokens-7C3AED?style=for-the-badge" alt="Cost"> |
| **Speed** | 30-60 Seconds Per Loop | 3-5 Seconds Direct Script Execution | <img src="https://img.shields.io/badge/Speed-3--5_Seconds-D97706?style=for-the-badge" alt="Speed"> |

---

### Model Optimization Notice

Morph is currently optimized for **Google Gemini Flash** models due to their high speed, large context windows, and strong compliance with structured script synthesis. Support for custom API keys (OpenAI, Anthropic, and local LLMs) will be introduced in future releases.

<p align="left">
  <img src="https://img.shields.io/badge/Current-Google_Gemini-4285F4?style=for-the-badge&logo=google" alt="Current">
  <img src="https://img.shields.io/badge/Future-OpenAI_%2F_Custom_APIs-000000?style=for-the-badge&logo=openai" alt="Future">
</p>

---

### System Architecture

```mermaid
flowchart TD
    subgraph FigmaClient["Figma Desktop Plugin"]
        UI["plugin/ui.html"] <--> CODE["plugin/code.js"]
        CODE <--> CANVAS["Figma Canvas"]
    end

    subgraph NodeServer["Local Bridge / Vercel Cloud"]
        SERVER["server.js / API Endpoints"]
        ENGINE["engine/ Core Logic"]
        CORE["core/ Rules Protocols"]
        GLOBAL["global/ Default Templates"]
        SKILLS[".agents/skills/ Design Skills"]
        PROJECTS["<Project_Name>/ Workspace"]
    end

    UI <-->|HTTP / SSE Watch| SERVER
    SERVER --> ENGINE
    ENGINE --> CORE
    ENGINE --> GLOBAL
    ENGINE --> SKILLS
    ENGINE --> PROJECTS
```

---

### Core Execution Protocols (`core/`)

When a generation request is initialized, the system prompt builder reads the core protocol directives:

| File | Protocol Tag | Purpose |
|---|---|---|
| [`core/command.md`](file:///Users/fwcuser/Desktop/Figma-Mcp/FigmaPlugin/core/command.md) | <img src="https://img.shields.io/badge/Protocol-Commands-2563EB?style=for-the-badge" alt="Commands"> | Command syntax resolution and priority execution logic. |
| [`core/instruction.md`](file:///Users/fwcuser/Desktop/Figma-Mcp/FigmaPlugin/core/instruction.md) | <img src="https://img.shields.io/badge/Protocol-Rules-059669?style=for-the-badge" alt="Rules"> | Core screen generation rules, vector icon loading protocols, and typography scaling constraints. |
| [`core/autolayout.md`](file:///Users/fwcuser/Desktop/Figma-Mcp/FigmaPlugin/core/autolayout.md) | <img src="https://img.shields.io/badge/Protocol-AutoLayout-D97706?style=for-the-badge" alt="AutoLayout"> | Mandatory Auto Layout construction order and anti-pattern prevention. |
| [`core/component.md`](file:///Users/fwcuser/Desktop/Figma-Mcp/FigmaPlugin/core/component.md) | <img src="https://img.shields.io/badge/Protocol-Components-7C3AED?style=for-the-badge" alt="Components"> | Master component set creation and instance reuse guidelines. |
| [`core/variables.md`](file:///Users/fwcuser/Desktop/Figma-Mcp/FigmaPlugin/core/variables.md) | <img src="https://img.shields.io/badge/Protocol-Variables-DB2777?style=for-the-badge" alt="Variables"> | Native Figma Variables and Local Text Styles publishing protocol. |

---

### Supporting Directories

- **Default Context Templates (`global/`):** Contains baseline reference files (`brief.md`, `colors.md`, `fonts.md`, `taste.md`) copied into each project's `local/` directory upon initialization.
- **AI Skill Registry (`.agents/skills/`):** Domain design skills (`frontend-design`, `design-taste-frontend`, `ui-design-system`, `figma-screen-generator`) automatically injected into prompt context during screen and component generation.
- **Backend Implementation (`engine/`):** Underlying Node.js execution logic for API requests, Gemini model integration, storage management, and rate limiting.

---

### Cloud Deployment (Supabase Storage)

Morph's serverless backend persists projects, screens, and users in **Supabase Storage**.

1. **Create Supabase Project & Bucket:** Create a project at [supabase.com](https://supabase.com) and create a private bucket named `morph`.
2. **Configure Keys:** Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel project environment variables.
3. **Database Schema:** Execute `FigmaPlugin/supabase/schema.sql` in Supabase SQL editor to enable the `users` table and rate-limiting function.

---

### Summary

Morph is a lightweight, high-speed UI generation architecture that bridges natural language prompts directly to native Figma Auto Layout canvas elements. By shifting from image-based vision analysis to direct script synthesis, Morph delivers faster generation times, lower token costs, and extensible workflows for both designers and developers.