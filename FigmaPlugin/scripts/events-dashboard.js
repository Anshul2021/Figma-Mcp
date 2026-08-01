// ======================================================
// FIGMA MOBILE EVENTS DASHBOARD GENERATOR
// Default font: Plus Jakarta Sans / Inter
// Generates a stunning, premium mobile dashboard for events
// ======================================================

async function generateMobileEventsDashboard() {
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
    
    pills: {
      designBg: "#FCEEF0",
      designText: "#7A1C2E",
      techBg: "#EEF2FF",
      techText: "#4F46E5",
      businessBg: "#EAF8EF",
      businessText: "#16A34A",
    }
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

  function createPill(label, bg, textColor) {
    const pill = createFrame({
      name: `Pill - ${label}`,
      direction: "HORIZONTAL",
      px: 12,
      py: 6,
      radius: 999,
      bg: bg || COLORS.burgundySoft,
      alignPrimary: "CENTER",
      alignCounter: "CENTER",
    });

    pill.appendChild(
      createText({
        value: label,
        size: 11,
        line: 14,
        weight: "semibold",
        color: textColor || COLORS.burgundy,
      })
    );

    return pill;
  }

  // --------------------------------------------------
  // UI SECTIONS & BUILDERS
  // --------------------------------------------------

  function createHeader() {
    const header = createFrame({
      name: "Header Bar",
      direction: "HORIZONTAL",
      w: 342,
      alignPrimary: "SPACE_BETWEEN",
      alignCounter: "CENTER",
    });

    const left = createFrame({
      name: "User Intro",
      direction: "VERTICAL",
      gap: 2,
    });

    left.appendChild(
      createText({
        value: "Welcome back,",
        size: 12,
        line: 16,
        color: COLORS.textSoft,
        weight: "medium",
      })
    );

    left.appendChild(
      createText({
        value: "Gyan Sharma",
        size: 18,
        line: 24,
        weight: "bold",
        color: COLORS.text,
      })
    );

    const right = createFrame({
      name: "Actions",
      direction: "HORIZONTAL",
      gap: 12,
      alignCounter: "CENTER",
    });

    const notif = createFrame({
      name: "Notification Bell",
      direction: "HORIZONTAL",
      w: 36,
      h: 36,
      radius: 999,
      bg: COLORS.surface,
      stroke: COLORS.border,
      alignPrimary: "CENTER",
      alignCounter: "CENTER",
    });
    notif.appendChild(createText({ value: "🔔", size: 14, line: 14 }));

    const avatar = createFrame({
      name: "Avatar",
      direction: "HORIZONTAL",
      w: 36,
      h: 36,
      radius: 999,
      bg: COLORS.burgundySoft,
      alignPrimary: "CENTER",
      alignCounter: "CENTER",
    });
    avatar.appendChild(
      createText({
        value: "GS",
        size: 12,
        line: 12,
        weight: "bold",
        color: COLORS.burgundy,
      })
    );

    right.appendChild(notif);
    right.appendChild(avatar);

    header.appendChild(left);
    header.appendChild(right);

    return header;
  }

  function createSearchField() {
    const field = createFrame({
      name: "Search Field",
      direction: "HORIZONTAL",
      gap: 10,
      px: 14,
      py: 12,
      radius: 14,
      bg: COLORS.surface,
      stroke: COLORS.border,
      w: 342,
      h: 44,
      alignCounter: "CENTER",
    });

    field.appendChild(createText({ value: "⌕", size: 16, line: 16, color: COLORS.textMuted }));
    field.appendChild(createText({ value: "Search events, topics...", size: 13, line: 18, color: COLORS.textMuted }));

    return field;
  }

  function createCategoryFilters() {
    const row = createFrame({
      name: "Category Filters",
      direction: "HORIZONTAL",
      gap: 8,
      w: 342,
    });

    row.appendChild(createPill("All", COLORS.burgundy, "#FFFFFF"));
    row.appendChild(createPill("Design", COLORS.pills.designBg, COLORS.pills.designText));
    row.appendChild(createPill("Technology", COLORS.pills.techBg, COLORS.pills.techText));
    row.appendChild(createPill("Business", COLORS.pills.businessBg, COLORS.pills.businessText));

    return row;
  }

  function createFeaturedEventCard() {
    const card = createFrame({
      name: "Featured Event",
      direction: "VERTICAL",
      gap: 12,
      px: 16,
      py: 16,
      radius: 24,
      bg: COLORS.burgundy,
      w: 342,
    });

    const badge = createFrame({
      name: "Featured Tag",
      direction: "HORIZONTAL",
      px: 8,
      py: 4,
      radius: 6,
      bg: "rgba(255, 255, 255, 0.15)",
    });
    badge.appendChild(createText({ value: "🔥 FEATURED EVENT", size: 9, line: 12, weight: "bold", color: "#FFFFFF" }));
    card.appendChild(badge);

    const titleSection = createFrame({
      name: "Titles",
      direction: "VERTICAL",
      gap: 6,
    });

    titleSection.appendChild(
      createText({
        value: "Design Systems Masterclass 2026",
        size: 20,
        line: 26,
        weight: "bold",
        color: "#FFFFFF",
      })
    );

    titleSection.appendChild(
      createText({
        value: "Learn to build multi-brand tokens and scale layouts directly inside Figma.",
        size: 12,
        line: 16,
        color: "rgba(255, 255, 255, 0.75)",
      })
    );

    card.appendChild(titleSection);

    const metaRow = createFrame({
      name: "Meta",
      direction: "HORIZONTAL",
      gap: 14,
    });

    metaRow.appendChild(createText({ value: "📅 June 12, 10:00 AM", size: 11, color: "#FFFFFF", weight: "semibold" }));
    metaRow.appendChild(createText({ value: "📍 Zoom Webinar", size: 11, color: "#FFFFFF", weight: "semibold" }));
    card.appendChild(metaRow);

    const bottom = createFrame({
      name: "Bottom bar",
      direction: "HORIZONTAL",
      w: 310,
      alignPrimary: "SPACE_BETWEEN",
      alignCounter: "CENTER",
    });

    bottom.appendChild(
      createText({
        value: "420 designers registered",
        size: 11,
        color: "rgba(255, 255, 255, 0.8)",
      })
    );

    const registerBtn = createFrame({
      name: "Register Button",
      direction: "HORIZONTAL",
      px: 12,
      py: 8,
      radius: 10,
      bg: "#FFFFFF",
      alignPrimary: "CENTER",
      alignCounter: "CENTER",
    });
    registerBtn.appendChild(createText({ value: "Secure Seat", size: 11, line: 14, weight: "bold", color: COLORS.burgundy }));
    bottom.appendChild(registerBtn);

    card.appendChild(bottom);

    return card;
  }

  function createUpcomingEventRow(title, date, attendees, category, pillBg, pillText) {
    const row = createFrame({
      name: "Event Row",
      direction: "HORIZONTAL",
      gap: 12,
      px: 12,
      py: 12,
      radius: 16,
      bg: COLORS.surface,
      stroke: COLORS.borderLight,
      w: 342,
      alignCounter: "CENTER",
    });

    const dateBox = createFrame({
      name: "Date Box",
      direction: "VERTICAL",
      w: 48,
      h: 48,
      radius: 12,
      bg: COLORS.burgundySoft,
      alignPrimary: "CENTER",
      alignCounter: "CENTER",
    });

    dateBox.appendChild(createText({ value: date.split(" ")[0].toUpperCase(), size: 10, line: 12, weight: "bold", color: COLORS.burgundy }));
    dateBox.appendChild(createText({ value: date.split(" ")[1], size: 14, line: 16, weight: "bold", color: COLORS.burgundy }));
    row.appendChild(dateBox);

    const content = createFrame({
      name: "Content",
      direction: "VERTICAL",
      gap: 4,
      w: 196,
    });

    content.appendChild(
      createText({
        value: title,
        size: 13,
        line: 18,
        weight: "bold",
        color: COLORS.text,
      })
    );

    const subMeta = createFrame({
      name: "Sub Meta",
      direction: "HORIZONTAL",
      gap: 8,
      alignCounter: "CENTER",
    });

    subMeta.appendChild(createPill(category, pillBg, pillText));
    subMeta.appendChild(createText({ value: `👥 ${attendees}`, size: 11, color: COLORS.textSoft }));
    content.appendChild(subMeta);

    row.appendChild(content);

    const arrow = createFrame({
      name: "Go Arrow",
      direction: "HORIZONTAL",
      w: 28,
      h: 28,
      radius: 999,
      bg: COLORS.bg,
      alignPrimary: "CENTER",
      alignCounter: "CENTER",
    });
    arrow.appendChild(createText({ value: "›", size: 16, line: 16, color: COLORS.textSoft }));
    row.appendChild(arrow);

    return row;
  }

  function createBottomNav() {
    const nav = createFrame({
      name: "Bottom Nav Bar",
      direction: "HORIZONTAL",
      px: 24,
      py: 12,
      radius: 20,
      bg: COLORS.surface,
      stroke: COLORS.borderLight,
      w: 342,
      alignPrimary: "SPACE_BETWEEN",
      alignCounter: "CENTER",
    });

    function createNavItem(icon, label, active) {
      const item = createFrame({
        name: `Nav - ${label}`,
        direction: "VERTICAL",
        gap: 4,
        alignCounter: "CENTER",
      });

      item.appendChild(
        createText({
          value: icon,
          size: 16,
          line: 16,
        })
      );

      item.appendChild(
        createText({
          value: label,
          size: 9,
          line: 12,
          weight: active ? "bold" : "medium",
          color: active ? COLORS.burgundy : COLORS.textSoft,
        })
      );

      return item;
    }

    nav.appendChild(createNavItem("🏠", "Home", true));
    nav.appendChild(createNavItem("🔍", "Explore", false));
    nav.appendChild(createNavItem("🔖", "Saved", false));
    nav.appendChild(createNavItem("👤", "Profile", false));

    return nav;
  }

  // --------------------------------------------------
  // MAIN WORKFLOW
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
    name: "Events Dashboard Screen",
    direction: "VERTICAL",
    gap: 16,
    px: 24,
    py: 32,
    radius: 36,
    bg: COLORS.bg,
    stroke: COLORS.border,
    w: 390,
    h: 844,
  });

  screen.clipsContent = true;

  screen.appendChild(createFrame({ name: "StatusBar Spacer", h: 12 }));

  screen.appendChild(createHeader());
  screen.appendChild(createSearchField());
  screen.appendChild(createCategoryFilters());
  screen.appendChild(createFeaturedEventCard());

  const secLabel = createFrame({
    name: "Section Label",
    direction: "HORIZONTAL",
    w: 342,
    alignPrimary: "SPACE_BETWEEN",
    alignCounter: "CENTER",
  });
  secLabel.appendChild(createText({ value: "Upcoming Events", size: 15, line: 20, weight: "bold", color: COLORS.text }));
  secLabel.appendChild(createText({ value: "See all", size: 12, line: 16, weight: "semibold", color: COLORS.burgundy }));
  screen.appendChild(secLabel);

  const listContainer = createFrame({
    name: "Events List",
    direction: "VERTICAL",
    gap: 8,
    w: 342,
  });

  listContainer.appendChild(
    createUpcomingEventRow(
      "AI & Component Co-Pilot Sync",
      "Jun 18",
      "128",
      "Technology",
      COLORS.pills.techBg,
      COLORS.pills.techText
    )
  );

  listContainer.appendChild(
    createUpcomingEventRow(
      "Brand Strategy for Startups",
      "Jun 22",
      "94",
      "Business",
      COLORS.pills.businessBg,
      COLORS.pills.businessText
    )
  );

  screen.appendChild(listContainer);

  const navContainer = createFrame({
    name: "Nav Container",
    direction: "VERTICAL",
    w: 342,
    pt: 8,
  });
  navContainer.appendChild(createBottomNav());
  screen.appendChild(navContainer);

  board.appendChild(screen);

  board.primaryAxisSizingMode = "AUTO";
  board.counterAxisSizingMode = "AUTO";

  board.x = figma.viewport.center.x - 200;
  board.y = figma.viewport.center.y - 420;

  figma.currentPage.selection = [board];
  figma.viewport.scrollAndZoomIntoView([board]);

  console.log("Events Dashboard UI successfully generated.");
}

generateMobileEventsDashboard();
