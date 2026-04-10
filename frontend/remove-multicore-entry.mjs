import { readFileSync, writeFileSync } from 'fs';

const filePath = './data/product-content.tsx';
const content = readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

console.log(`Total lines before: ${lines.length}`);
console.log(`Line 893: ${lines[892].trim().substring(0, 40)}`);
console.log(`Line 904: ${lines[903].trim().substring(0, 40)}`);

// Verify lines 893-904 are the multicore-cable entry
if (lines[892].includes("'multicore-cable'") && lines[903].trim().startsWith('},')) {
  // Remove lines 893-904 (index 892-903)
  lines.splice(892, 12);
  writeFileSync(filePath, lines.join('\n'), 'utf-8');
  console.log(`\n✅ Removed 12 lines (893-904). Total lines after: ${lines.length}`);
  console.log(`New line 893: ${lines[892].trim().substring(0, 40)}`);
} else {
  console.log('\n❌ Lines do not match expected multicore-cable entry!');
  console.log('  Expected line 893 to contain "multicore-cable"');
  console.log('  Expected line 904 to be "},"');
}
