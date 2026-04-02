/**
 * NYX Cable — Upload Product Images to Sanity CDN
 * Downloads images from nyxcable.com and uploads them to Sanity,
 * then patches each product document with the image reference.
 * 
 * Usage: node scripts/migrate-images.mjs
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import http from 'http'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local
try {
  const envFile = readFileSync(resolve(__dirname, '../.env.local'), 'utf-8')
  envFile.split('\n').forEach(line => {
    const [key, ...val] = line.split('=')
    if (key && val.length) process.env[key.trim()] = val.join('=').trim()
  })
} catch {}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '30wikoy9',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
})

// ─── Read product data ───
const dataFile = readFileSync(resolve(__dirname, '../data/category-products.ts'), 'utf-8')

// Extract slug + image URL pairs
function extractProductImages(content) {
  const products = []
  const matches = [...content.matchAll(/slug:\s*'([^']+)'[\s\S]*?image:\s*'([^']+)'/g)]
  for (const m of matches) {
    products.push({ slug: m[1], imageUrl: m[2] })
  }
  return products
}

// Download image from URL → Buffer
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    protocol.get(url, { headers: { 'User-Agent': 'NYX-Migration/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`))
      }
      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

// Generate Alt text from slug
function slugToAlt(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) + ' - สายไฟ NYX Cable'
}

async function main() {
  const products = extractProductImages(dataFile)
  console.log(`🖼️  Found ${products.length} products with images\n`)

  // Deduplicate by URL (some products share the same image)
  const uniqueUrls = new Map()
  for (const p of products) {
    if (!uniqueUrls.has(p.imageUrl)) {
      uniqueUrls.set(p.imageUrl, [])
    }
    uniqueUrls.get(p.imageUrl).push(p.slug)
  }
  console.log(`📷 ${uniqueUrls.size} unique images to upload\n`)

  let uploaded = 0, failed = 0, skipped = 0

  for (const [imageUrl, slugs] of uniqueUrls) {
    const primarySlug = slugs[0]
    
    // Check if product already has an image
    const existing = await client.fetch(
      `*[_type == "product" && slug.current == $slug && defined(images) && length(images) > 0][0]._id`,
      { slug: primarySlug }
    )
    
    if (existing) {
      console.log(`  ✅ Already has image: ${primarySlug}`)
      skipped++
      continue
    }

    try {
      // Download image
      console.log(`  ⬇️  Downloading: ${primarySlug}...`)
      const buffer = await downloadImage(imageUrl)
      
      // Extract filename from URL
      const filename = imageUrl.split('/').pop() || `${primarySlug}.jpg`
      
      // Upload to Sanity CDN
      const asset = await client.assets.upload('image', buffer, {
        filename,
        title: slugToAlt(primarySlug),
      })
      
      // Patch all products that use this image
      for (const slug of slugs) {
        const productId = await client.fetch(
          `*[_type == "product" && slug.current == $slug][0]._id`,
          { slug }
        )
        if (!productId) continue
        
        await client.patch(productId).setIfMissing({ images: [] }).append('images', [{
          _type: 'image',
          _key: `img-${Date.now()}`,
          asset: { _type: 'reference', _ref: asset._id },
          alt: slugToAlt(slug),
        }]).commit()
      }
      
      console.log(`  ✨ Uploaded: ${primarySlug} → ${asset._id} (${slugs.length} products)`)
      uploaded++
    } catch (err) {
      console.log(`  ❌ Failed: ${primarySlug} — ${err.message}`)
      failed++
    }
    
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200))
  }

  console.log(`\n📊 Results: ${uploaded} uploaded, ${skipped} had images, ${failed} failed`)
}

main().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
