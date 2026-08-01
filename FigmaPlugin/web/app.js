// Web Platform Client Application Script
const serverUrl = 'http://localhost:3003';

// DOM Elements
const pluginStatusBadge = document.getElementById('pluginStatusBadge');
const pluginStatusText = document.getElementById('pluginStatusText');
const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const outputConsole = document.getElementById('outputConsole');
const outputTime = document.getElementById('outputTime');

// Simplified State Object
const state = {
  device: {
    name: 'mobile',
    width: 375,
    height: 812
  },
  mode: 'dark', // 'dark' or 'light'
  colorPreset: 'dark-cyber',
  font: 'Inter', // 'Inter' or 'Poppins'
  createComponents: true
};

// Preset Prompts Database
const PROMPT_PRESETS = {
  crypto: "Create a Fintech Crypto Wallet App featuring a main Dashboard with balance card, Send Crypto screen, Transaction History list, and User Settings...",
  fitness: "Create a Fitness Tracker App featuring a daily Activity Dashboard with Calorie Ring progress, Workout Details screen with exercise counters, and Analytics progress graph...",
  food: "Create a Food Delivery App featuring a Home Explore feed with category pills, Restaurant Menu detail screen with dish cards, and Checkout screen with total price...",
  saas: "Create a SaaS Analytics Admin Dashboard featuring a Revenue KPI overview screen, User Management data table, and Billing Plans subscription page...",
  single: "Create a sleek Login & Authentication Screen with Email & Password inputs, Social Sign-In buttons, and Remember Me toggle..."
};

// Initialize Listeners
document.addEventListener('DOMContentLoaded', () => {
  setupStatusCheck();
  setupPresetPills();
  setupDeviceGrid();
  setupModeGrid();
  setupPaletteGrid();
  setupFontGrid();
  setupComponentCheckbox();
  setupGenerateAction();
});

// 1. Connection Monitor
function setupStatusCheck() {
  function checkConnection() {
    fetch(`${serverUrl}/api/status`)
      .then(res => res.json())
      .then(data => {
        if (data.pluginConnected) {
          pluginStatusBadge.className = 'connection-pill connected';
          pluginStatusText.textContent = `Figma Plugin Connected (${data.clientCount} active)`;
        } else {
          pluginStatusBadge.className = 'connection-pill';
          pluginStatusText.textContent = 'Figma Plugin Waiting... (Open plugin in Figma)';
        }
      })
      .catch(() => {
        pluginStatusBadge.className = 'connection-pill';
        pluginStatusText.textContent = 'Server Disconnected (Start server.js)';
      });
  }
  checkConnection();
  setInterval(checkConnection, 3000);
}

// 2. Preset Pills
function setupPresetPills() {
  document.querySelectorAll('.template-pills .pill-btn').forEach(pill => {
    pill.addEventListener('click', () => {
      const presetKey = pill.getAttribute('data-preset');
      if (PROMPT_PRESETS[presetKey]) {
        promptInput.value = PROMPT_PRESETS[presetKey];
        addLog(`Loaded '${pill.textContent}' template into prompt box.`, 'info');
      }
    });
  });
}

// 3. Device Selection
function setupDeviceGrid() {
  const cards = document.querySelectorAll('#deviceGrid .device-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.device = {
        name: card.getAttribute('data-device'),
        width: parseInt(card.getAttribute('data-width'), 10),
        height: parseInt(card.getAttribute('data-height'), 10)
      };
      addLog(`Target device: ${state.device.name} (${state.device.width}x${state.device.height}px)`, 'info');
    });
  });
}

// 4. Appearance Mode (Light vs Dark)
function setupModeGrid() {
  const cards = document.querySelectorAll('#modeGrid .mode-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.mode = card.getAttribute('data-mode');
      addLog(`App mode set to: ${state.mode.toUpperCase()} Mode`, 'info');
    });
  });
}

// 5. Color Palette Selection
function setupPaletteGrid() {
  const cards = document.querySelectorAll('#paletteGrid .palette-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.colorPreset = card.getAttribute('data-preset');
      addLog(`Applied '${card.querySelector('.palette-name').textContent}' color theme.`, 'info');
    });
  });
}

// 6. Font Selection (Inter vs Poppins)
function setupFontGrid() {
  const fontBtns = document.querySelectorAll('#fontGrid .font-btn');
  fontBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fontBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.font = btn.getAttribute('data-font');
      addLog(`Selected font family: ${state.font}`, 'info');
    });
  });
}

// 7. Component Checkbox
function setupComponentCheckbox() {
  const toggle = document.getElementById('createComponentToggle');
  toggle.addEventListener('change', (e) => {
    state.createComponents = e.target.checked;
    addLog(`Generate components: ${state.createComponents ? 'Enabled' : 'Disabled (Faster generation)'}`, 'info');
  });
}

// 8. Generate & Sync Action
function setupGenerateAction() {
  generateBtn.addEventListener('click', async () => {
    const promptText = promptInput.value.trim();
    if (!promptText) {
      alert("Please enter a description or pick a template before generating.");
      promptInput.focus();
      return;
    }

    generateBtn.disabled = true;
    generateBtn.style.opacity = '0.7';
    generateBtn.querySelector('.btn-text').textContent = 'Analyzing Prompt & Generating Figma Script...';
    
    addLog(`🚀 Generating Figma design...`, 'info');

    const payload = {
      prompt: promptText,
      constraints: state
    };

    try {
      const response = await fetch(`${serverUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        addLog(`✨ Script generated (${data.screenCount} screens, ${data.mode} mode)!`, 'success');
        addLog(`⚡ Sent payload to active Figma canvas! Check your Figma file.`, 'success');
      } else {
        throw new Error(data.error || 'Failed to generate script');
      }
    } catch (err) {
      addLog(`❌ Error: ${err.message}`, 'error');
    } finally {
      generateBtn.disabled = false;
      generateBtn.style.opacity = '1';
      generateBtn.querySelector('.btn-text').textContent = 'Generate & Sync to Figma';
    }
  });
}

// Helper: Add Console Logs
function addLog(msg, type = 'info') {
  const line = document.createElement('div');
  line.className = `log-line ${type}`;
  line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  outputConsole.appendChild(line);
  outputConsole.scrollTop = outputConsole.scrollHeight;
  outputTime.textContent = new Date().toLocaleTimeString();
}
