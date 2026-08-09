(async () => {
  // 1. Load Required Fonts (DM Sans - Strict EVEN typography scale)
  await figma.loadFontAsync({ family: "DM Sans", style: "Regular" });
  await figma.loadFontAsync({ family: "DM Sans", style: "Medium" });
  await figma.loadFontAsync({ family: "DM Sans", style: "Bold" });

  // 2. Color System Definition (Reels Dark Mode Aesthetic)
  const COLORS = {
    white: { r: 1, g: 1, b: 1 },
    textMuted: { r: 0.9, g: 0.9, b: 0.95 },
    verifiedBlue: { r: 0.0, g: 0.584, b: 0.965 }, // #0095F6
    heartRed: { r: 0.929, g: 0.286, b: 0.337 },    // #ED4956
    overlayBg: { r: 0, g: 0, b: 0 },
    darkBg: { r: 0.05, g: 0.05, b: 0.08 },
    navBg: { r: 0.05, g: 0.05, b: 0.05 },
    activeTab: { r: 1, g: 1, b: 1 },
    inactiveTab: { r: 0.6, g: 0.6, b: 0.65 }
  };

  // 3. Icon Helper via Lucide SVG (Safe res.ok validation & fallback)
  async function loadLucideIcon(iconName, size = 24, color = COLORS.white, strokeWidth = 1.5) {
    const fallbackSvg = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="${strokeWidth}"><circle cx="12" cy="12" r="9"/></svg>`;
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
      frameNode.fills = [{ type: 'SOLID', color: { r: 0.15, g: 0.15, b: 0.2 } }];
    }
  }

  // 5. Helper Functions (Auto Layout & Hug Heights)
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

  function createText(content, fontSize, fontStyle = "Regular", color = COLORS.white) {
    const text = figma.createText();
    text.fontName = { family: "DM Sans", style: fontStyle };
    text.fontSize = fontSize; // EVEN sizes only: 10, 12, 14, 16, 20, 24, 32
    text.characters = String(content);
    text.fills = [{ type: 'SOLID', color }];
    return text;
  }

  // 6. Master Screen Root Frame (iPhone Viewport 375x812)
  const root = figma.createFrame();
  root.name = "Instagram_Reels_View";
  root.resize(375, 812);
  root.fills = [{ type: 'SOLID', color: COLORS.darkBg }];
  root.clipsContent = true;

  // Set up Root Vertical Stack
  root.layoutMode = "VERTICAL";
  root.primaryAxisSizingMode = "FIXED";
  root.counterAxisSizingMode = "FIXED";
  root.itemSpacing = 0;
  root.paddingLeft = 0; root.paddingRight = 0; root.paddingTop = 0; root.paddingBottom = 0;

  // ------------------------------------------------------------------
  // A. MAIN REEL VIEWPORT CONTAINER (Height 732px, Top Stack)
  // ------------------------------------------------------------------
  const reelViewport = figma.createFrame();
  reelViewport.name = "Reel_Video_Viewport";
  reelViewport.resize(375, 732);
  reelViewport.clipsContent = true;
  root.appendChild(reelViewport);
  
  // Set layout mode for reelViewport so overlays align nicely
  reelViewport.layoutMode = "VERTICAL";
  reelViewport.primaryAxisSizingMode = "FIXED";
  reelViewport.counterAxisSizingMode = "FIXED";
  reelViewport.primaryAxisAlignItems = "SPACE_BETWEEN";

  // Apply High-Res Photography Fill (Travel / Urban Reel Shot)
  await applyOnlineImage(reelViewport, "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80");

  // A1. TOP REEL HEADER OVERLAY (Reels Title & Camera Icon)
  const topHeader = makeSpaceBetweenRow("Top_Header_Overlay", 375);
  topHeader.paddingLeft = 16; topHeader.paddingRight = 16; topHeader.paddingTop = 16;
  reelViewport.appendChild(topHeader);

  const titleRow = makeHugContainer("Title_Group", "HORIZONTAL", 8);
  const reelTitleText = createText("Reels", 24, "Bold", COLORS.white);
  titleRow.appendChild(reelTitleText);
  const chevronIcon = await loadLucideIcon("chevron-down", 20, COLORS.white, 2.0);
  titleRow.appendChild(chevronIcon);
  topHeader.appendChild(titleRow);

  const cameraIcon = await loadLucideIcon("camera", 24, COLORS.white, 1.8);
  topHeader.appendChild(cameraIcon);

  // A2. BOTTOM & RIGHT OVERLAY CONTENT AREA (Horizontal split)
  const overlayContent = makeSpaceBetweenRow("Overlay_Content_Area", 375);
  overlayContent.paddingLeft = 16;
  overlayContent.paddingRight = 12;
  overlayContent.paddingBottom = 20;
  overlayContent.counterAxisAlignItems = "MAX"; // Align to bottom
  reelViewport.appendChild(overlayContent);

  // LEFT SIDE: Creator Profile, Caption, Audio Marquee
  const leftDetails = makeHugContainer("Left_Creator_Details", "VERTICAL", 12);
  leftDetails.primaryAxisAlignItems = "MAX";
  leftDetails.layoutAlign = "STRETCH";

  // Creator Row (Avatar, Handle, Follow Button)
  const creatorRow = makeHugContainer("Creator_Header_Row", "HORIZONTAL", 10);
  
  // Avatar Frame
  const avatarFrame = figma.createFrame();
  avatarFrame.name = "Creator_Avatar";
  avatarFrame.resize(36, 36);
  avatarFrame.cornerRadius = 999;
  avatarFrame.strokes = [{ type: 'SOLID', color: COLORS.white }];
  avatarFrame.strokeWeight = 1.5;
  creatorRow.appendChild(avatarFrame);
  await applyOnlineImage(avatarFrame, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80");

  // Handle & Verified Badge
  const handleContainer = makeHugContainer("Handle_Container", "HORIZONTAL", 4);
  const handleText = createText("alexa_explores", 14, "Bold", COLORS.white);
  handleContainer.appendChild(handleText);
  const checkBadge = await loadLucideIcon("badge-check", 16, COLORS.verifiedBlue, 1.5);
  handleContainer.appendChild(checkBadge);
  creatorRow.appendChild(handleContainer);

  // Follow Button Pill
  const followBtn = figma.createFrame();
  followBtn.name = "Follow_Button";
  followBtn.layoutMode = "HORIZONTAL";
  followBtn.fills = [];
  followBtn.strokes = [{ type: 'SOLID', color: COLORS.white }];
  followBtn.strokeWeight = 1;
  followBtn.cornerRadius = 6;
  followBtn.paddingLeft = 10; followBtn.paddingRight = 10;
  followBtn.paddingTop = 4; followBtn.paddingBottom = 4;
  followBtn.primaryAxisSizingMode = "AUTO";
  followBtn.counterAxisSizingMode = "AUTO";
  const followText = createText("Follow", 12, "Medium", COLORS.white);
  followBtn.appendChild(followText);
  creatorRow.appendChild(followBtn);

  leftDetails.appendChild(creatorRow);

  // Caption Text
  const captionText = createText("Sunset views in Bali hit different 🌅✨ #travel #bali #vibes #nature", 14, "Regular", COLORS.white);
  captionText.resize(250, 40); // Wrapped caption width
  captionText.textAutoResize = "HEIGHT";
  leftDetails.appendChild(captionText);

  // Audio Marquee Tag
  const audioTag = makeHugContainer("Audio_Tag", "HORIZONTAL", 6);
  const musicIcon = await loadLucideIcon("music", 14, COLORS.white, 1.8);
  audioTag.appendChild(musicIcon);
  const audioText = createText("alexa_explores • Original Audio", 12, "Regular", COLORS.white);
  audioTag.appendChild(audioText);
  leftDetails.appendChild(audioTag);

  overlayContent.appendChild(leftDetails);

  // RIGHT SIDE: Vertical Action Column (Like, Comment, Share, Remix, Audio Thumbnail)
  const rightActions = makeHugContainer("Right_Action_Column", "VERTICAL", 20);
  rightActions.counterAxisAlignItems = "CENTER";

  // Action 1: Like Heart
  const likeGroup = makeHugContainer("Like_Action", "VERTICAL", 4);
  likeGroup.counterAxisAlignItems = "CENTER";
  const heartIcon = await loadLucideIcon("heart", 28, COLORS.heartRed, 2.0);
  likeGroup.appendChild(heartIcon);
  const likeCount = createText("124K", 12, "Medium", COLORS.white);
  likeGroup.appendChild(likeCount);
  rightActions.appendChild(likeGroup);

  // Action 2: Comment
  const commentGroup = makeHugContainer("Comment_Action", "VERTICAL", 4);
  commentGroup.counterAxisAlignItems = "CENTER";
  const commentIcon = await loadLucideIcon("message-circle", 28, COLORS.white, 1.8);
  commentGroup.appendChild(commentIcon);
  const commentCount = createText("1,842", 12, "Medium", COLORS.white);
  commentGroup.appendChild(commentCount);
  rightActions.appendChild(commentGroup);

  // Action 3: Share / Send
  const shareGroup = makeHugContainer("Share_Action", "VERTICAL", 4);
  shareGroup.counterAxisAlignItems = "CENTER";
  const sendIcon = await loadLucideIcon("send", 26, COLORS.white, 1.8);
  shareGroup.appendChild(sendIcon);
  const shareCount = createText("42.5K", 12, "Medium", COLORS.white);
  shareGroup.appendChild(shareCount);
  rightActions.appendChild(shareGroup);

  // Action 4: More Options (3 Dots)
  const moreIcon = await loadLucideIcon("more-vertical", 24, COLORS.white, 1.8);
  rightActions.appendChild(moreIcon);

  // Action 5: Spinning Audio Disk Thumbnail
  const audioDisk = figma.createFrame();
  audioDisk.name = "Audio_Disk_Thumb";
  audioDisk.resize(30, 30);
  audioDisk.cornerRadius = 6;
  audioDisk.strokes = [{ type: 'SOLID', color: COLORS.white }];
  audioDisk.strokeWeight = 1.5;
  rightActions.appendChild(audioDisk);
  await applyOnlineImage(audioDisk, "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80");

  overlayContent.appendChild(rightActions);

  // ------------------------------------------------------------------
  // B. BOTTOM NAVIGATION BAR (Height 80px, Dark Reels Styling)
  // ------------------------------------------------------------------
  const bottomNav = makeSpaceBetweenRow("Instagram_Bottom_Nav", 375);
  bottomNav.fills = [{ type: 'SOLID', color: COLORS.navBg }];
  bottomNav.paddingLeft = 24; bottomNav.paddingRight = 24;
  bottomNav.paddingTop = 12; bottomNav.paddingBottom = 24; // Bottom safe padding
  root.appendChild(bottomNav);

  // Nav Item 1: Home
  const homeIcon = await loadLucideIcon("home", 24, COLORS.inactiveTab, 1.8);
  bottomNav.appendChild(homeIcon);

  // Nav Item 2: Search / Explore
  const searchNavIcon = await loadLucideIcon("search", 24, COLORS.inactiveTab, 1.8);
  bottomNav.appendChild(searchNavIcon);

  // Nav Item 3: Create Post (Plus Square)
  const plusIcon = await loadLucideIcon("plus-square", 24, COLORS.inactiveTab, 1.8);
  bottomNav.appendChild(plusIcon);

  // Nav Item 4: Reels (Active - Solid White Highlight)
  const reelsActiveIcon = await loadLucideIcon("clapperboard", 26, COLORS.activeTab, 2.2);
  bottomNav.appendChild(reelsActiveIcon);

  // Nav Item 5: Profile Avatar
  const navAvatar = figma.createFrame();
  navAvatar.name = "Nav_User_Avatar";
  navAvatar.resize(26, 26);
  navAvatar.cornerRadius = 999;
  navAvatar.strokes = [{ type: 'SOLID', color: COLORS.inactiveTab }];
  navAvatar.strokeWeight = 1;
  bottomNav.appendChild(navAvatar);
  await applyOnlineImage(navAvatar, "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80");

  // 7. Select & Focus Frame on Canvas
  figma.currentPage.selection = [root];
  figma.viewport.scrollAndZoomIntoView([root]);

  console.log("Successfully generated Instagram Reels screen!");
})();
