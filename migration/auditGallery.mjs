/**
 * Audit: Check photo counts in Sanity vs expected
 * Then import missing 2019 photos
 */
import { createClient } from '@sanity/client'
import https from 'https'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

const BASE = 'https://nyxcable.com/wp-content/uploads'

async function main() {
  if (!process.env.SANITY_TOKEN) { console.error('Set SANITY_TOKEN!'); process.exit(1) }

  // 1. Audit current Sanity photo counts
  console.log('=== SANITY AUDIT ===')
  const albums = await client.fetch(`*[_type == "galleryAlbum"] | order(orderRank asc) { _id, title, "photoCount": count(photos), linkUrl }`)
  
  // Expected from WordPress
  const expected = {
    'gallery-delivery-2025': { label: '2025', expected: 0, note: 'Facebook link' },
    'gallery-delivery-2024': { label: '2024', expected: 50 },
    'gallery-delivery-2023': { label: '2023', expected: 50 },
    'gallery-delivery-2022': { label: '2022', expected: 80 },
    'gallery-delivery-2021': { label: '2021', expected: 46 },
    'gallery-delivery-2020': { label: '2020', expected: 110 },
    'gallery-delivery-2019': { label: '2019', expected: 21 },
    'gallery-delivery-2018': { label: '2018', expected: 72 },
    'gallery-delivery-2017': { label: '2017', expected: 68 },
    'gallery-profile-picture': { label: 'Profile', expected: 7 },
    'gallery-merit-ceremony': { label: 'ทำบุญ', expected: 6 },
  }
  
  const needsFix = []
  for (const album of albums) {
    const exp = expected[album._id]
    const actual = album.photoCount || 0
    const target = exp?.expected || '?'
    const status = actual >= target ? '✅' : '❌'
    console.log(`  ${status} ${album.title}: ${actual} photos (expected ${target})`)
    if (actual < target) {
      needsFix.push(album._id)
    }
  }
  
  // 2. Fix 2019 if needed
  if (needsFix.includes('gallery-delivery-2019')) {
    console.log('\n=== FIXING 2019 ===')
    const urls = Array.from({length: 21}, (_, i) => `${BASE}/2025/01/delivery_2019_${i+1}.jpg`)
    const photoRefs = []
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]
      const buf = await downloadBuffer(url)
      if (!buf || buf.length < 1000) {
        console.log(`  [${i+1}] SKIP 404`)
        continue
      }
      console.log(`  [${photoRefs.length+1}] delivery_2019_${i+1}.jpg... ${Math.round(buf.length/1024)}KB`)
      const asset = await client.assets.upload('image', buf, { filename: `delivery-2019-${photoRefs.length+1}.jpg` })
      photoRefs.push({
        _type: 'image',
        _key: `photo-${photoRefs.length}`,
        asset: { _type: 'reference', _ref: asset._id },
      })
      await new Promise(r => setTimeout(r, 150))
    }
    
    if (photoRefs.length > 0) {
      await client.patch('gallery-delivery-2019').set({ photos: photoRefs }).commit()
      console.log(`  ✅ 2019 fixed: ${photoRefs.length} photos!`)
    }
  }
  
  console.log('\n=== DONE ===')
}

function downloadBuffer(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
        return downloadBuffer(res.headers.location).then(resolve)
      if (res.statusCode !== 200) { resolve(null); return }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    }).on('error', () => resolve(null))
  })
}

main().catch(console.error)
