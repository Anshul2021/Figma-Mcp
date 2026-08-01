// ======================================================
// FIGMA MOBILE LOGIN SCREEN GENERATOR
// Default font: Plus Jakarta Sans / Inter
// Generates a gorgeous, modern, premium mobile login screen
// ======================================================

async function generateMobileLoginUI() {
  // --------------------------------------------------
  // FONT SETUP
  // --------------------------------------------------

  async function loadFontSafe(family, style) {
    try {
      await figma.loadFontAsync({ family, style });
      return true;
    } catch (e) {
      return false;
    }
  }

  async function resolveFont(preferred, fallback) {
    const weights = {
      regular: ["Regular"],
      medium: ["Medium", "Regular"],
      semibold: ["SemiBold", "Semi Bold", "Medium", "Bold"],
      bold: ["Bold", "SemiBold", "Medium"],
    };

    async function tryFamily(family) {
      const result = { family: family };

      for (const key in weights) {
        let found = false;

        for (let i = 0; i < weights[key].length; i++) {
          const style = weights[key][i];
          const ok = await loadFontSafe(family, style);
          if (ok) {
            result[key] = style;
            found = true;
            break;
          }
        }

        if (!found) return null;
      }

      return result;
    }

    return (await tryFamily(preferred)) || (await tryFamily(fallback));
  }

  const UI_FONT = await resolveFont("Plus Jakarta Sans", "Inter");

  if (!UI_FONT) {
    throw new Error("Could not load Plus Jakarta Sans or Inter.");
  }

  // --------------------------------------------------
  // TOKENS (Burgundy Theme)
  // --------------------------------------------------

  const COLORS = {
    bg: "#FAF8F7",
    surface: "#FFFFFF",
    border: "#EAD5D8",
    borderLight: "#F5EDED",
    
    text: "#1F1A1B",
    textSoft: "#706063",
    textMuted: "#A39295",

    burgundy: "#7A1C2E",
    burgundySoft: "#FCEEF0",
    burgundyDeep: "#5A111F",
    
    googleBg: "#FFFFFF",
    appleBg: "#1F1A1B",
  };

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    return {
      r: parseInt(clean.substring(0, 2), 16) / 255,
      g: parseInt(clean.substring(2, 4), 16) / 255,
      b: parseInt(clean.substring(4, 6), 16) / 255,
    };
  }

  function solid(hex) {
    return {
      type: "SOLID",
      color: hexToRgb(hex),
    };
  }

  function getFont(weight) {
    return {
      family: UI_FONT.family,
      style: UI_FONT[weight] || UI_FONT.regular,
    };
  }

  function createFrame(opts) {
    const node = figma.createFrame();
    node.name = opts.name || "Frame";
    node.layoutMode = opts.direction || "VERTICAL";
    node.itemSpacing = opts.gap || 0;
    node.paddingLeft = opts.pl !== undefined ? opts.pl : (opts.px || 0);
    node.paddingRight = opts.pr !== undefined ? opts.pr : (opts.px || 0);
    node.paddingTop = opts.pt !== undefined ? opts.pt : (opts.py || 0);
    node.paddingBottom = opts.pb !== undefined ? opts.pb : (opts.py || 0);

    node.cornerRadius = opts.radius || 0;
    node.clipsContent = opts.clipsContent !== undefined ? opts.clipsContent : false;

    node.fills = [];
    node.strokes = [];

    node.primaryAxisSizingMode = "AUTO";
    node.counterAxisSizingMode = "AUTO";

    if (opts.bg) node.fills = [solid(opts.bg)];
    if (opts.stroke) {
      node.strokes = [solid(opts.stroke)];
      node.strokeWeight = opts.strokeWeight || 1;
    }

    if (opts.w) {
      node.resize(opts.w, node.height);
      node.counterAxisSizingMode = "FIXED";
    }

    if (opts.h) {
      node.resize(node.width, opts.h);
      node.primaryAxisSizingMode = "FIXED";
    }

    if (opts.w && opts.h) {
      node.resize(opts.w, opts.h);
      node.counterAxisSizingMode = "FIXED";
      node.primaryAxisSizingMode = "FIXED";
    }

    if (opts.alignPrimary) node.primaryAxisAlignItems = opts.alignPrimary;
    if (opts.alignCounter) node.counterAxisAlignItems = opts.alignCounter;

    return node;
  }

  function createText(opts) {
    const node = figma.createText();
    node.name = opts.name || "Text";
    node.fontName = getFont(opts.weight || "regular");
    node.characters = opts.value || "";
    node.fontSize = opts.size || 14;
    node.lineHeight = {
      unit: "PIXELS",
      value: opts.line || 20,
    };
    node.fills = [solid(opts.color || COLORS.text)];

    if (opts.width) {
      node.textAutoResize = "HEIGHT";
      node.resize(opts.width, node.height);
    } else {
      node.textAutoResize = "WIDTH_AND_HEIGHT";
    }

    return node;
  }

  function createLogoBadge() {
    const badge = createFrame({
      name: "Logo Badge",
      direction: "HORIZONTAL",
      w: 48,
      h: 48,
      radius: 14,
      bg: COLORS.burgundySoft,
      alignPrimary: "CENTER",
      alignCounter: "CENTER",
    });

    badge.appendChild(
      createText({
        value: "⌘",
        size: 22,
        line: 22,
        weight: "bold",
        color: COLORS.burgundy,
      })
    );

    return badge;
  }

  function createInputField(label, placeholder, isPassword) {
    const root = createFrame({
      name: `Field - ${label}`,
      direction: "VERTICAL",
      gap: 6,
      w: 326,
    });

    root.appendChild(
      createText({
        value: label,
        size: 12,
        line: 16,
        weight: "semibold",
        color: COLORS.textSoft,
      })
    );

    const input = createFrame({
      name: "Input Box",
      direction: "HORIZONTAL",
      px: 14,
      py: 12,
      radius: 12,
      bg: COLORS.surface,
      stroke: COLORS.border,
      w: 326,
      h: 46,
      alignPrimary: "SPACE_BETWEEN",
      alignCounter: "CENTER",
    });

    input.appendChild(
      createText({
        value: placeholder,
        size: 13,
        line: 18,
        color: COLORS.textMuted,
      })
    );

    if (isPassword) {
      input.appendChild(
        createText({
          value: "👁",
          size: 14,
          line: 14,
          color: COLORS.textSoft,
        })
      );
    }

    root.appendChild(input);
    return root;
  }

  function createPrimaryButton(label) {
    const btn = createFrame({
      name: "Sign In Button",
      direction: "HORIZONTAL",
      px: 16,
      py: 14,
      radius: 12,
      bg: COLORS.burgundy,
      w: 326,
      h: 48,
      alignPrimary: "CENTER",
      alignCounter: "CENTER",
    });

    btn.appendChild(
      createText({
        value: label,
        size: 14,
        line: 18,
        weight: "bold",
        color: "#FFFFFF",
      })
    );

    return btn;
  }

  // Social
  function createSocialButton(platform, logoSymbol, isDark) {
    const btn = createFrame({
      name: `Social - ${platform}`,
      direction: "HORIZONTAL",
      gap: 8,
      px: 12,
      py: 12,
      radius: 12,
      bg: isDark ? COLORS.appleBg : COLORS.surface,
      stroke: isDark ? null : COLORS.border,
      w: 154,
      h: 44,
      alignPrimary: "CENTER",
      alignCounter: "CENTER",
    });

    btn.appendChild(
      createText({
        value: logoSymbol,
        size: 15,
        line: 15,
        weight: "bold",
        color: isDark ? "#FFFFFF" : COLORS.text,
      })
    );

    btn.appendChild(
      createText({
        value: platform,
        size: 12,
        line: 16,
        weight: "semibold",
        color: isDark ? "#FFFFFF" : COLORS.text,
      })
    );

    return btn;
  }

  function createOrDivider() {
    const root = createFrame({
      name: "Or Divider",
      direction: "HORIZONTAL",
      gap: 12,
      w: 326,
      alignPrimary: "CENTER",
      alignCounter: "CENTER",
    });

    const l1 = figma.createFrame();
    l1.resize(100, 1);
    l1.fills = [solid(COLORS.borderLight)];
    l1.strokes = [];

    const l2 = figma.createFrame();
    l2.resize(100, 1);
    l2.fills = [solid(COLORS.borderLight)];
    l2.strokes = [];

    root.appendChild(l1);
    root.appendChild(
      createText({
        value: "or continue with",
        size: 11,
        line: 14,
        color: COLORS.textMuted,
      })
    );
    root.appendChild(l2);

    return root;
  }

  // --------------------------------------------------
  // CANVAS DRAWING
  // --------------------------------------------------

  const page = figma.currentPage;

  // Board
  const board = createFrame({
    name: "Board",
    direction: "HORIZONTAL",
    gap: 40,
    px: 60,
    py: 60,
    bg: "#FFFFFF",
  });

  page.appendChild(board);

  // Screen
  const screen = createFrame({
    name: "Mobile Login Screen",
    direction: "VERTICAL",
    gap: 24,
    px: 32,
    py: 44,
    radius: 36,
    bg: COLORS.bg,
    stroke: COLORS.border,
    w: 390,
    h: 844,
    alignCounter: "CENTER",
  });

  screen.clipsContent = true;

  screen.appendChild(createFrame({ name: "StatusBar Spacer", h: 20 }));

  // 1. Logo
  const headerSection = createFrame({
    name: "Header Section",
    direction: "VERTICAL",
    gap: 16,
    w: 326,
    alignCounter: "CENTER",
  });

  headerSection.appendChild(createLogoBadge());

  const titleWrap = createFrame({
    name: "Titles",
    direction: "VERTICAL",
    gap: 6,
    w: 326,
    alignCounter: "CENTER",
  });

  titleWrap.appendChild(
    createText({
      value: "Welcome back",
      size: 24,
      line: 30,
      weight: "bold",
      color: COLORS.text,
    })
  );

  titleWrap.appendChild(
    createText({
      value: "Enter your credentials to access your account",
      size: 12,
      line: 18,
      color: COLORS.textSoft,
      width: 280,
    })
  );

  titleWrap.children[0].textAlignHorizontal = "CENTER";
  titleWrap.children[1].textAlignHorizontal = "CENTER";

  headerSection.appendChild(titleWrap);
  screen.appendChild(headerSection);

  // 2. Fields
  const fieldsSection = createFrame({
    name: "Fields Section",
    direction: "VERTICAL",
    gap: 16,
    w: 326,
  });

  fieldsSection.appendChild(createInputField("Email Address", "hello@gyan.design", false));
  fieldsSection.appendChild(createInputField("Password", "••••••••••••", true));

  const linkRow = createFrame({
    name: "Link Row",
    direction: "HORIZONTAL",
    w: 326,
    alignPrimary: "MAX",
  });
  linkRow.appendChild(
    createText({
      value: "Forgot password?",
      size: 12,
      line: 16,
      weight: "semibold",
      color: COLORS.burgundy,
    })
  );
  fieldsSection.appendChild(linkRow);

  screen.appendChild(fieldsSection);

  // 3. Actions
  const actionsSection = createFrame({
    name: "Actions Section",
    direction: "VERTICAL",
    gap: 20,
    w: 326,
    alignCounter: "CENTER",
  });

  actionsSection.appendChild(createPrimaryButton("Sign In"));
  actionsSection.appendChild(createOrDivider());

  const socialRow = createFrame({
    name: "Social Row",
    direction: "HORIZONTAL",
    gap: 18,
    w: 326,
    alignPrimary: "SPACE_BETWEEN",
  });

  socialRow.appendChild(createSocialButton("Google", "G", false));
  socialRow.appendChild(createSocialButton("Apple", "", true));
  
  actionsSection.appendChild(socialRow);
  screen.appendChild(actionsSection);

  // 4. Footer
  const footerRow = createFrame({
    name: "Footer Row",
    direction: "HORIZONTAL",
    gap: 4,
    w: 326,
    alignPrimary: "CENTER",
    alignCounter: "CENTER",
  });

  footerRow.appendChild(
    createText({
      value: "Don't have an account?",
      size: 12,
      line: 16,
      color: COLORS.textSoft,
    })
  );

  footerRow.appendChild(
    createText({
      value: "Sign up",
      size: 12,
      line: 16,
      weight: "bold",
      color: COLORS.burgundy,
    })
  );

  const footerContainer = createFrame({
    name: "Footer Wrapper",
    direction: "VERTICAL",
    w: 326,
    pt: 20,
    alignCounter: "CENTER",
  });
  footerContainer.appendChild(footerRow);
  screen.appendChild(footerContainer);

  board.appendChild(screen);

  board.primaryAxisSizingMode = "AUTO";
  board.counterAxisSizingMode = "AUTO";

  board.x = figma.viewport.center.x - 200;
  board.y = figma.viewport.center.y - 420;

  figma.currentPage.selection = [board];
  figma.viewport.scrollAndZoomIntoView([board]);

  console.log("Mobile Login UI successfully created.");
}

generateMobileLoginUI();
