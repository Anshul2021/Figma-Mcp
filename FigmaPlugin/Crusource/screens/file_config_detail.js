// Generated Figma Script: Crusource Enterprise HRMS — Full Time (Internal) File Configuration Detail
// Project: Crusource
// File: Crusource/screens/file_config_detail.js
// Strict Compliance: Instrument Sans font, Crusource Orange (#FF7700), 0 emojis, vector Lucide icons with 1.5px stroke width, Auto Layout protocol & Absolute Overlay Order Rule (v1.2)
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

  // 3. Design System Tokens (Crusource local/colors.md & local/taste.md)
  const COLOR_BG = { r: 0.973, g: 0.980, b: 0.988 };          // #F8FAFC Slate-50 Background
  const COLOR_SURFACE = { r: 1.000, g: 1.000, b: 1.000 };     // #FFFFFF Pure White Surface
  const COLOR_PRIMARY = { r: 1.000, g: 0.467, b: 0.000 };     // #FF7700 Crusource Orange
  const COLOR_PRIMARY_LIGHT = { r: 1.000, g: 0.941, b: 0.902 }; // #FFF0E6 Soft Orange Tint
  const COLOR_TEXT_HEAD = { r: 0.059, g: 0.090, b: 0.165 };     // #0F172A Slate-900 Headings
  const COLOR_TEXT_BODY = { r: 0.200, g: 0.255, b: 0.333 };     // #334155 Slate-700 Body Text
  const COLOR_TEXT_MUTED = { r: 0.392, g: 0.455, b: 0.545 };    // #64748B Slate-500 Descriptions
  const COLOR_BORDER = { r: 0.898, g: 0.906, b: 0.922 };        // #E5E7EB Border
  const COLOR_BORDER_LIGHT = { r: 0.945, g: 0.961, b: 0.976 };  // #F1F5F9 Soft Border
  const COLOR_TAB_ACTIVE = { r: 0.953, g: 0.961, b: 0.973 };    // #F3F5F8 Tab Active Background
  const COLOR_ROW_ALT = { r: 0.973, g: 0.980, b: 0.988 };      // #F8FAFC Alternating Row Fill
  const COLOR_SUCCESS = { r: 0.063, g: 0.725, b: 0.506 };       // #10B981 Active Badge Green
  const COLOR_AMBER = { r: 0.960, g: 0.624, b: 0.043 };         // #F59E0B Optional Amber Tag

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

  // Helper: Text Creator (Strict EVEN font sizes: 10, 12, 14, 16, 20, 24, 32)
  function createText(content, fontSize, fontStyle = "Regular", color = COLOR_TEXT_HEAD) {
    const text = figma.createText();
    text.fontName = { family: PRIMARY_FONT, style: fontStyle };
    text.fontSize = fontSize;
    text.characters = String(content);
    text.fills = [{ type: 'SOLID', color }];
    return text;
  }

  // Auto Layout Helper Functions
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

  // 2. Desktop Modal Screen Container: 1440px x 900px Landscape Desktop Workspace
  const screen = figma.createFrame();
  screen.name = "Screen / Full Time File Configuration Detail Workspace";
  screen.layoutMode = "VERTICAL";
  screen.resize(1440, 900);
  screen.primaryAxisSizingMode = "FIXED";
  screen.counterAxisSizingMode = "FIXED";
  screen.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  board.appendChild(screen);

  // ═══════════════════════════════════════════════════════════
  // SECTION 1: TOP MODAL HEADER BAR (1440px x 56px)
  // ═══════════════════════════════════════════════════════════
  const topHeader = makeSpaceBetweenRow("Header / Settings Title Bar", 1440);
  topHeader.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  topHeader.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  topHeader.paddingLeft = 24; topHeader.paddingRight = 24;
  topHeader.paddingTop = 16; topHeader.paddingBottom = 16;
  screen.appendChild(topHeader);

  const titleGroup = makeHugContainer("Title Group", "HORIZONTAL", 8);
  titleGroup.appendChild(await loadLucideIcon("settings", 20, COLOR_TEXT_HEAD, 1.5));
  titleGroup.appendChild(createText("Settings", 16, "Bold", COLOR_TEXT_HEAD));
  topHeader.appendChild(titleGroup);

  const closeBtn = makeHugContainer("Close Button", "HORIZONTAL", 0);
  closeBtn.appendChild(await loadLucideIcon("x", 20, COLOR_TEXT_MUTED, 1.5));
  topHeader.appendChild(closeBtn);

  // ═══════════════════════════════════════════════════════════
  // SECTION 2: MAIN BODY SPLIT VIEW (220px Sidebar + 1220px Content)
  // ═══════════════════════════════════════════════════════════
  const bodySplit = figma.createFrame();
  bodySplit.name = "Body / Split View";
  bodySplit.layoutMode = "HORIZONTAL";
  bodySplit.resize(1440, 844);
  bodySplit.primaryAxisSizingMode = "FIXED";
  bodySplit.counterAxisSizingMode = "FIXED";
  bodySplit.fills = [];
  screen.appendChild(bodySplit);

  // ── LEFT NAVIGATION SIDEBAR (220px x 844px) ──
  const settingsSidebar = figma.createFrame();
  settingsSidebar.name = "Sidebar / Settings Tabs";
  settingsSidebar.layoutMode = "VERTICAL";
  settingsSidebar.resize(220, 844);
  settingsSidebar.primaryAxisSizingMode = "FIXED";
  settingsSidebar.counterAxisSizingMode = "FIXED";
  settingsSidebar.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  settingsSidebar.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  settingsSidebar.paddingLeft = 16; settingsSidebar.paddingRight = 16;
  settingsSidebar.paddingTop = 20; settingsSidebar.paddingBottom = 20;
  settingsSidebar.itemSpacing = 6;
  bodySplit.appendChild(settingsSidebar);

  // 7 Sidebar Tabs ("File Configurations" active)
  const sidebarTabs = [
    { title: "Company Profile", icon: "building-2", active: false },
    { title: "Leave Policy", icon: "calendar", active: false },
    { title: "Modules", icon: "layout-grid", active: false },
    { title: "File Configurations", icon: "folder-cog", active: true },  // ACTIVE TAB
    { title: "Notifications", icon: "bell", active: false },
    { title: "Integrations", icon: "globe", active: false },
    { title: "Billing", icon: "credit-card", active: false }
  ];

  for (const tab of sidebarTabs) {
    const tabItem = makeHugContainer(`Tab / ${tab.title}`, "HORIZONTAL", 10);
    tabItem.resize(188, 36);
    tabItem.primaryAxisSizingMode = "FIXED";
    tabItem.counterAxisSizingMode = "FIXED";
    tabItem.paddingLeft = 12; tabItem.paddingRight = 12;
    tabItem.paddingTop = 8; tabItem.paddingBottom = 8;
    tabItem.cornerRadius = 8; // radius-md: 8px

    if (tab.active) {
      tabItem.fills = [{ type: 'SOLID', color: COLOR_TAB_ACTIVE }];
      tabItem.appendChild(await loadLucideIcon(tab.icon, 18, COLOR_TEXT_HEAD, 1.5));
      tabItem.appendChild(createText(tab.title, 14, "Bold", COLOR_TEXT_HEAD));
    } else {
      tabItem.fills = [];
      tabItem.appendChild(await loadLucideIcon(tab.icon, 18, COLOR_TEXT_MUTED, 1.5));
      tabItem.appendChild(createText(tab.title, 14, "Medium", COLOR_TEXT_MUTED));
    }

    settingsSidebar.appendChild(tabItem);
  }

  // ── RIGHT MAIN WORKSPACE CONTENT AREA (1220px x 844px) ──
  const mainContent = figma.createFrame();
  mainContent.name = "Content / Template Config Detail Area";
  mainContent.layoutMode = "VERTICAL";
  mainContent.resize(1220, 844);
  mainContent.primaryAxisSizingMode = "FIXED";
  mainContent.counterAxisSizingMode = "FIXED";
  mainContent.fills = [{ type: 'SOLID', color: COLOR_BG }];
  mainContent.paddingLeft = 160; mainContent.paddingRight = 160; // Centered 900px content area
  mainContent.paddingTop = 24; mainContent.paddingBottom = 40;
  mainContent.itemSpacing = 16;
  mainContent.clipsContent = true;
  bodySplit.appendChild(mainContent);

  // ── 1. BREADCRUMB & TEMPLATE HEADER ROW ──
  const topNavRow = makeSpaceBetweenRow("Breadcrumb & Action Row", 900);

  // Back Button + Breadcrumb
  const backBtn = makeHugContainer("Back Btn", "HORIZONTAL", 6);
  backBtn.paddingLeft = 8; backBtn.paddingRight = 8;
  backBtn.paddingTop = 4; backBtn.paddingBottom = 4;
  backBtn.cornerRadius = 6;
  backBtn.appendChild(await loadLucideIcon("arrow-left", 16, COLOR_TEXT_MUTED, 1.5));
  backBtn.appendChild(createText("Back to Templates", 12, "Medium", COLOR_TEXT_MUTED));
  topNavRow.appendChild(backBtn);

  // Save Configuration Primary Button (Crusource Orange #FF7700)
  const saveBtn = makeHugContainer("Btn / Save Config", "HORIZONTAL", 6);
  saveBtn.paddingLeft = 16; saveBtn.paddingRight = 16;
  saveBtn.paddingTop = 8; saveBtn.paddingBottom = 8;
  saveBtn.cornerRadius = 6; // radius-sm: 6px
  saveBtn.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
  saveBtn.appendChild(await loadLucideIcon("check", 16, COLOR_SURFACE, 1.5));
  saveBtn.appendChild(createText("Save Configuration", 12, "Bold", COLOR_SURFACE));
  topNavRow.appendChild(saveBtn);

  mainContent.appendChild(topNavRow);

  // ── 2. HERO TEMPLATE OVERVIEW CARD (radius-xl: 16px) ──
  const heroCard = makeContentCard("Card / Template Overview Header", 900, {
    cornerRadius: 16, // radius-xl: 16px from local/taste.md
    fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
    strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
    paddingLeft: 24, paddingRight: 24, paddingTop: 20, paddingBottom: 20,
    itemSpacing: 12
  });
  mainContent.appendChild(heroCard);

  const heroHeaderRow = makeSpaceBetweenRow("Hero Header Row", 852);

  const heroTitleLeft = makeHugContainer("Title Left Block", "HORIZONTAL", 14);

  // Icon Box (Briefcase)
  const iconBox = figma.createFrame();
  iconBox.name = "Icon Box Container";
  iconBox.layoutMode = "VERTICAL";
  iconBox.resize(48, 48);
  iconBox.primaryAxisSizingMode = "FIXED";
  iconBox.counterAxisSizingMode = "FIXED";
  iconBox.primaryAxisAlignItems = "CENTER";
  iconBox.counterAxisAlignItems = "CENTER";
  iconBox.cornerRadius = 10;
  iconBox.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }];
  iconBox.strokes = [{ type: 'SOLID', color: { r: 1.000, g: 0.850, b: 0.750 } }];
  iconBox.appendChild(await loadLucideIcon("briefcase", 22, COLOR_PRIMARY, 1.5));
  heroTitleLeft.appendChild(iconBox);

  // Title Stack
  const titleTextStack = makeHugContainer("Title Text Stack", "VERTICAL", 4);
  titleTextStack.counterAxisAlignItems = "MIN";

  const titleRowWithBadge = makeHugContainer("Title Row", "HORIZONTAL", 10);
  titleRowWithBadge.appendChild(createText("Full Time (Internal)", 20, "Bold", COLOR_TEXT_HEAD));

  const totalBadge = makeHugContainer("Total Count Badge", "HORIZONTAL", 4);
  totalBadge.paddingLeft = 8; totalBadge.paddingRight = 8;
  totalBadge.paddingTop = 2; totalBadge.paddingBottom = 2;
  totalBadge.cornerRadius = 4; // radius-xs: 4px
  totalBadge.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }];
  totalBadge.appendChild(await loadLucideIcon("files", 12, COLOR_PRIMARY, 1.5));
  totalBadge.appendChild(createText("15 Total Configured Documents", 10, "Bold", COLOR_PRIMARY));
  titleRowWithBadge.appendChild(totalBadge);

  titleTextStack.appendChild(titleRowWithBadge);
  titleTextStack.appendChild(createText("Standard onboarding document bundle required for full-time internal hires.", 12, "Regular", COLOR_TEXT_MUTED));

  heroTitleLeft.appendChild(titleTextStack);
  heroHeaderRow.appendChild(heroTitleLeft);

  heroCard.appendChild(heroHeaderRow);

  // Hero Card Metadata Row
  const heroMetaRow = makeSpaceBetweenRow("Hero Meta Row", 852);

  const metaLeft = makeHugContainer("Meta Left", "HORIZONTAL", 16);

  const updatedTag = makeHugContainer("Updated Date Tag", "HORIZONTAL", 4);
  updatedTag.appendChild(await loadLucideIcon("clock", 12, COLOR_TEXT_MUTED, 1.5));
  updatedTag.appendChild(createText("Last updated on 2026-02-01", 10, "Regular", COLOR_TEXT_MUTED));
  metaLeft.appendChild(updatedTag);

  const authorTag = makeHugContainer("Author Tag", "HORIZONTAL", 4);
  authorTag.appendChild(await loadLucideIcon("user", 12, COLOR_TEXT_MUTED, 1.5));
  authorTag.appendChild(createText("Updated by Sarah Jenkins (HR Director)", 10, "Medium", COLOR_TEXT_BODY));
  metaLeft.appendChild(authorTag);

  heroMetaRow.appendChild(metaLeft);

  const activeTag = makeHugContainer("Active Tag", "HORIZONTAL", 4);
  activeTag.paddingLeft = 8; activeTag.paddingRight = 8;
  activeTag.paddingTop = 2; activeTag.paddingBottom = 2;
  activeTag.cornerRadius = 4;
  activeTag.fills = [{ type: 'SOLID', color: { r: 0.902, g: 0.980, b: 0.941 } }];
  activeTag.appendChild(await loadLucideIcon("check-circle-2", 12, COLOR_SUCCESS, 1.5));
  activeTag.appendChild(createText("Active Template", 10, "Bold", COLOR_SUCCESS));
  heroMetaRow.appendChild(activeTag);

  heroCard.appendChild(heroMetaRow);
  finalizeHugHeight(heroCard);

  // ═══════════════════════════════════════════════════════════
  // ── 3. DOCUMENT CONFIGURATION CARD WITH TABS (BGV & EPOF) ──
  // ═══════════════════════════════════════════════════════════
  const docConfigCard = makeContentCard("Card / Document Configuration Workstation", 900, {
    cornerRadius: 12, // radius-lg: 12px
    fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
    strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
    paddingLeft: 0, paddingRight: 0, paddingTop: 16, paddingBottom: 16,
    itemSpacing: 14
  });
  mainContent.appendChild(docConfigCard);

  // Tab Header Navigation Row (BGV vs EPOF)
  const tabHeaderRow = makeSpaceBetweenRow("Tab Navigation Header", 852);
  tabHeaderRow.paddingLeft = 24; tabHeaderRow.paddingRight = 24;

  const tabLeftGroup = makeHugContainer("Tab Left Group", "HORIZONTAL", 24);

  // TAB 1: BGV (Background Verification) — ACTIVE TAB
  const tab1BGV = makeHugContainer("Tab / BGV Active", "VERTICAL", 8);
  const bgvTextRow = makeHugContainer("BGV Text Row", "HORIZONTAL", 6);
  bgvTextRow.appendChild(await loadLucideIcon("shield-check", 16, COLOR_PRIMARY, 1.5));
  bgvTextRow.appendChild(createText("BGV Documents", 14, "Bold", COLOR_PRIMARY));
  
  const bgvBadge = makeHugContainer("Badge 8", "HORIZONTAL", 0);
  bgvBadge.paddingLeft = 6; bgvBadge.paddingRight = 6;
  bgvBadge.paddingTop = 1; bgvBadge.paddingBottom = 1;
  bgvBadge.cornerRadius = 8;
  bgvBadge.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }];
  bgvBadge.appendChild(createText("8 Docs", 10, "Bold", COLOR_PRIMARY));
  bgvTextRow.appendChild(bgvBadge);

  tab1BGV.appendChild(bgvTextRow);

  const activeLine = figma.createFrame();
  activeLine.name = "Active Orange Line";
  activeLine.resize(160, 2);
  activeLine.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
  tab1BGV.appendChild(activeLine);

  tabLeftGroup.appendChild(tab1BGV);

  // TAB 2: EPOF (Employee Onboarding & Offer Letter) — INACTIVE TAB
  const tab2EPOF = makeHugContainer("Tab / EPOF Inactive", "VERTICAL", 8);
  const epofTextRow = makeHugContainer("EPOF Text Row", "HORIZONTAL", 6);
  epofTextRow.appendChild(await loadLucideIcon("file-text", 16, COLOR_TEXT_MUTED, 1.5));
  epofTextRow.appendChild(createText("Employee Onboarding & Offer Letter (EPOF)", 14, "Medium", COLOR_TEXT_MUTED));
  
  const epofBadge = makeHugContainer("Badge 7", "HORIZONTAL", 0);
  epofBadge.paddingLeft = 6; epofBadge.paddingRight = 6;
  epofBadge.paddingTop = 1; epofBadge.paddingBottom = 1;
  epofBadge.cornerRadius = 8;
  epofBadge.fills = [{ type: 'SOLID', color: COLOR_BG }];
  epofBadge.appendChild(createText("7 Forms", 10, "Medium", COLOR_TEXT_MUTED));
  epofTextRow.appendChild(epofBadge);

  tab2EPOF.appendChild(epofTextRow);
  tabLeftGroup.appendChild(tab2EPOF);

  tabHeaderRow.appendChild(tabLeftGroup);
  docConfigCard.appendChild(tabHeaderRow);

  // Divider Line below tabs
  const tabDiv = figma.createFrame();
  tabDiv.name = "Tab Divider";
  tabDiv.resize(900, 1);
  tabDiv.fills = [{ type: 'SOLID', color: COLOR_BORDER_LIGHT }];
  docConfigCard.appendChild(tabDiv);

  // ── TAB 1: BGV DOCUMENTS LIST (8 Mandatory / Required Items with Checkboxes) ──
  const bgvDocsList = [
    { title: "Proof of Date of Birth", format: "Birth Cert / Xth Marksheet (PDF, JPG)", isRequired: true },
    { title: "Educational & Professional Qualifications certificates", format: "Degree / Diploma / Semester Marksheets", isRequired: true },
    { title: "Passport-size photograph scan (Red or White Background)", format: "JPEG / PNG (Max 5MB)", isRequired: true },
    { title: "Address Proof and Passport scanned copy", format: "Passport / Electricity Bill / Rental Agreement", isRequired: true },
    { title: "Pan Card scanned copy", format: "PAN Soft Copy (PDF / Image)", isRequired: true },
    { title: "Aadhar card recently downloaded soft copy from (uidai.gov.in)", format: "e-Aadhar PDF with passcode", isRequired: true },
    { title: "Internship certificates / Relieving certificate for work experience", format: "Relieving Letter / Experience Cert (if any)", isRequired: false },
    { title: "Affidavit for Education / Experience Gap", format: "Notarized Affidavit (if gap > 6 months)", isRequired: false }
  ];

  for (let i = 0; i < bgvDocsList.length; i++) {
    const doc = bgvDocsList[i];
    const row = makeSpaceBetweenRow(`BGV Doc Row / ${doc.title}`, 900);
    row.paddingLeft = 24; row.paddingRight = 24;
    row.paddingTop = 10; row.paddingBottom = 10;
    
    // Alternating Row Fills
    if (i % 2 === 1) {
      row.fills = [{ type: 'SOLID', color: COLOR_ROW_ALT }];
    } else {
      row.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
    }

    // Left Checkbox + Doc Title + Format Guidelines
    const rowLeft = makeHugContainer("Row Left Block", "HORIZONTAL", 12);

    // Active Checked Box Component
    const checkbox = makeHugContainer("Checkbox Checked", "HORIZONTAL", 0);
    checkbox.resize(18, 18);
    checkbox.cornerRadius = 4; // radius-xs: 4px
    checkbox.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
    checkbox.appendChild(await loadLucideIcon("check", 14, COLOR_SURFACE, 2.0));
    rowLeft.appendChild(checkbox);

    const docTextStack = makeHugContainer("Doc Text Stack", "VERTICAL", 2);
    docTextStack.counterAxisAlignItems = "MIN";

    const titleWithTagRow = makeHugContainer("Title & Tag Row", "HORIZONTAL", 8);
    titleWithTagRow.appendChild(createText(doc.title, 14, "Bold", COLOR_TEXT_HEAD));

    if (doc.isRequired) {
      const reqTag = makeHugContainer("Required Tag", "HORIZONTAL", 0);
      reqTag.paddingLeft = 6; reqTag.paddingRight = 6;
      reqTag.paddingTop = 1; reqTag.paddingBottom = 1;
      reqTag.cornerRadius = 4;
      reqTag.fills = [{ type: 'SOLID', color: { r: 1.000, g: 0.918, b: 0.918 } }]; // Soft Red
      reqTag.appendChild(createText("Mandatory", 10, "Bold", { r: 0.863, g: 0.149, b: 0.149 }));
      titleWithTagRow.appendChild(reqTag);
    } else {
      const optTag = makeHugContainer("Optional Tag", "HORIZONTAL", 0);
      optTag.paddingLeft = 6; optTag.paddingRight = 6;
      optTag.paddingTop = 1; optTag.paddingBottom = 1;
      optTag.cornerRadius = 4;
      optTag.fills = [{ type: 'SOLID', color: COLOR_BG }];
      optTag.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
      optTag.appendChild(createText("Optional", 10, "Medium", COLOR_TEXT_MUTED));
      titleWithTagRow.appendChild(optTag);
    }

    docTextStack.appendChild(titleWithTagRow);
    docTextStack.appendChild(createText(doc.format, 12, "Regular", COLOR_TEXT_MUTED));
    rowLeft.appendChild(docTextStack);

    row.appendChild(rowLeft);

    // Right Row Controls (Drag handle, Edit, Trash icons)
    const rowRight = makeHugContainer("Row Controls", "HORIZONTAL", 12);
    rowRight.appendChild(await loadLucideIcon("edit-3", 16, COLOR_TEXT_MUTED, 1.5));
    rowRight.appendChild(await loadLucideIcon("trash-2", 16, COLOR_TEXT_MUTED, 1.5));
    rowRight.appendChild(await loadLucideIcon("grip-vertical", 16, COLOR_TEXT_MUTED, 1.5));
    row.appendChild(rowRight);

    docConfigCard.appendChild(row);
  }

  // ── BOTTOM ADD DOCUMENT ACTION BUTTON BELOW THE LIST ──
  const addDocFooterRow = makeSpaceBetweenRow("Add Doc Footer Row", 900);
  addDocFooterRow.paddingLeft = 24; addDocFooterRow.paddingRight = 24;
  addDocFooterRow.paddingTop = 10; addDocFooterRow.paddingBottom = 6;

  const addDocBtn = makeHugContainer("Btn / + Add Document", "HORIZONTAL", 8);
  addDocBtn.paddingLeft = 14; addDocBtn.paddingRight = 14;
  addDocBtn.paddingTop = 8; addDocBtn.paddingBottom = 8;
  addDocBtn.cornerRadius = 6; // radius-sm: 6px
  addDocBtn.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }];
  addDocBtn.strokes = [{ type: 'SOLID', color: { r: 1.000, g: 0.850, b: 0.750 } }];
  addDocBtn.appendChild(await loadLucideIcon("plus-circle", 16, COLOR_PRIMARY, 1.5));
  addDocBtn.appendChild(createText("Add Document to BGV Template", 12, "Bold", COLOR_PRIMARY));
  addDocFooterRow.appendChild(addDocBtn);

  // Document Count Summary
  addDocFooterRow.appendChild(createText("8 Configured BGV Requirements", 12, "Regular", COLOR_TEXT_MUTED));

  docConfigCard.appendChild(addDocFooterRow);
  finalizeHugHeight(docConfigCard);

  // 4. Viewport Focus
  figma.viewport.scrollAndZoomIntoView([board]);
  figma.notify("Created Full Time (Internal) BGV & EPOF Document Configuration Workspace cleanly!", { timeout: 2500 });
})(figma);
