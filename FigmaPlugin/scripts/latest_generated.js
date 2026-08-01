// Generated Figma Script: Food Delivery Checkout Page (Pure Figma Auto Layout API)
// Mandatory Rules: Poppins Font, 4pt Grid, Online Lucide Vector Icons, Pure Auto Layout (NO x/y offsets)
(async function(figma) {
  // 1. Load Mandatory Poppins Font Asynchronously
  await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
  await figma.loadFontAsync({ family: "Poppins", style: "Medium" });
  await figma.loadFontAsync({ family: "Poppins", style: "Bold" });

  // 2. Clean Previous Board
  const oldBoard = figma.currentPage.findChild(n => n.name === "Generated UI Screens");
  if (oldBoard) oldBoard.remove();

  // 3. Color Tokens (Orange Theme)
  const COLOR_BG = { r: 0.98, g: 0.98, b: 0.98 };             // #FAFAFA
  const COLOR_SURFACE = { r: 1.0, g: 1.0, b: 1.0 };          // #FFFFFF
  const COLOR_BORDER = { r: 0.94, g: 0.94, b: 0.94 };         // #F0F0F0
  const COLOR_PRIMARY_ORANGE = { r: 1.0, g: 0.42, b: 0.0 };  // #FF6B00
  const COLOR_LIGHT_ORANGE = { r: 1.0, g: 0.94, b: 0.90 };    // #FFF0E6
  const COLOR_TEXT_MAIN = { r: 0.10, g: 0.10, b: 0.10 };      // #1A1A1A
  const COLOR_TEXT_MUTED = { r: 0.46, g: 0.46, b: 0.46 };     // #757575
  const COLOR_GREEN_EXPRESS = { r: 0.06, g: 0.72, b: 0.50 };  // #10B981

  // 4. Online Lucide Icon Loader (fetch CDN + SVG conversion)
  const EMBEDDED_LUCIDE_SVGS = {
    "chevron-left": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
    "map-pin": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    "clock": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    "pizza": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="m2 16 20 6-6-20A20 20 0 0 0 2 16Z"/><path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4"/></svg>`,
    "utensils": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M15 2v10"/><path d="M15 22V11"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`,
    "credit-card": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
    "check-circle-2": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FF6B00" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`
  };

  async function loadLucideIcon(iconName, size = 20, colorHex = "#FF6B00") {
    try {
      const url = `https://unpkg.com/lucide-static@latest/icons/${iconName}.svg`;
      const res = await fetch(url);
      if (res.ok) {
        let svgText = await res.text();
        if (colorHex) {
          svgText = svgText.replace(/stroke="currentColor"/g, `stroke="${colorHex}"`)
                           .replace(/fill="currentColor"/g, `fill="${colorHex}"`);
        }
        const node = figma.createNodeFromSvg(svgText);
        node.name = `Lucide / ${iconName}`;
        node.resize(size, size);
        return node;
      }
    } catch (err) {
      console.warn(`[CDN Fetch Notice] Using fallback for ${iconName}`);
    }

    if (EMBEDDED_LUCIDE_SVGS[iconName]) {
      let svgText = EMBEDDED_LUCIDE_SVGS[iconName];
      if (colorHex) {
        svgText = svgText.replace(/stroke="#[A-Fa-f0-9]{6}"/g, `stroke="${colorHex}"`);
      }
      const node = figma.createNodeFromSvg(svgText);
      node.name = `Lucide / ${iconName}`;
      node.resize(size, size);
      return node;
    }
    return null;
  }

  // 5. Outer Workspace Container (Horizontal Auto Layout)
  const container = figma.createFrame();
  container.name = "Generated UI Screens";
  container.layoutMode = "HORIZONTAL";
  container.primaryAxisSizingMode = "AUTO";
  container.counterAxisSizingMode = "AUTO";
  container.itemSpacing = 40;
  container.paddingLeft = 40; container.paddingRight = 40;
  container.paddingTop = 40; container.paddingBottom = 40;
  container.fills = [{ type: 'SOLID', color: { r: 0.92, g: 0.92, b: 0.93 } }];
  container.cornerRadius = 24;

  // Helper Text Factory (NO MANUAL X/Y inside Auto Layout)
  function createText(characters, size, weight = "Regular", color = COLOR_TEXT_MAIN) {
    const t = figma.createText();
    t.fontName = { family: "Poppins", style: weight };
    t.characters = String(characters);
    t.fontSize = size;
    t.fills = [{ type: 'SOLID', color: color }];
    return t;
  }

  // 6. Mobile Screen Root (Vertical Auto Layout)
  const screen = figma.createFrame();
  screen.name = "Food Delivery - Checkout (Pure Auto Layout)";
  screen.layoutMode = "VERTICAL";
  screen.primaryAxisSizingMode = "FIXED";   // Fixed Height: 812px
  screen.counterAxisSizingMode = "FIXED";   // Fixed Width: 375px
  screen.resize(375, 812);
  screen.itemSpacing = 16;                  // 16px vertical gap between sections
  screen.paddingLeft = 20; screen.paddingRight = 20;
  screen.paddingTop = 24; screen.paddingBottom = 20;
  screen.cornerRadius = 24;
  screen.fills = [{ type: 'SOLID', color: COLOR_BG }];

  // A. Top Navigation Bar (Horizontal Auto Layout)
  const navHeader = figma.createFrame();
  navHeader.name = "Top Navigation Bar";
  navHeader.layoutMode = "HORIZONTAL";
  navHeader.primaryAxisSizingMode = "FIXED";
  navHeader.counterAxisSizingMode = "AUTO";
  navHeader.resize(335, 32);
  navHeader.counterAxisAlignItems = "CENTER";
  navHeader.itemSpacing = 12;

  const backIcon = await loadLucideIcon("chevron-left", 22, "#1A1A1A");
  if (backIcon) navHeader.appendChild(backIcon);
  
  const headerTitle = createText("Checkout", 18, "Bold", COLOR_TEXT_MAIN);
  headerTitle.layoutAlign = "STRETCH";
  navHeader.appendChild(headerTitle);
  screen.appendChild(navHeader);

  // B. Delivery Address Card (Vertical Auto Layout)
  const addrCard = figma.createFrame();
  addrCard.name = "Delivery Address Card";
  addrCard.layoutMode = "VERTICAL";
  addrCard.primaryAxisSizingMode = "AUTO";   // Hug Content Height
  addrCard.counterAxisSizingMode = "FIXED";  // Fixed Width
  addrCard.resize(335, 100);
  addrCard.itemSpacing = 8;
  addrCard.paddingLeft = 16; addrCard.paddingRight = 16;
  addrCard.paddingTop = 16; addrCard.paddingBottom = 16;
  addrCard.cornerRadius = 16;
  addrCard.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  addrCard.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  addrCard.strokeWeight = 1;

  // Header Row inside Address Card (Horizontal Auto Layout)
  const addrHeaderRow = figma.createFrame();
  addrHeaderRow.name = "Address Header Row";
  addrHeaderRow.layoutMode = "HORIZONTAL";
  addrHeaderRow.primaryAxisSizingMode = "FIXED";
  addrHeaderRow.counterAxisSizingMode = "AUTO";
  addrHeaderRow.resize(303, 24);
  addrHeaderRow.primaryAxisAlignItems = "SPACE_BETWEEN";
  addrHeaderRow.counterAxisAlignItems = "CENTER";

  const mapPinRow = figma.createFrame();
  mapPinRow.layoutMode = "HORIZONTAL";
  mapPinRow.primaryAxisSizingMode = "AUTO";
  mapPinRow.counterAxisSizingMode = "AUTO";
  mapPinRow.itemSpacing = 8;
  mapPinRow.counterAxisAlignItems = "CENTER";

  const mapPin = await loadLucideIcon("map-pin", 20, "#FF6B00");
  if (mapPin) mapPinRow.appendChild(mapPin);
  mapPinRow.appendChild(createText("Delivery Address", 14, "Bold", COLOR_TEXT_MAIN));
  addrHeaderRow.appendChild(mapPinRow);

  const changeLink = createText("Change", 12, "Bold", COLOR_PRIMARY_ORANGE);
  addrHeaderRow.appendChild(changeLink);
  addrCard.appendChild(addrHeaderRow);

  // Address Detail Text
  const addrDetail = createText("742 Evergreen Terrace, Apt 4B", 12, "Medium", COLOR_TEXT_MUTED);
  addrDetail.layoutAlign = "STRETCH";
  addrCard.appendChild(addrDetail);

  // Express Delivery Tag Row (Horizontal Auto Layout)
  const expressRow = figma.createFrame();
  expressRow.layoutMode = "HORIZONTAL";
  expressRow.primaryAxisSizingMode = "AUTO";
  expressRow.counterAxisSizingMode = "AUTO";
  expressRow.itemSpacing = 6;
  expressRow.counterAxisAlignItems = "CENTER";

  const clockIcon = await loadLucideIcon("clock", 16, "#10B981");
  if (clockIcon) expressRow.appendChild(clockIcon);
  expressRow.appendChild(createText("20-30 mins (Express Delivery)", 11, "Bold", COLOR_GREEN_EXPRESS));
  addrCard.appendChild(expressRow);

  screen.appendChild(addrCard);

  // C. Order Summary Section (Vertical Auto Layout)
  const orderSummaryContainer = figma.createFrame();
  orderSummaryContainer.name = "Order Summary Section";
  orderSummaryContainer.layoutMode = "VERTICAL";
  orderSummaryContainer.primaryAxisSizingMode = "AUTO";
  orderSummaryContainer.counterAxisSizingMode = "FIXED";
  orderSummaryContainer.resize(335, 200);
  orderSummaryContainer.itemSpacing = 8;

  const orderTitle = createText("Order Summary (2 items)", 14, "Bold", COLOR_TEXT_MAIN);
  orderSummaryContainer.appendChild(orderTitle);

  const itemsCard = figma.createFrame();
  itemsCard.name = "Order Items Card";
  itemsCard.layoutMode = "VERTICAL";
  itemsCard.primaryAxisSizingMode = "AUTO";
  itemsCard.counterAxisSizingMode = "FIXED";
  itemsCard.resize(335, 160);
  itemsCard.itemSpacing = 12;
  itemsCard.paddingLeft = 16; itemsCard.paddingRight = 16;
  itemsCard.paddingTop = 16; itemsCard.paddingBottom = 16;
  itemsCard.cornerRadius = 16;
  itemsCard.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  itemsCard.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  itemsCard.strokeWeight = 1;

  // Item 1 Row (Horizontal Auto Layout)
  const itemRow1 = figma.createFrame();
  itemRow1.layoutMode = "HORIZONTAL";
  itemRow1.primaryAxisSizingMode = "FIXED";
  itemRow1.counterAxisSizingMode = "AUTO";
  itemRow1.resize(303, 44);
  itemRow1.primaryAxisAlignItems = "SPACE_BETWEEN";
  itemRow1.counterAxisAlignItems = "CENTER";

  const itemLeft1 = figma.createFrame();
  itemLeft1.layoutMode = "HORIZONTAL";
  itemLeft1.primaryAxisSizingMode = "AUTO";
  itemLeft1.counterAxisSizingMode = "AUTO";
  itemLeft1.itemSpacing = 12;
  itemLeft1.counterAxisAlignItems = "CENTER";

  const thumb1 = figma.createFrame();
  thumb1.layoutMode = "HORIZONTAL";
  thumb1.primaryAxisAlignItems = "CENTER";
  thumb1.counterAxisAlignItems = "CENTER";
  thumb1.resize(44, 44); thumb1.cornerRadius = 10;
  thumb1.fills = [{ type: 'SOLID', color: COLOR_LIGHT_ORANGE }];
  const pizzaIconNode = await loadLucideIcon("pizza", 22, "#FF6B00");
  if (pizzaIconNode) thumb1.appendChild(pizzaIconNode);
  itemLeft1.appendChild(thumb1);

  const itemInfo1 = figma.createFrame();
  itemInfo1.layoutMode = "VERTICAL";
  itemInfo1.primaryAxisSizingMode = "AUTO";
  itemInfo1.counterAxisSizingMode = "AUTO";
  itemInfo1.itemSpacing = 2;
  itemInfo1.appendChild(createText("Spicy Pepperoni Pizza", 13, "Bold", COLOR_TEXT_MAIN));
  itemInfo1.appendChild(createText("1x • Extra Cheese & Jalapeños", 11, "Medium", COLOR_TEXT_MUTED));
  itemLeft1.appendChild(itemInfo1);
  itemRow1.appendChild(itemLeft1);

  itemRow1.appendChild(createText("$16.99", 13, "Bold", COLOR_TEXT_MAIN));
  itemsCard.appendChild(itemRow1);

  // Divider Line
  const divLine = figma.createFrame();
  divLine.resize(303, 1);
  divLine.fills = [{ type: 'SOLID', color: COLOR_BORDER }];
  itemsCard.appendChild(divLine);

  // Item 2 Row (Horizontal Auto Layout)
  const itemRow2 = figma.createFrame();
  itemRow2.layoutMode = "HORIZONTAL";
  itemRow2.primaryAxisSizingMode = "FIXED";
  itemRow2.counterAxisSizingMode = "AUTO";
  itemRow2.resize(303, 44);
  itemRow2.primaryAxisAlignItems = "SPACE_BETWEEN";
  itemRow2.counterAxisAlignItems = "CENTER";

  const itemLeft2 = figma.createFrame();
  itemLeft2.layoutMode = "HORIZONTAL";
  itemLeft2.primaryAxisSizingMode = "AUTO";
  itemLeft2.counterAxisSizingMode = "AUTO";
  itemLeft2.itemSpacing = 12;
  itemLeft2.counterAxisAlignItems = "CENTER";

  const thumb2 = figma.createFrame();
  thumb2.layoutMode = "HORIZONTAL";
  thumb2.primaryAxisAlignItems = "CENTER";
  thumb2.counterAxisAlignItems = "CENTER";
  thumb2.resize(44, 44); thumb2.cornerRadius = 10;
  thumb2.fills = [{ type: 'SOLID', color: COLOR_LIGHT_ORANGE }];
  const utensilsIconNode = await loadLucideIcon("utensils", 22, "#FF6B00");
  if (utensilsIconNode) thumb2.appendChild(utensilsIconNode);
  itemLeft2.appendChild(thumb2);

  const itemInfo2 = figma.createFrame();
  itemInfo2.layoutMode = "VERTICAL";
  itemInfo2.primaryAxisSizingMode = "AUTO";
  itemInfo2.counterAxisSizingMode = "AUTO";
  itemInfo2.itemSpacing = 2;
  itemInfo2.appendChild(createText("Truffle Garlic Fries", 13, "Bold", COLOR_TEXT_MAIN));
  itemInfo2.appendChild(createText("1x • Large Portion", 11, "Medium", COLOR_TEXT_MUTED));
  itemLeft2.appendChild(itemInfo2);
  itemRow2.appendChild(itemLeft2);

  itemRow2.appendChild(createText("$6.50", 13, "Bold", COLOR_TEXT_MAIN));
  itemsCard.appendChild(itemRow2);

  orderSummaryContainer.appendChild(itemsCard);
  screen.appendChild(orderSummaryContainer);

  // D. Payment Method Section (Vertical Auto Layout)
  const payContainer = figma.createFrame();
  payContainer.name = "Payment Method Section";
  payContainer.layoutMode = "VERTICAL";
  payContainer.primaryAxisSizingMode = "AUTO";
  payContainer.counterAxisSizingMode = "FIXED";
  payContainer.resize(335, 90);
  payContainer.itemSpacing = 8;

  const payTitle = createText("Payment Method", 14, "Bold", COLOR_TEXT_MAIN);
  payContainer.appendChild(payTitle);

  const payCard = figma.createFrame();
  payCard.name = "Payment Card";
  payCard.layoutMode = "HORIZONTAL";
  payCard.primaryAxisSizingMode = "FIXED";
  payCard.counterAxisSizingMode = "AUTO";
  payCard.resize(335, 60);
  payCard.primaryAxisAlignItems = "SPACE_BETWEEN";
  payCard.counterAxisAlignItems = "CENTER";
  payCard.paddingLeft = 16; payCard.paddingRight = 16;
  payCard.paddingTop = 12; payCard.paddingBottom = 12;
  payCard.cornerRadius = 14;
  payCard.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  payCard.strokes = [{ type: 'SOLID', color: COLOR_PRIMARY_ORANGE }];
  payCard.strokeWeight = 1.5;

  const payLeft = figma.createFrame();
  payLeft.layoutMode = "HORIZONTAL";
  payLeft.primaryAxisSizingMode = "AUTO";
  payLeft.counterAxisSizingMode = "AUTO";
  payLeft.itemSpacing = 12;
  payLeft.counterAxisAlignItems = "CENTER";

  const cardIcon = await loadLucideIcon("credit-card", 22, "#FF6B00");
  if (cardIcon) payLeft.appendChild(cardIcon);

  const payInfo = figma.createFrame();
  payInfo.layoutMode = "VERTICAL";
  payInfo.primaryAxisSizingMode = "AUTO";
  payInfo.counterAxisSizingMode = "AUTO";
  payInfo.itemSpacing = 2;
  payInfo.appendChild(createText("Mastercard / Apple Pay", 13, "Bold", COLOR_TEXT_MAIN));
  payInfo.appendChild(createText("•••• 4242 (Default)", 11, "Regular", COLOR_TEXT_MUTED));
  payLeft.appendChild(payInfo);
  payCard.appendChild(payLeft);

  const checkBadge = await loadLucideIcon("check-circle-2", 22, "#FF6B00");
  if (checkBadge) payCard.appendChild(checkBadge);

  payContainer.appendChild(payCard);
  screen.appendChild(payContainer);

  // E. Bill Breakdown Details Card (Vertical Auto Layout)
  const billCard = figma.createFrame();
  billCard.name = "Bill Details Card";
  billCard.layoutMode = "VERTICAL";
  billCard.primaryAxisSizingMode = "AUTO";
  billCard.counterAxisSizingMode = "FIXED";
  billCard.resize(335, 156);
  billCard.itemSpacing = 8;
  billCard.paddingLeft = 16; billCard.paddingRight = 16;
  billCard.paddingTop = 16; billCard.paddingBottom = 16;
  billCard.cornerRadius = 16;
  billCard.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  billCard.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  billCard.strokeWeight = 1;

  function createBillRow(label, value, isBold = false, isOrange = false) {
    const row = figma.createFrame();
    row.layoutMode = "HORIZONTAL";
    row.primaryAxisSizingMode = "FIXED";
    row.counterAxisSizingMode = "AUTO";
    row.resize(303, 18);
    row.primaryAxisAlignItems = "SPACE_BETWEEN";
    row.counterAxisAlignItems = "CENTER";

    const col = isOrange ? COLOR_PRIMARY_ORANGE : COLOR_TEXT_MUTED;
    const valCol = isOrange ? COLOR_PRIMARY_ORANGE : COLOR_TEXT_MAIN;

    row.appendChild(createText(label, 12, isBold ? "Bold" : "Medium", col));
    row.appendChild(createText(value, 12, "Bold", valCol));
    return row;
  }

  billCard.appendChild(createBillRow("Subtotal", "$23.49"));
  billCard.appendChild(createBillRow("Delivery Fee", "$2.99"));
  billCard.appendChild(createBillRow("Taxes & Fees", "$1.80"));
  billCard.appendChild(createBillRow("Promo (FOOD20)", "- $4.50", true, true));

  const billDiv = figma.createFrame();
  billDiv.resize(303, 1);
  billDiv.fills = [{ type: 'SOLID', color: COLOR_BORDER }];
  billCard.appendChild(billDiv);

  const totalRow = figma.createFrame();
  totalRow.layoutMode = "HORIZONTAL";
  totalRow.primaryAxisSizingMode = "FIXED";
  totalRow.counterAxisSizingMode = "AUTO";
  totalRow.resize(303, 22);
  totalRow.primaryAxisAlignItems = "SPACE_BETWEEN";
  totalRow.counterAxisAlignItems = "CENTER";
  totalRow.appendChild(createText("Total Amount", 14, "Bold", COLOR_TEXT_MAIN));
  totalRow.appendChild(createText("$23.78", 15, "Bold", COLOR_PRIMARY_ORANGE));
  billCard.appendChild(totalRow);

  screen.appendChild(billCard);

  // F. Primary Place Order Button (Horizontal Auto Layout)
  const placeOrderBtn = figma.createFrame();
  placeOrderBtn.name = "Button / Place Order";
  placeOrderBtn.layoutMode = "HORIZONTAL";
  placeOrderBtn.primaryAxisSizingMode = "FIXED";
  placeOrderBtn.counterAxisSizingMode = "AUTO";
  placeOrderBtn.resize(335, 52);
  placeOrderBtn.cornerRadius = 26;
  placeOrderBtn.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_ORANGE }];
  placeOrderBtn.primaryAxisAlignItems = "CENTER";
  placeOrderBtn.counterAxisAlignItems = "CENTER";

  const btnText = createText("Place Order • $23.78", 15, "Bold", COLOR_SURFACE);
  placeOrderBtn.appendChild(btnText);
  screen.appendChild(placeOrderBtn);

  container.appendChild(screen);

  // Focus Viewport
  figma.currentPage.appendChild(container);
  figma.viewport.scrollAndZoomIntoView([container]);
})(figma);
