// Generated Figma Script: Food Delivery App — Food List / Explore Dishes Screen
// Project: FoodDeliveryApp
// Strict Compliance: DM Sans font, 0 emojis, vector Lucide icons, Auto Layout protocol
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

  // 3. Design System Tokens (from FoodDeliveryApp/local/)
  const COLOR_BG = { r: 0.976, g: 0.980, b: 0.984 };      // #F9FAFB
  const COLOR_SURFACE = { r: 1, g: 1, b: 1 };             // #FFFFFF
  const COLOR_PRIMARY = { r: 0.902, g: 0.224, b: 0.447 };   // #E63971 Pink / Food Theme
  const COLOR_PRIMARY_LIGHT = { r: 0.992, g: 0.910, b: 0.933 }; // Soft Pink Tint
  const COLOR_TEXT = { r: 0.067, g: 0.094, b: 0.153 };     // #111827
  const COLOR_TEXT_MUTED = { r: 0.420, g: 0.447, b: 0.502 };// #6B7280
  const COLOR_BORDER = { r: 0.898, g: 0.906, b: 0.922 };    // #E5E7EB
  const COLOR_STAR = { r: 0.960, g: 0.624, b: 0.043 };      // #F59E0B
  const COLOR_GREEN = { r: 0.020, g: 0.588, b: 0.412 };     // #059669

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

  // Screen Container: 375px x 812px Mobile Screen
  const screen = figma.createFrame();
  screen.name = "Screen / Food Explorer List";
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
  header.paddingTop = 44; // iOS Safe Top
  header.paddingBottom = 12;
  header.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];

  const backBtn = makeHugContainer("Back Button", "HORIZONTAL", 8);
  backBtn.appendChild(await loadLucideIcon("arrow-left", 22, COLOR_TEXT));
  header.appendChild(backBtn);

  const headerTitleBlock = makeHugContainer("Title Block", "VERTICAL", 2);
  headerTitleBlock.counterAxisAlignItems = "CENTER";
  headerTitleBlock.appendChild(createText("Explore Dishes", 18, "Bold", COLOR_TEXT));
  headerTitleBlock.appendChild(createText("Deliver to: Downtown 5th Ave", 11, "Medium", COLOR_TEXT_MUTED));
  header.appendChild(headerTitleBlock);

  const filterBtn = makeHugContainer("Filter Button", "HORIZONTAL", 8);
  filterBtn.paddingLeft = 8; filterBtn.paddingRight = 8;
  filterBtn.paddingTop = 6; filterBtn.paddingBottom = 6;
  filterBtn.cornerRadius = 8;
  filterBtn.fills = [{ type: 'SOLID', color: COLOR_BG }];
  filterBtn.appendChild(await loadLucideIcon("sliders-horizontal", 18, COLOR_TEXT));
  header.appendChild(filterBtn);

  screen.appendChild(header);

  // ═══════════════════════════════════════════════════════════
  // SECTION 2: MIDDLE SCROLL AREA
  // ═══════════════════════════════════════════════════════════
  const scrollArea = figma.createFrame();
  scrollArea.name = "Section / Scroll Content";
  scrollArea.layoutMode = "VERTICAL";
  scrollArea.resize(375, 638);
  scrollArea.primaryAxisSizingMode = "FIXED";
  scrollArea.counterAxisSizingMode = "FIXED";
  scrollArea.itemSpacing = 16;
  scrollArea.paddingLeft = 16; scrollArea.paddingRight = 16;
  scrollArea.paddingTop = 14; scrollArea.paddingBottom = 16;
  scrollArea.fills = [];
  scrollArea.clipsContent = true;

  // Search Bar
  const searchCard = makeContentCard("Card / Search Input", 343, {
    cornerRadius: 12,
    fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
    strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
    paddingLeft: 14, paddingRight: 14, paddingTop: 10, paddingBottom: 10
  });
  const searchRow = makeHugContainer("Search Row", "HORIZONTAL", 10);
  searchRow.appendChild(await loadLucideIcon("search", 18, COLOR_TEXT_MUTED));
  searchRow.appendChild(createText("Search burger, pizza, pasta...", 13, "Regular", COLOR_TEXT_MUTED));
  searchCard.appendChild(searchRow);
  finalizeHugHeight(searchCard);
  scrollArea.appendChild(searchCard);

  // Category Filter Pills Strip
  const categoryStrip = makeHugContainer("Categories Strip", "HORIZONTAL", 8);
  categoryStrip.layoutAlign = "STRETCH";

  const categories = [
    { label: "All Dishes", active: true },
    { label: "Burgers", active: false },
    { label: "Pizza", active: false },
    { label: "Asian", active: false },
    { label: "Healthy", active: false }
  ];

  for (const cat of categories) {
    const pill = makeHugContainer(`Pill / ${cat.label}`, "HORIZONTAL", 6);
    pill.paddingLeft = 14; pill.paddingRight = 14;
    pill.paddingTop = 8; pill.paddingBottom = 8;
    pill.cornerRadius = 20;
    pill.fills = cat.active 
      ? [{ type: 'SOLID', color: COLOR_PRIMARY }] 
      : [{ type: 'SOLID', color: COLOR_SURFACE }];
    pill.strokes = cat.active ? [] : [{ type: 'SOLID', color: COLOR_BORDER }];
    
    pill.appendChild(createText(cat.label, 12, cat.active ? "Bold" : "Medium", cat.active ? COLOR_SURFACE : COLOR_TEXT_MUTED));
    categoryStrip.appendChild(pill);
  }
  scrollArea.appendChild(categoryStrip);

  // Section Header: "Popular Foods (6)"
  const sectionTitleRow = makeSpaceBetweenRow("Section Header / Popular Foods", 343);
  sectionTitleRow.appendChild(createText("Popular Foods", 16, "Bold", COLOR_TEXT));
  sectionTitleRow.appendChild(createText("View Map", 12, "Bold", COLOR_PRIMARY));
  scrollArea.appendChild(sectionTitleRow);

  // Food Items List (Vertical Cards Stack)
  const foods = [
    {
      name: "Truffle Mushroom Burger",
      restaurant: "Burger & Co. · 1.2 km",
      price: "$14.50",
      rating: "4.8",
      reviews: "(230+)",
      delivery: "20-30 min",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
      isBestseller: true
    },
    {
      name: "Artisan Pepperoni Pizza",
      restaurant: "La Bella Italia · 2.5 km",
      price: "$18.00",
      rating: "4.9",
      reviews: "(410+)",
      delivery: "25-35 min",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
      isBestseller: true
    },
    {
      name: "Salmon Poke Grain Bowl",
      restaurant: "Fresh & Green · 0.8 km",
      price: "$16.20",
      rating: "4.7",
      reviews: "(180+)",
      delivery: "15-25 min",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
      isBestseller: false
    }
  ];

  for (const item of foods) {
    const card = makeContentCard(`Food Card / ${item.name}`, 343, {
      cornerRadius: 16,
      fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
      strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
      paddingLeft: 12, paddingRight: 12, paddingTop: 12, paddingBottom: 12,
      itemSpacing: 10
    });

    // Horizontal Row: Left Image + Right Details
    const mainRow = makeSpaceBetweenRow("Card Content Row", 319);
    
    // Left Food Thumbnail Image Frame (90px x 90px)
    const imgFrame = figma.createFrame();
    imgFrame.name = "Food Thumbnail";
    imgFrame.resize(90, 90);
    imgFrame.cornerRadius = 12;
    imgFrame.clipsContent = true;
    await applyOnlineImage(imgFrame, item.image);
    mainRow.appendChild(imgFrame);

    // Right Info Column
    const infoCol = makeHugContainer("Info Column", "VERTICAL", 4);
    infoCol.counterAxisAlignItems = "MIN";

    // Bestseller Badge (if applicable)
    if (item.isBestseller) {
      const badge = makeHugContainer("Badge", "HORIZONTAL", 4);
      badge.paddingLeft = 6; badge.paddingRight = 6;
      badge.paddingTop = 2; badge.paddingBottom = 2;
      badge.cornerRadius = 4;
      badge.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }];
      badge.appendChild(createText("BESTSELLER", 9, "Bold", COLOR_PRIMARY));
      infoCol.appendChild(badge);
    }

    // Food Title
    infoCol.appendChild(createText(item.name, 14, "Bold", COLOR_TEXT));

    // Restaurant Subtitle
    infoCol.appendChild(createText(item.restaurant, 11, "Medium", COLOR_TEXT_MUTED));

    // Rating & Time Row
    const metaRow = makeHugContainer("Meta Row", "HORIZONTAL", 10);
    
    const starGroup = makeHugContainer("Star Rating", "HORIZONTAL", 3);
    starGroup.appendChild(await loadLucideIcon("star", 12, COLOR_STAR));
    starGroup.appendChild(createText(`${item.rating} ${item.reviews}`, 11, "Bold", COLOR_TEXT));
    metaRow.appendChild(starGroup);

    const timeGroup = makeHugContainer("Delivery Time", "HORIZONTAL", 3);
    timeGroup.appendChild(await loadLucideIcon("clock", 12, COLOR_TEXT_MUTED));
    timeGroup.appendChild(createText(item.delivery, 11, "Regular", COLOR_TEXT_MUTED));
    metaRow.appendChild(timeGroup);

    infoCol.appendChild(metaRow);

    // Bottom Price + Add Button Row
    const priceRow = makeSpaceBetweenRow("Price & Add Row", 215);
    priceRow.appendChild(createText(item.price, 15, "Bold", COLOR_PRIMARY));

    const addBtn = makeHugContainer("Add Button", "HORIZONTAL", 4);
    addBtn.paddingLeft = 12; addBtn.paddingRight = 12;
    addBtn.paddingTop = 6; addBtn.paddingBottom = 6;
    addBtn.cornerRadius = 8;
    addBtn.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
    addBtn.appendChild(await loadLucideIcon("plus", 14, COLOR_SURFACE));
    addBtn.appendChild(createText("Add", 11, "Bold", COLOR_SURFACE));
    priceRow.appendChild(addBtn);

    infoCol.appendChild(priceRow);

    mainRow.appendChild(infoCol);
    card.appendChild(mainRow);

    finalizeHugHeight(card);
    scrollArea.appendChild(card);
  }

  screen.appendChild(scrollArea);

  // ═══════════════════════════════════════════════════════════
  // SECTION 3: BOTTOM NAVIGATION BAR
  // ═══════════════════════════════════════════════════════════
  const navBar = makeSpaceBetweenRow("Nav / Bottom Tab Bar", 375);
  navBar.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  navBar.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  navBar.paddingLeft = 24; navBar.paddingRight = 24;
  navBar.paddingTop = 10; navBar.paddingBottom = 20;

  const navItems = [
    { label: "Home", icon: "home", active: false },
    { label: "Explore", icon: "compass", active: true },
    { label: "Cart", icon: "shopping-bag", active: false },
    { label: "Profile", icon: "user", active: false }
  ];

  for (const nav of navItems) {
    const itemCol = makeHugContainer(`Nav / ${nav.label}`, "VERTICAL", 4);
    itemCol.counterAxisAlignItems = "CENTER";
    const iconColor = nav.active ? COLOR_PRIMARY : COLOR_TEXT_MUTED;
    itemCol.appendChild(await loadLucideIcon(nav.icon, 20, iconColor));
    itemCol.appendChild(createText(nav.label, 10, nav.active ? "Bold" : "Medium", iconColor));
    navBar.appendChild(itemCol);
  }

  screen.appendChild(navBar);

  // 4. Viewport Focus
  figma.viewport.scrollAndZoomIntoView([board]);
  figma.notify("Created Food Explorer Screen in FoodDeliveryApp project!", { timeout: 2500 });
})(figma);
