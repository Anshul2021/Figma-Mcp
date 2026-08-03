// Generated Figma Script: Crusource Master Button Component Set (Variant Dropdowns)
// Project: Crusource
// File: Crusource/components/Button.js
// Compliance: Instrument Sans font, Crusource Orange (#FF7700), figma.combineAsVariants() with Pure HUG Height (Zero 100px bug).

(async function(figma) {
  let PRIMARY_FONT = "Instrument Sans";
  try {
    await figma.loadFontAsync({ family: "Instrument Sans", style: "Bold" });
  } catch (e) {
    PRIMARY_FONT = "Inter";
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  }

  const COLOR_PRIMARY = { r: 1.000, g: 0.467, b: 0.000 };       // #FF7700 Crusource Orange
  const COLOR_PRIMARY_HOVER = { r: 0.878, g: 0.408, b: 0.000 }; // #E06800 Orange Dark
  const COLOR_PRIMARY_TINT = { r: 1.000, g: 0.941, b: 0.902 };  // #FFF0E6 Soft Orange Tint
  const COLOR_TEXT_HEAD = { r: 0.059, g: 0.090, b: 0.165 };      // #0F172A Slate 900
  const COLOR_TEXT_BODY = { r: 0.200, g: 0.255, b: 0.333 };      // #334155 Slate 700
  const COLOR_TEXT_DISABLED = { r: 0.596, g: 0.639, b: 0.702 };  // #94A3B8 Slate 400
  const COLOR_BORDER = { r: 0.898, g: 0.906, b: 0.922 };        // #E5E7EB Slate 200
  const COLOR_BORDER_LIGHT = { r: 0.945, g: 0.961, b: 0.976 };  // #F1F5F9 Slate 100
  const COLOR_SURFACE = { r: 1.000, g: 1.000, b: 1.000 };       // #FFFFFF Pure White
  const COLOR_DANGER = { r: 0.937, g: 0.267, b: 0.267 };        // #EF4444 Red

  // Master Component Library Frame
  let compContainer = figma.currentPage.findChild(n => n.name === "Master Component Library");
  if (!compContainer) {
    compContainer = figma.createFrame();
    compContainer.name = "Master Component Library";
    compContainer.layoutMode = "VERTICAL";
    compContainer.itemSpacing = 24;
    compContainer.paddingLeft = 32; compContainer.paddingRight = 32;
    compContainer.paddingTop = 32; compContainer.paddingBottom = 32;
    compContainer.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.99 } }];
    figma.currentPage.appendChild(compContainer);
  }

  // Remove existing Button ComponentSet if present
  const existingSet = compContainer.findChild(n => n.name === "Button");
  if (existingSet) existingSet.remove();

  // Create Button Variants
  const variants = [
    { variant: "Primary", state: "Default", bg: COLOR_PRIMARY, txt: COLOR_SURFACE },
    { variant: "Primary", state: "Hover", bg: COLOR_PRIMARY_HOVER, txt: COLOR_SURFACE },
    { variant: "Primary", state: "Active", bg: COLOR_PRIMARY_HOVER, txt: COLOR_SURFACE },
    { variant: "Primary", state: "Disabled", bg: COLOR_BORDER_LIGHT, txt: COLOR_TEXT_DISABLED },
    
    { variant: "Secondary", state: "Default", bg: COLOR_PRIMARY_TINT, txt: COLOR_PRIMARY },
    { variant: "Secondary", state: "Hover", bg: COLOR_PRIMARY_TINT, txt: COLOR_PRIMARY_HOVER },
    { variant: "Secondary", state: "Disabled", bg: COLOR_BORDER_LIGHT, txt: COLOR_TEXT_DISABLED },
    
    { variant: "Outline", state: "Default", bg: COLOR_SURFACE, txt: COLOR_TEXT_BODY, stroke: COLOR_BORDER },
    { variant: "Outline", state: "Hover", bg: COLOR_BORDER_LIGHT, txt: COLOR_TEXT_HEAD, stroke: COLOR_BORDER },
    { variant: "Outline", state: "Disabled", bg: COLOR_SURFACE, txt: COLOR_TEXT_DISABLED, stroke: COLOR_BORDER_LIGHT },
    
    { variant: "Danger", state: "Default", bg: COLOR_DANGER, txt: COLOR_SURFACE }
  ];

  const componentNodes = [];

  for (const v of variants) {
    const comp = figma.createComponent();
    comp.name = `Variant=${v.variant}, State=${v.state}`;
    comp.layoutMode = "HORIZONTAL";
    comp.paddingLeft = 16; comp.paddingRight = 16;
    comp.paddingTop = 10; comp.paddingBottom = 10;
    comp.itemSpacing = 8;
    comp.cornerRadius = 6;
    comp.primaryAxisAlignItems = "CENTER";
    comp.counterAxisAlignItems = "CENTER";
    comp.fills = [{ type: 'SOLID', color: v.bg }];
    if (v.stroke) comp.strokes = [{ type: 'SOLID', color: v.stroke }];

    // Pure HUG sizing (No resize() call to ruin height!)
    comp.primaryAxisSizingMode = "AUTO";
    comp.counterAxisSizingMode = "AUTO";

    const label = figma.createText();
    label.fontName = { family: PRIMARY_FONT, style: "Bold" };
    label.fontSize = 12;
    label.characters = `Button (${v.variant} ${v.state})`;
    label.fills = [{ type: 'SOLID', color: v.txt }];
    comp.appendChild(label);

    componentNodes.push(comp);
  }

  // Combine into a single Figma ComponentSet & enable Auto Layout
  const buttonSet = figma.combineAsVariants(componentNodes, compContainer);
  buttonSet.name = "Button";
  buttonSet.description = "Crusource Master Button Component Set with Variant & State Dropdowns";
  buttonSet.layoutMode = "HORIZONTAL";
  buttonSet.itemSpacing = 16;
  buttonSet.paddingLeft = 16; buttonSet.paddingRight = 16;
  buttonSet.paddingTop = 16; buttonSet.paddingBottom = 16;
  buttonSet.primaryAxisSizingMode = "AUTO";
  buttonSet.counterAxisSizingMode = "AUTO";

  figma.viewport.scrollAndZoomIntoView([compContainer]);
  figma.notify("Published Crusource Button ComponentSet with pure Hug Height!", { timeout: 2500 });
})(figma);
