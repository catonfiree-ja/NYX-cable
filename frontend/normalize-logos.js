// Normalize v4: TRIM whitespace only, keep original aspect ratio
// CSS will handle display with fixed box + object-fit: contain
// This ensures consistent visual sizing regardless of source dimensions

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('public/client-logos-original');
const outDir = path.resolve('public/client-logos');

async function main() {
  const files = fs.readdirSync(srcDir)
    .filter(f => /^logo-\d+/i.test(f))
    .sort();

  console.log(`Processing ${files.length} logos — trim whitespace only\n`);

  // Clean output
  const existing = fs.readdirSync(outDir).filter(f => /^logo-\d+/i.test(f));
  existing.forEach(f => fs.unlinkSync(path.join(outDir, f)));

  for (const file of files) {
    const num = file.match(/\d+/)[0];
    const outName = `logo-${num.padStart(2, '0')}.png`;
    const srcPath = path.join(srcDir, file);

    try {
      const origMeta = await sharp(srcPath).metadata();
      
      // Trim whitespace: flatten to white bg, trim near-white pixels
      let trimmed;
      try {
        trimmed = await sharp(srcPath)
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .trim({ threshold: 15 })
          .toBuffer({ resolveWithObject: true });
      } catch (e) {
        // If trim fails, use original
        trimmed = await sharp(srcPath)
          .toBuffer({ resolveWithObject: true });
      }

      const tW = trimmed.info.width;
      const tH = trimmed.info.height;

      // Now re-read original and extract only the trimmed region
      // Since we can't get trim offsets easily, just trim the original directly
      let output;
      try {
        output = await sharp(srcPath)
          .trim({ threshold: 15 })
          .png()
          .toBuffer({ resolveWithObject: true });
      } catch (e) {
        output = await sharp(srcPath)
          .png()
          .toBuffer({ resolveWithObject: true });
      }

      fs.writeFileSync(path.join(outDir, outName), output.data);

      const oW = output.info.width;
      const oH = output.info.height;
      const ratio = (oW / oH).toFixed(1);
      
      console.log(`✓ #${num.padStart(2,'0')} orig=${origMeta.width}x${origMeta.height} → trimmed=${oW}x${oH} r=${ratio}`);

    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`);
    }
  }

  console.log('\nDone! CSS will handle sizing with object-fit: contain in fixed box.');
}

main();
