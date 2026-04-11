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
    *[_type == "product"] { _id, "slug": slug.current, description }
  `)

  let fixed = 0
  for (const p of products) {
    if (!Array.isArray(p.description)) continue

    const filtered = p.description.filter(b => {
      if (b._type !== 'block') return true
      const text = (b.children || []).map(c => c.text || '').join('').trim()
      return !text.includes('สินค้ามีในสต๊อกพร้อมส่ง')
    })

    if (filtered.length < p.description.length) {
      await client.patch(p._id).set({ description: filtered }).commit()
      console.log(`✅ ${p.slug} — removed`)
      fixed++
    }
  }

  console.log(`\n🎉 Done! Removed from ${fixed} products`)
}

main().catch(console.error)
