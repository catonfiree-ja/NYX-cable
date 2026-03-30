"""Scrape ALL remaining product images from nyxcable.com"""
import requests
import re
import os

products = {
    # Shielded - missing
    'multiflex-cy': 'https://nyxcable.com/product/multiflex-512-c-pvc-cy/',
    'double-shielded-cable': 'https://nyxcable.com/product/double-shielded-cable/',
    # Twisted Pair
    'liyy-tp': 'https://nyxcable.com/product/liyy-tp/',
    'rs485-rs422': 'https://nyxcable.com/product/rs485-rs422/',
    'rs485-rs422-sttp': 'https://nyxcable.com/product/sttp/',
    'rs485-rs422-belden': 'https://nyxcable.com/product/belden-9841/',
    'rs485-rs422-hosiwell': 'https://nyxcable.com/product/hosiwell/',
    'rs485-rs422-liycy-tp': 'https://nyxcable.com/product/liycy-tp/',
    # Rubber - missing welding
    'welding-cable': 'https://nyxcable.com/product/welding-cable/',
    # High-Flex
    'multiflex-y': 'https://nyxcable.com/product/multiflex-y/',
    'igus': 'https://nyxcable.com/product/multiflex-512-c-pur-cp/',
    'multiflex-p': 'https://nyxcable.com/product/multiflex-p/',
    'robot-cable': 'https://nyxcable.com/product/robot-welding-cable/',
    # Industrial Bus
    'profibus-cable': 'https://nyxcable.com/product/profibus-cable/',
    'profinet-type-a': 'https://nyxcable.com/product/profinet-type-a/',
    'cc-link': 'https://nyxcable.com/product/cc-link/',
    'devicenet-thick': 'https://nyxcable.com/product/devicenet-thick/',
    'eib-bus-knx': 'https://nyxcable.com/product/eib-bus-knx/',
    # Resistant
    'sif': 'https://nyxcable.com/product/sif/',
    'sihf': 'https://nyxcable.com/product/sihf/',
    'pfa-cable': 'https://nyxcable.com/product/pfa-cable/',
    'thermocouple-type-k-cable': 'https://nyxcable.com/product/thermocouple-type-k-cable/',
    'y11y-jz': 'https://nyxcable.com/product/y11y-jz/',
    # Crane
    'pur-hf': 'https://nyxcable.com/product/pur-hf/',
    'nshtou': 'https://nyxcable.com/product/nshtou/',
    'h07vvh6-f': 'https://nyxcable.com/product/h07vvh6-f/',
    'lift-2s': 'https://nyxcable.com/product/lift-2s/',
    # Multicore with Thai URL
    'multicore-cable': 'https://nyxcable.com/product/%E0%B8%AA%E0%B8%B2%E0%B8%A2%E0%B8%A1%E0%B8%B1%E0%B8%A5%E0%B8%95%E0%B8%B4%E0%B8%84%E0%B8%AD%E0%B8%A3%E0%B9%8C/',
}

output_dir = os.path.join('frontend', 'public', 'images', 'products')
os.makedirs(output_dir, exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer': 'https://nyxcable.com/',
}

ok = 0
fail = 0
for slug, url in products.items():
    # Skip if already exists
    for ext in ['.jpg', '.png', '.webp']:
        if os.path.exists(os.path.join(output_dir, f"{slug}{ext}")):
            print(f"  SKIP {slug}: already exists")
            ok += 1
            break
    else:
        try:
            resp = requests.get(url, headers=headers, timeout=15)
            resp.raise_for_status()
            html = resp.text
            og = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\'](.*?)["\']', html)
            if not og:
                print(f"  NOIMG {slug}")
                fail += 1
                continue
            img_url = og.group(1)
            ext = '.webp' if '.webp' in img_url else '.jpg' if '.jpg' in img_url else '.png'
            filepath = os.path.join(output_dir, f"{slug}{ext}")
            img_resp = requests.get(img_url, headers=headers, timeout=15)
            if img_resp.status_code == 200 and len(img_resp.content) > 1000:
                with open(filepath, 'wb') as f:
                    f.write(img_resp.content)
                print(f"  OK   {slug}: {slug}{ext} ({len(img_resp.content)/1024:.0f} KB)")
                ok += 1
            else:
                print(f"  FAIL {slug}: HTTP {img_resp.status_code}")
                fail += 1
        except Exception as e:
            print(f"  ERR  {slug}: {e}")
            fail += 1

print(f"\nDone: {ok} OK, {fail} failed")

# List all files
print("\nAll product images:")
for f in sorted(os.listdir(output_dir)):
    size = os.path.getsize(os.path.join(output_dir, f))
    print(f"  {f} ({size/1024:.0f} KB)")
