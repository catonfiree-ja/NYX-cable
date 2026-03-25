// Normalize v3: trim whitespace + fixed height, auto width
// Each logo gets same visual height, width varies naturally
// This ensures square logos look as big as wide logos

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const TARGET_H = 60; // normalised height (displayed at ~48px via CSS)
const MAX_W = 240;   // cap extremely wide logos

const srcDir = path.resolve('public/client-logos-original');
const outDir = path.resolve('public/client-logos');

async function main() {
  const files = fs.readdirSync(srcDir)
    .filter(f => /^logo-\d+/i.test(f))
    .sort();

  console.log(`Processing ${files.length} logos — fixed height ${TARGET_H}px, auto width (max ${MAX_W}px)\n`);

  // Clean output
  const existing = fs.readdirSync(outDir).filter(f => /^logo-\d+/i.test(f));
  existing.forEach(f => fs.unlinkSync(path.join(outDir, f)));

  for (const file of files) {
    const num = file.match(/\d+/)[0];
    const outName = `logo-${num.padStart(2, '0')}.png`;
    const srcPath = path.join(srcDir, file);

    try {
      const origMeta = await sharp(srcPath).metadata();

      // Step 1: Trim whitespace by flattening to white bg + trim
      let trimInfo;
      try {
        const trimResult = await sharp(srcPath)
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .trim({ threshold: 20 })
          .toBuffer({ resolveWithObject: true });
        trimInfo = { w: trimResult.info.width, h: trimResult.info.height };
      } catch (e) {
        // trim can fail on some images, use original dimensions
        trimInfo = { w: origMeta.width, h: origMeta.height };
      }

      const ratio = trimInfo.w / trimInfo.h;

      // Step 2: Calculate target dimensions
      // Primary: fix height to TARGET_H, calculate width from ratio
      let targetW = Math.round(TARGET_H * ratio);
      let targetH = TARGET_H;

      // Cap extremely wide logos
      if (targetW > MAX_W) {
        targetW = MAX_W;
        targetH = Math.round(MAX_W / ratio);
      }

      // Step 3: Resize original (not trimmed — keep original content) 
      // with contain to avoid distortion
      await sharp(srcPath)
        .resize(targetW, targetH, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toFile(path.join(outDir, outName));

      console.log(`✓ #${num.padStart(2,'0')} (${origMeta.width}x${origMeta.height}) trim=${trimInfo.w}x${trimInfo.h} r=${ratio.toFixed(1)} → ${targetW}x${targetH}`);

    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`);
    }
  }

  console.log('\nDone!');
}

main();
