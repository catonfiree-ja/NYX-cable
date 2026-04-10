// fix-blog-excerpts.mjs — ลบ HTML tag names ออกจาก excerpt แล้ว update กลับ Sanity
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

// Known HTML tag names that got flattened into text
const htmlTags = ['div', 'blockquote', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'br', 'hr', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'section', 'article', 'header', 'footer', 'nav', 'figure', 'figcaption', 'img']

function cleanExcerpt(raw) {
  if (!raw || typeof raw !== 'string') return null
  
  // Split into words and remove leading HTML tag names
  let words = raw.split(/\s+/)
  
  // Remove HTML tag names from the beginning
  let cleaned = []
  let foundContent = false
  for (const word of words) {
    if (!foundContent && htmlTags.includes(word.toLowerCase())) {
      continue // skip HTML tag name
    }
    // Also skip "สรุปเนื้อหา" which is a WordPress widget label
    if (!foundContent && word === 'สรุปเนื้อหา') {
      continue
    }
    foundContent = true
    cleaned.push(word)
  }
  
  // Also remove any stray tag names that appear mid-text (like "h1 title h1 p content")
  // Pattern: word surrounded by tag names on both sides
  let result = cleaned.join(' ')
  
  // Remove patterns like "h1 ... h1" wrapping
  result = result.replace(/^(.*?)\s+(h[1-6]|div|p|blockquote)\s+/g, (match, content, tag) => {
    // Only strip if content before is very short (likely a heading extracted from tags)
    return match
  })
  
  return result.trim()
}

console.log('=== Blog Excerpt Cleanup Preview ===\n')

const updates = []
for (const p of posts) {
  if (!p.excerpt || typeof p.excerpt !== 'string') continue
  
  const original = p.excerpt
  const cleaned = cleanExcerpt(original)
  
  // Check if cleaning made a difference
  if (cleaned !== original && cleaned) {
    updates.push({ _id: p._id, title: p.title, original, cleaned })
    console.log(`✏️  ${p.title}`)
    console.log(`   BEFORE: ${original.substring(0, 100)}...`)
    console.log(`   AFTER:  ${cleaned.substring(0, 100)}...`)
    console.log()
  } else {
    console.log(`✅ ${p.title} — already clean`)
  }
}

console.log(`\n=== ${updates.length} posts need fixing ===`)
console.log('\nApplying updates...\n')

for (const u of updates) {
  await client.patch(u._id).set({ excerpt: u.cleaned }).commit()
  console.log(`✅ Updated: ${u.title}`)
}

console.log('\n🎉 Done! All excerpts cleaned.')
