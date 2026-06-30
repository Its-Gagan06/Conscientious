const fs = require('fs');

let content = fs.readFileSync('server.js', 'utf8');

const citiesRegex = /app\.post\("\/api\/cities", async \(req, res\) => \{[\s\S]*?\}\);\n/m;
content = content.replace(citiesRegex, '');

fs.writeFileSync('server.js', content);
console.log('Removed /api/cities from server.js');
