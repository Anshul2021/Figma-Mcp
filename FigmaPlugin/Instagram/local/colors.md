# Color System — Instagram

> Brand & UI Color Tokens specifically customized for Instagram Mobile App.

---

## 🎨 Brand Colors

### Primary & Accent Colors (Instagram Signature Gradient & Accents)
- **`primary-brand` (Instagram Pink/Magenta)** | `#E1306C` | `{ r: 0.882, g: 0.188, b: 0.424 }` — Story active rings, accent buttons, key action highlights
- **`primary-gradient-purple`** | `#833AB4` | `{ r: 0.514, g: 0.227, b: 0.706 }` — Gradient start / stories border tint
- **`primary-gradient-orange`** | `#F77737` | `{ r: 0.969, g: 0.467, b: 0.216 }` — Gradient highlight
- **`primary-gradient-yellow`** | `#FCAF45` | `{ r: 0.988, g: 0.686, b: 0.271 }` — Gradient warm base
- **`verified-blue`** | `#0095F6` | `{ r: 0.000, g: 0.584, b: 0.965 }` — Follow buttons, verified badges, links, unread DM dots

---

## ⚪ Light Mode Neutral Colors (Standard Instagram Minimalist Clean)

- **`neutral-900`** | `#0F172A` | `{ r: 0.059, g: 0.090, b: 0.165 }` — Primary text, usernames, post titles
- **`neutral-700`** | `#334155` | `{ r: 0.200, g: 0.255, b: 0.333 }` — Secondary text, captions, timestamps
- **`neutral-500`** | `#64748B` | `{ r: 0.392, g: 0.455, b: 0.545 }` — Muted text, icons, action icons
- **`neutral-300`** | `#E2E8F0` | `{ r: 0.886, g: 0.910, b: 0.941 }` — Divider lines, story ring inactive gray, borders
- **`neutral-100`** | `#F8FAFC` | `{ r: 0.973, g: 0.980, b: 0.988 }` — Light pill fill, search bar fill
- **`white`**       | `#FFFFFF` | `{ r: 1.000, g: 1.000, b: 1.000 }` — Main canvas background & cards

---

## 🚦 Semantic & Badge Colors

- **`like-red`** | `#ED4956` | `{ r: 0.929, g: 0.286, b: 0.337 }` — Filled heart like state, error badges
- **`close-friends-green`** | `#10B981` | `{ r: 0.063, g: 0.725, b: 0.506 }` — Close friends story ring fill & online active dot

---

## ⚡ Code Quick-Map (Copy into Instagram Generated Scripts)

```javascript
const COLORS = {
  primary:       { r: 0.882, g: 0.188, b: 0.424 }, // #E1306C Instagram Pink
  brandBlue:     { r: 0.000, g: 0.584, b: 0.965 }, // #0095F6 Action Blue
  likeRed:       { r: 0.929, g: 0.286, b: 0.337 }, // #ED4956 Heart Red
  text:          { r: 0.059, g: 0.090, b: 0.165 }, // #0F172A Dark Slate Text
  textMuted:     { r: 0.392, g: 0.455, b: 0.545 }, // #64748B Subtitles & Icons
  surface:       { r: 1.000, g: 1.000, b: 1.000 }, // #FFFFFF Canvas
  border:        { r: 0.886, g: 0.910, b: 0.941 }, // #E2E8F0 Subtle Border
  searchFill:    { r: 0.973, g: 0.980, b: 0.988 }, // #F8FAFC Search/Pill Background
  storyInactive: { r: 0.886, g: 0.910, b: 0.941 }, // #E2E8F0 Inactive Ring
  onlineGreen:   { r: 0.063, g: 0.725, b: 0.506 }  // #10B981 Active Status
};
```
