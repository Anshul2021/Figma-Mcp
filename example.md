# Example Prompts & Templates

> Copy-paste template examples for generating screens.
> Replace the bracketed text `[like this]` with your own project requirements.

---

## 📋 Template 1: Direct Copy-Paste Screen Generator

Copy the block below, replace your details, and run:

```text
Generate a food delivery screen for [Zomato App] with:
- Top bar with delivery address [Downtown 5th Ave] and cart icon
- Search bar with placeholder ["Search dishes, restaurants..."]
- Category filter pills [All, Burgers, Pizza, Asian, Healthy]
- List of popular food item cards with image, dish name, price, rating, and "+ Add" button
- Fixed bottom navigation bar [Home, Explore, Orders, Profile]
```

---

## 📋 Template 2: Project-Based Generation Flow

Use `@newproject` to create a dedicated project workspace with customizable local tokens:

### Step 1: Scaffold Project Workspace
```text
@newproject FoodDeliveryApp
```

### Step 2: Customize Tokens (Optional)
Edit local configuration files in `FigmaPlugin/FoodDeliveryApp/local/`:
- Edit `local/colors.md` → Set your brand primary color hex (e.g., Zomato Red `#E23744`)
- Edit `local/fonts.md` → Verify font family and even-number size scale
- Edit `local/brief.md` → Set app overview & platform target

### Step 3: Generate Project Screens
```text
Generate food explorer screen for FoodDeliveryApp

Generate food detail screen for FoodDeliveryApp showing item customizations, cheese options, quantity stepper, and "Add to Basket" CTA
```

---

## 📋 Template 3: Command Overrides Example

Modify fonts, colors, and layout engine directly in the prompt string:

```text
@font Poppins
@color #E23744, #F59E0B
@taste soft rounded cards with subtle drop shadows

Generate a restaurant menu screen with category sections and dish price items
```

---

## 📋 Template 4: Static Positioning Mode (`@skip-autolayout`)

```text
@skip-autolayout

Generate a food detail view with:
- Top hero banner image with floating back and favorite buttons
- Overlapping white content card sheet
- Food title, price, rating badge, preparation time, and calorie pill
- Radio option list for cheese selections
- Bottom sticky cart bar with quantity stepper (- 1 +) and "Add to Cart" CTA
```
