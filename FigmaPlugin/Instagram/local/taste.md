# Visual Taste & Design Preferences — Instagram

> Aesthetic guidelines specifically tailored for Instagram Mobile App generation.

---

## 🎨 Visual Identity & Tone

- **Style:** Clean, content-first mobile social platform layout with ultra-sleek micro-paddings, high visual contrast, and high-res photo feeds.
- **Header Aesthetics:** Clean wordmark with minimal line action icons (Heart, Messenger, Plus).
- **Stories Bar:** Horizontal scroll avatar circles (`56px × 56px` or `64px × 64px`) wrapped in 2px vibrant gradient rings with micro text handles beneath (`10px` even size).
- **Post Feed Cards:** Standard aspect ratio image frames (`375px × 375px` square or `375px × 468px` 4:5 vertical portrait) with real photography fills (`applyOnlineImage`).
- **Interaction Bar:** Action icons row (Heart, Message, Send, Bookmark) with spacing and crisp double-tap like feel.

---

## 📐 Corner Radii Hierarchy

| Token | Value | Primary Application |
|:------|:------|:-------------------|
| `radius-xs` | **4px** | Follow buttons, action tag pills |
| `radius-sm` | **6px** | Search inputs, comment reply text boxes |
| `radius-md` | **8px** | Image grid corners, media cards |
| `radius-lg` | **12px** | Bottom sheets, action popovers |
| `radius-full` | **999px** | User avatars, story rings, active status pills |

---

## 🌫️ Borders & Dividers

- **Divider lines:** Subtle `1px` borders (`#E2E8F0`) between feed posts, header, and bottom navigation bar.
- **Story Ring Padding:** `2px` white inset gap between avatar and colorful story gradient border ring.
