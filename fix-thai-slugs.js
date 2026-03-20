/**
 * Fix Thai slugs in products.ndjson
 * สายคอนโทรล → control-cable
 * สายมัลติคอร์ → multicore-cable
 */
const fs = require('fs');
const path = require('path');

const SLUG_MAP = {
  'สายคอนโทรล': 'control-cable',
  'สายมัลติคอร์': 'multicore-cable',
};

const filePath = path.join(__dirname, 'migration', 'products.ndjson');
const lines = fs.readFileSync(filePath, 'utf8').split('\n').filter(l => l.trim());

let fixedCount = 0;
const fixedLines = lines.map(line => {
  const doc = JSON.parse(line);
  if (doc.slug && SLUG_MAP[doc.slug.current]) {
    const oldSlug = doc.slug.current;
    doc.slug.current = SLUG_MAP[oldSlug];
    console.log(`Fixed: ${oldSlug} → ${doc.slug.current} (${doc.title})`);
    fixedCount++;
  }
  return JSON.stringify(doc);
});

fs.writeFileSync(filePath, fixedLines.join('\n') + '\n', 'utf8');
console.log(`\nDone! Fixed ${fixedCount} slugs.`);
