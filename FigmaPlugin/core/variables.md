# Core Protocol — Figma Native Variables & Text Styles Publishing

> **IMMUTABLE SYSTEM RULE:** This protocol governs the generation of native Figma Variables (`figma.variables`) and Figma Text Styles (`figma.createTextStyle()`) for project design tokens.

---

## 1. Native Figma Variables Creation Protocol

Whenever generating token publisher scripts in `FigmaPlugin/<Project_Name>/tokens/variables.js`:

1. **Create or Get Variable Collection**:
   ```javascript
   let collection = figma.variables.getLocalVariableCollections().find(c => c.name === "Project Tokens");
   if (!collection) {
     collection = figma.variables.createVariableCollection("Project Tokens");
   }
   const modeId = collection.modes[0].modeId;
   ```

2. **Create Color Variables**:
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
   createColorVariable("Colors/Primary", { r: 1.000, g: 0.467, b: 0.000 });
   createColorVariable("Colors/Background", { r: 0.973, g: 0.980, b: 0.988 });
   createColorVariable("Colors/TextHead", { r: 0.059, g: 0.090, b: 0.165 });
   ```

3. **Create Float/Number Variables (Corner Radii & Spacing)**:
   ```javascript
   function createNumberVariable(name, numberValue) {
     let variable = figma.variables.getLocalVariables().find(v => v.name === name);
     if (!variable) {
       variable = figma.variables.createVariable(name, collection.id, "FLOAT");
     }
     variable.setValueForMode(modeId, numberValue);
     return variable;
   }

   // Example Usage:
   createNumberVariable("Radii/sm", 6);
   createNumberVariable("Radii/md", 8);
   createNumberVariable("Radii/lg", 12);
   createNumberVariable("Radii/xl", 16);
   ```

---

## 2. Figma Text Styles Publishing Protocol

Whenever publishing font scale tokens to Figma Local Text Styles:

```javascript
async function createLocalTextStyle(name, fontSize, fontStyle = "Regular") {
  await figma.loadFontAsync({ family: "Instrument Sans", style: fontStyle });
  
  let style = figma.getLocalTextStyles().find(s => s.name === name);
  if (!style) {
    style = figma.createTextStyle();
  }
  style.name = name;
  style.fontName = { family: "Instrument Sans", style: fontStyle };
  style.fontSize = fontSize;
  return style;
}

// Example Scale:
await createLocalTextStyle("Typography/Title 24", 24, "Bold");
await createLocalTextStyle("Typography/Subhead 16", 16, "Bold");
await createLocalTextStyle("Typography/Body 14", 14, "Regular");
await createLocalTextStyle("Typography/Caption 12", 12, "Medium");
await createLocalTextStyle("Typography/Micro 10", 10, "Bold");
```

---

## 3. Strict Execution Guidelines

1. **Check Existing Collections First**: Always check `getLocalVariableCollections()` and `getLocalVariables()` to avoid creating duplicate variable entries on re-run.
2. **Safe Error Handling**: Wrap variable creation in `try...catch` blocks to handle older Figma API environments gracefully.
