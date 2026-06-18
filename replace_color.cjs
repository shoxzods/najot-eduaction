const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src').filter(f => f.endsWith('.tsx') || f.endsWith('.scss'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace hover purple with darker rgb(22, 34, 69)
    content = content.replace(/#5a2cc0/gi, 'rgb(22, 34, 69)');
    
    // Replace light purple with the main color
    content = content.replace(/#7c4dff/gi, 'rgb(29, 45, 91)');

    // Replace the rgba shadow colors (108, 53, 222) with (29, 45, 91)
    content = content.replace(/108,\s*53,\s*222/g, '29, 45, 91');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Replaced purples in', file);
    }
});
