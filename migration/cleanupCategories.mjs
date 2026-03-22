/**
 * Clean up over-broad category assignments and fix properly.
 * Only these products are truly "Shielded Cable":
 * - LiYCY, LiYCY-JZ, Olflex 115 CY, Double Shield, LiYCY(TP), YC11Y-JZ, Multiflex CY, Multiflex CP
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
  console.log('=== Category Cleanup ===\n')

  // Get category IDs
  const cats = await client.fetch(`*[_type == "productCategory"]{ _id, title, slug }`)
  const catMap = {}
  cats.forEach(c => { catMap[c.slug?.current] = c._id })
  
  const shieldedId = catMap['shielded-cable']
  const resistantId = catMap['resistant-cable']
  const vsfId = catMap['vsf']
  
  console.log(`Shielded Cable ID: ${shieldedId}`)
  console.log(`Resistant Cable ID: ${resistantId}`)
  console.log(`VSF ID: ${vsfId}`)

  // ─── Step 1: Remove shielded-cable from ALL products ───
  console.log('\n1. Removing shielded-cable from all products...')
  const allWithShielded = await client.fetch(
    `*[_type == "product" && references($catId)]{ _id, title, categories }`,
    { catId: shieldedId }
  )
  console.log(`  Products currently in shielded-cable: ${allWithShielded.length}`)
  
  for (const p of allWithShielded) {
    const newCats = (p.categories || []).filter(c => c._ref !== shieldedId)
    await client.patch(p._id).set({ categories: newCats }).commit()
  }
  console.log('  ✅ Cleared all')

  // ─── Step 2: Remove resistant-cable from ALL products ───
  console.log('\n2. Removing resistant-cable from all products...')
  const allWithResistant = await client.fetch(
    `*[_type == "product" && references($catId)]{ _id, title, categories }`,
    { catId: resistantId }
  )
  console.log(`  Products currently in resistant-cable: ${allWithResistant.length}`)
  
  for (const p of allWithResistant) {
    const newCats = (p.categories || []).filter(c => c._ref !== resistantId)
    await client.patch(p._id).set({ categories: newCats }).commit()
  }
  console.log('  ✅ Cleared all')

  // ─── Step 3: Properly assign shielded-cable ───
  // Only products that actually have shielding
  console.log('\n3. Properly assigning shielded-cable...')
  const shieldedSlugs = [
    'liycy', 'liycy-jz', 'olflex-classic-115-cy', 'double-shielded-cable',
    'rs485-rs422-liycy-tp', 'yc11y-jz', 'multiflex-cy', 'multiflex-cp',
    'rs485-rs422', 'rs485-rs422-sttp', 'rs485-rs422-belden', 'rs485-rs422-hosiwell'
  ]
  
  for (const slug of shieldedSlugs) {
    const product = await client.fetch(
      `*[_type == "product" && slug.current == $slug][0]{ _id, title }`,
      { slug }
    )
    if (!product) {
      console.log(`  SKIP (not found): ${slug}`)
      continue
    }
    await client.patch(product._id).setIfMissing({ categories: [] }).append('categories', [
      { _type: 'reference', _ref: shieldedId, _key: 'sc-' + Date.now() + slug.substring(0, 4) }
    ]).commit()
    console.log(`  ✅ ${product.title}`)
    await new Promise(r => setTimeout(r, 100))
  }

  // ─── Step 4: Properly assign resistant-cable ───
  // Only products that resist heat OR chemicals
  console.log('\n4. Properly assigning resistant-cable...')
  const resistantSlugs = [
    'sihf', 'sif', 'sif-gl', 'pfa-cable', 'siaf-ignition-wire',
    'y11y-jz', 'yc11y-jz'
  ]
  
  for (const slug of resistantSlugs) {
    const product = await client.fetch(
      `*[_type == "product" && slug.current == $slug][0]{ _id, title }`,
      { slug }
    )
    if (!product) {
      console.log(`  SKIP (not found): ${slug}`)
      continue
    }
    await client.patch(product._id).setIfMissing({ categories: [] }).append('categories', [
      { _type: 'reference', _ref: resistantId, _key: 'rc-' + Date.now() + slug.substring(0, 4) }
    ]).commit()
    console.log(`  ✅ ${product.title}`)
    await new Promise(r => setTimeout(r, 100))
  }

  // ─── Step 5: Verify VSF category ───
  console.log('\n5. Verifying VSF category...')
  const vsfCount = await client.fetch(`count(*[_type == "product" && references($catId)])`, { catId: vsfId })
  console.log(`  VSF products: ${vsfCount}`)

  // ─── Final check ───
  console.log('\n=== Final Category Counts ===')
  const finalCats = await client.fetch(`*[_type == "productCategory"]{ title, slug, "count": count(*[_type == "product" && references(^._id)]) } | order(count desc)`)
  finalCats.forEach(c => console.log(`  ${c.title} (${c.slug?.current}): ${c.count}`))
  
  const noImages = await client.fetch(`count(*[_type == "product" && (!defined(images) || count(images) == 0)])`)
  console.log(`\nProducts without images: ${noImages}`)
}

main().catch(console.error)
