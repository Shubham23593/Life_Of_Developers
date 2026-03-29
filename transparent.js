const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, 'src', 'components', 'sections');
const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    const filePath = path.join(sectionsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace all solid background classes with bg-transparent
    content = content.replace(/bg-slate-950/g, 'bg-transparent');
    content = content.replace(/bg-\[#050508\]/g, 'bg-transparent');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file} to bg-transparent`);
});

const heroScenePath = path.join(__dirname, 'src', 'components', 'canvas', 'HeroScene.jsx');
if (fs.existsSync(heroScenePath)) {
    let content = fs.readFileSync(heroScenePath, 'utf8');
    // Remove background style completely or enforce transparent, and set alpha: true
    content = content.replace(/style=\{\{ background: '#000000' \}\}/g, 'style={{ background: "transparent" }}');
    content = content.replace(/alpha: false/g, 'alpha: true');
    fs.writeFileSync(heroScenePath, content);
    console.log('Updated HeroScene.jsx transparency');
}

const pagePath = path.join(__dirname, 'src', 'app', 'page.js');
if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');
    
    // Check if RetroGridBackground is imported
    if (!content.includes('RetroGridBackground')) {
        content = content.replace(
            "import BlueprintAssembly from '@/components/sections/BlueprintAssembly';",
            "import BlueprintAssembly from '@/components/sections/BlueprintAssembly';\nimport RetroGridBackground from '@/components/canvas/RetroGridBackground';"
        );
        
        // Insert RetroGridBackground inside <main className="relative">
        content = content.replace(
            /<main className="relative">/,
            '<main className="relative">\n        <RetroGridBackground />'
        );
        fs.writeFileSync(pagePath, content);
        console.log('Added RetroGridBackground to page.js');
    }
}
