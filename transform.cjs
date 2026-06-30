const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

const replacements = {
  'bg-white': 'bg-white dark:bg-gray-800',
  'text-gray-900': 'text-gray-900 dark:text-gray-100',
  'text-gray-800': 'text-gray-800 dark:text-gray-200',
  'text-gray-700': 'text-gray-700 dark:text-gray-300',
  'text-gray-600': 'text-gray-600 dark:text-gray-400',
  'text-gray-500': 'text-gray-500 dark:text-gray-400',
  'border-gray-100': 'border-gray-100 dark:border-gray-700',
  'border-gray-200': 'border-gray-200 dark:border-gray-700',
  'border-gray-300': 'border-gray-300 dark:border-gray-600',
  'bg-gray-50': 'bg-gray-50 dark:bg-gray-900',
  'bg-gray-100': 'bg-gray-100 dark:bg-gray-700'
};

for (const [key, val] of Object.entries(replacements)) {
  // Replace only full words in className attributes
  // Actually, simple regex to replace key with val
  // To avoid double replacement if script is run twice, we can check if it already has dark:
  const regex = new RegExp(`(?<!dark:)\\b${key}\\b`, 'g');
  content = content.replace(regex, val);
}

fs.writeFileSync('src/App.jsx', content);
console.log('Done transforming App.jsx');
