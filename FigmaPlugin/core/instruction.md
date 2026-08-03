# Core Instructions — Figma Script Generation Rules

> These are immutable system rules that every generated Figma script MUST follow.
> For Auto Layout specifics, see [autolayout.md](./autolayout.md).
> For user commands, see [command.md](./command.md).

---

## 1. Iconography Protocol (Zero Emoji, Vector Only)

### Strict Zero Emoji Rule
**NEVER** place emojis inside text nodes, buttons, headers, badges, or any other Figma element. This includes but is not limited to: food emojis, flags, symbols, arrows, checkmarks, and decorative emojis. Emojis render inconsistently across platforms and look unprofessional in design systems.

### Vector SVG Icons
For all UI controls, indicators, brand logos, and category icons, use real SVG vector nodes via `figma.createNodeFromSvg(svgText)`.

**Primary Source — Lucide CDN (Lightweight 1.5px Stroke Width Rule):**
```javascript
async function loadLucideIcon(iconName, size = 20, color = { r: 0, g: 0, b: 0 }, strokeWidth = 1.5) {
  try {
    const res = await fetch(`https://unpkg.com/lucide-static@latest/icons/${iconName}.svg`);
    if (!res.ok) {
      return createFallbackIcon(size, color, strokeWidth);
    }
    let svgText = await res.text();
    if (!svgText || !svgText.includes("<svg")) {
      return createFallbackIcon(size, color, strokeWidth);
    }
    
    // Replace default stroke-width="2" with refined lightweight strokeWidth (default 1.5)
    svgText = svgText.replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`);

    const node = figma.createNodeFromSvg(svgText);
    node.resize(size, size);
    node.name = `Icon / ${iconName}`;

    // Apply color and refined stroke weight to all vector child nodes
    const vectors = node.findAll(n => n.type === 'VECTOR');
    vectors.forEach(v => {
      v.strokes = [{ type: 'SOLID', color }];
      v.strokeWeight = strokeWidth;
    });

    return node;
  } catch (err) {
    console.warn(`[Icon] Failed to load: ${iconName}`, err);
    return createFallbackIcon(size, color, strokeWidth);
  }
}
```

**Fallback Icon (when Lucide fails):**
```javascript
function createFallbackIcon(size = 20, color = { r: 0, g: 0, b: 0 }, strokeWidth = 1.5) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
  const node = figma.createNodeFromSvg(svg);
  node.resize(size, size);
  node.name = "Icon / fallback";
  const vectors = node.findAll(n => n.type === 'VECTOR');
  vectors.forEach(v => {
    v.strokes = [{ type: 'SOLID', color }];
    v.strokeWeight = strokeWidth;
  });
  return node;
}
```

---

## 2. Immediate Parent Appending Rule (Prevent Floating Orphan Frames)

**STRICT RULE:** Whenever you create a container or sub-section frame (e.g. `scrollArea`, `card`, `gridRow`), append it to its parent **IMMEDIATELY** after creation.

```javascript
// ❌ WRONG — Appending parent at the very end of script
const scrollArea = figma.createFrame();
// ... 200 lines of complex nested frame creation ...
// If any icon or async call throws an error above, scrollArea & all its children
// remain stranded as floating orphan frames on figma.currentPage!
screen.appendChild(scrollArea);

// ✅ CORRECT — Append to parent IMMEDIATELY upon creation
const scrollArea = figma.createFrame();
screen.appendChild(scrollArea); // Locked safely inside screen immediately!
// ... now build children inside scrollArea ...
```

**Brand & Specialty SVGs (Embedded Dictionary):**
For brand logos (Google, Apple, Facebook, etc.) and specialty icons not in Lucide, maintain clean SVG strings in an `EMBEDDED_SVGS` dictionary:

```javascript
const EMBEDDED_SVGS = {
  "google": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>`,
  "apple": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#000000"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.72c.64-.78 1.08-1.86.96-2.95-.93.04-2.08.62-2.74 1.4-.59.68-1.11 1.78-.97 2.84 1.05.08 2.13-.52 2.75-1.29z"/></svg>`
};
```

---

## 2. Online Image Fills Protocol

Use `figma.createImageAsync()` for real photographs — album art, user avatars, food photos, hero banners, map backgrounds, etc.

```javascript
async function applyOnlineImage(frameNode, imageUrl) {
  try {
    const image = await figma.createImageAsync(imageUrl);
    frameNode.fills = [{
      type: 'IMAGE',
      scaleMode: 'FILL',
      imageHash: image.hash
    }];
  } catch (err) {
    console.warn(`[Image Load] ${imageUrl}:`, err);
    // Graceful fallback — neutral gray fill
    frameNode.fills = [{ type: 'SOLID', color: { r: 0.15, g: 0.15, b: 0.15 } }];
  }
}
```

---

## 3. 8pt Grid Spacing System

All spacing, padding, and sizing values MUST align to the 8pt grid (with 4pt as the minimum unit).

### Spacing Scale
`4px` · `8px` · `12px` · `16px` · `20px` · `24px` · `32px` · `40px` · `48px` · `56px` · `64px`

### Typography Scale

| Token | Size | Weight | Use Case |
|:------|:-----|:-------|:---------|
| Caption | 10–12px | Regular | Badges, tags, timestamps, meta labels |
| Body | 14px | Regular | Body text, input placeholders, button labels |
| Subhead | 16px | Medium | Sub-headers, card titles |
| Section | 20–24px | Bold | Section headers |
| Hero | 28–36px | Bold | Hero headlines, large numbers |

> Note: Actual font family comes from `global/fonts.md` or `<Project>/local/fonts.md`.

---

## 4. Figma API Execution Rules

1. **Active Page**: Reference `figma.currentPage` directly. Never create new pages.
2. **Container Frame**: Group all generated screens into a root frame named `"Generated UI Screens"`.
3. **Automatic Cleanup**: Always remove the previous `"Generated UI Screens"` board before creating new frames.
4. **Viewport Focus**: After generation, call `figma.viewport.scrollAndZoomIntoView([container])`.
5. **Structural Containers**: Layout-only frames (rows, groups, wrappers) MUST have `fills = []` (fully transparent).
6. **Async Wrapper**: All generated scripts MUST be wrapped in `(async function(figma) { ... })(figma);`.
7. **Font Loading**: Always `await figma.loadFontAsync()` for every font family + style BEFORE setting `.characters` on any text node.

---

## 5. Frame Naming Convention

Every frame MUST have a meaningful, descriptive name. Never use default names like `Frame 1` or `Rectangle 1`.

| Element | Naming Pattern | Example |
|:--------|:--------------|:--------|
| Screen | `Screen / <Name>` | `Screen / Home Dashboard` |
| Header | `Header / <Context>` | `Header / Top Bar` |
| Card | `Card / <Content>` | `Card / Flight Details` |
| Row | `Row / <Purpose>` | `Row / Price Summary` |
| Icon | `Icon / <name>` | `Icon / arrow-left` |
| Button | `Button / <Label>` | `Button / Confirm Booking` |
| Nav | `Nav / <Type>` | `Nav / Bottom Tab Bar` |
| Text | Figma auto-names from `.characters` | (no override needed) |

---

## 6. No Hallucination Rule

Never guess or invent values for:
- **Colors**: Always use tokens from `colors.md` (local → global fallback)
- **Fonts**: Always use fonts defined in `fonts.md` (local → global fallback)
- **Styling**: Always follow `taste.md` preferences (local → global fallback)
- **Sizing**: Always follow the 8pt grid scale

If a value is not defined in any config file, use the global defaults. Never make up hex codes or arbitrary sizes.

---

## 7. Color Utility

Standard helper for converting hex strings to Figma RGB:

```javascript
function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(ch => ch + ch).join('');
  const num = parseInt(c, 16);
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255
  };
}
```

---

## 8. High-End Design Taste & Component-First Architecture Rules

### Mandatory Default Visual Taste & Anti-Slop Directive
> **CRITICAL DEFAULT RULE:** Every screen generation MUST automatically apply frontend design and visual taste rules to prevent AI-slop outputs. Only skip when `@skip-design-taste` is explicitly typed by the user.

- **Distinct Visual Hierarchy**: Avoid generic "AI-purple" or flat 2015 gradients. Use curated brand palettes, high-contrast Slate text scale (`#0F172A` Headings, `#334155` Body, `#64748B` Muted Captions), and clean surfaces (`#FFFFFF` pure cards on `#F8FAFC` slate canvas).
- **Refined Borders & Radii Hierarchy**: Use subtle 1px inner borders (`#E5E7EB` or `#F1F5F9`) and consistent design system radii (`radius-xs`: 4px, `radius-sm`: 6px, `radius-md`: 8px, `radius-lg`: 12px, `radius-xl`: 16px).
- **Generous Micro-Padding**: Ensure cards have comfortable inner padding (`16px-24px`) and clear section gaps (`16px-24px`).
- **Iconography & Typography**: Strict EVEN typography scale (`10`, `12`, `14`, `16`, `20`, `24`, `32`). Zero emojis, lightweight Lucide vector SVG icons (`strokeWidth = 1.5`).

### Component-First Lookup Order (when `@use-components` active)
1. Inspect `FigmaPlugin/<Project_Name>/components/` for master reusable components (`Button`, `Card`, `Badge`, `Input`).
2. Instantiate master components via `componentNode.createInstance()`.
3. Append instances to parent frames BEFORE setting layout properties.

---

## 9. Mandatory Design System 3-Pillars Protocol & Skill Reference

Whenever the user asks to generate a **Design System** or **Component Library**:

1. **AUTOMATIC SKILL REFERENCE**:
   - The AI MUST read and adhere to `.agents/skills/ui-design-system/SKILL.md` and `.agents/skills/ui-design-system/references/component-architecture.md`.
2. **THE 3 MANDATORY PILLARS (MUST ALWAYS BE PRESENT)**:
   - 🎨 **Pillar 1: Color Token Scale System**: Render color swatches for Brand Primary, Primary Light, Slate Text Scale (`#0F172A`, `#334155`, `#64748B`, `#94A3B8`, `#E5E7EB`, `#F8FAFC`, `#FFFFFF`), and Semantic Statuses (Emerald, Amber, Red, Blue).
   - 🔤 **Pillar 2: Typography Scale System**: Render typography specimens for strict EVEN scale (`Display 32`, `Title 24`, `Header 20`, `Subhead 16`, `Body 14`, `Caption 12`, `Micro 10`).
   - 🧩 **Pillar 3: ComponentSets with Interactive States**: Create native `ComponentSetNode` objects via `figma.combineAsVariants()` for Buttons, Inputs, Badges, Checkboxes/Radios, and Cards with full variant states (`Default`, `Hover`, `Active`, `Disabled`, `Focused`, `Error`).
3. **COMPONENTSET AUTO LAYOUT RULE**:
   - Every `ComponentSetNode` created via `figma.combineAsVariants()` MUST have `layoutMode = "HORIZONTAL"` with `itemSpacing = 16` and padding applied so variants NEVER stack or overlap on top of each other.



