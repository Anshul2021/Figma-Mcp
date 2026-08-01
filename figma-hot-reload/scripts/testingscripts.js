// ======================================================
// FIGMA SPLASH SCREEN AND ONBOARDING FLOW UI
// Screen Size: 393px width by 852px height
// Layout: 4 side-by-side mockups on a Board (Splash, Onboarding 1, 2, 3)
// Brand Theme Color: Berry/Purple (#913175)
// Spacing: 8pt grid based manual positioning
// Typography: DM Sans & Inter (Regular, Medium, SemiBold only)
// ======================================================

async function run() {
  try {
    // ======================================================
    // FONT MANAGER & LOADER
    // ======================================================
    const LOADED_FONTS = new Set();

    async function loadFontSafe(family, style) {
      try {
        await figma.loadFontAsync({ family, style });
        LOADED_FONTS.add(`${family}|${style}`);
        return true;
      } catch (e) {
        console.warn(`Font load warning: ${family} ${style} not available.`);
        return false;
      }
    }

    async function loadAllFonts() {
      await loadFontSafe("Inter", "Regular");
      await loadFontSafe("Inter", "Medium");
      await loadFontSafe("DM Sans", "Regular");
      await loadFontSafe("DM Sans", "Medium");
      await loadFontSafe("DM Sans", "SemiBold");
    }

    await loadAllFonts();

    function getFont(family, style) {
      if (LOADED_FONTS.has(`${family}|${style}`)) {
        return { family, style };
      }
      const fallbackStyle = style === "SemiBold" ? "SemiBold" : (style === "Medium" ? "Medium" : "Regular");
      if (LOADED_FONTS.has(`Inter|${fallbackStyle}`)) {
        return { family: "Inter", style: fallbackStyle };
      }
      return { family: "Inter", style: "Regular" };
    }

    // ======================================================
    // COLOR HELPERS
    // ======================================================
    function hex(value) {
      const clean = value.replace("#", "");
      return {
        r: parseInt(clean.substring(0, 2), 16) / 255,
        g: parseInt(clean.substring(2, 4), 16) / 255,
        b: parseInt(clean.substring(4, 6), 16) / 255
      };
    }

    function solid(color, opacity = 1) {
      return {
        type: "SOLID",
        color: hex(color),
        opacity
      };
    }

    function gradient(color1, color2) {
      const c1 = hex(color1);
      const c2 = hex(color2);
      return {
        type: "GRADIENT_LINEAR",
        gradientTransform: [
          [0, 1, 0],
          [-1, 0, 1]
        ],
        gradientStops: [
          { position: 0, color: { r: c1.r, g: c1.g, b: c1.b, a: 1 } },
          { position: 1, color: { r: c2.r, g: c2.g, b: c2.b, a: 1 } }
        ]
      };
    }

    // ======================================================
    // NODE BUILDERS (MANUAL x & y POSITIONING)
    // ======================================================
    function drawText({ name, text, fontSize, color, fontWeight, lineSpacing, w, h, align, x, y }) {
      const node = figma.createText();
      node.name = name || "Text";

      let fontStyle = "Regular";
      if (fontWeight === "medium" || fontWeight === 500) fontStyle = "Medium";
      else if (fontWeight === "semibold" || fontWeight === 600 || fontWeight === "bold" || fontWeight === 700) fontStyle = "SemiBold";

      node.fontName = getFont("DM Sans", fontStyle);
      node.characters = text;
      node.fontSize = fontSize || 14;
      node.lineHeight = { unit: "PIXELS", value: lineSpacing || (fontSize ? Math.round(fontSize * 1.4) : 20) };
      node.fills = [solid(color || "#0F172A")];

      if (align) node.textAlignHorizontal = align;

      node.x = x || 0;
      node.y = y || 0;

      if (w) {
        node.resize(w, h || 20);
        node.textAutoResize = "HEIGHT";
      } else {
        node.textAutoResize = "WIDTH_AND_HEIGHT";
      }

      return node;
    }

    function safeCreateSvgIcon(svg, name, size, fallbackChar, color, x, y) {
      try {
        const cleanSvg = svg.replace(/CURRENT_COLOR/g, color || "#334155");
        const node = figma.createNodeFromSvg(cleanSvg);
        node.name = name;
        node.resize(size, size);
        node.x = x || 0;
        node.y = y || 0;
        return node;
      } catch (e) {
        console.warn(`SVG Render warning for ${name}:`, e);
        const fallback = drawText({
          name: name,
          text: fallbackChar || "■",
          fontSize: size,
          color: color || "#334155",
          x,
          y
        });
        return fallback;
      }
    }

    // ======================================================
    // SVG PATHS
    // ======================================================
    const clockIconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="CURRENT_COLOR" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    `;

    const checkCircleIconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="CURRENT_COLOR" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    `;

    const cloudIconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="CURRENT_COLOR" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 10h-.01a7 7 0 0 0-12.99 2A5.5 5.5 0 0 0 6 23h12a6 6 0 0 0 0-12z"/>
      </svg>
    `;

    // ======================================================
    // HELPER: BUILD MOCK SYSTEM STATUS BAR
    // ======================================================
    function drawSystemStatusBar(screen, time = "9:30", isWhiteTheme = true) {
      const bar = figma.createFrame();
      bar.name = "Status Bar";
      bar.resize(393, 36);
      bar.x = 0;
      bar.y = 0;
      bar.fills = [solid(isWhiteTheme ? "#FFFFFF" : "#913175")];
      bar.layoutMode = "NONE";

      const color = isWhiteTheme ? "#1D1B20" : "#FFFFFF";

      const timeText = drawText({
        name: "Time",
        text: time,
        fontSize: 14,
        color,
        fontWeight: "semibold",
        x: 24,
        y: 8
      });
      bar.appendChild(timeText);

      const mockIcons = drawText({
        name: "Mock Icons",
        text: "📶 🛜 🔋",
        fontSize: 12,
        color,
        fontWeight: "medium",
        x: 320,
        y: 10
      });
      bar.appendChild(mockIcons);

      screen.appendChild(bar);
    }

    // ======================================================
    // HELPER: BUILD AVATAR ICON
    // ======================================================
    function drawAvatar(text, size, x, y) {
      const avatar = figma.createFrame();
      avatar.name = "Avatar: " + text;
      avatar.resize(size, size);
      avatar.x = x;
      avatar.y = y;
      avatar.cornerRadius = size / 2;
      avatar.fills = [gradient("#913175", "#EC4899")]; // Brand Berry gradient

      const label = drawText({
        name: "Initials",
        text: text,
        fontSize: Math.round(size * 0.35),
        color: "#FFFFFF",
        fontWeight: "semibold",
        w: size,
        align: "CENTER",
        x: 0,
        y: Math.round((size - (size * 0.35 * 1.4)) / 2)
      });
      avatar.appendChild(label);
      return avatar;
    }

    // ======================================================
    // HELPER: DRAW PROGRESS INDICATOR BAR
    // ======================================================
    function drawProgressIndicators(parent, activeStep) {
      const progressContainer = figma.createFrame();
      progressContainer.name = "Story Progress indicators";
      progressContainer.resize(361, 4);
      progressContainer.x = 16;
      progressContainer.y = 52;
      progressContainer.fills = [];

      // 3 steps
      for (let i = 1; i <= 3; i++) {
        const pill = figma.createRectangle();
        pill.name = "Indicator Bar " + i;
        pill.resize(115, 4);
        pill.x = (i - 1) * 123;
        pill.y = 0;
        pill.cornerRadius = 2;
        pill.fills = [solid("#FFFFFF")];
        pill.opacity = i <= activeStep ? 1.0 : 0.3; // Active steps solid, inactive dimmed
        progressContainer.appendChild(pill);
      }
      parent.appendChild(progressContainer);
    }

    // ======================================================
    // SCREEN 1: SPLASH SCREEN
    // ======================================================
    function drawSplashScreen(screen) {
      drawSystemStatusBar(screen, "9:30", true);

      // Centered SEEDICON Logo
      // SEEDIC text
      const word1 = drawText({
        name: "SEEDIC Title",
        text: "SEEDIC",
        fontSize: 36,
        color: "#4A2C11", // Dark chocolate brown
        fontWeight: "bold",
        x: 90,
        y: 408
      });
      screen.appendChild(word1);

      // Coffee Bean vector replacing "O"
      const bean = figma.createFrame();
      bean.name = "Coffee Bean O";
      bean.resize(24, 30);
      bean.x = 232;
      bean.y = 413;
      bean.cornerRadius = 12;
      bean.fills = [solid("#4A2C11")];

      // Crease inside bean
      const crease = figma.createRectangle();
      crease.name = "Crease Line";
      crease.resize(2, 24);
      crease.x = 11;
      crease.y = 3;
      crease.cornerRadius = 1;
      crease.fills = [solid("#8D5A34")]; // Soft brown crease color
      bean.appendChild(crease);
      screen.appendChild(bean);

      // N text
      const word2 = drawText({
        name: "N Title",
        text: "N",
        fontSize: 36,
        color: "#4A2C11",
        fontWeight: "bold",
        x: 262,
        y: 408
      });
      screen.appendChild(word2);
    }

    // ======================================================
    // SCREEN 2: ONBOARDING - EVENT HOSTING
    // ======================================================
    function drawOnboardingScreen1(screen) {
      drawSystemStatusBar(screen, "9:30", false); // Purple status bar

      // 1. Purple Banner Section (y = 36 to 480)
      const banner = figma.createFrame();
      banner.name = "Purple Banner Section";
      banner.resize(393, 444);
      banner.x = 0;
      banner.y = 36;
      banner.fills = [solid("#913175")]; // Berry purple

      drawProgressIndicators(banner, 1); // Step 1 active

      // Custom Event Illustration (Floating Card)
      const eventCard = figma.createFrame();
      eventCard.name = "Event Illustration Card";
      eventCard.resize(321, 260);
      eventCard.x = 36;
      eventCard.y = 100;
      eventCard.cornerRadius = 16;
      eventCard.fills = [solid("#FFFFFF")];
      eventCard.effects = [
        {
          type: "DROP_SHADOW",
          color: { r: 15 / 255, g: 23 / 255, b: 42 / 255, a: 0.1 },
          offset: { x: 0, y: 8 },
          radius: 24,
          spread: 0,
          visible: true,
          blendMode: "NORMAL"
        }
      ];

      // Inner Event cover gradient
      const cover = figma.createFrame();
      cover.name = "Event Cover";
      cover.resize(297, 120);
      cover.x = 12;
      cover.y = 12;
      cover.cornerRadius = 10;
      cover.fills = [gradient("#FF9E6F", "#FF4B26")];

      const coverTitle = drawText({
        name: "Event Title Mock",
        text: "AI Innovate 2026",
        fontSize: 16,
        color: "#FFFFFF",
        fontWeight: "bold",
        x: 20,
        y: 20
      });
      cover.appendChild(coverTitle);

      const coverLoc = drawText({
        name: "Event Location Mock",
        text: "📍 Mumbai Convention Center",
        fontSize: 11,
        color: "#FFFFFF",
        fontWeight: "medium",
        x: 20,
        y: 84
      });
      cover.appendChild(coverLoc);
      eventCard.appendChild(cover);

      // Card Host Section
      const hostLabel = drawText({
        name: "Host Label",
        text: "EVENT HOST",
        fontSize: 9,
        color: "#94A3B8",
        fontWeight: "semibold",
        x: 16,
        y: 144
      });
      eventCard.appendChild(hostLabel);

      const hostAvatar = drawAvatar("GS", 28, 16, 160);
      eventCard.appendChild(hostAvatar);

      const hostName = drawText({
        name: "Host Name",
        text: "Gyan Sharma",
        fontSize: 12,
        color: "#0F172A",
        fontWeight: "semibold",
        x: 52,
        y: 166
      });
      eventCard.appendChild(hostName);

      const detailsText = drawText({
        name: "Event Details Description",
        text: "Create and publish events effortlessly. Manage attendees, schedule, and live questions in one dashboard.",
        fontSize: 10,
        color: "#64748B",
        fontWeight: "regular",
        w: 289,
        x: 16,
        y: 198
      });
      eventCard.appendChild(detailsText);
      banner.appendChild(eventCard);
      screen.appendChild(banner);

      // 2. Bottom Content Panel (y = 480 to 852)
      const title = drawText({
        name: "Headline Title",
        text: "Discover & Host Seamless Events",
        fontSize: 22,
        color: "#913175",
        fontWeight: "bold",
        w: 345,
        align: "CENTER",
        x: 24,
        y: 512
      });
      screen.appendChild(title);

      const body = drawText({
        name: "Description Body",
        text: "Explore top-tier professional events or set up and publish your own event in minutes. Attending and hosting has never been easier.",
        fontSize: 14,
        color: "#64748B",
        fontWeight: "regular",
        w: 345,
        align: "CENTER",
        lineSpacing: 20,
        x: 24,
        y: 560
      });
      screen.appendChild(body);

      // Actions at bottom: Skip / Next
      const skip = drawText({
        name: "Skip Label",
        text: "Skip",
        fontSize: 14,
        color: "#94A3B8",
        fontWeight: "medium",
        x: 24,
        y: 746
      });
      screen.appendChild(skip);

      const nextBtn = figma.createFrame();
      nextBtn.name = "Next Button";
      nextBtn.resize(80, 36);
      nextBtn.x = 289;
      nextBtn.y = 736;
      nextBtn.cornerRadius = 18;
      nextBtn.fills = [solid("#913175")]; // Berry purple

      const nextText = drawText({
        name: "Label",
        text: "Next",
        fontSize: 12,
        color: "#FFFFFF",
        fontWeight: "bold",
        w: 80,
        align: "CENTER",
        x: 0,
        y: 9
      });
      nextBtn.appendChild(nextText);
      screen.appendChild(nextBtn);

      // iOS Indicator
      const iosBar = figma.createRectangle();
      iosBar.resize(140, 5);
      iosBar.x = (393 - 140) / 2;
      iosBar.y = 838;
      iosBar.cornerRadius = 10;
      iosBar.fills = [solid("#CBD5E1")];
      screen.appendChild(iosBar);
    }

    // ======================================================
    // SCREEN 3: ONBOARDING - CONTACT SCANNING
    // ======================================================
    function drawOnboardingScreen2(screen) {
      drawSystemStatusBar(screen, "9:30", false);

      const banner = figma.createFrame();
      banner.name = "Purple Banner Section";
      banner.resize(393, 444);
      banner.x = 0;
      banner.y = 36;
      banner.fills = [solid("#913175")];

      drawProgressIndicators(banner, 2); // Steps 1 & 2 active

      // Custom Card Scanner Illustration (Card inside scanner grid)
      const scannerContainer = figma.createFrame();
      scannerContainer.name = "Scanner Illustration Card";
      scannerContainer.resize(321, 260);
      scannerContainer.x = 36;
      scannerContainer.y = 100;
      scannerContainer.cornerRadius = 16;
      scannerContainer.fills = [solid("#FFFFFF")];
      scannerContainer.effects = [
        {
          type: "DROP_SHADOW",
          color: { r: 15 / 255, g: 23 / 255, b: 42 / 255, a: 0.1 },
          offset: { x: 0, y: 8 },
          radius: 24,
          spread: 0,
          visible: true,
          blendMode: "NORMAL"
        }
      ];

      // Mock business card being scanned
      const bCard = figma.createFrame();
      bCard.name = "Business Card Mockup";
      bCard.resize(273, 160);
      bCard.x = 24;
      bCard.y = 50;
      bCard.cornerRadius = 12;
      bCard.fills = [solid("#F8FAFC")];
      bCard.strokes = [solid("#E2E8F0")];
      bCard.strokeWeight = 1.5;

      const cardAvatar = drawAvatar("AB", 32, 16, 16);
      // Remove gradient, give normal color
      cardAvatar.fills = [solid("#E2E8F0")];
      cardAvatar.children[0].fills = [solid("#475569")];
      bCard.appendChild(cardAvatar);

      const cardName = drawText({
        name: "Card Name",
        text: "Abhijeet",
        fontSize: 14,
        color: "#0F172A",
        fontWeight: "semibold",
        x: 60,
        y: 16
      });
      bCard.appendChild(cardName);

      const cardRole = drawText({
        name: "Card Role",
        text: "Lead Engineer, Seedicon",
        fontSize: 10,
        color: "#64748B",
        fontWeight: "medium",
        x: 60,
        y: 34
      });
      bCard.appendChild(cardRole);

      const cardLine = figma.createRectangle();
      cardLine.resize(241, 1);
      cardLine.x = 16;
      cardLine.y = 62;
      cardLine.fills = [solid("#E2E8F0")];
      bCard.appendChild(cardLine);

      const cardEmail = drawText({
        name: "Card Email",
        text: "✉  abhijeet@seedicon.com",
        fontSize: 10,
        color: "#64748B",
        fontWeight: "regular",
        x: 16,
        y: 78
      });
      bCard.appendChild(cardEmail);

      const cardPhone = drawText({
        name: "Card Phone",
        text: "📞  +1 (555) 123-4567",
        fontSize: 10,
        color: "#64748B",
        fontWeight: "regular",
        x: 16,
        y: 98
      });
      bCard.appendChild(cardPhone);
      scannerContainer.appendChild(bCard);

      // Scanner target border outline (glowing scan focus corners)
      const targetBox = figma.createFrame();
      targetBox.name = "Scanner Target Box";
      targetBox.resize(289, 180);
      targetBox.x = 16;
      targetBox.y = 40;
      targetBox.cornerRadius = 16;
      targetBox.fills = [];
      targetBox.strokes = [solid("#913175")]; // Berry purple target outline
      targetBox.strokeWeight = 2.5;
      scannerContainer.appendChild(targetBox);

      // Horizontal Laser Scan Line (Bright neon pink/red line)
      const laser = figma.createRectangle();
      laser.name = "Laser Scan Line";
      laser.resize(289, 3);
      laser.x = 16;
      laser.y = 120; // Laser passing through the center of business card
      laser.fills = [solid("#EC4899")]; // Neon pink scan line
      laser.effects = [
        {
          type: "DROP_SHADOW",
          color: { r: 236 / 255, g: 72 / 255, b: 153 / 255, a: 0.8 },
          offset: { x: 0, y: 0 },
          radius: 6,
          spread: 2,
          visible: true,
          blendMode: "NORMAL"
        }
      ];
      scannerContainer.appendChild(laser);
      banner.appendChild(scannerContainer);
      screen.appendChild(banner);

      // 2. Bottom Content Panel
      const title = drawText({
        name: "Headline Title",
        text: "Scan & Save Contacts Instantly",
        fontSize: 22,
        color: "#913175",
        fontWeight: "bold",
        w: 345,
        align: "CENTER",
        x: 24,
        y: 512
      });
      screen.appendChild(title);

      const body = drawText({
        name: "Description Body",
        text: "Use our high-precision card scanner to capture lead details in a single tap. Save them directly into dedicated event folders.",
        fontSize: 14,
        color: "#64748B",
        fontWeight: "regular",
        w: 345,
        align: "CENTER",
        lineSpacing: 20,
        x: 24,
        y: 560
      });
      screen.appendChild(body);

      // Actions at bottom: Back / Next
      const back = drawText({
        name: "Back Label",
        text: "Back",
        fontSize: 14,
        color: "#94A3B8",
        fontWeight: "medium",
        x: 24,
        y: 746
      });
      screen.appendChild(back);

      const nextBtn = figma.createFrame();
      nextBtn.name = "Next Button";
      nextBtn.resize(80, 36);
      nextBtn.x = 289;
      nextBtn.y = 736;
      nextBtn.cornerRadius = 18;
      nextBtn.fills = [solid("#913175")];

      const nextText = drawText({
        name: "Label",
        text: "Next",
        fontSize: 12,
        color: "#FFFFFF",
        fontWeight: "bold",
        w: 80,
        align: "CENTER",
        x: 0,
        y: 9
      });
      nextBtn.appendChild(nextText);
      screen.appendChild(nextBtn);

      const iosBar = figma.createRectangle();
      iosBar.resize(140, 5);
      iosBar.x = (393 - 140) / 2;
      iosBar.y = 838;
      iosBar.cornerRadius = 10;
      iosBar.fills = [solid("#CBD5E1")];
      screen.appendChild(iosBar);
    }

    // ======================================================
    // SCREEN 4: ONBOARDING - CRM & REMINDERS
    // ======================================================
    function drawOnboardingScreen3(screen) {
      drawSystemStatusBar(screen, "9:30", false);

      const banner = figma.createFrame();
      banner.name = "Purple Banner Section";
      banner.resize(393, 444);
      banner.x = 0;
      banner.y = 36;
      banner.fills = [solid("#913175")];

      drawProgressIndicators(banner, 3); // All 3 indicators active

      // Custom Follow-up Illustration
      const illustCard = figma.createFrame();
      illustCard.name = "Reminder Illustration Card";
      illustCard.resize(321, 260);
      illustCard.x = 36;
      illustCard.y = 100;
      illustCard.cornerRadius = 16;
      illustCard.fills = [solid("#FFFFFF")];
      illustCard.effects = [
        {
          type: "DROP_SHADOW",
          color: { r: 15 / 255, g: 23 / 255, b: 42 / 255, a: 0.1 },
          offset: { x: 0, y: 8 },
          radius: 24,
          spread: 0,
          visible: true,
          blendMode: "NORMAL"
        }
      ];

      // 1. Follow-up Card (Top)
      const followCard = figma.createFrame();
      followCard.name = "Reminder Card";
      followCard.resize(273, 80);
      followCard.x = 24;
      followCard.y = 32;
      followCard.cornerRadius = 12;
      followCard.fills = [solid("#FCF5F9")]; // Soft pink tint
      followCard.strokes = [solid("#913175", 0.3)];
      followCard.strokeWeight = 1.5;

      const clockIcon = safeCreateSvgIcon(clockIconSvg, "Clock Icon", 18, "⏰", "#913175", 16, 22);
      followCard.appendChild(clockIcon);

      const followTitle = drawText({
        name: "Follow-up Title",
        text: "Follow-up Reminder",
        fontSize: 12,
        color: "#913175",
        fontWeight: "semibold",
        x: 44,
        y: 18
      });
      followCard.appendChild(followTitle);

      const followBody = drawText({
        name: "Follow-up Body",
        text: "Call Gyan Sharma tomorrow at 10:00 AM",
        fontSize: 11,
        color: "#64748B",
        fontWeight: "regular",
        w: 213,
        x: 44,
        y: 36
      });
      followCard.appendChild(followBody);
      illustCard.appendChild(followCard);

      // Connection dotted line
      const line = figma.createRectangle();
      line.name = "Connection Line";
      line.resize(2, 24);
      line.x = 159;
      line.y = 112;
      line.fills = [solid("#CBD5E1")];
      illustCard.appendChild(line);

      // 2. CRM Synced Badge (Bottom)
      const crmCard = figma.createFrame();
      crmCard.name = "CRM Card";
      crmCard.resize(273, 64);
      crmCard.x = 24;
      crmCard.y = 136;
      crmCard.cornerRadius = 12;
      crmCard.fills = [solid("#F0FDFA")]; // Soft teal tint
      crmCard.strokes = [solid("#CCFBF1")];
      crmCard.strokeWeight = 1.5;

      const crmIcon = safeCreateSvgIcon(cloudIconSvg, "Cloud Icon", 18, "☁", "#0F766E", 16, 23);
      crmCard.appendChild(crmIcon);

      const crmTitle = drawText({
        name: "CRM Title",
        text: "CRM Synced Successfully",
        fontSize: 12,
        color: "#0F766E",
        fontWeight: "semibold",
        x: 44,
        y: 14
      });
      crmCard.appendChild(crmTitle);

      const crmBody = drawText({
        name: "CRM Body",
        text: "Synced to HubSpot & Salesforce",
        fontSize: 10,
        color: "#0F766E",
        fontWeight: "regular",
        w: 213,
        x: 44,
        y: 32
      });
      crmCard.appendChild(crmBody);
      illustCard.appendChild(crmCard);
      banner.appendChild(illustCard);
      screen.appendChild(banner);

      // 2. Bottom Content Panel
      const title = drawText({
        name: "Headline Title",
        text: "Set Follow-Ups & Sync to CRM",
        fontSize: 22,
        color: "#913175",
        fontWeight: "bold",
        w: 345,
        align: "CENTER",
        x: 24,
        y: 512
      });
      screen.appendChild(title);

      const body = drawText({
        name: "Description Body",
        text: "Never lose a lead. Set automatic follow-up reminders and instantly sync gathered contacts directly into your HubSpot or Salesforce CRM.",
        fontSize: 14,
        color: "#64748B",
        fontWeight: "regular",
        w: 345,
        align: "CENTER",
        lineSpacing: 20,
        x: 24,
        y: 560
      });
      screen.appendChild(body);

      // Get Started Button
      const startedBtn = figma.createFrame();
      startedBtn.name = "Get Started Button";
      startedBtn.resize(345, 48);
      startedBtn.x = 24;
      startedBtn.y = 730;
      startedBtn.cornerRadius = 24;
      startedBtn.fills = [solid("#913175")];

      const startedText = drawText({
        name: "Label",
        text: "Get Started",
        fontSize: 14,
        color: "#FFFFFF",
        fontWeight: "bold",
        w: 345,
        align: "CENTER",
        x: 0,
        y: 14
      });
      startedBtn.appendChild(startedText);
      screen.appendChild(startedBtn);

      const iosBar = figma.createRectangle();
      iosBar.resize(140, 5);
      iosBar.x = (393 - 140) / 2;
      iosBar.y = 838;
      iosBar.cornerRadius = 10;
      iosBar.fills = [solid("#CBD5E1")];
      screen.appendChild(iosBar);
    }

    // ======================================================
    // CANVAS PLACEMENT (BOARD CONTAINER)
    // ======================================================
    const board = figma.createFrame();
    board.name = "Board: Onboarding and Splash Screens";
    board.resize(30 + 393 + 30 + 393 + 30 + 393 + 30 + 393 + 30, 912);
    board.fills = [];
    board.strokes = [];
    board.layoutMode = "NONE";

    // Frame 1: Splash Screen
    const screen1 = figma.createFrame();
    screen1.name = "Splash Screen";
    screen1.resize(393, 852);
    screen1.topLeftRadius = 24; screen1.topRightRadius = 24; screen1.bottomLeftRadius = 24; screen1.bottomRightRadius = 24;
    screen1.fills = [solid("#FFFFFF")];
    screen1.clipsContent = true;
    screen1.layoutMode = "NONE";
    screen1.x = 30;
    screen1.y = 30;
    drawSplashScreen(screen1);
    board.appendChild(screen1);

    // Frame 2: Onboarding - Event Hosting
    const screen2 = figma.createFrame();
    screen2.name = "Onboarding - Event Hosting";
    screen2.resize(393, 852);
    screen2.topLeftRadius = 24; screen2.topRightRadius = 24; screen2.bottomLeftRadius = 24; screen2.bottomRightRadius = 24;
    screen2.fills = [solid("#FFFFFF")];
    screen2.clipsContent = true;
    screen2.layoutMode = "NONE";
    screen2.x = 30 + 393 + 30;
    screen2.y = 30;
    drawOnboardingScreen1(screen2);
    board.appendChild(screen2);

    // Frame 3: Onboarding - Contact Scanning
    const screen3 = figma.createFrame();
    screen3.name = "Onboarding - Contact Scanning";
    screen3.resize(393, 852);
    screen3.topLeftRadius = 24; screen3.topRightRadius = 24; screen3.bottomLeftRadius = 24; screen3.bottomRightRadius = 24;
    screen3.fills = [solid("#FFFFFF")];
    screen3.clipsContent = true;
    screen3.layoutMode = "NONE";
    screen3.x = 30 + 393 + 30 + 393 + 30;
    screen3.y = 30;
    drawOnboardingScreen2(screen3);
    board.appendChild(screen3);

    // Frame 4: Onboarding - CRM & Reminders
    const screen4 = figma.createFrame();
    screen4.name = "Onboarding - CRM & Reminders";
    screen4.resize(393, 852);
    screen4.topLeftRadius = 24; screen4.topRightRadius = 24; screen4.bottomLeftRadius = 24; screen4.bottomRightRadius = 24;
    screen4.fills = [solid("#FFFFFF")];
    screen4.clipsContent = true;
    screen4.layoutMode = "NONE";
    screen4.x = 30 + 393 + 30 + 393 + 30 + 393 + 30;
    screen4.y = 30;
    drawOnboardingScreen3(screen4);
    board.appendChild(screen4);

    const activePage = figma.currentPage;
    activePage.appendChild(board);
    activePage.selection = [board];
    figma.viewport.scrollAndZoomIntoView([board]);

    console.log("Splash and Onboarding flow successfully generated.");
  } catch (err) {
    console.error("Critical execution error:", err);
  }
}

run();