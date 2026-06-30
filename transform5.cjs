const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

content = content.replace(/outline-none transition-all resize-none h-28/g, 'text-gray-900 dark:text-gray-100 outline-none transition-all resize-none h-28');

// For the comments textarea
content = content.replace(/className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-colors"/g, 'className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-colors"');

fs.writeFileSync('src/App.jsx', content);
console.log('Fixed textarea text colors');
