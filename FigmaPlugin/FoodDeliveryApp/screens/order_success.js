// Generated Figma Script: Food Delivery App — Order Success & Tracking Screen
// Project: FoodDeliveryApp
// File: FoodDeliveryApp/screens/order_success.js
// Strict Compliance: DM Sans font, 0 emojis, vector Lucide icons with 1.5px stroke width, Auto Layout protocol, even font scale (10, 12, 14, 16, 20, 24, 32)
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

  // 3. Design System Tokens (FoodDeliveryApp Zomato Red theme)
  const COLOR_BG = { r: 0.976, g: 0.980, b: 0.984 };          // #F9FAFB
  const COLOR_SURFACE = { r: 1.000, g: 1.000, b: 1.000 };     // #FFFFFF
  const COLOR_PRIMARY = { r: 0.886, g: 0.216, b: 0.267 };     // #E23744 Zomato Red
  const COLOR_PRIMARY_LIGHT = { r: 0.992, g: 0.910, b: 0.918 }; // #FDE8EA Soft Red Tint
  const COLOR_TEXT = { r: 0.067, g: 0.094, b: 0.153 };         // #111827
  const COLOR_TEXT_MUTED = { r: 0.420, g: 0.447, b: 0.502 };    // #6B7280
  const COLOR_BORDER = { r: 0.898, g: 0.906, b: 0.922 };        // #E5E7EB
  const COLOR_SUCCESS = { r: 0.020, g: 0.588, b: 0.412 };       // #059669
  const COLOR_SUCCESS_LIGHT = { r: 0.820, g: 0.980, b: 0.898 }; // #D1FAE5

  // Helper: Vector Icon Fetcher (1.5px stroke width rule)
  async function loadLucideIcon(iconName, size = 20, color = COLOR_TEXT, strokeWidth = 1.5) {
    try {
      const res = await fetch(`https://unpkg.com/lucide-static@latest/icons/${iconName}.svg`);
      let svgText = await res.text();
      svgText = svgText.replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`);
      const node = figma.createNodeFromSvg(svgText);
      node.resize(size, size);
      node.name = `Icon / ${iconName}`;
      const vectors = node.findAll(n => n.type === 'VECTOR');
      vectors.forEach(v => {
        v.strokes = [{ type: 'SOLID', color }];
        v.strokeWeight = strokeWidth;
      });
      return node;
    } catch (err) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
      const node = figma.createNodeFromSvg(svg);
      node.resize(size, size);
      node.name = "Icon / fallback";
      const vectors = node.findAll(n => n.type === 'VECTOR');
      vectors.forEach(v => {
        v.strokes = [{ type: 'SOLID', color }];
        v.strokeWeight = strokeWidth;
      });
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

  // Helper: Text Creator (Strict EVEN font sizes)
  function createText(content, fontSize, fontStyle = "Regular", color = COLOR_TEXT) {
    const text = figma.createText();
    text.fontName = { family: "DM Sans", style: fontStyle };
    text.fontSize = fontSize;
    text.characters = String(content);
    text.fills = [{ type: 'SOLID', color }];
    return text;
  }

  // Auto Layout Helper Functions (from core/autolayout.md)
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
  screen.name = "Screen / Payment Success & Tracking";
  screen.layoutMode = "VERTICAL";
  screen.resize(375, 812);
  screen.primaryAxisSizingMode = "FIXED";
  screen.counterAxisSizingMode = "FIXED";
  screen.fills = [{ type: 'SOLID', color: COLOR_BG }];
  board.appendChild(screen);

  // ═══════════════════════════════════════════════════════════
  // SECTION 1: TOP HEADER BAR
  // ═══════════════════════════════════════════════════════════
  const header = makeSpaceBetweenRow("Header / Top Bar", 375);
  header.paddingLeft = 16; header.paddingRight = 16;
  header.paddingTop = 44; // iOS Safe Area Top
  header.paddingBottom = 12;
  header.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];

  const closeBtn = makeHugContainer("Close Button", "HORIZONTAL", 8);
  closeBtn.appendChild(await loadLucideIcon("x", 20, COLOR_TEXT, 1.5));
  header.appendChild(closeBtn);

  header.appendChild(createText("Order Confirmation", 16, "Bold", COLOR_TEXT));

  const helpBtn = makeHugContainer("Help Button", "HORIZONTAL", 4);
  helpBtn.appendChild(await loadLucideIcon("phone-call", 18, COLOR_TEXT_MUTED, 1.5));
  header.appendChild(helpBtn);

  screen.appendChild(header);

  // ═══════════════════════════════════════════════════════════
  // SECTION 2: MIDDLE SCROLL CONTENT AREA (375px x 660px)
  // ═══════════════════════════════════════════════════════════
  const scrollArea = figma.createFrame();
  scrollArea.name = "Section / Success Scroll Content";
  scrollArea.layoutMode = "VERTICAL";
  scrollArea.resize(375, 660);
  scrollArea.primaryAxisSizingMode = "FIXED";
  scrollArea.counterAxisSizingMode = "FIXED";
  scrollArea.itemSpacing = 16;
  scrollArea.paddingLeft = 16; scrollArea.paddingRight = 16;
  scrollArea.paddingTop = 16; scrollArea.paddingBottom = 24;
  scrollArea.fills = [];
  scrollArea.clipsContent = true;

  // ── 1. SUCCESS HERO BANNER CARD ──
  const heroSuccessCard = makeContentCard("Card / Success Banner", 343, {
    cornerRadius: 20,
    fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
    strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
    paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24,
    itemSpacing: 12
  });
  heroSuccessCard.counterAxisAlignItems = "CENTER";

  // Large Green Check Circle Icon Container (64px x 64px)
  const checkCircle = makeHugContainer("Check Icon Circle", "HORIZONTAL", 0);
  checkCircle.paddingLeft = 16; checkCircle.paddingRight = 16;
  checkCircle.paddingTop = 16; checkCircle.paddingBottom = 16;
  checkCircle.cornerRadius = 32;
  checkCircle.fills = [{ type: 'SOLID', color: COLOR_SUCCESS_LIGHT }];
  checkCircle.appendChild(await loadLucideIcon("check-circle-2", 32, COLOR_SUCCESS, 1.5));
  heroSuccessCard.appendChild(checkCircle);

  // Main Headline
  heroSuccessCard.appendChild(createText("Payment Successful!", 20, "Bold", COLOR_TEXT));

  // Subtitle
  const subText = createText("Your order #ZOM-84920 has been placed and is on its way to your doorstep.", 14, "Regular", COLOR_TEXT_MUTED);
  subText.layoutAlign = "STRETCH";
  subText.textAlignHorizontal = "CENTER";
  subText.textAutoResize = "HEIGHT";
  heroSuccessCard.appendChild(subText);

  // ETA Badge Pill (20-25 MINS)
  const etaPill = makeHugContainer("Pill / ETA", "HORIZONTAL", 6);
  etaPill.paddingLeft = 14; etaPill.paddingRight = 14;
  etaPill.paddingTop = 6; etaPill.paddingBottom = 6;
  etaPill.cornerRadius = 16;
  etaPill.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }];
  etaPill.appendChild(await loadLucideIcon("clock", 16, COLOR_PRIMARY, 1.5));
  etaPill.appendChild(createText("Estimated Delivery: 20-25 mins", 12, "Bold", COLOR_PRIMARY));
  heroSuccessCard.appendChild(etaPill);

  finalizeHugHeight(heroSuccessCard);
  scrollArea.appendChild(heroSuccessCard);

  // ── 2. LIVE ORDER STATUS TRACKER CARD ──
  const trackerCard = makeContentCard("Card / Live Status Tracker", 343, {
    cornerRadius: 16,
    fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
    strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
    paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 16,
    itemSpacing: 14
  });

  trackerCard.appendChild(createText("Live Order Progress", 14, "Bold", COLOR_TEXT));

  const steps = [
    { title: "Order Confirmed", subtitle: "11:05 PM · Payment received via Apple Pay", icon: "check", done: true, current: false },
    { title: "Preparing Food", subtitle: "Burger & Co. is cooking your order", icon: "utensils", done: true, current: true },
    { title: "Out for Delivery", subtitle: "Driver assigning nearby", icon: "truck", done: false, current: false },
    { title: "Delivered", subtitle: "5th Avenue, Apt 4B", icon: "map-pin", done: false, current: false }
  ];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const stepRow = makeSpaceBetweenRow(`Step / ${step.title}`, 311);

    // Left Icon Box + Text
    const leftBlock = makeHugContainer("Step Left Block", "HORIZONTAL", 12);

    const stepIconBox = makeHugContainer("Icon Box", "HORIZONTAL", 0);
    stepIconBox.paddingLeft = 8; stepIconBox.paddingRight = 8;
    stepIconBox.paddingTop = 8; stepIconBox.paddingBottom = 8;
    stepIconBox.cornerRadius = 16;
    
    if (step.done) {
      stepIconBox.fills = [{ type: 'SOLID', color: step.current ? COLOR_PRIMARY_LIGHT : COLOR_SUCCESS_LIGHT }];
      stepIconBox.appendChild(await loadLucideIcon(step.icon, 16, step.current ? COLOR_PRIMARY : COLOR_SUCCESS, 1.5));
    } else {
      stepIconBox.fills = [{ type: 'SOLID', color: COLOR_BG }];
      stepIconBox.appendChild(await loadLucideIcon(step.icon, 16, COLOR_TEXT_MUTED, 1.5));
    }
    leftBlock.appendChild(stepIconBox);

    const stepTextCol = makeHugContainer("Step Text", "VERTICAL", 2);
    stepTextCol.counterAxisAlignItems = "MIN";
    stepTextCol.appendChild(createText(step.title, 14, step.done ? "Bold" : "Medium", step.done ? COLOR_TEXT : COLOR_TEXT_MUTED));
    stepTextCol.appendChild(createText(step.subtitle, 12, "Regular", COLOR_TEXT_MUTED));
    leftBlock.appendChild(stepTextCol);

    stepRow.appendChild(leftBlock);

    if (step.current) {
      const activeBadge = makeHugContainer("Badge / Active", "HORIZONTAL", 4);
      activeBadge.paddingLeft = 8; activeBadge.paddingRight = 8;
      activeBadge.paddingTop = 4; activeBadge.paddingBottom = 4;
      activeBadge.cornerRadius = 10;
      activeBadge.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
      activeBadge.appendChild(createText("IN PROGRESS", 10, "Bold", COLOR_SURFACE));
      stepRow.appendChild(activeBadge);
    }

    trackerCard.appendChild(stepRow);
  }

  finalizeHugHeight(trackerCard);
  scrollArea.appendChild(trackerCard);

  // ── 3. DELIVERY DRIVER DETAILS CARD ──
  const driverCard = makeContentCard("Card / Delivery Driver Info", 343, {
    cornerRadius: 16,
    fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
    strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
    paddingLeft: 16, paddingRight: 16, paddingTop: 14, paddingBottom: 14
  });

  const driverRow = makeSpaceBetweenRow("Driver Row", 311);

  const driverLeft = makeHugContainer("Driver Left", "HORIZONTAL", 12);

  // Driver Photo Avatar (44px x 44px)
  const driverPhoto = figma.createFrame();
  driverPhoto.name = "Driver Photo";
  driverPhoto.resize(44, 44);
  driverPhoto.cornerRadius = 22;
  driverPhoto.clipsContent = true;
  await applyOnlineImage(driverPhoto, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80");
  driverLeft.appendChild(driverPhoto);

  const driverTextCol = makeHugContainer("Driver Text", "VERTICAL", 2);
  driverTextCol.counterAxisAlignItems = "MIN";
  driverTextCol.appendChild(createText("Michael Scott", 14, "Bold", COLOR_TEXT));
  driverTextCol.appendChild(createText("Your Delivery Partner · 4.9 ★", 12, "Medium", COLOR_TEXT_MUTED));
  driverLeft.appendChild(driverTextCol);

  driverRow.appendChild(driverLeft);

  // Call Driver Icon Button
  const callBtn = makeHugContainer("Call Button", "HORIZONTAL", 0);
  callBtn.paddingLeft = 10; callBtn.paddingRight = 10;
  callBtn.paddingTop = 10; callBtn.paddingBottom = 10;
  callBtn.cornerRadius = 20;
  callBtn.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }];
  callBtn.appendChild(await loadLucideIcon("phone", 18, COLOR_PRIMARY, 1.5));
  driverRow.appendChild(callBtn);

  driverCard.appendChild(driverRow);
  finalizeHugHeight(driverCard);
  scrollArea.appendChild(driverCard);

  screen.appendChild(scrollArea);

  // ═══════════════════════════════════════════════════════════
  // SECTION 3: FIXED BOTTOM CTAS (Track Order & Back Home) (375px x 84px)
  // ═══════════════════════════════════════════════════════════
  const footerBar = makeSpaceBetweenRow("Footer / Action Bar", 375);
  footerBar.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  footerBar.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  footerBar.strokeWeight = 1;
  footerBar.paddingLeft = 16; footerBar.paddingRight = 16;
  footerBar.paddingTop = 12; footerBar.paddingBottom = 24;

  // Secondary Home Button
  const homeBtn = makeHugContainer("CTA / Back Home", "HORIZONTAL", 6);
  homeBtn.paddingLeft = 16; homeBtn.paddingRight = 16;
  homeBtn.paddingTop = 12; homeBtn.paddingBottom = 12;
  homeBtn.cornerRadius = 12;
  homeBtn.fills = [{ type: 'SOLID', color: COLOR_BG }];
  homeBtn.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  homeBtn.appendChild(await loadLucideIcon("home", 16, COLOR_TEXT, 1.5));
  homeBtn.appendChild(createText("Home", 14, "Bold", COLOR_TEXT));
  footerBar.appendChild(homeBtn);

  // Primary Live Track Button
  const trackBtn = makeHugContainer("CTA / Track Live", "HORIZONTAL", 8);
  trackBtn.paddingLeft = 24; trackBtn.paddingRight = 24;
  trackBtn.paddingTop = 12; trackBtn.paddingBottom = 12;
  trackBtn.cornerRadius = 22;
  trackBtn.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
  trackBtn.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0.886, g: 0.216, b: 0.267, a: 0.3 },
    offset: { x: 0, y: 4 },
    radius: 12,
    visible: true,
    blendMode: 'NORMAL'
  }];
  trackBtn.appendChild(await loadLucideIcon("navigation", 16, COLOR_SURFACE, 1.5));
  trackBtn.appendChild(createText("Track Order Live", 14, "Bold", COLOR_SURFACE));
  footerBar.appendChild(trackBtn);

  screen.appendChild(footerBar);

  // 4. Viewport Focus
  figma.viewport.scrollAndZoomIntoView([board]);
  figma.notify("Created Order Success & Tracking Screen in FoodDeliveryApp!", { timeout: 2500 });
})(figma);
