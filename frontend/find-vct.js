const fs = require('fs');
const content = fs.readFileSync('data/product-content.tsx', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);

// Find VCT references
lines.forEach((line, i) => {
  if (line.toLowerCase().includes('vct')) {
    console.log(`Line ${i + 1}: ${line.trim().substring(0, 120)}`);
  }
});

// Find all keys in productContentMap
const keyRegex = /^\s*'([^']+)':\s*\{/;
lines.forEach((line, i) => {
  const match = line.match(keyRegex);
  if (match) {
    console.log(`Key at line ${i + 1}: '${match[1]}'`);
  }
});
