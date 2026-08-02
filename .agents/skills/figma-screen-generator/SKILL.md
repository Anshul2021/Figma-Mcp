---
name: figma-screen-generator
description: Generate production-quality UI screen scripts for Figma canvas using natural language prompts, supporting project scaffolding (@newproject), Auto Layout protocols, DM Sans typography, vector Lucide icons, and real-time SSE bridge server auto-sync.
---

# Figma Screen Generator Skill

> Use this skill whenever the user asks to generate UI screens, create new projects, edit screens, or manage Figma plugin workflows.

## Workflows & Commands

### 1. Project Creation (`@newproject <ProjectName>`)
When the user prompts `@newproject <ProjectName>` or asks to start a new project:
- Instantly create the project directory tree:
  - `FigmaPlugin/<ProjectName>/screens/`
  - `FigmaPlugin/<ProjectName>/local/`
- Copy default global context templates from `FigmaPlugin/global/` (`taste.md`, `colors.md`, `fonts.md`, `brief.md`) into `FigmaPlugin/<ProjectName>/local/`.
- Inform the user cleanly that the project is scaffolded and ready for screen prompts.
- **DO NOT ask clarifying or unnecessary questions.**

### 2. Screen Generation (`<ProjectName>/screens/<screen_name>.js`)
When generating UI screens for a project:
1. Load font family (`DM Sans` by default) via `await figma.loadFontAsync()`.
2. Apply design system tokens from project `local/` or `global/`.
3. Follow the Auto Layout Execution Order Protocol from `FigmaPlugin/core/autolayout.md`.
4. Ensure all text font sizes are strict EVEN numbers (`10`, `12`, `14`, `16`, `20`, `24`, `32`).
5. Use vector Lucide icons (`strokeWidth = 1.5`) with safe `res.ok` validation. Zero emojis.
6. Write the resulting JavaScript script to `FigmaPlugin/<Project_Name>/screens/<screen_name>.js`.
7. `server.js` auto-syncs the file over SSE to the Figma plugin. Do NOT run terminal `curl` commands.

### 3. Absolute Positioning & Parent Appending Rules
- Call `parentFrame.appendChild(child)` BEFORE setting `child.layoutPositioning = "ABSOLUTE"`.
- Append sub-container frames (`scrollArea`, `gridRow`, `card`) to their parent immediately upon creation to prevent floating orphan frames.
