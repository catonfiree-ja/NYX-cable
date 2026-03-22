import glob
import re
import os

files = glob.glob('../*.htm*')
if not files:
    print("NO FILES FOUND")
else:
    for f in files:
        with open(f, 'rb') as file:
            content = file.read().decode('utf-8', errors='ignore')
        
        # Remove style and script tags
        clean = re.sub(r'<style[^>]*>[\s\S]*?</style>', '', content, flags=re.I)
        clean = re.sub(r'<script[^>]*>[\s\S]*?</script>', '', clean, flags=re.I)
        
        # Replace other tags with newline
        clean = re.sub(r'<[^>]+>', '\n', clean)
        
        lines = [line.strip() for line in clean.splitlines() if line.strip()]
        
        out_path = 'output_text.txt'
        with open(out_path, 'wb') as outfile:
            outfile.write('\n'.join(lines).encode('utf-8'))
        print("Success writing to output_text.txt")
