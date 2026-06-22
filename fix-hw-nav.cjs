const fs = require('fs');
let content = fs.readFileSync('src/views/Groups/HomeworkResults/HomeworkResults.tsx', 'utf-8');

const replacement = `                  router.push(\`\${basePath}/\${id}/homework/\${homeworkId}/results/\${student.id || student.student?.id || idx}?tab=\${activeTab}&date=\${dateToPass}&lessonId=\${homeworkDetails?.id || searchParams?.get("lessonId") || ""}\`);`;

content = content.replace(/                  router\.push\(`\$\{basePath\}\/\$\{id\}\/homework\/\$\{homeworkId\}\/results\/\$\{student\.id \|\| student\.student\?\.id \|\| idx\}\?tab=\$\{activeTab\}&date=\$\{dateToPass\}`\);/g, replacement);

fs.writeFileSync('src/views/Groups/HomeworkResults/HomeworkResults.tsx', content);
