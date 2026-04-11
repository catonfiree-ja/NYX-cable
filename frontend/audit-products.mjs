import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skJ5kRM7I1M1vvpxPqnGUcwXMLfnMSzYhM9ee92f0dovI77y7EuvbzGjbQofg4ck1BXghdR47ExHM7wdjxhaUQpz6HGXRaYEUgeA6yRtRc579f55rUBADf0s7KPpyhO1zt1oAT9gFqiTo6GJRqRsYzDB81ZCiGJPNFWZ4rgY0qp7uCeUihs9',
  useCdn: false,
})

async function main() {
  const products = await client.fetch(`
    *[_type == "product"] | order(orderRank asc) {
      _id, 
      title, 
      "slug": slug.current, 
      productCode,
      shortDescription,
      "descBlocks": count(description),
      "hasSpecTable": count(description[_type == "specTable"]) > 0,
      "descPreview": description[0..2][]{
        _type,
        "text": children[0].text,
        style
      }
    }
  `)

  console.log(`Total products: ${products.length}\n`)
  
  // Categorize products
  const noDesc = []
  const hasDesc = []
  const hasDirtyDesc = []

  const HTML_TAGS = new Set(['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'br', 'hr', 'img'])

  for (const p of products) {
    const descCount = p.descBlocks || 0
    
    // Check if description has dirty HTML tag text
    let isDirty = false
    if (p.descPreview) {
      for (const block of p.descPreview) {
        if (block._type === 'block' && block.text && HTML_TAGS.has(block.text.toLowerCase().trim())) {
          isDirty = true
          break
        }
      }
    }

    if (descCount === 0) {
      noDesc.push(p)
    } else if (isDirty) {
      hasDirtyDesc.push(p)
    } else {
      hasDesc.push(p)
    }
  }

  console.log(`=== ❌ NO Description (${noDesc.length}) ===`)
  noDesc.forEach(p => {
    const short = p.shortDescription ? '✓ short' : '✗ no short'
    console.log(`  ${p.slug} — ${p.title} [${short}]`)
  })

  console.log(`\n=== ⚠️ DIRTY Description - has HTML tag text (${hasDirtyDesc.length}) ===`)
  hasDirtyDesc.forEach(p => {
    const preview = p.descPreview?.map(b => `${b.style||b._type}:"${(b.text||'').substring(0,30)}"`).join(', ')
    console.log(`  ${p.slug} — ${p.descBlocks} blocks — ${preview}`)
  })

  console.log(`\n=== ✅ Has Description (${hasDesc.length}) ===`)
  hasDesc.forEach(p => {
    const hasSpec = p.hasSpecTable ? ' 📊specTable' : ''
    const preview = p.descPreview?.map(b => `${b.style||b._type}:"${(b.text||'').substring(0,30)}"`).join(', ')
    console.log(`  ${p.slug} — ${p.descBlocks} blocks${hasSpec} — ${preview}`)
  })

  // Print all slugs for scraping
  console.log(`\n=== ALL SLUGS (for scraping) ===`)
  const allSlugs = products.map(p => p.slug).filter(Boolean)
  console.log(JSON.stringify(allSlugs))
}

main().catch(console.error)
