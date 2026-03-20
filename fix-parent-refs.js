// Fix parentProduct references in variants.ndjson
const fs = require('fs')

// Load products
const pLines = fs.readFileSync('migration/products.ndjson', 'utf8').split('\n').filter(l => l.trim())
const products = pLines.map(l => JSON.parse(l)).filter(p => p._type === 'product')
console.log(`Loaded ${products.length} products`)

// Load variants
const vLines = fs.readFileSync('migration/variants.ndjson', 'utf8').split('\n').filter(l => l.trim())
const variants = vLines.map(l => JSON.parse(l)).filter(v => v._type === 'productVariant')
console.log(`Loaded ${variants.length} variants`)

// Sort products by productCode length desc for best match
const byCode = [...products].sort((a, b) => (b.productCode?.length || 0) - (a.productCode?.length || 0))
const byTitle = [...products].sort((a, b) => (b.title?.length || 0) - (a.title?.length || 0))

let matched = 0, unmatched = 0
const fixed = []

for (const v of variants) {
  const vTitle = (v.title || v.model || '').toUpperCase()
  let parentId = null

  // 1. Match by productCode
  for (const p of byCode) {
    const code = (p.productCode || '').toUpperCase()
    if (code && code.length > 2 && vTitle.startsWith(code)) {
      parentId = p._id
      break
    }
  }

  // 2. Match by product title
  if (!parentId) {
    for (const p of byTitle) {
      const pTitle = (p.title || '').toUpperCase()
      if (pTitle && pTitle.length > 2 && vTitle.startsWith(pTitle)) {
        parentId = p._id
        break
      }
    }
  }

  // 3. YSLY-OZ → YSLY-JZ
  if (!parentId && vTitle.startsWith('YSLY-OZ')) {
    const yslyJz = products.find(p => p.productCode === 'YSLY-JZ')
    if (yslyJz) parentId = yslyJz._id
  }

  if (parentId) {
    v.parentProduct = { _type: 'reference', _ref: parentId }
    matched++
  } else {
    console.log(`  UNMATCHED: "${v.title}" (${v._id})`)
    unmatched++
  }
  fixed.push(v)
}

console.log(`\nMatched: ${matched}, Unmatched: ${unmatched}`)
const output = fixed.map(v => JSON.stringify(v)).join('\n')
fs.writeFileSync('migration/variants-fixed.ndjson', output)
console.log('Written to migration/variants-fixed.ndjson')
