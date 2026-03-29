const fs = require('fs');

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (let file of list) {
    const name = dir + '/' + file;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('.jsx') || name.endsWith('.js')) {
      if (!name.includes('Hero.jsx')) { // Skip Hero.jsx
        files.push(name);
      }
    }
  }
  return files;
}

const allFiles = [...getFiles('src/components'), 'src/app/layout.js', 'src/app/page.js', 'src/lib/utils.js'];

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Text
  content = content.replace(/text-green-500/g, 'text-cyan-400');
  content = content.replace(/text-green-400/g, 'text-white/80');
  content = content.replace(/text-green-600/g, 'text-slate-400');
  
  // Tailwind Backgrounds/Borders
  content = content.replace(/border-green-500\/30/g, 'border-[#7b2fff]/30');
  content = content.replace(/border-green-500\/10/g, 'border-cyan-400/20');
  content = content.replace(/bg-green-500/g, 'bg-cyan-500');
  
  // RGBA Values
  content = content.replace(/rgba\(34,\s*197,\s*94/g, 'rgba(0,240,255');
  content = content.replace(/rgba\(22,\s*163,\s*74/g, 'rgba(123,47,255');
  
  // Hex Colors
  content = content.replace(/#22c55e/g, '#00f0ff');
  content = content.replace(/#16a34a/g, '#7b2fff');
  content = content.replace(/#15803d/g, '#ff4081');
  
  // Gradients
  content = content.replace(/linear-gradient\(135deg,#00f0ff,#7b2fff\)/g, 'linear-gradient(135deg, #00f0ff, #7b2fff, #ff4081)');
  
  // Global Selection
  content = content.replace(/selection:bg-green-500/g, 'selection:bg-cyan-500');

  // Fix Layout
  if (file.includes('layout.js')) {
      content = content.replace(/text-white\/80/g, 'text-slate-200'); // the text-green-400 replace turns it to white/80, make it slate-200
      // Restore Inter mapping
      content = content.replace(/variable: '--font-mono',\n\s*weight: \['300', '400', '500', '700', '900'\],/g, "variable: '--font-sans',\n  weight: ['300', '400', '500', '700', '900'],");
  }

  // Restore non-terminal typography.
  content = content.replace(/fontFamily: "var\(--font-mono\)"/g, 'fontFamily: "var(--font-sans)"');

  fs.writeFileSync(file, content);
});

console.log('Restored Developer Life theme.');
