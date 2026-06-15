const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
    { regex: /#ffffff/gi, replacement: 'var(--bg-primary)' },
    { regex: /#f8fafc/gi, replacement: 'var(--bg-secondary)' },
    { regex: /#f4f6f9/gi, replacement: 'var(--bg-tertiary)' },
    { regex: /#0f172a/gi, replacement: 'var(--text-primary)' },
    { regex: /#475569/gi, replacement: 'var(--text-secondary)' },
    { regex: /#64748b/gi, replacement: 'var(--text-tertiary)' },
    { regex: /#f1f5f9/gi, replacement: 'var(--border-color)' },
    { regex: /#6c35de/gi, replacement: 'var(--accent-primary)' },
    { regex: /#5a2cc0/gi, replacement: 'var(--accent-hover)' },
    { regex: /rgba\(241,\s*245,\s*249,\s*0\.6\)/gi, replacement: 'var(--border-color-soft)' },
    { regex: /rgba\(0,\s*0,\s*0,\s*0\.04\)/gi, replacement: 'var(--shadow-color)' },
    { regex: /rgba\(255,\s*255,\s*255,\s*0\.98\)/gi, replacement: 'var(--glass-bg)' }
];

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.scss')) {
            // skip _base.scss
            if (file === '_base.scss') continue;
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            for (const { regex, replacement } of replacements) {
                if (regex.test(content)) {
                    content = content.replace(regex, replacement);
                    modified = true;
                }
            }
            
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

walkDir(srcDir);
console.log('Done refactoring SCSS files.');
