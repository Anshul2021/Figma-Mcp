// Generated Figma Script: Food Delivery App — Food Recommendations Grid Screen
// Project: FoodDeliveryApp
// File: FoodDeliveryApp/screens/recommendations.js
// Strict Compliance: DM Sans font, 0 emojis, vector Lucide icons with 1.5px stroke width, Auto Layout protocol & Absolute Overlay Order Rule (v1.2)
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
  const COLOR_STAR = { r: 0.960, g: 0.624, b: 0.043 };          // #F59E0B

  // Helper: Vector Icon Fetcher with Safe Res.ok Validation & 1.5px Stroke Width
  async function loadLucideIcon(iconName, size = 20, color = COLOR_TEXT, strokeWidth = 1.5) {
    try {
      const res = await fetch(`https://unpkg.com/lucide-static@latest/icons/${iconName}.svg`);
      if (!res.ok) {
        return createFallbackIcon(size, color, strokeWidth);
      }
      let svgText = await res.text();
      if (!svgText || !svgText.includes('<svg')) {
        return createFallbackIcon(size, color, strokeWidth);
      }
      
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
      console.warn(`[Icon] Fallback for: ${iconName}`);
      return createFallbackIcon(size, color, strokeWidth);
    }
  }

  function createFallbackIcon(size = 20, color = COLOR_TEXT, strokeWidth = 1.5) {
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

  // 1. Root Board Container
  const board = figma.createFrame();
  board.name = "Generated UI Screens";
  board.layoutMode = "HORIZONTAL";
  board.fills = [];
  board.itemSpacing = 40;
  figma.currentPage.appendChild(board);

  // 2. Screen Container: 375px x 812px Mobile Screen (Auto Layout VERTICAL)
  const screen = figma.createFrame();
  screen.name = "Screen / Food Recommendations Grid";
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
  screen.appendChild(header);

  const backBtn = makeHugContainer("Back Button", "HORIZONTAL", 8);
  backBtn.appendChild(await loadLucideIcon("arrow-left", 20, COLOR_TEXT, 1.5));
  header.appendChild(backBtn);

  const titleCol = makeHugContainer("Header Title Col", "VERTICAL", 2);
  titleCol.counterAxisAlignItems = "CENTER";
  titleCol.appendChild(createText("Recommended For You", 16, "Bold", COLOR_TEXT));
  titleCol.appendChild(createText("Based on your order history", 12, "Medium", COLOR_TEXT_MUTED));
  header.appendChild(titleCol);

  const filterBtn = makeHugContainer("Filter Btn", "HORIZONTAL", 4);
  filterBtn.paddingLeft = 8; filterBtn.paddingRight = 8;
  filterBtn.paddingTop = 6; filterBtn.paddingBottom = 6;
  filterBtn.cornerRadius = 8;
  filterBtn.fills = [{ type: 'SOLID', color: COLOR_BG }];
  filterBtn.appendChild(await loadLucideIcon("sliders-horizontal", 18, COLOR_TEXT, 1.5));
  header.appendChild(filterBtn);

  // ═══════════════════════════════════════════════════════════
  // SECTION 2: MIDDLE SCROLL CONTENT AREA (375px x 680px)
  // ═══════════════════════════════════════════════════════════
  const scrollArea = figma.createFrame();
  scrollArea.name = "Section / Recommendations Scroll Content";
  scrollArea.layoutMode = "VERTICAL";
  scrollArea.resize(375, 680);
  scrollArea.primaryAxisSizingMode = "FIXED";
  scrollArea.counterAxisSizingMode = "FIXED";
  scrollArea.itemSpacing = 16;
  scrollArea.paddingLeft = 16; scrollArea.paddingRight = 16;
  scrollArea.paddingTop = 14; scrollArea.paddingBottom = 24;
  scrollArea.fills = [];
  scrollArea.clipsContent = true;
  // IMMEDIATE PARENT APPEND RULE: append to screen right away!
  screen.appendChild(scrollArea);

  // ── AI PERSONALIZED BADGE STRIP ──
  const aiBadgeCard = makeContentCard("Card / AI Preference Summary", 343, {
    cornerRadius: 12,
    fills: [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }],
    paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10
  });
  scrollArea.appendChild(aiBadgeCard);

  const aiRow = makeSpaceBetweenRow("AI Row", 319);
  const aiLeft = makeHugContainer("AI Left", "HORIZONTAL", 8);
  aiLeft.appendChild(await loadLucideIcon("sparkles", 18, COLOR_PRIMARY, 1.5));
  aiLeft.appendChild(createText("Curated Picks: Gourmet Burgers & Bowls", 12, "Bold", COLOR_PRIMARY));
  aiRow.appendChild(aiLeft);
  aiRow.appendChild(await loadLucideIcon("chevron-right", 16, COLOR_PRIMARY, 1.5));
  aiBadgeCard.appendChild(aiRow);
  finalizeHugHeight(aiBadgeCard);

  // ── 2-COLUMN GRID OF RECOMMENDED FOOD CARDS ──
  const recItems = [
    {
      name: "BBQ Bacon Cheeseburger",
      restaurant: "Burger Factory",
      price: "$15.80",
      rating: "4.9",
      match: "98% Match",
      time: "20 min",
      icon: "utensils",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Spicy Ramen Noodle Bowl",
      restaurant: "Tokyo Noodle Bar",
      price: "$13.50",
      rating: "4.8",
      match: "95% Match",
      time: "15 min",
      icon: "utensils",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Truffle Mushroom Pizza",
      restaurant: "La Bella Italia",
      price: "$18.00",
      rating: "4.9",
      match: "94% Match",
      time: "25 min",
      icon: "pizza",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Fresh Salmon Poké Bowl",
      restaurant: "Poké & Bowls",
      price: "$16.20",
      rating: "4.7",
      match: "91% Match",
      time: "18 min",
      icon: "utensils",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"
    }
  ];

  // Render 2 Grid Rows (2 Cards per Row)
  for (let r = 0; r < recItems.length; r += 2) {
    const gridRow = makeSpaceBetweenRow(`Grid Row ${r/2 + 1}`, 343);
    scrollArea.appendChild(gridRow);

    for (let c = 0; c < 2; c++) {
      if (r + c >= recItems.length) break;
      const item = recItems[r + c];

      const card = makeContentCard(`Grid Card / ${item.name}`, 164, {
        cornerRadius: 14,
        fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
        strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
        paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10,
        itemSpacing: 8
      });
      gridRow.appendChild(card);

      // Top Food Photo Image Frame
      const imgFrame = figma.createFrame();
      imgFrame.name = "Food Photo Container";
      imgFrame.layoutMode = "VERTICAL";
      imgFrame.resize(144, 100);
      imgFrame.primaryAxisSizingMode = "FIXED";
      imgFrame.counterAxisSizingMode = "FIXED";
      imgFrame.cornerRadius = 10;
      imgFrame.clipsContent = true;
      card.appendChild(imgFrame);

      await applyOnlineImage(imgFrame, item.image);

      // Overlay Match Tag (Append to Auto Layout parent BEFORE setting ABSOLUTE mode)
      const matchTag = makeHugContainer("Match Tag", "HORIZONTAL", 4);
      matchTag.paddingLeft = 6; matchTag.paddingRight = 6;
      matchTag.paddingTop = 2; matchTag.paddingBottom = 2;
      matchTag.cornerRadius = 4;
      matchTag.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
      matchTag.appendChild(createText(item.match, 10, "Bold", COLOR_SURFACE));

      imgFrame.appendChild(matchTag);
      matchTag.layoutPositioning = "ABSOLUTE";
      matchTag.x = 6;
      matchTag.y = 6;

      // Dish Title & Restaurant Subtitle
      const titleCol = makeHugContainer("Title Block", "VERTICAL", 2);
      titleCol.counterAxisAlignItems = "MIN";
      card.appendChild(titleCol);

      const dishTitleText = createText(item.name, 12, "Bold", COLOR_TEXT);
      titleCol.appendChild(dishTitleText);
      dishTitleText.layoutAlign = "STRETCH";
      dishTitleText.textAutoResize = "HEIGHT";

      const restSubtitleText = createText(item.restaurant, 10, "Medium", COLOR_TEXT_MUTED);
      titleCol.appendChild(restSubtitleText);

      // Rating & Time Row
      const metaRow = makeSpaceBetweenRow("Meta Row", 144);
      
      const starGroup = makeHugContainer("Star Rating", "HORIZONTAL", 3);
      starGroup.appendChild(await loadLucideIcon("star", 12, COLOR_STAR, 1.5));
      starGroup.appendChild(createText(item.rating, 10, "Bold", COLOR_TEXT));
      metaRow.appendChild(starGroup);

      const timeGroup = makeHugContainer("Time", "HORIZONTAL", 3);
      timeGroup.appendChild(await loadLucideIcon("clock", 12, COLOR_TEXT_MUTED, 1.5));
      timeGroup.appendChild(createText(item.time, 10, "Regular", COLOR_TEXT_MUTED));
      metaRow.appendChild(timeGroup);

      card.appendChild(metaRow);

      // Bottom Price + Add Button Row
      const priceRow = makeSpaceBetweenRow("Price & Add Row", 144);
      priceRow.appendChild(createText(item.price, 14, "Bold", COLOR_PRIMARY));

      const addBtn = makeHugContainer("Add Btn", "HORIZONTAL", 4);
      addBtn.paddingLeft = 8; addBtn.paddingRight = 8;
      addBtn.paddingTop = 4; addBtn.paddingBottom = 4;
      addBtn.cornerRadius = 6;
      addBtn.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }];
      addBtn.appendChild(await loadLucideIcon("plus", 12, COLOR_PRIMARY, 1.5));
      addBtn.appendChild(createText("Add", 10, "Bold", COLOR_PRIMARY));
      priceRow.appendChild(addBtn);

      card.appendChild(priceRow);

      finalizeHugHeight(card);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // SECTION 3: FIXED BOTTOM NAVIGATION BAR
  // ═══════════════════════════════════════════════════════════
  const navBar = makeSpaceBetweenRow("Nav / Bottom Tab Bar", 375);
  navBar.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  navBar.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  navBar.paddingLeft = 24; navBar.paddingRight = 24;
  navBar.paddingTop = 10; navBar.paddingBottom = 20;
  screen.appendChild(navBar);

  const navItems = [
    { label: "Home", icon: "home", active: false },
    { label: "Explore", icon: "compass", active: true },
    { label: "Orders", icon: "shopping-bag", active: false },
    { label: "Settings", icon: "user", active: false }
  ];

  for (const nav of navItems) {
    const itemCol = makeHugContainer(`Nav / ${nav.label}`, "VERTICAL", 4);
    itemCol.counterAxisAlignItems = "CENTER";
    const iconColor = nav.active ? COLOR_PRIMARY : COLOR_TEXT_MUTED;
    itemCol.appendChild(await loadLucideIcon(nav.icon, 20, iconColor, 1.5));
    itemCol.appendChild(createText(nav.label, 10, nav.active ? "Bold" : "Medium", iconColor));
    navBar.appendChild(itemCol);
  }

  // 4. Viewport Focus
  figma.viewport.scrollAndZoomIntoView([board]);
  figma.notify("Created Food Recommendations Grid Screen cleanly in Generated UI Screens!", { timeout: 2500 });
})(figma);
