// Normalize all client logos to uniform 160x72 canvas
// Source: public/client-logos-original/
// Output: public/client-logos/ (all PNG, transparent bg)

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const CANVAS_W = 160;
const CANVAS_H = 72;
const PADDING = 6; // internal padding on each side

const srcDir = path.resolve('public/client-logos-original');
const outDir = path.resolve('public/client-logos');

async function main() {
  const files = fs.readdirSync(srcDir)
    .filter(f => /^logo-\d+/i.test(f))
    .sort();

  console.log(`Processing ${files.length} logos...`);
  console.log(`Canvas: ${CANVAS_W}x${CANVAS_H}, Padding: ${PADDING}px\n`);

  // Clean output directory
  const existing = fs.readdirSync(outDir).filter(f => /^logo-\d+/i.test(f));
  existing.forEach(f => fs.unlinkSync(path.join(outDir, f)));
  console.log(`Cleaned ${existing.length} existing files.\n`);

  const innerW = CANVAS_W - PADDING * 2;
  const innerH = CANVAS_H - PADDING * 2;

  for (const file of files) {
    const num = file.match(/\d+/)[0];
    const outName = `logo-${num.padStart(2, '0')}.png`;
    const srcPath = path.join(srcDir, file);

    try {
      // Read and get metadata
      const img = sharp(srcPath);
      const meta = await img.metadata();

      // Resize logo to fit within inner area (contain)
      const resized = await sharp(srcPath)
        .resize(innerW, innerH, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();

      // Composite onto transparent canvas for uniform dimensions
      const output = await sharp({
        create: {
          width: CANVAS_W,
          height: CANVAS_H,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite([{ input: resized, gravity: 'centre' }])
        .png()
        .toFile(path.join(outDir, outName));

      console.log(`✓ ${file} (${meta.width}x${meta.height}) → ${outName} (${CANVAS_W}x${CANVAS_H})`);
    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`);
    }
  }

  console.log('\nDone! All logos normalized.');
}

main();
