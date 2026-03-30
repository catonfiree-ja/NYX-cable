"""Scrape product images from nyxcable.com and download them."""
import requests
import re
import os
import sys
import urllib.parse

# Product URLs to scrape
products = {
    'ysly-jz': 'https://nyxcable.com/product/ysly-jz/',
    'olflex-classic-110': 'https://nyxcable.com/product/olflex-classic-110/',
    'jz-500': 'https://nyxcable.com/product/jz-500/',
    'opvc-jz': 'https://nyxcable.com/product/opvc-jz/',
    'flex-jz': 'https://nyxcable.com/product/flex-jz/',
    'cvv': 'https://nyxcable.com/product/cvv/',
    'vct': 'https://nyxcable.com/product/vct/',
    'multicore-cable': 'https://nyxcable.com/product/multicore-cable/',
    'ysly-jz-1kv': 'https://nyxcable.com/product/ysly-jz-1kv/',
    'control-cable-overview': 'https://nyxcable.com/product/%E0%B8%AA%E0%B8%B2%E0%B8%A2%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%82%E0%B8%97%E0%B8%A3%E0%B8%A5/',
    # Shielded
    'liycy': 'https://nyxcable.com/product/liycy/',
    'liycy-jz': 'https://nyxcable.com/product/liycy-jz/',
    'olflex-classic-115-cy': 'https://nyxcable.com/product/olflex-classic-115-cy/',
    # Rubber
    'h07rn-f': 'https://nyxcable.com/product/h07rn-f/',
    # Wiring
    'h05v-k': 'https://nyxcable.com/product/h05v-k/',
    'h07v-k': 'https://nyxcable.com/product/h07v-k/',
}

output_dir = os.path.join('frontend', 'public', 'images', 'products')
os.makedirs(output_dir, exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Referer': 'https://nyxcable.com/',
}

results = {}

for slug, url in products.items():
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()
        html = resp.text
        
        # Find main product image - look for og:image or woocommerce product image
        og_match = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\'](.*?)["\']', html)
        if og_match:
            img_url = og_match.group(1)
        else:
            # Try woocommerce product image
            woo_match = re.search(r'woocommerce-product-gallery__image.*?<img[^>]+src=["\'](.*?)["\']', html, re.DOTALL)
            if woo_match:
                img_url = woo_match.group(1)
            else:
                # Any product image
                img_match = re.search(r'<img[^>]+class="[^"]*wp-post-image[^"]*"[^>]+src=["\'](.*?)["\']', html)
                if img_match:
                    img_url = img_match.group(1)
                else:
                    print(f"  SKIP {slug}: no image found")
                    continue
        
        # Download image
        ext = '.webp' if '.webp' in img_url else '.jpg' if '.jpg' in img_url else '.png'
        filename = f"{slug}{ext}"
        filepath = os.path.join(output_dir, filename)
        
        img_resp = requests.get(img_url, headers=headers, timeout=15)
        if img_resp.status_code == 200 and len(img_resp.content) > 1000:
            with open(filepath, 'wb') as f:
                f.write(img_resp.content)
            size_kb = len(img_resp.content) / 1024
            print(f"  OK   {slug}: {filename} ({size_kb:.0f} KB) from {img_url[:80]}...")
            results[slug] = f"/images/products/{filename}"
        else:
            print(f"  FAIL {slug}: HTTP {img_resp.status_code}, size={len(img_resp.content)}")
    except Exception as e:
        print(f"  ERR  {slug}: {e}")

print(f"\n=== Downloaded {len(results)} images ===")
for slug, path in results.items():
    print(f"  '{slug}': '{path}',")
