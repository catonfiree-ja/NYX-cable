import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Check ALL documents with multicore-cable slug
const products = await client.fetch(`*[_type == "product" && slug.current == "multicore-cable"]{
  _id, _rev, _createdAt, _updatedAt,
  title,
  "descBlockCount": count(description),
  "firstBlockText": description[0].children[0].text,
  "hasOldContent": defined(description) && count(description) > 0 && description[0].children[0].text match "*Multi-Core*"
}`)

console.log('=== ALL DOCUMENTS WITH slug "multicore-cable" ===')
console.log('Count:', products.length)
products.forEach((p, i) => {
  console.log(`\n--- Document ${i+1} ---`)
  console.log('ID:', p._id)
  console.log('Rev:', p._rev)
  console.log('Title:', p.title)
  console.log('Created:', p._createdAt)
  console.log('Updated:', p._updatedAt)
  console.log('Desc blocks:', p.descBlockCount)
  console.log('First text:', p.firstBlockText?.substring(0, 100))
  console.log('Has old content?', p.hasOldContent)
})

// Also check for draft versions
const drafts = await client.fetch(`*[_id in path("drafts.**") && _type == "product" && slug.current == "multicore-cable"]{
  _id, title, "descBlockCount": count(description),
  "firstBlockText": description[0].children[0].text
}`)
console.log('\n=== DRAFT DOCUMENTS ===')
console.log('Count:', drafts.length)
drafts.forEach((d, i) => {
  console.log(`Draft ${i+1}:`, d._id, '-', d.title, '- blocks:', d.descBlockCount)
  console.log('First text:', d.firstBlockText?.substring(0, 100))
})
