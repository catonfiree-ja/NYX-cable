/**
 * Copy and rename 66 client logos from source to frontend/public/client-logos/
 * Renames to logo-01.png, logo-02.jpg, etc. for clean URLs
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', '..', '..', '..', '..', 'Downloads', 'NYX', 'logo 2026', '03.2026 update ลบรายใหญ่ออกจาก LOGO เหลือ66');
const DEST = path.join(__dirname, '..', 'frontend', 'public', 'client-logos');

// Ensure dest directory exists
if (!fs.existsSync(DEST)) fs.mkdirSync(DEST, { recursive: true });

const files = fs.readdirSync(SRC).filter(f => /\.(png|jpg|jpeg|svg|webp)$/i.test(f)).sort();
console.log(`Found ${files.length} logo files`);

files.forEach((file, i) => {
  const ext = path.extname(file).toLowerCase();
  const newName = `logo-${String(i + 1).padStart(2, '0')}${ext}`;
  const src = path.join(SRC, file);
  const dest = path.join(DEST, newName);
  fs.copyFileSync(src, dest);
  console.log(`  ${newName} ← ${file}`);
});

console.log(`\nDone! Copied ${files.length} logos to ${DEST}`);
