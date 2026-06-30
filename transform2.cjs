const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

const replacements = {
  'focus:bg-white dark:bg-gray-800': 'focus:bg-white dark:focus:bg-gray-800',
  'hover:bg-blue-50"': 'hover:bg-blue-50 dark:hover:bg-gray-800"',
  'hover:bg-gray-200 text-gray-800 dark:text-gray-200': 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200',
  'hover:bg-gray-200 text-gray-700 dark:text-gray-300': 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300',
  'hover:bg-red-100 text-red-600': 'hover:bg-red-100 dark:hover:bg-red-900/40 dark:bg-red-900/20 text-red-600 dark:text-red-400'
};

for (const [key, val] of Object.entries(replacements)) {
  content = content.split(key).join(val);
}

fs.writeFileSync('src/App.jsx', content);
console.log('Done transforming App.jsx with hover and focus dark classes');
