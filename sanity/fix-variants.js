/**
 * Fix Variant Parent References
 * 
 * This script links orphan productVariant documents to their parent products
 * by matching variant titles (e.g., "YSLY-JZ 3G0.5") to product slugs/titles.
 * 
 * Usage:
 *   1. Get a Sanity API token from https://www.sanity.io/manage/project/30wikoy9/api#tokens
 *   2. Run: node fix-variants.js YOUR_TOKEN_HERE
 */

const PROJECT_ID = '30wikoy9'
const DATASET = 'production'
const API_VERSION = '2024-01-01'
const TOKEN = process.argv[2]

if (!TOKEN) {
  console.error('Usage: node fix-variants.js YOUR_SANITY_TOKEN')
  console.error('')
  console.error('Get a token from: https://www.sanity.io/manage/project/30wikoy9/api#tokens')
  console.error('Create a token with "Editor" permissions.')
  process.exit(1)
}

const BASE = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data`

async function query(groq) {
  const url = `${BASE}/query/${DATASET}?query=${encodeURIComponent(groq)}`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } })
  const json = await res.json()
  return json.result
}

async function mutate(mutations) {
  const url = `${BASE}/mutate/${DATASET}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  })
  return res.json()
}

async function main() {
  console.log('=== Fix Variant Parent References ===\n')

  // 1. Fetch all products
  console.log('Fetching products...')
  const products = await query('*[_type == "product"]{_id, title, "slug": slug.current}')
  console.log(`Found ${products.length} products`)

  // 2. Fetch all orphan variants (no parentProduct)
  console.log('Fetching orphan variants...')
  const variants = await query('*[_type == "productVariant" && !defined(parentProduct)]{_id, title, "slug": slug.current}')
  console.log(`Found ${variants.length} orphan variants\n`)

  if (variants.length === 0) {
    console.log('No orphan variants found! All variants already have parent references.')
    return
  }

  // 3. Match variants to products by title prefix
  // Variant titles like "YSLY-JZ 3G0.5" → product slug "ysly-jz"
  const mutations = []
  let matched = 0
  let unmatched = 0

  for (const variant of variants) {
    const vTitle = (variant.title || '').toLowerCase()
    const vSlug = (variant.slug || '').toLowerCase()
    
    // Try matching product by finding product slug/title that is a prefix of the variant
    let bestMatch = null
    let bestLen = 0
    
    for (const product of products) {
      const pSlug = (product.slug || '').toLowerCase()
      const pTitle = (product.title || '').split(':')[0].trim().toLowerCase()
      
      // Check if variant slug starts with product slug
      if (vSlug.startsWith(pSlug) && pSlug.length > bestLen) {
        bestMatch = product
        bestLen = pSlug.length
      }
      // Check if variant title starts with product title  
      if (vTitle.startsWith(pTitle) && pTitle.length > bestLen) {
        bestMatch = product
        bestLen = pTitle.length
      }
    }
    
    if (bestMatch) {
      mutations.push({
        patch: {
          id: variant._id,
          set: {
            parentProduct: { _type: 'reference', _ref: bestMatch._id }
          }
        }
      })
      matched++
      console.log(`  ✓ ${variant.title} → ${bestMatch.title}`)
    } else {
      unmatched++
      console.log(`  ✗ ${variant.title} — NO MATCH`)
    }
  }

  console.log(`\nMatched: ${matched}, Unmatched: ${unmatched}`)

  if (mutations.length === 0) {
    console.log('No mutations to apply.')
    return
  }

  // 4. Apply mutations in batches of 50
  console.log(`\nApplying ${mutations.length} mutations...`)
  const BATCH = 50
  for (let i = 0; i < mutations.length; i += BATCH) {
    const batch = mutations.slice(i, i + BATCH)
    const result = await mutate(batch)
    if (result.results) {
      console.log(`  Batch ${Math.floor(i/BATCH) + 1}: ${batch.length} updated`)
    } else {
      console.error(`  Batch ${Math.floor(i/BATCH) + 1} FAILED:`, JSON.stringify(result))
    }
  }

  console.log('\n=== Done! ===')
}

main().catch(console.error)
