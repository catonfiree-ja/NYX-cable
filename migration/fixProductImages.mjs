/**
 * Fix product images: move `image` (singular) to `images` (array) field
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'sk53VR1KBUCe8pVqCKfQM4qRoELeLQnc9TRVy1vSEZIQTohrvagv2Gw95EXx9Viua8uu0wBal7UxTwQV07fo1hFn8rrLph7eePHwoNnXxoandZwQONOqfOTM9V4GJbDxjuahLebq4lJg9SuOkYua592MBbIcgTx6anwiL77kWeGjdyj6bHJP',
  useCdn: false,
})

async function main() {
  console.log('=== Fix Product Images: image → images[] ===\n')

  // Fetch all products that have `image` field but no `images` array
  const products = await client.fetch(`*[_type == "product" && defined(image)]{ _id, title, image, images }`)
  console.log(`Found ${products.length} products with 'image' field`)

  let fixed = 0
  for (const p of products) {
    // Skip if already has images array with content
    if (p.images && p.images.length > 0) {
      console.log(`SKIP (already has images[]): ${p.title}`)
      continue
    }

    // Move image → images[0]
    const imageItem = {
      _type: 'image',
      _key: 'migrated-' + Date.now(),
      asset: p.image.asset,
    }

    await client.patch(p._id)
      .set({ images: [imageItem] })
      .unset(['image'])
      .commit()

    console.log(`✅ Fixed: ${p.title}`)
    fixed++
  }

  // Also check products that already have images array but empty
  const emptyImages = await client.fetch(`*[_type == "product" && (!defined(images) || count(images) == 0) && defined(image)]{ _id, title, image }`)
  console.log(`\nProducts with empty images[] but has image: ${emptyImages.length}`)

  console.log(`\n=== Results ===`)
  console.log(`Fixed: ${fixed}`)
}

main().catch(console.error)
