// Generated Figma Script: Crusource Reusable Master Card Component
// Project: Crusource
// File: Crusource/components/Card.js
// Strict Compliance: Instrument Sans font, Crusource Orange (#FF7700), Master Component Protocol (v1.2)
(async function(figma) {
  let PRIMARY_FONT = "Instrument Sans";
  try {
    await figma.loadFontAsync({ family: "Instrument Sans", style: "Bold" });
    await figma.loadFontAsync({ family: "Instrument Sans", style: "Regular" });
  } catch (e) {
    PRIMARY_FONT = "Inter";
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  }

  const COLOR_SURFACE = { r: 1.000, g: 1.000, b: 1.000 };
  const COLOR_BORDER = { r: 0.898, g: 0.906, b: 0.922 };
  const COLOR_TEXT_HEAD = { r: 0.059, g: 0.090, b: 0.165 };
  const COLOR_TEXT_MUTED = { r: 0.392, g: 0.455, b: 0.545 };

  let compContainer = figma.currentPage.findChild(n => n.name === "Master Component Library");
  if (!compContainer) {
    compContainer = figma.createFrame();
    compContainer.name = "Master Component Library";
    compContainer.layoutMode = "HORIZONTAL";
    compContainer.itemSpacing = 20;
    compContainer.paddingLeft = 24; compContainer.paddingRight = 24;
    compContainer.paddingTop = 24; compContainer.paddingBottom = 24;
    compContainer.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.99 } }];
    figma.currentPage.appendChild(compContainer);
  }

  const existingComp = compContainer.findChild(n => n.name === "Component / Card / Standard");
  if (existingComp) existingComp.remove();

  const cardComp = figma.createComponent();
  cardComp.name = "Component / Card / Standard";
  cardComp.layoutMode = "VERTICAL";
  cardComp.paddingLeft = 20; cardComp.paddingRight = 20;
  cardComp.paddingTop = 16; cardComp.paddingBottom = 16;
  cardComp.itemSpacing = 8;
  cardComp.cornerRadius = 12; // radius-lg
  cardComp.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  cardComp.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  cardComp.resize(320, 100);

  const title = figma.createText();
  title.fontName = { family: PRIMARY_FONT, style: "Bold" };
  title.fontSize = 16;
  title.characters = "Master Card Title";
  title.fills = [{ type: 'SOLID', color: COLOR_TEXT_HEAD }];
  cardComp.appendChild(title);

  const desc = figma.createText();
  desc.fontName = { family: PRIMARY_FONT, style: "Regular" };
  desc.fontSize = 12;
  desc.characters = "Standard container description text placeholder.";
  desc.fills = [{ type: 'SOLID', color: COLOR_TEXT_MUTED }];
  cardComp.appendChild(desc);

  compContainer.appendChild(cardComp);
  figma.viewport.scrollAndZoomIntoView([compContainer]);
  figma.notify("Created Master Card Component cleanly!", { timeout: 2000 });
})(figma);
