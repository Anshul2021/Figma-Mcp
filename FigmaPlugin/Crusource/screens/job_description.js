// Generated Figma Script: Crusource Job Description Screen (Zero Emoji, Vector Lucide Icons Only)
// Project: Crusource
// File: Crusource/screens/job_description.js
// Compliance: Instrument Sans font, Crusource Orange (#FF7700), Slate Text Scale (#0F172A, #334155), Vector Lucide SVG Icons, Zero Emojis.

(async function(figma) {
  // ── 1. Color System & Typography Tokens ──
  const COLOR_PRIMARY = { r: 1.000, g: 0.467, b: 0.000 };       // #FF7700 Crusource Orange
  const COLOR_PRIMARY_TINT = { r: 1.000, g: 0.941, b: 0.902 };  // #FFF0E6 Soft Orange Tint
  const COLOR_TEXT_HEAD = { r: 0.059, g: 0.090, b: 0.165 };      // #0F172A Slate 900
  const COLOR_TEXT_BODY = { r: 0.200, g: 0.255, b: 0.333 };      // #334155 Slate 700
  const COLOR_TEXT_MUTED = { r: 0.392, g: 0.455, b: 0.545 };     // #64748B Slate 500
  const COLOR_BORDER = { r: 0.898, g: 0.906, b: 0.922 };        // #E5E7EB Slate 200
  const COLOR_BORDER_LIGHT = { r: 0.945, g: 0.961, b: 0.976 };  // #F1F5F9 Slate 100
  const COLOR_BG = { r: 0.973, g: 0.980, b: 0.988 };            // #F8FAFC Slate 50
  const COLOR_SURFACE = { r: 1.000, g: 1.000, b: 1.000 };       // #FFFFFF Pure White
  const COLOR_SUCCESS = { r: 0.063, g: 0.725, b: 0.451 };       // #10B981 Emerald Green
  const COLOR_SUCCESS_BG = { r: 0.902, g: 0.980, b: 0.941 };    // Emerald soft fill

  let PRIMARY_FONT = "Instrument Sans";
  try {
    await figma.loadFontAsync({ family: "Instrument Sans", style: "Bold" });
    await figma.loadFontAsync({ family: "Instrument Sans", style: "Medium" });
    await figma.loadFontAsync({ family: "Instrument Sans", style: "Regular" });
  } catch (e) {
    PRIMARY_FONT = "Inter";
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  }

  // ── 2. Lucide Vector Icon Loader (Lightweight 1.5px Stroke Width) ──
  async function loadLucideIcon(iconName, size = 16, color = COLOR_TEXT_MUTED, strokeWidth = 1.5) {
    try {
      const res = await fetch(`https://unpkg.com/lucide-static@latest/icons/${iconName}.svg`);
      if (!res.ok) return createFallbackIcon(size, color, strokeWidth);
      let svgText = await res.text();
      if (!svgText || !svgText.includes("<svg")) return createFallbackIcon(size, color, strokeWidth);
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

  function createFallbackIcon(size = 16, color = COLOR_TEXT_MUTED, strokeWidth = 1.5) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}"><circle cx="12" cy="12" r="9"/></svg>`;
    const node = figma.createNodeFromSvg(svg);
    node.resize(size, size);
    node.name = "Icon / fallback";
    const vectors = node.findAll(n => n.type === 'VECTOR');
    vectors.forEach(v => { v.strokes = [{ type: 'SOLID', color }]; v.strokeWeight = strokeWidth; });
    return node;
  }

  // Helper Node Constructors
  function createText(text, fontSize = 14, style = "Regular", color = COLOR_TEXT_BODY) {
    const node = figma.createText();
    node.fontName = { family: PRIMARY_FONT, style };
    node.fontSize = fontSize;
    node.characters = text;
    node.fills = [{ type: 'SOLID', color }];
    return node;
  }

  function createBadge(label, bgColor = COLOR_PRIMARY_TINT, textColor = COLOR_PRIMARY) {
    const badge = figma.createFrame();
    badge.name = `Badge / ${label}`;
    badge.layoutMode = "HORIZONTAL";
    badge.paddingLeft = 8; badge.paddingRight = 8;
    badge.paddingTop = 4; badge.paddingBottom = 4;
    badge.cornerRadius = 4;
    badge.fills = [{ type: 'SOLID', color: bgColor }];
    badge.primaryAxisSizingMode = "AUTO";
    badge.counterAxisSizingMode = "AUTO";
    const txt = createText(label, 10, "Bold", textColor);
    badge.appendChild(txt);
    return badge;
  }

  function createTechChip(techName) {
    const chip = figma.createFrame();
    chip.name = `TechChip / ${techName}`;
    chip.layoutMode = "HORIZONTAL";
    chip.paddingLeft = 10; chip.paddingRight = 10;
    chip.paddingTop = 6; chip.paddingBottom = 6;
    chip.cornerRadius = 16;
    chip.fills = [{ type: 'SOLID', color: COLOR_BORDER_LIGHT }];
    chip.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
    chip.primaryAxisSizingMode = "AUTO";
    chip.counterAxisSizingMode = "AUTO";
    chip.appendChild(createText(techName, 12, "Medium", COLOR_TEXT_BODY));
    return chip;
  }

  async function createMetaItem(iconName, textLabel) {
    const item = figma.createFrame();
    item.name = `MetaItem / ${iconName}`;
    item.layoutMode = "HORIZONTAL";
    item.itemSpacing = 6;
    item.counterAxisAlignItems = "CENTER";
    item.primaryAxisSizingMode = "AUTO";
    item.counterAxisSizingMode = "AUTO";

    const iconNode = await loadLucideIcon(iconName, 14, COLOR_TEXT_MUTED, 1.5);
    item.appendChild(iconNode);
    item.appendChild(createText(textLabel, 13, "Medium", COLOR_TEXT_MUTED));
    return item;
  }

  // Remove existing screen if present to prevent duplicates
  const existingScreen = figma.currentPage.findChild(n => n.name === "Screen / Crusource Job Description");
  if (existingScreen) existingScreen.remove();

  // ── 3. Main Viewport Container (1440x900) ──
  const screen = figma.createFrame();
  screen.name = "Screen / Crusource Job Description";
  screen.layoutMode = "VERTICAL";
  screen.fills = [{ type: 'SOLID', color: COLOR_BG }];
  screen.resize(1440, 900);
  screen.primaryAxisSizingMode = "FIXED";
  screen.counterAxisSizingMode = "FIXED";

  // ── 4. Top Navigation Header (60px height) ──
  const topNav = figma.createFrame();
  topNav.name = "Header / Top Navigation";
  topNav.layoutMode = "HORIZONTAL";
  topNav.paddingLeft = 32; topNav.paddingRight = 32;
  topNav.paddingTop = 14; topNav.paddingBottom = 14;
  topNav.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  topNav.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  topNav.strokeWeight = 1;
  topNav.primaryAxisAlignItems = "SPACE_BETWEEN";
  topNav.counterAxisAlignItems = "CENTER";
  topNav.resize(1440, 60);
  topNav.primaryAxisSizingMode = "FIXED";
  topNav.counterAxisSizingMode = "FIXED";

  // Left Section (Brand + Breadcrumbs)
  const leftHeader = figma.createFrame();
  leftHeader.name = "LeftHeader";
  leftHeader.layoutMode = "HORIZONTAL";
  leftHeader.itemSpacing = 16;
  leftHeader.counterAxisAlignItems = "CENTER";
  leftHeader.primaryAxisSizingMode = "AUTO";
  leftHeader.counterAxisSizingMode = "AUTO";

  const brandBadge = figma.createFrame();
  brandBadge.name = "BrandLogo";
  brandBadge.layoutMode = "HORIZONTAL";
  brandBadge.paddingLeft = 10; brandBadge.paddingRight = 10;
  brandBadge.paddingTop = 6; brandBadge.paddingBottom = 6;
  brandBadge.cornerRadius = 6;
  brandBadge.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
  brandBadge.primaryAxisSizingMode = "AUTO";
  brandBadge.counterAxisSizingMode = "AUTO";
  brandBadge.appendChild(createText("CRUSOURCE", 12, "Bold", COLOR_SURFACE));
  leftHeader.appendChild(brandBadge);

  leftHeader.appendChild(createText("Careers  /  Engineering  /  Senior Staff Frontend Architect", 12, "Medium", COLOR_TEXT_MUTED));
  topNav.appendChild(leftHeader);

  // Right Section (Actions + Profile)
  const rightHeader = figma.createFrame();
  rightHeader.name = "RightHeader";
  rightHeader.layoutMode = "HORIZONTAL";
  rightHeader.itemSpacing = 12;
  rightHeader.counterAxisAlignItems = "CENTER";
  rightHeader.primaryAxisSizingMode = "AUTO";
  rightHeader.counterAxisSizingMode = "AUTO";

  const shareBtn = figma.createFrame();
  shareBtn.name = "Button / Share";
  shareBtn.layoutMode = "HORIZONTAL";
  shareBtn.paddingLeft = 12; shareBtn.paddingRight = 12;
  shareBtn.paddingTop = 6; shareBtn.paddingBottom = 6;
  shareBtn.itemSpacing = 6;
  shareBtn.cornerRadius = 6;
  shareBtn.fills = [{ type: 'SOLID', color: COLOR_BG }];
  shareBtn.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  shareBtn.primaryAxisSizingMode = "AUTO";
  shareBtn.counterAxisSizingMode = "AUTO";
  shareBtn.appendChild(await loadLucideIcon("share-2", 14, COLOR_TEXT_BODY));
  shareBtn.appendChild(createText("Share Job", 12, "Bold", COLOR_TEXT_BODY));
  rightHeader.appendChild(shareBtn);

  const profilePill = figma.createFrame();
  profilePill.name = "ProfilePill";
  profilePill.layoutMode = "HORIZONTAL";
  profilePill.paddingLeft = 10; profilePill.paddingRight = 12;
  profilePill.paddingTop = 6; profilePill.paddingBottom = 6;
  profilePill.itemSpacing = 8;
  profilePill.cornerRadius = 16;
  profilePill.fills = [{ type: 'SOLID', color: COLOR_BG }];
  profilePill.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  profilePill.primaryAxisSizingMode = "AUTO";
  profilePill.counterAxisSizingMode = "AUTO";

  const avatar = figma.createFrame();
  avatar.name = "Avatar";
  avatar.resize(20, 20);
  avatar.cornerRadius = 10;
  avatar.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
  avatar.layoutMode = "HORIZONTAL";
  avatar.primaryAxisAlignItems = "CENTER"; avatar.counterAxisAlignItems = "CENTER";
  avatar.appendChild(createText("A", 10, "Bold", COLOR_SURFACE));
  profilePill.appendChild(avatar);

  profilePill.appendChild(createText("Anshul R.", 12, "Bold", COLOR_TEXT_HEAD));
  rightHeader.appendChild(profilePill);

  topNav.appendChild(rightHeader);
  screen.appendChild(topNav);

  // ── 5. Main Scrollable Container (840px height) ──
  const mainScroll = figma.createFrame();
  mainScroll.name = "MainScrollArea";
  mainScroll.layoutMode = "VERTICAL";
  mainScroll.paddingLeft = 32; mainScroll.paddingRight = 32;
  mainScroll.paddingTop = 24; mainScroll.paddingBottom = 24;
  mainScroll.itemSpacing = 20;
  mainScroll.resize(1440, 840);
  mainScroll.primaryAxisSizingMode = "FIXED";
  mainScroll.counterAxisSizingMode = "FIXED";

  // ── 5A. Hero Job Header Card ──
  const heroCard = figma.createFrame();
  heroCard.name = "Card / JobHeroHeader";
  heroCard.layoutMode = "HORIZONTAL";
  heroCard.paddingLeft = 24; heroCard.paddingRight = 24;
  heroCard.paddingTop = 24; heroCard.paddingBottom = 24;
  heroCard.itemSpacing = 24;
  heroCard.cornerRadius = 16;
  heroCard.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  heroCard.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  heroCard.primaryAxisAlignItems = "SPACE_BETWEEN";
  heroCard.counterAxisAlignItems = "CENTER";
  heroCard.primaryAxisSizingMode = "AUTO";
  heroCard.counterAxisSizingMode = "AUTO";

  // Hero Left
  const heroLeft = figma.createFrame();
  heroLeft.name = "HeroLeftMeta";
  heroLeft.layoutMode = "VERTICAL";
  heroLeft.itemSpacing = 10;
  heroLeft.primaryAxisSizingMode = "AUTO";
  heroLeft.counterAxisSizingMode = "AUTO";

  const badgeRow = figma.createFrame();
  badgeRow.name = "BadgeRow";
  badgeRow.layoutMode = "HORIZONTAL";
  badgeRow.itemSpacing = 8;
  badgeRow.primaryAxisSizingMode = "AUTO";
  badgeRow.counterAxisSizingMode = "AUTO";
  badgeRow.appendChild(createBadge("ENGINEERING", COLOR_PRIMARY_TINT, COLOR_PRIMARY));
  badgeRow.appendChild(createBadge("FULL TIME", COLOR_BORDER_LIGHT, COLOR_TEXT_BODY));
  badgeRow.appendChild(createBadge("REMOTE (US/EU)", COLOR_SUCCESS_BG, COLOR_SUCCESS));
  badgeRow.appendChild(createBadge("URGENT HIRING", { r: 1.00, g: 0.95, b: 0.90 }, COLOR_PRIMARY));
  heroLeft.appendChild(badgeRow);

  heroLeft.appendChild(createText("Senior Staff Frontend Architect — Design Engine", 24, "Bold", COLOR_TEXT_HEAD));

  // Meta Item Row with Vector Lucide Icons (Zero Emoji Rule)
  const metaRow = figma.createFrame();
  metaRow.name = "MetaRow";
  metaRow.layoutMode = "HORIZONTAL";
  metaRow.itemSpacing = 20;
  metaRow.primaryAxisSizingMode = "AUTO";
  metaRow.counterAxisSizingMode = "AUTO";

  metaRow.appendChild(await createMetaItem("map-pin", "San Francisco, CA (Hybrid)"));
  metaRow.appendChild(await createMetaItem("dollar-sign", "$190,000 - $240,000 / yr"));
  metaRow.appendChild(await createMetaItem("trending-up", "0.10% - 0.25% Equity"));
  metaRow.appendChild(await createMetaItem("clock", "Posted 2 days ago • 34 Applicants"));
  heroLeft.appendChild(metaRow);

  heroCard.appendChild(heroLeft);

  // Hero Right CTA Buttons
  const heroCtaGroup = figma.createFrame();
  heroCtaGroup.name = "HeroCtaGroup";
  heroCtaGroup.layoutMode = "HORIZONTAL";
  heroCtaGroup.itemSpacing = 12;
  heroCtaGroup.counterAxisAlignItems = "CENTER";
  heroCtaGroup.primaryAxisSizingMode = "AUTO";
  heroCtaGroup.counterAxisSizingMode = "AUTO";

  const saveJobBtn = figma.createFrame();
  saveJobBtn.name = "Button / SaveJob";
  saveJobBtn.layoutMode = "HORIZONTAL";
  saveJobBtn.paddingLeft = 18; saveJobBtn.paddingRight = 18;
  saveJobBtn.paddingTop = 12; saveJobBtn.paddingBottom = 12;
  saveJobBtn.itemSpacing = 8;
  saveJobBtn.cornerRadius = 8;
  saveJobBtn.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  saveJobBtn.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  saveJobBtn.primaryAxisSizingMode = "AUTO";
  saveJobBtn.counterAxisSizingMode = "AUTO";
  saveJobBtn.appendChild(await loadLucideIcon("bookmark", 16, COLOR_TEXT_HEAD));
  saveJobBtn.appendChild(createText("Save Job", 14, "Bold", COLOR_TEXT_HEAD));
  heroCtaGroup.appendChild(saveJobBtn);

  const applyHeroBtn = figma.createFrame();
  applyHeroBtn.name = "Button / ApplyNowHero";
  applyHeroBtn.layoutMode = "HORIZONTAL";
  applyHeroBtn.paddingLeft = 24; applyHeroBtn.paddingRight = 24;
  applyHeroBtn.paddingTop = 12; applyHeroBtn.paddingBottom = 12;
  applyHeroBtn.itemSpacing = 8;
  applyHeroBtn.cornerRadius = 8;
  applyHeroBtn.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
  applyHeroBtn.primaryAxisSizingMode = "AUTO";
  applyHeroBtn.counterAxisSizingMode = "AUTO";
  applyHeroBtn.appendChild(createText("Apply for this Role", 14, "Bold", COLOR_SURFACE));
  applyHeroBtn.appendChild(await loadLucideIcon("arrow-right", 16, COLOR_SURFACE));
  heroCtaGroup.appendChild(applyHeroBtn);

  heroCard.appendChild(heroCtaGroup);
  mainScroll.appendChild(heroCard);
  heroCard.layoutSizingHorizontal = "FILL";

  // ── 5B. Main Dual Column Section ──
  const dualGrid = figma.createFrame();
  dualGrid.name = "DualGrid / JDContent";
  dualGrid.layoutMode = "HORIZONTAL";
  dualGrid.itemSpacing = 24;
  dualGrid.primaryAxisSizingMode = "AUTO";
  dualGrid.counterAxisSizingMode = "AUTO";

  // LEFT COLUMN (Width 880px)
  const leftJD = figma.createFrame();
  leftJD.name = "LeftCol / DetailedJD";
  leftJD.layoutMode = "VERTICAL";
  leftJD.paddingLeft = 28; leftJD.paddingRight = 28;
  leftJD.paddingTop = 24; leftJD.paddingBottom = 24;
  leftJD.itemSpacing = 20;
  leftJD.cornerRadius = 16;
  leftJD.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  leftJD.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  leftJD.resize(880, 580);
  leftJD.primaryAxisSizingMode = "FIXED";
  leftJD.counterAxisSizingMode = "FIXED";

  // Section 1: About Crusource
  leftJD.appendChild(createText("About Crusource", 16, "Bold", COLOR_TEXT_HEAD));
  leftJD.appendChild(createText("Crusource is the premier AI-powered HRMS & talent acquisition platform helping 500,000+ candidates and enterprise HR teams automate recruitment, onboarding, and workforce management with high-precision automation.", 14, "Regular", COLOR_TEXT_BODY));

  const divA = figma.createFrame(); divA.resize(824, 1); divA.fills = [{ type: 'SOLID', color: COLOR_BORDER_LIGHT }];
  leftJD.appendChild(divA);

  // Section 2: Key Responsibilities
  leftJD.appendChild(createText("Key Responsibilities", 16, "Bold", COLOR_TEXT_HEAD));
  
  async function createBulletItem(text) {
    const row = figma.createFrame();
    row.name = "BulletRow";
    row.layoutMode = "HORIZONTAL";
    row.itemSpacing = 10;
    row.counterAxisAlignItems = "CENTER";
    row.primaryAxisSizingMode = "AUTO";
    row.counterAxisSizingMode = "AUTO";
    row.appendChild(await loadLucideIcon("check-circle-2", 16, COLOR_SUCCESS));
    row.appendChild(createText(text, 14, "Regular", COLOR_TEXT_BODY));
    return row;
  }

  leftJD.appendChild(await createBulletItem("Lead the architecture and technical design of our Figma canvas generation engine and web plugins."));
  leftJD.appendChild(await createBulletItem("Build scalable TypeScript modules, webview providers, and bridge servers powering live UI generation."));
  leftJD.appendChild(await createBulletItem("Collaborate with Senior UI Designers to refine design token scales, auto layout constraints, and accessibility."));
  leftJD.appendChild(await createBulletItem("Benchmark performance, reduce prompt token consumption, and maintain 99.9% bridge server uptime."));

  const divB = figma.createFrame(); divB.resize(824, 1); divB.fills = [{ type: 'SOLID', color: COLOR_BORDER_LIGHT }];
  leftJD.appendChild(divB);

  // Section 3: Tech Stack
  leftJD.appendChild(createText("Required Tech Stack & Skills", 16, "Bold", COLOR_TEXT_HEAD));
  const techRow = figma.createFrame();
  techRow.name = "TechStackChips";
  techRow.layoutMode = "HORIZONTAL";
  techRow.itemSpacing = 8;
  techRow.primaryAxisSizingMode = "AUTO";
  techRow.counterAxisSizingMode = "AUTO";
  techRow.appendChild(createTechChip("React 18"));
  techRow.appendChild(createTechChip("TypeScript"));
  techRow.appendChild(createTechChip("Figma Plugin API"));
  techRow.appendChild(createTechChip("Node.js Bridge"));
  techRow.appendChild(createTechChip("Auto Layout 5.0"));
  techRow.appendChild(createTechChip("TailwindCSS"));
  techRow.appendChild(createTechChip("Jest / Vitest"));
  leftJD.appendChild(techRow);

  dualGrid.appendChild(leftJD);

  // RIGHT COLUMN (Width 430px)
  const rightSidebar = figma.createFrame();
  rightSidebar.name = "RightCol / ApplicationSidebar";
  rightSidebar.layoutMode = "VERTICAL";
  rightSidebar.itemSpacing = 16;
  rightSidebar.resize(430, 580);
  rightSidebar.primaryAxisSizingMode = "FIXED";
  rightSidebar.counterAxisSizingMode = "FIXED";

  // Sidebar Card 1: Fast Application Widget
  const applyCard = figma.createFrame();
  applyCard.name = "Card / FastApplyWidget";
  applyCard.layoutMode = "VERTICAL";
  applyCard.paddingLeft = 20; applyCard.paddingRight = 20;
  applyCard.paddingTop = 20; applyCard.paddingBottom = 20;
  applyCard.itemSpacing = 14;
  applyCard.cornerRadius = 12;
  applyCard.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  applyCard.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  applyCard.primaryAxisSizingMode = "AUTO";
  applyCard.counterAxisSizingMode = "AUTO";

  applyCard.appendChild(createText("Ready to Apply?", 18, "Bold", COLOR_TEXT_HEAD));
  applyCard.appendChild(createText("Takes approximately 3 minutes to complete. Your profile and uploaded resume will be submitted directly to the hiring manager.", 13, "Regular", COLOR_TEXT_MUTED));

  const applySidebarBtn = figma.createFrame();
  applySidebarBtn.name = "Button / ApplyNowSidebar";
  applySidebarBtn.layoutMode = "HORIZONTAL";
  applySidebarBtn.paddingLeft = 20; applySidebarBtn.paddingRight = 20;
  applySidebarBtn.paddingTop = 12; applySidebarBtn.paddingBottom = 12;
  applySidebarBtn.itemSpacing = 8;
  applySidebarBtn.cornerRadius = 8;
  applySidebarBtn.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
  applySidebarBtn.primaryAxisAlignItems = "CENTER";
  applySidebarBtn.counterAxisAlignItems = "CENTER";
  applySidebarBtn.primaryAxisSizingMode = "AUTO";
  applySidebarBtn.counterAxisSizingMode = "AUTO";
  applySidebarBtn.appendChild(createText("Apply for this Position", 14, "Bold", COLOR_SURFACE));
  applySidebarBtn.appendChild(await loadLucideIcon("arrow-right", 16, COLOR_SURFACE));
  applyCard.appendChild(applySidebarBtn);
  applySidebarBtn.layoutSizingHorizontal = "FILL";

  rightSidebar.appendChild(applyCard);
  applyCard.layoutSizingHorizontal = "FILL";

  // Sidebar Card 2: Hiring Team
  const teamCard = figma.createFrame();
  teamCard.name = "Card / HiringTeam";
  teamCard.layoutMode = "VERTICAL";
  teamCard.paddingLeft = 20; teamCard.paddingRight = 20;
  teamCard.paddingTop = 16; teamCard.paddingBottom = 16;
  teamCard.itemSpacing = 12;
  teamCard.cornerRadius = 12;
  teamCard.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  teamCard.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  teamCard.primaryAxisSizingMode = "AUTO";
  teamCard.counterAxisSizingMode = "AUTO";

  teamCard.appendChild(createText("Hiring Team for this Role", 14, "Bold", COLOR_TEXT_HEAD));

  const managerRow = figma.createFrame();
  managerRow.name = "HiringManagerRow";
  managerRow.layoutMode = "HORIZONTAL";
  managerRow.itemSpacing = 12;
  managerRow.counterAxisAlignItems = "CENTER";
  managerRow.primaryAxisSizingMode = "AUTO";
  managerRow.counterAxisSizingMode = "AUTO";

  const mgrAvatar = figma.createFrame();
  mgrAvatar.resize(32, 32); mgrAvatar.cornerRadius = 16;
  mgrAvatar.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_TINT }];
  mgrAvatar.layoutMode = "HORIZONTAL";
  mgrAvatar.primaryAxisAlignItems = "CENTER"; mgrAvatar.counterAxisAlignItems = "CENTER";
  mgrAvatar.appendChild(createText("VP", 10, "Bold", COLOR_PRIMARY));
  managerRow.appendChild(mgrAvatar);

  const mgrInfo = figma.createFrame();
  mgrInfo.layoutMode = "VERTICAL"; mgrInfo.itemSpacing = 2;
  mgrInfo.primaryAxisSizingMode = "AUTO"; mgrInfo.counterAxisSizingMode = "AUTO";
  mgrInfo.appendChild(createText("Sarah Jenkins", 13, "Bold", COLOR_TEXT_HEAD));
  mgrInfo.appendChild(createText("VP of Engineering • Crusource", 11, "Medium", COLOR_TEXT_MUTED));
  managerRow.appendChild(mgrInfo);

  teamCard.appendChild(managerRow);
  rightSidebar.appendChild(teamCard);
  teamCard.layoutSizingHorizontal = "FILL";

  dualGrid.appendChild(rightSidebar);
  mainScroll.appendChild(dualGrid);
  dualGrid.layoutSizingHorizontal = "FILL";

  screen.appendChild(mainScroll);

  // ── 6. Scroll & Zoom into View ──
  figma.currentPage.appendChild(screen);
  figma.viewport.scrollAndZoomIntoView([screen]);
  figma.notify("Updated Job Description screen with zero text emojis & vector Lucide icons!", { timeout: 2500 });

})(figma);
