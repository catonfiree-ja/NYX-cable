import os, shutil

dw = os.path.join(os.environ['USERPROFILE'], 'Downloads')
print("Scanning:", dw)
files = os.listdir(dw)
found_doc = False
found_xls = False

for f in files:
    if "0.docx" in f:
        print("Found Docx:", f)
        shutil.copy(os.path.join(dw, f), 'client.zip')
        found_doc = True
    if "0.xlsx" in f:
        print("Found Xlsx:", f)
        shutil.copy(os.path.join(dw, f), 'client.xlsx')
        found_xls = True

if found_doc and found_xls:
    print("DONE_COPY")
else:
    print("MISSING FILES")
