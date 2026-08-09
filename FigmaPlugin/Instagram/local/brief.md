# Project Brief — Instagram

> App Purpose & Specific Requirements for Instagram.

---

## 1. Project Overview & Specific Requirements

- **Project Name:** Instagram
- **Brief / Description:** Photo & video sharing social platform with stories, reels, feed, and direct messages.

## 2. Platform & Target Specs

- **Primary Platform:** Mobile (iOS App)
- **Screen Dimensions:** `375px × 812px` (standard iPhone mobile screen frame)
- **Safe Area Insets:** Top `0px` (Clean top header flush with screen edge), Bottom `20px` (home indicator bar)
- **Orientation:** Portrait (fixed)
- **Extensibility:** Standard mobile architecture — easily adaptable to Android or tablet viewports.

---

## 3. Screen Layout Architecture

Every mobile screen follows the **3-Part Stack**:

```
┌─────────────────────────────────────────┐
│  TOP HEADER BAR                         │  Height: HUG content (top padding: 12px-16px)
│  (Navigation, location, screen title)   │  Width: FIXED 375px
├─────────────────────────────────────────┤
│                                         │
│  MIDDLE SCROLL CONTENT                  │  Height: FIXED (remaining viewport)
│  (Cards, feeds, menus, forms)           │  Width: FIXED 375px
│                                         │  clipsContent: true
├─────────────────────────────────────────┤
│  BOTTOM NAVIGATION / FOOTER CTA         │  Height: HUG content
│  (Tab bar or primary action button)     │  Width: FIXED 375px
└─────────────────────────────────────────┘
```

---

## 4. Default Layout & Design Parameters

| Property | Default Value | Notes |
|:---------|:--------------|:------|
| Device Width | `375px` | Standard mobile width |
| Device Height | `812px` | Standard mobile height |
| Header Height | `~48px - 56px` | Standard mobile header (flush top padding 12px-16px) |
| Footer Height | `~64px - 84px` | Plus bottom safe padding |
| Horizontal Screen Margin | `16px - 20px` | Side padding for cards |
| Card Spacing (Vertical) | `12px - 16px` | Gap between list items |
