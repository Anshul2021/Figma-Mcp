/**
 * Morph — Figma Plugin Main Thread (code.js)
 * 
 * Runs in Figma's main thread (sandbox). Receives messages from ui.html
 * and executes scripts on the Figma canvas.
 */

// Open plugin UI with comfortable default dimensions
figma.showUI(__html__, { width: 400, height: 600, themeColors: true });

// Restore persisted user name + UI size on plugin open
(async () => {
  try {
    const [name, size] = await Promise.all([
      figma.clientStorage.getAsync('morph_user_name'),
      figma.clientStorage.getAsync('morph_ui_size'),
    ]);
    figma.ui.postMessage({ type: 'init-state', userName: name || '', uiSize: size || 'm' });
  } catch (e) {
    figma.ui.postMessage({ type: 'init-state', userName: '', uiSize: 'm' });
  }
})();

// Listen for messages from the plugin UI frame
figma.ui.onmessage = async (msg) => {
  // Window resize
  if (msg.type === 'resize-window') {
    if (msg.width && msg.height) {
      figma.ui.resize(Math.max(320, msg.width), Math.max(360, msg.height));
    }
  }
  // Persist the onboarding user name
  else if (msg.type === 'save-name') {
    try {
      await figma.clientStorage.setAsync('morph_user_name', String(msg.name || ''));
    } catch (e) { /* ignore */ }
  }
  // Persist the S/M/XL UI size preference
  else if (msg.type === 'save-ui-size') {
    try {
      await figma.clientStorage.setAsync('morph_ui_size', String(msg.size || 'm'));
    } catch (e) { /* ignore */ }
  }
  // Script execution request (from ui.html after fetching from server)
  else if (msg.type === 'run-script') {
    const scriptName = msg.scriptName;
    figma.ui.postMessage({ type: 'fetch-and-eval', scriptName });
  }
  // Evaluate fetched script code on the Figma canvas
  else if (msg.type === 'eval-code') {
    try {
      figma.notify(`Generating: ${msg.scriptName || 'UI'}...`, { timeout: 1500 });

      // Pre-load default fonts
      try {
        await figma.loadFontAsync({ family: "DM Sans", style: "Regular" });
        await figma.loadFontAsync({ family: "DM Sans", style: "Medium" });
        await figma.loadFontAsync({ family: "DM Sans", style: "Bold" });
      } catch (fontErr) {
        console.warn("Font pre-load notice:", fontErr);
      }

      // Record existing root children before script execution
      const existingChildren = new Set(figma.currentPage.children);

      // Execute the generated script
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const runFn = new AsyncFunction('figma', msg.code);
      await runFn(figma);

      // Post-Process: Inspect newly created nodes
      const newNodes = figma.currentPage.children.filter(node => !existingChildren.has(node));
      const finalSelection = [];

      for (const node of newNodes) {
        if (node.type === 'FRAME') {
          // 1. Prevent content clipping so screen elements are never cut off
          node.clipsContent = false;

          // 2. Automatically unwrap/ungroup generic "Generated UI Screens" or "Root Container" wrappers
          if (node.name === 'Generated UI Screens' || node.name === 'Root Container' || node.name === 'Generated Screens') {
            const innerChildren = Array.from(node.children);
            for (const child of innerChildren) {
              child.x = node.x + child.x;
              child.y = node.y + child.y;
              figma.currentPage.appendChild(child);
              if (child.type === 'FRAME') {
                child.clipsContent = false;
              }
              finalSelection.push(child);
            }
            node.remove();
          } else {
            finalSelection.push(node);
          }
        } else {
          finalSelection.push(node);
        }
      }

      // Select new screen nodes and zoom viewport directly to them
      if (finalSelection.length > 0) {
        figma.currentPage.selection = finalSelection;
        try {
          figma.viewport.scrollAndZoomIntoView(finalSelection);
        } catch (vErr) { /* ignore */ }
      }

      figma.notify(`Rendered: ${msg.scriptName || 'Screen'}`, { timeout: 2500 });
      figma.ui.postMessage({ type: 'execution-status', status: 'success', scriptName: msg.scriptName });
    } catch (err) {
      console.error("Execution Error:", err);
      figma.notify(`Error: ${err.message}`, { error: true, timeout: 4000 });
      figma.ui.postMessage({ type: 'execution-status', status: 'error', error: err.message, scriptName: msg.scriptName });
    }
  }
};
