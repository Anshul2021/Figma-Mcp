(async () => {
  // 1. Load Required Fonts (DM Sans - Strict EVEN typography scale)
  await figma.loadFontAsync({ family: "DM Sans", style: "Regular" });
  await figma.loadFontAsync({ family: "DM Sans", style: "Medium" });
  await figma.loadFontAsync({ family: "DM Sans", style: "Bold" });

  // 2. Color Variable Definitions
  const COLOR_TOKENS = {
    "color/brandPink": { r: 0.882, g: 0.188, b: 0.424 },    // #E1306C
    "color/verifiedBlue": { r: 0.0, g: 0.584, b: 0.965 },   // #0095F6
    "color/likeRed": { r: 0.929, g: 0.286, b: 0.337 },        // #ED4956
    "color/textDark": { r: 0.059, g: 0.090, b: 0.165 },     // #0F172A Headings & handles
    "color/textMuted": { r: 0.392, g: 0.455, b: 0.545 },    // #64748B Subtitles
    "color/searchBg": { r: 0.953, g: 0.957, b: 0.965 },     // #F3F4F6 Pill & input fill
    "color/borderLight": { r: 0.886, g: 0.910, b: 0.941 },  // #E2E8F0 Subtle borders
    "color/white": { r: 1, g: 1, b: 1 },
    "color/activeGreen": { r: 0.063, g: 0.725, b: 0.506 }   // #10B981 Online dot
  };

  // 3. Spacing Number Variables (FLOAT)
  const SPACING_TOKENS = {
    "spacing/xs": 4,
    "spacing/sm": 8,
    "spacing/md": 12,
    "spacing/lg": 16,
    "spacing/xl": 24,
    "spacing/2xl": 32
  };

  // 4. Corner Radii Number Variables (FLOAT)
  const RADII_TOKENS = {
    "radii/xs": 4,
    "radii/sm": 6,
    "radii/md": 8,
    "radii/lg": 12,
    "radii/xl": 16,
    "radii/full": 999
  };

  // 5. Typography Font Size Number Variables (FLOAT)
  const FONT_SIZE_TOKENS = {
    "fontSize/micro": 10,
    "fontSize/caption": 12,
    "fontSize/body": 14,
    "fontSize/subhead": 16,
    "fontSize/title": 20,
    "fontSize/heading": 24,
    "fontSize/hero": 32
  };

  // 6. Publish All Variables to Figma native panel
  if (figma.variables && figma.variables.createVariableCollection) {
    try {
      let collection = figma.variables.getLocalVariableCollections().find(c => c.name === "Instagram Design System Tokens");
      if (!collection) {
        collection = figma.variables.createVariableCollection("Instagram Design System Tokens");
      }
      const modeId = collection.modes[0].modeId;

      // Color Variables
      for (const [name, rgb] of Object.entries(COLOR_TOKENS)) {
        let v = figma.variables.getLocalVariables().find(varObj => varObj.name === name);
        if (!v) v = figma.variables.createVariable(name, collection.id, "COLOR");
        v.setValueForMode(modeId, { r: rgb.r, g: rgb.g, b: rgb.b, a: 1 });
      }

      // Spacing Variables
      for (const [name, val] of Object.entries(SPACING_TOKENS)) {
        let v = figma.variables.getLocalVariables().find(varObj => varObj.name === name);
        if (!v) v = figma.variables.createVariable(name, collection.id, "FLOAT");
        v.setValueForMode(modeId, val);
      }

      // Radii Variables
      for (const [name, val] of Object.entries(RADII_TOKENS)) {
        let v = figma.variables.getLocalVariables().find(varObj => varObj.name === name);
        if (!v) v = figma.variables.createVariable(name, collection.id, "FLOAT");
        v.setValueForMode(modeId, val);
      }

      // Typography Font Size Variables
      for (const [name, val] of Object.entries(FONT_SIZE_TOKENS)) {
        let v = figma.variables.getLocalVariables().find(varObj => varObj.name === name);
        if (!v) v = figma.variables.createVariable(name, collection.id, "FLOAT");
        v.setValueForMode(modeId, val);
      }

      console.log("Published Color, Spacing, Radii, and Font Size Variables to Figma native panel!");
    } catch (e) {
      console.warn("Figma Variables API note:", e);
    }
  }

  // 7. Publish Native Text Styles to Figma Text Styles Panel
  const TYPE_SCALE = [
    { name: "Micro / 10", size: 10, weight: "Medium" },
    { name: "Caption / 12", size: 12, weight: "Regular" },
    { name: "Body / 14", size: 14, weight: "Regular" },
    { name: "Subhead / 16", size: 16, weight: "Bold" },
    { name: "Title / 20", size: 20, weight: "Bold" },
    { name: "Heading / 24", size: 24, weight: "Bold" },
    { name: "Hero / 32", size: 32, weight: "Bold" }
  ];

  for (const t of TYPE_SCALE) {
    try {
      let style = figma.getLocalTextStyles().find(s => s.name === `Instagram Typography / ${t.name}`);
      if (!style) style = figma.createTextStyle();
      style.name = `Instagram Typography / ${t.name}`;
      style.fontName = { family: "DM Sans", style: t.weight };
      style.fontSize = t.size;
    } catch (e) {}
  }

  console.log("Instagram Variables & Local Text Styles published successfully!");
})();
