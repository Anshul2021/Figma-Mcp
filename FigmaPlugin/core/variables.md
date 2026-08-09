# Core Protocol — Figma Native Variables & Text Styles Publishing

> **IMMUTABLE SYSTEM RULE:** This protocol governs the generation of native Figma Variables (`figma.variables`) and Figma Text Styles (`figma.createTextStyle()`) for project design tokens.

---

## 1. Native Figma Variables Creation Protocol

Whenever generating token publisher scripts in `FigmaPlugin/<Project_Name>/tokens/variables.js` or executing `@gen-variables` / `@designsystem`:

1. **Create or Get Variable Collection**:
   ```javascript
   let collection = figma.variables.getLocalVariableCollections().find(c => c.name === "Project Tokens");
   if (!collection) {
     collection = figma.variables.createVariableCollection("Project Tokens");
   }
   const modeId = collection.modes[0].modeId;
   ```

2. **Create Color Variables (`COLOR`)**:
   ```javascript
   function createColorVariable(name, rgbColor) {
     let variable = figma.variables.getLocalVariables().find(v => v.name === name);
     if (!variable) {
       variable = figma.variables.createVariable(name, collection.id, "COLOR");
     }
     variable.setValueForMode(modeId, rgbColor);
     return variable;
   }

   // Example Usage:
   createColorVariable("Colors/Primary", { r: 0.882, g: 0.188, b: 0.424 });
   createColorVariable("Colors/TextDark", { r: 0.059, g: 0.090, b: 0.165 });
   createColorVariable("Colors/Background", { r: 1.000, g: 1.000, b: 1.000 });
   ```

3. **Create Float/Number Variables (`FLOAT`) for Spacing & Corner Radii**:
   ```javascript
   function createNumberVariable(name, numberValue) {
     let variable = figma.variables.getLocalVariables().find(v => v.name === name);
     if (!variable) {
       variable = figma.variables.createVariable(name, collection.id, "FLOAT");
     }
     variable.setValueForMode(modeId, numberValue);
     return variable;
   }

   // MANDATORY Spacing Tokens (8pt Grid System):
   createNumberVariable("spacing/xs", 4);
   createNumberVariable("spacing/sm", 8);
   createNumberVariable("spacing/md", 12);
   createNumberVariable("spacing/lg", 16);
   createNumberVariable("spacing/xl", 24);
   createNumberVariable("spacing/2xl", 32);

   // MANDATORY Radii Tokens:
   createNumberVariable("radii/xs", 4);
   createNumberVariable("radii/sm", 6);
   createNumberVariable("radii/md", 8);
   createNumberVariable("radii/lg", 12);
   createNumberVariable("radii/xl", 16);
   createNumberVariable("radii/full", 999);

   // MANDATORY Font Size Tokens (FLOAT):
   createNumberVariable("fontSize/micro", 10);
   createNumberVariable("fontSize/caption", 12);
   createNumberVariable("fontSize/body", 14);
   createNumberVariable("fontSize/subhead", 16);
   createNumberVariable("fontSize/title", 20);
   createNumberVariable("fontSize/heading", 24);
   createNumberVariable("fontSize/hero", 32);
   ```

---

## 2. Figma Text Styles Publishing Protocol

Whenever publishing font scale tokens to Figma Local Text Styles:

```javascript
async function createLocalTextStyle(name, fontSize, fontStyle = "Regular") {
  await figma.loadFontAsync({ family: "DM Sans", style: fontStyle });
  
  let style = figma.getLocalTextStyles().find(s => s.name === name);
  if (!style) {
    style = figma.createTextStyle();
  }
  style.name = name;
  style.fontName = { family: "DM Sans", style: fontStyle };
  style.fontSize = fontSize; // Strict EVEN typography scale: 10, 12, 14, 16, 20, 24, 32
  return style;
}

// Mandatory Scale:
await createLocalTextStyle("Typography/Hero 32", 32, "Bold");
await createLocalTextStyle("Typography/Heading 24", 24, "Bold");
await createLocalTextStyle("Typography/Title 20", 20, "Bold");
await createLocalTextStyle("Typography/Subhead 16", 16, "Bold");
await createLocalTextStyle("Typography/Body 14", 14, "Regular");
await createLocalTextStyle("Typography/Caption 12", 12, "Medium");
await createLocalTextStyle("Typography/Micro 10", 10, "Medium");
```

---

## 3. Strict Execution Guidelines

1. **Comprehensive Token Coverage**: Every token script MUST generate Color variables, Spacing float variables, Radii float variables, AND Local Text Styles.
2. **Check Existing Collections First**: Always check `getLocalVariableCollections()` and `getLocalVariables()` to avoid creating duplicate variable entries on re-run.
3. **Safe Error Handling**: Wrap variable creation in `try...catch` blocks to handle older Figma API environments gracefully.
