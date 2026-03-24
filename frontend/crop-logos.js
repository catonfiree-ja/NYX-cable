// Crop all 66 logo images to uniform 160×72px
// Each logo: resize to fit 148×64 (with 6px padding), center on white 160×72 canvas
// Saves as PNG for consistency

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.resolve('public/client-logos');
const backupDir = path.resolve('public/client-logos-original');

async function main() {
  // Create backup if not exists
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    const files = fs.readdirSync(dir).filter(f => /^logo-\d+/.test(f));
    for (const f of files) {
      fs.copyFileSync(path.join(dir, f), path.join(backupDir, f));
    }
    console.log(`Backed up ${files.length} logos to ${backupDir}`);
  }

  const files = fs.readdirSync(backupDir).filter(f => /^logo-\d+/.test(f)).sort();
  
  const TARGET_W = 160;
  const TARGET_H = 72;
  const PAD = 6; // padding inside the box
  const INNER_W = TARGET_W - PAD * 2; // 148
  const INNER_H = TARGET_H - PAD * 2; // 60

  let count = 0;
  for (const f of files) {
    const n = parseInt(f.match(/\d+/)[0]);
    const srcPath = path.join(backupDir, f);
    const outPath = path.join(dir, `logo-${String(n).padStart(2, '0')}.png`);
    
    try {
      // Read original
      const img = sharp(srcPath);
      const meta = await img.metadata();
      
      // Resize to fit within INNER_W × INNER_H (contain mode)
      const resized = await img
        .resize(INNER_W, INNER_H, { fit: 'inside', withoutEnlargement: false })
        .png()
        .toBuffer();
      
      // Get resized dimensions
      const resizedMeta = await sharp(resized).metadata();
      
      // Calculate position to center on canvas
      const left = Math.round((TARGET_W - resizedMeta.width) / 2);
      const top = Math.round((TARGET_H - resizedMeta.height) / 2);
      
      // Create white canvas and composite the logo centered
      await sharp({
        create: {
          width: TARGET_W,
          height: TARGET_H,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
      })
        .composite([{ input: resized, left, top }])
        .png()
        .toFile(outPath);
      
      // Remove old jpg if it was jpg
      const oldJpg = path.join(dir, `logo-${String(n).padStart(2, '0')}.jpg`);
      if (f.endsWith('.jpg') && fs.existsSync(oldJpg)) {
        fs.unlinkSync(oldJpg);
      }
      
      count++;
      console.log(`#${n}: ${meta.width}x${meta.height} → ${resizedMeta.width}x${resizedMeta.height} → 160x72 canvas ✓`);
    } catch (err) {
      console.error(`#${n}: FAILED - ${err.message}`);
    }
  }
  
  console.log(`\nDone! Processed ${count} logos. All are now 160×72px PNG.`);
}

main().catch(console.error);
