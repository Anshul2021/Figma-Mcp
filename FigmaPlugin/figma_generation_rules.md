# Figma Generation Rules — General Instructions

> This document contains general design system rules for generated Figma scripts.
> For Auto Layout rules, see **[figma_autolayout_rules.md](./figma_autolayout_rules.md)**.

---

## 1. Commands

Commands are special keywords that users can include in their prompts to modify generation behavior.

### `@skip-autolayout`

By **default**, Auto Layout is **always enabled** — every generated screen uses proper Auto Layout frames (layoutMode, spacing, padding, sizing modes) as documented in `figma_autolayout_rules.md`.

If the user's prompt contains **`@skip-autolayout`**, the generated script must:
- **NOT** set `layoutMode` on any frame
- **NOT** use `primaryAxisSizingMode`, `counterAxisSizingMode`, `itemSpacing`, `layoutAlign`, `layoutGrow`, `layoutSizingHorizontal`, or `layoutSizingVertical`
- **NOT** include the Auto Layout helper functions (`makeSpaceBetweenRow`, `makeHugContainer`, `makeContentCard`, `finalizeHugHeight`, etc.)
- **Instead**, use explicit `x` and `y` coordinates for all positioning
- **Instead**, use explicit `resize(width, height)` for all sizing

**Detection logic** (for the generation pipeline):
```javascript
const skipAutoLayout = prompt.toLowerCase().includes("@skip-autolayout");
```

---

## 2. Iconography Protocol (Lucide & Vector SVG CDN)

- **🚫 STRICT ZERO EMOJI RULE**: NEVER put emojis inside text nodes, buttons, headers, or badges (e.g., NO 🍕, 🌐, 🍎, 🥕, 🟢, ✨, 🚗, ✈️). Emojis render inconsistently and look unprofessional in Figma design systems.
- **ALWAYS use Vector SVG Icons**: For all UI controls, brand logos (Google, Apple, etc.), and category indicators, use real SVG vector nodes via `figma.createNodeFromSvg(svgText)`.
- **Primary Source**: Fetch dynamically from official Lucide CDN (`https://unpkg.com/lucide-static@latest/icons/${iconName}.svg`).
- **Brand & Specialty Vector Fallbacks**: Maintain clean SVG strings in an `EMBEDDED_SVGS` dictionary (e.g., Google `g-logo` SVG, Apple `apple-logo` SVG, Globe, Carrot, etc.) so every icon is rendered as a clean, scalable vector layer.

```javascript
// Example Embedded Vector Dictionary for Social & Brand Icons
const EMBEDDED_SVGS = {
  "google": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>`,
  "apple": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#000000"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.72c.64-.78 1.08-1.86.96-2.95-.93.04-2.08.62-2.74 1.4-.59.68-1.11 1.78-.97 2.84 1.05.08 2.13-.52 2.75-1.29z"/></svg>`
};
```

---

## 3. Online Image Fills Protocol (`figma.createImageAsync`)

Use `await figma.createImageAsync(imageUrl)` to fetch real images (Unsplash, Google Images, CDNs) for album artwork, user avatars, food photos, and hero banners.

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
    console.warn(`[Image Load Notice] ${imageUrl}:`, err);
    frameNode.fills = [{ type: 'SOLID', color: { r: 0.15, g: 0.15, b: 0.15 } }];
  }
}
```

---

## 4. Typography & 4pt Grid Fundamentals

### 🔤 Mandatory Font Family (Poppins)
- Always pre-load `Poppins` styles asynchronously before setting `.characters`:
  ```javascript
  await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
  await figma.loadFontAsync({ family: "Poppins", style: "Medium" });
  await figma.loadFontAsync({ family: "Poppins", style: "Bold" });
  ```

### 📐 4pt Grid Scale
- **Paddings & Spacing**: `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`.
- **Typography Scale**:
  - `10px - 12px`: Captions, badges, tags.
  - `14px`: Body text, input placeholder, button labels.
  - `16px`: Sub-headers, card titles.
  - `20px - 24px`: Section headers.
  - `28px - 36px`: Hero headlines.

---

## 5. Figma API Execution Rules

1. **Active Page Context**: Reference `figma.currentPage` directly.
2. **Container Frame**: Group generated screens into a root frame named `"Generated UI Screens"`.
3. **Automatic Cleanup**: Remove previous `"Generated UI Screens"` board before creating new frames.
4. **Viewport Focus**: Focus viewport via `figma.viewport.scrollAndZoomIntoView([container])`.
5. **Structural Containers**: Layout-only frames (rows, groups, wrappers) MUST set `fills = []` (transparent).
6. **Async Wrapper**: All generated scripts MUST be wrapped in `(async function(figma) { ... })(figma);`.
