# 💡 Practical Prompting Examples & Workflow Templates

> **Quickstart Guide:** Use these copy-paste prompt templates and step-by-step user journey workflows to generate production-grade Figma UI screens, reusable master components, and native Figma Variables.

---

## ⚡ 1. Ready-to-Use Copy-Paste Prompts

### A. New Project Creation with Product Brief (`@newproject` + `@brief`)
```text
@newproject Crusource
@brief Crusource is an enterprise AI-powered recruitment and candidate workstation platform helping job applicants browse open job descriptions, track application steps, and submit resumes to enterprise hiring managers.
```
> **What this does:** Scaffolds `FigmaPlugin/Crusource/` directory structure, populates `FigmaPlugin/Crusource/local/brief.md` with the product domain context, and prepares defaults for screen generation.

---

### B. Project Scaffolding + Full Style Override in One Prompt
```text
@newproject FoodDeliveryApp
@brief FoodDeliveryApp is a high-speed hyper-local food delivery application for ordering gourmet dishes, tracking live delivery drivers, and managing cart items.
@color #FF385C, #00A699
@font Poppins
@taste clean modern card layout with soft rounded corners and subtle drop shadows
```
> **What this does:** Scaffolds the project, sets product brief context in `local/brief.md`, configures brand colors `#FF385C` in `local/colors.md`, sets typography to `Poppins` in `local/fonts.md`, and sets visual taste in `local/taste.md`.

---

### C. Single Screen Generation
```text
Generate a candidate job application workstation screen for Crusource with:
- Top bar with Crusource logo, breadcrumb navigation, and candidate profile pill
- Left sidebar showing multi-step application progress stepper (Step 2 of 4 active)
- Main form card with input fields for Full Name, Email, Phone, and Portfolio URL
- Drag-and-drop resume upload zone with uploaded PDF status chip
- Footer actions with "Back to Personal Info" secondary button and "Continue to Screening Questions" primary orange button
```

---

### D. Full End-to-End Design System Generation (`@designsystem`)
```text
@designsystem
```
> **What this does:** 
> 1. Reads `.agents/skills/ui-design-system/SKILL.md`.
> 2. Generates/publishes native Figma Variables & Text Styles into `tokens/variables.js` referencing project `local/colors.md` and `local/fonts.md`.
> 3. Scans all `.js` files in `FigmaPlugin/<Project_Name>/screens/` to identify repeated UI components (Buttons, Avatars, Cards, Navigation Bars, Inputs).
> 4. Creates master `ComponentSetNode` variants in `components/DesignSystem.js`.
> 5. Rewrites screens to instantiate components via `componentNode.createInstance()`.

---

### E. Manual Component Sets Generation (`@gen-components`)
```text
@gen-components
Generate a complete Enterprise Design System for Crusource including color scale swatches, strict even typography scale specimens, and native ComponentSets for Buttons, Inputs, and Badges with interactive Inspector dropdown selectors.
```

---

### F. Native Figma Variables Publishing (`@gen-variables`)
```text
@gen-variables
Publish native Figma Variables for Crusource including Brand Primary Orange (#FF7700), Slate Text Scale (#0F172A, #334155, #64748B), Spacing Scale (4, 8, 12, 16, 24, 32), and Text Styles.
```

---

### G. Component Reuse Mode (`@use-components`)
```text
@use-components
Generate candidate dashboard screen for Crusource reusing existing master Button and Card components from the components library.
```

---

## 🚀 2. End-to-End User Journey Example: Food Delivery App

Follow this complete 6-step prompt sequence to build a project from scratch:

### Step 1: Initialize Project & Set Product Brief (`@newproject` + `@brief`)
```text
@newproject FoodDeliveryApp
@brief FoodDeliveryApp connects local food lovers with top-rated neighborhood restaurants, offering 30-minute delivery, dish customization options, and instant cart checkout.
```

### Step 2: Generate Home Discovery Screen (Using Default Project Context)
```text
Generate a home discovery screen for FoodDeliveryApp featuring:
- Delivery address header ("Deliver to 742 Evergreen Terrace") with cart badge (3 items)
- Search bar with placeholder "Search dishes or restaurants..."
- Category filter pills (All, Burgers, Pizza, Asian, Healthy, Desserts)
- Featured restaurant cards with cover image, rating badge, prep time, delivery fee, and discount tag
- Bottom navigation bar (Explore, Search, Orders, Profile)
```

### Step 3: Refine Design Direction (Add Colors & Visual Taste)
```text
@color #FF385C, #00A699
@taste soft rounded cards with floating micro-shadows and clean white surfaces
```

### Step 4: Generate Food Item Customization Screen
```text
Generate food item detail screen for FoodDeliveryApp showing:
- Hero food photo with top floating back and favorite buttons
- Overlapping content card sheet with dish title "Double Truffle Smash Burger", price "$16.50", and calorie tag "820 kcal"
- Radio option list for size selection (Single Patty, Double Patty +$4, Triple Patty +$7)
- Checkbox list for extra add-ons (Extra Truffle Mayo, Aged Cheddar, Crispy Bacon)
- Bottom sticky cart bar with quantity stepper (- 1 +) and "Add to Basket — $20.50" CTA
```

### Step 5: Publish Native Figma Color & Spacing Variables
```text
@gen-variables
Publish native Figma Variables for FoodDeliveryApp with Primary Brand (#FF385C), Secondary (#00A699), Slate Text scale, radii tokens, and spacing tokens.
```

### Step 6: Generate Master Component Set
```text
@gen-components
Generate master reusable Button, FoodCard, and Input components for FoodDeliveryApp with interactive Figma Inspector dropdown states (Default, Hover, Active, Disabled).
```

---

## 🎨 3. Enterprise B2B SaaS Example: Candidate Portal (`Crusource`)

### Step 1: Scaffold Enterprise Project with Product Brief
```text
@newproject Crusource
@brief Crusource is an enterprise HR tech platform providing candidate job description portals, multi-step application tracking, and automated onboarding workflows.
```

### Step 2: Generate Job Description (JD) & Apply Screen
```text
Generate a candidate job description screen for Crusource featuring:
- Header bar with Crusource logo badge and breadcrumbs "Careers / Engineering / Staff Architect"
- Hero card with job title, compensation pill ($190k-$240k), location pill (San Francisco, CA), and "Apply Now →" hero CTA
- Dual column body layout:
  - Left column (880px): Company mission, key responsibilities bullet list with green checkmark vector icons, and tech stack chips (React, TypeScript, WebGL, Node.js)
  - Right column (430px): Quick apply card with estimated time (3 mins) and hiring manager contact card
```

### Step 3: Publish Master Design System
```text
@gen-components
Generate Crusource Enterprise Design System specimen frame containing color swatches, Instrument Sans typography scale, and ComponentSets for Buttons, Inputs, and Status Badges.
```

---

## 📌 4. Prompting Best Practices Cheat Sheet

| Do This 🟢 | Avoid This 🔴 |
|:---|:---|
| Combine `@newproject <Name>` with `@brief <Product context>` in your initial prompt | Skipping product context, leaving screens unaligned with purpose |
| Specify clear section names (*Top Bar, Hero Banner, Left Column, Bottom Nav*) | Vague prompts like *"make a nice UI screen"* |
| Use `@gen-components` and `@gen-variables` to publish reusable design system assets | Manually building unlinked inline frames repeatedly |
| Use vector SVG icons via Lucide icon names (*map-pin, user, check-circle*) | Requesting emojis inside text nodes |
