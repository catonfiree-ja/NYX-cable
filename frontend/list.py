import os
import sys

# Windows console encoding usually requires care. We'll write to a file.
try:
    with open('C:\\Users\\public\\dir_out.txt', 'w', encoding='utf-8') as f:
        files = os.listdir('..')
        f.write('\n'.join(files))
except Exception as e:
    with open('C:\\Users\\public\\dir_out.txt', 'w', encoding='utf-8') as f:
        f.write(str(e))
