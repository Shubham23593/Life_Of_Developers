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

  // Nuclear option: replace all green shades with cyan shades.
  content = content.replace(/green-500/g, 'cyan-400');
  content = content.replace(/green-400/g, 'cyan-300');
  content = content.replace(/green-300/g, 'cyan-200');

  fs.writeFileSync(file, content);
});

console.log('Final pass: Purged leftover green variables.');
