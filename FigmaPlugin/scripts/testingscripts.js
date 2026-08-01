// ============================================================================
// CRM / TASK MOBILE UI GENERATOR SCRIPT (CRM Task Active Search Flow)
// Generates a pixel-perfect, modern mobile Dashboard mockup flow inside Figma:
// - Screen 1: Default Tasks Dashboard (Search Idle, floating bottom navigation, pill FAB).
// - Screen 2: Search Active Dashboard ("Gyan" typed, matching yellow highlighted results).
//
// Key Specifications matching rules:
// - Layout Mode: 100% absolute positioned frames and layers (No Auto-Layout).
// - Viewport width: 393px, height: 852px
// - Spacing & Typography: Uses EXCLUSIVELY EVEN numbers for all font sizes
//   (10, 12, 14, 16, 20px) and coordinate dimensions/spacings (8, 12, 16, 20, 24px).
// - Strokes / Borders: Set to exactly 1px for clean UI lines.
// - Icon Weights: Strictly sets stroke-width="1.4" for all SVG icons.
// - Primary color: #913175
// - Base background: #F8FAFC
// ============================================================================

async function run() {
  // --------------------------------------------------------------------------
  // FONT SYSTEM LOADERS & FALLBACKS
  // --------------------------------------------------------------------------
  async function loadFontSafe(family, style) {
    try {
      await figma.loadFontAsync({ family, style });
      return true;
    } catch (e) {
      return false;
    }
  }

  async function setupFonts() {
    const preferredFamily = "DM Sans";
    const fallbackFamily = "Inter";
    const styles = ["Regular", "Medium", "SemiBold", "Bold"];

    let preferredOk = true;
    const loadedFont = { family: preferredFamily };
    for (const style of styles) {
      const ok = await loadFontSafe(preferredFamily, style);
      if (ok) {
        loadedFont[style.toLowerCase()] = style;
      } else {
        preferredOk = false;
        break;
      }
    }
    if (preferredOk) return loadedFont;

    let fallbackOk = true;
    const fallbackFont = { family: fallbackFamily };
    for (const style of styles) {
      const ok = await loadFontSafe(fallbackFamily, style);
      if (ok) {
        fallbackFont[style.toLowerCase()] = style;
      } else {
        fallbackOk = false;
        break;
      }
    }
    if (fallbackOk) return fallbackFont;

    const systemDefault = figma.createText().fontName;
    await figma.loadFontAsync(systemDefault);
    return {
      family: systemDefault.family,
      regular: systemDefault.style,
      medium: systemDefault.style,
      semibold: systemDefault.style,
      bold: systemDefault.style,
    };
  }

  const fontInfo = await setupFonts();

  // --------------------------------------------------------------------------
  // DESIGN TOKENS (Strictly Even Values, 1px Borders)
  // --------------------------------------------------------------------------
  const COLORS = {
    primary: "#913175",
    primaryLight: "#FCEEF6",
    bgBoard: "#E2E8F0",
    bgScreen: "#F8FAFC",
    textDark: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#94A3B8",
    labelColor: "#64748B",    // Slate 500
    border: "#E2E8F0",        // Slate 200
    white: "#FFFFFF",

    // Subtle Semantic colors
    greenBg: "#F0FDF4",       // Soft green completed badge
    greenText: "#16A34A",
    orangeBg: "#FFF7ED",      // Soft orange due (7d) badge
    orangeText: "#EA580C",
    redBg: "#FEF2F2",         // Soft red overdue badge
    redText: "#DC2626",
    dateColor: "#BC4B51",     // Red-rose date text
  };

  // --------------------------------------------------------------------------
  // LUCIDE SVG ICONS LIBRARY (All path-only for crash safety in Figma)
  // --------------------------------------------------------------------------
  const LUCIDE_ICONS = {
    "search": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3"/></svg>`,
    "bell": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
    "sliders": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4"/></svg>`,
    "calendar": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM16 2v4M8 2v4M3 10h18"/></svg>`,
    "chevron-right": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
    "check": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
    "plus": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5v14"/></svg>`,
    "wifi": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h.01M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 14 0M1.5 9.5a15 15 0 0 1 21 0"/></svg>`,
    "clock": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2"/></svg>`,
    "x": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
    "compass": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z"/></svg>`,
    "scan": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/></svg>`,
    "contacts": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM16 2v4M8 2v4M3 10h18M8 14h8M8 18h5"/></svg>`,
    "user": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>`
  };

  // --------------------------------------------------------------------------
  // CANVAS GENERATION UTILITIES
  // --------------------------------------------------------------------------
  function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    return {
      r: parseInt(clean.substring(0, 2), 16) / 255,
      g: parseInt(clean.substring(2, 4), 16) / 255,
      b: parseInt(clean.substring(4, 6), 16) / 255
    };
  }

  function solid(hex) {
    return {
      type: "SOLID",
      color: hexToRgb(hex)
    };
  }

  function createFrame(opts) {
    const node = figma.createFrame();
    node.name = opts.name || "Frame";

    // Pure absolute positioning
    node.layoutMode = "NONE";
    node.cornerRadius = opts.radius || 0;
    node.clipsContent = opts.clipsContent !== undefined ? opts.clipsContent : false;

    node.fills = [];
    node.strokes = [];

    if (opts.bg) {
      node.fills = [solid(opts.bg)];
    }
    if (opts.stroke) {
      node.strokes = [solid(opts.stroke)];
      node.strokeWeight = opts.strokeWeight !== undefined ? opts.strokeWeight : 1; // Strict 1px borders
    }

    if (opts.w && opts.h) {
      node.resize(opts.w, opts.h);
    } else {
      if (opts.w) node.resize(opts.w, node.height);
      if (opts.h) node.resize(node.width, opts.h);
    }

    if (opts.x !== undefined) node.x = opts.x;
    if (opts.y !== undefined) node.y = opts.y;

    return node;
  }

  function createText(opts) {
    const node = figma.createText();
    node.name = opts.name || "Text";

    const weight = opts.weight || "regular";
    node.fontName = {
      family: fontInfo.family,
      style: fontInfo[weight] || fontInfo.regular
    };

    node.characters = opts.value || "";
    node.fontSize = opts.size || 14; // Strict even font size

    if (opts.line) {
      node.lineHeight = {
        unit: "PIXELS",
        value: opts.line
      };
    } else {
      node.lineHeight = { unit: "AUTO" };
    }

    node.fills = [solid(opts.color || COLORS.textDark)];

    if (opts.width) {
      node.textAutoResize = "HEIGHT";
      node.resize(opts.width, opts.height || 20);
    } else {
      node.textAutoResize = "WIDTH_AND_HEIGHT";
    }

    if (opts.align) {
      node.textAlignHorizontal = opts.align;
    }

    if (opts.x !== undefined) node.x = opts.x;
    if (opts.y !== undefined) node.y = opts.y;

    return node;
  }

  function createLucideIcon(name, size, color, x, y) {
    const svgString = LUCIDE_ICONS[name];
    if (!svgString) {
      const placeholder = figma.createFrame();
      placeholder.resize(size, size);
      placeholder.x = x;
      placeholder.y = y;
      placeholder.fills = [solid(color)];
      return placeholder;
    }
    // Set custom icon stroke weight to exactly 1.4
    const coloredSvg = svgString
      .replace(/currentColor/g, color)
      .replace(/stroke-width="[^"]+"/g, 'stroke-width="1.4"');

    try {
      const node = figma.createNodeFromSvg(coloredSvg);
      node.name = `Icon - ${name}`;
      node.resize(size, size);
      if (x !== undefined) node.x = x;
      if (y !== undefined) node.y = y;
      return node;
    } catch (err) {
      // Figma Safe Fallback Frame to prevent compile errors from halting execution
      const placeholder = figma.createFrame();
      placeholder.name = `Icon Fallback - ${name}`;
      placeholder.resize(size, size);
      if (x !== undefined) placeholder.x = x;
      if (y !== undefined) placeholder.y = y;
      placeholder.fills = [solid(color)];
      placeholder.opacity = 0.4;
      return placeholder;
    }
  }

  // Helper to build status bar
  function buildStatusBar(parentScreen) {
    const statusBar = createFrame({
      name: "Status Bar",
      w: 392,
      h: 44,
      x: 0,
      y: 0,
    });
    parentScreen.appendChild(statusBar);

    const timeText = createText({
      name: "Time",
      value: "9:30",
      size: 14,
      weight: "medium",
      color: COLORS.textDark,
      x: 24,
      y: 12,
    });
    statusBar.appendChild(timeText);

    const indicators = createFrame({
      name: "Indicators",
      w: 60,
      h: 14,
      x: 308,
      y: 16,
    });
    statusBar.appendChild(indicators);

    const wifiIcon = createLucideIcon("wifi", 12, COLORS.textDark, 0, 1);
    indicators.appendChild(wifiIcon);

    const cellular = createFrame({
      name: "Cellular",
      w: 16,
      h: 10,
      x: 18,
      y: 2,
    });
    indicators.appendChild(cellular);

    for (let i = 1; i <= 4; i++) {
      const bar = figma.createFrame();
      bar.resize(2, i * 2);
      bar.x = (i - 1) * 4;
      bar.y = 8 - (i * 2);
      bar.fills = [solid(COLORS.textDark)];
      cellular.appendChild(bar);
    }

    const battery = createFrame({
      name: "Battery",
      w: 20,
      h: 10,
      x: 38,
      y: 2,
      radius: 2,
      stroke: COLORS.textDark,
      strokeWeight: 1,
    });
    indicators.appendChild(battery);

    const batteryFill = figma.createFrame();
    batteryFill.resize(12, 6);
    batteryFill.x = 2;
    batteryFill.y = 2;
    batteryFill.cornerRadius = 1;
    batteryFill.fills = [solid(COLORS.textDark)];
    battery.appendChild(batteryFill);
  }

  // Helper to build floating bottom navigation bar
  function buildBottomNavigation(parentScreen) {
    const bottomNav = createFrame({
      name: "Floating Navigation Bar",
      w: 320,
      h: 56,
      x: 36,
      y: 780,
      bg: COLORS.white,
      stroke: COLORS.border,
      strokeWeight: 1,
      radius: 28,
    });
    parentScreen.appendChild(bottomNav);

    // Subtle drop shadow for elevation (Fix: divide RGB values by 255)
    bottomNav.effects = [{
      type: "DROP_SHADOW",
      color: { r: 15 / 255, g: 23 / 255, b: 42 / 255, a: 0.08 },
      offset: { x: 0, y: 4 },
      radius: 16,
      spread: 0,
      visible: true,
      blendMode: "NORMAL"
    }];

    const tabs = [
      { name: "Events", icon: "compass", isActive: false },
      { name: "Scan", icon: "scan", isActive: false },
      { name: "Contacts", icon: "contacts", isActive: false },
      { name: "CRM", icon: "user", isActive: true }
    ];

    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      const tabFrame = createFrame({
        name: `Tab - ${tab.name}`,
        w: 80,
        h: 56,
        x: i * 80,
        y: 0,
      });
      bottomNav.appendChild(tabFrame);

      const color = tab.isActive ? COLORS.primary : COLORS.labelColor;

      const icon = createLucideIcon(tab.icon, 20, color, 30, 8);
      tabFrame.appendChild(icon);

      const label = createText({
        name: "Label",
        value: tab.name,
        size: 10,
        weight: tab.isActive ? "semibold" : "regular",
        color: color,
        width: 80,
        align: "CENTER",
        y: 34,
      });
      tabFrame.appendChild(label);
    }
  }

  // Dynamic highlighted text renderer
  function addHighlightedTitle(parent, text1, highlightText, text2, isCompleted) {
    // Math model approximating DM Sans characters widths at size 14
    function measureWidth(str) {
      let w = 0;
      for (const char of str) {
        if (char === " " || char === "i" || char === "l" || char === "t" || char === "f" || char === "j" || char === "r" || char === "1") {
          w += 5;
        } else if (char === "M" || char === "W" || char === "G" || char === "S" || char === "E") {
          w += 10;
        } else {
          w += 8;
        }
      }
      return w;
    }

    const w1 = measureWidth(text1);
    const wHighlight = measureWidth(highlightText);

    const x1 = 52;
    const xHighlight = x1 + w1;
    const x2 = xHighlight + wHighlight;

    // Part 1
    if (w1 > 0) {
      const p1 = createText({
        name: "Title Part 1",
        value: text1,
        size: 14,
        weight: isCompleted ? "regular" : "medium",
        color: isCompleted ? COLORS.textMuted : COLORS.textDark,
        x: x1,
        y: 16,
      });
      if (isCompleted) p1.textDecoration = "STRIKETHROUGH";
      parent.appendChild(p1);
    }

    // Highlight background rectangle
    const bgHighlight = createFrame({
      name: "Highlight bg",
      w: wHighlight + 6,
      h: 18,
      radius: 4,
      bg: "#FEF08A", // yellow-200 highlight
      x: xHighlight - 3,
      y: 15,
    });
    parent.appendChild(bgHighlight);

    // Part 2 (Highlight text)
    const p2 = createText({
      name: "Title Highlight Part",
      value: highlightText,
      size: 14,
      weight: isCompleted ? "regular" : "bold",
      color: COLORS.textDark,
      x: xHighlight,
      y: 16,
    });
    if (isCompleted) p2.textDecoration = "STRIKETHROUGH";
    parent.appendChild(p2);

    // Part 3
    if (text2.length > 0) {
      const p3 = createText({
        name: "Title Part 3",
        value: text2,
        size: 14,
        weight: isCompleted ? "regular" : "medium",
        color: isCompleted ? COLORS.textMuted : COLORS.textDark,
        x: x2,
        y: 16,
      });
      if (isCompleted) p3.textDecoration = "STRIKETHROUGH";
      parent.appendChild(p3);
    }
  }

  // --------------------------------------------------------------------------
  // WORKSPACE BOARD CREATION
  // --------------------------------------------------------------------------
  const board = createFrame({
    name: "Board",
    w: 900,
    h: 1000,
    bg: COLORS.bgBoard,
    x: figma.viewport.center.x - 450,
    y: figma.viewport.center.y - 500,
  });

  // --------------------------------------------------------------------------
  // SCREEN 1: DEFAULT CRM TASKS list (Search Idle)
  // --------------------------------------------------------------------------
  const screen1 = createFrame({
    name: "Tasks Dashboard - Search Idle",
    w: 393,
    h: 852,
    bg: COLORS.bgScreen,
    radius: 0,
    stroke: "#CBD5E1",
    strokeWeight: 1,
    clipsContent: true,
    x: 40,
    y: 74
  });
  board.appendChild(screen1);

  // Status Bar
  buildStatusBar(screen1);

  // Header Section
  const header1 = createFrame({ name: "Header", w: 392, h: 56, x: 0, y: 44 });
  screen1.appendChild(header1);

  header1.appendChild(createText({
    name: "Title",
    value: "CRM",
    size: 20,
    weight: "medium",
    color: COLORS.textDark,
    x: 24,
    y: 16,
  }));

  header1.appendChild(createLucideIcon("bell", 20, COLORS.textDark, 356, 18));

  // Tabs Bar
  const tabs1 = createFrame({ name: "Tabs", w: 392, h: 48, x: 0, y: 100 });
  screen1.appendChild(tabs1);

  const tabAll1 = createFrame({ name: "Tab All", w: 172, h: 48, x: 16, y: 0 });
  tabs1.appendChild(tabAll1);
  tabAll1.appendChild(createText({
    name: "Label",
    value: "All Tasks",
    size: 14,
    weight: "medium",
    color: COLORS.primary,
    width: 172,
    align: "CENTER",
    y: 14,
  }));

  const indicator1 = figma.createFrame();
  indicator1.resize(60, 4);
  indicator1.x = 56;
  indicator1.y = 44;
  indicator1.cornerRadius = 2;
  indicator1.fills = [solid(COLORS.primary)];
  tabAll1.appendChild(indicator1);

  const tabCal1 = createFrame({ name: "Tab Cal", w: 172, h: 48, x: 204, y: 0 });
  tabs1.appendChild(tabCal1);
  tabCal1.appendChild(createText({
    name: "Label",
    value: "Calendar",
    size: 14,
    weight: "regular",
    color: COLORS.textSecondary,
    width: 172,
    align: "CENTER",
    y: 14,
  }));

  const dividerLine1 = figma.createFrame();
  dividerLine1.resize(392, 1);
  dividerLine1.x = 0;
  dividerLine1.y = 148;
  dividerLine1.fills = [solid(COLORS.border)];
  screen1.appendChild(dividerLine1);

  // Search input block (Idle State)
  const searchBox1 = createFrame({
    name: "Search Input Bar",
    w: 360,
    h: 44,
    x: 16,
    y: 164,
    bg: COLORS.white,
    stroke: COLORS.border,
    strokeWeight: 1,
    radius: 10,
  });
  screen1.appendChild(searchBox1);

  searchBox1.appendChild(createLucideIcon("search", 16, COLORS.primary, 14, 14));
  searchBox1.appendChild(createText({
    name: "Placeholder text",
    value: "Search Tasks...",
    size: 14,
    weight: "regular",
    color: COLORS.textMuted,
    x: 38,
    y: 13,
  }));
  searchBox1.appendChild(createLucideIcon("sliders", 16, COLORS.primary, 360 - 30, 14));

  // Overview Cards (h = 48 even)
  const completedCard1 = createFrame({
    name: "Completed Card",
    w: 172,
    h: 48,
    x: 16,
    y: 224,
    bg: COLORS.white,
    stroke: COLORS.border,
    strokeWeight: 1,
    radius: 8,
  });
  screen1.appendChild(completedCard1);

  completedCard1.appendChild(createText({
    name: "Val",
    value: "01",
    size: 20,
    weight: "medium",
    color: COLORS.textDark,
    x: 12,
    y: 6,
  }));
  completedCard1.appendChild(createText({
    name: "Label",
    value: "Completed",
    size: 12,
    weight: "regular",
    color: COLORS.labelColor,
    x: 12,
    y: 28,
  }));

  const badgeBox1 = createFrame({ name: "Badge", w: 24, h: 24, x: 136, y: 12, radius: 12, bg: COLORS.greenBg });
  completedCard1.appendChild(badgeBox1);
  badgeBox1.appendChild(createLucideIcon("check", 12, COLORS.greenText, 6, 6));

  const dueCard1 = createFrame({
    name: "Due Card",
    w: 172,
    h: 48,
    x: 204,
    y: 224,
    bg: COLORS.white,
    stroke: COLORS.border,
    strokeWeight: 1,
    radius: 8,
  });
  screen1.appendChild(dueCard1);

  dueCard1.appendChild(createText({
    name: "Val",
    value: "02",
    size: 20,
    weight: "medium",
    color: COLORS.textDark,
    x: 12,
    y: 6,
  }));
  dueCard1.appendChild(createText({
    name: "Label",
    value: "Due in 7 days",
    size: 12,
    weight: "regular",
    color: COLORS.labelColor,
    x: 12,
    y: 28,
  }));

  const badgeBox2 = createFrame({ name: "Badge", w: 24, h: 24, x: 136, y: 12, radius: 12, bg: COLORS.orangeBg });
  dueCard1.appendChild(badgeBox2);
  badgeBox2.appendChild(createLucideIcon("calendar", 12, COLORS.orangeText, 6, 6));

  // Today label
  screen1.appendChild(createText({
    name: "Heading",
    value: "Today",
    size: 14,
    weight: "medium",
    color: COLORS.textDark,
    x: 16,
    y: 292,
  }));

  // Tasks List
  const listFrame1 = createFrame({ name: "Tasks List", w: 392, h: 300, x: 0, y: 316 });
  screen1.appendChild(listFrame1);

  // Row 1: Mail Gyan Sharma
  const row1_1 = createFrame({ name: "Row 1", w: 392, h: 72, x: 0, y: 0, bg: COLORS.white });
  listFrame1.appendChild(row1_1);
  const chk1_1 = figma.createEllipse();
  chk1_1.resize(20, 20);
  chk1_1.x = 16;
  chk1_1.y = 26;
  chk1_1.fills = [];
  chk1_1.strokes = [solid(COLORS.textMuted)];
  row1_1.appendChild(chk1_1);

  row1_1.appendChild(createText({ name: "Title", value: "Mail Gyan Sharma", size: 14, weight: "medium", color: COLORS.textDark, x: 52, y: 16 }));
  row1_1.appendChild(createLucideIcon("calendar", 12, COLORS.dateColor, 52, 42));
  row1_1.appendChild(createText({ name: "Date", value: "24 June 2026", size: 12, color: COLORS.dateColor, x: 70, y: 40 }));
  row1_1.appendChild(createLucideIcon("chevron-right", 16, COLORS.textMuted, 356, 28));

  const div1_1 = figma.createFrame();
  div1_1.resize(360, 1);
  div1_1.x = 16;
  div1_1.y = 72;
  div1_1.fills = [solid(COLORS.border)];
  listFrame1.appendChild(div1_1);

  // Row 2: Lunch Planning
  const row1_2 = createFrame({ name: "Row 2", w: 392, h: 72, x: 0, y: 74, bg: COLORS.white });
  listFrame1.appendChild(row1_2);
  const chk1_2 = figma.createEllipse();
  chk1_2.resize(20, 20);
  chk1_2.x = 16;
  chk1_2.y = 26;
  chk1_2.fills = [];
  chk1_2.strokes = [solid(COLORS.textMuted)];
  row1_2.appendChild(chk1_2);

  row1_2.appendChild(createText({ name: "Title", value: "Lunch Planning", size: 14, weight: "medium", color: COLORS.textDark, x: 52, y: 16 }));
  row1_2.appendChild(createLucideIcon("calendar", 12, COLORS.dateColor, 52, 42));
  row1_2.appendChild(createText({ name: "Date", value: "26 June 2026", size: 12, color: COLORS.dateColor, x: 70, y: 40 }));
  row1_2.appendChild(createLucideIcon("chevron-right", 16, COLORS.textMuted, 356, 28));

  const div1_2 = figma.createFrame();
  div1_2.resize(360, 1);
  div1_2.x = 16;
  div1_2.y = 146;
  div1_2.fills = [solid(COLORS.border)];
  listFrame1.appendChild(div1_2);

  // Row 3 (Completed): Review pitch deck slides
  const row1_3 = createFrame({ name: "Row 3 Completed", w: 392, h: 72, x: 0, y: 148, bg: COLORS.white });
  listFrame1.appendChild(row1_3);

  const chk1_3 = createFrame({ name: "Checked", w: 20, h: 20, x: 16, y: 26, radius: 10, bg: COLORS.greenBg, stroke: COLORS.greenText });
  row1_3.appendChild(chk1_3);
  chk1_3.appendChild(createLucideIcon("check", 12, COLORS.greenText, 4, 4));

  const strikedTitle = createText({ name: "Title", value: "Review pitch deck slides", size: 14, weight: "regular", color: COLORS.textMuted, x: 52, y: 16 });
  strikedTitle.textDecoration = "STRIKETHROUGH";
  row1_3.appendChild(strikedTitle);

  row1_3.appendChild(createLucideIcon("calendar", 12, COLORS.textMuted, 52, 42));
  row1_3.appendChild(createText({ name: "Date", value: "25 June 2026", size: 12, color: COLORS.textMuted, x: 70, y: 40 }));
  row1_3.appendChild(createLucideIcon("chevron-right", 16, COLORS.textMuted, 356, 28));

  // FAB pill button
  const fab1 = createFrame({ name: "FAB Pill", w: 80, h: 44, x: 296, y: 718, bg: COLORS.primary, radius: 8 });
  screen1.appendChild(fab1);
  fab1.appendChild(createLucideIcon("plus", 14, COLORS.white, 12, 15));
  fab1.appendChild(createText({ name: "Label", value: "Task", size: 14, weight: "bold", color: COLORS.white, x: 32, y: 12 }));

  // Bottom Navigation Bar
  buildBottomNavigation(screen1);

  // --------------------------------------------------------------------------
  // SCREEN 2: SEARCH ACTIVE STATE ("Gyan" Highlighted Results)
  // --------------------------------------------------------------------------
  const screen2 = createFrame({
    name: "Tasks Dashboard - Search Active",
    w: 393,
    h: 852,
    bg: COLORS.bgScreen,
    radius: 0,
    stroke: "#CBD5E1",
    strokeWeight: 1,
    clipsContent: true,
    x: 467,
    y: 74
  });
  board.appendChild(screen2);

  // Status Bar
  buildStatusBar(screen2);

  // Header Section
  const header2 = createFrame({ name: "Header", w: 392, h: 56, x: 0, y: 44 });
  screen2.appendChild(header2);
  header2.appendChild(createText({
    name: "Title",
    value: "CRM",
    size: 20,
    weight: "medium",
    color: COLORS.textDark,
    x: 24,
    y: 16,
  }));
  header2.appendChild(createLucideIcon("bell", 20, COLORS.textDark, 356, 18));

  // Tabs Bar
  const tabs2 = createFrame({ name: "Tabs", w: 392, h: 48, x: 0, y: 100 });
  screen2.appendChild(tabs2);

  const tabAll2 = createFrame({ name: "Tab All", w: 172, h: 48, x: 16, y: 0 });
  tabs2.appendChild(tabAll2);
  tabAll2.appendChild(createText({
    name: "Label",
    value: "All Tasks",
    size: 14,
    weight: "medium",
    color: COLORS.primary,
    width: 172,
    align: "CENTER",
    y: 14,
  }));

  const indicator2 = figma.createFrame();
  indicator2.resize(60, 4);
  indicator2.x = 56;
  indicator2.y = 44;
  indicator2.cornerRadius = 2;
  indicator2.fills = [solid(COLORS.primary)];
  tabAll2.appendChild(indicator2);

  const tabCal2 = createFrame({ name: "Tab Cal", w: 172, h: 48, x: 204, y: 0 });
  tabs2.appendChild(tabCal2);
  tabCal2.appendChild(createText({
    name: "Label",
    value: "Calendar",
    size: 14,
    weight: "regular",
    color: COLORS.textSecondary,
    width: 172,
    align: "CENTER",
    y: 14,
  }));

  const dividerLine2 = figma.createFrame();
  dividerLine2.resize(392, 1);
  dividerLine2.x = 0;
  dividerLine2.y = 148;
  dividerLine2.fills = [solid(COLORS.border)];
  screen2.appendChild(dividerLine2);

  // Search input block (Active Search - "Gyan" entered)
  const searchBox2 = createFrame({
    name: "Search Input Bar - Active",
    w: 360,
    h: 44,
    x: 16,
    y: 164,
    bg: COLORS.white,
    stroke: COLORS.primary, // Highlight border in active search
    strokeWeight: 1,
    radius: 10,
  });
  screen2.appendChild(searchBox2);

  searchBox2.appendChild(createLucideIcon("search", 16, COLORS.primary, 14, 14));
  searchBox2.appendChild(createText({
    name: "Input text",
    value: "Gyan",
    size: 14,
    weight: "medium",
    color: COLORS.textDark,
    x: 38,
    y: 13,
  }));

  // Clear Close cross icon
  searchBox2.appendChild(createLucideIcon("x", 16, COLORS.textMuted, 360 - 58, 14));
  // Filter icon
  searchBox2.appendChild(createLucideIcon("sliders", 16, COLORS.primary, 360 - 30, 14));

  // Overview Cards
  const completedCard2 = createFrame({
    name: "Completed Card",
    w: 172,
    h: 48,
    x: 16,
    y: 224,
    bg: COLORS.white,
    stroke: COLORS.border,
    strokeWeight: 1,
    radius: 8,
  });
  screen2.appendChild(completedCard2);

  completedCard2.appendChild(createText({
    name: "Val",
    value: "01",
    size: 20,
    weight: "medium",
    color: COLORS.textDark,
    x: 12,
    y: 6,
  }));
  completedCard2.appendChild(createText({
    name: "Label",
    value: "Completed",
    size: 12,
    weight: "regular",
    color: COLORS.labelColor,
    x: 12,
    y: 28,
  }));

  const badgeBox2_1 = createFrame({ name: "Badge", w: 24, h: 24, x: 136, y: 12, radius: 12, bg: COLORS.greenBg });
  completedCard2.appendChild(badgeBox2_1);
  badgeBox2_1.appendChild(createLucideIcon("check", 12, COLORS.greenText, 6, 6));

  const dueCard2 = createFrame({
    name: "Due Card",
    w: 172,
    h: 48,
    x: 204,
    y: 224,
    bg: COLORS.white,
    stroke: COLORS.border,
    strokeWeight: 1,
    radius: 8,
  });
  screen2.appendChild(dueCard2);

  dueCard2.appendChild(createText({
    name: "Val",
    value: "02",
    size: 20,
    weight: "medium",
    color: COLORS.textDark,
    x: 12,
    y: 6,
  }));
  dueCard2.appendChild(createText({
    name: "Label",
    value: "Due in 7 days",
    size: 12,
    weight: "regular",
    color: COLORS.labelColor,
    x: 12,
    y: 28,
  }));

  const badgeBox2_2 = createFrame({ name: "Badge", w: 24, h: 24, x: 136, y: 12, radius: 12, bg: COLORS.orangeBg });
  dueCard2.appendChild(badgeBox2_2);
  badgeBox2_2.appendChild(createLucideIcon("calendar", 12, COLORS.orangeText, 6, 6));

  // Today label
  screen2.appendChild(createText({
    name: "Heading",
    value: "Today",
    size: 14,
    weight: "medium",
    color: COLORS.textDark,
    x: 16,
    y: 292,
  }));

  // Tasks list (Filtered to show matches for "Gyan")
  const listFrame2 = createFrame({ name: "Filtered Tasks List", w: 392, h: 300, x: 0, y: 316 });
  screen2.appendChild(listFrame2);

  // Row 2_1: Mail Gyan Sharma (highlighted)
  const row2_1 = createFrame({ name: "Row 1", w: 392, h: 72, x: 0, y: 0, bg: COLORS.white });
  listFrame2.appendChild(row2_1);

  const chk2_1 = figma.createEllipse();
  chk2_1.resize(20, 20);
  chk2_1.x = 16;
  chk2_1.y = 26;
  chk2_1.fills = [];
  chk2_1.strokes = [solid(COLORS.textMuted)];
  row2_1.appendChild(chk2_1);

  // Highlight word "Gyan"
  addHighlightedTitle(row2_1, "Mail ", "Gyan", " Sharma", false);

  row2_1.appendChild(createLucideIcon("calendar", 12, COLORS.dateColor, 52, 42));
  row2_1.appendChild(createText({ name: "Date", value: "24 June 2026", size: 12, color: COLORS.dateColor, x: 70, y: 40 }));
  row2_1.appendChild(createLucideIcon("chevron-right", 16, COLORS.textMuted, 356, 28));

  const div2_1 = figma.createFrame();
  div2_1.resize(360, 1);
  div2_1.x = 16;
  div2_1.y = 72;
  div2_1.fills = [solid(COLORS.border)];
  listFrame2.appendChild(div2_1);

  // Row 2_2: Call Gyan Sharma (highlighted)
  const row2_2 = createFrame({ name: "Row 2", w: 392, h: 72, x: 0, y: 74, bg: COLORS.white });
  listFrame2.appendChild(row2_2);

  const chk2_2 = figma.createEllipse();
  chk2_2.resize(20, 20);
  chk2_2.x = 16;
  chk2_2.y = 26;
  chk2_2.fills = [];
  chk2_2.strokes = [solid(COLORS.textMuted)];
  row2_2.appendChild(chk2_2);

  // Highlight word "Gyan"
  addHighlightedTitle(row2_2, "Call ", "Gyan", " Sharma", false);

  row2_2.appendChild(createLucideIcon("calendar", 12, COLORS.dateColor, 52, 42));
  row2_2.appendChild(createText({ name: "Date", value: "26 June 2026", size: 12, color: COLORS.dateColor, x: 70, y: 40 }));
  row2_2.appendChild(createLucideIcon("chevron-right", 16, COLORS.textMuted, 356, 28));

  const div2_2 = figma.createFrame();
  div2_2.resize(360, 1);
  div2_2.x = 16;
  div2_2.y = 146;
  div2_2.fills = [solid(COLORS.border)];
  listFrame2.appendChild(div2_2);

  // Row 2_3: Email Gyan for Events assignment (Completed, highlighted)
  const row2_3 = createFrame({ name: "Row 3", w: 392, h: 72, x: 0, y: 148, bg: COLORS.white });
  listFrame2.appendChild(row2_3);

  const chk2_3 = createFrame({ name: "Checked", w: 20, h: 20, x: 16, y: 26, radius: 10, bg: COLORS.greenBg, stroke: COLORS.greenText });
  row2_3.appendChild(chk2_3);
  chk2_3.appendChild(createLucideIcon("check", 12, COLORS.greenText, 4, 4));

  // Highlight word "Gyan"
  addHighlightedTitle(row2_3, "Email ", "Gyan", " for Events assignment", true);

  row2_3.appendChild(createLucideIcon("calendar", 12, COLORS.textMuted, 52, 42));
  row2_3.appendChild(createText({ name: "Date", value: "25 June 2026", size: 12, color: COLORS.textMuted, x: 70, y: 40 }));
  row2_3.appendChild(createLucideIcon("chevron-right", 16, COLORS.textMuted, 356, 28));

  // FAB pill button
  const fab2 = createFrame({ name: "FAB Pill", w: 80, h: 44, x: 296, y: 718, bg: COLORS.primary, radius: 8 });
  screen2.appendChild(fab2);
  fab2.appendChild(createLucideIcon("plus", 14, COLORS.white, 12, 15));
  fab2.appendChild(createText({ name: "Label", value: "Task", size: 14, weight: "bold", color: COLORS.white, x: 32, y: 12 }));

  // Bottom Navigation Bar
  buildBottomNavigation(screen2);

  // --------------------------------------------------------------------------
  // FINAL BOARD ASSEMBLY & POSITIONING
  // --------------------------------------------------------------------------
  figma.currentPage.appendChild(board);

  figma.currentPage.selection = [board];
  figma.viewport.scrollAndZoomIntoView([board]);
  figma.notify("CRM Search Highlights flow generated successfully!", { timeout: 3000 });
}

run();
