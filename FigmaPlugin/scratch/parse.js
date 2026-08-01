const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../reference.md');
const destHtmlPath = path.join(__dirname, '../index.html');
const destCssPath = path.join(__dirname, '../globals.css');

// Read reference HTML content
let content = fs.readFileSync(srcPath, 'utf8');

// Robust splitter for styles that ignores semicolons inside url(...) or quotes
function splitStyle(styleStr) {
  const result = [];
  let current = '';
  let inParens = false;
  let inQuote = null;
  for (let i = 0; i < styleStr.length; i++) {
    const char = styleStr[i];
    if (char === '(') inParens = true;
    else if (char === ')') inParens = false;
    else if (char === '"' || char === "'") {
      if (inQuote === char) inQuote = null;
      else if (!inQuote) inQuote = char;
    }
    
    if (char === ';' && !inParens && !inQuote) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    result.push(current);
  }
  return result;
}

// Parse all inline styles
let styleCounter = 1;
const stylesMap = new Map();
const cssClasses = [];

// Regular expression to find all style attributes: style="..."
const styleRegex = /style="([^"]*)"/g;

// Replace styles with class names and map them
const replacedContent = content.replace(styleRegex, (match, styleContent) => {
  // Split the rules using our robust splitter
  const rawRules = splitStyle(styleContent);
  const parsedRules = [];
  let hasFontFamily = false;

  for (let rule of rawRules) {
    rule = rule.trim();
    if (!rule) continue;
    
    // Find key and value
    const colonIdx = rule.indexOf(':');
    if (colonIdx === -1) {
      parsedRules.push(rule);
      continue;
    }
    
    const key = rule.substring(0, colonIdx).trim().toLowerCase();
    let val = rule.substring(colonIdx + 1).trim();
    
    if (key === 'font-family') {
      val = "'DM Sans', sans-serif";
      hasFontFamily = true;
    } else if (key === 'font-size') {
      const match = val.match(/^([\d\.]+)px$/i);
      if (match) {
        let size = parseInt(match[1], 10);
        if (size < 12) {
          size = 12;
        } else if (size % 2 !== 0) {
          size = size + 1; // Round up to next even number in the scale
        }
        val = `${size}px`;
      }
    }
    
    parsedRules.push(`${key}: ${val}`);
  }

  // Ensure font family is always set to DM Sans
  if (!hasFontFamily) {
    parsedRules.push("font-family: 'DM Sans', sans-serif");
  }

  let finalStyle = parsedRules.join('; ') + ';';

  // Check if this exact style content has been mapped already to reuse classes
  let className;
  if (stylesMap.has(finalStyle)) {
    className = stylesMap.get(finalStyle);
  } else {
    className = `el-style-${styleCounter++}`;
    stylesMap.set(finalStyle, className);
    
    // Custom styling for the outermost container (class name el-style-1) to act as a sleek bezel
    let rulesStr = parsedRules.map(s => s.trim()).filter(Boolean).join(';\n  ') + ';';
    if (className === 'el-style-1') {
      rulesStr += '\n  border-radius: 40px;\n  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 12px #1E1B1E;';
    }
    
    cssClasses.push(`.${className} {\n  ${rulesStr}\n}`);
  }

  return `class="${className}"`;
});

// Build the index.html content
const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Discover Events Mockup</title>
  <!-- DM Sans Google Font -->
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="globals.css">
  <style>
    /* Reset and Center Page Simulator styling */
    body {
      margin: 0;
      padding: 0;
      font-family: 'DM Sans', sans-serif;
      background: #E2E8F0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      overflow-x: hidden;
    }
  </style>
</head>
<body>
  ${replacedContent}
</body>
</html>`;

// Write outputs
fs.writeFileSync(destHtmlPath, indexHtmlContent, 'utf8');
fs.writeFileSync(destCssPath, cssClasses.join('\n\n'), 'utf8');

console.log(`Successfully parsed reference.md!`);
console.log(`Generated class styles: ${styleCounter - 1}`);
console.log(`Written index.html and globals.css`);
