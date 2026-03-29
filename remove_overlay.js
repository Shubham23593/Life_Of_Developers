const fs = require('fs');
const path = require('path');
const pagePath = path.join(__dirname, 'src', 'app', 'page.js');

let content = fs.readFileSync(pagePath, 'utf8');

// Use regex to remove Overlay import
content = content.replace(/const Overlay = dynamic\(\(\) => import\('@\/components\/layout\/Overlay'\), \{\s+ssr: false,\s+\}\);\s*/, '');

// Use regex to remove Overlay invocation
content = content.replace(/\{\/\* ── Persistent Nav \/ HUD \(visible post-load\) ── \*\/}[\s\n\r]*<Overlay isLoaded=\{isLoaded\} \/>[\s\n\r]*/, '');

fs.writeFileSync(pagePath, content);
console.log('Removed global Overlay successfully');
