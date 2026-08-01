# Figma Generation Rules & Auto Layout Master Protocol

This document is the single source of truth for generating clean, professional, non-overlapping UI screens using **Figma Auto Layout API**.

---

## 1. Figma Auto Layout Master Protocol

### 📐 Pure Auto Layout Hierarchy (Zero Manual X/Y Scatter)
- **NEVER set manual `x` or `y` coordinates** on children inside Auto Layout frames.
- **ALWAYS rely on Figma's native Auto Layout engine** (`layoutMode`, `itemSpacing`, `padding*`, `layoutAlign`, `layoutGrow`).

### 🛠️ Standard Auto Layout Creation Pattern
Follow this exact sequence when building ANY container or screen:

```javascript
// 1. Create Frame & Name It
const card = figma.createFrame();
card.name = "Section Card";

// 2. Set Layout Mode FIRST ("VERTICAL" or "HORIZONTAL")
card.layoutMode = "VERTICAL";

// 3. Set Paddings & Spacing (4pt Grid)
card.itemSpacing = 12;        // Gap between stacked children
card.paddingLeft = 16;
card.paddingRight = 16;
card.paddingTop = 16;
card.paddingBottom = 16;

// 4. Set Sizing Modes & Resizing
// Primary Axis ("AUTO" = Hug Content, "FIXED" = Fixed Dimension)
card.primaryAxisSizingMode = "AUTO";    // Hugs vertical height
card.counterAxisSizingMode = "FIXED";   // Fixed horizontal width
card.resize(335, 100);                  // Width fixed to 335px

// 5. Alignments
card.primaryAxisAlignItems = "MIN";     // MIN | CENTER | MAX | SPACE_BETWEEN
card.counterAxisAlignItems = "MIN";     // MIN | CENTER | MAX | STRETCH

// 6. Append Children (NO MANUAL x/y SETTINGS!)
card.appendChild(titleNode);
card.appendChild(descriptionNode);

// 7. Child Alignment & Stretching
titleNode.layoutAlign = "STRETCH";       // Fills container width horizontally
descriptionNode.layoutAlign = "STRETCH"; // Fills container width horizontally
```

### ↔️ Horizontal Auto Layout Rows (Buttons, Info Tags, Navbar)
```javascript
const row = figma.createFrame();
row.name = "Info Row";
row.layoutMode = "HORIZONTAL";
row.primaryAxisSizingMode = "FIXED";
row.counterAxisSizingMode = "AUTO";     // Hugs height
row.primaryAxisAlignItems = "SPACE_BETWEEN"; // Pushes left & right items apart
row.counterAxisAlignItems = "CENTER";   // Vertically aligns icon + text
row.resize(335, 40);
row.itemSpacing = 8;
```

---

## 2. Iconography Protocol (Online Lucide CDN + Auto Layout)

### ⚡ Vector Icon Insertion in Auto Layout
- Fetch icons via `fetch()` CDN and create nodes with `figma.createNodeFromSvg(svgText)`.
- When appending an icon node to an Auto Layout frame:
  - Do **NOT** set `iconNode.x` or `iconNode.y`.
  - Resize with `iconNode.resize(size, size)`.
  - Append directly to the parent Auto Layout row/column.

```javascript
async function loadLucideIcon(iconName, size = 20, colorHex = "#FF6B00") {
  try {
    const url = `https://unpkg.com/lucide-static@latest/icons/${iconName}.svg`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    let svgText = await res.text();
    if (colorHex) {
      svgText = svgText.replace(/stroke="currentColor"/g, `stroke="${colorHex}"`)
                       .replace(/fill="currentColor"/g, `fill="${colorHex}"`);
    }
    const iconNode = figma.createNodeFromSvg(svgText);
    iconNode.name = `Lucide / ${iconName}`;
    iconNode.resize(size, size);
    return iconNode;
  } catch (err) {
    console.warn(`[Icon Loader Error] ${iconName}:`, err);
    return null;
  }
}
```

---

## 3. Typography & 4pt Grid Fundamentals

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

## 4. Full Screen Root Structure (Pure Auto Layout)

```javascript
// Screen Root Frame (Vertical Auto Layout)
const screen = figma.createFrame();
screen.name = "Mobile Screen - Full Auto Layout";
screen.layoutMode = "VERTICAL";
screen.primaryAxisSizingMode = "FIXED";   // Fixed Height: 812px
screen.counterAxisSizingMode = "FIXED";   // Fixed Width: 375px
screen.resize(375, 812);
screen.itemSpacing = 16;                  // Gap between sections
screen.paddingLeft = 20; screen.paddingRight = 20;
screen.paddingTop = 24; screen.paddingBottom = 20;

// All top-level sections (Header, Banner, Cards, Bottom Bar) are appended sequentially!
screen.appendChild(headerRow);
screen.appendChild(searchRow);
screen.appendChild(bannerCard);
screen.appendChild(itemsSection);
screen.appendChild(bottomBtn);
```

---

## 5. Figma API Execution Rules

1. **Active Page Context**: Reference `figma.currentPage` directly.
2. **Container Frame**: Group generated screens into a root frame named `"Generated UI Screens"`.
3. **Automatic Cleanup**: Remove previous `"Generated UI Screens"` board before creating new frames.
4. **Viewport Focus**: Focus viewport via `figma.viewport.scrollAndZoomIntoView([container])`.
