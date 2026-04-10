import fs from 'fs';

const filePath = 'product-content.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// === FIX 1: Line 260 - Corrupted Thai text ===
// The comment "// 'vct' content has been migrated to Sanity CMS — removed from hardcoded map"
// was accidentally inserted into line 260, breaking the YSLY-JZ paragraph and OPVC-JZ section header.
// We need to find the corrupted section and fix it.

// Find the corrupted comment embedded in the Thai text
const corruptedMarker = "// 'vct' content has been migrated to Sanity CMS";
const lines = content.split('\n');

let line260idx = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(corruptedMarker) && lines[i].includes('YSLY-JZ 100%')) {
        line260idx = i;
        console.log(`Found corrupted line at index ${i} (line ${i+1})`);
        console.log(`Line length: ${lines[i].length}`);
        console.log(`First 100 chars: ${lines[i].substring(0, 100)}`);
        console.log(`Last 100 chars: ${lines[i].substring(lines[i].length - 100)}`);
        break;
    }
}

if (line260idx === -1) {
    console.log('ERROR: Could not find corrupted line 260');
    // Let's search for the comment in all lines
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(corruptedMarker)) {
            console.log(`Found comment at line ${i+1}: ${lines[i].substring(0, 80)}`);
        }
    }
    process.exit(1);
}

// The corrupted line has:
// <p>...ที่ต้องการความอ่อนตั    // 'vct' content has been migrated to Sanity CMS — removed from hardcoded mapหมือนกับ YSLY-JZ 100%',
// This was originally TWO things:
// 1. End of the YSLY-JZ multicore-use paragraph: ...ที่ต้องการความอ่อนตัว</p>
// 2. Start of the OPVC-JZ section with title/closing of ysly-jz entry

// Split the corrupted line at the comment
const commentStart = lines[line260idx].indexOf(corruptedMarker);
const beforeComment = lines[line260idx].substring(0, commentStart);
const afterComment = lines[line260idx].substring(commentStart + corruptedMarker.length);

console.log('\nBefore comment:', beforeComment.substring(beforeComment.length - 50));
console.log('After comment:', afterComment.substring(0, 80));

// Now reconstruct the proper lines.
// The beforeComment ends with truncated Thai: ความอ่อนตั (missing ว</p>)
// The afterComment starts with: — removed from hardcoded mapหมือนกับ YSLY-JZ 100%',
// We need the line to properly end the paragraph and start a new section.

// Fix: Replace the entire corrupted line region (lines 256-261 which contain the broken section)
// with proper content. We need to:
// 1. Close the multicore-use section paragraph properly
// 2. Close the ysly-jz entry with FAQs
// 3. Start the opvc-jz entry

// Find the exact range to replace
// Line 256 (index 255) has: id: 'multicore-use'
// Line 260 (index 259) is corrupted
// Line 261 (index 260) has: content: (
// We need to fix from line 260 to after the section title

// Replace just the corrupted line with proper content
const fixedLine = beforeComment.replace(/\u0e15\u0e31\s*$/, '') + // Remove trailing truncated Thai char
    '\u0e15\u0e31\u0e27</p>'; // Complete the word: ตัว</p>

// And then we need to insert proper closing and new section start
const newLines = [
    fixedLine,
    '                ),',
    '            },',
    '        ],',
    '        faqs: [',
    "            { q: 'YSLY-JZ \u0e43\u0e0a\u0e49\u0e41\u0e17\u0e19 VCT \u0e44\u0e14\u0e49\u0e44\u0e2b\u0e21 ?', a: '\u0e44\u0e14\u0e49\u0e04\u0e23\u0e31\u0e1a YSLY-JZ \u0e43\u0e0a\u0e49\u0e17\u0e14\u0e41\u0e17\u0e19 VCT \u0e44\u0e14\u0e49\u0e40\u0e1b\u0e47\u0e19\u0e2d\u0e22\u0e48\u0e32\u0e07\u0e14\u0e35 \u0e2d\u0e48\u0e2d\u0e19\u0e15\u0e31\u0e27\u0e01\u0e27\u0e48\u0e32\u0e41\u0e25\u0e30\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e2b\u0e19\u0e49\u0e32\u0e15\u0e31\u0e14\u0e40\u0e25\u0e47\u0e01\u0e01\u0e27\u0e48\u0e32 40-65%' },",
    "            { q: 'YSLY-JZ \u0e23\u0e31\u0e1a\u0e41\u0e23\u0e07\u0e14\u0e31\u0e19\u0e44\u0e14\u0e49\u0e40\u0e17\u0e48\u0e32\u0e44\u0e23 ?', a: '\u0e23\u0e31\u0e1a\u0e41\u0e23\u0e07\u0e14\u0e31\u0e19 500V \u0e2d\u0e38\u0e14\u0e2b\u0e20\u0e39\u0e21\u0e34 80\u00b0C' },",
    "            { q: 'YSLY-JZ \u0e21\u0e35\u0e02\u0e19\u0e32\u0e14\u0e2d\u0e30\u0e44\u0e23\u0e1a\u0e49\u0e32\u0e07 ?', a: '\u0e21\u0e35\u0e02\u0e19\u0e32\u0e14 0.5-240 mm\u00b2 \u0e08\u0e33\u0e19\u0e27\u0e19 2-100 \u0e04\u0e2d\u0e23\u0e4c' },",
    '        ],',
    '    },',
    "    'opvc-jz': {",
    '        sections: [',
    '            {',
    "                id: 'overview',",
    "                title: 'OPVC-JZ \u0e2a\u0e40\u0e1b\u0e01\u0e40\u0e2b\u0e21\u0e37\u0e2d\u0e19\u0e01\u0e31\u0e1a YSLY-JZ 100%',",
    '                content: ('
];

// Replace the corrupted line (index 259) and the next line (index 260 = "content: (")
// with our fixed content
lines.splice(line260idx, 2, ...newLines);

// === FIX 2: Remove the orphaned VCT block ===
// Find the VCT comment line (should be around line 460)
let vctCommentIdx = -1;
let vctEndIdx = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "// 'vct' content has been migrated to Sanity CMS \u2014 removed from hardcoded map") {
        // Check if the next line starts the orphaned sections block
        if (i + 1 < lines.length && lines[i + 1].trim().startsWith('sections:')) {
            vctCommentIdx = i;
            console.log(`\nFound VCT comment at new line ${i + 1}`);
            
            // Find the end of this block - look for the closing },
            // followed by the CVV comment
            for (let j = i + 1; j < lines.length; j++) {
                if (lines[j].trim().startsWith("// 'cvv' content has been migrated")) {
                    vctEndIdx = j;
                    break;
                }
            }
            break;
        }
    }
}

if (vctCommentIdx === -1) {
    console.log('ERROR: Could not find orphaned VCT block');
    // Search for lines containing vct comment
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("'vct' content has been migrated")) {
            console.log(`  Found at line ${i+1}: ${lines[i].trim().substring(0, 80)}`);
        }
    }
    process.exit(1);
}

console.log(`VCT block: lines ${vctCommentIdx + 1} to ${vctEndIdx}`);

// Remove from the VCT comment line to just before the CVV comment
// Keep the VCT comment line but remove all the orphaned content
const vctBlockLines = vctEndIdx - vctCommentIdx - 1;
console.log(`Removing ${vctBlockLines} orphaned VCT lines (keeping comment)`);

// Remove the orphaned sections/faqs (everything between the VCT comment and CVV comment)
lines.splice(vctCommentIdx + 1, vctBlockLines);

// Write the fixed file
const result = lines.join('\n');
fs.writeFileSync(filePath, result, 'utf8');

console.log('\n=== Done! File fixed successfully ===');
console.log(`Original length: ${content.length}`);
console.log(`New length: ${result.length}`);
