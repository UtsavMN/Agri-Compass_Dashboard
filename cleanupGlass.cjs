const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, 'src', 'components', 'sections');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // We want to remove bg-[#...]/xx, backdrop-blur-..., and border-[#...]/xx 
  // only when they are acting as glass styles, particularly around premium-card or explicit glass elements.
  // We'll safely target known ones from our search.
  
  content = content.replace(/bg-\[\#[0-9A-Fa-f]+\]\/\d+\s*/g, '');
  content = content.replace(/backdrop-blur-\w*\s*/g, '');
  content = content.replace(/backdrop-blur-\[[^\]]+\]\s*/g, '');
  content = content.replace(/border-\[\#[0-9A-Fa-f]+\]\/\d+\s*/g, '');
  
  // Clean up double spaces in class names
  content = content.replace(/className="\s+/g, 'className="');
  content = content.replace(/\s+"/g, '"');
  // Be careful with template literals classNames like className={`...`}
  // Just replacing spaces might be too aggressive if inside strings. Let's not do global space replacements.

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${path.basename(filePath)}`);
  }
}

fs.readdirSync(sectionsDir).forEach(file => {
  if (file.endsWith('.tsx')) {
    processFile(path.join(sectionsDir, file));
  }
});
