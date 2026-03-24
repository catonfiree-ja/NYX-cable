const fs = require('fs');
const iconv = require('iconv-lite');

const buf = fs.readFileSync('C:\\Users\\ปิ๊ก\\.gemini\\antigravity\\scratch\\nyxcable-website\\feedback 2.htm');
const text = iconv.decode(buf, 'windows-874');

const clean = text
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&middot;/g, '·')
    .replace(/&quot;/g, '"')
    .replace(/&#8594;/g, '→')
    .replace(/&#61623;/g, '•')
    .replace(/&amp;/g, '&')
    .replace(/\n[ \t]*\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();

fs.writeFileSync('C:\\tmp\\feedback-decoded.txt', clean, 'utf-8');
console.log(clean);
