import zipfile, re, sys
try:
    with zipfile.ZipFile(r'C:\Users\ปิ๊ก\Downloads\ปรับเวป 0.docx') as z:
        print(re.sub(r'<[^>]+>', '\n', z.read('word/document.xml').decode('utf-8')))
except Exception as e:
    print(e)
