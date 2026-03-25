const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const LOGO_DIR = path.join(__dirname, 'public', 'client-logos');
const OUTPUT_DIR = path.join(__dirname, 'public', 'client-logos-webp');

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function optimizeLogos() {
    const files = fs.readdirSync(LOGO_DIR).filter(f => f.endsWith('.png'));
    console.log(`Found ${files.length} logo files to optimize`);

    let totalOriginal = 0;
    let totalOptimized = 0;

    for (const file of files) {
        const inputPath = path.join(LOGO_DIR, file);
        const outputFile = file.replace('.png', '.webp');
        const outputPath = path.join(OUTPUT_DIR, outputFile);

        const originalSize = fs.statSync(inputPath).size;
        totalOriginal += originalSize;

        try {
            // Resize to max 160x72 (the display size with 2x for retina)
            await sharp(inputPath)
                .resize(160, 72, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0 }
                })
                .webp({ quality: 80, effort: 6 })
                .toFile(outputPath);

            const newSize = fs.statSync(outputPath).size;
            totalOptimized += newSize;

            const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
            console.log(`${file}: ${(originalSize / 1024).toFixed(1)}KB -> ${(newSize / 1024).toFixed(1)}KB (${savings}% saved)`);
        } catch (err) {
            console.error(`Error processing ${file}:`, err.message);
        }
    }

    console.log(`\nTotal: ${(totalOriginal / 1024).toFixed(0)}KB -> ${(totalOptimized / 1024).toFixed(0)}KB (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}% saved)`);
}

optimizeLogos().catch(console.error);
