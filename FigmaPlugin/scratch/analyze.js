const fs = require('fs');
const content = fs.readFileSync('c:/Users/Gyan/Desktop/Figma-Script-Runner/figma-hot-reload/reference.md', 'utf8');
const regex = /font-size:\s*([\d\.]+)px/g;
const sizes = new Set();
let match;
while ((match = regex.exec(content)) !== null) {
  sizes.add(match[1]);
}
console.log('Unique font sizes in reference.md:', Array.from(sizes));
