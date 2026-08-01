// Open the UI Panel
figma.showUI(__html__, { width: 320, height: 450 });

// Listen to messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'run-script') {
    const scriptName = msg.scriptName;
    figma.ui.postMessage({ type: 'fetch-and-eval', scriptName });
  } 
  else if (msg.type === 'eval-code') {
    try {
      // 1. Automatic Canvas Clean-Up
      // Find and remove any existing frame named "Board" on the current page to prevent stack duplication
      const existingBoard = figma.currentPage.findChild(node => node.name === "Board");
      if (existingBoard) {
        existingBoard.remove();
      }

      // 2. Execute new script dynamically
      const runFn = new Function('figma', msg.code);
      runFn(figma);
      
      figma.notify(`Updated: ${msg.scriptName}`, { timeout: 1000 });
    } catch (err) {
      console.error(err);
      figma.notify(`Execution error: ${err.message}`, { error: true });
    }
  }
};
