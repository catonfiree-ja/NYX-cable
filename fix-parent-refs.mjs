// Fix parentProduct references for all variants in Sanity
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN // needs write token
})

async function main() {
  // 1. Fetch all products
  const products = await client.fetch(`*[_type == "product"]{ _id, title, productCode, slug }`)
  console.log(`Found ${products.length} products`)

  // 2. Fetch all variants without parentProduct
  const variants = await client.fetch(`*[_type == "productVariant" && !defined(parentProduct)]{ _id, title, model, slug }`)
  console.log(`Found ${variants.length} orphan variants`)

  if (variants.length === 0) {
    console.log('No orphan variants found!')
    return
  }

  // 3. Build matching: variant title starts with product title or productCode
  // Sort products by title length DESC so longer matches win
  const sortedProducts = [...products].sort((a, b) => (b.title?.length || 0) - (a.title?.length || 0))

  let matched = 0
  let unmatched = 0
  const transaction = client.transaction()

  for (const v of variants) {
    const vTitle = (v.title || v.model || '').toUpperCase()
    let parentId = null

    // Try matching by productCode first (most reliable)
    for (const p of sortedProducts) {
      const code = (p.productCode || '').toUpperCase()
      if (code && code.length > 2 && vTitle.startsWith(code)) {
        parentId = p._id
        break
      }
    }

    // Fallback: try matching by product title
    if (!parentId) {
      for (const p of sortedProducts) {
        const pTitle = (p.title || '').toUpperCase()
        if (pTitle && pTitle.length > 2 && vTitle.startsWith(pTitle)) {
          parentId = p._id
          break
        }
      }
    }

    if (parentId) {
      transaction.patch(v._id, patch => 
        patch.set({ parentProduct: { _type: 'reference', _ref: parentId } })
      )
      matched++
    } else {
      console.log(`  UNMATCHED: ${v.title} (${v._id})`)
      unmatched++
    }
  }

  console.log(`\nMatched: ${matched}, Unmatched: ${unmatched}`)

  if (matched > 0) {
    console.log('Committing transaction...')
    const result = await transaction.commit()
    console.log(`Done! Patched ${matched} variants`)
  }
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
