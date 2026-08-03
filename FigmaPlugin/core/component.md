# Core Protocol — Figma Master Component & Variant Set Creation (`figma.combineAsVariants`)

> **IMMUTABLE SYSTEM RULE:** This protocol governs the creation of reusable Master Components (`figma.createComponent()`), ComponentSets (`figma.combineAsVariants()`), and Instance reuse (`componentNode.createInstance()`) within Figma UI generation scripts.

---

## 1. ComponentSet & Variant Property Dropdown Protocol

To create interactive component property dropdowns (e.g. `Variant`: Primary/Secondary/Outline, `State`: Default/Hover/Active/Disabled) in Figma's right-hand Inspector panel:

1. **Name Component Nodes with Key-Value Property Pairs**:
   ```javascript
   const c1 = figma.createComponent(); c1.name = "Variant=Primary, State=Default";
   const c2 = figma.createComponent(); c2.name = "Variant=Primary, State=Hover";
   const c3 = figma.createComponent(); c3.name = "Variant=Primary, State=Disabled";
   const c4 = figma.createComponent(); c4.name = "Variant=Secondary, State=Default";
   const c5 = figma.createComponent(); c5.name = "Variant=Outline, State=Default";
   ```

2. **Combine Variants into a Single `ComponentSetNode`**:
   ```javascript
   const componentSet = figma.combineAsVariants([c1, c2, c3, c4, c5], parentLibraryFrame);
   componentSet.name = "Button";
   componentSet.description = "Crusource Master Button Component Set";
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

4. **Result in Figma**:
   - Variants render side-by-side in a clean row with 16px spacing.
   - Figma automatically generates interactive dropdown controls in the right-hand panel for `Variant` and `State`.

---

## 2. Component Instance Reuse Protocol (in Screen Scripts)

When `@use-components` is active, screen scripts (`FigmaPlugin/<Project_Name>/screens/<screen_name>.js`) MUST reuse master components instead of constructing raw inline frames:

```javascript
// Look up ComponentSet or Component on currentPage
const buttonSet = figma.currentPage.findOne(
  node => node.type === "COMPONENT_SET" && node.name === "Button"
);

if (buttonSet) {
  // Find specific default variant inside the set
  const defaultVariant = buttonSet.findChild(
    n => n.name.includes("Variant=Primary") && n.name.includes("State=Default")
  );
  
  if (defaultVariant) {
    const instance = defaultVariant.createInstance();
    parentAutoLayoutFrame.appendChild(instance);
    
    // Override text label
    const labelText = instance.findOne(n => n.type === "TEXT");
    if (labelText) {
      labelText.characters = "Confirm Action";
    }
  }
}
```

---

## 3. Strict Rules & Anti-Patterns

1. **Auto Layout on ComponentSet**: Always set `componentSet.layoutMode = "HORIZONTAL"` with `itemSpacing = 16` so variants never stack on top of each other.
2. **Append Before Sizing**: Always append instances to their parent frame (`parentFrame.appendChild(instance)`) BEFORE setting `layoutSizingHorizontal = "FILL"`.
3. **Never Detach Instances**: Do NOT call `instance.detachInstance()`. Keep component connections intact for design system maintenance.
