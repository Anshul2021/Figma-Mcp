# Project Brief — Instagram

> Product Purpose & Domain Context for Instagram Mobile App.

---

## 1. Project Overview & Context

- **Project Name:** Instagram
- **Domain / Industry:** Social Media, Photo & Video Sharing, Community Interaction
- **Target Audience:** Content creators, everyday social media users, friends, influencers, brands
- **Core Value Proposition:** Seamless mobile social interaction platform for sharing visual posts, stories, reels, messaging, and building digital communities.
- **Key User Flows:**
  - Home Feed: Browse photo/video posts, view stories bar, double-tap likes, comments, shares
  - Explore & Search: Discover trending content, visual grids, hashtag & account discovery
  - Reels: Vertical full-screen short-form video feed with interactive overlays
  - Profile & Highlights: Personal grid view, bio, follower metrics, story highlights
  - Direct Messaging (DM): Private chats, media sharing, quick replies

---

## 2. Platform & Target Specs

- **Primary Platform:** Mobile (iOS / Android App)
- **Screen Dimensions:** `375px × 812px` (standard mobile frame)
- **Safe Area Insets:** Top `0px` (Clean flush top header with standard 12px-16px padding), Bottom `20px` (home indicator bar)
- **Orientation:** Portrait (fixed)

---

## 3. Screen Layout Architecture

Every screen follows the standard mobile 3-Part Stack:
1. Top Header Bar (Brand Logo / Navigation / Action Icons like Likes & DMs)
2. Scrollable Middle Body (Stories bar, post feeds, discovery grid, profile metrics)
3. Bottom Navigation Bar (Home, Search, Create/Post, Reels, Profile)
