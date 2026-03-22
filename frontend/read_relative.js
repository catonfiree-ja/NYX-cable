const fs = require('fs');
try {
  const content = fs.readFileSync('../ปรับเวป 0.htm', 'utf8');
  let clean = content.replace(/<style[^>]*>[\s\S]*?<\/style>/ig, '');
  clean = clean.replace(/<[^>]+>/g, '\n');
  const lines = clean.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  fs.writeFileSync('client_instructions.txt', lines.join('\n'));
  console.log('Written to client_instructions.txt');
} catch (e) {
  console.log('Error', e);
}
