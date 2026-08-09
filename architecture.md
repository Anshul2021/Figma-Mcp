# FrameForge — Repository Architecture

```
Figma-Mcp/
├── AGENTS.md                             Master AI Directive (IDE workflow)
├── README.md                             Setup guide & user documentation
├── architecture.md                       This file
├── example.md                            Prompt examples for both workflows
│
├── .agents/skills/                       AI Skill Registry (IDE workflow)
│   ├── frontend-design/                  Anti-slop visual direction skill
│   ├── design-taste-frontend/            Editorial craft & micro-padding skill
│   ├── ui-design-system/                 Component tokens & accessibility skill
│   └── figma-screen-generator/           Auto Layout execution & bridge skill
│
└── FigmaPlugin/                          Primary workspace
    ├── server.js                         API backend (auth, CRUD, generation, SSE)
    ├── package.json                      Node.js dependencies
    ├── .env.example                      Environment variable template
    ├── .gitignore                        Git ignore rules
    │
    ├── engine/                           AI Generation Engine
    │   ├── prompt-builder.js             System prompt construction
    │   ├── gemini-client.js              Gemini API client wrapper
    │   └── project-manager.js            Project scaffolding & config CRUD
    │
    ├── plugin/                           Figma Plugin Client
    │   ├── manifest.json                 Plugin manifest (FrameForge)
    │   ├── code.js                       Main thread (script execution)
    │   └── ui.html                       Multi-view plugin UI
    │
    ├── core/                             Immutable Engine Protocols
    │   ├── command.md                    Command syntax reference
    │   ├── instruction.md                Core generation rules & icon protocol
    │   ├── autolayout.md                 Auto Layout execution protocol
    │   ├── component.md                  Component variant architecture
    │   └── variables.md                  Native variable publishing rules
    │
    ├── global/                           Default context templates
    │   ├── fonts.md                      Default font scale
    │   ├── colors.md                     Default color tokens
    │   ├── taste.md                      Default visual styling
    │   └── brief.md                      Default app brief
    │
    └── <ProjectName>/                    User project directories
        ├── screens/                      Generated screen scripts (.js)
        ├── components/                   Master component sets (.js)
        ├── tokens/                       Variable & style scripts (.js)
        └── local/                        Project-specific config overrides
            ├── brief.md
            ├── colors.md
            ├── fonts.md
            └── taste.md
```

## Data Flow

```
Plugin UI (ui.html)
    │
    ├── POST /api/generate/screen ──→ server.js
    │                                     │
    │                                     ├── prompt-builder.js
    │                                     │   (reads core/*.md + local/*.md + skills)
    │                                     │
    │                                     ├── gemini-client.js
    │                                     │   (sends to Gemini API → receives .js code)
    │                                     │
    │                                     └── Writes .js to <Project>/screens/
    │                                            │
    │   SSE auto-sync ←─────────────────────────┘
    │
    ├── Fetches script from /api/scripts/
    │
    └── eval() in Figma sandbox → Canvas rendered
```