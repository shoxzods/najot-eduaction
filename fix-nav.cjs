const fs = require('fs');
let content = fs.readFileSync('src/views/Groups/GroupDetail/UygaVazifa.tsx', 'utf-8');

const replacement = `                            if (hwId) router.push(\`\${basePath}/\${id}/homework/\${hwId}/results?lessonId=\${lesson.id}\`);`;

content = content.replace(/                            if \(hwId\) router\.push\(`\$\{basePath\}\/\$\{id\}\/homework\/\$\{hwId\}\/results`\);/g, replacement);

fs.writeFileSync('src/views/Groups/GroupDetail/UygaVazifa.tsx', content);
