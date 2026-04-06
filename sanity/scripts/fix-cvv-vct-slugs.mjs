/**
 * Fix slugs for CVV and VCT products in Sanity CMS
 * These products exist in CMS but with different slugs than the hardcoded data
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
  console.log('=== Checking CVV and VCT slugs in CMS ===\n')

  // Find products that might be CVV and VCT
  const products = await client.fetch(`
    *[_type == "product" && (
      title match "CVV*" || title match "VCT*" || 
      productCode match "CVV*" || productCode match "VCT*"
    )] {
      _id,
      title,
      slug,
      productCode
    }
  `)

  console.log('Found products:')
  for (const p of products) {
    console.log(`  - ${p.title} | slug: ${p.slug?.current} | code: ${p.productCode}`)
  }

  // Fix slugs
  const transaction = client.transaction()
  let updated = 0

  for (const p of products) {
    const currentSlug = p.slug?.current || ''
    
    // CVV product — should be slug "cvv"
    if ((p.title?.includes('CVV') && !p.title?.includes('CVV-S')) && currentSlug !== 'cvv' && currentSlug !== 'cvv-s') {
      console.log(`\n  Fixing: "${p.title}" slug "${currentSlug}" → "cvv"`)
      transaction.patch(p._id, patch => patch.set({ 
        'slug.current': 'cvv',
        orderRank: 6  // matches hardcoded position (6th in control-cable)
      }))
      updated++
    }
    
    // VCT product — should be slug "vct"
    if (p.title?.includes('VCT') && !p.title?.includes('VCT-S') && currentSlug !== 'vct') {
      console.log(`\n  Fixing: "${p.title}" slug "${currentSlug}" → "vct"`)
      transaction.patch(p._id, patch => patch.set({ 
        'slug.current': 'vct',
        orderRank: 7  // matches hardcoded position (7th in control-cable)
      }))
      updated++
    }
  }

  if (updated > 0) {
    console.log(`\n--- Committing ${updated} slug fixes ---`)
    await transaction.commit()
    console.log('✅ Done! Slugs fixed.')
  } else {
    console.log('\n⚠️  No slugs to fix. Please check the product titles manually in Sanity Studio.')
    console.log('   Expected: products with "CVV" and "VCT" in the title')
  }
}

main().catch(err => {
  console.error('Failed:', err)
  process.exit(1)
})
