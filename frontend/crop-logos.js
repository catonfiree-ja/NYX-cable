// COVER logos: cover to 92×64 (4px padding), center on 100×72 canvas
// INSIDE logos: fit inside 92×64, center on 100×72 canvas
// All logos have 4px breathing room from edges

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const origDir = path.resolve('public/client-logos-original');
const outDir = path.resolve('public/client-logos');

async function main() {
  const files = fs.readdirSync(origDir).filter(f => /^logo-\d+/.test(f)).sort();
  const W = 100, H = 72;
  const PAD = 4;
  const IW = W - PAD * 2; // 92
  const IH = H - PAD * 2; // 64
  const boxRatio = IW / IH; // 1.44

  let count = 0;
  for (const f of files) {
    const n = parseInt(f.match(/\d+/)[0]);
    const srcPath = path.join(origDir, f);
    const outPath = path.join(outDir, `logo-${String(n).padStart(2, '0')}.png`);

    try {
      const meta = await sharp(srcPath).metadata();
      const r = meta.width / meta.height;
      let strategy, innerW, innerH;

      if (r < boxRatio) {
        // Square/tall: COVER to fill 92×64, center on canvas
        strategy = 'COVER+pad';
        const covered = await sharp(srcPath)
          .resize(IW, IH, { fit: 'cover', position: 'centre' })
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .png().toBuffer();
        
        await sharp({ create: { width: W, height: H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
          .composite([{ input: covered, left: PAD, top: PAD }])
          .png().toFile(outPath);
        innerW = IW; innerH = IH;
      } else {
        // Wide: INSIDE to fit 92×64, center on canvas
        strategy = 'INSIDE+pad';
        const resized = await sharp(srcPath)
          .resize(IW, IH, { fit: 'inside', withoutEnlargement: false })
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .png().toBuffer();
        const rm = await sharp(resized).metadata();
        innerW = rm.width; innerH = rm.height;
        const left = Math.round((W - rm.width) / 2);
        const top = Math.round((H - rm.height) / 2);
        await sharp({ create: { width: W, height: H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
          .composite([{ input: resized, left, top }])
          .png().toFile(outPath);
      }

      console.log(`#${n}: r=${r.toFixed(2)} → ${strategy} (${innerW}x${innerH}) ✓`);
      count++;
    } catch (err) {
      console.error(`#${n}: FAILED - ${err.message}`);
    }
  }
  console.log(`\nDone! ${count} logos — all 100×72px with 4px padding from edges.`);
}

main().catch(console.error);
