/**
 * Migration Script: Set orderRank for all products based on hardcoded category-products.ts order
 * 
 * This ensures the website displays products in the EXACT same order after removing hardcoded data.
 * 
 * Usage:
 *   cd sanity
 *   node scripts/set-product-order.mjs
 * 
 * Requires: SANITY_TOKEN environment variable (or edit the token below)
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN, // needs write access
})

// ─── Current hardcoded product order per category (from category-products.ts) ───
// Format: { categorySlug: [productSlug1, productSlug2, ...] }
const categoryOrder = {
  'control-cable': [
    'ysly-jz', 'olflex-classic-110', 'jz-500', 'opvc-jz', 'flex-jz',
    'cvv', 'vct', 'multicore-cable', 'ysly-jz-1kv', 'control-cable', 'liyy-tp',
  ],
  'shielded-cable': [
    'liycy', 'liycy-jz', 'olflex-classic-115-cy', 'cvv-s',
    'double-shielded-cable', 'multiflex-cy',
  ],
  'twisted-pair-cable': [
    'rs485-rs422', 'rs485-rs422-sttp', 'rs485-rs422-belden',
    'rs485-rs422-hosiwell', 'rs485-rs422-liycy-tp',
  ],
  'water-resistant-cable': [
    'h07rn-f', 'welding-cable-h01n2d', 'nsshou', 'lift-1s', 'lift-2s', 'nsgafou',
  ],
  'wiring-cable': [
    'h05v-k', 'h07v-k',
  ],
  'high-flex-cable': [
    'nshtou', 'pur-hf', 'h07vvh6-f', 'ngflgou',
    'multiflex-y', 'multiflex-p', 'multiflex-cy', 'multiflex-cp',
    'ntscgewoeu', 'robot-cable',
  ],
  'industrial-bus-cable': [
    'profibus-cable', 'profibus-drag-chain', 'profibus-outdoor',
    'profibus-connector-90', 'profibus-connector-90pg',
    'profinet-type-a', 'profinet-type-b', 'profinet-type-c', 'profinet-connector-180',
    'cc-link', 'devicenet-thick', 'devicenet-thin', 'eib-bus-knx',
  ],
  'resistant-cable': [
    'sif', 'sif-gl', 'siaf-ignition-wire', 'sihf', 'pfa-cable',
    'thermocouple-type-k-cable', 'h07rn-f', 'y11y-jz', 'yc11y-jz',
  ],
}

// ─── Category order (matches current hardcoded order) ───
const categoryRankMap = {
  'control-cable': 1,
  'shielded-cable': 2,
  'twisted-pair-cable': 3,
  'water-resistant-cable': 4,
  'wiring-cable': 5,
  'high-flex-cable': 6,
  'industrial-bus-cable': 7,
  'resistant-cable': 8,
}

async function main() {
  console.log('=== Setting product orderRank based on hardcoded order ===\n')

  // Step 1: Build a global orderRank map (slug -> rank)
  // Products appearing in multiple categories get the rank from their FIRST appearance
  const slugRankMap = new Map()
  let globalRank = 1

  for (const [catSlug, productSlugs] of Object.entries(categoryOrder)) {
    for (const slug of productSlugs) {
      if (!slugRankMap.has(slug)) {
        slugRankMap.set(slug, globalRank)
      }
      globalRank++
    }
  }

  console.log(`Total unique products to rank: ${slugRankMap.size}`)

  // Step 2: Fetch all products from Sanity
  const products = await client.fetch(`*[_type == "product"]{ _id, title, slug, orderRank }`)
  console.log(`Products in CMS: ${products.length}\n`)

  // Step 3: Check for missing products
  const cmsSlugs = new Set(products.map(p => p.slug?.current).filter(Boolean))
  const missingInCMS = []
  for (const slug of slugRankMap.keys()) {
    if (!cmsSlugs.has(slug)) {
      missingInCMS.push(slug)
    }
  }

  if (missingInCMS.length > 0) {
    console.log('⚠️  WARNING: These hardcoded products are NOT in CMS:')
    missingInCMS.forEach(s => console.log(`   - ${s}`))
    console.log('\nThese products will disappear from the website after removing hardcoded data!')
    console.log('Please add them to Sanity CMS first, then re-run this script.\n')
  }

  // Step 4: Update orderRank for each product
  let updated = 0
  let skipped = 0
  const transaction = client.transaction()

  for (const product of products) {
    const slug = product.slug?.current
    if (!slug) continue

    const rank = slugRankMap.get(slug)
    if (rank !== undefined) {
      transaction.patch(product._id, p => p.set({ orderRank: rank }))
      console.log(`  ✅ ${slug} → orderRank: ${rank}`)
      updated++
    } else {
      // CMS-only product (not in hardcoded) — give it a high rank so it appears at the end
      const highRank = 900 + skipped
      transaction.patch(product._id, p => p.set({ orderRank: highRank }))
      console.log(`  📦 ${slug} → orderRank: ${highRank} (CMS-only, appended)`)
      skipped++
    }
  }

  // Step 5: Update category orderRank
  console.log('\n--- Updating category orderRank ---')
  const categories = await client.fetch(`*[_type == "productCategory"]{ _id, slug, title, orderRank }`)
  for (const cat of categories) {
    const catSlug = cat.slug?.current
    if (!catSlug) continue
    const rank = categoryRankMap[catSlug]
    if (rank !== undefined) {
      transaction.patch(cat._id, p => p.set({ orderRank: rank }))
      console.log(`  ✅ ${catSlug} → orderRank: ${rank}`)
    }
  }

  // Step 6: Commit
  console.log(`\n--- Committing ${updated} product updates + ${categories.length} category updates ---`)
  await transaction.commit()
  console.log('\n✅ Done! All orderRank values have been set.')
  
  if (missingInCMS.length > 0) {
    console.log(`\n⚠️  ${missingInCMS.length} products are missing from CMS. Add them before removing hardcoded data.`)
  } else {
    console.log('\n🎉 All hardcoded products exist in CMS. Safe to remove hardcoded data!')
  }
}

main().catch(err => {
  console.error('Failed:', err)
  process.exit(1)
})
