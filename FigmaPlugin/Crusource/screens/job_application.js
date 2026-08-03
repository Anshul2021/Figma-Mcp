// Generated Figma Script: Crusource Candidate Job Application Workspace (Zero Emoji Rule)
// Project: Crusource
// File: Crusource/screens/job_application.js
// Compliance: Instrument Sans font, Crusource Orange (#FF7700), Slate Text Scale (#0F172A, #334155), Vector Lucide Icons, Zero Emojis.

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

  // ── 2. Vector Lucide Icon Helper ──
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

  function createInputField(label, placeholder, value = "") {
    const container = figma.createFrame();
    container.name = `FormField / ${label}`;
    container.layoutMode = "VERTICAL";
    container.itemSpacing = 6;
    container.primaryAxisSizingMode = "AUTO";
    container.counterAxisSizingMode = "AUTO";

    const lbl = createText(label, 12, "Medium", COLOR_TEXT_HEAD);
    container.appendChild(lbl);

    const input = figma.createFrame();
    input.name = "InputBox";
    input.layoutMode = "HORIZONTAL";
    input.paddingLeft = 12; input.paddingRight = 12;
    input.paddingTop = 10; input.paddingBottom = 10;
    input.itemSpacing = 8;
    input.cornerRadius = 6;
    input.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
    input.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
    input.primaryAxisAlignItems = "MIN";
    input.counterAxisAlignItems = "CENTER";
    input.resize(380, 40);
    input.primaryAxisSizingMode = "FIXED";
    input.counterAxisSizingMode = "FIXED";

    const valTxt = createText(value || placeholder, 14, "Regular", value ? COLOR_TEXT_HEAD : COLOR_TEXT_MUTED);
    input.appendChild(valTxt);
    valTxt.layoutSizingHorizontal = "FILL";

    container.appendChild(input);
    input.layoutSizingHorizontal = "FILL";
    return container;
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
    item.appendChild(createText(textLabel, 12, "Medium", COLOR_TEXT_MUTED));
    return item;
  }

  // Remove existing screen if present
  const existingScreen = figma.currentPage.findChild(n => n.name === "Screen / Crusource Job Application");
  if (existingScreen) existingScreen.remove();

  // ── 3. Main Viewport Container (1440x900) ──
  const screen = figma.createFrame();
  screen.name = "Screen / Crusource Job Application";
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

  // Left Section
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

  leftHeader.appendChild(createText("Careers  /  Open Positions  /  Senior Frontend Engineer", 12, "Medium", COLOR_TEXT_MUTED));
  topNav.appendChild(leftHeader);

  // Right Section
  const rightHeader = figma.createFrame();
  rightHeader.name = "RightHeader";
  rightHeader.layoutMode = "HORIZONTAL";
  rightHeader.itemSpacing = 12;
  rightHeader.counterAxisAlignItems = "CENTER";
  rightHeader.primaryAxisSizingMode = "AUTO";
  rightHeader.counterAxisSizingMode = "AUTO";

  rightHeader.appendChild(createBadge("Draft Saved • 10:42 AM", COLOR_BORDER_LIGHT, COLOR_TEXT_MUTED));

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

  // ── 5. Main Dual-Column Body (840px height) ──
  const mainContent = figma.createFrame();
  mainContent.name = "MainBody / DualColumn";
  mainContent.layoutMode = "HORIZONTAL";
  mainContent.paddingLeft = 32; mainContent.paddingRight = 32;
  mainContent.paddingTop = 24; mainContent.paddingBottom = 24;
  mainContent.itemSpacing = 24;
  mainContent.resize(1440, 840);
  mainContent.primaryAxisSizingMode = "FIXED";
  mainContent.counterAxisSizingMode = "FIXED";

  // ── 5A. LEFT COLUMN (Width 400px) ──
  const leftCol = figma.createFrame();
  leftCol.name = "LeftCol / JobOverview";
  leftCol.layoutMode = "VERTICAL";
  leftCol.itemSpacing = 16;
  leftCol.resize(400, 790);
  leftCol.primaryAxisSizingMode = "FIXED";
  leftCol.counterAxisSizingMode = "FIXED";

  // Job Details Card
  const jobCard = figma.createFrame();
  jobCard.name = "Card / JobDetails";
  jobCard.layoutMode = "VERTICAL";
  jobCard.paddingLeft = 20; jobCard.paddingRight = 20;
  jobCard.paddingTop = 20; jobCard.paddingBottom = 20;
  jobCard.itemSpacing = 12;
  jobCard.cornerRadius = 12;
  jobCard.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  jobCard.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  jobCard.primaryAxisSizingMode = "AUTO";
  jobCard.counterAxisSizingMode = "AUTO";

  jobCard.appendChild(createText("Senior Frontend Engineer", 20, "Bold", COLOR_TEXT_HEAD));

  const deptBadgeRow = figma.createFrame();
  deptBadgeRow.name = "DeptBadgeRow";
  deptBadgeRow.layoutMode = "HORIZONTAL";
  deptBadgeRow.itemSpacing = 6;
  deptBadgeRow.primaryAxisSizingMode = "AUTO";
  deptBadgeRow.counterAxisSizingMode = "AUTO";
  deptBadgeRow.appendChild(createBadge("Engineering", COLOR_PRIMARY_TINT, COLOR_PRIMARY));
  deptBadgeRow.appendChild(createBadge("Full Time", COLOR_BORDER_LIGHT, COLOR_TEXT_BODY));
  deptBadgeRow.appendChild(createBadge("Remote (US/EU)", COLOR_SUCCESS_BG, COLOR_SUCCESS));
  jobCard.appendChild(deptBadgeRow);

  const locRow = figma.createFrame();
  locRow.name = "InfoRow";
  locRow.layoutMode = "HORIZONTAL";
  locRow.itemSpacing = 16;
  locRow.primaryAxisSizingMode = "AUTO";
  locRow.counterAxisSizingMode = "AUTO";
  locRow.appendChild(await createMetaItem("map-pin", "San Francisco, CA"));
  locRow.appendChild(await createMetaItem("dollar-sign", "$140,000 - $180,000 / yr"));
  jobCard.appendChild(locRow);

  const divider1 = figma.createFrame();
  divider1.name = "Divider";
  divider1.resize(360, 1);
  divider1.fills = [{ type: 'SOLID', color: COLOR_BORDER_LIGHT }];
  jobCard.appendChild(divider1);

  jobCard.appendChild(createText("Key Expectations:", 12, "Bold", COLOR_TEXT_HEAD));
  jobCard.appendChild(createText("• 5+ years building scale React/TypeScript apps", 12, "Regular", COLOR_TEXT_BODY));
  jobCard.appendChild(createText("• Experience with Figma Plugin API & Webviews", 12, "Regular", COLOR_TEXT_BODY));
  jobCard.appendChild(createText("• Passion for design systems & micro-interactions", 12, "Regular", COLOR_TEXT_BODY));

  leftCol.appendChild(jobCard);
  jobCard.layoutSizingHorizontal = "FILL";

  // Application Stepper Progress Card
  const stepperCard = figma.createFrame();
  stepperCard.name = "Card / ProgressStepper";
  stepperCard.layoutMode = "VERTICAL";
  stepperCard.paddingLeft = 20; stepperCard.paddingRight = 20;
  stepperCard.paddingTop = 20; stepperCard.paddingBottom = 20;
  stepperCard.itemSpacing = 16;
  stepperCard.cornerRadius = 12;
  stepperCard.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  stepperCard.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  stepperCard.primaryAxisSizingMode = "AUTO";
  stepperCard.counterAxisSizingMode = "AUTO";

  stepperCard.appendChild(createText("Application Progress", 14, "Bold", COLOR_TEXT_HEAD));

  async function createStepItem(num, label, isDone, isActive) {
    const row = figma.createFrame();
    row.name = `StepRow_${num}`;
    row.layoutMode = "HORIZONTAL";
    row.itemSpacing = 12;
    row.counterAxisAlignItems = "CENTER";
    row.primaryAxisSizingMode = "AUTO";
    row.counterAxisSizingMode = "AUTO";

    if (isDone) {
      row.appendChild(await loadLucideIcon("check-circle-2", 20, COLOR_SUCCESS, 2.0));
    } else {
      const badgeNode = figma.createFrame();
      badgeNode.resize(20, 20);
      badgeNode.cornerRadius = 10;
      badgeNode.layoutMode = "HORIZONTAL";
      badgeNode.primaryAxisAlignItems = "CENTER";
      badgeNode.counterAxisAlignItems = "CENTER";
      if (isActive) {
        badgeNode.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
        badgeNode.appendChild(createText(`${num}`, 10, "Bold", COLOR_SURFACE));
      } else {
        badgeNode.fills = [{ type: 'SOLID', color: COLOR_BORDER_LIGHT }];
        badgeNode.appendChild(createText(`${num}`, 10, "Medium", COLOR_TEXT_MUTED));
      }
      row.appendChild(badgeNode);
    }

    row.appendChild(createText(label, 13, isActive ? "Bold" : (isDone ? "Medium" : "Regular"), isActive ? COLOR_PRIMARY : (isDone ? COLOR_TEXT_HEAD : COLOR_TEXT_MUTED)));
    return row;
  }

  stepperCard.appendChild(await createStepItem(1, "Personal Information", true, false));
  stepperCard.appendChild(await createStepItem(2, "Experience & Application Documents", false, true));
  stepperCard.appendChild(await createStepItem(3, "Screening Questions", false, false));
  stepperCard.appendChild(await createStepItem(4, "Review & Submit", false, false));

  leftCol.appendChild(stepperCard);
  stepperCard.layoutSizingHorizontal = "FILL";

  mainContent.appendChild(leftCol);

  // ── 5B. RIGHT COLUMN: Form Workstation (Width 940px) ──
  const rightCol = figma.createFrame();
  rightCol.name = "RightCol / ApplicationForm";
  rightCol.layoutMode = "VERTICAL";
  rightCol.paddingLeft = 28; rightCol.paddingRight = 28;
  rightCol.paddingTop = 24; rightCol.paddingBottom = 24;
  rightCol.itemSpacing = 20;
  rightCol.cornerRadius = 16;
  rightCol.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  rightCol.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  rightCol.resize(940, 790);
  rightCol.primaryAxisSizingMode = "FIXED";
  rightCol.counterAxisSizingMode = "FIXED";

  // Section Header
  const formHeader = figma.createFrame();
  formHeader.name = "FormHeader";
  formHeader.layoutMode = "VERTICAL";
  formHeader.itemSpacing = 4;
  formHeader.primaryAxisSizingMode = "AUTO";
  formHeader.counterAxisSizingMode = "AUTO";

  formHeader.appendChild(createText("STEP 2 OF 4", 10, "Bold", COLOR_PRIMARY));
  formHeader.appendChild(createText("Experience & Application Documents", 24, "Bold", COLOR_TEXT_HEAD));
  formHeader.appendChild(createText("Please provide your background details, resume, and portfolio links.", 14, "Regular", COLOR_TEXT_MUTED));
  rightCol.appendChild(formHeader);
  formHeader.layoutSizingHorizontal = "FILL";

  // Form Row 1: Name & Email
  const row1 = figma.createFrame();
  row1.name = "FormRow_1";
  row1.layoutMode = "HORIZONTAL";
  row1.itemSpacing = 16;
  row1.primaryAxisSizingMode = "AUTO";
  row1.counterAxisSizingMode = "AUTO";

  const nameField = createInputField("Full Name", "e.g. Anshul Rawat", "Anshul Rawat");
  const emailField = createInputField("Email Address", "e.g. anshul@example.com", "anshul.rawat@crusource.com");
  row1.appendChild(nameField);
  row1.appendChild(emailField);
  rightCol.appendChild(row1);
  row1.layoutSizingHorizontal = "FILL";
  nameField.layoutSizingHorizontal = "FILL";
  emailField.layoutSizingHorizontal = "FILL";

  // Form Row 2: Phone & Portfolio
  const row2 = figma.createFrame();
  row2.name = "FormRow_2";
  row2.layoutMode = "HORIZONTAL";
  row2.itemSpacing = 16;
  row2.primaryAxisSizingMode = "AUTO";
  row2.counterAxisSizingMode = "AUTO";

  const phoneField = createInputField("Phone Number", "+1 (555) 000-0000", "+1 (415) 890-1234");
  const portfolioField = createInputField("Portfolio / GitHub URL", "https://github.com/...", "https://github.com/anshulrawat");
  row2.appendChild(phoneField);
  row2.appendChild(portfolioField);
  rightCol.appendChild(row2);
  row2.layoutSizingHorizontal = "FILL";
  phoneField.layoutSizingHorizontal = "FILL";
  portfolioField.layoutSizingHorizontal = "FILL";

  // Upload Resume Box Card
  const uploadCard = figma.createFrame();
  uploadCard.name = "UploadBox / Resume";
  uploadCard.layoutMode = "VERTICAL";
  uploadCard.paddingLeft = 20; uploadCard.paddingRight = 20;
  uploadCard.paddingTop = 18; uploadCard.paddingBottom = 18;
  uploadCard.itemSpacing = 12;
  uploadCard.cornerRadius = 8;
  uploadCard.fills = [{ type: 'SOLID', color: COLOR_BG }];
  uploadCard.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  uploadCard.primaryAxisAlignItems = "CENTER";
  uploadCard.counterAxisAlignItems = "CENTER";
  uploadCard.primaryAxisSizingMode = "AUTO";
  uploadCard.counterAxisSizingMode = "AUTO";

  uploadCard.appendChild(createText("Attach Your Resume / CV *", 12, "Bold", COLOR_TEXT_HEAD));

  // Uploaded File Status Box
  const fileStatus = figma.createFrame();
  fileStatus.name = "FileStatusBox";
  fileStatus.layoutMode = "HORIZONTAL";
  fileStatus.paddingLeft = 14; fileStatus.paddingRight = 14;
  fileStatus.paddingTop = 10; fileStatus.paddingBottom = 10;
  fileStatus.itemSpacing = 12;
  fileStatus.cornerRadius = 6;
  fileStatus.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  fileStatus.strokes = [{ type: 'SOLID', color: COLOR_SUCCESS }];
  fileStatus.counterAxisAlignItems = "CENTER";
  fileStatus.primaryAxisSizingMode = "AUTO";
  fileStatus.counterAxisSizingMode = "AUTO";

  const pdfBadge = figma.createFrame();
  pdfBadge.resize(24, 24);
  pdfBadge.cornerRadius = 4;
  pdfBadge.fills = [{ type: 'SOLID', color: COLOR_PRIMARY_TINT }];
  pdfBadge.layoutMode = "HORIZONTAL";
  pdfBadge.primaryAxisAlignItems = "CENTER"; pdfBadge.counterAxisAlignItems = "CENTER";
  pdfBadge.appendChild(createText("PDF", 10, "Bold", COLOR_PRIMARY));
  fileStatus.appendChild(pdfBadge);

  const fileMeta = figma.createFrame();
  fileMeta.name = "FileMetaInfo";
  fileMeta.layoutMode = "VERTICAL";
  fileMeta.itemSpacing = 2;
  fileMeta.primaryAxisSizingMode = "AUTO";
  fileMeta.counterAxisSizingMode = "AUTO";
  fileMeta.appendChild(createText("Anshul_Rawat_Resume_2026.pdf", 12, "Bold", COLOR_TEXT_HEAD));
  fileMeta.appendChild(createText("Uploaded • 2.4 MB • 100% Complete", 10, "Medium", COLOR_SUCCESS));
  fileStatus.appendChild(fileMeta);
  fileMeta.layoutSizingHorizontal = "FILL";

  fileStatus.appendChild(createText("Replace", 12, "Bold", COLOR_PRIMARY));

  uploadCard.appendChild(fileStatus);
  fileStatus.layoutSizingHorizontal = "FILL";

  rightCol.appendChild(uploadCard);
  uploadCard.layoutSizingHorizontal = "FILL";

  // Additional Cover Letter Field
  const coverLetterContainer = createInputField("Cover Letter / Additional Notes (Optional)", "Tell us why you are a great fit for Crusource...", "I am excited to apply for the Senior Frontend Engineer position at Crusource. With over 6 years of experience building high-performance design tool extensions...");
  rightCol.appendChild(coverLetterContainer);
  coverLetterContainer.layoutSizingHorizontal = "FILL";

  // Footer Actions Bar
  const footerBar = figma.createFrame();
  footerBar.name = "FooterActions";
  footerBar.layoutMode = "HORIZONTAL";
  footerBar.paddingTop = 16;
  footerBar.strokes = [{ type: 'SOLID', color: COLOR_BORDER_LIGHT }];
  footerBar.strokeWeight = 1;
  footerBar.primaryAxisAlignItems = "SPACE_BETWEEN";
  footerBar.counterAxisAlignItems = "CENTER";
  footerBar.primaryAxisSizingMode = "AUTO";
  footerBar.counterAxisSizingMode = "AUTO";

  // Back Button
  const backBtn = figma.createFrame();
  backBtn.name = "Button / Back";
  backBtn.layoutMode = "HORIZONTAL";
  backBtn.paddingLeft = 16; backBtn.paddingRight = 16;
  backBtn.paddingTop = 10; backBtn.paddingBottom = 10;
  backBtn.itemSpacing = 8;
  backBtn.cornerRadius = 6;
  backBtn.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  backBtn.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  backBtn.primaryAxisSizingMode = "AUTO";
  backBtn.counterAxisSizingMode = "AUTO";
  backBtn.appendChild(await loadLucideIcon("arrow-left", 14, COLOR_TEXT_BODY));
  backBtn.appendChild(createText("Back to Personal Info", 12, "Bold", COLOR_TEXT_BODY));
  footerBar.appendChild(backBtn);

  // Right Actions
  const rightActions = figma.createFrame();
  rightActions.name = "RightActions";
  rightActions.layoutMode = "HORIZONTAL";
  rightActions.itemSpacing = 12;
  rightActions.primaryAxisSizingMode = "AUTO";
  rightActions.counterAxisSizingMode = "AUTO";

  const saveDraftBtn = figma.createFrame();
  saveDraftBtn.name = "Button / SaveDraft";
  saveDraftBtn.layoutMode = "HORIZONTAL";
  saveDraftBtn.paddingLeft = 16; saveDraftBtn.paddingRight = 16;
  saveDraftBtn.paddingTop = 10; saveDraftBtn.paddingBottom = 10;
  saveDraftBtn.cornerRadius = 6;
  saveDraftBtn.fills = [{ type: 'SOLID', color: COLOR_BG }];
  saveDraftBtn.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  saveDraftBtn.primaryAxisSizingMode = "AUTO";
  saveDraftBtn.counterAxisSizingMode = "AUTO";
  saveDraftBtn.appendChild(createText("Save Draft", 12, "Bold", COLOR_TEXT_HEAD));
  rightActions.appendChild(saveDraftBtn);

  const submitBtn = figma.createFrame();
  submitBtn.name = "Button / Continue";
  submitBtn.layoutMode = "HORIZONTAL";
  submitBtn.paddingLeft = 20; submitBtn.paddingRight = 20;
  submitBtn.paddingTop = 10; submitBtn.paddingBottom = 10;
  submitBtn.itemSpacing = 8;
  submitBtn.cornerRadius = 6;
  submitBtn.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
  submitBtn.primaryAxisSizingMode = "AUTO";
  submitBtn.counterAxisSizingMode = "AUTO";
  submitBtn.appendChild(createText("Continue to Screening Questions", 12, "Bold", COLOR_SURFACE));
  submitBtn.appendChild(await loadLucideIcon("arrow-right", 14, COLOR_SURFACE));
  rightActions.appendChild(submitBtn);

  footerBar.appendChild(rightActions);

  rightCol.appendChild(footerBar);
  footerBar.layoutSizingHorizontal = "FILL";

  mainContent.appendChild(rightCol);

  screen.appendChild(mainContent);

  // ── 6. Scroll & Zoom into View ──
  figma.currentPage.appendChild(screen);
  figma.viewport.scrollAndZoomIntoView([screen]);
  figma.notify("Updated Job Application screen with zero text emojis & vector Lucide icons!", { timeout: 2500 });

})(figma);
