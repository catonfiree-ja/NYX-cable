import zipfile, re, sys
def parse(file_path, inner_path, out_path):
    try:
        with zipfile.ZipFile(file_path) as z:
            xml = z.read(inner_path).decode('utf-8')
            text = re.sub(r'<[^>]+>', '\n', xml)
            text = "\n".join([line.strip() for line in text.split('\n') if line.strip()])
            open(out_path, "w", encoding="utf-8").write(text)
            print(f"Success: {out_path}")
    except Exception as e:
        print(f"Error {out_path}: {e}")

parse(r'C:\Users\ปิ๊ก\Downloads\ปรับเวป 0.docx', 'word/document.xml', 'raw_doc.txt')
parse(r'C:\Users\ปิ๊ก\Downloads\เวิร์กชีต ใน C  Users ปิ๊ก Downloads ปรับเวป 0.xlsx', 'xl/sharedStrings.xml', 'raw_xlsx.txt')
