# Commands Reference

> Special keywords included in user prompts to control generation behavior.
> All commands start with `@` and are case-insensitive.

---

## 📋 Command Quick List

- **`@skip-autolayout`**
  - **Syntax:** `@skip-autolayout`
  - **Action:** Disables Auto Layout constraints and uses static `x`/`y` coordinates and fixed `resize(width, height)`.

- **`@font`**
  - **Syntax:** `@font <FontName1>[, <FontName2>]`
  - **Action:** Overrides default font family for the generation (e.g. `@font Poppins` or `@font Inter, Playfair Display`).

- **`@color`**
  - **Syntax:** `@color <PrimaryHex>, <SecondaryHex>`
  - **Action:** Overrides primary and secondary brand colors (e.g. `@color #FF6B6B, #4ECDC4`).

- **`@taste`**
  - **Syntax:** `@taste <style description>`
  - **Action:** Overrides visual styling & aesthetic preferences (e.g. `@taste glassmorphism with frosted cards`).

- **`@newproject`**
  - **Syntax:** `@newproject <ProjectName>`
  - **Action:** Scaffolds a new project folder `FigmaPlugin/<ProjectName>/` with `screens/`, `components/`, `tokens/`, and `local/` override files.

- **`@gen-variables`**
  - **Syntax:** `@gen-variables`
  - **Action:** Generates/publishes native Figma Variables (`tokens/variables.js`) and Text Styles (`tokens/styles.js`) directly to Figma's native panel.

- **`@gen-components`**
  - **Syntax:** `@gen-components`
  - **Action:** Generates master reusable components (`components/<ComponentName>.js`) inside `FigmaPlugin/<Project_Name>/components/`.

- **`@use-components`**
  - **Syntax:** `@use-components`
  - **Action:** Instructs screen scripts to inspect `components/` and instantiate existing master components via `componentNode.createInstance()` instead of creating raw inline frames.

- **`@skip-design-taste`**
  - **Syntax:** `@skip-design-taste` (or `@quick`)
  - **Action:** Disables high-end visual taste guardrails for faster generation and reduced prompt token usage.

---

## 📖 Detailed Specifications

### 1. `@skip-autolayout`
- **Purpose:** Disable Auto Layout engine for exact manual positioning.
- **Default:** Auto Layout enabled by default as documented in [autolayout.md](./autolayout.md).
- **Execution Rules:**
  - Do NOT set `layoutMode` on any frame.
  - Do NOT set `primaryAxisSizingMode`, `counterAxisSizingMode`, `itemSpacing`, `layoutAlign`, or `layoutGrow`.
  - Do NOT include helper functions (`makeSpaceBetweenRow`, `makeHugContainer`, `makeContentCard`).
  - Use explicit `x` and `y` coordinates for every node.
  - Use explicit `resize(width, height)` for every frame/image/text block.
- **Example:**
  ```
  @skip-autolayout Generate a food delivery home screen
  ```

---

### 2. `@font`
- **Purpose:** Override primary (and optional secondary) typography font family.
- **Syntax:** `@font <PrimaryFont>[, <SecondaryFont>]`
- **Execution Rules:**
  - Takes precedence over `local/fonts.md` and `global/fonts.md`.
  - Must call `await figma.loadFontAsync({ family: "<FontName>", style: "..." })` before applying.
- **Example:**
  ```
  @font Poppins Generate a login screen
  @font Inter, Playfair Display Generate a luxury brand landing page
  ```

---

### 3. `@color`
- **Purpose:** Override primary and secondary brand accent colors.
- **Syntax:** `@color <PrimaryHex>, <SecondaryHex>`
- **Execution Rules:**
  - Takes precedence over `local/colors.md` and `global/colors.md`.
  - Accepts 6-digit hex values with or without `#`.
  - Only overrides primary and secondary tokens; neutrals and status colors remain untouched.
- **Example:**
  ```
  @color #FF6B6B, #4ECDC4 Generate a fitness dashboard
  @color E91E63, 9C27B0 Generate a music player
  ```

---

### 4. `@taste`
- **Purpose:** Override visual styling, card radii, shadows, and design theme.
- **Syntax:** `@taste <description>`
- **Execution Rules:**
  - Takes precedence over `local/taste.md` and `global/taste.md`.
  - Free-form text description interpreted into visual properties (radius, borders, elevation shadows).
- **Example:**
  ```
  @taste glassmorphism with frosted cards Generate a weather app
  @taste brutalist, sharp corners, no shadows Generate a developer tools dashboard
  ```

---

### 5. `@newproject`
- **Purpose:** Scaffold a new project directory structure for local design tokens and screen outputs.
- **Syntax:** `@newproject <ProjectName>`
- **Execution Rules:**
  - Create directory `FigmaPlugin/<ProjectName>/`
  - Create directory `FigmaPlugin/<ProjectName>/screens/`
  - Create directory `FigmaPlugin/<ProjectName>/local/`
  - Copy `global/*.md` files into `<ProjectName>/local/`
- **Example:**
  ```
  @newproject FoodDeliveryApp
  ```

---

## ⚙️ Config Resolution Order (Priority Cascade)

When resolving design properties during screen generation, the agent follows this strict order:

1. **Inline Prompt Commands** (`@font`, `@color`, `@taste`)
2. **Project Overrides** (`<ProjectName>/local/*.md`)
3. **Global Defaults** (`global/*.md`)
