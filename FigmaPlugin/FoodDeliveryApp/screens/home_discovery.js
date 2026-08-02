// Generated Figma Script: Food Delivery App — Home Discovery & Deals Screen
// Project: FoodDeliveryApp
// File: FoodDeliveryApp/screens/home_discovery.js
// Strict Compliance: DM Sans font, 0 emojis, vector Lucide icons with refined 1.5px stroke width, Auto Layout protocol
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

  // Helper: Vector Icon Fetcher with Refined Lightweight Stroke (default strokeWidth = 1.5)
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
  screen.name = "Screen / Home & Mega Deals";
  screen.layoutMode = "VERTICAL";
  screen.resize(375, 812);
  screen.primaryAxisSizingMode = "FIXED";
  screen.counterAxisSizingMode = "FIXED";
  screen.fills = [{ type: 'SOLID', color: COLOR_BG }];
  board.appendChild(screen);

  // ═══════════════════════════════════════════════════════════
  // SECTION 1: TOP HEADER (Location & Notification Bell)
  // ═══════════════════════════════════════════════════════════
  const header = makeSpaceBetweenRow("Header / Top Bar", 375);
  header.paddingLeft = 16; header.paddingRight = 16;
  header.paddingTop = 44; // iOS safe area top
  header.paddingBottom = 12;
  header.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];

  // Left Location Block
  const locationBlock = makeHugContainer("Location Block", "HORIZONTAL", 8);
  
  const pinCircle = makeHugContainer("Pin Circle", "HORIZONTAL", 0);
  pinCircle.paddingLeft = 8; pinCircle.paddingRight = 8;
  pinCircle.paddingTop = 8; pinCircle.paddingBottom = 8;
  pinCircle.cornerRadius = 20;
  pinCircle.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }];
  pinCircle.appendChild(await loadLucideIcon("map-pin", 18, COLOR_PRIMARY, 1.5));
  locationBlock.appendChild(pinCircle);

  const locTextCol = makeHugContainer("Loc Text", "VERTICAL", 2);
  locTextCol.counterAxisAlignItems = "MIN";
  
  const locTitleRow = makeHugContainer("Loc Title Row", "HORIZONTAL", 4);
  locTitleRow.appendChild(createText("Deliver to Home", 14, "Bold", COLOR_TEXT));
  locTitleRow.appendChild(await loadLucideIcon("chevron-down", 14, COLOR_TEXT, 1.5));
  locTextCol.appendChild(locTitleRow);
  
  locTextCol.appendChild(createText("5th Avenue, Apt 4B, Downtown", 12, "Regular", COLOR_TEXT_MUTED));
  locationBlock.appendChild(locTextCol);

  header.appendChild(locationBlock);

  // Right Bell Icon Button
  const bellBtn = makeHugContainer("Bell Button", "HORIZONTAL", 0);
  bellBtn.paddingLeft = 8; bellBtn.paddingRight = 8;
  bellBtn.paddingTop = 8; bellBtn.paddingBottom = 8;
  bellBtn.cornerRadius = 20;
  bellBtn.fills = [{ type: 'SOLID', color: COLOR_BG }];
  bellBtn.appendChild(await loadLucideIcon("bell", 18, COLOR_TEXT, 1.5));
  header.appendChild(bellBtn);

  screen.appendChild(header);

  // ═══════════════════════════════════════════════════════════
  // SECTION 2: MIDDLE SCROLL CONTENT AREA (375px x 680px)
  // ═══════════════════════════════════════════════════════════
  const scrollArea = figma.createFrame();
  scrollArea.name = "Section / Home Scroll Content";
  scrollArea.layoutMode = "VERTICAL";
  scrollArea.resize(375, 680);
  scrollArea.primaryAxisSizingMode = "FIXED";
  scrollArea.counterAxisSizingMode = "FIXED";
  scrollArea.itemSpacing = 16;
  scrollArea.paddingLeft = 16; scrollArea.paddingRight = 16;
  scrollArea.paddingTop = 14; scrollArea.paddingBottom = 20;
  scrollArea.fills = [];
  scrollArea.clipsContent = true;

  // Search Bar Card
  const searchCard = makeContentCard("Card / Search Input", 343, {
    cornerRadius: 12,
    fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
    strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
    paddingLeft: 14, paddingRight: 14, paddingTop: 10, paddingBottom: 10
  });
  const searchRow = makeSpaceBetweenRow("Search Row", 315);
  const searchLeft = makeHugContainer("Search Left", "HORIZONTAL", 10);
  searchLeft.appendChild(await loadLucideIcon("search", 18, COLOR_PRIMARY, 1.5));
  searchLeft.appendChild(createText("Search dishes, restaurants, groceries...", 12, "Regular", COLOR_TEXT_MUTED));
  searchRow.appendChild(searchLeft);
  searchRow.appendChild(await loadLucideIcon("mic", 16, COLOR_TEXT_MUTED, 1.5));
  searchCard.appendChild(searchRow);
  finalizeHugHeight(searchCard);
  scrollArea.appendChild(searchCard);

  // ── PROMOTIONAL SALE HERO BANNER CARD ──
  const promoCard = makeContentCard("Card / Mega Sale Promo Banner", 343, {
    cornerRadius: 16,
    fills: [{ type: 'SOLID', color: COLOR_PRIMARY }],
    paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 16
  });

  const bannerRow = makeSpaceBetweenRow("Banner Inner Row", 311);
  
  // Left Banner Text Stack
  const bannerTextCol = makeHugContainer("Banner Text Column", "VERTICAL", 6);
  bannerTextCol.counterAxisAlignItems = "MIN";

  const saleTag = makeHugContainer("Tag / Mega Deal", "HORIZONTAL", 4);
  saleTag.paddingLeft = 8; saleTag.paddingRight = 8;
  saleTag.paddingTop = 4; saleTag.paddingBottom = 4;
  saleTag.cornerRadius = 6;
  saleTag.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  saleTag.appendChild(createText("50% OFF · FEAST WEEK", 10, "Bold", COLOR_PRIMARY));
  bannerTextCol.appendChild(saleTag);

  bannerTextCol.appendChild(createText("Delicious Deals\nDelivered Fast", 18, "Bold", COLOR_SURFACE));
  bannerTextCol.appendChild(createText("Code: ZOMATO50 on orders > $20", 12, "Medium", COLOR_PRIMARY_LIGHT));

  const claimBtn = makeHugContainer("Claim CTA", "HORIZONTAL", 6);
  claimBtn.paddingLeft = 14; claimBtn.paddingRight = 14;
  claimBtn.paddingTop = 8; claimBtn.paddingBottom = 8;
  claimBtn.cornerRadius = 20;
  claimBtn.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  claimBtn.appendChild(createText("Claim Offer", 12, "Bold", COLOR_PRIMARY));
  claimBtn.appendChild(await loadLucideIcon("arrow-right", 14, COLOR_PRIMARY, 1.5));
  bannerTextCol.appendChild(claimBtn);

  bannerRow.appendChild(bannerTextCol);

  // Right Banner Image Circle (90px x 90px)
  const bannerImgFrame = figma.createFrame();
  bannerImgFrame.name = "Banner Food Image";
  bannerImgFrame.resize(90, 90);
  bannerImgFrame.cornerRadius = 45;
  bannerImgFrame.clipsContent = true;
  await applyOnlineImage(bannerImgFrame, "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80");
  bannerRow.appendChild(bannerImgFrame);

  promoCard.appendChild(bannerRow);
  finalizeHugHeight(promoCard);
  scrollArea.appendChild(promoCard);

  // ── ALL CATEGORIES GRID / HORIZONTAL STRIP ──
  const catSectionRow = makeSpaceBetweenRow("Section / Categories Header", 343);
  catSectionRow.appendChild(createText("Explore Categories", 16, "Bold", COLOR_TEXT));
  catSectionRow.appendChild(createText("See All", 12, "Bold", COLOR_PRIMARY));
  scrollArea.appendChild(catSectionRow);

  const categoriesStrip = makeHugContainer("Categories Strip", "HORIZONTAL", 12);
  categoriesStrip.layoutAlign = "STRETCH";

  const categories = [
    { label: "Burgers", icon: "sandwich" },
    { label: "Pizza", icon: "pizza" },
    { label: "Asian", icon: "utensils" },
    { label: "Desserts", icon: "cake" },
    { label: "Healthy", icon: "apple" }
  ];

  for (const cat of categories) {
    const catCard = makeContentCard(`Category / ${cat.label}`, 74, {
      cornerRadius: 12,
      fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
      strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
      paddingLeft: 6, paddingRight: 6, paddingTop: 10, paddingBottom: 10,
      itemSpacing: 6
    });

    const catIconBox = makeHugContainer("Icon Circle", "HORIZONTAL", 0);
    catIconBox.paddingLeft = 10; catIconBox.paddingRight = 10;
    catIconBox.paddingTop = 10; catIconBox.paddingBottom = 10;
    catIconBox.cornerRadius = 20;
    catIconBox.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }];
    catIconBox.appendChild(await loadLucideIcon(cat.icon, 18, COLOR_PRIMARY, 1.5));
    catCard.appendChild(catIconBox);

    catCard.appendChild(createText(cat.label, 12, "Bold", COLOR_TEXT));
    finalizeHugHeight(catCard);
    categoriesStrip.appendChild(catCard);
  }
  scrollArea.appendChild(categoriesStrip);

  // ── FEATURED PRODUCTS / POPULAR RESTAURANTS ──
  const prodSectionRow = makeSpaceBetweenRow("Section / Products Header", 343);
  prodSectionRow.appendChild(createText("Trending Near You", 16, "Bold", COLOR_TEXT));
  prodSectionRow.appendChild(createText("Filter", 12, "Bold", COLOR_PRIMARY));
  scrollArea.appendChild(prodSectionRow);

  const products = [
    {
      name: "Truffle Double Cheeseburger",
      restaurant: "Burger Factory · 1.2 km",
      price: "$14.50",
      origPrice: "$18.00",
      rating: "4.8",
      delivery: "20-25 min",
      tag: "50% OFF",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Neapolitan Woodfired Pizza",
      restaurant: "Pizza Wood & Fire · 2.0 km",
      price: "$16.00",
      origPrice: "$20.00",
      rating: "4.9",
      delivery: "25-30 min",
      tag: "FREE DELIVERY",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80"
    }
  ];

  for (const prod of products) {
    const prodCard = makeContentCard(`Product / ${prod.name}`, 343, {
      cornerRadius: 16,
      fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
      strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
      paddingLeft: 12, paddingRight: 12, paddingTop: 12, paddingBottom: 12,
      itemSpacing: 10
    });

    const mainRow = makeSpaceBetweenRow("Card Main Row", 319);
    
    // Product Image (86px x 86px)
    const prodImgFrame = figma.createFrame();
    prodImgFrame.name = "Product Image";
    prodImgFrame.resize(86, 86);
    prodImgFrame.cornerRadius = 12;
    prodImgFrame.clipsContent = true;
    await applyOnlineImage(prodImgFrame, prod.image);
    mainRow.appendChild(prodImgFrame);

    // Right Details Column
    const detailsCol = makeHugContainer("Details Column", "VERTICAL", 4);
    detailsCol.counterAxisAlignItems = "MIN";

    // Deal Tag
    const tagBadge = makeHugContainer("Badge / Tag", "HORIZONTAL", 4);
    tagBadge.paddingLeft = 6; tagBadge.paddingRight = 6;
    tagBadge.paddingTop = 2; tagBadge.paddingBottom = 2;
    tagBadge.cornerRadius = 4;
    tagBadge.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }];
    tagBadge.appendChild(createText(prod.tag, 10, "Bold", COLOR_PRIMARY));
    detailsCol.appendChild(tagBadge);

    detailsCol.appendChild(createText(prod.name, 14, "Bold", COLOR_TEXT));
    detailsCol.appendChild(createText(prod.restaurant, 12, "Regular", COLOR_TEXT_MUTED));

    // Meta Rating & Time
    const metaRow = makeHugContainer("Meta Row", "HORIZONTAL", 10);
    
    const starRow = makeHugContainer("Star Rating", "HORIZONTAL", 3);
    starRow.appendChild(await loadLucideIcon("star", 12, COLOR_STAR, 1.5));
    starRow.appendChild(createText(prod.rating, 12, "Bold", COLOR_TEXT));
    metaRow.appendChild(starRow);

    const clockRow = makeHugContainer("Delivery Time", "HORIZONTAL", 3);
    clockRow.appendChild(await loadLucideIcon("clock", 12, COLOR_TEXT_MUTED, 1.5));
    clockRow.appendChild(createText(prod.delivery, 12, "Regular", COLOR_TEXT_MUTED));
    metaRow.appendChild(clockRow);

    detailsCol.appendChild(metaRow);

    // Price + Add CTA Button
    const priceCtaRow = makeSpaceBetweenRow("Price & Add CTA Row", 221);
    
    const priceGroup = makeHugContainer("Price Group", "HORIZONTAL", 6);
    priceGroup.appendChild(createText(prod.price, 16, "Bold", COLOR_PRIMARY));
    priceGroup.appendChild(createText(prod.origPrice, 12, "Regular", COLOR_TEXT_MUTED));
    priceCtaRow.appendChild(priceGroup);

    const addBtn = makeHugContainer("Add Button", "HORIZONTAL", 4);
    addBtn.paddingLeft = 12; addBtn.paddingRight = 12;
    addBtn.paddingTop = 6; addBtn.paddingBottom = 6;
    addBtn.cornerRadius = 8;
    addBtn.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
    addBtn.appendChild(await loadLucideIcon("plus", 14, COLOR_SURFACE, 1.5));
    addBtn.appendChild(createText("Add", 12, "Bold", COLOR_SURFACE));
    priceCtaRow.appendChild(addBtn);

    detailsCol.appendChild(priceCtaRow);

    mainRow.appendChild(detailsCol);
    prodCard.appendChild(mainRow);

    finalizeHugHeight(prodCard);
    scrollArea.appendChild(prodCard);
  }

  screen.appendChild(scrollArea);

  // ═══════════════════════════════════════════════════════════
  // SECTION 3: FIXED BOTTOM NAVIGATION BAR
  // ═══════════════════════════════════════════════════════════
  const navBar = makeSpaceBetweenRow("Nav / Bottom Tab Bar", 375);
  navBar.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  navBar.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  navBar.paddingLeft = 24; navBar.paddingRight = 24;
  navBar.paddingTop = 10; navBar.paddingBottom = 20;

  const navItems = [
    { label: "Home", icon: "home", active: true },
    { label: "Explore", icon: "compass", active: false },
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

  screen.appendChild(navBar);

  // 4. Viewport Focus
  figma.viewport.scrollAndZoomIntoView([board]);
  figma.notify("Updated Home Screen with Refined Lightweight (1.5px) Icons!", { timeout: 2500 });
})(figma);
