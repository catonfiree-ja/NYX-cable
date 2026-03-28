"""Check all product pages render correctly on localhost:3000"""
import urllib.request
import urllib.error
import sys
import os
os.environ['PYTHONIOENCODING'] = 'utf-8'
sys.stdout.reconfigure(encoding='utf-8')

pages = {
    "ysly-jz": 153,
    "jz-500": 153,
    "olflex-classic-110": 153,
    "flex-jz": 153,
    "opvc-jz": 153,
    "olflex-classic-115-cy": 95,
    "liycy": 95,
    "liycy-jz": 95,
    "h07v-k": 18,
}

all_ok = True
for slug, expected_count in pages.items():
    try:
        r = urllib.request.urlopen("http://localhost:3000/products/detail/" + slug)
        html = r.read().decode()
        has_spec = "spec-table" in html
        has_count = str(expected_count) in html
        has_error = "Error" in html or "error" in html[:500]
        
        if has_spec and has_count and not has_error:
            print("[OK]   " + slug + ": rendered, spec-table with " + str(expected_count) + " items")
        else:
            print("[FAIL] " + slug + ": spec=" + str(has_spec) + " count=" + str(has_count) + " error=" + str(has_error))
            all_ok = False
    except urllib.error.HTTPError as e:
        print("[FAIL] " + slug + ": HTTP " + str(e.code))
        all_ok = False
    except Exception as e:
        print("[FAIL] " + slug + ": " + str(e))
        all_ok = False

if all_ok:
    print("\nAll 9 product pages render correctly!")
else:
    print("\nSome pages have issues!")
    sys.exit(1)
