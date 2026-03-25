// Smart normalize v2: trim whitespace + scale each logo to visually fill 
// a consistent area within the 160x72 canvas
// Strategy: instead of uniform contain, use the SMALLER dimension to scale up
// so thin/wide logos get scaled to fill height, and tall/narrow logos fill width

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const CANVAS_W = 160;
const CANVAS_H = 72;
const CANVAS_RATIO = CANVAS_W / CANVAS_H; // 2.22

const srcDir = path.resolve('public/client-logos-original');
const outDir = path.resolve('public/client-logos');

async function main() {
  const files = fs.readdirSync(srcDir)
    .filter(f => /^logo-\d+/i.test(f))
    .sort();

  console.log(`Processing ${files.length} logos with smart scaling v2...\n`);

  // Clean output directory
  const existing = fs.readdirSync(outDir).filter(f => /^logo-\d+/i.test(f));
  existing.forEach(f => fs.unlinkSync(path.join(outDir, f)));

  for (const file of files) {
    const num = file.match(/\d+/)[0];
    const outName = `logo-${num.padStart(2, '0')}.png`;
    const srcPath = path.join(srcDir, file);

    try {
      // Step 1: Read original and get metadata
      const origMeta = await sharp(srcPath).metadata();
      const origW = origMeta.width;
      const origH = origMeta.height;
      const origRatio = origW / origH;
      
      // Step 2: Calculate "contain" fit dimensions with standard padding
      const PAD = 4;
      const maxW = CANVAS_W - PAD * 2; // 152
      const maxH = CANVAS_H - PAD * 2; // 64
      
      let containW, containH;
      if (origRatio > maxW / maxH) {
        containW = maxW;
        containH = Math.round(maxW / origRatio);
      } else {
        containH = maxH;
        containW = Math.round(maxH * origRatio);
      }
      
      const fillPercent = (containW * containH) / (maxW * maxH) * 100;
      
      // Step 3: If the logo fills less than 50% of the canvas area,
      // boost it by scaling based on the SMALLER fitted dimension
      let finalW = containW;
      let finalH = containH;
      let strategy = 'contain';
      
      if (fillPercent < 50) {
        // Calculate boost factor to reach ~55-60% fill
        const targetFill = 0.58;
        const currentFill = (containW * containH) / (maxW * maxH);
        // boost = sqrt(target/current) to scale both dimensions proportionally
        const boost = Math.sqrt(targetFill / currentFill);
        
        finalW = Math.min(Math.round(containW * boost), maxW);
        finalH = Math.min(Math.round(containH * boost), maxH);
        strategy = `BOOST x${boost.toFixed(2)}`;
      }
      
      // Step 4: Resize the original logo
      const resized = await sharp(srcPath)
        .resize(finalW, finalH, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();

      // Step 5: Composite onto transparent canvas
      await sharp({
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

      const newFill = (finalW * finalH) / (maxW * maxH) * 100;
      console.log(`${strategy === 'contain' ? '✓' : '⚡'} #${num.padStart(2,'0')} (${origW}x${origH} r=${origRatio.toFixed(1)}) fill=${fillPercent.toFixed(0)}%→${newFill.toFixed(0)}% [${strategy}]`);

    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`);
    }
  }

  console.log('\nDone!');
}

main();
