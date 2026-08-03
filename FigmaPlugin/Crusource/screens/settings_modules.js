// Generated Figma Script: Crusource Enterprise HRMS — Settings & File Configurations Screen
// Project: Crusource
// File: Crusource/screens/settings_modules.js
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
  const COLOR_ICON_BOX_BG = { r: 0.973, g: 0.980, b: 0.988 };   // #F8FAFC Icon Frame Fill
  const COLOR_SUCCESS = { r: 0.063, g: 0.725, b: 0.506 };       // #10B981 Active Badge Green

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

  // 2. Desktop Modal Screen Container: 1440px x 900px Landscape Desktop Settings Modal Workspace
  const screen = figma.createFrame();
  screen.name = "Screen / Crusource Settings — File Configurations";
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

  // 7 Sidebar Tabs ("File Configurations" is the ACTIVE tab)
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

  // ── RIGHT MAIN CONFIGURATION CONTENT AREA (1220px x 844px) ──
  const mainContent = figma.createFrame();
  mainContent.name = "Content / File Configurations Workspace Area";
  mainContent.layoutMode = "VERTICAL";
  mainContent.resize(1220, 844);
  mainContent.primaryAxisSizingMode = "FIXED";
  mainContent.counterAxisSizingMode = "FIXED";
  mainContent.fills = [{ type: 'SOLID', color: COLOR_BG }];
  mainContent.paddingLeft = 160; mainContent.paddingRight = 160; // Centered content area (900px content)
  mainContent.paddingTop = 32; mainContent.paddingBottom = 40;
  mainContent.itemSpacing = 16;
  mainContent.clipsContent = true;
  bodySplit.appendChild(mainContent);

  // Title & Subtitle Header Row with "+ Add Template" Action Button
  const headerRow = makeSpaceBetweenRow("Header / Title & Action Row", 900);

  const headerTextGroup = makeHugContainer("Header Text Stack", "VERTICAL", 4);
  headerTextGroup.counterAxisAlignItems = "MIN";
  headerTextGroup.appendChild(createText("File Configurations", 20, "Bold", COLOR_TEXT_HEAD));
  
  const subtitleText = createText(
    "Configure document templates and required onboarding file rules across employment types for your HRMS workspace.",
    12, "Regular", COLOR_TEXT_MUTED
  );
  subtitleText.layoutAlign = "STRETCH";
  subtitleText.textAutoResize = "HEIGHT";
  headerTextGroup.appendChild(subtitleText);
  headerRow.appendChild(headerTextGroup);

  // Add Template Action Button
  const addTemplateBtn = makeHugContainer("Btn / Add Template", "HORIZONTAL", 6);
  addTemplateBtn.paddingLeft = 14; addTemplateBtn.paddingRight = 14;
  addTemplateBtn.paddingTop = 8; addTemplateBtn.paddingBottom = 8;
  addTemplateBtn.cornerRadius = 6; // radius-sm: 6px
  addTemplateBtn.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
  addTemplateBtn.appendChild(await loadLucideIcon("plus", 16, COLOR_SURFACE, 1.5));
  addTemplateBtn.appendChild(createText("Add Template", 12, "Bold", COLOR_SURFACE));
  headerRow.appendChild(addTemplateBtn);

  mainContent.appendChild(headerRow);

  // ── 5 EMPLOYMENT TYPE TEMPLATE CARDS ──
  const fileTemplates = [
    {
      type: "Full Time (Internal)",
      icon: "briefcase",
      docCount: "12 Required Docs",
      description: "Standard onboarding document bundle including Offer Letter, EPF, Insurance, Tax declarations, and HRIS forms.",
      lastUpdated: "2026-02-01",
      updatedBy: "Sarah Jenkins (HR Director)",
      status: "Active Template"
    },
    {
      type: "Contractor",
      icon: "file-text",
      docCount: "8 Required Docs",
      description: "Independent contractor compliance package including MSA, SOW, Tax W-9/Form 16, and Non-Disclosure Agreement.",
      lastUpdated: "2026-01-28",
      updatedBy: "Alex Morgan (Legal Compliance)",
      status: "Active Template"
    },
    {
      type: "Intern",
      icon: "graduation-cap",
      docCount: "5 Required Docs",
      description: "Student and university intern onboarding set including Internship Agreement, NOC, College ID, and Emergency Contact.",
      lastUpdated: "2026-01-15",
      updatedBy: "Priya Sharma (Talent Acquisition)",
      status: "Active Template"
    },
    {
      type: "Consultant",
      icon: "user-check",
      docCount: "7 Required Docs",
      description: "Retainer consultant documentation package including Master Consulting Agreement, Fee Schedule, and IP Assignment.",
      lastUpdated: "2026-02-02",
      updatedBy: "David Miller (Operations Lead)",
      status: "Active Template"
    },
    {
      type: "Freelancer",
      icon: "laptop",
      docCount: "4 Required Docs",
      description: "Project-based freelancer onboarding set including Work Order, Invoice W-9, Portfolio Verification, and NDA.",
      lastUpdated: "2026-01-10",
      updatedBy: "Sarah Jenkins (HR Director)",
      status: "Active Template"
    }
  ];

  for (const tmpl of fileTemplates) {
    const card = makeContentCard(`Card / Template ${tmpl.type}`, 900, {
      cornerRadius: 12, // radius-lg: 12px from local/taste.md
      fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
      strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
      paddingLeft: 20, paddingRight: 20, paddingTop: 16, paddingBottom: 16,
      itemSpacing: 12
    });
    mainContent.appendChild(card);

    // Top Row: Icon + Title + Count Badge + Action Button
    const cardTopRow = makeSpaceBetweenRow("Card Top Row", 860);

    const titleBlockLeft = makeHugContainer("Title Block Left", "HORIZONTAL", 14);

    // Soft Icon Container Box (44px x 44px)
    const iconBox = figma.createFrame();
    iconBox.name = "Icon Box Container";
    iconBox.layoutMode = "VERTICAL";
    iconBox.resize(44, 44);
    iconBox.primaryAxisSizingMode = "FIXED";
    iconBox.counterAxisSizingMode = "FIXED";
    iconBox.primaryAxisAlignItems = "CENTER";
    iconBox.counterAxisAlignItems = "CENTER";
    iconBox.cornerRadius = 8; // radius-md: 8px
    iconBox.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }];
    iconBox.strokes = [{ type: 'SOLID', color: { r: 1.000, g: 0.850, b: 0.750 } }];
    iconBox.appendChild(await loadLucideIcon(tmpl.icon, 20, COLOR_PRIMARY, 1.5));
    titleBlockLeft.appendChild(iconBox);

    // Title + Doc Count Badge Stack
    const titleTextStack = makeHugContainer("Title Text Stack", "VERTICAL", 4);
    titleTextStack.counterAxisAlignItems = "MIN";

    const titleRowWithBadge = makeHugContainer("Title & Badge Row", "HORIZONTAL", 10);
    titleRowWithBadge.appendChild(createText(tmpl.type, 16, "Bold", COLOR_TEXT_HEAD));

    // Doc Count Pill Badge
    const countBadge = makeHugContainer("Doc Count Badge", "HORIZONTAL", 4);
    countBadge.paddingLeft = 8; countBadge.paddingRight = 8;
    countBadge.paddingTop = 2; countBadge.paddingBottom = 2;
    countBadge.cornerRadius = 4; // radius-xs: 4px
    countBadge.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }];
    countBadge.appendChild(await loadLucideIcon("files", 12, COLOR_PRIMARY, 1.5));
    countBadge.appendChild(createText(tmpl.docCount, 10, "Bold", COLOR_PRIMARY));
    titleRowWithBadge.appendChild(countBadge);

    titleTextStack.appendChild(titleRowWithBadge);

    // Template Description Text
    const descText = createText(tmpl.description, 12, "Regular", COLOR_TEXT_MUTED);
    descText.layoutAlign = "STRETCH";
    descText.textAutoResize = "HEIGHT";
    titleTextStack.appendChild(descText);

    titleBlockLeft.appendChild(titleTextStack);
    cardTopRow.appendChild(titleBlockLeft);

    // Right Action: Manage Documents Button
    const manageBtn = makeHugContainer("Btn / Manage Documents", "HORIZONTAL", 6);
    manageBtn.paddingLeft = 12; manageBtn.paddingRight = 12;
    manageBtn.paddingTop = 6; manageBtn.paddingBottom = 6;
    manageBtn.cornerRadius = 6; // radius-sm: 6px
    manageBtn.fills = [{ type: 'SOLID', color: COLOR_BG }];
    manageBtn.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
    manageBtn.appendChild(createText("Configure Docs", 12, "Bold", COLOR_TEXT_BODY));
    manageBtn.appendChild(await loadLucideIcon("chevron-right", 14, COLOR_TEXT_MUTED, 1.5));
    cardTopRow.appendChild(manageBtn);

    card.appendChild(cardTopRow);

    // Divider Line inside Card
    const divLine = figma.createFrame();
    divLine.name = "Card Divider Line";
    divLine.resize(860, 1);
    divLine.fills = [{ type: 'SOLID', color: COLOR_BORDER_LIGHT }];
    card.appendChild(divLine);

    // Bottom Meta Info Row (Last Updated On, Last Updated By, Status)
    const metaRow = makeSpaceBetweenRow("Card Meta Row", 860);

    const metaLeftGroup = makeHugContainer("Meta Left Group", "HORIZONTAL", 16);

    // Last Updated On Tag
    const updatedDateTag = makeHugContainer("Updated Date Tag", "HORIZONTAL", 4);
    updatedDateTag.appendChild(await loadLucideIcon("clock", 12, COLOR_TEXT_MUTED, 1.5));
    updatedDateTag.appendChild(createText(`Updated: ${tmpl.lastUpdated}`, 10, "Regular", COLOR_TEXT_MUTED));
    metaLeftGroup.appendChild(updatedDateTag);

    // Updated By Author Tag
    const authorTag = makeHugContainer("Author Tag", "HORIZONTAL", 4);
    authorTag.appendChild(await loadLucideIcon("user", 12, COLOR_TEXT_MUTED, 1.5));
    authorTag.appendChild(createText(`By: ${tmpl.updatedBy}`, 10, "Medium", COLOR_TEXT_BODY));
    metaLeftGroup.appendChild(authorTag);

    metaRow.appendChild(metaLeftGroup);

    // Right Active Status Indicator Tag
    const statusTag = makeHugContainer("Status Tag", "HORIZONTAL", 4);
    statusTag.paddingLeft = 8; statusTag.paddingRight = 8;
    statusTag.paddingTop = 2; statusTag.paddingBottom = 2;
    statusTag.cornerRadius = 4; // radius-xs: 4px
    statusTag.fills = [{ type: 'SOLID', color: { r: 0.902, g: 0.980, b: 0.941 } }]; // Soft Green
    statusTag.appendChild(await loadLucideIcon("check-circle-2", 12, COLOR_SUCCESS, 1.5));
    statusTag.appendChild(createText(tmpl.status, 10, "Bold", COLOR_SUCCESS));
    metaRow.appendChild(statusTag);

    card.appendChild(metaRow);
    finalizeHugHeight(card);
  }

  // 4. Viewport Focus
  figma.viewport.scrollAndZoomIntoView([board]);
  figma.notify("Created Crusource Settings — File Configurations Screen cleanly!", { timeout: 2500 });
})(figma);
