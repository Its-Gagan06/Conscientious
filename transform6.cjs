const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');
content = content.replace(/text-blue-600 font-medium hover:underline/g, 'text-blue-600 dark:text-blue-400 font-medium hover:underline');
fs.writeFileSync('src/App.jsx', content);
