const fs = require('fs');

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (let file of list) {
    const name = dir + '/' + file;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('.jsx') || name.endsWith('.js')) {
      files.push(name);
    }
  }
  return files;
}

const allFiles = [...getFiles('src/components'), 'src/app/layout.js', 'src/app/page.js', 'src/lib/utils.js'];

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Convert Cyan & Pink to Orange
  content = content.replace(/cyan-500/g, 'orange-500');
  content = content.replace(/cyan-400/g, 'orange-400');
  content = content.replace(/cyan-300/g, 'orange-300');
  content = content.replace(/cyan-200/g, 'orange-200');
  content = content.replace(/text-white/g, 'text-slate-200');
  
  content = content.replace(/#00f0ff/g, '#f97316'); // Cyan to Orange
  content = content.replace(/#7b2fff/g, '#ea580c'); // Purple to Darker Orange
  content = content.replace(/#ff4081/g, '#fdba74'); // Pink to Light Orange

  // Convert Hex to RGBA
  content = content.replace(/rgba\(0,240,255/g, 'rgba(249,115,22');
  content = content.replace(/rgba\(0,\s*240,\s*255/g, 'rgba(249,115,22');
  content = content.replace(/rgba\(123,47,255/g, 'rgba(234,88,12');
  content = content.replace(/rgba\(123,\s*47,\s*255/g, 'rgba(234,88,12');

  // Convert Layout Backgrounds
  content = content.replace(/bg-black/g, 'bg-slate-950');

  // Force Layout styling
  if (file.includes('layout.js')) {
    content = content.replace(/<body className="[^"]*"/, '<body className="bg-slate-950 text-slate-200 font-sans selection:bg-orange-500 selection:text-black antialiased overflow-x-hidden"');
  }

  fs.writeFileSync(file, content);
});

console.log('Globally Enforced Slate-950 and Orange Sci-Fi aesthetics.');
