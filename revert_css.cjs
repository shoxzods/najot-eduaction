const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
    { regex: /var\(--bg-primary\)/g, replacement: '#ffffff' },
    { regex: /var\(--bg-secondary\)/g, replacement: '#f8fafc' },
    { regex: /var\(--bg-tertiary\)/g, replacement: '#f4f6f9' },
    { regex: /var\(--text-primary\)/g, replacement: '#0f172a' },
    { regex: /var\(--text-secondary\)/g, replacement: '#475569' },
    { regex: /var\(--text-tertiary\)/g, replacement: '#64748b' },
    { regex: /var\(--border-color\)/g, replacement: '#f1f5f9' },
    { regex: /var\(--accent-primary\)/g, replacement: '#6c35de' },
    { regex: /var\(--accent-hover\)/g, replacement: '#5a2cc0' },
    { regex: /var\(--border-color-soft\)/g, replacement: 'rgba(241, 245, 249, 0.6)' },
    { regex: /var\(--shadow-color\)/g, replacement: 'rgba(0, 0, 0, 0.04)' },
    { regex: /var\(--glass-bg\)/g, replacement: 'rgba(255, 255, 255, 0.98)' }
];

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.scss')) {
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
                console.log(`Reverted: ${fullPath}`);
            }
        }
    }
}

walkDir(srcDir);
console.log('Done reverting SCSS files.');
