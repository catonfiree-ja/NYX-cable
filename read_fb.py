import zipfile, xml.etree.ElementTree as ET, os, sys

ns = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
d = os.path.dirname(os.path.abspath(sys.argv[0]))

for fn, outfn in [('Feedback3.docx', 'feedback3.txt'), ('Feedback4.docx', 'feedback4.txt')]:
    fp = os.path.join(d, fn)
    if not os.path.exists(fp):
        print(f"NOT FOUND: {fn}")
        continue
    z = zipfile.ZipFile(fp, 'r')
    tree = ET.fromstring(z.read('word/document.xml'))
    z.close()
    lines = []
    for p in tree.iter(ns + 'p'):
        t = ''.join([tx.text for r in p.iter(ns+'r') for tx in r.iter(ns+'t') if tx.text])
        # Replace problematic chars
        t = t.replace('\uf0b7', '-').replace('\uf0a7', '*')
        lines.append(t)
    
    out_path = os.path.join(d, outfn)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f"Saved {outfn} ({len(lines)} lines)")
