// Re-crop all 66 logos: FILL the entire 160×72 frame
// Uses sharp fit:'cover' — zoom to fill, center-crop excess
// Result: every logo file IS exactly 160×72px, no CSS tricks needed

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const origDir = path.resolve('public/client-logos-original');
const outDir = path.resolve('public/client-logos');

async function main() {
  const files = fs.readdirSync(origDir).filter(f => /^logo-\d+/.test(f)).sort();
  
  let count = 0;
  for (const f of files) {
    const n = parseInt(f.match(/\d+/)[0]);
    const srcPath = path.join(origDir, f);
    const outPath = path.join(outDir, `logo-${String(n).padStart(2, '0')}.png`);
    
    try {
      const meta = await sharp(srcPath).metadata();
      const ratio = meta.width / meta.height;
      
      // For very wide logos (ratio > 3.0), use 'inside' to avoid heavy side-crop
      // For everything else, use 'cover' to fill the frame
      const fitMode = ratio > 3.0 ? 'inside' : 'cover';
      
      if (fitMode === 'inside') {
        // Wide logos: resize to fit inside, then composite on white canvas
        const resized = await sharp(srcPath)
          .resize(160, 72, { fit: 'inside', withoutEnlargement: false })
          .png()
          .toBuffer();
        
        const resizedMeta = await sharp(resized).metadata();
        const left = Math.round((160 - resizedMeta.width) / 2);
        const top = Math.round((72 - resizedMeta.height) / 2);
        
        await sharp({
          create: { width: 160, height: 72, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } }
        })
          .composite([{ input: resized, left, top }])
          .png()
          .toFile(outPath);
        
        console.log(`#${n}: ${meta.width}x${meta.height} r=${ratio.toFixed(1)} → INSIDE (ultra-wide) → ${resizedMeta.width}x${resizedMeta.height} on 160x72 ✓`);
      } else {
        // Normal & square logos: COVER — zoom to fill, center-crop
        await sharp(srcPath)
          .resize(160, 72, { fit: 'cover', position: 'centre' })
          .flatten({ background: { r: 255, g: 255, b: 255 } }) // white bg for transparency
          .png()
          .toFile(outPath);
        
        console.log(`#${n}: ${meta.width}x${meta.height} r=${ratio.toFixed(1)} → COVER (fill+crop) → 160x72 ✓`);
      }
      
      count++;
    } catch (err) {
      console.error(`#${n}: FAILED - ${err.message}`);
    }
  }
  
  console.log(`\nDone! ${count} logos — all exactly 160×72px.`);
}

main().catch(console.error);
