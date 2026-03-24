// Restore original images back to client-logos folder
// The CSS will handle sizing with fixed height, auto width

const fs = require('fs');
const path = require('path');

const origDir = path.resolve('public/client-logos-original');
const outDir = path.resolve('public/client-logos');

const files = fs.readdirSync(origDir).filter(f => /^logo-\d+/.test(f)).sort();

// First clean out all current PNGs in outDir
const currentFiles = fs.readdirSync(outDir).filter(f => /^logo-\d+/.test(f));
currentFiles.forEach(f => fs.unlinkSync(path.join(outDir, f)));

// Copy originals back
files.forEach(f => {
  fs.copyFileSync(path.join(origDir, f), path.join(outDir, f));
});

console.log(`Restored ${files.length} original logos.`);

// List them with extensions
files.forEach(f => {
  const n = parseInt(f.match(/\d+/)[0]);
  const ext = path.extname(f);
  console.log(`#${n}: ${ext}`);
});
