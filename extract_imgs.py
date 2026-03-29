import zipfile, os, sys, re

d = os.path.dirname(os.path.abspath(sys.argv[0]))

for fn in ['Feedback3.docx', 'Feedback4.docx']:
    fp = os.path.join(d, fn)
    base = fn.replace('.docx','')
    outdir = os.path.join(d, f'{base}_images')
    os.makedirs(outdir, exist_ok=True)
    
    with zipfile.ZipFile(fp, 'r') as z:
        count = 0
        for name in z.namelist():
            if name.startswith('word/media/'):
                ext = os.path.splitext(name)[1]
                fname = f'{base}_img{count}{ext}'
                data = z.read(name)
                with open(os.path.join(outdir, fname), 'wb') as f:
                    f.write(data)
                count += 1
        print(f"{fn}: extracted {count} images to {outdir}")
