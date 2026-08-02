// Generated Figma Script: Premium Food Detail Screen (Pure Auto Layout)
// Project: FoodDeliveryApp
// File: FoodDeliveryApp/screens/food_detail.js
// Strict Compliance: core/autolayout.md & Execution Order Protocol (resize FIRST, sizingModes SECOND)
(async function(figma) {
  // 1. Load Mandatory Fonts (DM Sans from global/fonts.md)
  await figma.loadFontAsync({ family: "DM Sans", style: "Regular" });
  await figma.loadFontAsync({ family: "DM Sans", style: "Medium" });
  await figma.loadFontAsync({ family: "DM Sans", style: "Bold" });

  // 2. Clean Canvas Board
  const existingBoard = figma.currentPage.findChild(node => node.name === "Generated UI Screens");
  if (existingBoard) {
    existingBoard.remove();
  }

  // 3. Design System Tokens (FoodDeliveryApp theme)
  const COLOR_BG = { r: 0.976, g: 0.980, b: 0.984 };          // #F9FAFB
  const COLOR_SURFACE = { r: 1, g: 1, b: 1 };                 // #FFFFFF
  const COLOR_PRIMARY = { r: 0.902, g: 0.224, b: 0.447 };       // #E63971 Pink / Food Theme
  const COLOR_PRIMARY_LIGHT = { r: 0.992, g: 0.910, b: 0.933 }; // Soft Pink Tint
  const COLOR_TEXT = { r: 0.067, g: 0.094, b: 0.153 };         // #111827
  const COLOR_TEXT_MUTED = { r: 0.420, g: 0.447, b: 0.502 };    // #6B7280
  const COLOR_BORDER = { r: 0.898, g: 0.906, b: 0.922 };        // #E5E7EB
  const COLOR_STAR = { r: 0.960, g: 0.624, b: 0.043 };          // #F59E0B

  // Helper: Vector Icon Fetcher
  async function loadLucideIcon(iconName, size = 20, color = COLOR_TEXT) {
    try {
      const res = await fetch(`https://unpkg.com/lucide-static@latest/icons/${iconName}.svg`);
      const svgText = await res.text();
      const node = figma.createNodeFromSvg(svgText);
      node.resize(size, size);
      node.name = `Icon / ${iconName}`;
      const vectors = node.findAll(n => n.type === 'VECTOR');
      vectors.forEach(v => { v.strokes = [{ type: 'SOLID', color }]; });
      return node;
    } catch (err) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
      const node = figma.createNodeFromSvg(svg);
      node.resize(size, size);
      node.name = "Icon / fallback";
      const vectors = node.findAll(n => n.type === 'VECTOR');
      vectors.forEach(v => { v.strokes = [{ type: 'SOLID', color }]; });
      return node;
    }
  }

  // Helper: Apply Online Image
  async function applyOnlineImage(frameNode, imageUrl) {
    try {
      const image = await figma.createImageAsync(imageUrl);
      frameNode.fills = [{ type: 'IMAGE', scaleMode: 'FILL', imageHash: image.hash }];
    } catch (err) {
      frameNode.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
    }
  }

  // Helper: Text Node Creator
  function createText(content, fontSize, fontStyle = "Regular", color = COLOR_TEXT) {
    const text = figma.createText();
    text.fontName = { family: "DM Sans", style: fontStyle };
    text.fontSize = fontSize;
    text.characters = String(content);
    text.fills = [{ type: 'SOLID', color }];
    return text;
  }

  // Auto Layout Helper Functions (obeying Execution Order Protocol)
  function makeSpaceBetweenRow(name, fixedWidth) {
    const row = figma.createFrame();
    row.name = name;
    row.layoutMode = "HORIZONTAL";
    row.fills = [];
    row.resize(fixedWidth, 1);
    row.primaryAxisSizingMode = "FIXED";
    row.counterAxisSizingMode = "AUTO";
    row.primaryAxisAlignItems = "SPACE_BETWEEN";
    row.counterAxisAlignItems = "CENTER";
    return row;
  }

  function makeHugContainer(name, direction = "HORIZONTAL", spacing = 8) {
    const frame = figma.createFrame();
    frame.name = name;
    frame.layoutMode = direction;
    frame.fills = [];
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO";
    frame.itemSpacing = spacing;
    frame.counterAxisAlignItems = "CENTER";
    return frame;
  }

  function makeContentCard(name, fixedWidth, options = {}) {
    const card = figma.createFrame();
    card.name = name;
    card.layoutMode = "VERTICAL";
    card.fills = options.fills || [{ type: 'SOLID', color: COLOR_SURFACE }];
    if (options.cornerRadius) card.cornerRadius = options.cornerRadius;
    if (options.strokes) { card.strokes = options.strokes; card.strokeWeight = options.strokeWeight || 1; }
    card.itemSpacing = options.itemSpacing || 0;
    if (options.paddingLeft !== undefined) card.paddingLeft = options.paddingLeft;
    if (options.paddingRight !== undefined) card.paddingRight = options.paddingRight;
    if (options.paddingTop !== undefined) card.paddingTop = options.paddingTop;
    if (options.paddingBottom !== undefined) card.paddingBottom = options.paddingBottom;
    card.resize(fixedWidth, 1);
    card.counterAxisSizingMode = "FIXED";
    return card;
  }

  function finalizeHugHeight(frame) {
    frame.primaryAxisSizingMode = "AUTO";
  }

  // Root Board Container
  const board = figma.createFrame();
  board.name = "Generated UI Screens";
  board.layoutMode = "HORIZONTAL";
  board.fills = [];
  board.itemSpacing = 40;
  figma.currentPage.appendChild(board);

  // Screen Container: 375px x 812px Mobile Screen (Auto Layout VERTICAL)
  const screen = figma.createFrame();
  screen.name = "Screen / Food Detail AutoLayout";
  screen.layoutMode = "VERTICAL";
  screen.resize(375, 812);
  screen.primaryAxisSizingMode = "FIXED";
  screen.counterAxisSizingMode = "FIXED";
  screen.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  board.appendChild(screen);

  // ═══════════════════════════════════════════════════════════
  // SECTION 1: HERO BANNER WITH ABSOLUTE OVERLAY BUTTONS (260px)
  // ═══════════════════════════════════════════════════════════
  const heroFrame = figma.createFrame();
  heroFrame.name = "Hero Banner Frame";
  heroFrame.layoutMode = "VERTICAL";
  heroFrame.resize(375, 260);
  heroFrame.primaryAxisSizingMode = "FIXED";
  heroFrame.counterAxisSizingMode = "FIXED";
  heroFrame.clipsContent = true;
  await applyOnlineImage(heroFrame, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80");

  // Top Overlay Row (ABSOLUTE POSITIONING inside Auto Layout frame)
  const topOverlay = makeSpaceBetweenRow("Top Overlay Bar", 375);
  topOverlay.paddingLeft = 16; topOverlay.paddingRight = 16;
  topOverlay.paddingTop = 44; // Safe area
  topOverlay.paddingBottom = 12;

  heroFrame.appendChild(topOverlay);
  topOverlay.layoutPositioning = "ABSOLUTE";
  topOverlay.x = 0;
  topOverlay.y = 0;

  // Floating Back Button
  const backCircle = makeHugContainer("Back Btn", "HORIZONTAL", 0);
  backCircle.paddingLeft = 10; backCircle.paddingRight = 10;
  backCircle.paddingTop = 10; backCircle.paddingBottom = 10;
  backCircle.cornerRadius = 20;
  backCircle.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  backCircle.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.12 },
    offset: { x: 0, y: 4 },
    radius: 10,
    visible: true,
    blendMode: 'NORMAL'
  }];
  backCircle.appendChild(await loadLucideIcon("arrow-left", 18, COLOR_TEXT));
  topOverlay.appendChild(backCircle);

  // Floating Favorite Button
  const heartCircle = makeHugContainer("Favorite Btn", "HORIZONTAL", 0);
  heartCircle.paddingLeft = 10; heartCircle.paddingRight = 10;
  heartCircle.paddingTop = 10; heartCircle.paddingBottom = 10;
  heartCircle.cornerRadius = 20;
  heartCircle.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  heartCircle.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.12 },
    offset: { x: 0, y: 4 },
    radius: 10,
    visible: true,
    blendMode: 'NORMAL'
  }];
  heartCircle.appendChild(await loadLucideIcon("heart", 18, COLOR_PRIMARY));
  topOverlay.appendChild(heartCircle);

  heroFrame.appendChild(topOverlay);
  screen.appendChild(heroFrame);

  // ═══════════════════════════════════════════════════════════
  // SECTION 2: MIDDLE SCROLL AREA (375px x 468px)
  // ═══════════════════════════════════════════════════════════
  const scrollArea = figma.createFrame();
  scrollArea.name = "Section / Details Scroll Content";
  scrollArea.layoutMode = "VERTICAL";
  scrollArea.resize(375, 468);
  scrollArea.primaryAxisSizingMode = "FIXED";
  scrollArea.counterAxisSizingMode = "FIXED";
  scrollArea.itemSpacing = 16;
  scrollArea.paddingLeft = 20; scrollArea.paddingRight = 20;
  scrollArea.paddingTop = 16; scrollArea.paddingBottom = 16;
  scrollArea.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  scrollArea.clipsContent = true;

  // Bestseller Pink Tag Badge
  const tagBadge = makeHugContainer("Badge / Bestseller", "HORIZONTAL", 0);
  tagBadge.paddingLeft = 10; tagBadge.paddingRight = 10;
  tagBadge.paddingTop = 4; tagBadge.paddingBottom = 4;
  tagBadge.cornerRadius = 6;
  tagBadge.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }];
  tagBadge.appendChild(createText("BESTSELLER", 10, "Bold", COLOR_PRIMARY));
  scrollArea.appendChild(tagBadge);

  // Header Title & Price Row (Space Between)
  const titlePriceRow = makeSpaceBetweenRow("Title & Price Row", 335);
  
  const titleCol = makeHugContainer("Title Column", "VERTICAL", 4);
  titleCol.counterAxisAlignItems = "MIN";
  titleCol.appendChild(createText("Truffle Mushroom Burger", 20, "Bold", COLOR_TEXT));
  titleCol.appendChild(createText("Burger & Co. · Gourmet American Kitchen", 12, "Medium", COLOR_TEXT_MUTED));
  titlePriceRow.appendChild(titleCol);

  titlePriceRow.appendChild(createText("$14.50", 22, "Bold", COLOR_PRIMARY));
  scrollArea.appendChild(titlePriceRow);

  // Rating, Preparation Time, Calories Meta Badges
  const metaPillsRow = makeHugContainer("Meta Badges Row", "HORIZONTAL", 10);
  
  // Rating Pill
  const ratingPill = makeHugContainer("Pill / Rating", "HORIZONTAL", 6);
  ratingPill.paddingLeft = 12; ratingPill.paddingRight = 12;
  ratingPill.paddingTop = 6; ratingPill.paddingBottom = 6;
  ratingPill.cornerRadius = 16;
  ratingPill.fills = [{ type: 'SOLID', color: COLOR_BG }];
  ratingPill.appendChild(await loadLucideIcon("star", 14, COLOR_STAR));
  ratingPill.appendChild(createText("4.8 (230+)", 11, "Bold", COLOR_TEXT));
  metaPillsRow.appendChild(ratingPill);

  // Time Pill
  const timePill = makeHugContainer("Pill / Time", "HORIZONTAL", 6);
  timePill.paddingLeft = 12; timePill.paddingRight = 12;
  timePill.paddingTop = 6; timePill.paddingBottom = 6;
  timePill.cornerRadius = 16;
  timePill.fills = [{ type: 'SOLID', color: COLOR_BG }];
  timePill.appendChild(await loadLucideIcon("clock", 14, COLOR_TEXT_MUTED));
  timePill.appendChild(createText("20-25 min", 11, "Medium", COLOR_TEXT_MUTED));
  metaPillsRow.appendChild(timePill);

  // Calorie Pill
  const calPill = makeHugContainer("Pill / Cal", "HORIZONTAL", 6);
  calPill.paddingLeft = 12; calPill.paddingRight = 12;
  calPill.paddingTop = 6; calPill.paddingBottom = 6;
  calPill.cornerRadius = 16;
  calPill.fills = [{ type: 'SOLID', color: COLOR_BG }];
  calPill.appendChild(await loadLucideIcon("flame", 14, COLOR_PRIMARY));
  calPill.appendChild(createText("650 kcal", 11, "Medium", COLOR_TEXT_MUTED));
  metaPillsRow.appendChild(calPill);

  scrollArea.appendChild(metaPillsRow);

  // Divider Line
  const divider = figma.createFrame();
  divider.name = "Divider Line";
  divider.resize(335, 1);
  divider.fills = [{ type: 'SOLID', color: COLOR_BORDER }];
  scrollArea.appendChild(divider);

  // Description Section
  const descBlock = makeHugContainer("Description Block", "VERTICAL", 6);
  descBlock.counterAxisAlignItems = "MIN";
  descBlock.appendChild(createText("About this dish", 14, "Bold", COLOR_TEXT));
  
  const descText = createText("Double-smashed 100% Angus beef patty topped with pan-seared wild mushrooms, melt-in-your-mouth aged Swiss cheese, homemade white truffle aioli, and crispy fried shallots served on a toasted artisanal brioche bun.", 12, "Regular", COLOR_TEXT_MUTED);
  scrollArea.appendChild(descBlock);
  descBlock.appendChild(descText);
  descText.layoutAlign = "STRETCH";
  descText.textAutoResize = "HEIGHT";

  // Customization Section: Choice of Cheese
  const optionsBlock = makeHugContainer("Options Block", "VERTICAL", 8);
  optionsBlock.counterAxisAlignItems = "MIN";
  optionsBlock.appendChild(createText("Choose your cheese (Required)", 14, "Bold", COLOR_TEXT));

  const options = [
    { label: "Aged Swiss Cheese", price: "Included", selected: true },
    { label: "Smoked Gouda Cheese", price: "+$1.00", selected: false },
    { label: "Sharp Wisconsin Cheddar", price: "+$0.50", selected: false }
  ];

  for (const opt of options) {
    const optRow = makeSpaceBetweenRow(`Option / ${opt.label}`, 335);
    optRow.paddingLeft = 12; optRow.paddingRight = 12;
    optRow.paddingTop = 10; optRow.paddingBottom = 10;
    optRow.cornerRadius = 10;
    optRow.fills = opt.selected 
      ? [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }] 
      : [{ type: 'SOLID', color: COLOR_BG }];
    optRow.strokes = opt.selected ? [{ type: 'SOLID', color: COLOR_PRIMARY }] : [{ type: 'SOLID', color: COLOR_BORDER }];
    optRow.strokeWeight = 1;

    const leftGroup = makeHugContainer("Left Group", "HORIZONTAL", 8);
    leftGroup.appendChild(await loadLucideIcon(opt.selected ? "check-circle-2" : "circle", 16, opt.selected ? COLOR_PRIMARY : COLOR_TEXT_MUTED));
    leftGroup.appendChild(createText(opt.label, 12, opt.selected ? "Bold" : "Medium", COLOR_TEXT));
    optRow.appendChild(leftGroup);

    optRow.appendChild(createText(opt.price, 12, "Bold", opt.selected ? COLOR_PRIMARY : COLOR_TEXT_MUTED));
    optionsBlock.appendChild(optRow);
  }

  scrollArea.appendChild(optionsBlock);
  screen.appendChild(scrollArea);

  // ═══════════════════════════════════════════════════════════
  // SECTION 3: FIXED BOTTOM BAR (375px x 84px)
  // ═══════════════════════════════════════════════════════════
  const bottomBar = makeSpaceBetweenRow("Footer / Add to Basket Bar", 375);
  bottomBar.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  bottomBar.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  bottomBar.strokeWeight = 1;
  bottomBar.paddingLeft = 20; bottomBar.paddingRight = 20;
  bottomBar.paddingTop = 16; bottomBar.paddingBottom = 24;
  bottomBar.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.06 },
    offset: { x: 0, y: -4 },
    radius: 12,
    visible: true,
    blendMode: 'NORMAL'
  }];

  // Stepper Pill (- 1 +)
  const stepper = makeHugContainer("Quantity Stepper", "HORIZONTAL", 14);
  stepper.paddingLeft = 14; stepper.paddingRight = 14;
  stepper.paddingTop = 10; stepper.paddingBottom = 10;
  stepper.cornerRadius = 20;
  stepper.fills = [{ type: 'SOLID', color: COLOR_BG }];
  stepper.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];

  stepper.appendChild(await loadLucideIcon("minus", 14, COLOR_TEXT));
  stepper.appendChild(createText("1", 14, "Bold", COLOR_TEXT));
  stepper.appendChild(await loadLucideIcon("plus", 14, COLOR_PRIMARY));
  bottomBar.appendChild(stepper);

  // Primary Add to Basket Button
  const ctaBtn = makeHugContainer("CTA / Add to Basket", "HORIZONTAL", 8);
  ctaBtn.paddingLeft = 24; ctaBtn.paddingRight = 24;
  ctaBtn.paddingTop = 12; ctaBtn.paddingBottom = 12;
  ctaBtn.cornerRadius = 22;
  ctaBtn.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
  ctaBtn.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0.902, g: 0.224, b: 0.447, a: 0.3 },
    offset: { x: 0, y: 4 },
    radius: 12,
    visible: true,
    blendMode: 'NORMAL'
  }];
  ctaBtn.appendChild(await loadLucideIcon("shopping-bag", 16, COLOR_SURFACE));
  ctaBtn.appendChild(createText("Add to Basket · $14.50", 13, "Bold", COLOR_SURFACE));
  bottomBar.appendChild(ctaBtn);

  screen.appendChild(bottomBar);

  // 4. Viewport Focus
  figma.viewport.scrollAndZoomIntoView([board]);
  figma.notify("Converted Food Detail Screen to Pure Auto Layout!", { timeout: 2500 });
})(figma);
