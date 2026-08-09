(async () => {
  // 1. Load Required Fonts (DM Sans - Strict EVEN typography scale)
  await figma.loadFontAsync({ family: "DM Sans", style: "Regular" });
  await figma.loadFontAsync({ family: "DM Sans", style: "Medium" });
  await figma.loadFontAsync({ family: "DM Sans", style: "Bold" });

  // 2. Color System Definition
  const COLORS = {
    textDark: { r: 0.059, g: 0.090, b: 0.165 },     // #0F172A
    textMuted: { r: 0.392, g: 0.455, b: 0.545 },    // #64748B
    searchBg: { r: 0.953, g: 0.957, b: 0.965 },     // #F3F4F6
    borderLight: { r: 0.886, g: 0.910, b: 0.941 },  // #E2E8F0
    white: { r: 1, g: 1, b: 1 },
    verifiedBlue: { r: 0.0, g: 0.584, b: 0.965 },   // #0095F6
    activeGreen: { r: 0.063, g: 0.725, b: 0.506 },   // #10B981
    unreadDot: { r: 0.0, g: 0.584, b: 0.965 },      // #0095F6
    noteBg: { r: 0.941, g: 0.953, b: 0.973 }
  };

  // 3. Icon Helper via Lucide SVG
  async function loadLucideIcon(iconName, size = 22, color = COLORS.textDark, strokeWidth = 1.6) {
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
    text.fontSize = fontSize;
    text.characters = String(content);
    text.fills = [{ type: 'SOLID', color }];
    return text;
  }

  // ==================================================================
  // STATIC ABSOLUTE LAYOUT FRAME CREATION (@skip-autolayout MODE)
  // ==================================================================

  const root = figma.createFrame();
  root.name = "Instagram_Direct_Messages_Static";
  root.resize(375, 812);
  root.fills = [{ type: 'SOLID', color: COLORS.white }];
  root.clipsContent = true;

  // ------------------------------------------------------------------
  // A. HEADER BAR (Absolute Y: 0 to 88)
  // ------------------------------------------------------------------
  const backIcon = await loadLucideIcon("chevron-left", 24, COLORS.textDark, 2.0);
  backIcon.x = 16; backIcon.y = 52;
  root.appendChild(backIcon);

  const accountTitle = createText("alexa_explores", 20, "Bold", COLORS.textDark);
  accountTitle.x = 48; accountTitle.y = 50;
  root.appendChild(accountTitle);

  const dropIcon = await loadLucideIcon("chevron-down", 18, COLORS.textDark, 2.0);
  dropIcon.x = 196; dropIcon.y = 54;
  root.appendChild(dropIcon);

  const videoIcon = await loadLucideIcon("video", 24, COLORS.textDark, 1.8);
  videoIcon.x = 295; videoIcon.y = 52;
  root.appendChild(videoIcon);

  const editIcon = await loadLucideIcon("square-pen", 22, COLORS.textDark, 1.8);
  editIcon.x = 335; editIcon.y = 53;
  root.appendChild(editIcon);

  // ------------------------------------------------------------------
  // B. SEARCH INPUT BAR (Absolute Y: 96)
  // ------------------------------------------------------------------
  const searchBg = figma.createFrame();
  searchBg.name = "Search_Bar_Bg";
  searchBg.resize(343, 38);
  searchBg.x = 16; searchBg.y = 96;
  searchBg.cornerRadius = 10;
  searchBg.fills = [{ type: 'SOLID', color: COLORS.searchBg }];
  root.appendChild(searchBg);

  const searchIcon = await loadLucideIcon("search", 18, COLORS.textMuted, 1.8);
  searchIcon.x = 28; searchIcon.y = 106;
  root.appendChild(searchIcon);

  const searchTxt = createText("Search messages or accounts", 14, "Regular", COLORS.textMuted);
  searchTxt.x = 54; searchTxt.y = 105;
  root.appendChild(searchTxt);

  // ------------------------------------------------------------------
  // C. ACTIVE NOTES TRAY (Absolute Y: 150)
  // ------------------------------------------------------------------
  const notesData = [
    { name: "Your note", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", note: "Share a thought...", isUser: true, x: 16 },
    { name: "sarah_m", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", note: "Coffee & code ☕️", isUser: false, x: 104 },
    { name: "david_v", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", note: "Bali bound! ✈️", isUser: false, x: 192 },
    { name: "elena_r", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80", note: "New reel live 🎬", isUser: false, x: 280 }
  ];

  for (const n of notesData) {
    // Note Bubble
    const bubble = figma.createFrame();
    bubble.name = "Bubble";
    bubble.resize(76, 24);
    bubble.x = n.x - 4; bubble.y = 148;
    bubble.cornerRadius = 12;
    bubble.fills = [{ type: 'SOLID', color: COLORS.noteBg }];
    root.appendChild(bubble);

    const bText = createText(n.note.length > 11 ? n.note.substring(0, 9) + ".." : n.note, 10, n.isUser ? "Regular" : "Medium", n.isUser ? COLORS.textMuted : COLORS.textDark);
    bText.x = n.x + 2; bText.y = 153;
    root.appendChild(bText);

    // Avatar Circle
    const av = figma.createFrame();
    av.name = "Note_Avatar";
    av.resize(60, 60);
    av.x = n.x + 4; av.y = 178;
    av.cornerRadius = 999;
    root.appendChild(av);
    await applyOnlineImage(av, n.avatar);

    if (n.isUser) {
      const pDot = figma.createFrame();
      pDot.name = "Plus_Badge"; pDot.resize(20, 20); pDot.cornerRadius = 999;
      pDot.x = n.x + 44; pDot.y = 218;
      pDot.fills = [{ type: 'SOLID', color: COLORS.searchBg }];
      pDot.strokes = [{ type: 'SOLID', color: COLORS.white }];
      pDot.strokeWeight = 2;
      root.appendChild(pDot);

      const pIcon = await loadLucideIcon("plus", 12, COLORS.textMuted, 2.0);
      pIcon.x = n.x + 48; pIcon.y = 222;
      root.appendChild(pIcon);
    } else {
      const aDot = figma.createFrame();
      aDot.name = "Active_Dot"; aDot.resize(14, 14); aDot.cornerRadius = 999;
      aDot.x = n.x + 48; aDot.y = 222;
      aDot.fills = [{ type: 'SOLID', color: COLORS.activeGreen }];
      aDot.strokes = [{ type: 'SOLID', color: COLORS.white }];
      aDot.strokeWeight = 2;
      root.appendChild(aDot);
    }

    const nameTxt = createText(n.name, 10, "Regular", COLORS.textMuted);
    nameTxt.x = n.x + 12; nameTxt.y = 244;
    root.appendChild(nameTxt);
  }

  // ------------------------------------------------------------------
  // D. TAB BAR (Primary, General, Requests) (Absolute Y: 270)
  // ------------------------------------------------------------------
  const primTxt = createText("Primary", 14, "Bold", COLORS.textDark);
  primTxt.x = 16; primTxt.y = 270;
  root.appendChild(primTxt);

  const actLine = figma.createFrame();
  actLine.name = "Active_Line"; actLine.resize(52, 2);
  actLine.x = 16; actLine.y = 292;
  actLine.fills = [{ type: 'SOLID', color: COLORS.textDark }];
  root.appendChild(actLine);

  const genTxt = createText("General", 14, "Medium", COLORS.textMuted);
  genTxt.x = 88; genTxt.y = 270;
  root.appendChild(genTxt);

  const reqTxt = createText("Requests (2)", 14, "Medium", COLORS.verifiedBlue);
  reqTxt.x = 275; reqTxt.y = 270;
  root.appendChild(reqTxt);

  // ------------------------------------------------------------------
  // E. CONVERSATIONS LIST (Absolute Y: 308 to 780)
  // ------------------------------------------------------------------
  const threads = [
    { name: "Marcus Vance", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", msg: "Sent a reel by travel_bug • 2m", unread: true, verified: false, y: 308 },
    { name: "Jessica Chen", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", msg: "Sounds great! See you at 7pm 👋", unread: true, verified: true, y: 380 },
    { name: "Studio Design Co", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80", msg: "Liked your message • 1h", unread: false, verified: true, y: 452 },
    { name: "Liam O'Connor", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80", msg: "Did you check out the new design system?", unread: false, verified: false, y: 524 },
    { name: "Sophia Martinez", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80", msg: "Active 4h ago", unread: false, verified: false, y: 596 },
    { name: "Alex Rivers", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80", msg: "Shared a post • 1d", unread: false, verified: false, y: 668 }
  ];

  for (const t of threads) {
    // Avatar
    const avFrame = figma.createFrame();
    avFrame.name = "Avatar"; avFrame.resize(52, 52);
    avFrame.x = 16; avFrame.y = t.y;
    avFrame.cornerRadius = 999;
    root.appendChild(avFrame);
    await applyOnlineImage(avFrame, t.avatar);

    // Name
    const nameTxt = createText(t.name, 14, t.unread ? "Bold" : "Medium", COLORS.textDark);
    nameTxt.x = 80; nameTxt.y = t.y + 6;
    root.appendChild(nameTxt);

    if (t.verified) {
      const vBadge = await loadLucideIcon("badge-check", 14, COLORS.verifiedBlue, 1.5);
      vBadge.x = 80 + t.name.length * 8; vBadge.y = t.y + 8;
      root.appendChild(vBadge);
    }

    // Message Subtitle
    const msgTxt = createText(t.msg, 12, t.unread ? "Bold" : "Regular", t.unread ? COLORS.textDark : COLORS.textMuted);
    msgTxt.x = 80; msgTxt.y = t.y + 28;
    root.appendChild(msgTxt);

    // Right Camera / Unread Dot
    if (t.unread) {
      const uDot = figma.createFrame();
      uDot.name = "Unread_Dot"; uDot.resize(8, 8); uDot.cornerRadius = 999;
      uDot.x = 312; uDot.y = t.y + 22;
      uDot.fills = [{ type: 'SOLID', color: COLORS.unreadDot }];
      root.appendChild(uDot);
    }

    const camIcon = await loadLucideIcon("camera", 20, COLORS.textMuted, 1.8);
    camIcon.x = 335; camIcon.y = t.y + 16;
    root.appendChild(camIcon);
  }

  // 7. Select & Focus Canvas
  figma.currentPage.selection = [root];
  figma.viewport.scrollAndZoomIntoView([root]);

  console.log("Successfully generated Instagram Direct Messages screen (Static Mode)!");
})();
