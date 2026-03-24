// FINAL crop: tiered approach per aspect ratio
// - Square/tall (r < 1.5): COVER — zoom to fill (they were too small before)
// - Already-wide (r 1.5-3.0): INSIDE with 4px padding (they fit fine, don't over-zoom)
// - Ultra-wide (r > 3.0): INSIDE with more padding

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const origDir = path.resolve('public/client-logos-original');
const outDir = path.resolve('public/client-logos');

async function main() {
  const files = fs.readdirSync(origDir).filter(f => /^logo-\d+/.test(f)).sort();
  const W = 160, H = 72;

  let count = 0;
  for (const f of files) {
    const n = parseInt(f.match(/\d+/)[0]);
    const srcPath = path.join(origDir, f);
    const outPath = path.join(outDir, `logo-${String(n).padStart(2, '0')}.png`);

    try {
      const meta = await sharp(srcPath).metadata();
      const r = meta.width / meta.height;
      let strategy;

      if (r < 1.5) {
        // Square/tall logos: COVER to fill entire frame
        strategy = 'COVER';
        await sharp(srcPath)
          .resize(W, H, { fit: 'cover', position: 'centre' })
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .png().toFile(outPath);

      } else if (r <= 3.0) {
        // Already-wide logos: INSIDE with 4px padding (don't over-zoom)
        strategy = 'INSIDE-4px';
        const innerW = W - 8, innerH = H - 8; // 152×64
        const resized = await sharp(srcPath)
          .resize(innerW, innerH, { fit: 'inside', withoutEnlargement: false })
          .png().toBuffer();
        const rm = await sharp(resized).metadata();
        const left = Math.round((W - rm.width) / 2);
        const top = Math.round((H - rm.height) / 2);
        await sharp({ create: { width: W, height: H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
          .composite([{ input: resized, left, top }])
          .png().toFile(outPath);

      } else {
        // Ultra-wide: INSIDE with wider padding
        strategy = 'INSIDE-wide';
        const innerW = W - 12, innerH = H - 12; // 148×60
        const resized = await sharp(srcPath)
          .resize(innerW, innerH, { fit: 'inside', withoutEnlargement: false })
          .png().toBuffer();
        const rm = await sharp(resized).metadata();
        const left = Math.round((W - rm.width) / 2);
        const top = Math.round((H - rm.height) / 2);
        await sharp({ create: { width: W, height: H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
          .composite([{ input: resized, left, top }])
          .png().toFile(outPath);
      }

      console.log(`#${n}: ${meta.width}x${meta.height} r=${r.toFixed(2)} → ${strategy} ✓`);
      count++;
    } catch (err) {
      console.error(`#${n}: FAILED - ${err.message}`);
    }
  }

  console.log(`\nDone! ${count} logos all 160×72px.`);
}

main().catch(console.error);
