const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3003;
const SCRIPTS_DIR = path.join(__dirname, 'scripts');
const WEB_DIR = path.join(__dirname, 'web');

if (!fs.existsSync(SCRIPTS_DIR)) {
  fs.mkdirSync(SCRIPTS_DIR, { recursive: true });
}

let clients = [];

fs.watch(SCRIPTS_DIR, (eventType, filename) => {
  if (filename && filename.endsWith('.js')) {
    console.log(`[Watcher] Script updated: ${filename}`);
    clients.forEach(client => {
      client.write(`data: ${JSON.stringify({ event: 'change', filename })}\n\n`);
    });
  }
});

function hexToFigmaRGB(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(char => char + char).join('');
  }
  const num = parseInt(c, 16);
  return {
    r: Number(((num >> 16) & 255) / 255),
    g: Number(((num >> 8) & 255) / 255),
    b: Number((num & 255) / 255)
  };
}

// Color Palettes
const PALETTES = {
  'dark-cyber': { primary: '#6366F1', accent: '#10B981' },
  'ocean-emerald': { primary: '#10B981', accent: '#34D399' },
  'royal-violet': { primary: '#8B5CF6', accent: '#EC4899' },
  'warm-amber': { primary: '#F97316', accent: '#FBBF24' }
};

// Intelligently infer screen count and screen metadata from user prompt
function inferScreensFromPrompt(prompt) {
  const p = prompt.toLowerCase();

  // Check for explicit screen count requested by user
  if (p.includes("1 screen") || p.includes("single screen") || p.includes("one screen") || p.includes("login screen")) {
    return [{ title: "Login & Authentication", subtitle: "Sign In Flow", type: "login" }];
  }
  if (p.includes("2 screens") || p.includes("two screens")) {
    return [
      { title: "Main Dashboard", subtitle: "Overview", type: "dashboard" },
      { title: "Details & Settings", subtitle: "Configuration", type: "details" }
    ];
  }
  if (p.includes("5 screens") || p.includes("five screens")) {
    return [
      { title: "Home Dashboard", subtitle: "Overview", type: "dashboard" },
      { title: "Explore & Feed", subtitle: "Discovery", type: "feed" },
      { title: "Action & Details", subtitle: "Primary Action", type: "details" },
      { title: "Activity History", subtitle: "Logs", type: "history" },
      { title: "User Profile", subtitle: "Account Settings", type: "profile" }
    ];
  }

  // Infer domain flow
  if (p.includes("crypto") || p.includes("wallet")) {
    return [
      { title: "Portfolio Dashboard", subtitle: "Total Balance", type: "dashboard" },
      { title: "Send & Transfer", subtitle: "Select Token", type: "action" },
      { title: "Transaction History", subtitle: "Recent Activity", type: "history" },
      { title: "Security & Profile", subtitle: "Wallet Settings", type: "profile" }
    ];
  }
  if (p.includes("fitness") || p.includes("workout")) {
    return [
      { title: "Daily Activity", subtitle: "Calorie & Steps", type: "dashboard" },
      { title: "Workout Details", subtitle: "Timer & Exercises", type: "action" },
      { title: "Analytics & Streak", subtitle: "Weekly Graph", type: "history" }
    ];
  }
  if (p.includes("food") || p.includes("delivery")) {
    return [
      { title: "Food Explore Feed", subtitle: "Categories & Nearby", type: "feed" },
      { title: "Restaurant Menu", subtitle: "Dishes & Reviews", type: "details" },
      { title: "Order Checkout", subtitle: "Cart & Payment", type: "action" }
    ];
  }
  if (p.includes("saas") || p.includes("admin") || p.includes("analytics")) {
    return [
      { title: "Revenue Analytics", subtitle: "KPI Metrics", type: "dashboard" },
      { title: "User Management", subtitle: "Accounts Table", type: "history" },
      { title: "Subscription Plans", subtitle: "Billing & Tier", type: "action" }
    ];
  }

  // Default clean 3-screen flow
  return [
    { title: "Home Dashboard", subtitle: "Overview", type: "dashboard" },
    { title: "Details & Action", subtitle: "Primary Flow", type: "action" },
    { title: "History & Profile", subtitle: "Activity Log", type: "history" }
  ];
}

// Generate Figma JavaScript snippet with explicit non-overlapping spatial layout
function generateFigmaScript(prompt, constraints) {
  const {
    device = { width: 375, height: 812, name: 'Mobile' },
    mode = 'dark',
    colorPreset = 'dark-cyber',
    font = 'Inter',
    createComponents = true
  } = constraints;

  const screens = inferScreensFromPrompt(prompt);
  const palette = PALETTES[colorPreset] || PALETTES['dark-cyber'];

  // Setup Light vs Dark Colors
  const isLight = mode === 'light';
  const colors = {
    bg: isLight ? '#F8FAFC' : '#0F172A',
    surface: isLight ? '#FFFFFF' : '#1E293B',
    surfaceBorder: isLight ? '#E2E8F0' : '#334155',
    primary: palette.primary,
    accent: palette.accent,
    text: isLight ? '#0F172A' : '#F8FAFC',
    textMuted: isLight ? '#64748B' : '#94A3B8'
  };

  const bgRGB = JSON.stringify(hexToFigmaRGB(colors.bg));
  const surfaceRGB = JSON.stringify(hexToFigmaRGB(colors.surface));
  const borderRGB = JSON.stringify(hexToFigmaRGB(colors.surfaceBorder));
  const primaryRGB = JSON.stringify(hexToFigmaRGB(colors.primary));
  const accentRGB = JSON.stringify(hexToFigmaRGB(colors.accent));
  const textRGB = JSON.stringify(hexToFigmaRGB(colors.text));
  const textMutedRGB = JSON.stringify(hexToFigmaRGB(colors.textMuted));

  const scriptCode = `
// Generated Figma Script for: "${prompt.replace(/"/g, '\\"')}"
// Appearance: ${mode.toUpperCase()} Mode | Font: ${font} | Screens: ${screens.length}
(async function(figma) {
  // 1. Asynchronously Load Selected Fonts
  await figma.loadFontAsync({ family: "${font}", style: "Regular" });
  await figma.loadFontAsync({ family: "${font}", style: "Medium" });
  await figma.loadFontAsync({ family: "${font}", style: "Bold" });

  // 2. Clean Canvas Board
  const oldBoard = figma.currentPage.findChild(n => n.name === "Generated UI Screens");
  if (oldBoard) oldBoard.remove();

  // 3. Color Tokens
  const COLOR_BG = ${bgRGB};
  const COLOR_SURFACE = ${surfaceRGB};
  const COLOR_BORDER = ${borderRGB};
  const COLOR_PRIMARY = ${primaryRGB};
  const COLOR_ACCENT = ${accentRGB};
  const COLOR_TEXT = ${textRGB};
  const COLOR_MUTED = ${textMutedRGB};

  // Outer Workspace Container
  const container = figma.createFrame();
  container.name = "Generated UI Screens";
  container.resize(${screens.length * (device.width + 40) + 40}, ${device.height + 80});
  container.fills = [{ type: 'SOLID', color: ${isLight ? JSON.stringify(hexToFigmaRGB('#E2E8F0')) : JSON.stringify(hexToFigmaRGB('#030712'))} }];
  container.cornerRadius = 24;

  // Helper Text Factory (Strict Positioning)
  function createText(characters, x, y, size, weight = "Regular", color = COLOR_TEXT) {
    const t = figma.createText();
    t.fontName = { family: "${font}", style: weight };
    t.characters = String(characters);
    t.fontSize = size;
    t.x = x;
    t.y = y;
    t.fills = [{ type: 'SOLID', color: color }];
    return t;
  }

  ${createComponents ? `
  // Master Component Frame Container
  const compMasterFrame = figma.createFrame();
  compMasterFrame.name = "❖ Component Library";
  compMasterFrame.x = 40;
  compMasterFrame.y = 40;
  compMasterFrame.resize(320, 100);
  compMasterFrame.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  compMasterFrame.strokes = [{ type: 'SOLID', color: COLOR_PRIMARY }];
  compMasterFrame.strokeWeight = 1;
  compMasterFrame.cornerRadius = 16;
  
  const compTitle = createText("❖ Component Masters", 16, 12, 11, "Bold", COLOR_PRIMARY);
  compMasterFrame.appendChild(compTitle);

  // Master Primary Button Component
  const masterBtn = figma.createComponent();
  masterBtn.name = "Button / Primary";
  masterBtn.x = 16; masterBtn.y = 36;
  masterBtn.resize(130, 44);
  masterBtn.cornerRadius = 12;
  masterBtn.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
  const masterBtnTxt = createText("Action", 40, 13, 14, "Bold", { r: 1, g: 1, b: 1 });
  masterBtn.appendChild(masterBtnTxt);
  compMasterFrame.appendChild(masterBtn);

  // Master Card Component
  const masterCard = figma.createComponent();
  masterCard.name = "Card / Metric";
  masterCard.x = 160; masterCard.y = 36;
  masterCard.resize(140, 44);
  masterCard.cornerRadius = 12;
  masterCard.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
  masterCard.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
  masterCard.strokeWeight = 1;
  const masterCardTxt = createText("Metric Card", 20, 13, 12, "Bold", COLOR_TEXT);
  masterCard.appendChild(masterCardTxt);
  compMasterFrame.appendChild(masterCard);

  container.appendChild(compMasterFrame);
  ` : ''}

  // Helper to create primary button instance/frame
  function createButton(label, x, y, width, height) {
    ${createComponents ? `
    const btnInst = masterBtn.createInstance();
    btnInst.name = "Button / " + label;
    btnInst.x = x; btnInst.y = y;
    btnInst.resize(width, height);
    const txt = btnInst.findOne(n => n.type === "TEXT");
    if (txt) {
      txt.characters = label;
      txt.x = Math.max(10, (width - (label.length * 8)) / 2);
      txt.y = (height - 16) / 2;
    }
    return btnInst;
    ` : `
    const btn = figma.createFrame();
    btn.name = "Button / " + label;
    btn.x = x; btn.y = y;
    btn.resize(width, height);
    btn.cornerRadius = 12;
    btn.fills = [{ type: 'SOLID', color: COLOR_PRIMARY }];
    const labelTxt = createText(label, (width - (label.length * 8)) / 2, (height - 16) / 2, 14, "Bold", { r: 1, g: 1, b: 1 });
    btn.appendChild(labelTxt);
    return btn;
    `}
  }

  // 4. Render Each Screen Side-by-Side
  const screenList = ${JSON.stringify(screens)};
  screenList.forEach((scr, idx) => {
    const screenFrame = figma.createFrame();
    screenFrame.name = scr.title;
    screenFrame.x = 40 + idx * (${device.width} + 40);
    screenFrame.y = ${createComponents ? 160 : 40};
    screenFrame.resize(${device.width}, ${device.height});
    screenFrame.cornerRadius = 20;
    screenFrame.fills = [{ type: 'SOLID', color: COLOR_BG }];

    // A. Top Header Bar (Y: 24, Height: 32)
    const headerTitle = createText(scr.title, 20, 24, 18, "Bold", COLOR_TEXT);
    const headerStatus = createText("🟢 Live", ${device.width} - 80, 28, 11, "Bold", COLOR_ACCENT);
    screenFrame.appendChild(headerTitle);
    screenFrame.appendChild(headerStatus);

    // B. Hero Feature Card (Y: 70, Height: 116) - NON-OVERLAPPING Y MATH
    const heroCard = figma.createFrame();
    heroCard.name = "Hero Metric Card";
    heroCard.x = 20; heroCard.y = 70;
    heroCard.resize(${device.width - 40}, 116);
    heroCard.cornerRadius = 14;
    heroCard.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
    heroCard.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
    heroCard.strokeWeight = 1;

    // Strict Non-Overlapping Sub-elements inside Hero Card:
    const cardTag = createText("PRIMARY METRIC • " + scr.subtitle.toUpperCase(), 16, 16, 10, "Bold", COLOR_MUTED);
    const cardValue = createText(idx === 0 ? "$48,920.50" : (idx === 1 ? "1,420 Active" : "+84.5% Growth"), 16, 38, 24, "Bold", COLOR_TEXT);
    const cardSub = createText("↑ +14.2% increased performance", 16, 76, 11, "Medium", COLOR_ACCENT);

    heroCard.appendChild(cardTag);
    heroCard.appendChild(cardValue);
    heroCard.appendChild(cardSub);
    screenFrame.appendChild(heroCard);

    // C. Section 1: Quick Actions (Y: 206)
    const section1Title = createText("Quick Overview", 20, 206, 12, "Bold", COLOR_MUTED);
    screenFrame.appendChild(section1Title);

    // Sub-cards Row (Y: 228, Height: 84)
    const cardW = (${device.width - 50}) / 2;
    
    const subCard1 = figma.createFrame();
    subCard1.name = "Sub Card 1";
    subCard1.x = 20; subCard1.y = 228;
    subCard1.resize(cardW, 84);
    subCard1.cornerRadius = 12;
    subCard1.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
    subCard1.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
    subCard1.strokeWeight = 1;
    subCard1.appendChild(createText("Stat Alpha", 12, 12, 10, "Bold", COLOR_MUTED));
    subCard1.appendChild(createText("840", 12, 30, 18, "Bold", COLOR_TEXT));
    subCard1.appendChild(createText("Optimal", 12, 58, 10, "Medium", COLOR_ACCENT));
    screenFrame.appendChild(subCard1);

    const subCard2 = figma.createFrame();
    subCard2.name = "Sub Card 2";
    subCard2.x = 20 + cardW + 10; subCard2.y = 228;
    subCard2.resize(cardW, 84);
    subCard2.cornerRadius = 12;
    subCard2.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
    subCard2.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
    subCard2.strokeWeight = 1;
    subCard2.appendChild(createText("Stat Beta", 12, 12, 10, "Bold", COLOR_MUTED));
    subCard2.appendChild(createText("99.9%", 12, 30, 18, "Bold", COLOR_TEXT));
    subCard2.appendChild(createText("Verified", 12, 58, 10, "Medium", COLOR_PRIMARY));
    screenFrame.appendChild(subCard2);

    // D. Section 2: Recent Activity List (Y: 332)
    const section2Title = createText("Recent Activity Log", 20, 332, 12, "Bold", COLOR_MUTED);
    screenFrame.appendChild(section2Title);

    // 3 List Rows (Y: 354, 410, 466)
    for (let r = 0; r < 3; r++) {
      const rowY = 354 + r * 56;
      const listRow = figma.createFrame();
      listRow.name = "Activity Row " + (r + 1);
      listRow.x = 20; listRow.y = rowY;
      listRow.resize(${device.width - 40}, 46);
      listRow.cornerRadius = 10;
      listRow.fills = [{ type: 'SOLID', color: COLOR_SURFACE }];
      listRow.strokes = [{ type: 'SOLID', color: COLOR_BORDER }];
      listRow.strokeWeight = 1;

      const rowLabel = createText("Activity Event #" + (r + 1), 14, 15, 12, "Medium", COLOR_TEXT);
      const rowVal = createText(r % 2 === 0 ? "+$250.00" : "Completed", ${device.width - 130}, 15, 11, "Bold", r % 2 === 0 ? COLOR_ACCENT : COLOR_MUTED);
      
      listRow.appendChild(rowLabel);
      listRow.appendChild(rowVal);
      screenFrame.appendChild(listRow);
    }

    // E. Bottom Primary Button (Fixed at Bottom: Y = DeviceHeight - 70)
    const btnY = ${device.height} - 70;
    const actionBtn = createButton("Continue to " + scr.title, 20, btnY, ${device.width - 40}, 48);
    screenFrame.appendChild(actionBtn);

    container.appendChild(screenFrame);
  });

  figma.currentPage.appendChild(container);
  figma.viewport.scrollAndZoomIntoView([container]);
})(figma);
`;

  return { scriptCode, screenCount: screens.length };
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/api/watch') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    clients.push(res);
    console.log(`[Server] Figma Plugin Client Connected (Active: ${clients.length})`);
    req.on('close', () => {
      clients = clients.filter(c => c !== res);
      console.log(`[Server] Figma Plugin Client Disconnected (Active: ${clients.length})`);
    });
    return;
  }

  if (req.url === '/api/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      clientCount: clients.length,
      pluginConnected: clients.length > 0
    }));
    return;
  }

  if (req.url === '/api/generate' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { prompt, constraints } = payload;
        
        console.log(`[Generator] Generating script for prompt: "${prompt.substring(0, 50)}..."`);
        
        const { scriptCode, screenCount } = generateFigmaScript(prompt, constraints);
        const targetFilename = 'latest_generated.js';
        const targetPath = path.join(SCRIPTS_DIR, targetFilename);

        fs.writeFileSync(targetPath, scriptCode, 'utf8');

        clients.forEach(client => {
          client.write(`data: ${JSON.stringify({ event: 'run-generated', filename: targetFilename })}\n\n`);
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, filename: targetFilename, screenCount, mode: constraints.mode }));
      } catch (err) {
        console.error('[Generator Error]', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  if (req.url.startsWith('/api/scripts/')) {
    const fileName = decodeURIComponent(req.url.substring('/api/scripts/'.length));
    const filePath = path.join(SCRIPTS_DIR, fileName);

    if (!filePath.startsWith(SCRIPTS_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Access Denied');
      return;
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.end(data);
    });
    return;
  }

  let reqPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(WEB_DIR, path.normalize(reqPath));

  if (filePath.startsWith(WEB_DIR) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    if (ext === '.css') contentType = 'text/css';
    if (ext === '.js') contentType = 'text/javascript';
    if (ext === '.json') contentType = 'application/json';
    if (ext === '.png') contentType = 'image/png';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Figma AI Web Platform Running at: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
