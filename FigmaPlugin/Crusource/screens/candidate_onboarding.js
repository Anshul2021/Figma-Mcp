// Generated Figma Script: Crusource Enterprise HRMS — Candidate Onboarding & Verification Workspace
// Project: Crusource
// File: Crusource/screens/candidate_onboarding.js
// Strict Local Tokens Compliance: Instrument Sans font, Crusource Orange (#FF7700), 0 emojis, vector Lucide icons (1.5px stroke), Auto Layout protocol & Absolute Overlay Order Rule (v1.2)
(async function(figma) {
  // 1. Load Mandatory Fonts (Instrument Sans from Crusource local/fonts.md)
  let PRIMARY_FONT = "Instrument Sans";
  try {
    await figma.loadFontAsync({ family: "Instrument Sans", style: "Regular" });
    await figma.loadFontAsync({ family: "Instrument Sans", style: "Medium" });
    await figma.loadFontAsync({ family: "Instrument Sans", style: "SemiBold" });
    await figma.loadFontAsync({ family: "Instrument Sans", style: "Bold" });
  } catch (err) {
    PRIMARY_FONT = "Inter";
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    await figma.loadFontAsync({ family: "Inter", style: "SemiBold" });
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  }

  // 2. Clean Canvas Board
  const existingBoard = figma.currentPage.findChild(node => node.name === "Generated UI Screens");
  if (existingBoard) {
    existingBoard.remove();
  }

  // 3. Design System Tokens (From Crusource local/colors.md & local/taste.md)
  const COLOR_BG = { r: 0.973, g: 0.980, b: 0.988 };          // #F8FAFC Slate-50 Background
  const COLOR_SURFACE = { r: 1.000, g: 1.000, b: 1.000 };     // #FFFFFF Pure White Surface
  const COLOR_PRIMARY = { r: 1.000, g: 0.467, b: 0.000 };     // #FF7700 Crusource Orange (Primary-600)
  const COLOR_PRIMARY_LIGHT = { r: 1.000, g: 0.941, b: 0.902 }; // #FFF0E6 Soft Orange Tint (Primary-100)
  const COLOR_TEXT_HEAD = { r: 0.059, g: 0.090, b: 0.165 };     // #0F172A Slate-900 Primary Text
  const COLOR_TEXT_BODY = { r: 0.200, g: 0.255, b: 0.333 };     // #334155 Slate-700 Body Text
  const COLOR_TEXT_MUTED = { r: 0.392, g: 0.455, b: 0.545 };    // #64748B Slate-500 Muted Labels
  const COLOR_BORDER = { r: 0.796, g: 0.835, b: 0.882 };        // #CBD5E1 Slate-300 Component Border
  const COLOR_BADGE_AMBER = { r: 0.996, g: 0.953, b: 0.878 }; // #FEF3C7 Soft Amber Fill
  const COLOR_BADGE_TEXT = { r: 0.851, g: 0.463, b: 0.024 };   // #D97706 Amber Warning Text
  const COLOR_ROW_BLUE = { r: 0.945, g: 0.961, b: 0.976 };     // #F1F5F9 Slate-100 Row Tint
  const COLOR_REJECT_RED = { r: 0.937, g: 0.267, b: 0.267 };   // #EF4444 Error Red
  const COLOR_INFO_BLUE = { r: 0.231, g: 0.510, b: 0.965 };    // #3B82F6 Info Blue

  // Helper: Vector Icon Fetcher with Safe Res.ok Validation & 1.5px Stroke Width
  async function loadLucideIcon(iconName, size = 18, color = COLOR_TEXT_BODY, strokeWidth = 1.5) {
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
      return createFallbackIcon(size, color, strokeWidth);
    }
  }

  function createFallbackIcon(size = 18, color = COLOR_TEXT_BODY, strokeWidth = 1.5) {
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

  // Helper: Text Creator (Strict EVEN font sizes: 10, 12, 14, 16, 20, 24, 32)
  function createText(content, fontSize, fontStyle = "Regular", color = COLOR_TEXT_HEAD) {
    const text = figma.createText();
    text.fontName = { family: PRIMARY_FONT, style: fontStyle };
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

  // 2. Desktop Screen Container: 1440px x 900px Landscape Workspace (from local/brief.md & local/taste.md)
  const screen = figma.createFrame();
  screen.name = "Screen / Candidate Onboarding Workspace";
  screen.layoutMode = "HORIZONTAL";
  screen.resize(1440, 900);
  screen.primaryAxisSizingMode = "FIXED";
  screen.counterAxisSizingMode = "FIXED";
  screen.fills = [{ type: 'SOLID', color: COLOR_BG }];
  board.appendChild(screen);

  // ═══════════════════════════════════════════════════════════
  // SECTION 1: LEFT ULTRA-THIN NAVIGATION SIDEBAR (64px x 900px)
  // ═══════════════════════════════════════════════════════════
  const sidebar = figma.createFrame();
  sidebar.name = "Sidebar / Navigation Bar";
  sidebar.layoutMode = "VERTICAL";
  sidebar.resize(64, 900);
  sidebar.primaryAxisSizingMode = "FIXED";
  sidebar.counterAxisSizingMode = "FIXED";
  sidebar.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  sidebar.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  sidebar.paddingTop = 16; sidebar.paddingBottom = 16;
  sidebar.paddingLeft = 14; sidebar.paddingRight = 14;
  sidebar.itemSpacing = 16;
  sidebar.primaryAxisAlignItems = "SPACE_BETWEEN";
  sidebar.counterAxisAlignItems = "CENTER";
  screen.appendChild(sidebar);

  // Top Nav Icons Container
  const topNavGroup = makeHugContainer("Top Nav Icons", "VERTICAL", 14);
  sidebar.appendChild(topNavGroup);

  const navIcons = [
    "panel-left", "play-circle", "grid", "image", "aperture", "briefcase",
    "user-check", "fingerprint", "shield-check", "file-text", "sparkles",
    "clock", "folder", "calendar"
  ];

  for (let i = 0; i < navIcons.length; i++) {
    const iconName = navIcons[i];
    const iconBtn = makeHugContainer(`Nav / ${iconName}`, "HORIZONTAL", 0);
    iconBtn.paddingLeft = 6; iconBtn.paddingRight = 6;
    iconBtn.paddingTop = 6; iconBtn.paddingBottom = 6;
    iconBtn.cornerRadius = 6; // radius-sm: 6px from local/taste.md
    
    // Highlight "user-check" (Active Candidate Onboarding Tab with Crusource Orange)
    if (iconName === "user-check") {
      iconBtn.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }];
      iconBtn.appendChild(await loadLucideIcon(iconName, 18, COLOR_PRIMARY, 1.5));
    } else {
      iconBtn.appendChild(await loadLucideIcon(iconName, 18, COLOR_TEXT_MUTED, 1.5));
    }
    topNavGroup.appendChild(iconBtn);
  }

  // Bottom Sidebar Controls (Avatar + Crusource Orange Circle 'C' Logo)
  const bottomNavGroup = makeHugContainer("Bottom Nav Group", "VERTICAL", 12);
  bottomNavGroup.counterAxisAlignItems = "CENTER";

  // Refresh Sync Button
  const syncBtn = makeHugContainer("Sync Btn", "HORIZONTAL", 0);
  syncBtn.paddingLeft = 6; syncBtn.paddingRight = 6;
  syncBtn.paddingTop = 6; syncBtn.paddingBottom = 6;
  syncBtn.cornerRadius = 6;
  syncBtn.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }];
  syncBtn.appendChild(await loadLucideIcon("refresh-cw", 16, COLOR_PRIMARY, 1.5));
  bottomNavGroup.appendChild(syncBtn);

  // User Profile Avatar Circle (32px x 32px)
  const userAvatar = figma.createFrame();
  userAvatar.name = "User Avatar";
  userAvatar.resize(32, 32);
  userAvatar.cornerRadius = 16;
  userAvatar.clipsContent = true;
  await applyOnlineImage(userAvatar, "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80");
  bottomNavGroup.appendChild(userAvatar);

  // Crusource Orange Circle 'C' Logo (36px x 36px)
  const brandLogo = figma.createFrame();
  brandLogo.name = "Brand Logo / Crusource";
  brandLogo.layoutMode = "VERTICAL";
  brandLogo.resize(36, 36);
  brandLogo.primaryAxisSizingMode = "FIXED";
  brandLogo.counterAxisSizingMode = "FIXED";
  brandLogo.primaryAxisAlignItems = "CENTER";
  brandLogo.counterAxisAlignItems = "CENTER";
  brandLogo.cornerRadius = 18;
  brandLogo.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
  brandLogo.appendChild(createText("C", 16, "Bold", COLOR_SURFACE));
  bottomNavGroup.appendChild(brandLogo);

  sidebar.appendChild(bottomNavGroup);

  // ═══════════════════════════════════════════════════════════
  // SECTION 2: RIGHT MAIN WORKSPACE FRAME (1376px x 900px)
  // ═══════════════════════════════════════════════════════════
  const mainWorkspace = figma.createFrame();
  mainWorkspace.name = "Main Workspace Area";
  mainWorkspace.layoutMode = "VERTICAL";
  mainWorkspace.resize(1376, 900);
  mainWorkspace.primaryAxisSizingMode = "FIXED";
  mainWorkspace.counterAxisSizingMode = "FIXED";
  mainWorkspace.fills = [];
  screen.appendChild(mainWorkspace);

  // ── 1. TOP DASHBOARD HEADER BAR (1376px x 64px) ──
  const topHeader = makeSpaceBetweenRow("Header / Workspace Bar", 1376);
  topHeader.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  topHeader.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  topHeader.paddingLeft = 24; topHeader.paddingRight = 24;
  topHeader.paddingTop = 14; topHeader.paddingBottom = 14;
  mainWorkspace.appendChild(topHeader);

  topHeader.appendChild(createText("Candidate Onboarding", 16, "Bold", COLOR_TEXT_HEAD));

  // Top Header Action Tools (Search, + Add, Calendar, Mail, Check Badge, Bell)
  const headerTools = makeHugContainer("Header Actions", "HORIZONTAL", 12);

  headerTools.appendChild(await loadLucideIcon("search", 18, COLOR_TEXT_MUTED, 1.5));

  // Primary Plus Action Button (Crusource Orange #FF7700)
  const addBtn = makeHugContainer("Plus Btn", "HORIZONTAL", 0);
  addBtn.paddingLeft = 8; addBtn.paddingRight = 8;
  addBtn.paddingTop = 6; addBtn.paddingBottom = 6;
  addBtn.cornerRadius = 6; // radius-sm: 6px
  addBtn.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
  addBtn.appendChild(await loadLucideIcon("plus", 16, COLOR_SURFACE, 1.5));
  headerTools.appendChild(addBtn);

  // Calendar Pill
  const calPill = makeHugContainer("Pill / Calendar", "HORIZONTAL", 6);
  calPill.paddingLeft = 10; calPill.paddingRight = 10;
  calPill.paddingTop = 6; calPill.paddingBottom = 6;
  calPill.cornerRadius = 6;
  calPill.fills = [{ type: 'SOLID', color: COLOR_BG }];
  calPill.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  calPill.appendChild(await loadLucideIcon("calendar", 14, COLOR_TEXT_MUTED, 1.5));
  calPill.appendChild(createText("Calendar", 12, "Medium", COLOR_TEXT_BODY));
  headerTools.appendChild(calPill);

  headerTools.appendChild(await loadLucideIcon("mail", 18, COLOR_TEXT_MUTED, 1.5));

  // Check Badge with Count 5
  const checkBadge = makeHugContainer("Badge / Count Check", "HORIZONTAL", 4);
  checkBadge.appendChild(await loadLucideIcon("check-circle-2", 18, COLOR_TEXT_MUTED, 1.5));
  const numCircle = makeHugContainer("Num Circle", "HORIZONTAL", 0);
  numCircle.paddingLeft = 4; numCircle.paddingRight = 4;
  numCircle.paddingTop = 2; numCircle.paddingBottom = 2;
  numCircle.cornerRadius = 4; // radius-xs: 4px
  numCircle.fills = [{ type: 'SOLID', color: COLOR_INFO_BLUE }];
  numCircle.appendChild(createText("5", 10, "Bold", COLOR_SURFACE));
  checkBadge.appendChild(numCircle);
  headerTools.appendChild(checkBadge);

  // Bell Notification Group
  const bellGroup = makeHugContainer("Bell Group", "HORIZONTAL", 0);
  bellGroup.appendChild(await loadLucideIcon("bell", 18, COLOR_TEXT_MUTED, 1.5));
  headerTools.appendChild(bellGroup);

  topHeader.appendChild(headerTools);

  // ── 2. SCROLLABLE DASHBOARD CONTENT CANVAS ──
  const contentArea = figma.createFrame();
  contentArea.name = "Content / Scrollable Workspace Area";
  contentArea.layoutMode = "VERTICAL";
  contentArea.resize(1376, 836);
  contentArea.primaryAxisSizingMode = "FIXED";
  contentArea.counterAxisSizingMode = "FIXED";
  contentArea.itemSpacing = 20;
  contentArea.paddingLeft = 140; contentArea.paddingRight = 140; // Centered 916px layout
  contentArea.paddingTop = 24; contentArea.paddingBottom = 40;
  contentArea.fills = [];
  contentArea.clipsContent = true;
  mainWorkspace.appendChild(contentArea);

  // ═══════════════════════════════════════════════════════════
  // CARD 1: CANDIDATE PROFILE & VERIFICATION METRICS CARD (radius-xl: 16px)
  // ═══════════════════════════════════════════════════════════
  const profileCard = makeContentCard("Card / Candidate Profile & Summary", 916, {
    cornerRadius: 16, // radius-xl from local/taste.md
    fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
    strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
    paddingLeft: 24, paddingRight: 24, paddingTop: 24, paddingBottom: 24,
    itemSpacing: 20
  });
  contentArea.appendChild(profileCard);

  // Profile Header Row
  const profileHeaderRow = makeSpaceBetweenRow("Profile Header Row", 868);

  // Left: Photo + Name + Meta
  const profileLeft = makeHugContainer("Profile Left Block", "HORIZONTAL", 16);

  // Candidate Photo Circle (64px x 64px)
  const candidatePhoto = figma.createFrame();
  candidatePhoto.name = "Candidate Photo";
  candidatePhoto.resize(64, 64);
  candidatePhoto.cornerRadius = 32;
  candidatePhoto.clipsContent = true;
  await applyOnlineImage(candidatePhoto, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80");
  profileLeft.appendChild(candidatePhoto);

  // Candidate Name & Details Stack
  const nameStack = makeHugContainer("Name & Details Stack", "VERTICAL", 6);
  nameStack.counterAxisAlignItems = "MIN";

  nameStack.appendChild(createText("Sophia Martinez", 20, "Bold", COLOR_TEXT_HEAD));
  nameStack.appendChild(createText("UI/UX Designer · Design", 12, "Medium", COLOR_TEXT_MUTED));

  // Meta Tags Row (email, ID, location, joining date)
  const metaRow = makeHugContainer("Meta Info Row", "HORIZONTAL", 12);

  const emailTag = makeHugContainer("Email Tag", "HORIZONTAL", 4);
  emailTag.appendChild(await loadLucideIcon("mail", 14, COLOR_TEXT_MUTED, 1.5));
  emailTag.appendChild(createText("sophia.martinez@email.com", 12, "Regular", COLOR_TEXT_MUTED));
  metaRow.appendChild(emailTag);

  const idTag = makeHugContainer("ID Tag", "HORIZONTAL", 4);
  idTag.appendChild(await loadLucideIcon("file-text", 14, COLOR_TEXT_MUTED, 1.5));
  idTag.appendChild(createText("CND004", 12, "Regular", COLOR_TEXT_MUTED));
  metaRow.appendChild(idTag);

  const locTag = makeHugContainer("Location Tag", "HORIZONTAL", 4);
  locTag.appendChild(await loadLucideIcon("map-pin", 14, COLOR_TEXT_MUTED, 1.5));
  locTag.appendChild(createText("Austin, TX", 12, "Regular", COLOR_TEXT_MUTED));
  metaRow.appendChild(locTag);

  const dateTag = makeHugContainer("Date Tag", "HORIZONTAL", 4);
  dateTag.appendChild(await loadLucideIcon("clock", 14, COLOR_TEXT_MUTED, 1.5));
  dateTag.appendChild(createText("Joining: 2026-04-01", 12, "Regular", COLOR_TEXT_MUTED));
  metaRow.appendChild(dateTag);

  nameStack.appendChild(metaRow);
  profileLeft.appendChild(nameStack);
  profileHeaderRow.appendChild(profileLeft);

  // Right: Status Badges (Pending Review & Contract)
  const statusBadgeCol = makeHugContainer("Status Badges", "VERTICAL", 8);
  statusBadgeCol.counterAxisAlignItems = "MAX";

  const pendingBadge = makeHugContainer("Badge / Pending Review", "HORIZONTAL", 0);
  pendingBadge.paddingLeft = 12; pendingBadge.paddingRight = 12;
  pendingBadge.paddingTop = 6; pendingBadge.paddingBottom = 6;
  pendingBadge.cornerRadius = 4; // radius-xs: 4px
  pendingBadge.fills = [{ type: 'SOLID', color: COLOR_BADGE_AMBER }];
  pendingBadge.appendChild(createText("Pending Review", 12, "Bold", COLOR_BADGE_TEXT));
  statusBadgeCol.appendChild(pendingBadge);

  const contractBadge = makeHugContainer("Badge / Contract", "HORIZONTAL", 0);
  contractBadge.paddingLeft = 12; contractBadge.paddingRight = 12;
  contractBadge.paddingTop = 4; contractBadge.paddingBottom = 4;
  contractBadge.cornerRadius = 4; // radius-xs: 4px
  contractBadge.fills = [{ type: 'SOLID', color: COLOR_BG }];
  contractBadge.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  contractBadge.appendChild(createText("Contract", 12, "Medium", COLOR_TEXT_MUTED));
  statusBadgeCol.appendChild(contractBadge);

  profileHeaderRow.appendChild(statusBadgeCol);
  profileCard.appendChild(profileHeaderRow);

  // Divider Line
  const divLine = figma.createFrame();
  divLine.name = "Divider Line";
  divLine.resize(868, 1);
  divLine.fills = [{ type: 'SOLID', color: COLOR_BORDER }];
  profileCard.appendChild(divLine);

  // 4 Metric Columns (Docs Received, Verified, Rejected, Submitted Date)
  const metricsRow = makeSpaceBetweenRow("Metrics Row", 868);

  // Col 1: Docs Received
  const col1 = makeHugContainer("Metric / Docs Received", "VERTICAL", 4);
  col1.counterAxisAlignItems = "MIN";
  col1.appendChild(createText("DOCS RECEIVED", 10, "Bold", COLOR_TEXT_MUTED));
  
  const recValRow = makeHugContainer("Rec Val Row", "HORIZONTAL", 4);
  recValRow.appendChild(createText("15", 16, "Bold", COLOR_TEXT_HEAD));
  recValRow.appendChild(createText("/ 26", 12, "Medium", COLOR_TEXT_MUTED));
  col1.appendChild(recValRow);

  // Progress Bar Primary Crusource Orange
  const prog1Bg = figma.createFrame();
  prog1Bg.name = "Progress Bar Bg";
  prog1Bg.resize(160, 4);
  prog1Bg.cornerRadius = 2;
  prog1Bg.fills = [{ type: 'SOLID', color: COLOR_BG }];
  const prog1Fill = figma.createFrame();
  prog1Fill.name = "Fill";
  prog1Fill.resize(92, 4);
  prog1Fill.cornerRadius = 2;
  prog1Fill.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
  prog1Bg.appendChild(prog1Fill);
  col1.appendChild(prog1Bg);
  metricsRow.appendChild(col1);

  // Col 2: Docs Verified
  const col2 = makeHugContainer("Metric / Docs Verified", "VERTICAL", 4);
  col2.counterAxisAlignItems = "MIN";
  col2.appendChild(createText("DOCS VERIFIED", 10, "Bold", COLOR_TEXT_MUTED));
  
  const verValRow = makeHugContainer("Ver Val Row", "HORIZONTAL", 4);
  verValRow.appendChild(createText("0", 16, "Bold", { r: 0.063, g: 0.725, b: 0.506 }));
  verValRow.appendChild(createText("/ 15", 12, "Medium", COLOR_TEXT_MUTED));
  col2.appendChild(verValRow);

  const prog2Bg = figma.createFrame();
  prog2Bg.name = "Progress Bar Bg";
  prog2Bg.resize(160, 4);
  prog2Bg.cornerRadius = 2;
  prog2Bg.fills = [{ type: 'SOLID', color: COLOR_BG }];
  col2.appendChild(prog2Bg);
  metricsRow.appendChild(col2);

  // Col 3: Docs Rejected
  const col3 = makeHugContainer("Metric / Docs Rejected", "VERTICAL", 4);
  col3.counterAxisAlignItems = "MIN";
  col3.appendChild(createText("DOCS REJECTED", 10, "Bold", COLOR_TEXT_MUTED));
  col3.appendChild(createText("0", 16, "Bold", COLOR_REJECT_RED));
  col3.appendChild(createText("No rejections", 10, "Regular", COLOR_TEXT_MUTED));
  metricsRow.appendChild(col3);

  // Col 4: Submitted Date
  const col4 = makeHugContainer("Metric / Submitted Date", "VERTICAL", 4);
  col4.counterAxisAlignItems = "MIN";
  col4.appendChild(createText("SUBMITTED ON", 10, "Bold", COLOR_TEXT_MUTED));
  col4.appendChild(createText("2026-02-12 01:10 PM", 12, "Bold", COLOR_TEXT_HEAD));
  col4.appendChild(createText("Awaiting review", 10, "Regular", COLOR_TEXT_MUTED));
  metricsRow.appendChild(col4);

  profileCard.appendChild(metricsRow);
  finalizeHugHeight(profileCard);

  // ═══════════════════════════════════════════════════════════
  // CARD 2: DOCUMENT VERIFICATION TABLE & TABS CARD (radius-lg: 12px)
  // ═══════════════════════════════════════════════════════════
  const docCard = makeContentCard("Card / Document Verification Table", 916, {
    cornerRadius: 12, // radius-lg: 12px from local/taste.md
    fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
    strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
    paddingLeft: 0, paddingRight: 0, paddingTop: 16, paddingBottom: 16,
    itemSpacing: 12
  });
  contentArea.appendChild(docCard);

  // Tab Navigation Header Row
  const tabHeaderRow = makeSpaceBetweenRow("Tab Header Row", 868);
  tabHeaderRow.paddingLeft = 24; tabHeaderRow.paddingRight = 24;

  const tabLeftGroup = makeHugContainer("Tab Items Left", "HORIZONTAL", 24);

  const tab1 = makeHugContainer("Tab / BGV Documents", "HORIZONTAL", 0);
  tab1.paddingBottom = 8;
  tab1.appendChild(createText("BGV documents", 14, "Medium", COLOR_TEXT_MUTED));
  tabLeftGroup.appendChild(tab1);

  const tab2 = makeHugContainer("Tab / Offer Letter Active", "VERTICAL", 8);
  tab2.appendChild(createText("Offer letter & Employment Onboarding Form", 14, "Bold", COLOR_PRIMARY));
  const activeLine = figma.createFrame();
  activeLine.name = "Active Underline";
  activeLine.resize(260, 2);
  activeLine.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
  tab2.appendChild(activeLine);
  tabLeftGroup.appendChild(tab2);

  tabHeaderRow.appendChild(tabLeftGroup);

  // Download All Button
  const downloadAllBtn = makeHugContainer("Btn / Download All", "HORIZONTAL", 6);
  downloadAllBtn.paddingLeft = 12; downloadAllBtn.paddingRight = 12;
  downloadAllBtn.paddingTop = 6; downloadAllBtn.paddingBottom = 6;
  downloadAllBtn.cornerRadius = 6; // radius-sm: 6px
  downloadAllBtn.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  downloadAllBtn.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  downloadAllBtn.appendChild(await loadLucideIcon("download", 14, COLOR_TEXT_BODY, 1.5));
  downloadAllBtn.appendChild(createText("Download all", 12, "Medium", COLOR_TEXT_BODY));
  tabHeaderRow.appendChild(downloadAllBtn);

  docCard.appendChild(tabHeaderRow);

  // Document Items List (7 Rows with Checkboxes)
  const docsList = [
    { title: "Offer letter", subtitle: "Uploaded by candidate" },
    { title: "PF-Form 11", subtitle: "Uploaded by candidate" },
    { title: "EPF-Form 2", subtitle: "Uploaded by candidate" },
    { title: "FWC-HRIS", subtitle: "Uploaded by candidate" },
    { title: "FWC-Insurance floater data", subtitle: "Uploaded by candidate" },
    { title: "Form-F-Gratuity Nomination form", subtitle: "Uploaded by candidate" },
    { title: "Wage nomination", subtitle: "Uploaded by candidate" }
  ];

  for (let i = 0; i < docsList.length; i++) {
    const doc = docsList[i];
    const row = makeSpaceBetweenRow(`Doc Row / ${doc.title}`, 916);
    row.paddingLeft = 24; row.paddingRight = 24;
    row.paddingTop = 10; row.paddingBottom = 10;
    row.fills = [{ type: 'SOLID', color: COLOR_ROW_BLUE }];

    // Left Checkbox + File Title + Subtitle
    const rowLeft = makeHugContainer("Row Left", "HORIZONTAL", 12);

    const checkbox = makeHugContainer("Checkbox", "HORIZONTAL", 0);
    checkbox.resize(16, 16);
    checkbox.cornerRadius = 3;
    checkbox.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
    rowLeft.appendChild(checkbox);

    const titleGroup = makeHugContainer("Title Group", "HORIZONTAL", 12);
    titleGroup.appendChild(createText(doc.title, 14, "Bold", COLOR_TEXT_HEAD));
    titleGroup.appendChild(createText(doc.subtitle, 12, "Regular", COLOR_TEXT_MUTED));
    rowLeft.appendChild(titleGroup);

    row.appendChild(rowLeft);

    // Right Action Icons (Download & Eye View)
    const rowRight = makeHugContainer("Row Actions", "HORIZONTAL", 12);
    rowRight.appendChild(await loadLucideIcon("download", 16, COLOR_TEXT_MUTED, 1.5));
    rowRight.appendChild(await loadLucideIcon("eye", 16, COLOR_TEXT_MUTED, 1.5));
    row.appendChild(rowRight);

    docCard.appendChild(row);
  }

  // Table Footer Bar (Sent on / Submitted on timestamps)
  const tableFooter = makeSpaceBetweenRow("Table Footer", 868);
  tableFooter.paddingLeft = 24; tableFooter.paddingRight = 24;
  tableFooter.paddingTop = 8;
  tableFooter.appendChild(createText("Sent on 10/02/20", 10, "Regular", COLOR_TEXT_MUTED));
  tableFooter.appendChild(createText("Submitted on 12/02/20", 10, "Regular", COLOR_TEXT_MUTED));
  docCard.appendChild(tableFooter);

  finalizeHugHeight(docCard);

  // ── 3. FLOATING "+ REQUEST DOCUMENT" BUTTON ──
  const requestBtn = makeHugContainer("CTA / Request Document", "HORIZONTAL", 6);
  requestBtn.paddingLeft = 16; requestBtn.paddingRight = 16;
  requestBtn.paddingTop = 10; requestBtn.paddingBottom = 10;
  requestBtn.cornerRadius = 6; // radius-sm: 6px
  requestBtn.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  requestBtn.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  requestBtn.appendChild(await loadLucideIcon("plus", 14, COLOR_TEXT_BODY, 1.5));
  requestBtn.appendChild(createText("Request Document", 12, "Bold", COLOR_TEXT_BODY));
  contentArea.appendChild(requestBtn);

  // 4. Viewport Focus
  figma.viewport.scrollAndZoomIntoView([board]);
  figma.notify("Created Candidate Onboarding Workspace Screen in Crusource with local/ tokens!", { timeout: 2500 });
})(figma);
