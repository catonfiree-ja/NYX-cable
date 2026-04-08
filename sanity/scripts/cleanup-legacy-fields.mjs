/**
 * Cleanup Script: Remove legacy unknown fields from Sanity documents
 * 
 * These fields exist in the data but are no longer defined in the schema:
 * - Products: name, thaiName
 * - Product Variants: coreSize, partNumber, specifications
 * - Site Settings: line
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

async function main() {
  console.log('=== Cleaning up legacy unknown fields ===\n')

  const transaction = client.transaction()
  let totalFixed = 0

  // 1. Products: remove `name` and `thaiName`
  console.log('--- Products: removing name, thaiName ---')
  const products = await client.fetch(`*[_type == "product" && (defined(name) || defined(thaiName))]{ _id, title, name, thaiName }`)
  for (const p of products) {
    console.log(`  🧹 ${p.title} — removing: ${p.name ? 'name' : ''}${p.thaiName ? ' thaiName' : ''}`)
    const unsets = []
    if (p.name) unsets.push('name')
    if (p.thaiName) unsets.push('thaiName')
    transaction.patch(p._id, patch => patch.unset(unsets))
    totalFixed++
  }

  // 2. Product Variants: remove `coreSize`, `partNumber`, `specifications`
  console.log('\n--- Product Variants: removing coreSize, partNumber, specifications ---')
  const variants = await client.fetch(`*[_type == "productVariant" && (defined(coreSize) || defined(partNumber) || defined(specifications))]{ _id, title, coreSize, partNumber, specifications }`)
  for (const v of variants) {
    const fields = []
    if (v.coreSize !== undefined) fields.push('coreSize')
    if (v.partNumber !== undefined) fields.push('partNumber')
    if (v.specifications !== undefined) fields.push('specifications')
    console.log(`  🧹 ${v.title} — removing: ${fields.join(', ')}`)
    transaction.patch(v._id, patch => patch.unset(fields))
    totalFixed++
  }

  // 3. Site Settings: remove `line`
  console.log('\n--- Site Settings: removing line ---')
  const settings = await client.fetch(`*[_type == "siteSettings" && defined(line)]{ _id, line }`)
  for (const s of settings) {
    console.log(`  🧹 siteSettings — removing: line`)
    transaction.patch(s._id, patch => patch.unset(['line']))
    totalFixed++
  }

  if (totalFixed > 0) {
    console.log(`\n--- Committing ${totalFixed} document cleanups ---`)
    await transaction.commit()
    console.log('\n✅ Done! All legacy fields removed.')
  } else {
    console.log('\n✅ No legacy fields found — everything is clean!')
  }
}

main().catch(err => {
  console.error('Failed:', err)
  process.exit(1)
})
