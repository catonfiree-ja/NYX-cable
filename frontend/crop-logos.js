// Back to 100×72 — ALL INSIDE, no crop
// This is the version where wide logos were confirmed "OK"

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const origDir = path.resolve('public/client-logos-original');
const outDir = path.resolve('public/client-logos');

async function main() {
  const files = fs.readdirSync(origDir).filter(f => /^logo-\d+/.test(f)).sort();
  const W = 100, H = 72;

  let count = 0;
  for (const f of files) {
    const n = parseInt(f.match(/\d+/)[0]);
    const srcPath = path.join(origDir, f);
    const outPath = path.join(outDir, `logo-${String(n).padStart(2, '0')}.png`);

    try {
      const meta = await sharp(srcPath).metadata();
      
      // ALL inside — no crop at all
      const resized = await sharp(srcPath)
        .resize(W - 8, H - 8, { fit: 'inside', withoutEnlargement: false })
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .png().toBuffer();
      
      const rm = await sharp(resized).metadata();
      const left = Math.round((W - rm.width) / 2);
      const top = Math.round((H - rm.height) / 2);
      
      await sharp({
        create: { width: W, height: H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } }
      })
        .composite([{ input: resized, left, top }])
        .png().toFile(outPath);

      console.log(`#${n}: r=${(meta.width/meta.height).toFixed(2)} → ${rm.width}x${rm.height} ✓`);
      count++;
    } catch (err) {
      console.error(`#${n}: FAILED - ${err.message}`);
    }
  }
  console.log(`\nDone! ${count} logos — all 100×72px, INSIDE, NO crop.`);
}

main().catch(console.error);
