const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// Fix bottom nav hover
content = content.replace(/hover:text-gray-900 dark:text-gray-100/g, 'hover:text-gray-900 dark:hover:text-gray-100');

// Fix Take Photo or Upload hover bg
content = content.replace(/hover:bg-blue-50 rounded-xl/g, 'hover:bg-blue-50 dark:hover:bg-gray-800 rounded-xl');

// Fix any remaining hover:bg-gray-200 or hover:bg-blue-50
content = content.replace(/hover:bg-gray-200 text-gray-700 dark:text-gray-300/g, 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300');
content = content.replace(/hover:text-gray-600 dark:text-gray-400/g, 'hover:text-gray-600 dark:hover:text-gray-200');
content = content.replace(/text-gray-500 dark:text-gray-400 hover:text-blue-600/g, 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400');

fs.writeFileSync('src/App.jsx', content);
console.log('Fixed hover styles');
