// FINAL: narrower 100×72 box → square logos fill 72% instead of 45%
// ALL logos use INSIDE to fit within 100×72, no crop

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
      const r = meta.width / meta.height;

      const resized = await sharp(srcPath)
        .resize(W, H, { fit: 'inside', withoutEnlargement: false })
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .png()
        .toBuffer();
      
      const rm = await sharp(resized).metadata();
      const left = Math.round((W - rm.width) / 2);
      const top = Math.round((H - rm.height) / 2);
      
      await sharp({
        create: { width: W, height: H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } }
      })
        .composite([{ input: resized, left, top }])
        .png()
        .toFile(outPath);

      const fillPct = Math.round((rm.width * rm.height) / (W * H) * 100);
      console.log(`#${n}: ${meta.width}x${meta.height} r=${r.toFixed(2)} → ${rm.width}x${rm.height} fill=${fillPct}% ✓`);
      count++;
    } catch (err) {
      console.error(`#${n}: FAILED - ${err.message}`);
    }
  }
  console.log(`\nDone! ${count} logos — all 100×72px, no crop.`);
}

main().catch(console.error);
