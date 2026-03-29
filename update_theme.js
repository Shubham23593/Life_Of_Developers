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

  // Replace Colors
  content = content.replace(/orange-500/g, 'green-500');
  content = content.replace(/orange-400/g, 'green-400');
  content = content.replace(/orange-200/g, 'green-300');
  content = content.replace(/cyan-400/g, 'green-400');
  content = content.replace(/cyan-500/g, 'green-500');
  content = content.replace(/slate-950/g, 'black');
  content = content.replace(/slate-900/g, 'black');
  content = content.replace(/slate-800/g, 'gray-900');
  content = content.replace(/slate-400/g, 'green-600');
  content = content.replace(/slate-200/g, 'green-400');
  content = content.replace(/text-white/g, 'text-green-500');
  content = content.replace(/bg-\[\#020617\]/g, 'bg-black');
  content = content.replace(/#020617/g, '#000000');
  content = content.replace(/249\s*,\s*115\s*,\s*22/g, '34,197,94'); // rgba green
  content = content.replace(/249,115,22/g, '34,197,94');
  content = content.replace(/linear-gradient\(135deg,#f97316,#ea580c\)/g, 'linear-gradient(135deg,#22c55e,#16a34a)');
  content = content.replace(/linear-gradient\(to right, #00f0ff, #7b2fff, #ff4081\)/g, 'linear-gradient(to right, #22c55e, #16a34a, #15803d)');
  content = content.replace(/#ff4081/g, '#22c55e');
  content = content.replace(/#00f0ff/g, '#22c55e');
  content = content.replace(/rgba\(255,255,255/g, 'rgba(34,197,94'); 
  content = content.replace(/#ffffff/g, '#22c55e');
  content = content.replace(/#fff/g, '#22c55e');
  
  // Replace Typography with pure monospace
  content = content.replace(/var\(--font-sans\)/g, 'var(--font-mono)');
  content = content.replace(/font-sans/g, 'font-mono');
  content = content.replace(/font-black/g, 'font-bold'); // Tone down extreme font sizes slightly
  
  fs.writeFileSync(file, content);
});

console.log('Update Complete.');
