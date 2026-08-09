# Core Protocol — Figma Master Component & Variant Set Creation (`figma.combineAsVariants`)

> **IMMUTABLE SYSTEM RULE:** This protocol governs the creation of reusable Master Components (`figma.createComponent()`), ComponentSets (`figma.combineAsVariants()`), and Instance reuse (`componentNode.createInstance()`) within Figma UI generation scripts.

---

## 1. ComponentSet & Variant Property Dropdown Protocol

To create interactive component property dropdowns (e.g. `Variant`: Primary/Secondary/Outline, `State`: Default/Hover/Active/Disabled) in Figma's right-hand Inspector panel:

1. **Name Component Nodes with Key-Value Property Pairs**:
   ```javascript
   // Full Interactive State Matrix (Never produce single generic variants!)
   const c1 = figma.createComponent(); c1.name = "Variant=Primary, State=Default";
   const c2 = figma.createComponent(); c2.name = "Variant=Primary, State=Hover";
   const c3 = figma.createComponent(); c3.name = "Variant=Primary, State=Active";
   const c4 = figma.createComponent(); c4.name = "Variant=Primary, State=Disabled";
   
   const c5 = figma.createComponent(); c5.name = "Variant=Secondary, State=Default";
   const c6 = figma.createComponent(); c6.name = "Variant=Secondary, State=Hover";
   
   const c7 = figma.createComponent(); c7.name = "Variant=Outline, State=Default";
   const c8 = figma.createComponent(); c8.name = "Variant=Outline, State=Hover";
   ```

2. **Combine Variants into a Single `ComponentSetNode`**:
   ```javascript
   const componentSet = figma.combineAsVariants([c1, c2, c3, c4, c5, c6, c7, c8], parentLibraryFrame);
   componentSet.name = "Button";
   componentSet.description = "Master Button Component Set with Full State Matrix";
   ```

3. **CRITICAL: Set Auto Layout ON THE `ComponentSetNode` (Prevent Overlapping Variants)**:
   > **NEVER leave a `ComponentSetNode` without Auto Layout!** Without setting `layoutMode`, Figma stacks all variants on top of each other at (0, 0).
   ```javascript
   componentSet.layoutMode = "HORIZONTAL"; // or "VERTICAL"
   componentSet.itemSpacing = 16;
   componentSet.paddingLeft = 16; componentSet.paddingRight = 16;
   componentSet.paddingTop = 16; componentSet.paddingBottom = 16;
   componentSet.primaryAxisSizingMode = "AUTO";
   componentSet.counterAxisSizingMode = "AUTO";
   ```

4. **CRITICAL: Apply `primaryAxisSizingMode = "AUTO"` / `counterAxisSizingMode = "AUTO"` AFTER `appendChild()`**:
   > **ALWAYS append children (`c1.appendChild(child)`) BEFORE setting AUTO sizing modes on `createComponent()`!**
   ```javascript
   const c1 = figma.createComponent();
   c1.name = "Variant=Primary, State=Default";
   c1.layoutMode = "HORIZONTAL";
   c1.paddingLeft = 20; c1.paddingRight = 20; c1.paddingTop = 12; c1.paddingBottom = 12;
   c1.appendChild(textNode); // Append children FIRST
   c1.primaryAxisSizingMode = "AUTO";  // HUG width AFTER append
   c1.counterAxisSizingMode = "AUTO";  // HUG height AFTER append
   ```

---

## 2. Mandatory Component Sets to Generate for Every Project

Whenever `@gen-components` or `@designsystem` is invoked, the engine MUST generate rich component sets with complete state matrices:

1. 🔘 **Button ComponentSet**:
   - `Variant`: `Primary` | `Secondary` | `Outline` | `Destructive`
   - `State`: `Default` | `Hover` | `Active` | `Disabled`
2. 🏷️ **FilterPill / Tag ComponentSet**:
   - `Variant`: `Solid` | `Outline`
   - `State`: `Default` | `Active` | `Disabled`
3. ⭕ **Avatar / Story Circle ComponentSet**:
   - `Variant`: `Standard` | `StoryRing` | `CloseFriends` | `ActiveOnline`
   - `Size`: `Small (36px)` | `Medium (56px)` | `Large (80px)`
4. 💬 **Chat Item / Post Card ComponentSet**:
   - `State`: `Default` | `Unread` | `Hover`

---

## 3. Component Instance Reuse Protocol (in Screen Scripts)

When `@use-components` is active, screen scripts MUST reuse master components via `createInstance()`:

```javascript
const buttonSet = figma.currentPage.findOne(
  node => node.type === "COMPONENT_SET" && node.name === "Button"
);

if (buttonSet) {
  const defaultVariant = buttonSet.findChild(
    n => n.name.includes("Variant=Primary") && n.name.includes("State=Default")
  );
  if (defaultVariant) {
    const instance = defaultVariant.createInstance();
    parentFrame.appendChild(instance);
    const labelText = instance.findOne(n => n.type === "TEXT");
    if (labelText) labelText.characters = "Confirm Action";
  }
}
```
