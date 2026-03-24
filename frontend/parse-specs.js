// Parse the CSV data file and generate JSON matching ExcelSpecTable interface
const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'เวิร์กชีต ใน C  Users ปิ๊ก Downloads ปรับเวป 0.csv');
const raw = fs.readFileSync(csvPath, 'utf8');
const lines = raw.split('\n').map(l => l.replace(/\r$/, ''));

const specs = {};

for (const line of lines) {
    const cols = line.split(',');
    const partNo = cols[0]?.trim();
    const productName = cols[1]?.trim();
    const productSlug = cols[2]?.trim();
    const variantSlug = cols[3]?.trim();
    const coreSize = cols[5]?.trim();
    const model = cols[6]?.trim();
    const strands = cols[7]?.trim();
    const outerDia = cols[8]?.trim();
    const cuWeight = cols[9]?.trim();
    const weight = cols[10]?.trim();
    const resistance = cols[11]?.trim();
    const price = cols[12]?.trim();
    const oldLink = cols[14]?.trim();

    if (!partNo || !productSlug || partNo === 'Part NO.') continue;

    if (!specs[productSlug]) {
        specs[productSlug] = {
            sheetName: productName || productSlug,
            productUrl: `/products/detail/${productSlug}`,
            items: [],
            count: 0
        };
    }

    specs[productSlug].items.push({
        partNo,
        coreSize: coreSize || '',
        model: model || '',
        strands: strands || '',
        outerDia: outerDia || '',
        cuWeight: cuWeight || '',
        weight: weight || '',
        resistance: resistance || '',
        price: price && price !== '-' ? price : null,
        link: oldLink || null
    });
    specs[productSlug].count = specs[productSlug].items.length;
}

const outPath = path.join(__dirname, 'data', 'product-specs.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(specs, null, 2), 'utf8');

console.log('Generated product-specs.json (ExcelSpecTable format)');
for (const [slug, data] of Object.entries(specs)) {
    console.log(`  ${slug}: ${data.count} items — "${data.sheetName}"`);
}
