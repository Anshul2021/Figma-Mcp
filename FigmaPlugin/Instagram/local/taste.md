# Visual Taste & Design Preferences — Instagram

> Project-specific visual style layered on top of global anti-slop directives.

---

## 🎨 Project Visual Identity

Minimalist clean white canvas with gradient story rings, vibrant photography, verified badges, and lightweight icons.

## 🎨 Design Philosophy & Anti-Slop Directive

- **Style:** Agency-grade modern B2B SaaS dashboard, clean enterprise, high contrast.
- **Anti-Slop:** Avoid default, generic "AI slop" gradients, uninspired plain gray boxes, or monolithic flat designs.
- **Canvas Viewport:** `1440px × 900px` Landscape Desktop Workspace (or `375px × 812px` Mobile Viewport).
- **Density:** Comfortable Enterprise (micro-padding `16px - 24px`, clear section spacing `16px - 24px`).

---

## 📐 Corner Radii Hierarchy

| Token | Value | Primary Application |
|:------|:------|:-------------------|
| `radius-xs` | **4px** | Status badges, tag counts, micro pills |
| `radius-sm` | **6px** | Primary/Secondary buttons, input search bar |
| `radius-md` | **8px** | Action widgets, icon container boxes |
| `radius-lg` | **12px** | Main panel containers, table containers |
| `radius-xl` | **16px** | Hero overview cards, modal containers |

---

## 🌫️ Borders & Elevation

- **Subtle 1px Borders:** Use 1px refined inner borders (`#E5E7EB` or `#F1F5F9`) instead of heavy dark borders.
- **Elevation:** Soft ambient drop shadows (`offset: { x: 0, y: 1 }, radius: 3, opacity: 0.05`).
- **Icon Boxes:** Soft background containers (`#F8FAFC` or primary light tint) around Lucide vector icons (`strokeWidth = 1.5`).
