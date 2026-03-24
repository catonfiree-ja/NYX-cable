// FINAL v2: COVER logos get 4px breathing room too
// - Square/tall (r < 1.5): COVER to 152×64 → on 160×72 canvas (4px padding)
// - Already-wide (r 1.5-3.0): INSIDE to 152×64 → same padding
// - Ultra-wide (r > 3.0): INSIDE to 148×60

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const origDir = path.resolve('public/client-logos-original');
const outDir = path.resolve('public/client-logos');

async function main() {
  const files = fs.readdirSync(origDir).filter(f => /^logo-\d+/.test(f)).sort();
  const W = 160, H = 72;
  const PAD = 4;
  const IW = W - PAD * 2; // 152
  const IH = H - PAD * 2; // 64

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
        // Square/tall: COVER to fill inner area (152×64), then center on canvas
        strategy = 'COVER+pad';
        const covered = await sharp(srcPath)
          .resize(IW, IH, { fit: 'cover', position: 'centre' })
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .png().toBuffer();
        
        await sharp({ create: { width: W, height: H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
          .composite([{ input: covered, left: PAD, top: PAD }])
          .png().toFile(outPath);

      } else if (r <= 3.0) {
        // Wide: INSIDE to fit in inner area
        strategy = 'INSIDE+pad';
        const resized = await sharp(srcPath)
          .resize(IW, IH, { fit: 'inside', withoutEnlargement: false })
          .png().toBuffer();
        const rm = await sharp(resized).metadata();
        const left = Math.round((W - rm.width) / 2);
        const top = Math.round((H - rm.height) / 2);
        await sharp({ create: { width: W, height: H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
          .composite([{ input: resized, left, top }])
          .png().toFile(outPath);

      } else {
        // Ultra-wide
        strategy = 'INSIDE-uw';
        const resized = await sharp(srcPath)
          .resize(W - 12, H - 12, { fit: 'inside', withoutEnlargement: false })
          .png().toBuffer();
        const rm = await sharp(resized).metadata();
        const left = Math.round((W - rm.width) / 2);
        const top = Math.round((H - rm.height) / 2);
        await sharp({ create: { width: W, height: H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
          .composite([{ input: resized, left, top }])
          .png().toFile(outPath);
      }

      console.log(`#${n}: r=${r.toFixed(2)} → ${strategy} ✓`);
      count++;
    } catch (err) {
      console.error(`#${n}: FAILED - ${err.message}`);
    }
  }
  console.log(`\nDone! ${count} logos all 160×72px with 4px padding.`);
}

main().catch(console.error);
