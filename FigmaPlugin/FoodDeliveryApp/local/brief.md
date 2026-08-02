# Project Brief

> Template and baseline context for screen generation.
> When `@newproject <ProjectName>` is executed, this file is copied to `<ProjectName>/local/brief.md`.
> Edit the project details and requirements below per project.

---

## 1. Project Overview & Context

- **Project Name:** Zomato Food Delivery App
- **Domain / Industry:** On-Demand Food Delivery & Restaurant Discovery
- **Target Audience:** Foodies, daily lunch orderers, household dinner orderers
- **Core Value Proposition:** Fast 30-min food delivery from nearby curated restaurants with live order tracking and seamless checkout.
- **Key User Flows:**
  - Discover nearby restaurants & category filters (Burgers, Pizza, Asian, Desserts)
  - Explore restaurant menus & food dish detail view (customizations, add-ons, quantity)
  - Cart review, promo codes, delivery instructions & single-tap payment checkout

---

## 2. Platform & Target Specs

- **Primary Platform:** Mobile (iOS App)
- **Screen Dimensions:** `375px × 812px` (standard iPhone mobile screen frame)
- **Safe Area Insets:** Top `44px` (notch/status area), Bottom `34px` (home indicator bar)
- **Orientation:** Portrait (fixed)
- **Extensibility:** Standard mobile architecture — easily adaptable to Android or tablet viewports.

---

## 3. Screen Layout Architecture

Every mobile screen follows the **3-Part Stack**:

```
┌─────────────────────────────────────────┐
│  TOP HEADER BAR                         │  Height: HUG content
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
| Header Height | `~56px` | Plus top safe area (44px) |
| Footer Height | `~64px - 84px` | Plus bottom safe padding |
| Horizontal Screen Margin | `16px - 20px` | Side padding for cards |
| Card Spacing (Vertical) | `12px - 16px` | Gap between list items |
