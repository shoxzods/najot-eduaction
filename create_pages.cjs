const fs = require('fs');
const path = require('path');

const pages = [
  { path: 'payments', title: 'To\'lovlarim' },
  { path: 'groups', title: 'Guruhlarim' },
  { path: 'stats', title: 'Ko\'rsatkichlarim' },
  { path: 'rating', title: 'Reyting' },
  { path: 'shop', title: 'Do\'kon' },
  { path: 'extra', title: 'Qo\'shimcha darslar' },
  { path: 'settings', title: 'Sozlamalar' }
];

const basePath = path.join(__dirname, 'src', 'app', '(dashboard)', 'student');

if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath, { recursive: true });
}

pages.forEach(p => {
  const dirPath = path.join(basePath, p.path);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const content = `export default function Page() {
  return (
    <div style={{ padding: '24px' }}>
      <h1>${p.title}</h1>
      <p>Bu sahifa hozircha ishlab chiqilmoqda...</p>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
});

console.log('Fake pages created successfully!');
