---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces and UI designs with high aesthetic quality, avoiding generic AI templates ("AI slop") by establishing visual tone, intentional typography, color harmony, and micro-padding before code generation.
---

# Frontend Design Skill

> Official Anthropic Design Directive: Move beyond generic, safe AI code templates. Establish aesthetic direction, distinct visual choices, and intentional layout hierarchy.

## 🎯 Design Directives

### 1. Establish Aesthetic Direction First
Before generating any UI component or screen, establish a clear visual identity:
- **Tone**: Purpose-driven (e.g. "Bold & High-Contrast Enterprise B2B", "Minimalist Editorial", "Sleek Dark Mode", "Crisp Clean FinTech").
- **Visual Personality**: Tailored font choices, deliberate spacing density, and curated color scales.

### 2. Avoid "AI Slop" Anti-Patterns
- ❌ **NO Generic Purple Gradients**: Avoid default purple-to-indigo radial or linear gradients.
- ❌ **NO Flat Gray Boxes Without Borders**: Avoid plain uniform gray background boxes. Use `#FFFFFF` cards over soft `#F8FAFC` backgrounds with 1px subtle borders (`#E5E7EB`).
- ❌ **NO Centered Card Monoliths**: Use structured multi-column grids, asymmetrical heroes, and distinct visual hierarchy.
- ❌ **NO Emojis as Icons**: Use lightweight vector SVG icons (`strokeWidth = 1.5`).

### 3. Typography & Spacing Rules
- **Font Scale**: Strict EVEN numbers (`10`, `12`, `14`, `16`, `20`, `24`, `32`).
- **Contrast**: High-contrast Slate text hierarchy (`#0F172A` headings, `#334155` body, `#64748B` captions).
- **Padding**: Micro-padding (`16px-24px`) inside cards, clear section margins (`20px-32px`).
