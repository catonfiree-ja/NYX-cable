import json
d = json.load(open('frontend/data/product-specs.json', 'r', encoding='utf-8'))

# Check resistance formatting
jz = d['ysly-jz']['items']
print("=== Resistance format samples (YSLY-JZ) ===")
for i in jz[:5]:
    print("  " + i["coreSize"] + ": r=" + str(i["resistance"]))

print("\n=== Last 3 items (YSLY-JZ) ===")
for i in jz[-3:]:
    print("  " + i["coreSize"] + ": price=" + str(i["price"]) + " r=" + str(i["resistance"]))

# Check H07V-K
h = d['h07v-k']['items']
print("\n=== H07V-K (all 18) ===")
for i in h:
    print("  " + str(i["coreSize"]) + " | " + str(i["model"]) + " | price=" + str(i["price"]))

# Count summary
print("\n=== Final counts ===")
total = 0
for slug, data in d.items():
    count = data['count']
    total += count
    actual = len(data['items'])
    match = "OK" if count == actual else "MISMATCH"
    print("  " + slug + ": count=" + str(count) + " actual=" + str(actual) + " " + match)
print("  TOTAL: " + str(total))
