const fs = require('fs');
const mammoth = require('mammoth');
const xlsx = require('xlsx');

async function run() {
  let result = '--- DOCX ---\n';
  try {
    const d = await mammoth.extractRawText({path: 'C:/Users/ปิ๊ก/Downloads/ปรับเวป 0.docx'});
    result += d.value;
  } catch(e) {
    result += 'Error DOCX: ' + e.message;
  }
  
  result += '\n\n--- XLSX ---\n';
  try {
    const wb = xlsx.readFile('C:/Users/ปิ๊ก/Downloads/เวิร์กชีต ใน C  Users ปิ๊ก Downloads ปรับเวป 0.xlsx');
    const sh = wb.Sheets[wb.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sh, {header: 1});
    result += JSON.stringify(data, null, 2);
  } catch(e) {
    result += 'Error XLSX: ' + e.message;
  }
  
  fs.writeFileSync('client_feedback_raw.txt', result);
  console.log('Done');
}

run();
