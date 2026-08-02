# Color System — Crusource

> Brand and UI color tokens for Crusource desktop screens.
> Primary Brand Color: `#FF7700` (Crusource Orange)

---

## 🎨 Brand Colors

### Primary (Crusource Bright Orange)
- **`primary-600`** | `#FF7700` | `{ r: 1.000, g: 0.467, b: 0.000 }` — Primary buttons, active nav indicators, key badges
- **`primary-700`** | `#E06900` | `{ r: 0.878, g: 0.412, b: 0.000 }` — Hover / pressed states
- **`primary-500`** | `#FF881A` | `{ r: 1.000, g: 0.533, b: 0.102 }` — Light primary accents
- **`primary-100`** | `#FFF0E6` | `{ r: 1.000, g: 0.941, b: 0.902 }` — Soft orange background fill / active tab background
- **`primary-50`**  | `#FFF8F5` | `{ r: 1.000, g: 0.973, b: 0.961 }` — Subtle container highlight

---

## ⚪ Neutral Slate Scale

- **`slate-900`** | `#0F172A` | `{ r: 0.059, g: 0.090, b: 0.165 }` — Headings & primary text
- **`slate-700`** | `#334155` | `{ r: 0.200, g: 0.255, b: 0.333 }` — Body text & icons
- **`slate-500`** | `#64748B` | `{ r: 0.392, g: 0.455, b: 0.545 }` — Muted labels, placeholders, inactive tabs
- **`slate-300`** | `#CBD5E1` | `{ r: 0.796, g: 0.835, b: 0.882 }` — Component borders, input outlines
- **`slate-100`** | `#F1F5F9` | `{ r: 0.945, g: 0.961, b: 0.976 }` — Card hover fills, sidebar hover
- **`slate-50`**  | `#F8FAFC` | `{ r: 0.973, g: 0.980, b: 0.988 }` — Main workspace background fill
- **`white`**     | `#FFFFFF` | `{ r: 1.000, g: 1.000, b: 1.000 }` — Cards, modals, top header background

---

## 🚦 Status & Utility Colors

- **`success`** | `#10B981` | `{ r: 0.063, g: 0.725, b: 0.506 }` — Fulfilled demands, Present status
- **`warning`** | `#F59E0B` | `{ r: 0.960, g: 0.624, b: 0.043 }` — Pending reviews, Urgent demands
- **`info`**    | `#3B82F6` | `{ r: 0.231, g: 0.510, b: 0.965 }` — In Progress, Interview scheduled
- **`error`**   | `#EF4444` | `{ r: 0.937, g: 0.267, b: 0.267 }` — On leave, Closed demands

---

## ⚡ Code Quick-Map

```javascript
const COLORS = {
  primary:      { r: 1.000, g: 0.467, b: 0.000 },  // #FF7700 Primary Orange
  primaryLight: { r: 1.000, g: 0.941, b: 0.902 },  // #FFF0E6 Soft Orange Fill
  text:         { r: 0.059, g: 0.090, b: 0.165 },  // #0F172A Headings
  textMuted:    { r: 0.392, g: 0.455, b: 0.545 },  // #64748B Subtitles / Muted
  surface:      { r: 1.000, g: 1.000, b: 1.000 },  // #FFFFFF Cards
  background:   { r: 0.973, g: 0.980, b: 0.988 },  // #F8FAFC App Canvas
  border:       { r: 0.886, g: 0.910, b: 0.941 },  // #E2E8F0 Component Border
  sidebarBg:    { r: 0.059, g: 0.090, b: 0.165 },  // #0F172A Dark Slate Sidebar (or light)
  success:      { r: 0.063, g: 0.725, b: 0.506 },  // #10B981 Green
  warning:      { r: 0.960, g: 0.624, b: 0.043 },  // #F59E0B Amber
  info:         { r: 0.231, g: 0.510, b: 0.965 }   // #3B82F6 Blue
};
```
