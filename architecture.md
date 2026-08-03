Figma-Mcp/                                   📁 Root Folder
│
├── .agents/skills/                           📁 Workspace AI Skill Registry
│   ├── frontend-design/                      📄 Anti-Slop Visual Direction & Tone Skill
│   ├── design-taste-frontend/                📄 Editorial Craft, Micro-Paddings & Subtle Borders Skill
│   ├── ui-design-system/                     📄 Component States, Tokens & Accessibility Skill
│   └── figma-screen-generator/               📄 Auto Layout Execution & Plugin Bridge Skill
│
├── FigmaPlugin/                              📁 Primary Plugin Workspace
│   ├── plugin/                               📁 Figma Plugin Client (manifest.json, code.js, ui.html)
│   ├── server.js                             📜 Local Bridge Server (Port 3003, SSE Watcher)
│   │
│   ├── core/                                 📁 (Immutable System Protocols)
│   │   ├── command.md                        📄 Command syntax & priority resolution
│   │   ├── instruction.md                    📄 Core generation rules & icon protocols
│   │   ├── autolayout.md                     📄 Auto Layout execution protocol & anti-patterns
│   │   ├── component.md                      📄 Master component creation & instance reuse protocol
│   │   └── variables.md                      📄 Native Figma Variables & Local Styles publishing protocol
│   │
│   ├── global/                               📁 (Default Global Context Templates)
│   │   ├── fonts.md                          📄 Font scale (DM Sans / Instrument Sans)
│   │   ├── colors.md                         📄 Color tokens
│   │   ├── taste.md                          📄 Visual styling & radii
│   │   └── brief.md                          📄 App brief template
│   │
│   └── <Project_Name>/                       📁 (Dynamic User Project Directories)
│       ├── screens/                          📁 Screen Scripts (<screen_name>.js)
│       ├── components/                       📁 Master Reusable Components Library (<ComponentName>.js)
│       ├── tokens/                           📁 Native Figma Variables Generator (variables.js, styles.js)
│       └── local/                            📁 Project Local Overrides (fonts, colors, taste, brief)