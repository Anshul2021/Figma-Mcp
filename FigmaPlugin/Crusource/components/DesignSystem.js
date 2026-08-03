// Generated Figma Script: Crusource Enterprise Design System Component Library (ComponentSets & Variants)
// Project: Crusource
// File: Crusource/components/DesignSystem.js
// Compliance: Instrument Sans font, Crusource Orange (#FF7700), Native ComponentSets (figma.combineAsVariants()), Pure HUG Height & Width on Buttons/Badges (Zero 100px height bug!).

(async function(figma) {
  // ── 1. Color Tokens & Typography ──
  const COLOR_PRIMARY = { r: 1.000, g: 0.467, b: 0.000 };       // #FF7700 Crusource Orange
  const COLOR_PRIMARY_HOVER = { r: 0.878, g: 0.408, b: 0.000 }; // #E06800 Orange Dark
  const COLOR_PRIMARY_TINT = { r: 1.000, g: 0.941, b: 0.902 };  // #FFF0E6 Soft Orange Tint
  const COLOR_TEXT_HEAD = { r: 0.059, g: 0.090, b: 0.165 };      // #0F172A Slate 900
  const COLOR_TEXT_BODY = { r: 0.200, g: 0.255, b: 0.333 };      // #334155 Slate 700
  const COLOR_TEXT_MUTED = { r: 0.392, g: 0.455, b: 0.545 };     // #64748B Slate 500
  const COLOR_TEXT_DISABLED = { r: 0.596, g: 0.639, b: 0.702 };  // #94A3B8 Slate 400
  const COLOR_BORDER = { r: 0.898, g: 0.906, b: 0.922 };        // #E5E7EB Slate 200
  const COLOR_BORDER_LIGHT = { r: 0.945, g: 0.961, b: 0.976 };  // #F1F5F9 Slate 100
  const COLOR_BG = { r: 0.973, g: 0.980, b: 0.988 };            // #F8FAFC Slate 50
  const COLOR_SURFACE = { r: 1.000, g: 1.000, b: 1.000 };       // #FFFFFF Pure White
  
  const COLOR_SUCCESS = { r: 0.063, g: 0.725, b: 0.451 };       // #10B981 Emerald
  const COLOR_SUCCESS_BG = { r: 0.902, g: 0.980, b: 0.941 };    // #E6FAF0 Emerald Soft
  const COLOR_WARNING = { r: 0.961, g: 0.620, b: 0.043 };       // #F59E0B Amber
  const COLOR_WARNING_BG = { r: 0.996, g: 0.953, b: 0.780 };    // #FEF3C7 Amber Soft
  const COLOR_DANGER = { r: 0.937, g: 0.267, b: 0.267 };        // #EF4444 Red
  const COLOR_DANGER_BG = { r: 0.996, g: 0.886, b: 0.886 };     // #FEE2E2 Red Soft
  const COLOR_INFO = { r: 0.231, g: 0.510, b: 0.965 };          // #3B82F6 Blue
  const COLOR_INFO_BG = { r: 0.937, g: 0.965, b: 1.000 };       // #EFF6FF Blue Soft

  let PRIMARY_FONT = "Instrument Sans";
  try {
    await figma.loadFontAsync({ family: "Instrument Sans", style: "Bold" });
    await figma.loadFontAsync({ family: "Instrument Sans", style: "Medium" });
    await figma.loadFontAsync({ family: "Instrument Sans", style: "Regular" });
  } catch (e) {
    PRIMARY_FONT = "Inter";
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  }

  function createText(text, fontSize = 14, style = "Regular", color = COLOR_TEXT_BODY) {
    const node = figma.createText();
    node.fontName = { family: PRIMARY_FONT, style };
    node.fontSize = fontSize;
    node.characters = text;
    node.fills = [{ type: 'SOLID', color }];
    return node;
  }

  // Remove existing design system frame if present
  const existingFrame = figma.currentPage.findChild(n => n.name === "Crusource Enterprise Design System");
  if (existingFrame) existingFrame.remove();

  // ── 2. Main Design System Canvas Frame (1600px width) ──
  const dsFrame = figma.createFrame();
  dsFrame.name = "Crusource Enterprise Design System";
  dsFrame.layoutMode = "VERTICAL";
  dsFrame.paddingLeft = 40; dsFrame.paddingRight = 40;
  dsFrame.paddingTop = 40; dsFrame.paddingBottom = 40;
  dsFrame.itemSpacing = 32;
  dsFrame.cornerRadius = 16;
  dsFrame.fills = [{ type: 'SOLID', color: COLOR_BG }];
  dsFrame.resize(1600, 2400);
  dsFrame.primaryAxisSizingMode = "AUTO";
  dsFrame.counterAxisSizingMode = "FIXED";

  // Header Banner Card
  const headerCard = figma.createFrame();
  headerCard.name = "HeaderBanner";
  headerCard.layoutMode = "VERTICAL";
  headerCard.paddingLeft = 32; headerCard.paddingRight = 32;
  headerCard.paddingTop = 24; headerCard.paddingBottom = 24;
  headerCard.itemSpacing = 8;
  headerCard.cornerRadius = 12;
  headerCard.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  headerCard.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  headerCard.primaryAxisSizingMode = "AUTO";
  headerCard.counterAxisSizingMode = "AUTO";

  headerCard.appendChild(createText("Crusource Enterprise Design System v1.0", 24, "Bold", COLOR_TEXT_HEAD));
  headerCard.appendChild(createText("Native Figma ComponentSets with Interactive Inspector Dropdowns & Pure Hug-Height Auto Layout.", 14, "Regular", COLOR_TEXT_MUTED));
  dsFrame.appendChild(headerCard);
  headerCard.layoutSizingHorizontal = "FILL";

  function createSectionCard(title) {
    const card = figma.createFrame();
    card.name = `SectionCard / ${title}`;
    card.layoutMode = "VERTICAL";
    card.paddingLeft = 24; card.paddingRight = 24;
    card.paddingTop = 20; card.paddingBottom = 20;
    card.itemSpacing = 16;
    card.cornerRadius = 12;
    card.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
    card.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
    card.primaryAxisSizingMode = "AUTO";
    card.counterAxisSizingMode = "AUTO";

    const head = createText(title, 18, "Bold", COLOR_TEXT_HEAD);
    card.appendChild(head);
    return card;
  }

  // ── PILLAR 1: COLOR TOKEN SCALE SYSTEM ──
  const colorSec = createSectionCard("1. Color Token Scale System");
  const colorRow = figma.createFrame();
  colorRow.name = "ColorSwatchesRow";
  colorRow.layoutMode = "HORIZONTAL";
  colorRow.itemSpacing = 16;
  colorRow.primaryAxisSizingMode = "AUTO";
  colorRow.counterAxisSizingMode = "AUTO";

  function createSwatch(name, hexLabel, rgbColor) {
    const sw = figma.createFrame();
    sw.name = `Swatch_${name}`;
    sw.layoutMode = "VERTICAL";
    sw.paddingLeft = 12; sw.paddingRight = 12;
    sw.paddingTop = 12; sw.paddingBottom = 12;
    sw.itemSpacing = 8;
    sw.cornerRadius = 8;
    sw.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
    sw.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
    sw.primaryAxisSizingMode = "AUTO";
    sw.counterAxisSizingMode = "AUTO";

    const box = figma.createFrame();
    box.resize(100, 48);
    box.cornerRadius = 6;
    box.fills = [{ type: 'SOLID', color: rgbColor }];
    sw.appendChild(box);

    sw.appendChild(createText(name, 12, "Bold", COLOR_TEXT_HEAD));
    sw.appendChild(createText(hexLabel, 10, "Medium", COLOR_TEXT_MUTED));
    return sw;
  }

  colorRow.appendChild(createSwatch("Primary", "#FF7700", COLOR_PRIMARY));
  colorRow.appendChild(createSwatch("Primary Light", "#FFF0E6", COLOR_PRIMARY_TINT));
  colorRow.appendChild(createSwatch("Slate Head", "#0F172A", COLOR_TEXT_HEAD));
  colorRow.appendChild(createSwatch("Slate Body", "#334155", COLOR_TEXT_BODY));
  colorRow.appendChild(createSwatch("Slate Muted", "#64748B", COLOR_TEXT_MUTED));
  colorRow.appendChild(createSwatch("Border", "#E5E7EB", COLOR_BORDER));
  colorRow.appendChild(createSwatch("Success", "#10B981", COLOR_SUCCESS));
  colorRow.appendChild(createSwatch("Warning", "#F59E0B", COLOR_WARNING));
  colorRow.appendChild(createSwatch("Danger", "#EF4444", COLOR_DANGER));
  colorSec.appendChild(colorRow);
  dsFrame.appendChild(colorSec);
  colorSec.layoutSizingHorizontal = "FILL";

  // ── PILLAR 2: TYPOGRAPHY SCALE SYSTEM ──
  const typeSec = createSectionCard("2. Strict Even Typography Scale System (Instrument Sans)");
  typeSec.appendChild(createText("Display 32px Bold — Candidate Onboarding Portal", 32, "Bold", COLOR_TEXT_HEAD));
  typeSec.appendChild(createText("Title 24px Bold — Section Heading Title", 24, "Bold", COLOR_TEXT_HEAD));
  typeSec.appendChild(createText("Header 20px Bold — Card Module Header", 20, "Bold", COLOR_TEXT_HEAD));
  typeSec.appendChild(createText("Subhead 16px Medium — Subsection label text styling", 16, "Medium", COLOR_TEXT_BODY));
  typeSec.appendChild(createText("Body 14px Regular — Primary readable paragraph and form label typography scale.", 14, "Regular", COLOR_TEXT_BODY));
  typeSec.appendChild(createText("Caption 12px Medium — Secondary captions, table header labels, and info metadata.", 12, "Medium", COLOR_TEXT_MUTED));
  typeSec.appendChild(createText("Micro 10px Bold — Status tags, count badges, micro notification chips.", 10, "Bold", COLOR_TEXT_MUTED));
  dsFrame.appendChild(typeSec);
  typeSec.layoutSizingHorizontal = "FILL";

  // ── PILLAR 3A: BUTTON COMPONENTSET (Pure Hug Width & Height) ──
  const btnSec = createSectionCard("3. Button ComponentSet (Figma Inspector Variant & State Dropdowns)");

  const buttonVariantsData = [
    { variant: "Primary", state: "Default", bg: COLOR_PRIMARY, txt: COLOR_SURFACE },
    { variant: "Primary", state: "Hover", bg: COLOR_PRIMARY_HOVER, txt: COLOR_SURFACE },
    { variant: "Primary", state: "Disabled", bg: COLOR_BORDER_LIGHT, txt: COLOR_TEXT_DISABLED },
    
    { variant: "Secondary", state: "Default", bg: COLOR_PRIMARY_TINT, txt: COLOR_PRIMARY },
    { variant: "Secondary", state: "Hover", bg: COLOR_PRIMARY_TINT, txt: COLOR_PRIMARY_HOVER },
    { variant: "Secondary", state: "Disabled", bg: COLOR_BORDER_LIGHT, txt: COLOR_TEXT_DISABLED },
    
    { variant: "Outline", state: "Default", bg: COLOR_SURFACE, txt: COLOR_TEXT_BODY, stroke: COLOR_BORDER },
    { variant: "Outline", state: "Hover", bg: COLOR_BORDER_LIGHT, txt: COLOR_TEXT_HEAD, stroke: COLOR_BORDER },
    { variant: "Outline", state: "Disabled", bg: COLOR_SURFACE, txt: COLOR_TEXT_DISABLED, stroke: COLOR_BORDER_LIGHT },

    { variant: "Danger", state: "Default", bg: COLOR_DANGER, txt: COLOR_SURFACE }
  ];

  const buttonCompNodes = [];
  for (const v of buttonVariantsData) {
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

    // PURE HUG SIZING (No resize() call to ruin AUTO height!)
    comp.primaryAxisSizingMode = "AUTO";
    comp.counterAxisSizingMode = "AUTO";

    comp.appendChild(createText(`Button (${v.variant} ${v.state})`, 12, "Bold", v.txt));
    buttonCompNodes.push(comp);
  }

  const buttonSet = figma.combineAsVariants(buttonCompNodes, btnSec);
  buttonSet.name = "Button";
  buttonSet.description = "Crusource Master Button Set with Variant & State Dropdowns";
  buttonSet.layoutMode = "HORIZONTAL";
  buttonSet.itemSpacing = 16;
  buttonSet.paddingLeft = 16; buttonSet.paddingRight = 16;
  buttonSet.paddingTop = 16; buttonSet.paddingBottom = 16;
  buttonSet.primaryAxisSizingMode = "AUTO";
  buttonSet.counterAxisSizingMode = "AUTO";

  dsFrame.appendChild(btnSec);
  btnSec.layoutSizingHorizontal = "FILL";

  // ── PILLAR 3B: FORM INPUT COMPONENTSET ──
  const inputSec = createSectionCard("4. Form Input ComponentSet (Figma Inspector State Dropdown)");

  const inputVariantsData = [
    { state: "Default", label: "Full Name", text: "e.g. Anshul Rawat", stroke: COLOR_BORDER, bg: COLOR_SURFACE, txtColor: COLOR_TEXT_MUTED },
    { state: "Focused", label: "Email Address", text: "anshul.rawat@crusource.com", stroke: COLOR_PRIMARY, bg: COLOR_SURFACE, txtColor: COLOR_TEXT_HEAD, weight: 2 },
    { state: "Error", label: "Portfolio URL", text: "Invalid URL format", stroke: COLOR_DANGER, bg: COLOR_SURFACE, txtColor: COLOR_DANGER, weight: 1 },
    { state: "Disabled", label: "Read-only ID", text: "CND-99824-DISABLED", stroke: COLOR_BORDER_LIGHT, bg: COLOR_BORDER_LIGHT, txtColor: COLOR_TEXT_DISABLED }
  ];

  const inputCompNodes = [];
  for (const iv of inputVariantsData) {
    const comp = figma.createComponent();
    comp.name = `State=${iv.state}`;
    comp.layoutMode = "VERTICAL";
    comp.itemSpacing = 6;
    comp.primaryAxisSizingMode = "AUTO";
    comp.counterAxisSizingMode = "AUTO";

    comp.appendChild(createText(iv.label, 12, "Medium", iv.state === "Error" ? COLOR_DANGER : COLOR_TEXT_HEAD));

    const inputBox = figma.createFrame();
    inputBox.name = "InputBox";
    inputBox.layoutMode = "HORIZONTAL";
    inputBox.paddingLeft = 12; inputBox.paddingRight = 12;
    inputBox.paddingTop = 10; inputBox.paddingBottom = 10;
    inputBox.cornerRadius = 6;
    inputBox.fills = [{ type: 'SOLID', color: iv.bg }];
    inputBox.strokes = [{ type: 'SOLID', color: iv.stroke }];
    if (iv.weight) inputBox.strokeWeight = iv.weight;
    inputBox.resize(280, 40);

    const txt = createText(iv.text, 14, "Regular", iv.txtColor);
    inputBox.appendChild(txt);
    txt.layoutSizingHorizontal = "FILL";

    comp.appendChild(inputBox);
    inputCompNodes.push(comp);
  }

  const inputSet = figma.combineAsVariants(inputCompNodes, inputSec);
  inputSet.name = "Input";
  inputSet.description = "Crusource Master Input Set with State Dropdown";
  inputSet.layoutMode = "HORIZONTAL";
  inputSet.itemSpacing = 16;
  inputSet.paddingLeft = 16; inputSet.paddingRight = 16;
  inputSet.paddingTop = 16; inputSet.paddingBottom = 16;
  inputSet.primaryAxisSizingMode = "AUTO";
  inputSet.counterAxisSizingMode = "AUTO";

  dsFrame.appendChild(inputSec);
  inputSec.layoutSizingHorizontal = "FILL";

  // ── PILLAR 3C: BADGE COMPONENTSET (Pure Hug Height) ──
  const badgeSec = createSectionCard("5. Status Badge ComponentSet (Figma Inspector Variant Dropdown)");

  const badgeVariantsData = [
    { variant: "Primary", bg: COLOR_PRIMARY_TINT, txt: COLOR_PRIMARY },
    { variant: "Success", bg: COLOR_SUCCESS_BG, txt: COLOR_SUCCESS },
    { variant: "Warning", bg: COLOR_WARNING_BG, txt: COLOR_WARNING },
    { variant: "Danger", bg: COLOR_DANGER_BG, txt: COLOR_DANGER },
    { variant: "Info", bg: COLOR_INFO_BG, txt: COLOR_INFO },
    { variant: "Neutral", bg: COLOR_BORDER_LIGHT, txt: COLOR_TEXT_BODY }
  ];

  const badgeCompNodes = [];
  for (const bv of badgeVariantsData) {
    const comp = figma.createComponent();
    comp.name = `Variant=${bv.variant}`;
    comp.layoutMode = "HORIZONTAL";
    comp.paddingLeft = 10; comp.paddingRight = 10;
    comp.paddingTop = 4; comp.paddingBottom = 4;
    comp.cornerRadius = 4;
    comp.fills = [{ type: 'SOLID', color: bv.bg }];
    comp.primaryAxisSizingMode = "AUTO";
    comp.counterAxisSizingMode = "AUTO";

    comp.appendChild(createText(bv.variant.toUpperCase(), 10, "Bold", bv.txt));
    badgeCompNodes.push(comp);
  }

  const badgeSet = figma.combineAsVariants(badgeCompNodes, badgeSec);
  badgeSet.name = "Badge";
  badgeSet.description = "Crusource Master Status Badge Set with Variant Dropdown";
  badgeSet.layoutMode = "HORIZONTAL";
  badgeSet.itemSpacing = 16;
  badgeSet.paddingLeft = 16; badgeSet.paddingRight = 16;
  badgeSet.paddingTop = 16; badgeSet.paddingBottom = 16;
  badgeSet.primaryAxisSizingMode = "AUTO";
  badgeSet.counterAxisSizingMode = "AUTO";

  dsFrame.appendChild(badgeSec);
  badgeSec.layoutSizingHorizontal = "FILL";

  // ── 6. Scroll & Zoom into View ──
  figma.currentPage.appendChild(dsFrame);
  figma.viewport.scrollAndZoomIntoView([dsFrame]);
  figma.notify("Created Crusource Enterprise Design System with pure Hug Height & zero 100px bugs!", { timeout: 2500 });

})(figma);
