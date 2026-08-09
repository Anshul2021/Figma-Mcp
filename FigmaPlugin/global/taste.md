# Visual Taste & Design Preferences — Global Defaults

> Global aesthetic guidelines for UI screen generation across all projects.

---

## 🎨 Design Philosophy & Anti-Slop Directive

- **Style:** Modern community forum & media platform, clean high-contrast readability, structured cards.
- **Anti-Slop:** Avoid default, generic "AI slop" gradients, uninspired plain gray boxes, or monolithic flat designs.
- **Canvas Viewport:** `1440px × 900px` Landscape Desktop Workspace (or `375px × 812px` Mobile Viewport).
- **Density:** Comfortable Community (micro-padding `12px - 16px`, clear card separation `8px - 12px`).

---

## 📐 Corner Radii Hierarchy

| Token | Value | Primary Application |
|:------|:------|:-------------------|
| `radius-xs` | **4px** | Status badges, flair tags, micro pills |
| `radius-sm` | **6px** | Upvote/downvote pills, search bar |
| `radius-md` | **8px** | Post cards, media containers, comment boxes |
| `radius-lg` | **12px** | Main panel containers, modal sheets |
| `radius-xl` | **16px** | Hero overview cards, overlay sheets |

---

## 🌫️ Borders & Elevation

- **Subtle 1px Borders:** Use 1px refined inner borders (`#EDEFF1` or `#E5E7EB`) instead of heavy dark borders.
- **Elevation:** Soft ambient drop shadows (`offset: { x: 0, y: 1 }, radius: 3, opacity: 0.04`).
- **Icon Boxes:** Soft background containers (`#F6F7F8` or primary light tint) around Lucide vector icons (`strokeWidth = 1.5`).
