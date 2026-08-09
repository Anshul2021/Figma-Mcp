(async () => {
  // 1. Load Required Fonts (DM Sans - Strict EVEN typography scale)
  await figma.loadFontAsync({ family: "DM Sans", style: "Regular" });
  await figma.loadFontAsync({ family: "DM Sans", style: "Medium" });
  await figma.loadFontAsync({ family: "DM Sans", style: "Bold" });

  // 2. Color System Definition (Instagram DM Theme)
  const COLORS = {
    textDark: { r: 0.059, g: 0.090, b: 0.165 },     // #0F172A Usernames & titles
    textMuted: { r: 0.392, g: 0.455, b: 0.545 },    // #64748B Subtitles, timestamps
    searchBg: { r: 0.953, g: 0.957, b: 0.965 },     // #F3F4F6 Search input & note bubbles
    borderLight: { r: 0.886, g: 0.910, b: 0.941 },  // #E2E8F0 Dividers
    white: { r: 1, g: 1, b: 1 },
    verifiedBlue: { r: 0.0, g: 0.584, b: 0.965 },   // #0095F6 Active dot & verified
    activeGreen: { r: 0.063, g: 0.725, b: 0.506 },   // #10B981 Online dot
    unreadDot: { r: 0.0, g: 0.584, b: 0.965 },      // #0095F6 Unread message dot
    noteBg: { r: 0.941, g: 0.953, b: 0.973 }        // Soft pill fill for notes
  };

  // 3. Icon Helper via Lucide SVG (Safe res.ok validation & fallback)
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

  // 5. Mandatory Helper Functions (Auto Layout & Hug Heights)
  function makeSpaceBetweenRow(name, fixedWidth) {
    const row = figma.createFrame();
    row.name = name; row.layoutMode = "HORIZONTAL"; row.fills = [];
    row.resize(fixedWidth, 1);
    row.primaryAxisSizingMode = "FIXED";
    row.counterAxisSizingMode = "AUTO";
    row.primaryAxisAlignItems = "SPACE_BETWEEN";
    row.counterAxisAlignItems = "CENTER";
    return row;
  }

  function makeHugContainer(name, direction = "HORIZONTAL", spacing = 8) {
    const frame = figma.createFrame();
    frame.name = name; frame.layoutMode = direction; frame.fills = [];
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO";
    frame.itemSpacing = spacing;
    frame.counterAxisAlignItems = "CENTER";
    return frame;
  }

  function createText(content, fontSize, fontStyle = "Regular", color = COLORS.textDark) {
    const text = figma.createText();
    text.fontName = { family: "DM Sans", style: fontStyle };
    text.fontSize = fontSize; // EVEN numbers only: 10, 12, 14, 16, 20, 24, 32
    text.characters = String(content);
    text.fills = [{ type: 'SOLID', color }];
    return text;
  }

  // 6. Master Screen Root Frame (iPhone Viewport 375x812)
  const root = figma.createFrame();
  root.name = "Instagram_Direct_Messages";
  root.resize(375, 812);
  root.fills = [{ type: 'SOLID', color: COLORS.white }];
  root.clipsContent = true;

  root.layoutMode = "VERTICAL";
  root.primaryAxisSizingMode = "FIXED";
  root.counterAxisSizingMode = "FIXED";
  root.itemSpacing = 0;

  // ------------------------------------------------------------------
  // A. TOP DM HEADER (Account Selector, Video Call & New Message Icons)
  // ------------------------------------------------------------------
  const header = makeSpaceBetweenRow("DM_Header_Bar", 375);
  header.paddingTop = 16;
  header.paddingLeft = 16; header.paddingRight = 16; header.paddingBottom = 12;
  root.appendChild(header);

  // Left Back Chevron & Username Group
  const leftGroup = makeHugContainer("Header_Left_Group", "HORIZONTAL", 12);
  const backIcon = await loadLucideIcon("chevron-left", 24, COLORS.textDark, 2.0);
  leftGroup.appendChild(backIcon);

  const accountDropdown = makeHugContainer("Account_Dropdown", "HORIZONTAL", 6);
  const accountName = createText("alexa_explores", 20, "Bold", COLORS.textDark);
  accountDropdown.appendChild(accountName);
  const dropdownIcon = await loadLucideIcon("chevron-down", 18, COLORS.textDark, 2.0);
  accountDropdown.appendChild(dropdownIcon);
  leftGroup.appendChild(accountDropdown);
  header.appendChild(leftGroup);

  // Right Actions Group (Video Call & Edit / New Chat)
  const rightGroup = makeHugContainer("Header_Right_Group", "HORIZONTAL", 16);
  const videoIcon = await loadLucideIcon("video", 24, COLORS.textDark, 1.8);
  rightGroup.appendChild(videoIcon);
  const editIcon = await loadLucideIcon("square-pen", 22, COLORS.textDark, 1.8);
  rightGroup.appendChild(editIcon);
  header.appendChild(rightGroup);

  // ------------------------------------------------------------------
  // B. MIDDLE SCROLL BODY (Search, Notes Tray, Tab Bar, Chat List)
  // ------------------------------------------------------------------
  const scrollBody = figma.createFrame();
  scrollBody.name = "DM_Scroll_Body";
  scrollBody.resize(375, 700);
  scrollBody.clipsContent = true;
  root.appendChild(scrollBody);

  scrollBody.layoutMode = "VERTICAL";
  scrollBody.primaryAxisSizingMode = "FIXED";
  scrollBody.counterAxisSizingMode = "FIXED";
  scrollBody.itemSpacing = 16;
  scrollBody.paddingTop = 4;

  // B1. Search Bar Input
  const searchContainer = figma.createFrame();
  searchContainer.name = "Search_Container";
  searchContainer.layoutMode = "HORIZONTAL";
  searchContainer.fills = [{ type: 'SOLID', color: COLORS.searchBg }];
  searchContainer.cornerRadius = 10;
  searchContainer.resize(343, 1);
  searchContainer.primaryAxisSizingMode = "FIXED";
  searchContainer.counterAxisSizingMode = "AUTO";
  searchContainer.paddingLeft = 12; searchContainer.paddingRight = 12;
  searchContainer.paddingTop = 10; searchContainer.paddingBottom = 10;
  searchContainer.itemSpacing = 8;
  searchContainer.layoutAlign = "CENTER";

  const searchIcon = await loadLucideIcon("search", 18, COLORS.textMuted, 1.8);
  searchContainer.appendChild(searchIcon);

  const searchInput = createText("Search messages or accounts", 14, "Regular", COLORS.textMuted);
  searchContainer.appendChild(searchInput);
  scrollBody.appendChild(searchContainer);

  // B2. Notes Tray (Horizontal Scroll: User Note + Friends Notes)
  const notesSection = figma.createFrame();
  notesSection.name = "Active_Notes_Tray";
  notesSection.layoutMode = "HORIZONTAL";
  notesSection.fills = [];
  notesSection.resize(375, 1);
  notesSection.primaryAxisSizingMode = "FIXED";
  notesSection.counterAxisSizingMode = "AUTO";
  notesSection.paddingLeft = 16; notesSection.paddingRight = 16;
  notesSection.itemSpacing = 16;
  notesSection.clipsContent = true;

  const notesData = [
    { name: "Your note", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", note: "Share a thought...", isUser: true },
    { name: "sarah_m", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", note: "Coffee & code ☕️", isUser: false },
    { name: "david_v", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", note: "Bali bound! ✈️", isUser: false },
    { name: "elena_r", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80", note: "New reel live 🎬", isUser: false }
  ];

  for (const n of notesData) {
    const noteCard = makeHugContainer(`Note_${n.name}`, "VERTICAL", 6);
    noteCard.counterAxisAlignItems = "CENTER";

    // Thought Bubble Container
    const bubble = figma.createFrame();
    bubble.name = "Thought_Bubble";
    bubble.layoutMode = "HORIZONTAL";
    bubble.fills = [{ type: 'SOLID', color: COLORS.noteBg }];
    bubble.cornerRadius = 12;
    bubble.paddingLeft = 8; bubble.paddingRight = 8;
    bubble.paddingTop = 4; bubble.paddingBottom = 4;
    bubble.primaryAxisSizingMode = "AUTO";
    bubble.counterAxisSizingMode = "AUTO";
    
    const noteText = createText(n.note, 10, n.isUser ? "Regular" : "Medium", n.isUser ? COLORS.textMuted : COLORS.textDark);
    bubble.appendChild(noteText);
    noteCard.appendChild(bubble);

    // Avatar Frame
    const avatarWrapper = figma.createFrame();
    avatarWrapper.name = "Avatar_Wrapper";
    avatarWrapper.resize(60, 60);
    avatarWrapper.cornerRadius = 999;
    
    const avatar = figma.createFrame();
    avatar.name = "Avatar"; avatar.resize(60, 60); avatar.cornerRadius = 999;
    avatarWrapper.appendChild(avatar);
    await applyOnlineImage(avatar, n.avatar);

    if (n.isUser) {
      // Plus badge for user note
      const plusBadge = figma.createFrame();
      plusBadge.name = "Plus_Badge";
      plusBadge.resize(20, 20); plusBadge.cornerRadius = 999;
      plusBadge.fills = [{ type: 'SOLID', color: COLORS.searchBg }];
      plusBadge.strokes = [{ type: 'SOLID', color: COLORS.white }];
      plusBadge.strokeWeight = 2;
      plusBadge.layoutMode = "HORIZONTAL"; plusBadge.primaryAxisAlignItems = "CENTER"; plusBadge.counterAxisAlignItems = "CENTER";
      
      const pIcon = await loadLucideIcon("plus", 12, COLORS.textMuted, 2.0);
      plusBadge.appendChild(pIcon);
      
      // Position badge in absolute overlay
      plusBadge.layoutPositioning = "ABSOLUTE";
      plusBadge.x = 40; plusBadge.y = 40;
      avatarWrapper.appendChild(plusBadge);
    } else {
      // Green active dot for online friends
      const activeDot = figma.createFrame();
      activeDot.name = "Active_Dot"; activeDot.resize(14, 14); activeDot.cornerRadius = 999;
      activeDot.fills = [{ type: 'SOLID', color: COLORS.activeGreen }];
      activeDot.strokes = [{ type: 'SOLID', color: COLORS.white }];
      activeDot.strokeWeight = 2;
      activeDot.layoutPositioning = "ABSOLUTE";
      activeDot.x = 44; activeDot.y = 44;
      avatarWrapper.appendChild(activeDot);
    }

    noteCard.appendChild(avatarWrapper);

    const nameText = createText(n.name, 10, "Regular", COLORS.textMuted);
    noteCard.appendChild(nameText);

    notesSection.appendChild(noteCard);
  }
  scrollBody.appendChild(notesSection);

  // B3. Section Header Tabs (Primary, General, Requests)
  const tabHeader = makeSpaceBetweenRow("DM_Tab_Header", 343);
  tabHeader.layoutAlign = "CENTER";

  const tabsGroup = makeHugContainer("Tabs_Group", "HORIZONTAL", 20);
  
  const primaryTab = makeHugContainer("Primary_Tab", "VERTICAL", 4);
  const pText = createText("Primary", 14, "Bold", COLORS.textDark);
  primaryTab.appendChild(pText);
  const activeLine = figma.createFrame(); activeLine.name = "Active_Line"; activeLine.resize(50, 2); activeLine.fills = [{ type: 'SOLID', color: COLORS.textDark }];
  primaryTab.appendChild(activeLine);
  tabsGroup.appendChild(primaryTab);

  const generalTab = createText("General", 14, "Medium", COLORS.textMuted);
  tabsGroup.appendChild(generalTab);

  tabHeader.appendChild(tabsGroup);

  const requestsBtn = createText("Requests (2)", 14, "Medium", COLORS.verifiedBlue);
  tabHeader.appendChild(requestsBtn);

  scrollBody.appendChild(tabHeader);

  // B4. Conversation List Threads (Vertical Stack)
  const chatList = figma.createFrame();
  chatList.name = "Conversation_Threads_List";
  chatList.layoutMode = "VERTICAL";
  chatList.fills = [];
  chatList.resize(343, 1);
  chatList.primaryAxisSizingMode = "AUTO";
  chatList.counterAxisSizingMode = "FIXED";
  chatList.itemSpacing = 16;
  chatList.layoutAlign = "CENTER";
  scrollBody.appendChild(chatList);

  const conversations = [
    {
      name: "Marcus Vance",
      handle: "marcus_v",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      lastMsg: "Sent a reel by travel_bug • 2m",
      unread: true,
      verified: false
    },
    {
      name: "Jessica Chen",
      handle: "jess_chen",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      lastMsg: "Sounds great! See you at 7pm 👋",
      unread: true,
      verified: true
    },
    {
      name: "Studio Design Co",
      handle: "studiodesign",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
      lastMsg: "Liked your message • 1h",
      unread: false,
      verified: true
    },
    {
      name: "Liam O'Connor",
      handle: "liam_oc",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80",
      lastMsg: "Did you check out the new design system?",
      unread: false,
      verified: false
    },
    {
      name: "Sophia Martinez",
      handle: "sophiam",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80",
      lastMsg: "Active 4h ago",
      unread: false,
      verified: false
    }
  ];

  for (const c of conversations) {
    const threadRow = makeSpaceBetweenRow(`Thread_${c.handle}`, 343);
    
    // Left Avatar + Text Info
    const leftInfo = makeHugContainer("Left_Info", "HORIZONTAL", 12);
    
    // Avatar
    const avFrame = figma.createFrame();
    avFrame.name = "Chat_Avatar"; avFrame.resize(52, 52); avFrame.cornerRadius = 999;
    leftInfo.appendChild(avFrame);
    await applyOnlineImage(avFrame, c.avatar);

    // Text Stack
    const textStack = makeHugContainer("Text_Stack", "VERTICAL", 4);
    textStack.counterAxisAlignItems = "MIN";

    const nameRow = makeHugContainer("Name_Row", "HORIZONTAL", 4);
    const nameTxt = createText(c.name, 14, c.unread ? "Bold" : "Medium", COLORS.textDark);
    nameRow.appendChild(nameTxt);
    if (c.verified) {
      const vBadge = await loadLucideIcon("badge-check", 14, COLORS.verifiedBlue, 1.5);
      nameRow.appendChild(vBadge);
    }
    textStack.appendChild(nameRow);

    const msgTxt = createText(c.lastMsg, 12, c.unread ? "Bold" : "Regular", c.unread ? COLORS.textDark : COLORS.textMuted);
    textStack.appendChild(msgTxt);

    leftInfo.appendChild(textStack);
    threadRow.appendChild(leftInfo);

    // Right Camera Shortcut / Unread Blue Dot
    const rightSide = makeHugContainer("Right_Side", "HORIZONTAL", 8);
    if (c.unread) {
      const uDot = figma.createFrame();
      uDot.name = "Unread_Dot"; uDot.resize(8, 8); uDot.cornerRadius = 999;
      uDot.fills = [{ type: 'SOLID', color: COLORS.unreadDot }];
      rightSide.appendChild(uDot);
    }
    const camIcon = await loadLucideIcon("camera", 20, COLORS.textMuted, 1.8);
    rightSide.appendChild(camIcon);

    threadRow.appendChild(rightSide);
    chatList.appendChild(threadRow);
  }

  // 7. Select & Focus Canvas
  figma.currentPage.selection = [root];
  figma.viewport.scrollAndZoomIntoView([root]);

  console.log("Successfully generated Instagram Direct Messages screen!");
})();
