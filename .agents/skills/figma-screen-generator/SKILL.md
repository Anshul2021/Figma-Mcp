---
name: figma-screen-generator
description: Generate production-quality UI screen scripts, reusable master components, and native Figma Variables for Figma canvas using natural language prompts, supporting @newproject, @gen-variables, @gen-components, @use-components, @skip-design-taste, Auto Layout protocols, even typography scale, vector Lucide icons, and real-time SSE bridge server auto-sync.
---

# Figma Screen Generator Skill

> Use this skill whenever the user asks to generate UI screens, create new projects, generate master components, publish Figma variables, or manage Figma plugin workflows.

## Workflows & Commands

### 1. Project Creation (`@newproject <ProjectName>`)
When the user prompts `@newproject <ProjectName>` or asks to start a new project:
- Instantly create the project directory tree:
  - `FigmaPlugin/<ProjectName>/screens/`
  - `FigmaPlugin/<ProjectName>/components/`
  - `FigmaPlugin/<ProjectName>/tokens/`
  - `FigmaPlugin/<ProjectName>/local/`
- Copy default global context templates from `FigmaPlugin/global/` (`taste.md`, `colors.md`, `fonts.md`, `brief.md`) into `FigmaPlugin/<ProjectName>/local/`.
- Inform the user cleanly that the project is scaffolded and ready for prompts. **DO NOT ask clarifying questions.**

### 2. Variables & Tokens Publishing (`@gen-variables`)
- Write token publisher script to `FigmaPlugin/<Project_Name>/tokens/variables.js`.
- Use `figma.variables.createVariableCollection()` and `figma.variables.createVariable()` to push native Figma Variables.

### 3. Master Components Generation & Reuse (`@gen-components` / `@use-components`)
- **`@gen-components`**: Write reusable component script to `FigmaPlugin/<Project_Name>/components/<ComponentName>.js` using `figma.createComponent()`.
- **`@use-components`**: Inspect `FigmaPlugin/<Project_Name>/components/` and instantiate existing master components via `componentNode.createInstance()` instead of generating inline frames from scratch.

### 4. Screen Generation Pipeline (MANDATORY DEFAULT DESIGN TASTE)
When generating UI screens for a project (`<ProjectName>/screens/<screen_name>.js`):
1. **DEFAULT BEHAVIOR**: Automatically load and apply `frontend-design` and `design-taste-frontend` rules (Slate text scale `#0F172A`/`#334155`/`#64748B`, micro-padding `16-24px`, subtle 1px inner borders `#E5E7EB`, radii hierarchy).
2. **Override Command (`@skip-design-taste`)**: If explicitly typed by the user, bypass visual taste guardrails for ultra-fast generation and minimal token usage.
3. **Component Reuse (`@use-components`)**: If active, instantiate master components from `components/` via `createInstance()`.
4. **Typography & Icons**: Ensure all font sizes are strict EVEN numbers (`10`, `12`, `14`, `16`, `20`, `24`, `32`). Zero emojis, vector Lucide icons (`strokeWidth = 1.5`).
5. **Auto Layout Protocol**: Follow order from `FigmaPlugin/core/autolayout.md`.
6. Write JavaScript script to `FigmaPlugin/<Project_Name>/screens/<screen_name>.js`. `server.js` auto-syncs over SSE. Do NOT run terminal `curl` commands.

### 5. Absolute Positioning & Parent Appending Rules
- Call `parentFrame.appendChild(child)` BEFORE setting `child.layoutPositioning = "ABSOLUTE"`.
- Append sub-container frames (`scrollArea`, `gridRow`, `card`) to their parent immediately upon creation to prevent floating orphan frames.
