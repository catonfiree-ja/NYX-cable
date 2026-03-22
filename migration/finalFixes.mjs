/**
 * Fix remaining products:
 * 1. Try to find matching WP images for products without images
 * 2. Fix Shielded Cable category assignment (0 products)
 */
import { createClient } from '@sanity/client'
import https from 'https'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'sk53VR1KBUCe8pVqCKfQM4qRoELeLQnc9TRVy1vSEZIQTohrvagv2Gw95EXx9Viua8uu0wBal7UxTwQV07fo1hFn8rrLph7eePHwoNnXxoandZwQONOqfOTM9V4GJbDxjuahLebq4lJg9SuOkYua592MBbIcgTx6anwiL77kWeGjdyj6bHJP',
  useCdn: false,
})

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
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
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
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
  })
}

async function main() {
  console.log('=== Final Fixes ===\n')

  // ─── Part 1: Fix "control-cable" product image ───
  // The WP slug was encoded in Thai, so let's manually find it
  console.log('1. Fixing products without images...')
  
  // Try WP products with Thai slugs
  const wpProducts = await fetchJson('https://nyxcable.com/wp-json/wp/v2/product?per_page=50&page=1&_fields=id,title,slug,featured_media')
  const wpProducts2 = await fetchJson('https://nyxcable.com/wp-json/wp/v2/product?per_page=50&page=2&_fields=id,title,slug,featured_media')
  const allWp = [...wpProducts, ...wpProducts2]
  
  // Find the 2 Thai-slug WP products
  const thaiWp = allWp.filter(p => p.slug.startsWith('%'))
  console.log(`Thai-slug WP products: ${thaiWp.length}`)
  for (const wp of thaiWp) {
    console.log(`  WP: ${decodeURIComponent(wp.slug)} → featured_media: ${wp.featured_media}`)
    if (wp.featured_media > 0) {
      const media = await fetchJson(`https://nyxcable.com/wp-json/wp/v2/media/${wp.featured_media}?_fields=source_url`)
      console.log(`  Image URL: ${media.source_url}`)
    }
  }

  // For "control-cable" and "multicore-cable" — these have WP images but slug mismatch
  // Let's find the WP product for สายคอนโทรล and สายมัลติคอร์
  const controlWp = thaiWp.find(p => decodeURIComponent(p.slug).includes('คอนโทรล'))
  const multicoreWp = thaiWp.find(p => decodeURIComponent(p.slug).includes('มัลติ'))
  
  // Upload images for the 4 remaining products
  const productsToFix = await client.fetch(`*[_type == "product" && (!defined(images) || count(images) == 0)]{ _id, title, slug }`)
  
  for (const product of productsToFix) {
    const slug = product.slug?.current
    let imageUrl = null
    
    // Try matching with WP Thai slug products
    if (slug === 'control-cable' && controlWp?.featured_media > 0) {
      const media = await fetchJson(`https://nyxcable.com/wp-json/wp/v2/media/${controlWp.featured_media}?_fields=source_url`)
      imageUrl = media.source_url
    } else if (slug === 'multicore-cable' && multicoreWp?.featured_media > 0) {
      const media = await fetchJson(`https://nyxcable.com/wp-json/wp/v2/media/${multicoreWp.featured_media}?_fields=source_url`)
      imageUrl = media.source_url
    }
    
    // For VCT and CVV — these are newer products, try finding on WP
    if (!imageUrl) {
      const wpMatch = allWp.find(w => w.slug === slug && w.featured_media > 0)
      if (wpMatch) {
        const media = await fetchJson(`https://nyxcable.com/wp-json/wp/v2/media/${wpMatch.featured_media}?_fields=source_url`)
        imageUrl = media.source_url
      }
    }
    
    if (imageUrl) {
      console.log(`  Downloading image for ${slug}: ${imageUrl.split('/').pop()}`)
      try {
        const buffer = await downloadBuffer(imageUrl)
        const filename = `product-${slug}.${imageUrl.split('.').pop().split('?')[0] || 'jpg'}`
        const asset = await client.assets.upload('image', buffer, { filename, contentType: 'image/jpeg' })
        await client.patch(product._id).set({
          images: [{ _type: 'image', _key: 'img-' + Date.now(), asset: { _type: 'reference', _ref: asset._id } }]
        }).commit()
        console.log(`  ✅ Fixed image: ${slug}`)
      } catch (e) {
        console.log(`  ❌ Error: ${slug}: ${e.message}`)
      }
    } else {
      console.log(`  ⚠ No WP image found for: ${slug} — skipping`)
    }
  }

  // ─── Part 2: Fix Shielded Cable category (0 products) ───
  console.log('\n2. Fixing Shielded Cable category assignments...')
  
  const shieldedCat = await client.fetch(`*[_type == "productCategory" && slug.current == "shielded-cable"][0]{ _id, title }`)
  if (shieldedCat) {
    console.log(`  Found category: ${shieldedCat.title} (${shieldedCat._id})`)
    
    // These products should be in "Shielded Cable": LiYCY, LiYCY-JZ, Double Shield, Olflex 115 CY, YC11Y-JZ
    const shieldedProducts = await client.fetch(
      `*[_type == "product" && (
        title match "*ชีลด์*" ||
        title match "*LiYCY*" ||
        title match "*Shield*" ||
        title match "*115 CY*" ||
        title match "*YC11Y*"
      )]{ _id, title, slug, "cats": categories[]->slug.current }`
    )
    console.log(`  Products that should be shielded: ${shieldedProducts.length}`)
    
    for (const p of shieldedProducts) {
      if (p.cats?.includes('shielded-cable')) {
        console.log(`    SKIP (already in shielded-cable): ${p.title}`)
        continue
      }
      // Add shielded-cable category reference
      await client.patch(p._id).setIfMissing({ categories: [] }).append('categories', [
        { _type: 'reference', _ref: shieldedCat._id, _key: 'shielded-' + Date.now() }
      ]).commit()
      console.log(`    ✅ Added to shielded-cable: ${p.title}`)
      await new Promise(r => setTimeout(r, 200))
    }
  }

  // ─── Part 3: Fix other empty categories ───
  console.log('\n3. Checking other empty categories...')
  const emptyCats = await client.fetch(`*[_type == "productCategory" && count(*[_type == "product" && references(^._id)]) == 0]{ _id, title, slug }`)
  console.log(`  Empty categories: ${emptyCats.length}`)
  emptyCats.forEach(c => console.log(`    - ${c.title} (${c.slug?.current})`))
  
  // Fix "resistant-cable" by adding heat-resistant + oil-resistant products
  const resistantCat = emptyCats.find(c => c.slug?.current === 'resistant-cable')
  if (resistantCat) {
    const resistantProducts = await client.fetch(
      `*[_type == "product" && (
        title match "*ทนความร้อน*" ||
        title match "*ทนสารเคมี*" ||
        title match "*ทนน้ำมัน*"
      )]{ _id, title, "cats": categories[]->slug.current }`
    )
    for (const p of resistantProducts) {
      if (p.cats?.includes('resistant-cable')) continue
      await client.patch(p._id).setIfMissing({ categories: [] }).append('categories', [
        { _type: 'reference', _ref: resistantCat._id, _key: 'resistant-' + Date.now() }
      ]).commit()
      console.log(`    ✅ Added to resistant-cable: ${p.title}`)
      await new Promise(r => setTimeout(r, 200))
    }
  }

  // Fix "vsf" (H05V-K / H07V-K) category
  const vsfCat = emptyCats.find(c => c.slug?.current === 'vsf')
  if (vsfCat) {
    const vsfProducts = await client.fetch(
      `*[_type == "product" && (
        title match "*H05V*" ||
        title match "*H07V*"
      )]{ _id, title, "cats": categories[]->slug.current }`
    )
    for (const p of vsfProducts) {
      if (p.cats?.includes('vsf')) continue
      await client.patch(p._id).setIfMissing({ categories: [] }).append('categories', [
        { _type: 'reference', _ref: vsfCat._id, _key: 'vsf-' + Date.now() }
      ]).commit()
      console.log(`    ✅ Added to vsf: ${p.title}`)
      await new Promise(r => setTimeout(r, 200))
    }
  }

  console.log('\n=== Done ===')
}

main().catch(console.error)
