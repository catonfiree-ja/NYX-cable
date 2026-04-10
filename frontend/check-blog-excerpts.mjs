// check-blog-excerpts.mjs
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skJ5kRM7I1M1vvpxPqnGUcwXMLfnMSzYhM9ee92f0dovI77y7EuvbzGjbQofg4ck1BXghdR47ExHM7wdjxhaUQpz6HGXRaYEUgeA6yRtRc579f55rUBADf0s7KPpyhO1zt1oAT9gFqiTo6GJRqRsYzDB81ZCiGJPNFWZ4rgY0qp7uCeUihs9',
  useCdn: false
})

const posts = await client.fetch(`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "bodyFirst2": body[0..1]
  }
`)

for (const p of posts) {
  console.log(`\n=== ${p.title} ===`)
  console.log(`Slug: ${p.slug?.current}`)
  console.log(`Excerpt JS type: ${typeof p.excerpt}`)
  console.log(`Excerpt isArray: ${Array.isArray(p.excerpt)}`)
  
  if (typeof p.excerpt === 'string') {
    console.log(`Excerpt: ${p.excerpt.substring(0, 120)}`)
  } else if (Array.isArray(p.excerpt)) {
    console.log(`Excerpt blocks: ${p.excerpt.length}`)
    p.excerpt.slice(0, 3).forEach((b, i) => {
      console.log(`  [${i}] _type=${b._type} style=${b.style} children=${b.children ? b.children.length : 'none'}`)
      if (b.children) {
        const text = b.children.map(c => c.text || '').join('')
        if (text) console.log(`      text: ${text.substring(0, 80)}`)
      }
    })
  } else {
    console.log(`Excerpt: ${JSON.stringify(p.excerpt)?.substring(0, 200)}`)
  }
}
