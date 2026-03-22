import os, glob, re
home = os.path.expanduser('~')
folder = os.path.join(home, '.gemini', 'antigravity', 'scratch', 'nyxcable-website')
print("Looking in:", folder)
html_files = glob.glob(os.path.join(folder, '*.htm*'))
print("Files found:", html_files)

for h_file in html_files:
    content = open(h_file, 'r', encoding='utf-8', errors='ignore').read()
    clean = re.sub(r'<style[^>]*>[\s\S]*?</style>', '', content, flags=re.I)
    clean = re.sub(r'<[^>]+>', '\n', clean)
    lines = [l.strip() for l in clean.split('\n') if l.strip()]
    out = os.path.join(folder, 'brieftxt.txt')
    open(out, 'w', encoding='utf-8').write('\n'.join(lines))
    print("DONE writes to", out)
