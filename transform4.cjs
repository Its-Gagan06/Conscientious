const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// Ensure inputs have explicit text color
content = content.replace(/outline-none transition-all/g, 'text-gray-900 dark:text-gray-100 outline-none transition-all');
content = content.replace(/outline-none text-sm transition-all/g, 'text-gray-900 dark:text-gray-100 outline-none text-sm transition-all');

fs.writeFileSync('src/App.jsx', content);
console.log('Fixed input text colors');
