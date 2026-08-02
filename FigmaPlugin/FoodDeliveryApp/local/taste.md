# Visual Taste & Design Preferences

> Aesthetic rules, corner radii, shadows, and design language for generated screens.
> When `@newproject <ProjectName>` is executed, this file is copied to `<ProjectName>/local/taste.md`.

---

## 🎨 Overall Design Language

- **Visual Style:** Modern, clean, food-centric, vibrant
- **Density:** Comfortable (generous 8pt grid padding)
- **Visual Feel:** Premium, approachable, clear hierarchy

---

## 📐 Corner Radius Scale

| Token | Value | Primary Application |
|:------|:------|:-------------------|
| `radius-xs` | **4px** | Small tags, micro badges |
| `radius-sm` | **6px** | Input fields, category tags |
| `radius-md` | **8px** | Action buttons, small card containers |
| `radius-lg` | **12px** | Standard cards, search bars, thumbnails |
| `radius-xl` | **16px** | Large feature cards, list containers |
| `radius-2xl` | **24px - 28px** | Bottom sheet modals, hero sheet overlays |
| `radius-full` | **9999px** | Pill buttons, circular avatars, stepper badges |

---

## 🌫️ Elevation & Shadow System

- **Flat Surface (`shadow-none`):** Standard structural rows and transparent containers.
- **Subtle Lift (`shadow-sm`):** `0 2px 8px rgba(0,0,0,0.06)` — Standard food cards & search bars.
- **Floating Element (`shadow-md`):** `0 4px 12px rgba(0,0,0,0.10)` — Circular back/heart buttons over hero images.
- **Modal / Bottom Sheet (`shadow-lg`):** `0 -4px 20px rgba(0,0,0,0.12)` — Fixed bottom navigation bar & bottom cart checkout sheet.

---

## 👁️ Visual Hierarchy Principles

1. **Hierarchy via Weight:** Bold (700) for titles and primary prices; Medium (500) for labels; Regular (400) for descriptions.
2. **Hierarchy via Color:** Primary text (`neutral-900`), Muted secondary text (`neutral-500`), Brand accent (`primary-600` Zomato Red).
3. **8pt Grid Consistency:** All paddings & gaps MUST use 8pt multiples: `4px`, `8px`, `12px`, `16px`, `20px`, `24px`.
