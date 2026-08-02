(async function(figma) {
  // ═══════════════════════════════════════════════════════════
  // Crusource Desktop — Candidate Dashboard (@skip-autolayout Static Layout)
  // ═══════════════════════════════════════════════════════════

  // 1. Cleanup Previous Generation
  const existingContainer = figma.currentPage.findOne(n => n.name === "Generated UI Screens");
  if (existingContainer) {
    existingContainer.remove();
  }

  const rootContainer = figma.createFrame();
  rootContainer.name = "Generated UI Screens";
  rootContainer.x = 0;
  rootContainer.y = 0;
  rootContainer.resize(1520, 980);
  rootContainer.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.96 } }];
  figma.currentPage.appendChild(rootContainer);

  // 2. Safe Font Loading (Strict Even Scale: 10, 12, 14, 16, 20, 24, 32)
  let PRIMARY_FONT = "Instrument Sans";
  async function loadSystemFonts() {
    const weights = ["Regular", "Medium", "Bold", "SemiBold"];
    try {
      for (const style of weights) {
        await figma.loadFontAsync({ family: "Instrument Sans", style });
      }
      PRIMARY_FONT = "Instrument Sans";
    } catch (e1) {
      try {
        for (const style of weights) {
          await figma.loadFontAsync({ family: "Inter", style });
        }
        PRIMARY_FONT = "Inter";
      } catch (e2) {
        for (const style of weights) {
          await figma.loadFontAsync({ family: "Roboto", style });
        }
        PRIMARY_FONT = "Roboto";
      }
    }
  }
  await loadSystemFonts();

  // 3. Color Tokens
  const COLORS = {
    primary:      { r: 1.000, g: 0.467, b: 0.000 },  // #FF7700 Crusource Primary Orange
    primaryLight: { r: 1.000, g: 0.941, b: 0.902 },  // #FFF0E6 Soft Orange Tint
    text:         { r: 0.059, g: 0.090, b: 0.165 },  // #0F172A Slate 900
    textMuted:    { r: 0.392, g: 0.455, b: 0.545 },  // #64748B Slate 500
    textSubtle:   { r: 0.584, g: 0.647, b: 0.725 },  // #94A3B8 Slate 400
    surface:      { r: 1.000, g: 1.000, b: 1.000 },  // #FFFFFF Pure White Cards
    background:   { r: 0.973, g: 0.980, b: 0.988 },  // #F8FAFC Canvas Slate 50
    border:       { r: 0.886, g: 0.910, b: 0.941 },  // #E2E8F0 Component Border
    borderLight:  { r: 0.945, g: 0.961, b: 0.976 },  // #F1F5F9 Light Border

    // Status Tokens
    success:      { r: 0.063, g: 0.725, b: 0.506 },  // #10B981 Green
    successBg:    { r: 0.886, g: 0.969, b: 0.933 },  // #E6F4EA
    warning:      { r: 0.960, g: 0.624, b: 0.043 },  // #F59E0B Amber
    warningBg:    { r: 0.996, g: 0.953, b: 0.780 },  // #FEF3C7
    info:         { r: 0.008, g: 0.518, b: 0.780 },  // #0284C7 Blue
    infoBg:       { r: 0.878, g: 0.949, b: 0.996 }   // #E0F2FE Soft Blue
  };

  // 4. Lucide SVG Icon Loader Protocol
  async function loadLucideIcon(iconName, size = 20, color = COLORS.textMuted, strokeWidth = 1.5) {
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

  function createFallbackIcon(size = 20, color = COLORS.textMuted, strokeWidth = 1.5) {
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

  // 5. Online Image Helper
  async function applyOnlineImage(frameNode, imageUrl, fallbackText = "AV") {
    try {
      const image = await figma.createImageAsync(imageUrl);
      frameNode.fills = [{
        type: 'IMAGE',
        scaleMode: 'FILL',
        imageHash: image.hash
      }];
    } catch (err) {
      frameNode.fills = [{ type: 'SOLID', color: COLORS.borderLight }];
    }
  }

  // 6. Text Creator (Strict Even Scale: 10, 12, 14, 16, 20, 24, 32)
  function createText(content, fontSize, fontStyle = "Regular", color = COLORS.text) {
    const text = figma.createText();
    text.fontName = { family: PRIMARY_FONT, style: fontStyle };
    text.fontSize = fontSize;
    text.characters = String(content);
    text.fills = [{ type: 'SOLID', color }];
    return text;
  }

  // ═══════════════════════════════════════════════════════════
  // ROOT DESKTOP SCREEN: 1440px x 900px (@skip-autolayout Static X/Y)
  // ═══════════════════════════════════════════════════════════
  const screen = figma.createFrame();
  screen.name = "Screen / Candidate Dashboard";
  screen.x = 40; screen.y = 40;
  screen.resize(1440, 900);
  screen.fills = [{ type: 'SOLID', color: COLORS.background }];
  screen.cornerRadius = 12;
  screen.clipsContent = true;
  rootContainer.appendChild(screen);

  // ───────────────────────────────────────────────────────────
  // 1. LEFT NAVIGATION SIDEBAR (Static X: 0, Y: 0, 240px x 900px)
  // ───────────────────────────────────────────────────────────
  const sidebar = figma.createFrame();
  sidebar.name = "Sidebar / Navigation";
  sidebar.x = 0; sidebar.y = 0;
  sidebar.resize(240, 900);
  sidebar.fills = [{ type: 'SOLID', color: COLORS.surface }];
  sidebar.strokes = [{ type: 'SOLID', color: COLORS.border }];
  sidebar.strokeWeight = 1;
  screen.appendChild(sidebar);

  // Logo Badge Box
  const logoBadge = figma.createFrame();
  logoBadge.x = 16; logoBadge.y = 20;
  logoBadge.resize(36, 36); logoBadge.cornerRadius = 8;
  logoBadge.fills = [{ type: 'SOLID', color: COLORS.primary }];
  const lIcon = await loadLucideIcon("user-check", 20, COLORS.surface, 2.0);
  lIcon.x = 8; lIcon.y = 8;
  logoBadge.appendChild(lIcon);
  sidebar.appendChild(logoBadge);

  const brandTitle = createText("Crusource", 20, "Bold", COLORS.text);
  brandTitle.x = 60; brandTitle.y = 20;
  sidebar.appendChild(brandTitle);

  const brandSub = createText("Candidate Portal", 10, "Bold", COLORS.primary);
  brandSub.x = 60; brandSub.y = 42;
  sidebar.appendChild(brandSub);

  // Divider 1
  const div1 = figma.createFrame(); div1.x = 16; div1.y = 68; div1.resize(208, 1);
  div1.fills = [{ type: 'SOLID', color: COLORS.border }];
  sidebar.appendChild(div1);

  // Navigation Items Array
  const navItems = [
    { label: "Dashboard", icon: "layout-dashboard", active: true },
    { label: "My Applications", icon: "briefcase", badge: "2" },
    { label: "BGV Verification", icon: "shield-check", badge: "Action" },
    { label: "Interviews", icon: "video", badge: "1" },
    { label: "My Documents", icon: "file-text" },
    { label: "Offer Letters", icon: "award" },
    { label: "Profile & Settings", icon: "settings" }
  ];

  let navY = 80;
  for (const item of navItems) {
    const navItemFrame = figma.createFrame();
    navItemFrame.x = 16; navItemFrame.y = navY;
    navItemFrame.resize(208, 40); navItemFrame.cornerRadius = 8;

    if (item.active) {
      navItemFrame.fills = [{ type: 'SOLID', color: COLORS.primaryLight }];
      navItemFrame.strokes = [{ type: 'SOLID', color: COLORS.primaryLight }];
      navItemFrame.strokeWeight = 1;
      const icon = await loadLucideIcon(item.icon, 18, COLORS.primary, 2.0);
      icon.x = 12; icon.y = 11;
      navItemFrame.appendChild(icon);
      const txt = createText(item.label, 14, "Bold", COLORS.primary);
      txt.x = 40; txt.y = 11;
      navItemFrame.appendChild(txt);
    } else {
      navItemFrame.fills = [];
      const icon = await loadLucideIcon(item.icon, 18, COLORS.textMuted, 1.5);
      icon.x = 12; icon.y = 11;
      navItemFrame.appendChild(icon);
      const txt = createText(item.label, 14, "Medium", COLORS.text);
      txt.x = 40; txt.y = 11;
      navItemFrame.appendChild(txt);
    }

    if (item.badge) {
      const bFrame = figma.createFrame();
      bFrame.x = item.badge === "Action" ? 152 : 176; bFrame.y = 10;
      bFrame.resize(item.badge === "Action" ? 44 : 20, 20);
      bFrame.cornerRadius = 9999;
      bFrame.fills = [{ type: 'SOLID', color: COLORS.primaryLight }];
      const bTxt = createText(item.badge, 10, "Bold", COLORS.primary);
      bTxt.x = item.badge === "Action" ? 6 : 6; bTxt.y = 3;
      bFrame.appendChild(bTxt);
      navItemFrame.appendChild(bFrame);
    }

    sidebar.appendChild(navItemFrame);
    navY += 44;
  }

  // Divider 2 & Candidate Profile
  const div2 = figma.createFrame(); div2.x = 16; div2.y = 824; div2.resize(208, 1);
  div2.fills = [{ type: 'SOLID', color: COLORS.border }];
  sidebar.appendChild(div2);

  const candProfile = figma.createFrame();
  candProfile.x = 16; candProfile.y = 836; candProfile.resize(208, 44);
  candProfile.fills = [];
  sidebar.appendChild(candProfile);

  const avatar = figma.createFrame();
  avatar.x = 0; avatar.y = 4; avatar.resize(36, 36); avatar.cornerRadius = 9999;
  await applyOnlineImage(avatar, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", "AJ");
  candProfile.appendChild(avatar);

  const pName = createText("Alex Johnson", 14, "Bold", COLORS.text);
  pName.x = 46; pName.y = 4;
  candProfile.appendChild(pName);

  const pRole = createText("Senior Engineer", 12, "Regular", COLORS.textMuted);
  pRole.x = 46; pRole.y = 24;
  candProfile.appendChild(pRole);

  const logoutIcon = await loadLucideIcon("log-out", 18, COLORS.textMuted);
  logoutIcon.x = 182; logoutIcon.y = 12;
  candProfile.appendChild(logoutIcon);

  // ───────────────────────────────────────────────────────────
  // 2. MAIN WORKSPACE CONTAINER (Static X: 240, Y: 0, 1200px x 900px)
  // ───────────────────────────────────────────────────────────
  const workspace = figma.createFrame();
  workspace.name = "Workspace / Main Area";
  workspace.x = 240; workspace.y = 0;
  workspace.resize(1200, 900);
  workspace.fills = [{ type: 'SOLID', color: COLORS.background }];
  screen.appendChild(workspace);

  // Top Header Bar (Static Y: 0, Height: 64px)
  const headerBar = figma.createFrame();
  headerBar.name = "Header / Top Bar";
  headerBar.x = 0; headerBar.y = 0;
  headerBar.resize(1200, 64);
  headerBar.fills = [{ type: 'SOLID', color: COLORS.surface }];
  headerBar.strokes = [{ type: 'SOLID', color: COLORS.border }];
  headerBar.strokeWeight = 1;
  workspace.appendChild(headerBar);

  const hTitle = createText("Welcome back, Alex!", 20, "Bold", COLORS.text);
  hTitle.x = 24; hTitle.y = 14;
  headerBar.appendChild(hTitle);

  const hSub = createText("Track your job application progress, interview schedules & BGV verification", 12, "Regular", COLORS.textMuted);
  hSub.x = 24; hSub.y = 38;
  headerBar.appendChild(hSub);

  // Header Right Controls
  const searchInput = figma.createFrame();
  searchInput.x = 700; searchInput.y = 14; searchInput.resize(260, 36);
  searchInput.cornerRadius = 8;
  searchInput.fills = [{ type: 'SOLID', color: COLORS.borderLight }];
  searchInput.strokes = [{ type: 'SOLID', color: COLORS.border }];
  searchInput.strokeWeight = 1;
  const sIcon = await loadLucideIcon("search", 16, COLORS.textMuted);
  sIcon.x = 10; sIcon.y = 10;
  searchInput.appendChild(sIcon);
  const sTxt = createText("Search applications, docs...", 12, "Regular", COLORS.textMuted);
  sTxt.x = 32; sTxt.y = 9;
  searchInput.appendChild(sTxt);
  headerBar.appendChild(searchInput);

  const bellBox = figma.createFrame();
  bellBox.x = 972; bellBox.y = 14; bellBox.resize(36, 36); bellBox.cornerRadius = 8;
  bellBox.fills = [{ type: 'SOLID', color: COLORS.borderLight }];
  const bIcon = await loadLucideIcon("bell", 18, COLORS.text);
  bIcon.x = 9; bIcon.y = 9;
  bellBox.appendChild(bIcon);
  headerBar.appendChild(bellBox);

  const ctaBtn = figma.createFrame();
  ctaBtn.x = 1018; ctaBtn.y = 14; ctaBtn.resize(158, 36); ctaBtn.cornerRadius = 8;
  ctaBtn.fills = [{ type: 'SOLID', color: COLORS.primary }];
  const upIcon = await loadLucideIcon("upload-cloud", 16, COLORS.surface, 2.0);
  upIcon.x = 12; upIcon.y = 10;
  ctaBtn.appendChild(upIcon);
  const ctaTxt = createText("Upload BGV Doc", 14, "Bold", COLORS.surface);
  ctaTxt.x = 34; ctaTxt.y = 9;
  ctaBtn.appendChild(ctaTxt);
  headerBar.appendChild(ctaBtn);

  // ───────────────────────────────────────────────────────────
  // HERO ACTIVE APPLICATION STEPPER CARD (Static X: 24, Y: 84)
  // ───────────────────────────────────────────────────────────
  const stepperCard = figma.createFrame();
  stepperCard.name = "Card / Active Application Stepper";
  stepperCard.x = 24; stepperCard.y = 84;
  stepperCard.resize(1152, 140);
  stepperCard.cornerRadius = 12;
  stepperCard.fills = [{ type: 'SOLID', color: COLORS.surface }];
  stepperCard.strokes = [{ type: 'SOLID', color: COLORS.border }];
  stepperCard.strokeWeight = 1;
  workspace.appendChild(stepperCard);

  const compLogo = figma.createFrame();
  compLogo.x = 24; compLogo.y = 20; compLogo.resize(44, 44); compLogo.cornerRadius = 10;
  compLogo.fills = [{ type: 'SOLID', color: COLORS.primaryLight }];
  const bldgIcon = await loadLucideIcon("building-2", 24, COLORS.primary, 2.0);
  bldgIcon.x = 10; bldgIcon.y = 10;
  compLogo.appendChild(bldgIcon);
  stepperCard.appendChild(compLogo);

  const appTitle = createText("Senior Full Stack Engineer", 16, "Bold", COLORS.text);
  appTitle.x = 80; appTitle.y = 20;
  stepperCard.appendChild(appTitle);

  const appMeta = createText("Hindustan Unilever Pvt. Ltd.  •  Demand ID: CND001  •  Full-Time", 12, "Regular", COLORS.textMuted);
  appMeta.x = 80; appMeta.y = 44;
  stepperCard.appendChild(appMeta);

  const appBadge = figma.createFrame();
  appBadge.x = 910; appBadge.y = 24; appBadge.resize(218, 28); appBadge.cornerRadius = 6;
  appBadge.fills = [{ type: 'SOLID', color: COLORS.warningBg }];
  const badgeTxt = createText("Action Needed: BGV Verification", 12, "Bold", COLORS.warning);
  badgeTxt.x = 12; badgeTxt.y = 6;
  appBadge.appendChild(badgeTxt);
  stepperCard.appendChild(appBadge);

  // Stepper Visual Progress Line (5 Steps)
  async function createStepNode(x, stepNum, label, status) {
    const group = figma.createFrame();
    group.x = x; group.y = 82; group.resize(120, 50); group.fills = [];

    const circle = figma.createFrame();
    circle.x = 46; circle.y = 0; circle.resize(28, 28); circle.cornerRadius = 9999;

    if (status === "completed") {
      circle.fills = [{ type: 'SOLID', color: COLORS.success }];
      const chk = await loadLucideIcon("check", 14, COLORS.surface, 2.5);
      chk.x = 7; chk.y = 7;
      circle.appendChild(chk);
    } else if (status === "active") {
      circle.fills = [{ type: 'SOLID', color: COLORS.primary }];
      circle.strokes = [{ type: 'SOLID', color: COLORS.primaryLight }];
      circle.strokeWeight = 3;
      const num = createText(String(stepNum), 12, "Bold", COLORS.surface);
      num.x = 10; num.y = 5;
      circle.appendChild(num);
    } else {
      circle.fills = [{ type: 'SOLID', color: COLORS.borderLight }];
      circle.strokes = [{ type: 'SOLID', color: COLORS.border }];
      circle.strokeWeight = 1;
      const num = createText(String(stepNum), 12, "Medium", COLORS.textMuted);
      num.x = 10; num.y = 5;
      circle.appendChild(num);
    }
    group.appendChild(circle);

    const lbl = createText(label, 12, status === "active" ? "Bold" : "Medium", status === "active" ? COLORS.primary : (status === "completed" ? COLORS.text : COLORS.textMuted));
    lbl.x = 10; lbl.y = 32;
    group.appendChild(lbl);

    return group;
  }

  stepperCard.appendChild(await createStepNode(24, 1, "Applied", "completed"));
  const line1 = figma.createFrame(); line1.x = 98; line1.y = 95; line1.resize(178, 2); line1.fills = [{ type: 'SOLID', color: COLORS.success }]; stepperCard.appendChild(line1);

  stepperCard.appendChild(await createStepNode(282, 2, "Screening", "completed"));
  const line2 = figma.createFrame(); line2.x = 356; line2.y = 95; line2.resize(184, 2); line2.fills = [{ type: 'SOLID', color: COLORS.success }]; stepperCard.appendChild(line2);

  stepperCard.appendChild(await createStepNode(546, 3, "Interview", "completed"));
  const line3 = figma.createFrame(); line3.x = 620; line3.y = 95; line3.resize(184, 2); line3.fills = [{ type: 'SOLID', color: COLORS.primary }]; stepperCard.appendChild(line3);

  stepperCard.appendChild(await createStepNode(810, 4, "BGV Verification", "active"));
  const line4 = figma.createFrame(); line4.x = 884; line4.y = 95; line4.resize(196, 2); line4.fills = [{ type: 'SOLID', color: COLORS.border }]; stepperCard.appendChild(line4);

  stepperCard.appendChild(await createStepNode(1080, 5, "Offer Released", "upcoming"));

  // ───────────────────────────────────────────────────────────
  // MAIN 2-COLUMN GRID (Static Y: 244)
  // ───────────────────────────────────────────────────────────

  // ═══════════════════════════════════════════════════════════
  // LEFT COLUMN (Static X: 24, Width: 724px)
  // ═══════════════════════════════════════════════════════════

  // CARD A: BGV Verification Checklist
  const bgvCard = figma.createFrame();
  bgvCard.name = "Card / BGV Verification Checklist";
  bgvCard.x = 24; bgvCard.y = 244;
  bgvCard.resize(724, 370);
  bgvCard.cornerRadius = 12;
  bgvCard.fills = [{ type: 'SOLID', color: COLORS.surface }];
  bgvCard.strokes = [{ type: 'SOLID', color: COLORS.border }];
  bgvCard.strokeWeight = 1;
  workspace.appendChild(bgvCard);

  const bgvTitle = createText("Background Verification (BGV) Checklist", 16, "Bold", COLORS.text);
  bgvTitle.x = 20; bgvTitle.y = 20;
  bgvCard.appendChild(bgvTitle);

  const bgvBadge = figma.createFrame();
  bgvBadge.x = 612; bgvBadge.y = 18; bgvBadge.resize(92, 24); bgvBadge.cornerRadius = 9999;
  bgvBadge.fills = [{ type: 'SOLID', color: COLORS.primaryLight }];
  const bgvBadgeTxt = createText("2 / 4 Verified", 10, "Bold", COLORS.primary);
  bgvBadgeTxt.x = 10; bgvBadgeTxt.y = 5;
  bgvBadge.appendChild(bgvBadgeTxt);
  bgvCard.appendChild(bgvBadge);

  async function createDocRow(y, docName, reqType, statusText, statusType, actionBtnLabel = null) {
    const docIconBox = figma.createFrame();
    docIconBox.x = 20; docIconBox.y = y; docIconBox.resize(36, 36); docIconBox.cornerRadius = 8;
    docIconBox.fills = [{ type: 'SOLID', color: COLORS.borderLight }];
    const icon = await loadLucideIcon("file-text", 18, COLORS.primary);
    icon.x = 9; icon.y = 9;
    docIconBox.appendChild(icon);
    bgvCard.appendChild(docIconBox);

    const nameTxt = createText(docName, 14, "Bold", COLORS.text);
    nameTxt.x = 68; nameTxt.y = y;
    bgvCard.appendChild(nameTxt);

    const formatTxt = createText(`Required Format: PDF / PNG  •  ${reqType}`, 12, "Regular", COLORS.textMuted);
    formatTxt.x = 68; formatTxt.y = y + 20;
    bgvCard.appendChild(formatTxt);

    const pill = figma.createFrame();
    pill.x = actionBtnLabel ? 478 : (statusType === "info" ? 580 : 612); pill.y = y + 4;
    pill.resize(actionBtnLabel ? 110 : (statusType === "info" ? 124 : 92), 28);
    pill.cornerRadius = 6;

    let bg = COLORS.successBg, fg = COLORS.success;
    if (statusType === "info") { bg = COLORS.infoBg; fg = COLORS.info; }
    if (statusType === "warning") { bg = COLORS.warningBg; fg = COLORS.warning; }

    pill.fills = [{ type: 'SOLID', color: bg }];
    const pTxt = createText(statusText, 10, "Bold", fg);
    pTxt.x = 10; pTxt.y = 6;
    pill.appendChild(pTxt);
    bgvCard.appendChild(pill);

    if (actionBtnLabel) {
      const btn = figma.createFrame();
      btn.x = 598; btn.y = y + 2; btn.resize(106, 32); btn.cornerRadius = 6;
      btn.fills = [{ type: 'SOLID', color: COLORS.primary }];
      const bTxt = createText(actionBtnLabel, 12, "Bold", COLORS.surface);
      bTxt.x = 18; bTxt.y = 7;
      btn.appendChild(bTxt);
      bgvCard.appendChild(btn);
    }
  }

  await createDocRow(58, "Government Issued Photo ID", "Mandatory", "Verified", "success");
  const d1 = figma.createFrame(); d1.x = 20; d1.y = 106; d1.resize(684, 1); d1.fills = [{ type: 'SOLID', color: COLORS.borderLight }]; bgvCard.appendChild(d1);

  await createDocRow(118, "Relieving & Experience Letter", "Mandatory", "Under Verification", "info");
  const d2 = figma.createFrame(); d2.x = 20; d2.y = 166; d2.resize(684, 1); d2.fills = [{ type: 'SOLID', color: COLORS.borderLight }]; bgvCard.appendChild(d2);

  await createDocRow(178, "Highest Educational Degree Certificate", "Mandatory", "Action Required", "warning", "Upload PDF");
  const d3 = figma.createFrame(); d3.x = 20; d3.y = 226; d3.resize(684, 1); d3.fills = [{ type: 'SOLID', color: COLORS.borderLight }]; bgvCard.appendChild(d3);

  await createDocRow(238, "Payslips (Last 3 Months)", "Mandatory", "Verified", "success");

  // CARD B: Application History
  const historyCard = figma.createFrame();
  historyCard.name = "Card / Application History";
  historyCard.x = 24; historyCard.y = 634;
  historyCard.resize(724, 230);
  historyCard.cornerRadius = 12;
  historyCard.fills = [{ type: 'SOLID', color: COLORS.surface }];
  historyCard.strokes = [{ type: 'SOLID', color: COLORS.border }];
  historyCard.strokeWeight = 1;
  workspace.appendChild(historyCard);

  const histTitle = createText("My Active Applications", 16, "Bold", COLORS.text);
  histTitle.x = 20; histTitle.y = 20;
  historyCard.appendChild(histTitle);

  async function createApplicationRow(y, role, company, date, statusText, statusType) {
    const iconBox = figma.createFrame();
    iconBox.x = 20; iconBox.y = y; iconBox.resize(36, 36); iconBox.cornerRadius = 8;
    iconBox.fills = [{ type: 'SOLID', color: COLORS.primaryLight }];
    const icon = await loadLucideIcon("briefcase", 18, COLORS.primary);
    icon.x = 9; icon.y = 9;
    iconBox.appendChild(icon);
    historyCard.appendChild(iconBox);

    const rTxt = createText(role, 14, "Bold", COLORS.text);
    rTxt.x = 68; rTxt.y = y;
    historyCard.appendChild(rTxt);

    const cTxt = createText(`${company}  •  Applied on ${date}`, 12, "Regular", COLORS.textMuted);
    cTxt.x = 68; cTxt.y = y + 20;
    historyCard.appendChild(cTxt);

    const pill = figma.createFrame();
    pill.x = statusType === "warning" ? 590 : 550; pill.y = y + 4;
    pill.resize(statusType === "warning" ? 84 : 124, 28);
    pill.cornerRadius = 6;
    pill.fills = [{ type: 'SOLID', color: statusType === "warning" ? COLORS.warningBg : COLORS.infoBg }];
    const pTxt = createText(statusText, 10, "Bold", statusType === "warning" ? COLORS.warning : COLORS.info);
    pTxt.x = 10; pTxt.y = 6;
    pill.appendChild(pTxt);
    historyCard.appendChild(pill);

    const arrowIcon = await loadLucideIcon("chevron-right", 16, COLORS.textMuted);
    arrowIcon.x = 684; arrowIcon.y = y + 10;
    historyCard.appendChild(arrowIcon);
  }

  await createApplicationRow(58, "Senior Full Stack Engineer", "Hindustan Unilever Pvt.", "01 Aug 2026", "BGV Stage", "warning");
  const hd1 = figma.createFrame(); hd1.x = 20; hd1.y = 106; hd1.resize(684, 1); hd1.fills = [{ type: 'SOLID', color: COLORS.borderLight }]; historyCard.appendChild(hd1);

  await createApplicationRow(118, "Lead React Developer", "TechCorp Systems", "24 Jul 2026", "Interview Cleared", "info");

  // ═══════════════════════════════════════════════════════════
  // RIGHT COLUMN (Static X: 768, Width: 408px)
  // ═══════════════════════════════════════════════════════════

  // CARD C: Upcoming Interview Call Widget
  const interviewCard = figma.createFrame();
  interviewCard.name = "Card / Upcoming Interview Widget";
  interviewCard.x = 768; interviewCard.y = 244;
  interviewCard.resize(408, 200);
  interviewCard.cornerRadius = 12;
  interviewCard.fills = [{ type: 'SOLID', color: COLORS.surface }];
  interviewCard.strokes = [{ type: 'SOLID', color: COLORS.primaryLight }];
  interviewCard.strokeWeight = 1;
  workspace.appendChild(interviewCard);

  const intTitle = createText("Upcoming Interview", 16, "Bold", COLORS.text);
  intTitle.x = 18; intTitle.y = 18;
  interviewCard.appendChild(intTitle);

  const liveBadge = figma.createFrame();
  liveBadge.x = 268; liveBadge.y = 18; liveBadge.resize(122, 24); liveBadge.cornerRadius = 6;
  liveBadge.fills = [{ type: 'SOLID', color: COLORS.primaryLight }];
  const lbTxt = createText("Today • 02:30 PM", 10, "Bold", COLORS.primary);
  lbTxt.x = 10; lbTxt.y = 4;
  liveBadge.appendChild(lbTxt);
  interviewCard.appendChild(liveBadge);

  const meetBox = figma.createFrame();
  meetBox.x = 18; meetBox.y = 52; meetBox.resize(372, 64); meetBox.cornerRadius = 8;
  meetBox.fills = [{ type: 'SOLID', color: COLORS.borderLight }];
  interviewCard.appendChild(meetBox);

  const mbTitle = createText("Final System Design & Technical Sync", 14, "Bold", COLORS.text);
  mbTitle.x = 14; mbTitle.y = 10;
  meetBox.appendChild(mbTitle);

  const mbSub = createText("Interviewer: Samson Roy (Engineering Lead)", 12, "Regular", COLORS.textMuted);
  mbSub.x = 14; mbSub.y = 34;
  meetBox.appendChild(mbSub);

  const joinBtn = figma.createFrame();
  joinBtn.x = 18; joinBtn.y = 130; joinBtn.resize(372, 40); joinBtn.cornerRadius = 8;
  joinBtn.fills = [{ type: 'SOLID', color: COLORS.primary }];
  const vidIcon = await loadLucideIcon("video", 16, COLORS.surface, 2.0);
  vidIcon.x = 100; vidIcon.y = 12;
  joinBtn.appendChild(vidIcon);
  const jTxt = createText("Join Google Meet Call", 14, "Bold", COLORS.surface);
  jTxt.x = 124; jTxt.y = 10;
  joinBtn.appendChild(jTxt);
  interviewCard.appendChild(joinBtn);

  // CARD D: Assigned Talent Recruiter Contact
  const recruiterCard = figma.createFrame();
  recruiterCard.name = "Card / Assigned Recruiter";
  recruiterCard.x = 768; recruiterCard.y = 464;
  recruiterCard.resize(408, 180);
  recruiterCard.cornerRadius = 12;
  recruiterCard.fills = [{ type: 'SOLID', color: COLORS.surface }];
  recruiterCard.strokes = [{ type: 'SOLID', color: COLORS.border }];
  recruiterCard.strokeWeight = 1;
  workspace.appendChild(recruiterCard);

  const recTitle = createText("Assigned Talent Partner", 16, "Bold", COLORS.text);
  recTitle.x = 18; recTitle.y = 18;
  recruiterCard.appendChild(recTitle);

  const recAvatar = figma.createFrame();
  recAvatar.x = 18; recAvatar.y = 50; recAvatar.resize(40, 40); recAvatar.cornerRadius = 9999;
  await applyOnlineImage(recAvatar, "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", "AS");
  recruiterCard.appendChild(recAvatar);

  const recName = createText("Anshul Sharma", 14, "Bold", COLORS.text);
  recName.x = 68; recName.y = 50;
  recruiterCard.appendChild(recName);

  const recRole = createText("Senior Talent Acquisition Lead", 12, "Regular", COLORS.textMuted);
  recRole.x = 68; recRole.y = 70;
  recruiterCard.appendChild(recRole);

  const msgBtn = figma.createFrame();
  msgBtn.x = 18; msgBtn.y = 114; msgBtn.resize(180, 36); msgBtn.cornerRadius = 8;
  msgBtn.fills = [{ type: 'SOLID', color: COLORS.borderLight }];
  const mIcon = await loadLucideIcon("message-square", 16, COLORS.text);
  mIcon.x = 36; mIcon.y = 10;
  msgBtn.appendChild(mIcon);
  const mTxt = createText("Send Message", 12, "Bold", COLORS.text);
  mTxt.x = 58; mTxt.y = 9;
  msgBtn.appendChild(mTxt);
  recruiterCard.appendChild(msgBtn);

  const callBtn = figma.createFrame();
  callBtn.x = 210; callBtn.y = 114; callBtn.resize(180, 36); callBtn.cornerRadius = 8;
  callBtn.fills = [{ type: 'SOLID', color: COLORS.borderLight }];
  const cIcon = await loadLucideIcon("phone", 16, COLORS.text);
  cIcon.x = 42; cIcon.y = 10;
  callBtn.appendChild(cIcon);
  const cTxt = createText("Call Recruiter", 12, "Bold", COLORS.text);
  cTxt.x = 64; cTxt.y = 9;
  callBtn.appendChild(cTxt);
  recruiterCard.appendChild(callBtn);

  // CARD E: Profile Completion Meter
  const meterCard = figma.createFrame();
  meterCard.name = "Card / Profile Completion";
  meterCard.x = 768; meterCard.y = 664;
  meterCard.resize(408, 140);
  meterCard.cornerRadius = 12;
  meterCard.fills = [{ type: 'SOLID', color: COLORS.surface }];
  meterCard.strokes = [{ type: 'SOLID', color: COLORS.border }];
  meterCard.strokeWeight = 1;
  workspace.appendChild(meterCard);

  const meterTitle = createText("Profile Completion", 14, "Bold", COLORS.text);
  meterTitle.x = 18; meterTitle.y = 18;
  meterCard.appendChild(meterTitle);

  const meterVal = createText("85%", 14, "Bold", COLORS.primary);
  meterVal.x = 354; meterVal.y = 18;
  meterCard.appendChild(meterVal);

  const pTrack = figma.createFrame();
  pTrack.x = 18; pTrack.y = 46; pTrack.resize(372, 8); pTrack.cornerRadius = 9999;
  pTrack.fills = [{ type: 'SOLID', color: COLORS.borderLight }];
  meterCard.appendChild(pTrack);

  const pFill = figma.createFrame();
  pFill.x = 0; pFill.y = 0; pFill.resize(316, 8); pFill.cornerRadius = 9999;
  pFill.fills = [{ type: 'SOLID', color: COLORS.primary }];
  pTrack.appendChild(pFill);

  const pSub = createText("Complete remaining items to speed up background verification", 12, "Regular", COLORS.textMuted);
  pSub.x = 18; pSub.y = 68;
  meterCard.appendChild(pSub);

  // 7. Viewport Focus & Zoom
  figma.viewport.scrollAndZoomIntoView([rootContainer]);

  console.log("Candidate Dashboard screen (@skip-autolayout) generated successfully!");
})(figma);
