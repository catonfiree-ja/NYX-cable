// FINAL: 100×72 box hybrid
// - Square/tall (r < 1.39): COVER — mild crop (only 14px for 1:1)
// - Wide (r >= 1.39): INSIDE — already fills well

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const origDir = path.resolve('public/client-logos-original');
const outDir = path.resolve('public/client-logos');

async function main() {
  const files = fs.readdirSync(origDir).filter(f => /^logo-\d+/.test(f)).sort();
  const W = 100, H = 72;
  const boxRatio = W / H; // 1.39

  let count = 0;
  for (const f of files) {
    const n = parseInt(f.match(/\d+/)[0]);
    const srcPath = path.join(origDir, f);
    const outPath = path.join(outDir, `logo-${String(n).padStart(2, '0')}.png`);

    try {
      const meta = await sharp(srcPath).metadata();
      const r = meta.width / meta.height;
      let strategy;

      if (r < boxRatio) {
        // Square/tall: COVER to fill box (mild crop with 100×72)
        strategy = 'COVER';
        await sharp(srcPath)
          .resize(W, H, { fit: 'cover', position: 'centre' })
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .png().toFile(outPath);
      } else {
        // Wide: INSIDE — already matches or exceeds box ratio
        strategy = 'INSIDE';
        const resized = await sharp(srcPath)
          .resize(W, H, { fit: 'inside', withoutEnlargement: false })
          .flatten({ background: { r: 255, g: 255, b: 255 } })
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
  console.log(`\nDone! ${count} logos — all 100×72px.`);
}

main().catch(console.error);
