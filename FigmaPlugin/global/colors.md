# Color System

> Default brand and UI color tokens for generated Figma screens.
> Theme: Vibrant Reddit Orange & Community Palette.

---

## 🎨 Brand Colors

### Primary (Reddit Orange)
- **`primary-600`** | `#FF4500` | `{ r: 1.000, g: 0.271, b: 0.000 }` — Upvote buttons, primary CTAs, community highlights
- **`primary-700`** | `#E03D00` | `{ r: 0.878, g: 0.239, b: 0.000 }` — Pressed / hover states
- **`primary-100`** | `#FFEBE5` | `{ r: 1.000, g: 0.922, b: 0.898 }` — Soft orange background tint

### Secondary (Reddit Action Blue)
- **`secondary-600`** | `#0079D3` | `{ r: 0.000, g: 0.475, b: 0.827 }` — Downvote buttons, links, joined badges
- **`secondary-100`** | `#E5F2FA` | `{ r: 0.898, g: 0.949, b: 0.980 }` — Soft blue background fill

---

## ⚪ Neutral Colors

- **`neutral-900`** | `#1A1A1B` | `{ r: 0.102, g: 0.102, b: 0.106 }` — Main headings & post titles
- **`neutral-700`** | `#374151` | `{ r: 0.216, g: 0.255, b: 0.318 }` — Secondary body text & comments
- **`neutral-500`** | `#787C7E` | `{ r: 0.471, g: 0.486, b: 0.494 }` — Muted text, timestamps, comment counts
- **`neutral-300`** | `#EDEFF1` | `{ r: 0.929, g: 0.937, b: 0.945 }` — Borders, dividers
- **`neutral-100`** | `#F6F7F8` | `{ r: 0.965, g: 0.969, b: 0.973 }` — Card fills, search bar background
- **`white`**       | `#FFFFFF` | `{ r: 1.000, g: 1.000, b: 1.000 }` — Card backgrounds & button text

---

## 🚦 Semantic Status Colors

- **`success`** | `#46D160` | `{ r: 0.275, g: 0.820, b: 0.376 }` — Online active status, success alerts
- **`warning`** | `#FFB000` | `{ r: 1.000, g: 0.690, b: 0.000 }` — Mod warnings, pinned posts
- **`error`**   | `#EA0027` | `{ r: 0.918, g: 0.000, b: 0.153 }` — Deleted / removed posts

---

## ⚡ Code Quick-Map

```javascript
const COLORS = {
  primary:      { r: 1.000, g: 0.271, b: 0.000 },  // #FF4500 Reddit Orange
  primaryLight: { r: 1.000, g: 0.922, b: 0.898 },  // #FFEBE5 Soft Orange Tint
  secondary:    { r: 0.000, g: 0.475, b: 0.827 },  // #0079D3 Action Blue
  text:         { r: 0.102, g: 0.102, b: 0.106 },  // #1A1A1B Dark Headings
  textMuted:    { r: 0.471, g: 0.486, b: 0.494 },  // #787C7E Muted Subtitles
  surface:      { r: 1.000, g: 1.000, b: 1.000 },  // #FFFFFF White Cards
  background:   { r: 0.965, g: 0.969, b: 0.973 },  // #F6F7F8 Screen Fill
  border:       { r: 0.929, g: 0.937, b: 0.945 }   // #EDEFF1 Borders
};
```
