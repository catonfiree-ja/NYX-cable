// Generate per-logo backgroundSize map for the 66 client logos
// Box is 160x72 = ratio 2.22
// For each logo: calculate what % fills the box best while maintaining aspect ratio

const { imageSize } = require('image-size');
const fs = require('fs');
const path = require('path');

const dir = path.resolve('public/client-logos');
const files = fs.readdirSync(dir).filter(f => /^logo-\d+/.test(f)).sort();
const BOX_W = 160, BOX_H = 72, BOX_R = BOX_W / BOX_H; // 2.22

const logoSizes = {};

files.forEach(f => {
  const buf = fs.readFileSync(path.join(dir, f));
  const d = imageSize(buf);
  const n = parseInt(f.match(/\d+/)[0]);
  const logoR = d.width / d.height;

  // With background-size: contain, the logo fits entirely inside the box
  // If logoR > BOX_R → logo is wider than box → width-constrained → height has empty space
  // If logoR < BOX_R → logo is taller than box → height-constrained → width has empty space
  // If logoR ≈ BOX_R → fills perfectly

  // Strategy: use background-size: contain as base, then scale up to fill
  // For width-constrained (wide logos ratio > 2.22): "100% auto" → fills width
  // For height-constrained (tall logos ratio < 2.22): "auto 95%" → fills height
  // For matching ratio: "95% 95%" → nearly fills all

  let bgSize;
  if (logoR >= BOX_R * 1.5) {
    // Very wide (ratio > 3.33) — constrain to width with some padding
    bgSize = '92% auto';
  } else if (logoR >= BOX_R * 0.9) {
    // Close to box ratio or wider — fill width
    bgSize = '95% auto';
  } else if (logoR >= BOX_R * 0.6) {
    // Moderately tall — fill height
    bgSize = 'auto 90%';
  } else {
    // Very tall/square (ratio < 1.33) — fill height with padding
    bgSize = 'auto 85%';
  }

  logoSizes[n] = {
    w: d.width,
    h: d.height,
    ratio: logoR.toFixed(2),
    bgSize
  };
});

// Output as a TypeScript map
console.log('// Per-logo backgroundSize map — generated from actual image dimensions');
console.log('// Box: 160x72 (ratio 2.22)');
console.log('const logoSizeMap: Record<number, string> = {');
for (let i = 1; i <= 66; i++) {
  const l = logoSizes[i];
  if (l) {
    console.log(`  ${i}: '${l.bgSize}', // ${l.w}x${l.h} r=${l.ratio}`);
  }
}
console.log('};');
