import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'sk53VR1KBUCe8pVqCKfQM4qRoELeLQnc9TRVy1vSEZIQTohrvagv2Gw95EXx9Viua8uu0wBal7UxTwQV07fo1hFn8rrLph7eePHwoNnXxoandZwQONOqfOTM9V4GJbDxjuahLebq4lJg9SuOkYua592MBbIcgTx6anwiL77kWeGjdyj6bHJP',
  useCdn: false,
})

async function main() {
  // Find products without images
  const noImages = await client.fetch(`*[_type == "product" && (!defined(images) || count(images) == 0)]{ _id, title, slug }`)
  console.log(`\nProducts WITHOUT images: ${noImages.length}`)
  noImages.forEach(p => console.log(`  - ${p.title} (${p.slug?.current})`))

  // Find products with images
  const withImages = await client.fetch(`*[_type == "product" && defined(images) && count(images) > 0]{ _id, title, slug }`)
  console.log(`\nProducts WITH images: ${withImages.length}`)

  // Find categories with product counts
  const cats = await client.fetch(`*[_type == "productCategory"]{ _id, title, slug, "productCount": count(*[_type == "product" && references(^._id)]) }`)
  console.log(`\nCategories (${cats.length}):`)
  cats.forEach(c => console.log(`  - ${c.title} (${c.slug?.current}): ${c.productCount} products`))
}

main().catch(console.error)
