// Compute BALANCED backgroundSize for each logo
// Middle ground between contain (too small) and cover (too much crop)
// Uses geometric mean: scale = sqrt(contain_scale * cover_scale)

const { imageSize } = require('image-size');
const fs = require('fs');
const path = require('path');

const dir = path.resolve('public/client-logos');
const files = fs.readdirSync(dir).filter(f => /^logo-\d+/.test(f)).sort();
const BOX_W = 160, BOX_H = 72;

console.log('const logoBalancedSize: Record<number, string> = {');

files.forEach(f => {
  const buf = fs.readFileSync(path.join(dir, f));
  const d = imageSize(buf);
  const n = parseInt(f.match(/\d+/)[0]);

  const containScale = Math.min(BOX_W / d.width, BOX_H / d.height);
  const coverScale = Math.max(BOX_W / d.width, BOX_H / d.height);
  
  // Use geometric mean — balanced between contain and cover
  const balancedScale = Math.sqrt(containScale * coverScale);
  
  const renderW = Math.round(d.width * balancedScale);
  const renderH = Math.round(d.height * balancedScale);
  
  // Check how much it fills and crops
  const fillPct = Math.round((Math.min(renderW, BOX_W) * Math.min(renderH, BOX_H)) / (BOX_W * BOX_H) * 100);
  const cropW = Math.max(0, renderW - BOX_W);
  const cropH = Math.max(0, renderH - BOX_H);
  
  console.log(`  ${n}: '${renderW}px ${renderH}px', // ${d.width}x${d.height} r=${(d.width/d.height).toFixed(2)} → ${renderW}x${renderH} fill=${fillPct}% crop=${cropW},${cropH}`);
});

console.log('};');
