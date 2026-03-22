/**
 * Migrate product images from WordPress to Sanity
 * 1. Fetch all WP products with featured_media
 * 2. Fetch media URLs
 * 3. Download and upload to Sanity
 * 4. Update Sanity product documents with image references
 */
import { createClient } from '@sanity/client'
import https from 'https'
import http from 'http'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'sk53VR1KBUCe8pVqCKfQM4qRoELeLQnc9TRVy1vSEZIQTohrvagv2Gw95EXx9Viua8uu0wBal7UxTwQV07fo1hFn8rrLph7eePHwoNnXxoandZwQONOqfOTM9V4GJbDxjuahLebq4lJg9SuOkYua592MBbIcgTx6anwiL77kWeGjdyj6bHJP',
  useCdn: false,
})

// ─── Helpers ───
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => {
        try { resolve(JSON.parse(d)) }
        catch (e) { reject(new Error(`JSON parse error: ${d.substring(0, 200)}`)) }
      })
    }).on('error', reject)
  })
}

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    const doRequest = (reqUrl) => {
      mod.get(reqUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const rMod = res.headers.location.startsWith('https') ? https : http
          rMod.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
            const chunks = []
            res2.on('data', c => chunks.push(c))
            res2.on('end', () => resolve(Buffer.concat(chunks)))
          }).on('error', reject)
          return
        }
        const chunks = []
        res.on('data', c => chunks.push(c))
        res.on('end', () => resolve(Buffer.concat(chunks)))
      }).on('error', reject)
    }
    doRequest(url)
  })
}

async function uploadToSanity(buffer, filename) {
  const ext = filename.split('.').pop().toLowerCase()
  const type = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
  const asset = await client.assets.upload('image', buffer, { filename, contentType: type })
  return asset._id
}

// ─── Main ───
async function main() {
  console.log('=== Product Image Migration ===\n')

  // Step 1: Get all WP products (paginated)
  console.log('1. Fetching WP products...')
  let allWpProducts = []
  for (let page = 1; page <= 10; page++) {
    try {
      const products = await fetchJson(
        `https://nyxcable.com/wp-json/wp/v2/product?per_page=50&page=${page}&_fields=id,title,slug,featured_media`
      )
      if (!Array.isArray(products) || products.length === 0) break
      allWpProducts = allWpProducts.concat(products)
      console.log(`   Page ${page}: ${products.length} products`)
    } catch (e) {
      break
    }
  }
  console.log(`   Total WP products: ${allWpProducts.length}`)

  // Filter to only those with featured_media
  const withImages = allWpProducts.filter(p => p.featured_media > 0)
  console.log(`   With images: ${withImages.length}`)

  // Step 2: Get Sanity products for slug matching
  console.log('\n2. Fetching Sanity products...')
  const sanityProducts = await client.fetch(`*[_type == "product"]{ _id, title, slug, image }`)
  console.log(`   Sanity products: ${sanityProducts.length}`)

  // Create slug map
  const sanitySlugMap = {}
  for (const sp of sanityProducts) {
    if (sp.slug?.current) {
      sanitySlugMap[sp.slug.current] = sp
    }
  }

  // Step 3: For each WP product with image, download and upload
  console.log('\n3. Migrating images...')
  let migrated = 0
  let skipped = 0
  let noMatch = 0

  for (const wp of withImages) {
    const wpSlug = wp.slug
    const sanityProduct = sanitySlugMap[wpSlug]

    if (!sanityProduct) {
      console.log(`   SKIP (no Sanity match): ${wpSlug}`)
      noMatch++
      continue
    }

    // Check if already has image
    if (sanityProduct.image?.asset) {
      console.log(`   SKIP (already has image): ${wpSlug}`)
      skipped++
      continue
    }

    // Get media URL
    try {
      const media = await fetchJson(
        `https://nyxcable.com/wp-json/wp/v2/media/${wp.featured_media}?_fields=source_url,media_details`
      )
      const imageUrl = media.source_url
      if (!imageUrl) {
        console.log(`   SKIP (no source_url): ${wpSlug}`)
        skipped++
        continue
      }

      // Download
      console.log(`   Downloading: ${wpSlug} (${imageUrl.split('/').pop()})`)
      const buffer = await downloadBuffer(imageUrl)
      if (buffer.length < 1000) {
        console.log(`   SKIP (too small ${buffer.length}b): ${wpSlug}`)
        skipped++
        continue
      }

      // Upload to Sanity
      const filename = `product-${wpSlug}.${imageUrl.split('.').pop().split('?')[0] || 'jpg'}`
      const assetId = await uploadToSanity(buffer, filename)
      console.log(`   Uploaded: ${assetId}`)

      // Patch Sanity product
      await client.patch(sanityProduct._id).set({
        image: {
          _type: 'image',
          asset: { _type: 'reference', _ref: assetId }
        }
      }).commit()
      console.log(`   ✅ Updated: ${wpSlug}`)
      migrated++

      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 500))
    } catch (e) {
      console.log(`   ❌ Error: ${wpSlug}: ${e.message}`)
    }
  }

  console.log(`\n=== Results ===`)
  console.log(`Migrated: ${migrated}`)
  console.log(`Skipped (already has image): ${skipped}`)
  console.log(`No Sanity match: ${noMatch}`)
  console.log(`Total WP products with images: ${withImages.length}`)
}

main().catch(console.error)
