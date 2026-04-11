import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skJ5kRM7I1M1vvpxPqnGUcwXMLfnMSzYhM9ee92f0dovI77y7EuvbzGjbQofg4ck1BXghdR47ExHM7wdjxhaUQpz6HGXRaYEUgeA6yRtRc579f55rUBADf0s7KPpyhO1zt1oAT9gFqiTo6GJRqRsYzDB81ZCiGJPNFWZ4rgY0qp7uCeUihs9',
  useCdn: false,
})

// Check a set of representative products
const CHECK_SLUGS = ['ysly-jz', 'liycy', 'olflex-classic-115-cy', 'profibus-drag-chain', 'pur-hf', 'sif', 'multiflex-p', 'nsshou', 'profinet-type-b']

async function main() {
  for (const slug of CHECK_SLUGS) {
    const p = await client.fetch(`*[_type == "product" && slug.current == $slug][0] {
      _id, title, "slug": slug.current, shortDescription, description
    }`, { slug })
    
    if (!p) { console.log(`❌ ${slug} — NOT FOUND\n`); continue }
    
    console.log(`\n${'='.repeat(80)}`)
    console.log(`📦 ${slug} — ${p.title}`)
    console.log(`${'='.repeat(80)}`)
    
    // Short description
    const short = p.shortDescription || ''
    console.log(`\n📋 shortDescription (${short.length} chars):`)
    console.log(`  ${short.substring(0, 200)}${short.length > 200 ? '...' : ''}`)
    
    // Description blocks
    const blocks = p.description || []
    console.log(`\n📝 description: ${blocks.length} blocks`)
    blocks.forEach((b, i) => {
      if (b._type === 'block') {
        const text = (b.children || []).map(c => c.text || '').join('')
        const style = b.style || 'normal'
        const listItem = b.listItem ? ` [${b.listItem}]` : ''
        console.log(`  [${i}] ${style}${listItem}: ${text.substring(0, 120)}${text.length > 120 ? '...' : ''}`)
      } else {
        console.log(`  [${i}] ${b._type}: ${b.caption || ''}`)
      }
    })
    
    // Now scrape original site and show what's there
    try {
      const resp = await fetch(`https://nyxcable.com/product/${slug}/`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(10000),
      })
      const html = await resp.text()
      
      // Extract shortdescription div  
      const shortDescMatch = html.match(/<div[^>]*class="[^"]*woocommerce-product-details__short-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
      const shortDescHtml = shortDescMatch ? shortDescMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : ''
      
      // Extract Description tab
      const descTabMatch = html.match(/id="tab-description"[\s\S]*?<div[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i)
      const descTabHtml = descTabMatch ? descTabMatch[1].replace(/<[^>]+>/g, '\n').replace(/\s+/g, ' ').trim() : ''
      
      // Count total text content on page
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
      const bodyText = bodyMatch ? bodyMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : ''
      
      console.log(`\n🌐 Original site:`)
      console.log(`  Short desc: ${shortDescHtml.substring(0, 150)}${shortDescHtml.length > 150 ? '...' : ''}`)
      console.log(`  Desc tab: ${descTabHtml.substring(0, 200)}${descTabHtml.length > 200 ? '...' : ''}`)
      console.log(`  Desc tab length: ${descTabHtml.length} chars`)
    } catch (e) {
      console.log(`  🌐 Scrape failed: ${e.message}`)
    }
  }
}

main().catch(console.error)
