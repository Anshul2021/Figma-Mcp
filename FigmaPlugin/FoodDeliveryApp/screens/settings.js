// Generated Figma Script: Food Delivery App — Account & Settings Screen
// Project: FoodDeliveryApp
// File: FoodDeliveryApp/screens/settings.js
// Strict Compliance: DM Sans font, 0 emojis, vector Lucide icons, even-number font scale (10, 12, 14, 16, 20, 24, 32)
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
  const COLOR_ERROR = { r: 0.863, g: 0.149, b: 0.149 };         // #DC2626
  const COLOR_ERROR_LIGHT = { r: 0.996, g: 0.886, b: 0.886 };   // #FEE2E2
  const COLOR_SUCCESS = { r: 0.020, g: 0.588, b: 0.412 };       // #059669

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

  // Helper: Text Node Creator (Strict EVEN font sizes: 10, 12, 14, 16, 20, 24, 32)
  function createText(content, fontSize, fontStyle = "Regular", color = COLOR_TEXT) {
    const text = figma.createText();
    text.fontName = { family: "DM Sans", style: fontStyle };
    text.fontSize = fontSize; // Always even number
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
  screen.name = "Screen / Account Settings";
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
  backBtn.appendChild(await loadLucideIcon("arrow-left", 20, COLOR_TEXT));
  header.appendChild(backBtn);

  header.appendChild(createText("Account & Settings", 16, "Bold", COLOR_TEXT));

  const helpBtn = makeHugContainer("Help Button", "HORIZONTAL", 4);
  helpBtn.appendChild(await loadLucideIcon("help-circle", 20, COLOR_TEXT_MUTED));
  header.appendChild(helpBtn);

  screen.appendChild(header);

  // ═══════════════════════════════════════════════════════════
  // SECTION 2: MIDDLE SCROLL CONTENT AREA (375px x 680px)
  // ═══════════════════════════════════════════════════════════
  const scrollArea = figma.createFrame();
  scrollArea.name = "Section / Settings Scroll Content";
  scrollArea.layoutMode = "VERTICAL";
  scrollArea.resize(375, 680);
  scrollArea.primaryAxisSizingMode = "FIXED";
  scrollArea.counterAxisSizingMode = "FIXED";
  scrollArea.itemSpacing = 16;
  scrollArea.paddingLeft = 16; scrollArea.paddingRight = 16;
  scrollArea.paddingTop = 16; scrollArea.paddingBottom = 24;
  scrollArea.fills = [];
  scrollArea.clipsContent = true;

  // ── USER PROFILE HEADER CARD ──
  const profileCard = makeContentCard("Card / User Profile Summary", 343, {
    cornerRadius: 16,
    fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
    strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
    paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 16
  });

  const profileRow = makeSpaceBetweenRow("Profile Row", 311);
  
  // Left: Avatar + Details
  const userDetailsGroup = makeHugContainer("User Details", "HORIZONTAL", 12);
  
  // User Avatar Photo (50px x 50px)
  const avatarFrame = figma.createFrame();
  avatarFrame.name = "User Avatar";
  avatarFrame.resize(50, 50);
  avatarFrame.cornerRadius = 25;
  avatarFrame.clipsContent = true;
  await applyOnlineImage(avatarFrame, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80");
  userDetailsGroup.appendChild(avatarFrame);

  // Name, Phone & Gold Member Tag
  const nameCol = makeHugContainer("Name Column", "VERTICAL", 4);
  nameCol.counterAxisAlignItems = "MIN";
  
  const nameBadgeRow = makeHugContainer("Name & Badge", "HORIZONTAL", 6);
  nameBadgeRow.appendChild(createText("Sarah Jenkins", 16, "Bold", COLOR_TEXT));
  
  // Gold Member Badge
  const goldBadge = makeHugContainer("Badge / Pro", "HORIZONTAL", 4);
  goldBadge.paddingLeft = 6; goldBadge.paddingRight = 6;
  goldBadge.paddingTop = 2; goldBadge.paddingBottom = 2;
  goldBadge.cornerRadius = 4;
  goldBadge.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_LIGHT }];
  goldBadge.appendChild(createText("PRO", 10, "Bold", COLOR_PRIMARY));
  nameBadgeRow.appendChild(goldBadge);

  nameCol.appendChild(nameBadgeRow);
  nameCol.appendChild(createText("+1 (555) 234-5678 · sarah.j@email.com", 12, "Regular", COLOR_TEXT_MUTED));
  userDetailsGroup.appendChild(nameCol);

  profileRow.appendChild(userDetailsGroup);

  // Right: Edit Profile Arrow Button
  profileRow.appendChild(await loadLucideIcon("chevron-right", 18, COLOR_TEXT_MUTED));
  profileCard.appendChild(profileRow);

  finalizeHugHeight(profileCard);
  scrollArea.appendChild(profileCard);

  // ── HELPER: SETTINGS GROUP CARD GENERATOR ──
  async function createSettingsGroup(groupTitle, items) {
    const groupCard = makeContentCard(`Group / ${groupTitle}`, 343, {
      cornerRadius: 16,
      fills: [{ type: 'SOLID', color: COLOR_SURFACE }],
      strokes: [{ type: 'SOLID', color: COLOR_BORDER }],
      paddingLeft: 16, paddingRight: 16, paddingTop: 14, paddingBottom: 14,
      itemSpacing: 12
    });

    // Group Header Title
    groupCard.appendChild(createText(groupTitle.toUpperCase(), 10, "Bold", COLOR_TEXT_MUTED));

    // Rows
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const row = makeSpaceBetweenRow(`Row / ${item.title}`, 311);

      // Left Icon + Title & Subtitle
      const leftGroup = makeHugContainer("Left Group", "HORIZONTAL", 12);
      
      // Icon Box Container
      const iconBox = makeHugContainer("Icon Container", "HORIZONTAL", 0);
      iconBox.paddingLeft = 8; iconBox.paddingRight = 8;
      iconBox.paddingTop = 8; iconBox.paddingBottom = 8;
      iconBox.cornerRadius = 8;
      iconBox.fills = item.isDestructive 
        ? [{ type: 'SOLID', color: COLOR_ERROR_LIGHT }]
        : [{ type: 'SOLID', color: COLOR_BG }];
      
      const iconColor = item.isDestructive ? COLOR_ERROR : COLOR_PRIMARY;
      iconBox.appendChild(await loadLucideIcon(item.icon, 16, iconColor));
      leftGroup.appendChild(iconBox);

      // Title & Subtitle Col
      const titleCol = makeHugContainer("Title Column", "VERTICAL", 2);
      titleCol.counterAxisAlignItems = "MIN";
      titleCol.appendChild(createText(item.title, 14, "Medium", item.isDestructive ? COLOR_ERROR : COLOR_TEXT));
      if (item.subtitle) {
        titleCol.appendChild(createText(item.subtitle, 12, "Regular", COLOR_TEXT_MUTED));
      }
      leftGroup.appendChild(titleCol);

      row.appendChild(leftGroup);

      // Right Action (Value Text, Toggle Switch, or Chevron Arrow)
      if (item.valueText) {
        row.appendChild(createText(item.valueText, 12, "Bold", COLOR_TEXT_MUTED));
      } else if (item.isToggle) {
        // Toggle Switch Component (Active / Inactive)
        const toggleSwitch = figma.createFrame();
        toggleSwitch.name = "Toggle Switch";
        toggleSwitch.resize(40, 22);
        toggleSwitch.cornerRadius = 11;
        toggleSwitch.fills = item.toggleState 
          ? [{ type: 'SOLID', color: COLOR_PRIMARY }] 
          : [{ type: 'SOLID', color: COLOR_BORDER }];

        const handle = figma.createFrame();
        handle.name = "Knob";
        handle.resize(18, 18);
        handle.cornerRadius = 9;
        handle.x = item.toggleState ? 20 : 2;
        handle.y = 2;
        handle.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
        toggleSwitch.appendChild(handle);

        row.appendChild(toggleSwitch);
      } else {
        row.appendChild(await loadLucideIcon("chevron-right", 18, COLOR_TEXT_MUTED));
      }

      groupCard.appendChild(row);

      // Divider Line between items inside card (except last)
      if (i < items.length - 1) {
        const itemDivider = figma.createFrame();
        itemDivider.name = "Item Divider";
        itemDivider.resize(311, 1);
        itemDivider.fills = [{ type: 'SOLID', color: COLOR_BORDER }];
        groupCard.appendChild(itemDivider);
      }
    }

    finalizeHugHeight(groupCard);
    return groupCard;
  }

  // ── GROUP 1: ACCOUNT & ORDERS ──
  const accountGroup = await createSettingsGroup("Account & Orders", [
    { title: "Manage Addresses", subtitle: "2 saved delivery locations", icon: "map-pin" },
    { title: "Payment Methods", subtitle: "Apple Pay, Visa ending in 4242", icon: "credit-card" },
    { title: "Order History & Re-order", subtitle: "Past orders & receipts", icon: "shopping-bag" },
    { title: "Food Preferences", subtitle: "Vegetarian, No Nuts", icon: "utensils" }
  ]);
  scrollArea.appendChild(accountGroup);

  // ── GROUP 2: PREFERENCES & NOTIFICATIONS ──
  const prefsGroup = await createSettingsGroup("Preferences & Notifications", [
    { title: "Push Notifications", subtitle: "Order updates & offers", icon: "bell", isToggle: true, toggleState: true },
    { title: "SMS Updates", subtitle: "Delivery driver alerts", icon: "message-square", isToggle: true, toggleState: false },
    { title: "App Language", subtitle: "English (US)", icon: "globe", valueText: "English" }
  ]);
  scrollArea.appendChild(prefsGroup);

  // ── GROUP 3: SUPPORT & SECURITY ──
  const supportGroup = await createSettingsGroup("Support & Privacy", [
    { title: "Help Center & FAQs", subtitle: "24/7 customer support", icon: "help-circle" },
    { title: "Privacy & Data Settings", subtitle: "Permissions & security", icon: "shield-check" },
    { title: "Log Out", subtitle: "Sign out of your Zomato account", icon: "log-out", isDestructive: true }
  ]);
  scrollArea.appendChild(supportGroup);

  screen.appendChild(scrollArea);

  // ═══════════════════════════════════════════════════════════
  // SECTION 3: BOTTOM NAVIGATION BAR (Fixed at bottom)
  // ═══════════════════════════════════════════════════════════
  const navBar = makeSpaceBetweenRow("Nav / Bottom Tab Bar", 375);
  navBar.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  navBar.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  navBar.paddingLeft = 24; navBar.paddingRight = 24;
  navBar.paddingTop = 10; navBar.paddingBottom = 20;

  const navItems = [
    { label: "Home", icon: "home", active: false },
    { label: "Explore", icon: "compass", active: false },
    { label: "Orders", icon: "shopping-bag", active: false },
    { label: "Settings", icon: "user", active: true }
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
  figma.notify("Created Account & Settings Screen in FoodDeliveryApp!", { timeout: 2500 });
})(figma);
