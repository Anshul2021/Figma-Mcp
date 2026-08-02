// Generated Figma Script: Food Delivery Onboarding Screen (YumPink Theme, Zero Emoji, Pure Auto Layout)
// Strict Compliance: figma_autolayout_rules.md & Execution Order Protocol
(async function(figma) {
  // 1. Load Mandatory Fonts
  await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
  await figma.loadFontAsync({ family: "Poppins", style: "Medium" });
  await figma.loadFontAsync({ family: "Poppins", style: "Bold" });

  // 2. Clean Previous Canvas Board
  const oldBoard = figma.currentPage.findChild(n => n.name === "Generated UI Screens");
  if (oldBoard) oldBoard.remove();

  // 3. Pink Theme Color Tokens
  const COLOR_BG_PINK = { r: 1.0, g: 0.94, b: 0.96 };            // #FFF0F5
  const COLOR_SURFACE = { r: 1.0, g: 1.0, b: 1.0 };            // #FFFFFF
  const COLOR_PINK_PRIMARY = { r: 0.96, g: 0.22, b: 0.44 };      // #F53870
  const COLOR_PINK_LIGHT = { r: 1.0, g: 0.9, b: 0.94 };          // #FFE6EF
  const COLOR_TEXT_MAIN = { r: 0.15, g: 0.15, b: 0.2 };          // #262633
  const COLOR_TEXT_MUTED = { r: 0.55, g: 0.55, b: 0.65 };        // #8C8CA6
  const COLOR_BORDER = { r: 0.92, g: 0.92, b: 0.94 };          // #EBEBEF

  // 4. Online & Embedded Vector SVG Dictionary (Zero Emoji Protocol)
  const EMBEDDED_SVGS = {
    "arrow-right": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    "utensils": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F53870" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2v20"/><path d="M18 2d0 0 1 0 0"/><path d="M14 2v6a2 2 0 0 0 2 2h4"/><path d="M6 2v7a3 3 0 0 0 6 0V2"/><path d="M9 11v11"/></svg>`,
    "sparkles": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F53870" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`
  };

  async function loadVectorIcon(iconName, size = 20, colorHex = "#F53870") {
    try {
      const url = `https://unpkg.com/lucide-static@latest/icons/${iconName}.svg`;
      const res = await fetch(url);
      if (res.ok) {
        let svgText = await res.text();
        if (colorHex) {
          svgText = svgText.replace(/stroke="currentColor"/g, `stroke="${colorHex}"`)
                           .replace(/fill="currentColor"/g, `fill="${colorHex}"`);
        }
        const node = figma.createNodeFromSvg(svgText);
        node.name = `Lucide / ${iconName}`;
        node.resize(size, size);
        return node;
      }
    } catch (err) {}
    const key = Object.keys(EMBEDDED_SVGS).find(k => iconName.includes(k) || k.includes(iconName));
    if (key) {
      const node = figma.createNodeFromSvg(EMBEDDED_SVGS[key]);
      node.name = `Vector / ${iconName}`;
      node.resize(size, size);
      return node;
    }
    return null;
  }

  async function applyOnlineImage(frameNode, imageUrl) {
    try {
      const image = await figma.createImageAsync(imageUrl);
      frameNode.fills = [{ type: 'IMAGE', scaleMode: 'FILL', imageHash: image.hash }];
    } catch (err) {
      frameNode.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.9, b: 0.94 } }];
    }
  }

  // 5. Auto Layout Helpers (Execution Order Protocol)
  function makeSpaceBetweenRow(name, fixedWidth) {
    const row = figma.createFrame();
    row.name = name;
    row.layoutMode = "HORIZONTAL";
    row.fills = [];
    row.resize(fixedWidth, 1);             // STEP 6: resize FIRST
    row.primaryAxisSizingMode = "FIXED";   // STEP 6.5: set sizing modes AFTER
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

  function finalizeHugHeight(frame) {
    frame.primaryAxisSizingMode = "AUTO";  // STEP 9: set HUG height LAST
  }

  function createText(characters, size, weight = "Regular", color = COLOR_TEXT_MAIN) {
    const t = figma.createText();
    t.fontName = { family: "Poppins", style: weight };
    t.characters = String(characters);
    t.fontSize = size;
    t.fills = [{ type: 'SOLID', color: color }];
    return t;
  }

  // Outer Workspace Container
  const container = figma.createFrame();
  container.name = "Generated UI Screens";
  container.layoutMode = "HORIZONTAL";
  container.primaryAxisSizingMode = "AUTO";
  container.counterAxisSizingMode = "AUTO";
  container.itemSpacing = 40;
  container.paddingLeft = 40; container.paddingRight = 40;
  container.paddingTop = 40; container.paddingBottom = 40;
  container.fills = [{ type: 'SOLID', color: { r: 0.12, g: 0.12, b: 0.12 } }];
  container.cornerRadius = 24;

  // Root Mobile Screen (375x812 FIXED Auto Layout)
  const screen = figma.createFrame();
  screen.name = "FoodiePink - Onboarding Screen";
  screen.layoutMode = "VERTICAL";
  screen.resize(375, 812);
  screen.primaryAxisSizingMode = "FIXED";
  screen.counterAxisSizingMode = "FIXED";
  screen.itemSpacing = 0;
  screen.cornerRadius = 32;
  screen.fills = [{ type: 'SOLID', color: COLOR_BG_PINK }];
  screen.clipsContent = true;

  // ── A. TOP NAVIGATION HEADER (375px x 52px) ──────────────────────────
  const navHeader = makeSpaceBetweenRow("Top Header Bar", 375);
  navHeader.paddingLeft = 24; navHeader.paddingRight = 24;
  navHeader.paddingTop = 16; navHeader.paddingBottom = 12;

  // App Brand Logo Pill
  const brandPill = makeHugContainer("Brand Pill", "HORIZONTAL", 8);
  const logoCircle = figma.createFrame();
  logoCircle.resize(28, 28); logoCircle.cornerRadius = 14;
  logoCircle.fills = [{ type: 'SOLID', color: COLOR_PINK_PRIMARY }];
  const forkIcon = await loadVectorIcon("utensils", 16, "#FFFFFF");
  if (forkIcon) { forkIcon.x = 6; forkIcon.y = 6; logoCircle.appendChild(forkIcon); }
  brandPill.appendChild(logoCircle);

  brandPill.appendChild(createText("YumPink", 16, "Bold", COLOR_TEXT_MAIN));
  navHeader.appendChild(brandPill);

  // Skip Link Text
  navHeader.appendChild(createText("Skip", 13, "Bold", COLOR_TEXT_MUTED));
  screen.appendChild(navHeader);

  // ── B. MIDDLE ONBOARDING ILLUSTATION HERO (375px x 420px) ────────────
  const heroWrapper = figma.createFrame();
  heroWrapper.name = "Hero Media Area";
  heroWrapper.layoutMode = "VERTICAL";
  heroWrapper.resize(375, 410);
  heroWrapper.primaryAxisSizingMode = "FIXED";
  heroWrapper.counterAxisSizingMode = "FIXED";
  heroWrapper.paddingLeft = 24; heroWrapper.paddingRight = 24;
  heroWrapper.counterAxisAlignItems = "CENTER";
  heroWrapper.primaryAxisAlignItems = "CENTER";

  // Circular Hero Image Frame (280x280)
  const heroImageCard = figma.createFrame();
  heroImageCard.name = "Onboarding Illustration Card";
  heroImageCard.resize(270, 270);
  heroImageCard.cornerRadius = 135;
  heroImageCard.strokes = [{ type: 'SOLID', color: COLOR_PINK_PRIMARY }];
  heroImageCard.strokeWeight = 4;
  await applyOnlineImage(heroImageCard, "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80");
  heroWrapper.appendChild(heroImageCard);

  screen.appendChild(heroWrapper);

  // ── C. BOTTOM CONTENT CARD BLOCK (375px x 340px) ──────────────────────
  const contentSheet = figma.createFrame();
  contentSheet.name = "Bottom Onboarding Content Sheet";
  contentSheet.layoutMode = "VERTICAL";
  contentSheet.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  contentSheet.resize(375, 350);
  contentSheet.primaryAxisSizingMode = "FIXED";
  contentSheet.counterAxisSizingMode = "FIXED";
  contentSheet.itemSpacing = 20;
  contentSheet.paddingLeft = 24; contentSheet.paddingRight = 24;
  contentSheet.paddingTop = 28; contentSheet.paddingBottom = 28;
  contentSheet.cornerRadius = 32;
  contentSheet.counterAxisAlignItems = "CENTER";

  // Headline Stack
  const headStack = makeHugContainer("Headline Stack", "VERTICAL", 8);
  headStack.counterAxisAlignItems = "CENTER";

  headStack.appendChild(createText("Fastest Food Delivery", 22, "Bold", COLOR_TEXT_MAIN));
  
  const subLabel = createText("Order from your favorite restaurants and get delicious meals delivered to your doorstep in minutes.", 13, "Regular", COLOR_TEXT_MUTED);
  subLabel.layoutAlign = "STRETCH";
  subLabel.textAlignHorizontal = "CENTER";
  subLabel.textAutoResize = "HEIGHT";
  headStack.appendChild(subLabel);

  contentSheet.appendChild(headStack);

  // Page Indicator Dots (Active Pink Pill + 2 Soft Circles)
  const dotsRow = makeHugContainer("Pagination Dots", "HORIZONTAL", 6);
  dotsRow.counterAxisAlignItems = "CENTER";

  const activeDot = figma.createFrame();
  activeDot.resize(24, 8); activeDot.cornerRadius = 4;
  activeDot.fills = [{ type: 'SOLID', color: COLOR_PINK_PRIMARY }];
  dotsRow.appendChild(activeDot);

  const dot2 = figma.createFrame();
  dot2.resize(8, 8); dot2.cornerRadius = 4;
  dot2.fills = [{ type: 'SOLID', color: COLOR_PINK_LIGHT }];
  dotsRow.appendChild(dot2);

  const dot3 = figma.createFrame();
  dot3.resize(8, 8); dot3.cornerRadius = 4;
  dot3.fills = [{ type: 'SOLID', color: COLOR_PINK_LIGHT }];
  dotsRow.appendChild(dot3);

  contentSheet.appendChild(dotsRow);

  // Primary Action CTA "Get Started" Button
  const ctaBtn = makeSpaceBetweenRow("Button / Get Started", 327);
  ctaBtn.resize(327, 54);
  ctaBtn.cornerRadius = 27;
  ctaBtn.fills = [{ type: 'SOLID', color: COLOR_PINK_PRIMARY }];
  ctaBtn.paddingLeft = 24; ctaBtn.paddingRight = 20;

  ctaBtn.appendChild(createText("Get Started", 16, "Bold", COLOR_SURFACE));

  // Circle Arrow Icon Badge
  const arrowBadge = figma.createFrame();
  arrowBadge.resize(36, 36); arrowBadge.cornerRadius = 18;
  arrowBadge.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  const arrowIcon = await loadVectorIcon("arrow-right", 18, "#F53870");
  if (arrowIcon) { arrowIcon.x = 9; arrowIcon.y = 9; arrowBadge.appendChild(arrowIcon); }
  ctaBtn.appendChild(arrowBadge);

  contentSheet.appendChild(ctaBtn);
  screen.appendChild(contentSheet);

  container.appendChild(screen);
  figma.currentPage.appendChild(container);
  figma.viewport.scrollAndZoomIntoView([container]);
})(figma);
