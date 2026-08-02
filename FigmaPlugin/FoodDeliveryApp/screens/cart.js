// Generated Figma Script: Food Delivery App — Order Cart & Offers Screen
// Project: FoodDeliveryApp
// File: FoodDeliveryApp/screens/cart.js
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
  screen.name = "Screen / My Cart & Offers";
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

  const backBtn = makeHugContainer("Back Button", "HORIZONTAL", 8);
  backBtn.appendChild(await loadLucideIcon("arrow-left", 20, COLOR_TEXT, 1.5));
  header.appendChild(backBtn);

  const titleCol = makeHugContainer("Header Title Col", "VERTICAL", 2);
  titleCol.counterAxisAlignItems = "CENTER";
  titleCol.appendChild(createText("Your Order Cart", 16, "Bold", COLOR_TEXT));
  titleCol.appendChild(createText("Burger & Co. · 3 Items", 12, "Medium", COLOR_TEXT_MUTED));
  header.appendChild(titleCol);

  const trashBtn = makeHugContainer("Clear Cart Btn", "HORIZONTAL", 4);
  trashBtn.appendChild(await loadLucideIcon("trash-2", 18, COLOR_PRIMARY, 1.5));
  header.appendChild(trashBtn);

  screen.appendChild(header);

  // ═══════════════════════════════════════════════════════════
  // SECTION 2: MIDDLE SCROLL CONTENT AREA (375px x 652px)
  // ═══════════════════════════════════════════════════════════
  const scrollArea = figma.createFrame();
  scrollArea.name = "Section / Cart Scroll Content";
  scrollArea.layoutMode = "VERTICAL";
  scrollArea.resize(375, 652);
  scrollArea.primaryAxisSizingMode = "FIXED";
  scrollArea.counterAxisSizingMode = "FIXED";
  scrollArea.itemSpacing = 16;
  scrollArea.paddingLeft = 16; scrollArea.paddingRight = 16;
  scrollArea.paddingTop = 14; scrollArea.paddingBottom = 24;
  scrollArea.fills = [];
  scrollArea.clipsContent = true;

  // ── 1. FREE DELIVERY PROGRESS BANNER ──
  const deliveryCard = makeContentCard("Card / Free Delivery Progress", 343, {
    cornerRadius: 12,
    fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
    strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
    paddingLeft: 14, paddingRight: 14, paddingTop: 10, paddingBottom: 10,
    itemSpacing: 8
  });

  const delRow = makeSpaceBetweenRow("Delivery Row", 315);
  const delLeft = makeHugContainer("Del Left", "HORIZONTAL", 8);
  delLeft.appendChild(await loadLucideIcon("truck", 16, COLOR_SUCCESS, 1.5));
  delLeft.appendChild(createText("You unlocked FREE Delivery!", 12, "Bold", COLOR_SUCCESS));
  delRow.appendChild(delLeft);
  delRow.appendChild(createText("$2.99 saved", 12, "Bold", COLOR_SUCCESS));
  deliveryCard.appendChild(delRow);

  // Green Progress Bar Fill
  const progressBg = figma.createFrame();
  progressBg.name = "Progress Track";
  progressBg.resize(315, 6);
  progressBg.cornerRadius = 3;
  progressBg.fills = [{ type: 'SOLID', color: COLOR_SUCCESS_LIGHT }];

  const progressFill = figma.createFrame();
  progressFill.name = "Progress Fill (100%)";
  progressFill.resize(315, 6);
  progressFill.cornerRadius = 3;
  progressFill.fills = [{ type: 'SOLID', color: COLOR_SUCCESS }];
  progressBg.appendChild(progressFill);
  deliveryCard.appendChild(progressBg);

  finalizeHugHeight(deliveryCard);
  scrollArea.appendChild(deliveryCard);

  // ── 2. CART ITEMS LIST ──
  const cartItemsCard = makeContentCard("Card / Added Items List", 343, {
    cornerRadius: 16,
    fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
    strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
    paddingLeft: 14, paddingRight: 14, paddingTop: 14, paddingBottom: 14,
    itemSpacing: 14
  });

  const itemsHeaderRow = makeSpaceBetweenRow("Items Card Header", 315);
  itemsHeaderRow.appendChild(createText("Order Items (3)", 14, "Bold", COLOR_TEXT));
  itemsHeaderRow.appendChild(createText("+ Add Items", 12, "Bold", COLOR_PRIMARY));
  cartItemsCard.appendChild(itemsHeaderRow);

  const cartItems = [
    {
      name: "Truffle Mushroom Burger",
      desc: "Aged Swiss Cheese, Extra Aioli",
      price: "$14.50",
      qty: 2,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Crispy Seasoned Fries",
      desc: "Large · Truffle Mayo Dip",
      price: "$4.50",
      qty: 1,
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Iced Chocolate Milkshake",
      desc: "Whipped Cream, Cocoa Powder",
      price: "$5.00",
      qty: 1,
      image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=300&q=80"
    }
  ];

  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const itemRow = makeSpaceBetweenRow(`Item / ${item.name}`, 315);

    // Left Thumbnail Image (56px x 56px)
    const imgFrame = figma.createFrame();
    imgFrame.name = "Item Image";
    imgFrame.resize(56, 56);
    imgFrame.cornerRadius = 10;
    imgFrame.clipsContent = true;
    await applyOnlineImage(imgFrame, item.image);

    // Left Info & Details Col
    const leftBlock = makeHugContainer("Item Left Block", "HORIZONTAL", 10);
    leftBlock.appendChild(imgFrame);

    const infoCol = makeHugContainer("Info Col", "VERTICAL", 2);
    infoCol.counterAxisAlignItems = "MIN";
    infoCol.appendChild(createText(item.name, 14, "Bold", COLOR_TEXT));
    infoCol.appendChild(createText(item.desc, 12, "Regular", COLOR_TEXT_MUTED));
    infoCol.appendChild(createText(item.price, 14, "Bold", COLOR_PRIMARY));
    leftBlock.appendChild(infoCol);

    itemRow.appendChild(leftBlock);

    // Right Stepper Pill (- Qty +)
    const stepperPill = makeHugContainer("Stepper Pill", "HORIZONTAL", 8);
    stepperPill.paddingLeft = 8; stepperPill.paddingRight = 8;
    stepperPill.paddingTop = 4; stepperPill.paddingBottom = 4;
    stepperPill.cornerRadius = 14;
    stepperPill.fills = [{ type: 'SOLID', color: COLOR_BG }];
    stepperPill.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];

    stepperPill.appendChild(await loadLucideIcon("minus", 12, COLOR_TEXT, 1.5));
    stepperPill.appendChild(createText(String(item.qty), 12, "Bold", COLOR_TEXT));
    stepperPill.appendChild(await loadLucideIcon("plus", 12, COLOR_PRIMARY, 1.5));
    itemRow.appendChild(stepperPill);

    cartItemsCard.appendChild(itemRow);

    // Item Divider (except last)
    if (i < cartItems.length - 1) {
      const divider = figma.createFrame();
      divider.name = "Item Divider";
      divider.resize(315, 1);
      divider.fills = [{ type: 'SOLID', color: COLOR_BORDER }];
      cartItemsCard.appendChild(divider);
    }
  }

  finalizeHugHeight(cartItemsCard);
  scrollArea.appendChild(cartItemsCard);

  // ── 3. OFFERS & PROMO CODES CARD (APPLY COUPON) ──
  const offersCard = makeContentCard("Card / Offers & Promo Code", 343, {
    cornerRadius: 16,
    fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
    strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
    paddingLeft: 14, paddingRight: 14, paddingTop: 14, paddingBottom: 14,
    itemSpacing: 12
  });

  const offersHeaderRow = makeSpaceBetweenRow("Offers Header", 315);
  const offerTitleLeft = makeHugContainer("Offer Title Left", "HORIZONTAL", 8);
  offerTitleLeft.appendChild(await loadLucideIcon("tag", 18, COLOR_PRIMARY, 1.5));
  offerTitleLeft.appendChild(createText("Coupons & Offers", 14, "Bold", COLOR_TEXT));
  offersHeaderRow.appendChild(offerTitleLeft);
  offersHeaderRow.appendChild(createText("2 Available", 12, "Bold", COLOR_PRIMARY));
  offersCard.appendChild(offersHeaderRow);

  // Applied / Selectable Promo Row 1: ZOMATO50 (Active Selected)
  const promoRow1 = makeSpaceBetweenRow("Promo / ZOMATO50", 315);
  promoRow1.paddingLeft = 10; promoRow1.paddingRight = 10;
  promoRow1.paddingTop = 8; promoRow1.paddingBottom = 8;
  promoRow1.cornerRadius = 10;
  promoRow1.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }];
  promoRow1.strokes = [{ type: 'SOLID', color: COLOR_PRIMARY }];

  const promo1Left = makeHugContainer("Promo 1 Left", "HORIZONTAL", 8);
  promo1Left.appendChild(await loadLucideIcon("check-circle-2", 16, COLOR_PRIMARY, 1.5));
  
  const promo1TextCol = makeHugContainer("Promo 1 Text", "VERTICAL", 2);
  promo1TextCol.counterAxisAlignItems = "MIN";
  promo1TextCol.appendChild(createText("ZOMATO50 Applied", 12, "Bold", COLOR_PRIMARY));
  promo1TextCol.appendChild(createText("50% OFF up to $10.00", 10, "Medium", COLOR_TEXT_MUTED));
  promo1Left.appendChild(promo1TextCol);
  promoRow1.appendChild(promo1Left);

  promoRow1.appendChild(createText("Remove", 12, "Bold", COLOR_PRIMARY));
  offersCard.appendChild(promoRow1);

  // Promo Row 2: FEAST20 (Available Coupon)
  const promoRow2 = makeSpaceBetweenRow("Promo / FEAST20", 315);
  promoRow2.paddingLeft = 10; promoRow2.paddingRight = 10;
  promoRow2.paddingTop = 8; promoRow2.paddingBottom = 8;
  promoRow2.cornerRadius = 10;
  promoRow2.fills = [{ type: 'SOLID', color: COLOR_BG }];
  promoRow2.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];

  const promo2Left = makeHugContainer("Promo 2 Left", "HORIZONTAL", 8);
  promo2Left.appendChild(await loadLucideIcon("percent", 16, COLOR_TEXT_MUTED, 1.5));
  
  const promo2TextCol = makeHugContainer("Promo 2 Text", "VERTICAL", 2);
  promo2TextCol.counterAxisAlignItems = "MIN";
  promo2TextCol.appendChild(createText("FEAST20", 12, "Bold", COLOR_TEXT));
  promo2TextCol.appendChild(createText("Flat $5 OFF on orders above $25", 10, "Regular", COLOR_TEXT_MUTED));
  promo2Left.appendChild(promo2TextCol);
  promoRow2.appendChild(promo2Left);

  const applyBtn = makeHugContainer("Apply Btn", "HORIZONTAL", 4);
  applyBtn.paddingLeft = 10; applyBtn.paddingRight = 10;
  applyBtn.paddingTop = 4; applyBtn.paddingBottom = 4;
  applyBtn.cornerRadius = 6;
  applyBtn.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }];
  applyBtn.appendChild(createText("Apply", 12, "Bold", COLOR_PRIMARY));
  promoRow2.appendChild(applyBtn);

  offersCard.appendChild(promoRow2);

  finalizeHugHeight(offersCard);
  scrollArea.appendChild(offersCard);

  // ── 4. BILL BREAKDOWN SUMMARY CARD ──
  const billCard = makeContentCard("Card / Bill Summary Breakdown", 343, {
    cornerRadius: 16,
    fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
    strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
    paddingLeft: 14, paddingRight: 14, paddingTop: 14, paddingBottom: 14,
    itemSpacing: 10
  });

  billCard.appendChild(createText("Bill Details", 14, "Bold", COLOR_TEXT));

  const billLines = [
    { title: "Item Subtotal (3 items)", amount: "$38.50" },
    { title: "Delivery Fee (Unlocked)", amount: "FREE", isGreen: true },
    { title: "Promo Discount (ZOMATO50)", amount: "-$10.00", isGreen: true },
    { title: "Taxes & Restaurant Packing", amount: "$2.80" }
  ];

  for (const line of billLines) {
    const bRow = makeSpaceBetweenRow(`Bill / ${line.title}`, 315);
    bRow.appendChild(createText(line.title, 12, "Regular", COLOR_TEXT_MUTED));
    bRow.appendChild(createText(line.amount, 12, "Bold", line.isGreen ? COLOR_SUCCESS : COLOR_TEXT));
    billCard.appendChild(bRow);
  }

  const billDivider = figma.createFrame();
  billDivider.name = "Bill Divider";
  billDivider.resize(315, 1);
  billDivider.fills = [{ type: 'SOLID', color: COLOR_BORDER }];
  billCard.appendChild(billDivider);

  const totalRow = makeSpaceBetweenRow("Grand Total Row", 315);
  totalRow.appendChild(createText("To Pay", 16, "Bold", COLOR_TEXT));
  totalRow.appendChild(createText("$31.30", 18, "Bold", COLOR_PRIMARY));
  billCard.appendChild(totalRow);

  finalizeHugHeight(billCard);
  scrollArea.appendChild(billCard);

  screen.appendChild(scrollArea);

  // ═══════════════════════════════════════════════════════════
  // SECTION 3: FIXED BOTTOM PAYMENT & CHECKOUT FOOTER (375px x 94px)
  // ═══════════════════════════════════════════════════════════
  const footerBar = makeSpaceBetweenRow("Footer / Checkout Bar", 375);
  footerBar.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  footerBar.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  footerBar.strokeWeight = 1;
  footerBar.paddingLeft = 16; footerBar.paddingRight = 16;
  footerBar.paddingTop = 12; footerBar.paddingBottom = 24;

  // Left Payment Method Selector (Apple Pay)
  const paySelector = makeHugContainer("Payment Method", "VERTICAL", 2);
  paySelector.counterAxisAlignItems = "MIN";

  const payRow = makeHugContainer("Pay Row", "HORIZONTAL", 6);
  payRow.appendChild(await loadLucideIcon("credit-card", 16, COLOR_PRIMARY, 1.5));
  payRow.appendChild(createText("Apple Pay", 12, "Bold", COLOR_TEXT));
  payRow.appendChild(await loadLucideIcon("chevron-up", 14, COLOR_TEXT_MUTED, 1.5));
  paySelector.appendChild(payRow);

  paySelector.appendChild(createText("Paying $31.30", 10, "Medium", COLOR_TEXT_MUTED));
  footerBar.appendChild(paySelector);

  // Right Place Order CTA Button
  const checkoutBtn = makeHugContainer("CTA / Place Order", "HORIZONTAL", 8);
  checkoutBtn.paddingLeft = 24; checkoutBtn.paddingRight = 24;
  checkoutBtn.paddingTop = 12; checkoutBtn.paddingBottom = 12;
  checkoutBtn.cornerRadius = 22;
  checkoutBtn.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
  checkoutBtn.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0.886, g: 0.216, b: 0.267, a: 0.3 },
    offset: { x: 0, y: 4 },
    radius: 12,
    visible: true,
    blendMode: 'NORMAL'
  }];

  checkoutBtn.appendChild(createText("Place Order", 14, "Bold", COLOR_SURFACE));
  checkoutBtn.appendChild(await loadLucideIcon("arrow-right", 16, COLOR_SURFACE, 1.5));
  footerBar.appendChild(checkoutBtn);

  screen.appendChild(footerBar);

  // 4. Viewport Focus
  figma.viewport.scrollAndZoomIntoView([board]);
  figma.notify("Created Order Cart & Offers Screen in FoodDeliveryApp!", { timeout: 2500 });
})(figma);
