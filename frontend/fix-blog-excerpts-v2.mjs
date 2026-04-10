// fix-blog-excerpts-v2.mjs — ลบ h1/p/div tags ที่ค้างกลางประโยค
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
    excerpt
  }
`)

// Remove stray HTML tag names anywhere in the string
const htmlTagPattern = /\b(div|blockquote|h[1-6]|span|ul|ol|li|thead|tbody|tr|td|th|table|section|article|header|footer|nav|figure|figcaption)\b/gi

function cleanExcerpt(raw) {
  if (!raw || typeof raw !== 'string') return null
  
  let cleaned = raw
  // Remove standalone "p" only when surrounded by spaces (avoid removing from words like "pvc")
  cleaned = cleaned.replace(/\s+p\s+/g, ' ')
  // Remove other HTML tag names
  cleaned = cleaned.replace(htmlTagPattern, '')
  // Remove "สรุปเนื้อหา" label
  cleaned = cleaned.replace(/สรุปเนื้อหา/g, '')
  // Collapse multiple spaces
  cleaned = cleaned.replace(/\s{2,}/g, ' ').trim()
  // Remove leading/trailing dots
  cleaned = cleaned.replace(/^\.+|\.+$/g, '').trim()
  
  return cleaned
}

console.log('=== Blog Excerpt Cleanup V2 ===\n')

let count = 0
for (const post of posts) {
  if (!post.excerpt || typeof post.excerpt !== 'string') continue
  
  const cleaned = cleanExcerpt(post.excerpt)
  if (cleaned !== post.excerpt && cleaned) {
    console.log(`✏️  ${post.title}`)
    console.log(`   BEFORE: ${post.excerpt.substring(0, 120)}`)
    console.log(`   AFTER:  ${cleaned.substring(0, 120)}`)
    console.log()
    await client.patch(post._id).set({ excerpt: cleaned }).commit()
    console.log(`   ✅ Updated!`)
    count++
  }
}

if (count === 0) {
  console.log('✅ All excerpts are already clean!')
} else {
  console.log(`\n🎉 Fixed ${count} posts.`)
}
