# Figma Auto Layout Rules — Definitive API Reference

> This document is the **single source of truth** for all Auto Layout behavior in generated Figma scripts.
> Every generated script MUST follow these rules to produce pixel-perfect, non-overlapping layouts.

---

## 1. The Execution Order Protocol (MANDATORY)

Every Auto Layout frame MUST be built following this **exact sequence**. Violating the order causes silent bugs.

```
┌──────────────────────────────────────────────────────────────────┐
│  STEP 1: Create the frame                                        │
│          const frame = figma.createFrame();                       │
│                                                                  │
│  STEP 2: Set layoutMode FIRST                                    │
│          frame.layoutMode = "VERTICAL" or "HORIZONTAL";           │
│                                                                  │
│  STEP 3: Set visual properties                                   │
│          frame.fills, frame.strokes, frame.cornerRadius           │
│                                                                  │
│  STEP 4: Set padding & itemSpacing                               │
│          frame.paddingLeft/Right/Top/Bottom, frame.itemSpacing     │
│                                                                  │
│  STEP 5: Set alignment properties                                │
│          frame.primaryAxisAlignItems (e.g. "SPACE_BETWEEN")       │
│          frame.counterAxisAlignItems (e.g. "CENTER")              │
│                                                                  │
│  ⚠️⚠️⚠️ STEPS 6 + 6.5 ARE THE MOST CRITICAL ⚠️⚠️⚠️             │
│                                                                  │
│  STEP 6: Call resize() FIRST if frame needs any FIXED dimension  │
│          frame.resize(width, height);                             │
│          ⚠️  resize() forces BOTH axes to FIXED mode!            │
│          ⚠️  This DESTROYS any AUTO mode set BEFORE it!          │
│                                                                  │
│  STEP 6.5: Set sizing modes IMMEDIATELY AFTER resize()           │
│          frame.primaryAxisSizingMode = "FIXED" or "AUTO";         │
│          frame.counterAxisSizingMode = "FIXED" or "AUTO";         │
│          ⚠️  MUST come AFTER resize() — not before!              │
│          ⚠️  If you set "AUTO" before resize(), resize()         │
│             silently resets it back to "FIXED"!                   │
│                                                                  │
│  STEP 7: Append ALL children                                     │
│          frame.appendChild(child1);                               │
│          frame.appendChild(child2);                               │
│                                                                  │
│  STEP 8: Set child sizing AFTER appendChild                      │
│          child.layoutSizingHorizontal = "FILL";                   │
│          ⚠️  Only works AFTER the child is inside a parent!      │
│                                                                  │
│  STEP 9: Set parent HUG modes LAST (for deferred HUG)           │
│          frame.primaryAxisSizingMode = "AUTO";  ← HUG            │
│          ⚠️  This MUST be the LAST sizing call on this frame     │
│          ⚠️  Any resize() after this DESTROYS the HUG!           │
│          USE THIS when frame needs FIXED width + HUG height      │
│          (e.g. content cards). Call finalizeHugHeight() here.     │
└──────────────────────────────────────────────────────────────────┘
```

### ⚠️ THE GOLDEN RULE: `resize()` → then `sizingModes` → never the reverse

```javascript
// ❌ BROKEN — AUTO is set, then resize() silently destroys it
row.counterAxisSizingMode = "AUTO";   // HUG height ✓
row.resize(375, 1);                   // DESTROYS AUTO → height FIXED at 1px!

// ✅ CORRECT — resize() first, then sizing modes stick
row.resize(375, 1);                   // Sets both axes to FIXED
row.primaryAxisSizingMode = "FIXED";  // Stays FIXED ✓
row.counterAxisSizingMode = "AUTO";   // HUG height ✓ (nothing overwrites it)
```

---

## 2. The 6 Anti-Patterns (NEVER DO THESE)

### ❌ Anti-Pattern #1: Calling `resize()` AFTER Setting HUG Mode (Fixed Height 100px Bug)
```javascript
// ❌ BROKEN — resize() silently resets sizingMode to "FIXED" (creates 100px height bug!)
card.counterAxisSizingMode = "AUTO";   // HUG height ✓
card.resize(375, 100);                 // DESTROYS HUG! Height is now FIXED at 100px!
```
```javascript
// ✅ CORRECT — FOR BUTTONS, BADGES & INLINE CONTROLS: NEVER CALL resize() AT ALL!
button.layoutMode = "HORIZONTAL";
button.paddingLeft = 16; button.paddingRight = 16;
button.paddingTop = 10; button.paddingBottom = 10;
button.primaryAxisSizingMode = "AUTO";   // HUG width ✓
button.counterAxisSizingMode = "AUTO";   // HUG height ✓ (No resize() call to ruin it!)
```

### ❌ Anti-Pattern #2: Setting `FILL` Before `appendChild()`
```javascript
// ❌ BROKEN — child has no parent yet, FILL throws error
child.layoutSizingHorizontal = "FILL"; // ERROR: not inside Auto Layout parent
parent.appendChild(child);
```
```javascript
// ✅ CORRECT — append first, then set FILL
parent.appendChild(child);
child.layoutSizingHorizontal = "FILL"; // Works because child is now inside parent ✓
```

### ❌ Anti-Pattern #3: Child STRETCH With Parent HUG Counter-Axis
```javascript
// ❌ BROKEN — circular dependency: parent hugs child, child stretches to parent
parent.counterAxisSizingMode = "AUTO";   // Parent HUGs its children
child.layoutAlign = "STRETCH";           // Child tries to FILL parent width — paradox!
```
```javascript
// ✅ CORRECT — parent must be FIXED on counter-axis for STRETCH to work
parent.counterAxisSizingMode = "FIXED";  // Parent has a defined width
parent.resize(375, 100);                 // Explicit width set
child.layoutAlign = "STRETCH";           // Child correctly fills 375px ✓
```

### ❌ Anti-Pattern #4: `layoutGrow = 1` With Parent HUG Primary-Axis
```javascript
// ❌ BROKEN — child can't grow into a parent that's shrinking to fit
parent.primaryAxisSizingMode = "AUTO";   // Parent HUGs
child.layoutGrow = 1;                    // Child tries to FILL — paradox!
```
```javascript
// ✅ CORRECT — parent must be FIXED on primary-axis for grow to work
parent.primaryAxisSizingMode = "FIXED";  // Parent has defined height/width
child.layoutGrow = 1;                    // Child fills remaining space ✓
```

### ❌ Anti-Pattern #5: SPACE_BETWEEN on HUG-Width Parent
```javascript
// ❌ BROKEN — HUG shrinks to fit children, zero gap to distribute
row.primaryAxisSizingMode = "AUTO";      // HUG — frame shrinks to 200px
row.primaryAxisAlignItems = "SPACE_BETWEEN"; // No space to distribute!
// Result: "Item Total₹460" (items collide)
```
```javascript
// ✅ CORRECT — SPACE_BETWEEN needs FIXED width
row.primaryAxisSizingMode = "FIXED";
row.resize(375, 40);                     // Explicit 375px width
row.primaryAxisAlignItems = "SPACE_BETWEEN"; // 175px gap distributed ✓
```

---

## 3. Sizing Decision Matrix

Use this matrix to determine the correct sizing for EVERY node in the hierarchy.

### For Frames (Parent Auto Layout Containers)

| Component | layoutMode | Width | Height | Why |
|:---|:---|:---|:---|:---|
| **Root Mobile Screen** | `VERTICAL` | `FIXED 375px` | `FIXED 812px` | Device dimensions are absolute |
| **Top Header Bar** | `HORIZONTAL` | `FIXED 375px` | `HUG` | Full device width, height wraps content |
| **Middle Scroll Section** | `VERTICAL` | `FIXED 375px` | `FIXED (calculated)` | Fills remaining space between header & footer |
| **Bottom Nav Bar** | `HORIZONTAL` | `FIXED 375px` | `HUG` | Full device width, height wraps icons |
| **Content Card** | `VERTICAL` | `FIXED 375px` or `FILL` | `HUG` | Card width matches parent, height wraps content |
| **Space-Between Row** | `HORIZONTAL` | `FIXED (parent inner width)` | `HUG` | Must be FIXED for SPACE_BETWEEN to work |
| **Horizontal Icon Group** | `HORIZONTAL` | `HUG` | `HUG` | Shrink-wraps its icon children |
| **Button / Pill / Badge** | `HORIZONTAL` | `HUG` or `FIXED` | `HUG` | Wraps label text + padding |
| **Column Info Block** | `VERTICAL` | `HUG` | `HUG` | Shrink-wraps stacked text lines |

### For Children (Inside Auto Layout Parents)

| Child Type | Horizontal Sizing | Vertical Sizing | When |
|:---|:---|:---|:---|
| **Multi-line Text** | `FILL` (stretch to parent) | `HUG` (`textAutoResize = "HEIGHT"`) | Long captions, descriptions |
| **Single-line Text** | `HUG` (auto-width) | `HUG` (auto-height) | Labels, prices, names |
| **Fixed Image / Avatar** | `FIXED` (explicit resize) | `FIXED` (explicit resize) | Thumbnails, profile photos |
| **Divider Line** | `FIXED` or `FILL` | `FIXED 1px` | Horizontal separators |
| **Icon Node** | `FIXED` (resize after create) | `FIXED` (resize after create) | All Lucide vector icons |
| **Card inside Scroll** | `FILL` (stretch to scroll container) | `HUG` | Content cards in list |

---

## 4. The 3-Part Mobile Screen Architecture

Every mobile screen MUST use this 3-part structure to prevent bottom nav overlap:

```
┌──────────────────────────────┐
│  A. TOP HEADER BAR           │  layoutMode: HORIZONTAL
│     Width: FIXED 375px       │  primaryAxisSizingMode: FIXED (for SPACE_BETWEEN)
│     Height: HUG              │  counterAxisSizingMode: AUTO (HUG height)
├──────────────────────────────┤
│                              │
│  B. MIDDLE CONTENT AREA      │  layoutMode: VERTICAL
│     Width: FIXED 375px       │  primaryAxisSizingMode: FIXED
│     Height: FIXED            │  counterAxisSizingMode: FIXED
│     (812 - header - footer)  │  clipsContent: true
│                              │
│     Contains scrollable      │
│     cards, lists, media      │
│                              │
├──────────────────────────────┤
│  C. BOTTOM NAV BAR           │  layoutMode: HORIZONTAL
│     Width: FIXED 375px       │  primaryAxisSizingMode: FIXED (for SPACE_BETWEEN)
│     Height: HUG              │  counterAxisSizingMode: AUTO (HUG height)
└──────────────────────────────┘
```

**Calculation for Middle Content Height:**
```javascript
// After building header and footer, calculate middle height:
// header height ≈ 52-76px (depends on padding + content)
// footer height ≈ 56-64px (depends on padding + icons)
const middleHeight = 812 - headerHeight - footerHeight;
```

---

## 5. Mandatory Helper Functions

Every generated script MUST include these helper functions verbatim:

```javascript
// ═══════════════════════════════════════════════════════════
// HELPER: Create a SPACE_BETWEEN horizontal row (Fixed Width)
// ═══════════════════════════════════════════════════════════
// USE FOR: Headers, action bars, price rows, nav bars
// WHY FIXED: SPACE_BETWEEN needs a defined width to distribute gap
function makeSpaceBetweenRow(name, fixedWidth) {
  const row = figma.createFrame();
  row.name = name;
  row.layoutMode = "HORIZONTAL";
  row.fills = [];                         // Transparent structural frame
  // STEP 6: resize() FIRST — it resets BOTH axes to FIXED
  row.resize(fixedWidth, 1);
  // STEP 6.5: Set sizing modes AFTER resize — these stick
  row.primaryAxisSizingMode = "FIXED";    // ← Width stays FIXED (for SPACE_BETWEEN)
  row.counterAxisSizingMode = "AUTO";     // ← Height HUGs content (not destroyed by resize)
  row.primaryAxisAlignItems = "SPACE_BETWEEN";
  row.counterAxisAlignItems = "CENTER";
  return row;
}

// ═══════════════════════════════════════════════════════════
// HELPER: Create a HUG-both-axes container (for icon groups, pills, etc.)
// ═══════════════════════════════════════════════════════════
// USE FOR: Groups of icons, button content, stacked text columns
function makeHugContainer(name, direction = "HORIZONTAL", spacing = 8) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.layoutMode = direction;
  frame.fills = [];                       // Transparent structural frame
  frame.primaryAxisSizingMode = "AUTO";   // HUG along flow direction
  frame.counterAxisSizingMode = "AUTO";   // HUG across flow direction
  frame.itemSpacing = spacing;
  frame.counterAxisAlignItems = "CENTER";
  return frame;
}

// ═══════════════════════════════════════════════════════════
// HELPER: Create a content card with FIXED width & HUG height
// ═══════════════════════════════════════════════════════════
// USE FOR: Feed cards, order cards, flight cards, any card with variable content
// CRITICAL: Call this, append ALL children, height auto-hugs.
//           DO NOT call resize() after creating this frame!
function makeContentCard(name, fixedWidth, options = {}) {
  const card = figma.createFrame();
  card.name = name;
  card.layoutMode = "VERTICAL";
  card.fills = options.fills || [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  if (options.cornerRadius) card.cornerRadius = options.cornerRadius;
  if (options.strokes) { card.strokes = options.strokes; card.strokeWeight = options.strokeWeight || 1; }
  card.itemSpacing = options.itemSpacing || 0;
  if (options.paddingLeft !== undefined) card.paddingLeft = options.paddingLeft;
  if (options.paddingRight !== undefined) card.paddingRight = options.paddingRight;
  if (options.paddingTop !== undefined) card.paddingTop = options.paddingTop;
  if (options.paddingBottom !== undefined) card.paddingBottom = options.paddingBottom;
  // STEP 6: resize() FIRST — resets both axes to FIXED
  card.resize(fixedWidth, 1);
  // STEP 6.5: Explicitly set width FIXED (counter-axis for VERTICAL = width)
  card.counterAxisSizingMode = "FIXED";
  // Height (primary axis) stays FIXED for now — caller MUST call finalizeHugHeight() LAST
  return card;
}

// ═══════════════════════════════════════════════════════════
// HELPER: Finalize a card/frame to HUG its content height
// ═══════════════════════════════════════════════════════════
// CALL THIS AFTER all children have been appended to the frame.
// This is STEP 9 — the final sizing call.
function finalizeHugHeight(frame) {
  frame.primaryAxisSizingMode = "AUTO";   // HUG along primary axis (height for VERTICAL)
}

// ═══════════════════════════════════════════════════════════
// HELPER: Make a child fill its parent's width
// ═══════════════════════════════════════════════════════════
// CALL THIS AFTER parent.appendChild(child) — never before!
// Parent MUST have counterAxisSizingMode = "FIXED" (for VERTICAL parent)
// or primaryAxisSizingMode = "FIXED" (for HORIZONTAL parent)
function setChildFillWidth(child) {
  child.layoutAlign = "STRETCH";
  try { child.layoutSizingHorizontal = "FILL"; } catch (e) {}
}

// ═══════════════════════════════════════════════════════════
// HELPER: Make a child fill its parent's remaining height (grow)
// ═══════════════════════════════════════════════════════════
// Parent MUST have primaryAxisSizingMode = "FIXED"
function setChildGrowHeight(child) {
  child.layoutGrow = 1;
  try { child.layoutSizingVertical = "FILL"; } catch (e) {}
}
```

---

## 6. Common Layout Patterns (Copy-Paste Templates)

### Pattern A: Full-Width Header with SPACE_BETWEEN
```javascript
// Header: [Title ................... Icons]
const header = makeSpaceBetweenRow("Top Header", 375);
header.paddingLeft = 16; header.paddingRight = 16;
header.paddingTop = 14; header.paddingBottom = 12;
header.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];

header.appendChild(createText("Title", 20, "Bold"));

const iconGroup = makeHugContainer("Header Icons", "HORIZONTAL", 16);
// append icons to iconGroup...
header.appendChild(iconGroup);

screen.appendChild(header);
```

### Pattern B: Content Card with Variable Height
```javascript
// Card that hugs its content — height adjusts automatically
const card = makeContentCard("Flight Card", 343, {
  cornerRadius: 16,
  fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
  strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
  itemSpacing: 12,
  paddingLeft: 16, paddingRight: 16, paddingTop: 14, paddingBottom: 14
});

card.appendChild(headerRow);    // Space-between row
card.appendChild(timelineRow);  // Space-between row
card.appendChild(divider);      // Fixed 1px line
card.appendChild(priceRow);     // Space-between row

finalizeHugHeight(card);        // ← STEP 9: HUG height LAST
scrollContainer.appendChild(card);
```

### Pattern C: Bottom Navigation Bar
```javascript
const navBar = makeSpaceBetweenRow("Bottom Nav", 375);
navBar.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
navBar.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
navBar.strokeWeight = 1;
navBar.paddingLeft = 28; navBar.paddingRight = 28;
navBar.paddingTop = 10; navBar.paddingBottom = 20;

// Each nav item is a HUG vertical column
const navItem = makeHugContainer("Nav / Flights", "VERTICAL", 2);
navItem.counterAxisAlignItems = "CENTER";
navItem.appendChild(icon);
navItem.appendChild(createText("Flights", 10, "Bold"));
navBar.appendChild(navItem);
// ... repeat for other nav items

screen.appendChild(navBar);
```

### Pattern D: Multi-line Text That Fills Parent Width
```javascript
const captionText = createText("Long caption text here...", 12, "Regular");
parentCard.appendChild(captionText);           // Append FIRST
captionText.layoutAlign = "STRETCH";           // FILL width — AFTER appendChild
captionText.textAutoResize = "HEIGHT";         // HUG height — text wraps
```

---

## 7. Validation Checklist

Before a generated script is considered correct, verify:

- [ ] Root screen is `FIXED 375×812`
- [ ] Every `SPACE_BETWEEN` row has `primaryAxisSizingMode = "FIXED"` with explicit `resize(width, h)`
- [ ] Every content card calls `finalizeHugHeight(card)` AFTER all children are appended
- [ ] No `resize()` call appears AFTER `primaryAxisSizingMode = "AUTO"` on the same frame
- [ ] Every `layoutSizingHorizontal = "FILL"` is set AFTER `parent.appendChild(child)`
- [ ] Every `layoutAlign = "STRETCH"` child has a parent with `counterAxisSizingMode = "FIXED"`
- [ ] Structural containers (rows, groups) have `fills = []` (transparent)
- [ ] Middle content area uses `clipsContent = true`
- [ ] No manual `x` or `y` positioning on Auto Layout children (except `layoutPositioning = "ABSOLUTE"` overlays)
