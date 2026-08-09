(async () => {
  // 1. Load Required Fonts (DM Sans)
  await figma.loadFontAsync({ family: "DM Sans", style: "Regular" });
  await figma.loadFontAsync({ family: "DM Sans", style: "Medium" });
  await figma.loadFontAsync({ family: "DM Sans", style: "Bold" });

  // 2. Color System Definition
  const COLORS = {
    textDark: { r: 0.059, g: 0.090, b: 0.165 },     // #0F172A Headings & handles
    textMuted: { r: 0.392, g: 0.455, b: 0.545 },    // #64748B Subtitles
    searchBg: { r: 0.953, g: 0.957, b: 0.965 },     // #F3F4F6 Pill & input fill
    borderLight: { r: 0.886, g: 0.910, b: 0.941 },  // #E2E8F0 Subtle border
    white: { r: 1, g: 1, b: 1 },
    verifiedBlue: { r: 0.0, g: 0.584, b: 0.965 },   // #0095F6 Action Blue
    verifiedBlueHover: { r: 0.0, g: 0.500, b: 0.850 },
    likeRed: { r: 0.929, g: 0.286, b: 0.337 },        // #ED4956 Heart Red
    storyRingPink: { r: 0.882, g: 0.188, b: 0.424 }, // #E1306C Story border
    closeFriendsGreen: { r: 0.063, g: 0.725, b: 0.506 },
    disabledBg: { r: 0.90, g: 0.91, b: 0.93 },
    disabledText: { r: 0.60, g: 0.65, b: 0.70 }
  };

  // 3. Icon Helper via Lucide SVG
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

  function createText(content, fontSize, fontStyle = "Regular", color = COLORS.textDark) {
    const text = figma.createText();
    text.fontName = { family: "DM Sans", style: fontStyle };
    text.fontSize = fontSize; // EVEN numbers only
    text.characters = String(content);
    text.fills = [{ type: 'SOLID', color }];
    return text;
  }

  // Helper function to set STRETCH fill behavior safely
  function setFullWidthFill(child) {
    child.layoutAlign = "STRETCH";
    try { child.layoutSizingHorizontal = "FILL"; } catch (e) {}
  }

  // ==================================================================
  // MASTER DESIGN SYSTEM BOARD (FULL-WIDTH 1180px AUTO LAYOUT FIX)
  // ==================================================================

  const board = figma.createFrame();
  board.name = "Instagram_Design_System_Board";
  board.resize(1180, 1100);
  board.fills = [{ type: 'SOLID', color: { r: 0.976, g: 0.980, b: 0.984 } }];
  
  // Set layout mode FIRST
  board.layoutMode = "VERTICAL";
  board.paddingLeft = 32; board.paddingRight = 32; board.paddingTop = 32; board.paddingBottom = 32;
  board.itemSpacing = 28;

  // Set Sizing Modes AFTER resize() to enforce 1180px fixed width & HUG height
  board.resize(1180, 1);
  board.counterAxisSizingMode = "FIXED";   // Width FIXED at 1180px
  board.primaryAxisSizingMode = "AUTO";    // Height HUG content

  // Title Header Bar
  const headerRow = figma.createFrame();
  headerRow.name = "DS_Header"; headerRow.layoutMode = "VERTICAL"; headerRow.fills = []; headerRow.itemSpacing = 4;
  board.appendChild(headerRow);
  setFullWidthFill(headerRow);
  headerRow.appendChild(createText("Instagram Master Design System & Token Matrix", 24, "Bold", COLORS.textDark));
  headerRow.appendChild(createText("Published native variables (Colors, Spacing, Radii), typography styles, and interactive ComponentSets", 14, "Regular", COLORS.textMuted));

  // ------------------------------------------------------------------
  // PILLAR 1: COLOR SWATCHES & NUMBER TOKENS (SPACING & RADII)
  // ------------------------------------------------------------------
  const tokenSection = figma.createFrame();
  tokenSection.name = "Pillar_1_Tokens_Matrix"; tokenSection.layoutMode = "VERTICAL"; tokenSection.fills = []; tokenSection.itemSpacing = 16;
  board.appendChild(tokenSection);
  setFullWidthFill(tokenSection);

  tokenSection.appendChild(createText("🎨 1. Published Native Tokens (Colors, Spacing & Radii)", 16, "Bold", COLORS.textDark));

  // Color Swatches Row
  const colorRow = figma.createFrame();
  colorRow.name = "Color_Swatches_Row"; colorRow.layoutMode = "HORIZONTAL"; colorRow.fills = []; colorRow.itemSpacing = 12;
  tokenSection.appendChild(colorRow);
  setFullWidthFill(colorRow);

  const swatches = [
    { name: "Brand Pink", hex: "#E1306C", color: COLORS.storyRingPink },
    { name: "Verified Blue", hex: "#0095F6", color: COLORS.verifiedBlue },
    { name: "Like Red", hex: "#ED4956", color: COLORS.likeRed },
    { name: "Text Dark", hex: "#0F172A", color: COLORS.textDark },
    { name: "Text Muted", hex: "#64748B", color: COLORS.textMuted },
    { name: "Search Fill", hex: "#F3F4F6", color: COLORS.searchBg },
    { name: "Border Light", hex: "#E2E8F0", color: COLORS.borderLight },
    { name: "Active Green", hex: "#10B981", color: COLORS.closeFriendsGreen }
  ];

  for (const s of swatches) {
    const card = figma.createFrame();
    card.name = `Swatch_${s.name}`; card.layoutMode = "VERTICAL"; card.resize(120, 84); card.cornerRadius = 8;
    card.fills = [{ type: 'SOLID', color: COLORS.white }];
    card.strokes = [{ type: 'SOLID', color: COLORS.borderLight }]; card.strokeWeight = 1;
    card.paddingLeft = 8; card.paddingRight = 8; card.paddingTop = 8; card.paddingBottom = 8; card.itemSpacing = 4;

    const fillBox = figma.createFrame(); fillBox.name = "Box"; fillBox.resize(104, 36); fillBox.cornerRadius = 4;
    fillBox.fills = [{ type: 'SOLID', color: s.color }];
    card.appendChild(fillBox);
    card.appendChild(createText(s.name, 10, "Bold", COLORS.textDark));
    card.appendChild(createText(s.hex, 10, "Regular", COLORS.textMuted));
    colorRow.appendChild(card);
  }

  // Spacing & Radii Display Card
  const numberTokenCard = figma.createFrame();
  numberTokenCard.name = "Spacing_Radii_Tokens"; numberTokenCard.layoutMode = "HORIZONTAL";
  numberTokenCard.fills = [{ type: 'SOLID', color: COLORS.white }]; numberTokenCard.cornerRadius = 8;
  numberTokenCard.strokes = [{ type: 'SOLID', color: COLORS.borderLight }]; numberTokenCard.strokeWeight = 1;
  numberTokenCard.paddingLeft = 16; numberTokenCard.paddingRight = 16; numberTokenCard.paddingTop = 14; numberTokenCard.paddingBottom = 14;
  numberTokenCard.itemSpacing = 32; numberTokenCard.counterAxisAlignItems = "CENTER";
  tokenSection.appendChild(numberTokenCard);
  setFullWidthFill(numberTokenCard);

  numberTokenCard.appendChild(createText("Spacing Tokens: xs (4px) • sm (8px) • md (12px) • lg (16px) • xl (24px) • 2xl (32px)", 12, "Medium", COLORS.textDark));
  numberTokenCard.appendChild(createText("Corner Radii Tokens: xs (4px) • sm (6px) • md (8px) • lg (12px) • xl (16px) • full (999px)", 12, "Medium", COLORS.textDark));

  // ------------------------------------------------------------------
  // PILLAR 2: TYPOGRAPHY SCALE SPECIMENS
  // ------------------------------------------------------------------
  const typeSection = figma.createFrame();
  typeSection.name = "Pillar_2_Typography_Scale"; typeSection.layoutMode = "VERTICAL"; typeSection.fills = []; typeSection.itemSpacing = 12;
  board.appendChild(typeSection);
  setFullWidthFill(typeSection);

  typeSection.appendChild(createText("🔤 2. Typography Scale System (DM Sans)", 16, "Bold", COLORS.textDark));

  const typeCard = figma.createFrame();
  typeCard.name = "Typography_Card"; typeCard.layoutMode = "VERTICAL";
  typeCard.fills = [{ type: 'SOLID', color: COLORS.white }]; typeCard.cornerRadius = 12;
  typeCard.strokes = [{ type: 'SOLID', color: COLORS.borderLight }]; typeCard.strokeWeight = 1;
  typeCard.paddingLeft = 20; typeCard.paddingRight = 20; typeCard.paddingTop = 16; typeCard.paddingBottom = 16; typeCard.itemSpacing = 10;
  typeSection.appendChild(typeCard);
  setFullWidthFill(typeCard);

  const typeSpecimens = [
    { label: "Hero / 32px", size: 32, weight: "Bold" },
    { label: "Heading / 24px", size: 24, weight: "Bold" },
    { label: "Title / 20px", size: 20, weight: "Bold" },
    { label: "Subhead / 16px", size: 16, weight: "Bold" },
    { label: "Body / 14px", size: 14, weight: "Regular" },
    { label: "Caption / 12px", size: 12, weight: "Regular" },
    { label: "Micro / 10px", size: 10, weight: "Medium" }
  ];

  for (const ts of typeSpecimens) {
    const row = figma.createFrame();
    row.name = ts.label; row.layoutMode = "HORIZONTAL"; row.fills = []; row.itemSpacing = 24; row.counterAxisAlignItems = "CENTER";
    typeCard.appendChild(row);
    setFullWidthFill(row);

    const labelText = createText(ts.label, 12, "Medium", COLORS.textMuted); labelText.resize(120, 16);
    row.appendChild(labelText);
    row.appendChild(createText("Instagram Social Design System", ts.size, ts.weight, COLORS.textDark));
  }

  // ------------------------------------------------------------------
  // PILLAR 3: MASTER COMPONENT SETS WITH COMPLETE INTERACTIVE STATE MATRICES
  // ------------------------------------------------------------------
  const compSection = figma.createFrame();
  compSection.name = "Pillar_3_Master_Component_Sets"; compSection.layoutMode = "VERTICAL"; compSection.fills = []; compSection.itemSpacing = 16;
  board.appendChild(compSection);
  setFullWidthFill(compSection);

  compSection.appendChild(createText("🧩 3. Master Component Sets (Interactive State Matrices)", 16, "Bold", COLORS.textDark));

  const compMatrixContainer = figma.createFrame();
  compMatrixContainer.name = "Component_Sets_Matrix"; compMatrixContainer.layoutMode = "VERTICAL"; compMatrixContainer.fills = []; compMatrixContainer.itemSpacing = 20;
  compSection.appendChild(compMatrixContainer);
  setFullWidthFill(compMatrixContainer);

  // COMPONENT SET 1: BUTTON MATRIX (Primary, Secondary, Outline x Default, Hover, Active, Disabled)
  const buttonVariantConfigs = [
    { name: "Variant=Primary, State=Default", bg: COLORS.verifiedBlue, text: COLORS.white },
    { name: "Variant=Primary, State=Hover", bg: COLORS.verifiedBlueHover, text: COLORS.white },
    { name: "Variant=Primary, State=Disabled", bg: COLORS.disabledBg, text: COLORS.disabledText },
    { name: "Variant=Secondary, State=Default", bg: COLORS.searchBg, text: COLORS.textDark },
    { name: "Variant=Secondary, State=Hover", bg: COLORS.borderLight, text: COLORS.textDark },
    { name: "Variant=Outline, State=Default", bg: COLORS.white, text: COLORS.textDark, stroke: COLORS.borderLight }
  ];

  const buttonNodes = [];
  for (const b of buttonVariantConfigs) {
    const c = figma.createComponent();
    c.name = b.name; c.layoutMode = "HORIZONTAL"; c.cornerRadius = 8;
    c.fills = [{ type: 'SOLID', color: b.bg }];
    if (b.stroke) { c.strokes = [{ type: 'SOLID', color: b.stroke }]; c.strokeWeight = 1; }
    c.paddingLeft = 16; c.paddingRight = 16; c.paddingTop = 8; c.paddingBottom = 8;
    c.appendChild(createText("Follow", 14, "Bold", b.text));
    c.primaryAxisSizingMode = "AUTO"; c.counterAxisSizingMode = "AUTO";
    buttonNodes.push(c);
  }

  try {
    const buttonSet = figma.combineAsVariants(buttonNodes, figma.currentPage);
    buttonSet.name = "Button / FollowPill";
    buttonSet.layoutMode = "HORIZONTAL"; buttonSet.itemSpacing = 16;
    buttonSet.paddingLeft = 16; buttonSet.paddingRight = 16; buttonSet.paddingTop = 16; buttonSet.paddingBottom = 16;
    buttonSet.primaryAxisSizingMode = "AUTO"; buttonSet.counterAxisSizingMode = "AUTO";
    compMatrixContainer.appendChild(buttonSet);
  } catch (e) {
    console.warn("Combine variants error:", e);
  }

  // COMPONENT SET 2: AVATAR STORY CIRCLE MATRIX (Variant=Standard, StoryRing, CloseFriends, ActiveOnline)
  const avatarConfigs = [
    { name: "Variant=Standard, Size=Medium", ring: null, online: false, size: 56 },
    { name: "Variant=StoryRing, Size=Medium", ring: COLORS.storyRingPink, online: false, size: 56 },
    { name: "Variant=CloseFriends, Size=Medium", ring: COLORS.closeFriendsGreen, online: false, size: 56 },
    { name: "Variant=ActiveOnline, Size=Medium", ring: null, online: true, size: 56 }
  ];

  const avatarNodes = [];
  for (const a of avatarConfigs) {
    const c = figma.createComponent();
    c.name = a.name; c.resize(a.size + 8, a.size + 8); c.cornerRadius = 999;
    if (a.ring) { c.strokes = [{ type: 'SOLID', color: a.ring }]; c.strokeWeight = 2.5; }
    c.paddingLeft = 4; c.paddingRight = 4; c.paddingTop = 4; c.paddingBottom = 4;

    const avFill = figma.createFrame(); avFill.name = "Avatar_Fill"; avFill.resize(a.size, a.size); avFill.cornerRadius = 999;
    c.appendChild(avFill);
    await applyOnlineImage(avFill, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80");

    if (a.online) {
      const activeDot = figma.createFrame(); activeDot.name = "Active_Dot"; activeDot.resize(14, 14); activeDot.cornerRadius = 999;
      activeDot.fills = [{ type: 'SOLID', color: COLORS.closeFriendsGreen }];
      activeDot.strokes = [{ type: 'SOLID', color: COLORS.white }]; activeDot.strokeWeight = 2;
      activeDot.layoutPositioning = "ABSOLUTE"; activeDot.x = 44; activeDot.y = 44;
      c.appendChild(activeDot);
    }
    avatarNodes.push(c);
  }

  try {
    const avatarSet = figma.combineAsVariants(avatarNodes, figma.currentPage);
    avatarSet.name = "Avatar / UserCircle";
    avatarSet.layoutMode = "HORIZONTAL"; avatarSet.itemSpacing = 20;
    avatarSet.paddingLeft = 16; avatarSet.paddingRight = 16; avatarSet.paddingTop = 16; avatarSet.paddingBottom = 16;
    avatarSet.primaryAxisSizingMode = "AUTO"; avatarSet.counterAxisSizingMode = "AUTO";
    compMatrixContainer.appendChild(avatarSet);
  } catch (e) {
    console.warn("Combine variants avatar error:", e);
  }

  // 7. Select & Focus Canvas
  figma.currentPage.selection = [board];
  figma.viewport.scrollAndZoomIntoView([board]);

  console.log("Instagram Master Design System compiled with full-width Auto Layout!");
})();
