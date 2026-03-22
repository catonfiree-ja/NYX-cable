/**
 * Import photos for the 3 remaining albums (2018, 2017, ทำบุญ)
 * Using correct URLs discovered from DOM inspection
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

const albumPhotos = {
  'delivery-2018': {
    sanityId: 'gallery-delivery-2018',
    urls: [
      // LiYCY pattern files in /2018/12/
      ...Array.from({length: 50}, (_, i) => `${BASE}/2018/12/LiYCY-${i+1}.jpg`),
      ...Array.from({length: 50}, (_, i) => `${BASE}/2018/12/LiYCY-${i+1}-1.jpg`),
    ]
  },
  'delivery-2017': {
    sanityId: 'gallery-delivery-2017',
    urls: [
      // Mix of LiYCY, สายคอนโทรล, Belden, VCT, THW, CVV patterns
      ...Array.from({length: 30}, (_, i) => `${BASE}/2018/12/LiYCY-${i+1}-1.jpg`),
      ...Array.from({length: 30}, (_, i) => `${BASE}/2018/12/%E0%B8%AA%E0%B8%B2%E0%B8%A2%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%82%E0%B8%97%E0%B8%A3%E0%B8%A5-${i+1}.jpg`),
      ...Array.from({length: 15}, (_, i) => `${BASE}/2018/12/Belden-${i+30}.jpg`),
      ...Array.from({length: 10}, (_, i) => `${BASE}/2017/08/CVV-${i+1}-1.jpg`),
      ...Array.from({length: 10}, (_, i) => `${BASE}/2017/08/VCT-${i+1}-1.jpg`),
      ...Array.from({length: 10}, (_, i) => `${BASE}/2017/08/THW-${i+1}-1.jpg`),
      ...Array.from({length: 10}, (_, i) => `${BASE}/2017/08/LiYCY-${i+1}-1.jpg`),
    ]
  },
  'merit-ceremony': {
    sanityId: 'gallery-merit-ceremony',
    urls: [
      `${BASE}/2025/04/P1224310_0.jpg`,
      `${BASE}/2025/04/P1224289_0.jpg`,
      `${BASE}/2025/04/P1224284_0.jpg`,
      `${BASE}/2025/04/P1214107_0.jpg`,
      `${BASE}/2025/04/DSC03552_0.jpg`,
      `${BASE}/2025/04/P1214147_0.jpg`,
    ]
  },
}

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
        return downloadBuffer(res.headers.location).then(resolve).catch(reject)
      if (res.statusCode !== 200) { resolve(null); return }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    }).on('error', () => resolve(null))
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  if (!process.env.SANITY_TOKEN) { console.error('Set SANITY_TOKEN!'); process.exit(1) }

  const seenHashes = new Set()

  for (const [slug, config] of Object.entries(albumPhotos)) {
    console.log(`\n========== ${slug} ==========`)
    const photoRefs = []
    
    for (let i = 0; i < config.urls.length; i++) {
      const url = config.urls[i]
      const fn = decodeURIComponent(url.split('/').pop())
      
      const buf = await downloadBuffer(url)
      if (!buf || buf.length < 1000) continue
      
      // Simple dedup by size
      const key = `${slug}-${buf.length}`
      if (seenHashes.has(key)) continue
      seenHashes.add(key)
      
      process.stdout.write(`  [${photoRefs.length+1}] ${fn.substring(0, 35)}... ${Math.round(buf.length/1024)}KB\n`)
      
      const asset = await client.assets.upload('image', buf, {
        filename: `${slug}-${photoRefs.length+1}.jpg`,
      })
      
      photoRefs.push({
        _type: 'image',
        _key: `photo-${photoRefs.length}`,
        asset: { _type: 'reference', _ref: asset._id },
      })
      
      await sleep(200)
    }
    
    if (photoRefs.length > 0) {
      console.log(`  Saving ${photoRefs.length} photos...`)
      await client.patch(config.sanityId)
        .set({ photos: photoRefs })
        .commit()
      console.log(`  ✅ ${slug}: ${photoRefs.length} photos!`)
    } else {
      console.log(`  ⚠️ No photos for ${slug}`)
    }
  }
  
  console.log('\n🎉 Done!')
}

main().catch(console.error)
