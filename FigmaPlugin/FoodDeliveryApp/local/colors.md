# Color System

> Default brand and UI color tokens for generated Figma screens.
> When `@newproject <ProjectName>` is executed, this file is copied to `<ProjectName>/local/colors.md`.
> Theme: Vibrant Zomato Red / Food Delivery Palette.

---

## 🎨 Brand Colors

### Primary (Zomato Bright Red)
- **`primary-600`** | `#E23744` | `{ r: 0.886, g: 0.216, b: 0.267 }` — Primary buttons, active tabs, main badges
- **`primary-700`** | `#CB202D` | `{ r: 0.796, g: 0.125, b: 0.176 }` — Hover / pressed states
- **`primary-500`** | `#F04F5F` | `{ r: 0.941, g: 0.310, b: 0.373 }` — Light primary accents
- **`primary-100`** | `#FDE8EA` | `{ r: 0.992, g: 0.910, b: 0.918 }` — Soft pink/red background tint
- **`primary-50`**  | `#FFF5F6` | `{ r: 1.000, g: 0.961, b: 0.965 }` — Subtle highlight fill

### Secondary (Warm Amber / Gold Accent)
- **`secondary-600`** | `#F59E0B` | `{ r: 0.960, g: 0.624, b: 0.043 }` — Star ratings, promotional tags
- **`secondary-100`** | `#FEF3C7` | `{ r: 0.996, g: 0.953, b: 0.780 }` — Soft gold background fill

---

## ⚪ Neutral Colors

- **`neutral-900`** | `#111827` | `{ r: 0.067, g: 0.094, b: 0.153 }` — Main headings & primary text
- **`neutral-700`** | `#374151` | `{ r: 0.216, g: 0.255, b: 0.318 }` — Secondary body text
- **`neutral-500`** | `#6B7280` | `{ r: 0.420, g: 0.447, b: 0.502 }` — Muted text, inactive icons, placeholders
- **`neutral-300`** | `#D1D5DB` | `{ r: 0.820, g: 0.835, b: 0.859 }` — Borders, dividers
- **`neutral-100`** | `#F3F4F6` | `{ r: 0.953, g: 0.957, b: 0.965 }` | Card background fills, search bar fill
- **`neutral-50`**  | `#F9FAFB` | `{ r: 0.976, g: 0.980, b: 0.984 }` | Main screen background
- **`white`**       | `#FFFFFF` | `{ r: 1.000, g: 1.000, b: 1.000 }` | Pure white cards & button text

---

## 🚦 Semantic Status Colors

- **`success`** | `#059669` | `{ r: 0.020, g: 0.588, b: 0.412 }` — Veg tags, discount badges, success alerts
- **`warning`** | `#D97706` | `{ r: 0.851, g: 0.467, b: 0.024 }` — Preparation time alerts
- **`error`**   | `#DC2626` | `{ r: 0.863, g: 0.149, b: 0.149 }` | Out of stock, error messages

---

## ⚡ Code Quick-Map (Copy into Generated Scripts)

```javascript
const COLORS = {
  primary:      { r: 0.886, g: 0.216, b: 0.267 },  // #E23744 Zomato Red
  primaryLight: { r: 0.992, g: 0.910, b: 0.918 },  // #FDE8EA Soft Red Tint
  text:         { r: 0.067, g: 0.094, b: 0.153 },  // #111827 Dark Headings
  textMuted:    { r: 0.420, g: 0.447, b: 0.502 },  // #6B7280 Muted Subtitles
  surface:      { r: 1.000, g: 1.000, b: 1.000 },  // #FFFFFF White Cards
  background:   { r: 0.976, g: 0.980, b: 0.984 },  // #F9FAFB Screen Fill
  border:       { r: 0.898, g: 0.906, b: 0.922 },  // #E5E7EB Borders
  star:         { r: 0.960, g: 0.624, b: 0.043 },  // #F59E0B Gold Stars
  success:      { r: 0.020, g: 0.588, b: 0.412 }   // #059669 Veg/Discount Green
};
```
