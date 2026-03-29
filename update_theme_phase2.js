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

  // Purge Cyan
  content = content.replace(/rgba\(0,240,255/g, 'rgba(34,197,94');
  content = content.replace(/rgba\(0,\s*240,\s*255/g, 'rgba(34,197,94');
  
  // Purge Purple
  content = content.replace(/#7b2fff/gi, '#16a34a');
  content = content.replace(/rgba\(123,47,255/g, 'rgba(22,163,74');
  content = content.replace(/rgba\(123,\s*47,\s*255/g, 'rgba(22,163,74');

  // Purge Pink
  content = content.replace(/#ff4081/gi, '#15803d');
  
  // Purge tailwind variants
  content = content.replace(/text-cyan-400/g, 'text-green-500');
  content = content.replace(/text-cyan-500/g, 'text-green-500');
  content = content.replace(/bg-cyan-500/g, 'bg-green-500');
  content = content.replace(/bg-cyan-400/g, 'bg-green-500');

  fs.writeFileSync(file, content);
});

console.log('Update Phase 2 Complete.');
