# -*- coding: utf-8 -*-
"""Convert feedback.xlsx (9 sheets) into frontend/data/product-specs.json"""
import openpyxl
import json
import os

XLSX = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'feedback.xlsx')
OUT  = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'frontend', 'data', 'product-specs.json')

# Sheet name -> product slug on website
SHEET_SLUG = {
    'YSLY':     'ysly-jz',
    'JZ-500':   'jz-500',
    'Olflex':   'olflex-classic-110',
    'Flex-JZ':  'flex-jz',
    'OPVC-JZ':  'opvc-jz',
    '115':      'olflex-classic-115-cy',
    'LiYCY':    'liycy',
    'LiYCY-JZ': 'liycy-jz',
    'H07V-K':   'h07v-k',
}

wb = openpyxl.load_workbook(XLSX)
result = {}

for sheet_name, slug in SHEET_SLUG.items():
    ws = wb[sheet_name]
    rows = list(ws.iter_rows(values_only=True))
    
    # Extract product URL from row 2 (index 1)
    product_url = None
    for cell in rows[1]:
        if cell and isinstance(cell, str) and 'nyxcable.com' in cell:
            product_url = cell
            break
    
    # Find header row (row 4 or 5 — contains "Part NO." or "Core x Conductor")
    header_idx = None
    for i, row in enumerate(rows):
        row_text = ' '.join(str(c) for c in row if c)
        if 'Part NO' in row_text or 'Core x Conductor' in row_text:
            header_idx = i
            break
    
    if header_idx is None:
        print(f"WARNING: No header found in sheet {sheet_name}")
        continue
    
    # Parse headers
    raw_headers = [str(c).strip() if c else '' for c in rows[header_idx]]
    
    # Next row may have sub-headers (e.g. "Size (mm2)")
    sub_headers = [str(c).strip() if c else '' for c in rows[header_idx + 1]] if header_idx + 1 < len(rows) else []
    
    # Merge headers with sub-headers
    headers = []
    for j in range(len(raw_headers)):
        h = raw_headers[j]
        if j < len(sub_headers) and sub_headers[j]:
            h = (h + ' ' + sub_headers[j]).strip()
        headers.append(h)
    
    # Determine column indices by matching known column names
    col_map = {}
    for j, h in enumerate(headers):
        hl = h.lower()
        if 'part no' in hl:
            col_map['partNo'] = j
        elif 'core' in hl and 'conductor' in hl:
            col_map['coreSize'] = j
        elif 'model' in hl:
            col_map['model'] = j
        elif 'strand' in hl or 'no. of strand' in hl:
            col_map['strands'] = j
        elif 'outer' in hl and 'dia' in hl:
            col_map['outerDia'] = j
        elif 'cu weight' in hl or 'cu wt' in hl:
            col_map['cuWeight'] = j
        elif 'weight' in hl and 'cu' not in hl:
            col_map['weight'] = j
        elif 'resistance' in hl:
            col_map['resistance'] = j
        elif any(k in hl for k in ['price', 'product price', 'baht']):
            col_map['price'] = j
        elif any(k in hl for k in ['link']):
            col_map['link'] = j
    
    # Also check for Thai price header
    for j, h in enumerate(headers):
        if j not in col_map.values():
            if any(k in h for k in ['ราคา', 'บาท']):
                col_map['price'] = j
    
    # Parse data rows (start from header_idx + 2)
    data_start = header_idx + 2
    items = []
    
    for i in range(data_start, len(rows)):
        row = rows[i]
        # Skip empty rows
        if not any(row):
            continue
        # Skip if no model/part data
        has_data = False
        for key in ['model', 'partNo', 'coreSize']:
            if key in col_map:
                val = row[col_map[key]] if col_map[key] < len(row) else None
                if val and str(val).strip():
                    has_data = True
                    break
        if not has_data:
            continue
        
        item = {}
        for key, j in col_map.items():
            if j < len(row) and row[j] is not None:
                val = row[j]
                if isinstance(val, float):
                    # Clean up float display
                    if val == int(val):
                        val = int(val)
                    else:
                        val = round(val, 4)
                item[key] = val
            else:
                item[key] = None
        
        # Convert all values to string for JSON consistency
        clean = {}
        for k, v in item.items():
            if v is not None:
                clean[k] = str(v)
            else:
                clean[k] = None
        
        items.append(clean)
    
    result[slug] = {
        'sheetName': sheet_name,
        'productUrl': product_url,
        'headers': headers,
        'columnMap': {k: headers[v] for k, v in col_map.items()},
        'items': items,
        'count': len(items),
    }
    
    print(f"  {sheet_name} ({slug}): {len(items)} items, {len(col_map)} columns mapped")

# Write output
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"\n✅ Written {len(result)} products to {OUT}")
print(f"   Total items: {sum(v['count'] for v in result.values())}")
