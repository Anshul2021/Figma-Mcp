// ======================================================
// EVENT DASHBOARD — ATTENDEE QUESTIONS MOBILE UI
// Default font: Plus Jakarta Sans / Inter
// Generates 2 mobile screens:
// 1. By Question overview (Required: Bar charts, Optional: Burgundy Donut Charts)
// 2. Text question detail screen (Burgundy themed optional question detail)
// ======================================================

async function generateAttendeeQuestionsMobileUI() {
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
  // TOKENS (Premium Burgundy Theme Added for Optional Qs)
  // --------------------------------------------------

  const COLORS = {
    bg: "#F8F7F6",
    surface: "#FFFFFF",
    surfaceSoft: "#FAF5F6", // Soft Burgundy background for optional cards
    border: "#E8E3E4", // Soft Burgundy border for optional cards
    borderDefault: "#E8E5E1", // Original border

    text: "#1F1A1B", // Dark charcoal with a hint of red
    textSoft: "#706063", // Muted burgundy-tinted gray
    textMuted: "#A39295", // Lighter muted burgundy-tinted gray

    accent: "#FF8A1F",
    accentSoft: "#FFF1E4",
    accentDeep: "#E66E00",

    blue: "#4F46E5",
    blueSoft: "#EEF2FF",

    green: "#16A34A",
    greenSoft: "#EAF8EF",

    yellow: "#CA8A04",
    yellowSoft: "#FFF8DB",

    // Burgundy Theme Tokens (for optional cards)
    burgundy: "#7A1C2E", // Main Burgundy brand color
    burgundySoft: "#FCEEF0", // Light Burgundy accent tint
    burgundyDeep: "#5A111F", // Deepest Burgundy for text highlights
    burgundyMuted: "#B88E96", // Muted Burgundy pink
    burgundyBorder: "#EAD5D8", // Border for Burgundy elements

    // Burgundy Chart Color Ring (from deep to soft)
    burgundyChart: [
      "#6B1624", // Deep Burgundy
      "#8E2437", // Mid Burgundy
      "#B54256", // Rose Berry
      "#D47284", // Soft Rose
      "#EBA2AF", // Pink Tint
    ],

    chip: "#F1EFEC",
    tabBg: "#F0EEEA",
    divider: "#ECE9E5",
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

  function createIconCircle(symbol, size, isBurgundy) {
    const wrap = createFrame({
      name: "Icon Circle",
      direction: "HORIZONTAL",
      w: size || 36,
      h: size || 36,
      radius: 999,
      bg: COLORS.surface,
      stroke: isBurgundy ? COLORS.burgundyBorder : COLORS.borderDefault,
      alignPrimary: "CENTER",
      alignCounter: "CENTER",
    });

    wrap.appendChild(
      createText({
        value: symbol,
        size: 14,
        line: 18,
        weight: "semibold",
        color: isBurgundy ? COLORS.burgundy : COLORS.text,
      })
    );

    return wrap;
  }

  function createPill(label, bg, textColor) {
    const pill = createFrame({
      name: "Pill",
      direction: "HORIZONTAL",
      px: 10,
      py: 4,
      radius: 999,
      bg: bg || COLORS.chip,
      alignPrimary: "CENTER",
      alignCounter: "CENTER",
    });

    pill.appendChild(
      createText({
        value: label,
        size: 11,
        line: 14,
        weight: "medium",
        color: textColor || COLORS.textSoft,
      })
    );

    return pill;
  }

  function createDivider(width) {
    const d = figma.createFrame();
    d.name = "Divider";
    d.resize(width || 318, 1);
    d.fills = [solid(COLORS.divider)];
    d.strokes = [];
    return d;
  }

  function createButton(label, filled, customBg, customTextColor) {
    const btn = createFrame({
      name: "Button",
      direction: "HORIZONTAL",
      px: 14,
      py: 10,
      radius: 12,
      bg: filled ? (customBg || COLORS.accent) : COLORS.surface,
      stroke: filled ? null : COLORS.borderDefault,
      alignPrimary: "CENTER",
      alignCounter: "CENTER",
      gap: 6,
    });

    btn.appendChild(
      createText({
        value: label,
        size: 13,
        line: 18,
        weight: "semibold",
        color: filled ? (customTextColor || "#FFFFFF") : COLORS.text,
      })
    );

    return btn;
  }

  function createTab(label, active, width) {
    const tab = createFrame({
      name: "Tab · " + label,
      direction: "HORIZONTAL",
      px: 14,
      py: 10,
      radius: 12,
      bg: active ? COLORS.surface : undefined,
      w: width || 100,
      h: 38,
      alignPrimary: "CENTER",
      alignCounter: "CENTER",
    });

    if (!active) {
      tab.fills = [];
    } else {
      tab.fills = [solid(COLORS.surface)];
    }

    tab.appendChild(
      createText({
        value: label,
        size: 13,
        line: 18,
        weight: active ? "semibold" : "medium",
        color: active ? COLORS.text : COLORS.textSoft,
      })
    );

    return tab;
  }

  function createSegmentedTabs() {
    const wrap = createFrame({
      name: "Segmented Tabs",
      direction: "HORIZONTAL",
      gap: 6,
      px: 6,
      py: 6,
      radius: 16,
      bg: COLORS.tabBg,
      w: 342,
      h: 50,
      alignCounter: "CENTER",
    });

    wrap.appendChild(createTab("Summary", false, 102));
    wrap.appendChild(createTab("By Question", true, 110));
    wrap.appendChild(createTab("By Attendee", false, 112));

    return wrap;
  }

  function createSummaryCard(title, value, tone) {
    const toneMap = {
      orange: { bg: COLORS.accentSoft, value: COLORS.accentDeep },
      blue: { bg: COLORS.blueSoft, value: COLORS.blue },
      green: { bg: COLORS.greenSoft, value: COLORS.green },
      yellow: { bg: COLORS.yellowSoft, value: COLORS.yellow },
      burgundy: { bg: COLORS.burgundySoft, value: COLORS.burgundy },
    };

    const t = toneMap[tone] || toneMap.orange;

    const card = createFrame({
      name: "Summary Card",
      direction: "VERTICAL",
      gap: 6,
      px: 14,
      py: 12,
      radius: 18,
      bg: COLORS.surface,
      stroke: COLORS.borderDefault,
      w: 165,
      h: 76,
    });

    card.appendChild(
      createText({
        value: title,
        size: 11,
        line: 14,
        weight: "medium",
        color: COLORS.textSoft,
        width: 137,
      })
    );

    card.appendChild(
      createText({
        value: value,
        size: 24,
        line: 28,
        weight: "bold",
        color: t.value,
      })
    );

    return card;
  }

  function createBarRow(label, pct, color, width) {
    const root = createFrame({
      name: "Bar Row",
      direction: "VERTICAL",
      gap: 6,
      w: width || 310,
    });

    const top = createFrame({
      name: "Top",
      direction: "HORIZONTAL",
      w: width || 310,
      alignPrimary: "SPACE_BETWEEN",
      alignCounter: "CENTER",
    });

    top.appendChild(
      createText({
        value: label,
        size: 12,
        line: 16,
        weight: "medium",
        color: COLORS.text,
      })
    );

    top.appendChild(
      createText({
        value: pct + "%",
        size: 12,
        line: 16,
        weight: "semibold",
        color: COLORS.textSoft,
      })
    );

    const track = createFrame({
      name: "Track",
      direction: "HORIZONTAL",
      w: width || 310,
      h: 6,
      radius: 999,
      bg: COLORS.chip,
      clipsContent: true,
    });

    const fill = figma.createFrame();
    fill.name = "Fill";
    fill.resize(Math.max(12, Math.round((width || 310) * pct / 100)), 6);
    fill.cornerRadius = 999;
    fill.fills = [solid(color)];
    fill.strokes = [];

    track.appendChild(fill);

    root.appendChild(top);
    root.appendChild(track);

    return root;
  }

  // --------------------------------------------------
  // PIE & DONUT CHART HELPERS
  // --------------------------------------------------

  function createPieChart(data, size) {
    const group = figma.createFrame();
    group.name = "Pie Chart";
    group.layoutMode = "NONE";
    group.resize(size, size);
    group.fills = [];
    group.strokes = [];

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -Math.PI / 2;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item.value <= 0) continue;

      const percentage = item.value / total;
      const angleDelta = percentage * 2 * Math.PI;

      const slice = figma.createEllipse();
      slice.name = "Slice · " + item.label;
      slice.resize(size, size);
      slice.x = 0;
      slice.y = 0;
      slice.fills = [solid(item.color)];
      slice.strokes = [];
      
      slice.arcData = {
        startingAngle: currentAngle,
        endingAngle: currentAngle + angleDelta,
        innerRadius: 0.55,
      };

      group.appendChild(slice);
      currentAngle += angleDelta;
    }

    return group;
  }

  function createPieChartWithLegend(data, width) {
    const row = createFrame({
      name: "Pie Chart Wrap",
      direction: "HORIZONTAL",
      gap: 16,
      w: width || 310,
      alignCounter: "CENTER",
    });

    const chartSize = 88;
    const chart = createPieChart(data, chartSize);
    
    chart.resize(chartSize, chartSize);
    chart.counterAxisSizingMode = "FIXED";
    chart.primaryAxisSizingMode = "FIXED";
    
    row.appendChild(chart);

    const legend = createFrame({
      name: "Legend",
      direction: "VERTICAL",
      gap: 6,
      w: (width || 310) - chartSize - 16,
    });

    data.forEach(item => {
      const legRow = createFrame({
        name: "Legend Row",
        direction: "HORIZONTAL",
        gap: 8,
        alignCounter: "CENTER",
      });

      const dot = figma.createFrame();
      dot.name = "Dot";
      dot.resize(8, 8);
      dot.cornerRadius = 999;
      dot.fills = [solid(item.color)];
      dot.strokes = [];
      
      dot.counterAxisSizingMode = "FIXED";
      dot.primaryAxisSizingMode = "FIXED";
      
      legRow.appendChild(dot);

      legRow.appendChild(
        createText({
          value: `${item.label} (${item.value}%)`,
          size: 11,
          line: 14,
          weight: "medium",
          color: COLORS.textSoft,
        })
      );

      legend.appendChild(legRow);
    });

    row.appendChild(legend);
    return row;
  }

  function createAvatar(initials, bg, textColor) {
    const avatar = createFrame({
      name: "Avatar",
      direction: "HORIZONTAL",
      w: 32,
      h: 32,
      radius: 999,
      bg: bg || COLORS.blueSoft,
      alignPrimary: "CENTER",
      alignCounter: "CENTER",
    });

    avatar.appendChild(
      createText({
        value: initials,
        size: 11,
        line: 14,
        weight: "bold",
        color: textColor || COLORS.text,
      })
    );

    return avatar;
  }

  function createResponseRow(initials, name, response, avatarBg, avatarTextColor) {
    const row = createFrame({
      name: "Response Row",
      direction: "HORIZONTAL",
      gap: 12,
      w: 310,
      alignCounter: "START",
    });

    row.appendChild(createAvatar(initials, avatarBg, avatarTextColor));

    const copy = createFrame({
      name: "Copy",
      direction: "VERTICAL",
      gap: 4,
      w: 266,
    });

    copy.appendChild(
      createText({
        value: name,
        size: 13,
        line: 18,
        weight: "semibold",
        color: COLORS.text,
      })
    );

    copy.appendChild(
      createText({
        value: response,
        size: 12,
        line: 18,
        color: COLORS.textSoft,
        width: 266,
      })
    );

    row.appendChild(copy);
    return row;
  }

  function createQuestionCardHeader(title, typeLabel, reqLabel, answeredText, isOptional) {
    const root = createFrame({
      name: "Question Header",
      direction: "VERTICAL",
      gap: 10,
      w: 310,
    });

    root.appendChild(
      createText({
        value: title,
        size: 16,
        line: 22,
        weight: "bold",
        color: isOptional ? COLORS.burgundyDeep : COLORS.text,
        width: 310,
      })
    );

    const meta = createFrame({
      name: "Meta",
      direction: "HORIZONTAL",
      gap: 8,
      alignCounter: "CENTER",
    });

    if (isOptional) {
      meta.appendChild(createPill(typeLabel, COLORS.burgundySoft, COLORS.burgundy));
      meta.appendChild(createPill(reqLabel, "#FDF6F7", COLORS.burgundyMuted));
    } else {
      meta.appendChild(createPill(typeLabel, COLORS.chip, COLORS.textSoft));
      meta.appendChild(createPill(reqLabel, COLORS.surfaceSoft, COLORS.textSoft));
    }

    root.appendChild(meta);

    root.appendChild(
      createText({
        value: answeredText,
        size: 11,
        line: 14,
        weight: "medium",
        color: isOptional ? COLORS.burgundyMuted : COLORS.textMuted,
      })
    );

    return root;
  }

  function createChoiceQuestionCard() {
    const card = createFrame({
      name: "Choice Question Card",
      direction: "VERTICAL",
      gap: 16,
      px: 16,
      py: 16,
      radius: 22,
      bg: COLORS.surface,
      stroke: COLORS.borderDefault,
      w: 342,
    });

    card.appendChild(
      createQuestionCardHeader(
        "What is your role?",
        "Multiple choice",
        "Required",
        "38 / 42 answered",
        false
      )
    );

    card.appendChild(createBarRow("Product Designer", 45, COLORS.accent, 310));
    card.appendChild(createBarRow("Developer", 25, COLORS.blue, 310));
    card.appendChild(createBarRow("Founder", 18, COLORS.green, 310));
    card.appendChild(createBarRow("Student", 12, COLORS.yellow, 310));

    return card;
  }

  function createSubjectiveQuestionCard() {
    const card = createFrame({
      name: "Subjective Question Card",
      direction: "VERTICAL",
      gap: 16,
      px: 16,
      py: 16,
      radius: 22,
      bg: COLORS.surfaceSoft,
      stroke: COLORS.border,
      w: 342,
    });

    card.appendChild(
      createQuestionCardHeader(
        "Why are you attending this workshop?",
        "Short answer",
        "Optional",
        "31 / 42 answered",
        true
      )
    );

    const themeData = [
      { label: "Portfolio Projects", value: 40, color: COLORS.burgundyChart[0] },
      { label: "Design Systems", value: 30, color: COLORS.burgundyChart[1] },
      { label: "Career Growth", value: 20, color: COLORS.burgundyChart[2] },
      { label: "Figma Skills", value: 10, color: COLORS.burgundyChart[3] },
    ];

    card.appendChild(createPieChartWithLegend(themeData, 310));

    const actions = createFrame({
      name: "Actions",
      direction: "HORIZONTAL",
      w: 310,
      alignPrimary: "SPACE_BETWEEN",
      alignCounter: "CENTER",
    });

    actions.appendChild(
      createText({
        value: "View all responses",
        size: 12,
        line: 16,
        weight: "semibold",
        color: COLORS.burgundy,
      })
    );

    actions.appendChild(createIconCircle("›", 24, true));

    card.appendChild(actions);

    return card;
  }

  function createYesNoCard() {
    const card = createFrame({
      name: "Yes No Card",
      direction: "VERTICAL",
      gap: 16,
      px: 16,
      py: 16,
      radius: 22,
      bg: COLORS.surfaceSoft,
      stroke: COLORS.border,
      w: 342,
    });

    card.appendChild(
      createQuestionCardHeader(
        "Do you need any special assistance?",
        "Yes / No",
        "Optional",
        "12 / 42 answered",
        true
      )
    );

    const yesNoData = [
      { label: "No (not needed)", value: 83, color: COLORS.burgundyChart[2] },
      { label: "Yes (assistance needed)", value: 17, color: COLORS.burgundyChart[0] },
    ];

    card.appendChild(createPieChartWithLegend(yesNoData, 310));

    return card;
  }

  function createSearchField(placeholder, width) {
    const field = createFrame({
      name: "Search Field",
      direction: "HORIZONTAL",
      gap: 10,
      px: 12,
      py: 10,
      radius: 14,
      bg: COLORS.surface,
      stroke: COLORS.borderDefault,
      w: width || 310,
      h: 40,
      alignCounter: "CENTER",
    });

    field.appendChild(
      createText({
        value: "⌕",
        size: 14,
        line: 18,
        weight: "semibold",
        color: COLORS.textMuted,
      })
    );

    field.appendChild(
      createText({
        value: placeholder,
        size: 13,
        line: 18,
        color: COLORS.textMuted,
      })
    );

    return field;
  }

  function createHeader(title) {
    const root = createFrame({
      name: "Header",
      direction: "VERTICAL",
      gap: 14,
      w: 342,
    });

    const top = createFrame({
      name: "Top Row",
      direction: "HORIZONTAL",
      w: 342,
      alignPrimary: "SPACE_BETWEEN",
      alignCounter: "CENTER",
    });

    const left = createFrame({
      name: "Left",
      direction: "HORIZONTAL",
      gap: 12,
      alignCounter: "CENTER",
    });

    left.appendChild(createIconCircle("←", 36));

    const titleWrap = createFrame({
      name: "Title Wrap",
      direction: "VERTICAL",
      gap: 2,
    });

    titleWrap.appendChild(
      createText({
        value: "Design Systems Workshop",
        size: 20,
        line: 26,
        weight: "bold",
        color: COLORS.text,
      })
    );

    titleWrap.appendChild(
      createText({
        value: title,
        size: 12,
        line: 16,
        weight: "medium",
        color: COLORS.textSoft,
      })
    );

    left.appendChild(titleWrap);
    top.appendChild(left);
    top.appendChild(createIconCircle("⋯", 36));

    root.appendChild(top);
    return root;
  }

  function createMobileScreen(screenName) {
    const screen = createFrame({
      name: screenName,
      direction: "VERTICAL",
      gap: 16,
      px: 24,
      py: 24,
      radius: 28,
      bg: COLORS.bg,
      stroke: COLORS.borderDefault,
      w: 390,
    });

    screen.clipsContent = true;
    return screen;
  }

  // --------------------------------------------------
  // MAIN WORKFLOW (Active Page Drawing)
  // --------------------------------------------------

  const page = figma.currentPage;

  const board = createFrame({
    name: "Board",
    direction: "HORIZONTAL",
    gap: 40,
    px: 40,
    py: 40,
    bg: "#FFFFFF",
  });

  page.appendChild(board);

  // --------------------------------------------------
  // SCREEN 1 — BY QUESTION OVERVIEW
  // --------------------------------------------------

  const screen1 = createMobileScreen("Screen 1 · By Question");

  screen1.appendChild(createHeader("Attendee Questions"));
  screen1.appendChild(createSegmentedTabs());

  const summaryTitle = createFrame({
    name: "Summary Heading",
    direction: "VERTICAL",
    gap: 4,
    w: 342,
  });

  summaryTitle.appendChild(
    createText({
      value: "Quick Summary",
      size: 18,
      line: 24,
      weight: "bold",
      color: COLORS.text,
    })
  );

  summaryTitle.appendChild(
    createText({
      value: "Understand attendance patterns and question completion at a glance.",
      size: 12,
      line: 18,
      color: COLORS.textSoft,
      width: 330,
    })
  );

  screen1.appendChild(summaryTitle);

  const statsWrap = createFrame({
    name: "Stats Wrap",
    direction: "VERTICAL",
    gap: 12,
    w: 342,
  });

  const statsRow1 = createFrame({
    name: "Stats Row 1",
    direction: "HORIZONTAL",
    gap: 12,
  });

  const statsRow2 = createFrame({
    name: "Stats Row 2",
    direction: "HORIZONTAL",
    gap: 12,
  });

  statsRow1.appendChild(createSummaryCard("Total attendees", "42", "orange"));
  statsRow1.appendChild(createSummaryCard("Questions asked", "5", "blue"));

  statsRow2.appendChild(createSummaryCard("Completion rate", "74%", "green"));
  statsRow2.appendChild(createSummaryCard("Required answered", "92%", "yellow"));

  statsWrap.appendChild(statsRow1);
  statsWrap.appendChild(statsRow2);

  screen1.appendChild(statsWrap);

  const qHeading = createFrame({
    name: "Question List Heading",
    direction: "HORIZONTAL",
    w: 342,
    alignPrimary: "SPACE_BETWEEN",
    alignCounter: "CENTER",
  });

  const qHeadingCopy = createFrame({
    name: "Copy",
    direction: "VERTICAL",
    gap: 2,
  });

  qHeadingCopy.appendChild(
    createText({
      value: "Questions",
      size: 18,
      line: 24,
      weight: "bold",
      color: COLORS.text,
    })
  );

  qHeadingCopy.appendChild(
    createText({
      value: "Default view: By Question",
      size: 12,
      line: 16,
      color: COLORS.textSoft,
    })
  );

  qHeading.appendChild(qHeadingCopy);
  qHeading.appendChild(createButton("Export CSV", false));

  screen1.appendChild(qHeading);
  screen1.appendChild(createChoiceQuestionCard());
  screen1.appendChild(createSubjectiveQuestionCard());
  screen1.appendChild(createYesNoCard());

  // --------------------------------------------------
  // SCREEN 2 — SUBJECTIVE QUESTION DETAIL
  // --------------------------------------------------

  const screen2 = createMobileScreen("Screen 2 · Text Question Detail");

  screen2.appendChild(createHeader("Question Detail"));

  const detailTitle = createFrame({
    name: "Detail Title",
    direction: "VERTICAL",
    gap: 10,
    w: 342,
    px: 0,
    py: 0,
  });

  detailTitle.appendChild(
    createText({
      value: "Why are you attending this workshop?",
      size: 18,
      line: 24,
      weight: "bold",
      color: COLORS.burgundyDeep,
      width: 342,
    })
  );

  const metaRow = createFrame({
    name: "Meta Row",
    direction: "HORIZONTAL",
    gap: 8,
  });

  metaRow.appendChild(createPill("Short answer", COLORS.burgundySoft, COLORS.burgundy));
  metaRow.appendChild(createPill("Optional", "#FDF6F7", COLORS.burgundyMuted));
  metaRow.appendChild(createPill("31 responses", COLORS.burgundySoft, COLORS.burgundyDeep));

  detailTitle.appendChild(metaRow);
  screen2.appendChild(detailTitle);

  const aiCard = createFrame({
    name: "AI Summary Card",
    direction: "VERTICAL",
    gap: 10,
    px: 16,
    py: 16,
    radius: 20,
    bg: COLORS.burgundySoft,
    w: 342,
  });

  aiCard.appendChild(
    createText({
      value: "AI Summary",
      size: 12,
      line: 16,
      weight: "bold",
      color: COLORS.burgundy,
    })
  );

  aiCard.appendChild(
    createText({
      value: "Most attendees are here to improve design system knowledge for day-to-day work, portfolio case studies, collaboration with developers, and stronger component usage in Figma.",
      size: 13,
      line: 19,
      color: COLORS.burgundyDeep,
      width: 310,
    })
  );

  screen2.appendChild(aiCard);

  const keywordWrap = createFrame({
    name: "Keyword Section",
    direction: "VERTICAL",
    gap: 10,
    w: 342,
  });

  keywordWrap.appendChild(
    createText({
      value: "Common themes",
      size: 14,
      line: 20,
      weight: "semibold",
      color: COLORS.text,
    })
  );

  const keywordChips1 = createFrame({
    name: "Keyword Chips 1",
    direction: "HORIZONTAL",
    gap: 8,
  });

  keywordChips1.appendChild(createPill("Portfolio", COLORS.burgundySoft, COLORS.burgundy));
  keywordChips1.appendChild(createPill("Design System", COLORS.burgundySoft, COLORS.burgundyDeep));
  keywordChips1.appendChild(createPill("Career", "#FDF6F7", COLORS.burgundyMuted));

  const keywordChips2 = createFrame({
    name: "Keyword Chips 2",
    direction: "HORIZONTAL",
    gap: 8,
  });

  keywordChips2.appendChild(createPill("Figma", COLORS.chip, COLORS.textSoft));
  keywordChips2.appendChild(createPill("Scalable components", COLORS.chip, COLORS.textSoft));
  keywordChips2.appendChild(createPill("Team collaboration", COLORS.chip, COLORS.textSoft));

  keywordWrap.appendChild(keywordChips1);
  keywordWrap.appendChild(keywordChips2);

  screen2.appendChild(keywordWrap);
  screen2.appendChild(createSearchField("Search responses...", 342));

  const responsesCard = createFrame({
    name: "Responses Card",
    direction: "VERTICAL",
    gap: 14,
    px: 16,
    py: 16,
    radius: 22,
    bg: COLORS.surface,
    stroke: COLORS.borderDefault,
    w: 342,
  });

  const responseHead = createFrame({
    name: "Response Head",
    direction: "HORIZONTAL",
    w: 310,
    alignPrimary: "SPACE_BETWEEN",
    alignCounter: "CENTER",
  });

  responseHead.appendChild(
    createText({
      value: "Responses",
      size: 16,
      line: 22,
      weight: "bold",
      color: COLORS.text,
    })
  );

  responseHead.appendChild(
    createText({
      value: "View all",
      size: 13,
      line: 18,
      weight: "semibold",
      color: COLORS.burgundy,
    })
  );

  responsesCard.appendChild(responseHead);
  
  responsesCard.appendChild(
    createResponseRow(
      "SC",
      "Sarah Chen",
      "Want to understand how to build scalable components.",
      COLORS.burgundySoft,
      COLORS.burgundyDeep
    )
  );
  responsesCard.appendChild(createDivider(310));
  
  responsesCard.appendChild(
    createResponseRow(
      "AR",
      "Alex Rivera",
      "I work with designers and want to understand their system better.",
      "#FDF6F7",
      COLORS.burgundy
    )
  );
  responsesCard.appendChild(createDivider(310));
  
  responsesCard.appendChild(
    createResponseRow(
      "JK",
      "Jordan Kim",
      "I am building my portfolio and want stronger design system fundamentals.",
      COLORS.burgundySoft,
      COLORS.burgundyDeep
    )
  );
  responsesCard.appendChild(createDivider(310));
  
  responsesCard.appendChild(
    createResponseRow(
      "MP",
      "Maya Patel",
      "Looking for practical ways to organize components and documentation.",
      "#FDF6F7",
      COLORS.burgundy
    )
  );

  screen2.appendChild(responsesCard);

  const footerActions = createFrame({
    name: "Footer Actions",
    direction: "HORIZONTAL",
    gap: 10,
    w: 342,
  });

  const exportBtn = createButton("Export CSV", false);
  exportBtn.resize(108, exportBtn.height);

  const attendeeBtn = createButton("Filter by attendee", true, COLORS.burgundy, "#FFFFFF");
  attendeeBtn.resize(224, attendeeBtn.height);

  footerActions.appendChild(exportBtn);
  footerActions.appendChild(attendeeBtn);

  screen2.appendChild(footerActions);

  // --------------------------------------------------
  // APPEND TO BOARD
  // --------------------------------------------------

  board.appendChild(screen1);
  board.appendChild(screen2);

  board.primaryAxisSizingMode = "AUTO";
  board.counterAxisSizingMode = "AUTO";

  board.x = figma.viewport.center.x - 450;
  board.y = figma.viewport.center.y - 420;

  figma.currentPage.selection = [board];
  figma.viewport.scrollAndZoomIntoView([board]);

  console.log("Attendee Questions mobile UI generated successfully.");
}

generateAttendeeQuestionsMobileUI();