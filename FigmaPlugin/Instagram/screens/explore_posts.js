(async () => {
  // 1. Load Required Fonts (DM Sans - Strict EVEN typography scale)
  await figma.loadFontAsync({ family: "DM Sans", style: "Regular" });
  await figma.loadFontAsync({ family: "DM Sans", style: "Medium" });
  await figma.loadFontAsync({ family: "DM Sans", style: "Bold" });

  // 2. Color System Definition (Instagram Light Mode Explorer Theme)
  const COLORS = {
    textDark: { r: 0.059, g: 0.090, b: 0.165 },     // #0F172A Headings & search text
    textMuted: { r: 0.392, g: 0.455, b: 0.545 },    // #64748B Subtitles & placeholders
    searchBg: { r: 0.953, g: 0.957, b: 0.965 },     // #F3F4F6 Pill & search bar fill
    borderLight: { r: 0.886, g: 0.910, b: 0.941 },  // #E23744 / #E2E8F0 Subtle border
    white: { r: 1, g: 1, b: 1 },
    canvasBg: { r: 1, g: 1, b: 1 },
    primaryBrand: { r: 0.882, g: 0.188, b: 0.424 }, // #E1306C Active Pill Tint
    verifiedBlue: { r: 0.0, g: 0.584, b: 0.965 },   // #0095F6
    reelOverlay: { r: 0, g: 0, b: 0 }
  };

  // 3. Icon Helper via Lucide SVG (Safe res.ok validation & fallback)
  async function loadLucideIcon(iconName, size = 20, color = COLORS.textDark, strokeWidth = 1.5) {
    const fallbackSvg = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#0F172A" stroke-width="${strokeWidth}"><circle cx="12" cy="12" r="9"/></svg>`;
    try {
      const url = `https://unpkg.com/lucide-static@latest/icons/${iconName}.svg`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Icon not found");
      let svgText = await res.text();
      if (!svgText.includes("<svg")) throw new Error("Invalid SVG");
      
      const hex = "#" + [color.r, color.g, color.b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
      svgText = svgText.replace(/stroke="[^"]*"/g, `stroke="${hex}"`)
                       .replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`);
      
      const node = figma.createNodeFromSvg(svgText);
      node.name = `icon-${iconName}`;
      node.resize(size, size);
      return node;
    } catch (e) {
      const node = figma.createNodeFromSvg(fallbackSvg);
      node.resize(size, size);
      return node;
    }
  }

  // 4. Online Image Helper (Real Unsplash Photography)
  async function applyOnlineImage(frameNode, imageUrl) {
    try {
      const image = await figma.createImageAsync(imageUrl);
      frameNode.fills = [{
        type: 'IMAGE',
        scaleMode: 'FILL',
        imageHash: image.hash
      }];
    } catch (err) {
      frameNode.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.95 } }];
    }
  }

  // 5. Mandatory Helper Functions (Auto Layout & Hug Heights)
  function makeSpaceBetweenRow(name, fixedWidth) {
    const row = figma.createFrame();
    row.name = name; row.layoutMode = "HORIZONTAL"; row.fills = [];
    row.resize(fixedWidth, 1);
    row.primaryAxisSizingMode = "FIXED";
    row.counterAxisSizingMode = "AUTO";
    row.primaryAxisAlignItems = "SPACE_BETWEEN";
    row.counterAxisAlignItems = "CENTER";
    return row;
  }

  function makeHugContainer(name, direction = "HORIZONTAL", spacing = 8) {
    const frame = figma.createFrame();
    frame.name = name; frame.layoutMode = direction; frame.fills = [];
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO";
    frame.itemSpacing = spacing;
    frame.counterAxisAlignItems = "CENTER";
    return frame;
  }

  function createText(content, fontSize, fontStyle = "Regular", color = COLORS.textDark) {
    const text = figma.createText();
    text.fontName = { family: "DM Sans", style: fontStyle };
    text.fontSize = fontSize; // EVEN numbers only: 10, 12, 14, 16, 20, 24, 32
    text.characters = String(content);
    text.fills = [{ type: 'SOLID', color }];
    return text;
  }

  // 6. Master Screen Root Frame (iPhone Viewport 375x812)
  const root = figma.createFrame();
  root.name = "Instagram_Explore_Screen";
  root.resize(375, 812);
  root.fills = [{ type: 'SOLID', color: COLORS.canvasBg }];
  root.clipsContent = true;

  root.layoutMode = "VERTICAL";
  root.primaryAxisSizingMode = "FIXED";
  root.counterAxisSizingMode = "FIXED";
  root.itemSpacing = 0;

  // ------------------------------------------------------------------
  // A. TOP STICKY SEARCH & CATEGORY FILTER AREA
  // ------------------------------------------------------------------
  const headerArea = figma.createFrame();
  headerArea.name = "Explore_Header_Area";
  headerArea.layoutMode = "VERTICAL";
  headerArea.fills = [{ type: 'SOLID', color: COLORS.white }];
  headerArea.resize(375, 1);
  headerArea.primaryAxisSizingMode = "AUTO";
  headerArea.counterAxisSizingMode = "FIXED";
  headerArea.paddingTop = 16;
  headerArea.paddingLeft = 16; headerArea.paddingRight = 16;
  headerArea.paddingBottom = 12;
  headerArea.itemSpacing = 12;
  root.appendChild(headerArea);

  // A1. Search Input Bar Container
  const searchBar = figma.createFrame();
  searchBar.name = "Search_Input_Bar";
  searchBar.layoutMode = "HORIZONTAL";
  searchBar.fills = [{ type: 'SOLID', color: COLORS.searchBg }];
  searchBar.cornerRadius = 10;
  searchBar.resize(343, 1);
  searchBar.primaryAxisSizingMode = "FIXED";
  searchBar.counterAxisSizingMode = "AUTO";
  searchBar.paddingLeft = 12; searchBar.paddingRight = 12;
  searchBar.paddingTop = 10; searchBar.paddingBottom = 10;
  searchBar.itemSpacing = 8;
  searchBar.counterAxisAlignItems = "CENTER";

  const searchIcon = await loadLucideIcon("search", 18, COLORS.textMuted, 1.8);
  searchBar.appendChild(searchIcon);

  const placeholderText = createText("Search topics, accounts, or tags...", 14, "Regular", COLORS.textMuted);
  placeholderText.layoutAlign = "STRETCH";
  try { placeholderText.layoutSizingHorizontal = "FILL"; } catch (e) {}
  searchBar.appendChild(placeholderText);

  headerArea.appendChild(searchBar);

  // A2. Horizontal Category Filter Pills Row
  const pillsRow = figma.createFrame();
  pillsRow.name = "Category_Filter_Pills";
  pillsRow.layoutMode = "HORIZONTAL";
  pillsRow.fills = [];
  pillsRow.resize(343, 1);
  pillsRow.primaryAxisSizingMode = "FIXED";
  pillsRow.counterAxisSizingMode = "AUTO";
  pillsRow.itemSpacing = 8;
  pillsRow.clipsContent = true;

  const categories = [
    { label: "For You", active: true },
    { label: "Travel", active: false },
    { label: "Style", active: false },
    { label: "Food", active: false },
    { label: "Art", active: false },
    { label: "Architecture", active: false }
  ];

  for (const cat of categories) {
    const pill = figma.createFrame();
    pill.name = `Pill_${cat.label}`;
    pill.layoutMode = "HORIZONTAL";
    pill.primaryAxisSizingMode = "AUTO";
    pill.counterAxisSizingMode = "AUTO";
    pill.paddingLeft = 14; pill.paddingRight = 14;
    pill.paddingTop = 6; pill.paddingBottom = 6;
    pill.cornerRadius = 8;

    if (cat.active) {
      pill.fills = [{ type: 'SOLID', color: COLORS.textDark }];
      const t = createText(cat.label, 12, "Bold", COLORS.white);
      pill.appendChild(t);
    } else {
      pill.fills = [{ type: 'SOLID', color: COLORS.searchBg }];
      const t = createText(cat.label, 12, "Medium", COLORS.textDark);
      pill.appendChild(t);
    }
    pillsRow.appendChild(pill);
  }

  headerArea.appendChild(pillsRow);

  // Divider under header
  const divider = figma.createFrame();
  divider.name = "Header_Divider";
  divider.resize(375, 1);
  divider.fills = [{ type: 'SOLID', color: COLORS.borderLight }];
  root.appendChild(divider);

  // ------------------------------------------------------------------
  // B. MIDDLE SCROLLABLE EXPLORE GRID CONTENT AREA (Fixed height 632)
  // ------------------------------------------------------------------
  const scrollArea = figma.createFrame();
  scrollArea.name = "Explore_Scroll_Body";
  scrollArea.resize(375, 632);
  scrollArea.clipsContent = true;
  root.appendChild(scrollArea);

  scrollArea.layoutMode = "VERTICAL";
  scrollArea.primaryAxisSizingMode = "FIXED";
  scrollArea.counterAxisSizingMode = "FIXED";
  scrollArea.itemSpacing = 2; // 2px grid spacing like Instagram

  // --- GRID BLOCK 1 (Dynamic Asymmetric Instagram Grid: Left 2x2 Photos, Right 1 Tall Reel) ---
  const gridBlock1 = figma.createFrame();
  gridBlock1.name = "Grid_Block_1_Asymmetric";
  gridBlock1.layoutMode = "HORIZONTAL";
  gridBlock1.resize(375, 248);
  gridBlock1.primaryAxisSizingMode = "FIXED";
  gridBlock1.counterAxisSizingMode = "FIXED";
  gridBlock1.itemSpacing = 2;
  scrollArea.appendChild(gridBlock1);

  // Left Sub-Column (Two stacked square tiles 123x123)
  const leftCol = figma.createFrame();
  leftCol.name = "Left_2x2_Column";
  leftCol.layoutMode = "VERTICAL";
  leftCol.resize(248, 248);
  leftCol.primaryAxisSizingMode = "FIXED";
  leftCol.counterAxisSizingMode = "FIXED";
  leftCol.itemSpacing = 2;
  gridBlock1.appendChild(leftCol);

  // Row 1 of Left Col (2 Tiles: 123x123 each)
  const leftRow1 = figma.createFrame();
  leftRow1.name = "Left_Row_1";
  leftRow1.layoutMode = "HORIZONTAL";
  leftRow1.resize(248, 123);
  leftRow1.itemSpacing = 2;
  leftCol.appendChild(leftRow1);

  const tile1 = figma.createFrame();
  tile1.name = "Tile_Photo_1"; tile1.resize(123, 123);
  leftRow1.appendChild(tile1);
  await applyOnlineImage(tile1, "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80"); // Food Bowl

  const tile2 = figma.createFrame();
  tile2.name = "Tile_Photo_2"; tile2.resize(123, 123);
  tile2.layoutMode = "VERTICAL"; tile2.primaryAxisAlignItems = "MAX"; tile2.paddingLeft = 8; tile2.paddingBottom = 8;
  leftRow1.appendChild(tile2);
  await applyOnlineImage(tile2, "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80"); // Camera
  // Carousel indicator icon on multi-photo tile
  const multiIcon = await loadLucideIcon("layers", 16, COLORS.white, 2.0);
  tile2.appendChild(multiIcon);

  // Row 2 of Left Col (2 Tiles: 123x123 each)
  const leftRow2 = figma.createFrame();
  leftRow2.name = "Left_Row_2";
  leftRow2.layoutMode = "HORIZONTAL";
  leftRow2.resize(248, 123);
  leftRow2.itemSpacing = 2;
  leftCol.appendChild(leftRow2);

  const tile3 = figma.createFrame();
  tile3.name = "Tile_Photo_3"; tile3.resize(123, 123);
  leftRow2.appendChild(tile3);
  await applyOnlineImage(tile3, "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80"); // Fashion

  const tile4 = figma.createFrame();
  tile4.name = "Tile_Photo_4"; tile4.resize(123, 123);
  leftRow2.appendChild(tile4);
  await applyOnlineImage(tile4, "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"); // Landscape

  // Right Sub-Column (1 Tall Featured Reel 125x248)
  const reelTile = figma.createFrame();
  reelTile.name = "Featured_Tall_Reel";
  reelTile.resize(125, 248);
  reelTile.layoutMode = "VERTICAL";
  reelTile.primaryAxisAlignItems = "SPACE_BETWEEN";
  reelTile.paddingLeft = 8; reelTile.paddingRight = 8;
  reelTile.paddingTop = 8; reelTile.paddingBottom = 10;
  gridBlock1.appendChild(reelTile);
  await applyOnlineImage(reelTile, "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=400&q=80"); // Reel Cat/Pet

  // Top Reel Badge
  const reelBadgeRow = makeSpaceBetweenRow("Reel_Badge_Row", 109);
  const reelIcon = await loadLucideIcon("clapperboard", 18, COLORS.white, 2.0);
  reelBadgeRow.appendChild(reelIcon);
  reelTile.appendChild(reelBadgeRow);

  // Bottom Reel Play Stats
  const playStats = makeHugContainer("Reel_Play_Stats", "HORIZONTAL", 4);
  const playIcon = await loadLucideIcon("play", 12, COLORS.white, 2.0);
  playStats.appendChild(playIcon);
  const playText = createText("245K", 10, "Bold", COLORS.white);
  playStats.appendChild(playText);
  reelTile.appendChild(playStats);

  // --- GRID BLOCK 2 (Standard 3-Column Square Tiles Row: 123x123 each) ---
  const gridBlock2 = figma.createFrame();
  gridBlock2.name = "Grid_Block_2_Standard_Row";
  gridBlock2.layoutMode = "HORIZONTAL";
  gridBlock2.resize(375, 123);
  gridBlock2.itemSpacing = 2;
  scrollArea.appendChild(gridBlock2);

  const tile5 = figma.createFrame();
  tile5.name = "Tile_Photo_5"; tile5.resize(123, 123);
  gridBlock2.appendChild(tile5);
  await applyOnlineImage(tile5, "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"); // Ocean

  const tile6 = figma.createFrame();
  tile6.name = "Tile_Photo_6"; tile6.resize(123, 123);
  gridBlock2.appendChild(tile6);
  await applyOnlineImage(tile6, "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80"); // Spa/Wellness

  const tile7 = figma.createFrame();
  tile7.name = "Tile_Photo_7"; tile7.resize(123, 123);
  gridBlock2.appendChild(tile7);
  await applyOnlineImage(tile7, "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80"); // Pizza

  // --- GRID BLOCK 3 (Inverted Asymmetric Grid: Left 1 Tall Reel, Right 2x2 Photos) ---
  const gridBlock3 = figma.createFrame();
  gridBlock3.name = "Grid_Block_3_Inverted_Asymmetric";
  gridBlock3.layoutMode = "HORIZONTAL";
  gridBlock3.resize(375, 248);
  gridBlock3.itemSpacing = 2;
  scrollArea.appendChild(gridBlock3);

  // Left Sub-Column (1 Tall Reel 125x248)
  const reelTile2 = figma.createFrame();
  reelTile2.name = "Featured_Tall_Reel_2";
  reelTile2.resize(125, 248);
  reelTile2.layoutMode = "VERTICAL";
  reelTile2.primaryAxisAlignItems = "SPACE_BETWEEN";
  reelTile2.paddingLeft = 8; reelTile2.paddingRight = 8;
  reelTile2.paddingTop = 8; reelTile2.paddingBottom = 10;
  gridBlock3.appendChild(reelTile2);
  await applyOnlineImage(reelTile2, "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80"); // Foggy Nature

  const reelBadgeRow2 = makeSpaceBetweenRow("Reel_Badge_Row_2", 109);
  const reelIcon2 = await loadLucideIcon("clapperboard", 18, COLORS.white, 2.0);
  reelBadgeRow2.appendChild(reelIcon2);
  reelTile2.appendChild(reelBadgeRow2);

  const playStats2 = makeHugContainer("Reel_Play_Stats_2", "HORIZONTAL", 4);
  const playIcon2 = await loadLucideIcon("play", 12, COLORS.white, 2.0);
  playStats2.appendChild(playIcon2);
  const playText2 = createText("1.2M", 10, "Bold", COLORS.white);
  playStats2.appendChild(playText2);
  reelTile2.appendChild(playStats2);

  // Right Sub-Column (Stacked square tiles)
  const rightCol = figma.createFrame();
  rightCol.name = "Right_2x2_Column";
  rightCol.layoutMode = "VERTICAL";
  rightCol.resize(248, 248);
  rightCol.itemSpacing = 2;
  gridBlock3.appendChild(rightCol);

  const rightRow1 = figma.createFrame();
  rightRow1.name = "Right_Row_1"; rightRow1.layoutMode = "HORIZONTAL"; rightRow1.resize(248, 123); rightRow1.itemSpacing = 2;
  rightCol.appendChild(rightRow1);

  const tile8 = figma.createFrame();
  tile8.name = "Tile_Photo_8"; tile8.resize(123, 123);
  rightRow1.appendChild(tile8);
  await applyOnlineImage(tile8, "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"); // Portrait

  const tile9 = figma.createFrame();
  tile9.name = "Tile_Photo_9"; tile9.resize(123, 123);
  rightRow1.appendChild(tile9);
  await applyOnlineImage(tile9, "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=400&q=80"); // Outdoor

  // ------------------------------------------------------------------
  // C. BOTTOM NAVIGATION BAR (Height 68px, Light Explore Theme)
  // ------------------------------------------------------------------
  const bottomNav = makeSpaceBetweenRow("Instagram_Bottom_Nav", 375);
  bottomNav.fills = [{ type: 'SOLID', color: COLORS.white }];
  bottomNav.strokes = [{ type: 'SOLID', color: COLORS.borderLight }];
  bottomNav.strokeWeight = 1;
  bottomNav.paddingLeft = 24; bottomNav.paddingRight = 24;
  bottomNav.paddingTop = 12; bottomNav.paddingBottom = 20; // Safe inset
  root.appendChild(bottomNav);

  // Nav 1: Home
  const homeIcon = await loadLucideIcon("home", 24, COLORS.textMuted, 1.8);
  bottomNav.appendChild(homeIcon);

  // Nav 2: Explore (Active - Solid Bold Highlight)
  const searchActiveIcon = await loadLucideIcon("search", 26, COLORS.textDark, 2.5);
  bottomNav.appendChild(searchActiveIcon);

  // Nav 3: Create (+)
  const plusIcon = await loadLucideIcon("plus-square", 24, COLORS.textMuted, 1.8);
  bottomNav.appendChild(plusIcon);

  // Nav 4: Reels
  const reelsIcon = await loadLucideIcon("clapperboard", 24, COLORS.textMuted, 1.8);
  bottomNav.appendChild(reelsIcon);

  // Nav 5: Profile Avatar
  const navAvatar = figma.createFrame();
  navAvatar.name = "Nav_User_Avatar";
  navAvatar.resize(26, 26);
  navAvatar.cornerRadius = 999;
  navAvatar.strokes = [{ type: 'SOLID', color: COLORS.borderLight }];
  navAvatar.strokeWeight = 1;
  bottomNav.appendChild(navAvatar);
  await applyOnlineImage(navAvatar, "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80");

  // 7. Select & Focus Canvas
  figma.currentPage.selection = [root];
  figma.viewport.scrollAndZoomIntoView([root]);

  console.log("Successfully generated Instagram Explore Post screen!");
})();
