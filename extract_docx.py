# -*- coding: utf-8 -*-
import zipfile
import xml.etree.ElementTree as ET
import os

def extract_docx_text(docx_path):
    ns = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
    with zipfile.ZipFile(docx_path, 'r') as z:
        xml_content = z.read('word/document.xml')
    tree = ET.fromstring(xml_content)
    paragraphs = []
    for para in tree.iter(ns + 'p'):
        texts = []
        for run in para.iter(ns + 'r'):
            for text in run.iter(ns + 't'):
                if text.text:
                    texts.append(text.text)
        if texts:
            paragraphs.append(''.join(texts))
        else:
            paragraphs.append('')
    return '\n'.join(paragraphs)

script_dir = os.path.dirname(os.path.abspath(__file__))

print("===== FEEDBACK 3 =====")
text3 = extract_docx_text(os.path.join(script_dir, 'Feedback3.docx'))
print(text3)

print("\n\n===== FEEDBACK 4 =====")
text4 = extract_docx_text(os.path.join(script_dir, 'Feedback4.docx'))
print(text4)

# Also write to files
with open(os.path.join(script_dir, 'feedback3.txt'), 'w', encoding='utf-8') as f:
    f.write(text3)
with open(os.path.join(script_dir, 'feedback4.txt'), 'w', encoding='utf-8') as f:
    f.write(text4)
print("\n\nDone! Files saved as feedback3.txt and feedback4.txt")
