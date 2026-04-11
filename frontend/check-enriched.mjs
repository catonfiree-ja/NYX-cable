import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skJ5kRM7I1M1vvpxPqnGUcwXMLfnMSzYhM9ee92f0dovI77y7EuvbzGjbQofg4ck1BXghdR47ExHM7wdjxhaUQpz6HGXRaYEUgeA6yRtRc579f55rUBADf0s7KPpyhO1zt1oAT9gFqiTo6GJRqRsYzDB81ZCiGJPNFWZ4rgY0qp7uCeUihs9',
  useCdn: false,
})

const CHECK = ['ysly-jz', 'olflex-classic-110', 'jz-500', 'opvc-jz', 'flex-jz']

async function main() {
  for (const slug of CHECK) {
    const p = await client.fetch(`*[_type == "product" && slug.current == $slug][0] {
      _id, title, "slug": slug.current, description
    }`, { slug })
    
    console.log(`\n${'='.repeat(70)}`)
    console.log(`${slug} — ${p.title}`)
    console.log(`${'='.repeat(70)}`)
    
    const blocks = p.description || []
    console.log(`Total: ${blocks.length} blocks`)
    
    let specTableCount = 0
    blocks.forEach((b, i) => {
      if (b._type === 'specTable') {
        specTableCount++
        const rows = b.rows || []
        const headers = b.headers || []
        console.log(`  [${i}] 📊 specTable: "${b.caption}" — ${headers.length} cols, ${rows.length} data rows`)
        if (headers.length > 0) console.log(`       Headers: ${JSON.stringify(headers)}`)
        if (rows.length > 0) console.log(`       Row 0: ${JSON.stringify(rows[0])}`)
        if (rows.length > 1) console.log(`       Row 1: ${JSON.stringify(rows[1])}`)
        if (rows.length > 5) console.log(`       ... ${rows.length - 2} more rows`)
      } else if (b._type === 'block') {
        const text = (b.children || []).map(c => c.text || '').join('')
        const style = b.style || 'normal'
        const list = b.listItem ? ` [${b.listItem}]` : ''
        console.log(`  [${i}] ${style}${list}: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`)
      }
    })
    
    if (specTableCount === 0) console.log(`\n  ⚠️ NO SPEC TABLES! Content may be incomplete.`)
    else console.log(`\n  ✅ ${specTableCount} spec table(s) included`)
  }
}

main().catch(console.error)
