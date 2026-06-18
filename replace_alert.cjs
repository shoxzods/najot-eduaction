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

const files = walk('./src').filter(f => f.endsWith('.tsx'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.match(/alert\(/)) {
        // Add import statement if not already there
        if (!content.includes('import { toast }')) {
            // Find the last import
            const lastImportIndex = content.lastIndexOf('import ');
            if (lastImportIndex !== -1) {
                const endOfLastImport = content.indexOf('\n', lastImportIndex);
                
                // Need to compute relative path to src/utils/toast
                const dir = path.dirname(file);
                let rel = path.relative(dir, './src/utils/toast').replace(/\\/g, '/');
                if (!rel.startsWith('.')) rel = './' + rel;
                
                content = content.substring(0, endOfLastImport + 1) + 
                          `import { toast } from '${rel}';\n` + 
                          content.substring(endOfLastImport + 1);
            }
        }
        
        // Replace alert("...") with toast.error("...")
        content = content.replace(/alert\(/g, 'toast.error(');
        fs.writeFileSync(file, content, 'utf8');
        console.log('Replaced alert in', file);
    }
});
