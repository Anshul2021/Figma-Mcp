# Project Brief — Baseline Template

> Template and baseline context for screen generation.
> When `@newproject <ProjectName>` is executed, this file is copied to `<ProjectName>/local/brief.md`.

---

## 1. Project Overview & Context

- **Project Name:** Reddit — Community & Discussion Platform
- **Domain / Industry:** Social News Aggregation, Discussion & Communities
- **Target Audience:** Online communities, subreddits, daily news readers, hobbyists
- **Core Value Proposition:** Community-driven news feed with upvoting/downvoting, nested comment discussions, media sharing, and subreddit discovery.
- **Key User Flows:**
  - Home feed / Popular feed (Posts with upvote pills, media previews, comment count)
  - Subreddit Community page (Header banner, community rules, join button, sort tabs)
  - Post detail view (Expanded post, upvote/downvote bar, nested comment tree)

---

## 2. Platform & Target Specs

- **Primary Platform:** Mobile (iOS App)
- **Screen Dimensions:** `375px × 812px` (standard iPhone mobile screen frame)
- **Safe Area Insets:** Top `0px` (Clean top header flush with screen edge), Bottom `20px` (home indicator bar)
- **Orientation:** Portrait (fixed)

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
