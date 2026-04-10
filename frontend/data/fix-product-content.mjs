/**
 * Fix script for product-content.tsx
 * 
 * Fixes 2 issues:
 * 1. Line 260: Corrupted Thai text where a comment was inserted mid-paragraph
 * 2. Lines 460-524: Orphaned VCT content block that should have been removed
 *
 * Usage: node fix-product-content.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'product-content.tsx');

// Read the file as a buffer first to detect encoding
const buf = fs.readFileSync(filePath);
console.log('File size:', buf.length, 'bytes');
console.log('First 3 bytes (BOM check):', buf[0].toString(16), buf[1].toString(16), buf[2].toString(16));

// Check if UTF-16 LE BOM (FF FE)
const isUTF16LE = buf[0] === 0xFF && buf[1] === 0xFE;
// Check if UTF-16 BE BOM (FE FF)
const isUTF16BE = buf[0] === 0xFE && buf[1] === 0xFF;
// Check if UTF-8 BOM (EF BB BF)
const isUTF8BOM = buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF;

let encoding = 'utf8';
if (isUTF16LE) encoding = 'utf16le';
else if (isUTF16BE) encoding = 'utf16be';

console.log('Detected encoding:', encoding, isUTF8BOM ? '(with BOM)' : '');

let content = fs.readFileSync(filePath, encoding);
console.log('Content length (chars):', content.length);

const lines = content.split(/\r?\n/);
console.log('Total lines:', lines.length);

// === FIX 1: Find and fix the corrupted line ===
// The corruption pattern: Thai text + "// 'vct' content has been migrated" + more Thai
let fix1Applied = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("// 'vct'") && lines[i].includes('YSLY-JZ 100%')) {
        console.log('\n=== FIX 1 ===');
        console.log('Found corrupted line at line', i + 1);
        console.log('Line length:', lines[i].length);
        
        // The corrupted line contains:
        // <p>...ที่ต้องการความอ่อนตั    // 'vct' content...mapหมือนกับ YSLY-JZ 100%',
        //                 content: (
        // This should be split into:
        // 1. The paragraph ending properly
        // 2. Closing braces for the section/entry
        // 3. FAQs for ysly-jz
        // 4. Opening of opvc-jz entry
        
        // Find the comment marker position
        const commentPos = lines[i].indexOf("// 'vct'");
        const beforeComment = lines[i].substring(0, commentPos);
        
        // The text before the comment ends with truncated Thai
        // We need to fix the last Thai character and close the <p> tag
        // Looking at the pattern, the text likely ends with the Thai word ending in ว (0E27)
        // but it's truncated. Let's just close it properly.
        
        // Remove trailing whitespace/incomplete chars and close the paragraph
        const fixedPara = beforeComment.trimEnd();
        
        // Check if it ends with a truncated character (the last visible char before corruption)
        // From the view: ความอ่อนตั -> should be ความอ่อนตัว
        const newLine = fixedPara + '\u0e27</p>'; // Add ว and close tag
        
        // Build the replacement lines
        const replacementLines = [
            newLine,
            '                ),',
            '            },',
            '        ],',
            '        faqs: [',
            "            { q: 'YSLY-JZ \u0e43\u0e0a\u0e49\u0e41\u0e17\u0e19 VCT \u0e44\u0e14\u0e49\u0e44\u0e2b\u0e21 ?', a: '\u0e44\u0e14\u0e49\u0e04\u0e23\u0e31\u0e1a YSLY-JZ \u0e2d\u0e48\u0e2d\u0e19\u0e15\u0e31\u0e27\u0e01\u0e27\u0e48\u0e32\u0e41\u0e25\u0e30\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e2b\u0e19\u0e49\u0e32\u0e15\u0e31\u0e14\u0e40\u0e25\u0e47\u0e01\u0e01\u0e27\u0e48\u0e32 VCT 40-65%' },",
            "            { q: 'YSLY-JZ \u0e23\u0e31\u0e1a\u0e41\u0e23\u0e07\u0e14\u0e31\u0e19\u0e44\u0e14\u0e49\u0e40\u0e17\u0e48\u0e32\u0e44\u0e23 ?', a: '\u0e23\u0e31\u0e1a\u0e41\u0e23\u0e07\u0e14\u0e31\u0e19 500V \u0e2d\u0e38\u0e14\u0e2b\u0e20\u0e39\u0e21\u0e34 80\u00b0C' },",
            "            { q: 'YSLY-JZ \u0e21\u0e35\u0e02\u0e19\u0e32\u0e14\u0e2d\u0e30\u0e44\u0e23\u0e1a\u0e49\u0e32\u0e07 ?', a: '\u0e21\u0e35\u0e02\u0e19\u0e32\u0e14 0.5-240 mm\u00b2 \u0e08\u0e33\u0e19\u0e27\u0e19 2-100 \u0e04\u0e2d\u0e23\u0e4c' },",
            '        ],',
            '    },',
            "    'opvc-jz': {",
            '        sections: [',
            '            {',
            "                id: 'overview',",
            "                title: 'OPVC-JZ \u0e2a\u0e40\u0e1b\u0e01\u0e40\u0e2b\u0e21\u0e37\u0e2d\u0e19\u0e01\u0e31\u0e1a YSLY-JZ 100%',",
        ];
        
        // Replace the corrupted line and remove the next line (which was "content: (")
        // because our replacement already includes the section structure leading to a new "content: ("
        lines.splice(i, 1, ...replacementLines);
        fix1Applied = true;
        console.log('Fix 1 applied! Replaced 1 corrupted line with', replacementLines.length, 'clean lines');
        break;
    }
}

if (!fix1Applied) {
    console.log('\nWARNING: Fix 1 not applied - could not find corrupted line');
    // Debug: search for the comment pattern
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("'vct'")) {
            console.log(`  Line ${i + 1} contains 'vct': ${lines[i].substring(0, 80)}`);
        }
    }
}

// === FIX 2: Remove the orphaned VCT content block ===
let fix2Applied = false;

for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    // Look for the VCT comment line that's followed by orphaned section content
    if (trimmed.includes("'vct'") && trimmed.includes('migrated') && trimmed.startsWith('//')) {
        // Check if next non-empty line starts with 'sections:'
        let nextContentLine = i + 1;
        while (nextContentLine < lines.length && lines[nextContentLine].trim() === '') {
            nextContentLine++;
        }
        
        if (nextContentLine < lines.length && lines[nextContentLine].trim().startsWith('sections:')) {
            console.log('\n=== FIX 2 ===');
            console.log('Found orphaned VCT block starting at line', i + 1);
            
            // Find the end of this block by looking for the CVV comment or next entry
            let endIdx = -1;
            for (let j = nextContentLine; j < lines.length; j++) {
                const jTrimmed = lines[j].trim();
                if (jTrimmed.includes("'cvv'") && jTrimmed.includes('migrated') && jTrimmed.startsWith('//')) {
                    endIdx = j;
                    break;
                }
                // Also check for a proper map entry starting (fallback)
                if (jTrimmed.match(/^'[a-z-]+'\s*:/) && j > nextContentLine + 5) {
                    endIdx = j;
                    break;
                }
            }
            
            if (endIdx > 0) {
                const removeCount = endIdx - i - 1; // Keep the VCT comment, remove up to (not including) CVV comment
                console.log(`Removing ${removeCount} orphaned lines (${i + 2} to ${endIdx})`);
                lines.splice(i + 1, removeCount);
                fix2Applied = true;
                console.log('Fix 2 applied!');
            } else {
                // Try alternative: find the closing },\n pattern after faqs
                for (let j = nextContentLine; j < lines.length; j++) {
                    if (lines[j].trim() === '},' || lines[j].trim() === '},') {
                        // Check if this is at the right indentation level (4 spaces)
                        if (lines[j].match(/^    },?\s*$/)) {
                            endIdx = j + 1;
                            const removeCount = endIdx - i - 1;
                            console.log(`Removing ${removeCount} orphaned lines (${i + 2} to ${endIdx})`);
                            lines.splice(i + 1, removeCount);
                            fix2Applied = true;
                            console.log('Fix 2 applied (alt method)!');
                            break;
                        }
                    }
                }
            }
            break;
        }
    }
}

if (!fix2Applied) {
    console.log('\nWARNING: Fix 2 not applied - could not find orphaned VCT block');
    // Debug
    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed.includes('migrated') || trimmed.includes('hardcoded')) {
            console.log(`  Line ${i + 1}: ${trimmed.substring(0, 100)}`);
        }
    }
}

// Write back
const result = lines.join('\n');
fs.writeFileSync(filePath, result, encoding);
console.log('\n=== Summary ===');
console.log('Fix 1 (corrupted Thai text):', fix1Applied ? 'APPLIED' : 'SKIPPED');
console.log('Fix 2 (orphaned VCT block):', fix2Applied ? 'APPLIED' : 'SKIPPED');
console.log('File written successfully');
console.log('Original size:', content.length, 'chars');
console.log('New size:', result.length, 'chars');
