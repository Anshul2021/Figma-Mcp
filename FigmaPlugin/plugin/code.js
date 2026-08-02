// Open the UI Panel in Figma with comfortable default dimensions
figma.showUI(__html__, { width: 380, height: 560, themeColors: true });

// Listen for messages from the plugin UI frame
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'resize-window') {
    if (msg.width && msg.height) {
      figma.ui.resize(Math.max(320, msg.width), Math.max(400, msg.height));
    }
  }
  else if (msg.type === 'run-script') {
    const scriptName = msg.scriptName;
    figma.ui.postMessage({ type: 'fetch-and-eval', scriptName });
  } 
  else if (msg.type === 'eval-code') {
    try {
      figma.notify("Generating UI screens...", { timeout: 1500 });

      // Clean up previous generated board if exists
      const existingBoard = figma.currentPage.findChild(node => node.name === "Generated UI Screens");
      if (existingBoard) {
        existingBoard.remove();
      }

      // Pre-load default DM Sans fonts asynchronously
      try {
        await figma.loadFontAsync({ family: "DM Sans", style: "Regular" });
        await figma.loadFontAsync({ family: "DM Sans", style: "Medium" });
        await figma.loadFontAsync({ family: "DM Sans", style: "Bold" });
      } catch (fontErr) {
        console.warn("Default font pre-load notice:", fontErr);
      }

      // Use AsyncFunction so generated script can use await
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const runFn = new AsyncFunction('figma', msg.code);
      
      await runFn(figma);
      
      // Auto-focus on generated content
      const generatedBoard = figma.currentPage.findChild(node => node.name === "Generated UI Screens");
      if (generatedBoard) {
        figma.viewport.scrollAndZoomIntoView([generatedBoard]);
      }

      figma.notify(`Successfully created screens (${msg.scriptName || 'Dynamic Script'})`, { timeout: 2500 });
      figma.ui.postMessage({ type: 'execution-status', status: 'success', scriptName: msg.scriptName });
    } catch (err) {
      console.error("Execution Error:", err);
      figma.notify(`Execution Error: ${err.message}`, { error: true, timeout: 4000 });
      figma.ui.postMessage({ type: 'execution-status', status: 'error', error: err.message, scriptName: msg.scriptName });
    }
  }
};
