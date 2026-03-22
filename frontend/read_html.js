const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/ปิ๊ก/.gemini/antigravity/scratch/nyxcable-website';
const files = fs.readdirSync(dir);

let htmlFile = null;
for (const f of files) {
  if (f.endsWith('.htm')) htmlFile = f;
}

if (htmlFile) {
  const content = fs.readFileSync(path.join(dir, htmlFile), 'utf-8');
  // Strip messy tags if needed, or just save as txt
  const clean = content.replace(/<style[^>]*>[\s\S]*?<\/style>/ig, '')
                       .replace(/<script[^>]*>[\s\S]*?<\/script>/ig, '')
                       .replace(/<[^>]+>/g, '\n');
  const lines = clean.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  fs.writeFileSync(path.join(dir, 'client_brief.txt'), lines.join('\n'));
  console.log('Successfully saved to client_brief.txt');
} else {
  console.log('No HTM file found');
}
