(async () => {
  // 1. Load Required Fonts (DM Sans - Strict EVEN typography scale)
  await figma.loadFontAsync({ family: "DM Sans", style: "Regular" });
  await figma.loadFontAsync({ family: "DM Sans", style: "Medium" });
  await figma.loadFontAsync({ family: "DM Sans", style: "Bold" });

  // 2. Color System Definition (Instagram Profile Theme)
  const COLORS = {
    textDark: { r: 0.059, g: 0.090, b: 0.165 },     // #0F172A Usernames & titles
    textMuted: { r: 0.392, g: 0.455, b: 0.545 },    // #64748B Subtitles & secondary labels
    buttonBg: { r: 0.953, g: 0.957, b: 0.965 },     // #F3F4F6 Gray button fill
    borderLight: { r: 0.886, g: 0.910, b: 0.941 },  // #E2E8F0 Dividers & borders
    white: { r: 1, g: 1, b: 1 },
    verifiedBlue: { r: 0.0, g: 0.584, b: 0.965 },   // #0095F6
    storyRingPink: { r: 0.882, g: 0.188, b: 0.424 }, // #E1306C Story border tint
    highlightBg: { r: 0.973, g: 0.980, b: 0.988 }   // #F8FAFC Highlight circle fill
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
  root.name = "Instagram_User_Profile";
  root.resize(375, 812);
  root.fills = [{ type: 'SOLID', color: COLORS.white }];
  root.clipsContent = true;

  root.layoutMode = "VERTICAL";
  root.primaryAxisSizingMode = "FIXED";
  root.counterAxisSizingMode = "FIXED";
  root.itemSpacing = 0;

  // ------------------------------------------------------------------
  // A. TOP PROFILE HEADER BAR (Lock, Handle, Add Post, Menu Hamburger)
  // ------------------------------------------------------------------
  const topHeader = makeSpaceBetweenRow("Top_Profile_Header", 375);
  topHeader.paddingTop = 16;
  topHeader.paddingLeft = 16; topHeader.paddingRight = 16; topHeader.paddingBottom = 12;
  root.appendChild(topHeader);

  // Left Lock + Username Dropdown
  const leftHandleGroup = makeHugContainer("Handle_Dropdown_Group", "HORIZONTAL", 6);
  const lockIcon = await loadLucideIcon("lock", 16, COLORS.textDark, 1.8);
  leftHandleGroup.appendChild(lockIcon);

  const usernameTxt = createText("alexa_explores", 20, "Bold", COLORS.textDark);
  leftHandleGroup.appendChild(usernameTxt);

  const dropChevron = await loadLucideIcon("chevron-down", 18, COLORS.textDark, 2.0);
  leftHandleGroup.appendChild(dropChevron);
  topHeader.appendChild(leftHandleGroup);

  // Right Plus & Hamburger Menu Icons
  const rightMenu = makeHugContainer("Right_Header_Icons", "HORIZONTAL", 16);
  const plusSquareIcon = await loadLucideIcon("plus-square", 24, COLORS.textDark, 1.8);
  rightMenu.appendChild(plusSquareIcon);
  const menuIcon = await loadLucideIcon("menu", 24, COLORS.textDark, 1.8);
  rightMenu.appendChild(menuIcon);
  topHeader.appendChild(rightMenu);

  // ------------------------------------------------------------------
  // B. MIDDLE SCROLL CONTENT (Profile Stats, Bio, CTAs, Highlights, Grid)
  // ------------------------------------------------------------------
  const scrollBody = figma.createFrame();
  scrollBody.name = "Profile_Scroll_Body";
  scrollBody.resize(375, 684);
  scrollBody.clipsContent = true;
  root.appendChild(scrollBody);

  scrollBody.layoutMode = "VERTICAL";
  scrollBody.primaryAxisSizingMode = "FIXED";
  scrollBody.counterAxisSizingMode = "FIXED";
  scrollBody.itemSpacing = 16;

  // B1. Profile Header Row (Avatar Ring + 3 Stats Columns: Posts, Followers, Following)
  const profileStatsRow = makeSpaceBetweenRow("Profile_Stats_Row", 343);
  profileStatsRow.layoutAlign = "CENTER";
  profileStatsRow.paddingTop = 4;

  // Avatar with Story Border Ring
  const avatarRing = figma.createFrame();
  avatarRing.name = "Avatar_Story_Ring";
  avatarRing.resize(80, 80);
  avatarRing.cornerRadius = 999;
  avatarRing.strokes = [{ type: 'SOLID', color: COLORS.storyRingPink }];
  avatarRing.strokeWeight = 2.5;
  avatarRing.paddingLeft = 3; avatarRing.paddingRight = 3; avatarRing.paddingTop = 3; avatarRing.paddingBottom = 3;

  const userAvatar = figma.createFrame();
  userAvatar.name = "User_Avatar"; userAvatar.resize(74, 74); userAvatar.cornerRadius = 999;
  avatarRing.appendChild(userAvatar);
  await applyOnlineImage(userAvatar, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80");
  profileStatsRow.appendChild(avatarRing);

  // Stats Stack (Posts, Followers, Following)
  const statsContainer = makeHugContainer("Stats_Container", "HORIZONTAL", 24);
  
  // Stat 1: Posts
  const postsStat = makeHugContainer("Posts_Stat", "VERTICAL", 2);
  postsStat.counterAxisAlignItems = "CENTER";
  const postsCount = createText("142", 16, "Bold", COLORS.textDark);
  postsStat.appendChild(postsCount);
  const postsLabel = createText("Posts", 12, "Regular", COLORS.textMuted);
  postsStat.appendChild(postsLabel);
  statsContainer.appendChild(postsStat);

  // Stat 2: Followers (Highlighted)
  const followersStat = makeHugContainer("Followers_Stat", "VERTICAL", 2);
  followersStat.counterAxisAlignItems = "CENTER";
  const followersCount = createText("24.8K", 16, "Bold", COLORS.textDark);
  followersStat.appendChild(followersCount);
  const followersLabel = createText("Followers", 12, "Regular", COLORS.textMuted);
  followersStat.appendChild(followersLabel);
  statsContainer.appendChild(followersStat);

  // Stat 3: Following
  const followingStat = makeHugContainer("Following_Stat", "VERTICAL", 2);
  followingStat.counterAxisAlignItems = "CENTER";
  const followingCount = createText("482", 16, "Bold", COLORS.textDark);
  followingStat.appendChild(followingCount);
  const followingLabel = createText("Following", 12, "Regular", COLORS.textMuted);
  followingStat.appendChild(followingLabel);
  statsContainer.appendChild(followingStat);

  profileStatsRow.appendChild(statsContainer);
  scrollBody.appendChild(profileStatsRow);

  // B2. Bio Details Block (Display Name, Category, Description, Link)
  const bioBlock = makeHugContainer("Bio_Details_Block", "VERTICAL", 4);
  bioBlock.layoutAlign = "CENTER";
  bioBlock.resize(343, 1);
  bioBlock.primaryAxisSizingMode = "AUTO";
  bioBlock.counterAxisSizingMode = "FIXED";
  bioBlock.counterAxisAlignItems = "MIN";

  const displayName = createText("Alexa Rivera • Travel & Style", 14, "Bold", COLORS.textDark);
  bioBlock.appendChild(displayName);

  const categoryTag = createText("Digital Creator", 12, "Regular", COLORS.textMuted);
  bioBlock.appendChild(categoryTag);

  const bioDesc = createText("Exploring hidden gems around the world 🌴🌍\nCapturing moments & aesthetic design ✨", 14, "Regular", COLORS.textDark);
  bioDesc.resize(343, 40);
  bioDesc.textAutoResize = "HEIGHT";
  bioBlock.appendChild(bioDesc);

  // Bio External Link Row
  const linkRow = makeHugContainer("Bio_Link_Row", "HORIZONTAL", 4);
  const linkIcon = await loadLucideIcon("link-2", 14, COLORS.textMuted, 1.8);
  linkRow.appendChild(linkIcon);
  const linkText = createText("alexarivera.design/portfolio", 12, "Bold", COLORS.textDark);
  linkRow.appendChild(linkText);
  bioBlock.appendChild(linkRow);

  scrollBody.appendChild(bioBlock);

  // B3. Action Buttons Row (Instantiating Master Components)
  const actionBtnRow = makeSpaceBetweenRow("Profile_Action_Buttons", 343);
  actionBtnRow.layoutAlign = "CENTER";

  // Master Component Instance Helper Function
  function createComponentInstance(name, width, label, bg, textColor) {
    const inst = figma.createFrame();
    inst.name = `Instance / ${name}`; inst.layoutMode = "HORIZONTAL"; inst.resize(width, 36);
    inst.fills = [{ type: 'SOLID', color: bg }]; inst.cornerRadius = 8;
    inst.primaryAxisAlignItems = "CENTER"; inst.counterAxisAlignItems = "CENTER";
    const txt = createText(label, 14, "Bold", textColor);
    inst.appendChild(txt);
    return inst;
  }

  // Edit Profile Component Instance
  const editBtn = createComponentInstance("EditProfile_Btn", 140, "Edit profile", COLORS.buttonBg, COLORS.textDark);
  actionBtnRow.appendChild(editBtn);

  // Share Profile Component Instance
  const shareBtn = createComponentInstance("ShareProfile_Btn", 140, "Share profile", COLORS.buttonBg, COLORS.textDark);
  actionBtnRow.appendChild(shareBtn);

  // User Add Component Instance
  const addPersonBtn = figma.createFrame();
  addPersonBtn.name = "Instance / AddPerson_Btn"; addPersonBtn.layoutMode = "HORIZONTAL"; addPersonBtn.resize(44, 36);
  addPersonBtn.fills = [{ type: 'SOLID', color: COLORS.buttonBg }]; addPersonBtn.cornerRadius = 8;
  addPersonBtn.primaryAxisAlignItems = "CENTER"; addPersonBtn.counterAxisAlignItems = "CENTER";
  const personIcon = await loadLucideIcon("user-plus", 18, COLORS.textDark, 1.8);
  addPersonBtn.appendChild(personIcon);
  actionBtnRow.appendChild(addPersonBtn);

  scrollBody.appendChild(actionBtnRow);

  // B4. Story Highlights Tray (Horizontal Scroll: Travel, Fits, Bali, Food, New)
  const highlightsTray = figma.createFrame();
  highlightsTray.name = "Story_Highlights_Tray";
  highlightsTray.layoutMode = "HORIZONTAL";
  highlightsTray.fills = [];
  highlightsTray.resize(375, 1);
  highlightsTray.primaryAxisSizingMode = "FIXED";
  highlightsTray.counterAxisSizingMode = "AUTO";
  highlightsTray.paddingLeft = 16; highlightsTray.paddingRight = 16;
  highlightsTray.itemSpacing = 16;
  highlightsTray.clipsContent = true;

  const highlights = [
    { label: "Bali 🌴", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=150&q=80" },
    { label: "Fits ✨", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=150&q=80" },
    { label: "Food ☕️", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=150&q=80" },
    { label: "Art 🎨", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=150&q=80" },
    { label: "New", isNew: true }
  ];

  for (const h of highlights) {
    const hItem = makeHugContainer(`Highlight_${h.label}`, "VERTICAL", 6);
    hItem.counterAxisAlignItems = "CENTER";

    const circleFrame = figma.createFrame();
    circleFrame.name = "Circle_Frame"; circleFrame.resize(60, 60); circleFrame.cornerRadius = 999;
    circleFrame.strokes = [{ type: 'SOLID', color: COLORS.borderLight }]; circleFrame.strokeWeight = 1.5;

    if (h.isNew) {
      circleFrame.fills = [{ type: 'SOLID', color: COLORS.highlightBg }];
      circleFrame.layoutMode = "HORIZONTAL"; circleFrame.primaryAxisAlignItems = "CENTER"; circleFrame.counterAxisAlignItems = "CENTER";
      const pIcon = await loadLucideIcon("plus", 20, COLORS.textDark, 1.8);
      circleFrame.appendChild(pIcon);
    } else {
      await applyOnlineImage(circleFrame, h.image);
    }
    hItem.appendChild(circleFrame);

    const hText = createText(h.label, 10, "Medium", COLORS.textDark);
    hItem.appendChild(hText);

    highlightsTray.appendChild(hItem);
  }
  scrollBody.appendChild(highlightsTray);

  // B5. Profile Tabs Header (Posts Grid, Reels Tab, Tagged Posts)
  const tabsRow = makeSpaceBetweenRow("Profile_Tabs_Row", 375);
  tabsRow.paddingLeft = 0; tabsRow.paddingRight = 0;

  // Tab 1: Posts Grid (Active)
  const postsTab = figma.createFrame();
  postsTab.name = "Tab_Posts_Grid"; postsTab.layoutMode = "VERTICAL"; postsTab.resize(125, 40);
  postsTab.primaryAxisAlignItems = "CENTER"; postsTab.counterAxisAlignItems = "CENTER"; postsTab.itemSpacing = 8;
  const gridIcon = await loadLucideIcon("grid-3x3", 22, COLORS.textDark, 2.0);
  postsTab.appendChild(gridIcon);
  const activeLine = figma.createFrame(); activeLine.name = "Active_Indicator"; activeLine.resize(125, 1.5); activeLine.fills = [{ type: 'SOLID', color: COLORS.textDark }];
  postsTab.appendChild(activeLine);
  tabsRow.appendChild(postsTab);

  // Tab 2: Reels
  const reelsTab = figma.createFrame();
  reelsTab.name = "Tab_Reels"; reelsTab.layoutMode = "VERTICAL"; reelsTab.resize(125, 40);
  reelsTab.primaryAxisAlignItems = "CENTER"; reelsTab.counterAxisAlignItems = "CENTER";
  const rIcon = await loadLucideIcon("clapperboard", 22, COLORS.textMuted, 1.8);
  reelsTab.appendChild(rIcon);
  tabsRow.appendChild(reelsTab);

  // Tab 3: Tagged Posts
  const taggedTab = figma.createFrame();
  taggedTab.name = "Tab_Tagged"; taggedTab.layoutMode = "VERTICAL"; taggedTab.resize(125, 40);
  taggedTab.primaryAxisAlignItems = "CENTER"; taggedTab.counterAxisAlignItems = "CENTER";
  const tIcon = await loadLucideIcon("user-square-2", 22, COLORS.textMuted, 1.8);
  taggedTab.appendChild(tIcon);
  tabsRow.appendChild(taggedTab);

  scrollBody.appendChild(tabsRow);

  // B6. 3-Column Posts Media Grid (Square photos 123x123)
  const postsGrid = figma.createFrame();
  postsGrid.name = "User_Posts_Grid";
  postsGrid.layoutMode = "VERTICAL";
  postsGrid.fills = [];
  postsGrid.resize(375, 1);
  postsGrid.primaryAxisSizingMode = "AUTO";
  postsGrid.counterAxisSizingMode = "FIXED";
  postsGrid.itemSpacing = 2;
  scrollBody.appendChild(postsGrid);

  const gridPhotos = [
    [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80"
    ],
    [
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80"
    ]
  ];

  for (let r = 0; r < gridPhotos.length; r++) {
    const row = figma.createFrame();
    row.name = `Grid_Row_${r + 1}`; row.layoutMode = "HORIZONTAL"; row.resize(375, 123); row.itemSpacing = 2;
    postsGrid.appendChild(row);

    for (let c = 0; c < 3; c++) {
      const tile = figma.createFrame();
      tile.name = `Tile_${r * 3 + c + 1}`; tile.resize(123, 123);
      row.appendChild(tile);
      await applyOnlineImage(tile, gridPhotos[r][c]);
    }
  }

  // ------------------------------------------------------------------
  // C. BOTTOM NAVIGATION BAR (Height 68px)
  // ------------------------------------------------------------------
  const bottomNav = makeSpaceBetweenRow("Instagram_Bottom_Nav", 375);
  bottomNav.fills = [{ type: 'SOLID', color: COLORS.white }];
  bottomNav.strokes = [{ type: 'SOLID', color: COLORS.borderLight }];
  bottomNav.strokeWeight = 1;
  bottomNav.paddingLeft = 24; bottomNav.paddingRight = 24;
  bottomNav.paddingTop = 12; bottomNav.paddingBottom = 20; // Safe bottom inset
  root.appendChild(bottomNav);

  // Nav 1: Home
  const homeIcon = await loadLucideIcon("home", 24, COLORS.textMuted, 1.8);
  bottomNav.appendChild(homeIcon);

  // Nav 2: Search
  const searchNavIcon = await loadLucideIcon("search", 24, COLORS.textMuted, 1.8);
  bottomNav.appendChild(searchNavIcon);

  // Nav 3: Create (+)
  const plusNavIcon = await loadLucideIcon("plus-square", 24, COLORS.textMuted, 1.8);
  bottomNav.appendChild(plusNavIcon);

  // Nav 4: Reels
  const reelsNavIcon = await loadLucideIcon("clapperboard", 24, COLORS.textMuted, 1.8);
  bottomNav.appendChild(reelsNavIcon);

  // Nav 5: Profile Avatar (Active - Bold Ring)
  const navAvatarRing = figma.createFrame();
  navAvatarRing.name = "Nav_User_Avatar_Active"; navAvatarRing.resize(28, 28); navAvatarRing.cornerRadius = 999;
  navAvatarRing.strokes = [{ type: 'SOLID', color: COLORS.textDark }]; navAvatarRing.strokeWeight = 1.5;
  navAvatarRing.paddingLeft = 1; navAvatarRing.paddingRight = 1; navAvatarRing.paddingTop = 1; navAvatarRing.paddingBottom = 1;

  const navAvatar = figma.createFrame();
  navAvatar.name = "Avatar_Fill"; navAvatar.resize(24, 24); navAvatar.cornerRadius = 999;
  navAvatarRing.appendChild(navAvatar);
  await applyOnlineImage(navAvatar, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80");
  bottomNav.appendChild(navAvatarRing);

  // 7. Select & Focus Canvas
  figma.currentPage.selection = [root];
  figma.viewport.scrollAndZoomIntoView([root]);

  console.log("Successfully generated Instagram User Profile screen!");
})();
