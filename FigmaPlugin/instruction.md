# Figma Script Generation Instructions

Always adhere to the following rules when writing or generating Figma scripts for the runner:

1. **Draw on Current Page Only**:
   * Do NOT create new pages (`figma.createPage()`) or modify other pages.
   * Do NOT search for page names or clear page children (`[...page.children].forEach(...)`) as this can wipe out the user's existing work on the active tab.
   * Always reference the active page directly:
     ```javascript
     const page = figma.currentPage;
     ```
   * Append all generated root frames (like `Board`) to the current page:
     ```javascript
     page.appendChild(board);
     ```

2. **Self-Contained Canvas Clean-up**:
   * Root frames should be contained inside a main container named `Board`.
   * The plugin code (`code.js`) will handle deleting the old `Board` before evaluating, keeping layout execution clean.
