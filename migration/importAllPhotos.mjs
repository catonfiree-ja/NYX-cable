/**
 * Import ALL missing photos - expanded ranges based on real counts from WordPress
 * 2024: 50, 2023: 50, 2022: 80 (Thai filenames), 2021: 41+ (Thai), 2020: 116 (Thai), Profile: extra
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
  'delivery-2024': {
    sanityId: 'gallery-delivery-2024',
    urls: Array.from({length: 55}, (_, i) => `${BASE}/2025/01/delivery_2024_${i+1}.jpg`)
  },
  'delivery-2023': {
    sanityId: 'gallery-delivery-2023',
    urls: Array.from({length: 55}, (_, i) => `${BASE}/2025/01/delivery_2023_${i+1}.jpg`)
  },
  'delivery-2022': {
    sanityId: 'gallery-delivery-2022',
    urls: [
      // delivery_2022_N pattern
      ...Array.from({length: 30}, (_, i) => `${BASE}/2025/01/delivery_2022_${i+1}.jpg`),
      // Thai filename pattern: ส่งของ-2022-NN.jpg
      ...Array.from({length: 85}, (_, i) => {
        const n = String(i+1).padStart(2, '0')
        return `${BASE}/2023/03/${encodeURIComponent(`ส่งของ-2022-${n}`)}.jpg`
      }),
      // Also try without padding
      ...Array.from({length: 85}, (_, i) => `${BASE}/2023/03/${encodeURIComponent(`ส่งของ-2022-${i+1}`)}.jpg`),
    ]
  },
  'delivery-2021': {
    sanityId: 'gallery-delivery-2021',
    urls: [
      ...Array.from({length: 30}, (_, i) => `${BASE}/2025/01/delivery_2021_${i+1}.jpg`),
      // Thai patterns for 2021
      ...Array.from({length: 50}, (_, i) => `${BASE}/2021/10/${encodeURIComponent(`สายมัลติคอร์-${i+1}`)}.jpg`),
      ...Array.from({length: 50}, (_, i) => `${BASE}/2021/10/${encodeURIComponent(`สายคอนโทรล-${i+1}`)}.jpg`),
      ...Array.from({length: 30}, (_, i) => `${BASE}/2021/10/LiYCY-${i+1}.jpg`),
      ...Array.from({length: 20}, (_, i) => `${BASE}/2021/10/JZ-500-${i+1}.jpg`),
      ...Array.from({length: 20}, (_, i) => `${BASE}/2021/10/JZ500-${i+1}.jpg`),
    ]
  },
  'delivery-2020': {
    sanityId: 'gallery-delivery-2020',
    urls: [
      ...Array.from({length: 30}, (_, i) => `${BASE}/2025/01/delivery_2020_${i+1}.jpg`),
      // Thai patterns: ส่งของ-2020.1_๒๑๐๑๑๔_N.jpg
      ...Array.from({length: 120}, (_, i) => `${BASE}/2021/02/${encodeURIComponent(`ส่งของ-2020.1_๒๑๐๑๑๔_${i+1}`)}.jpg`),
      // Also try: ส่งของ-2020_N.jpg 
      ...Array.from({length: 120}, (_, i) => `${BASE}/2021/02/${encodeURIComponent(`ส่งของ-2020_${i+1}`)}.jpg`),
    ]
  },
  'profile-picture': {
    sanityId: 'gallery-profile-picture',
    urls: [
      `${BASE}/2024/12/LINE_ALBUM_201224_241220_1-scaled.jpg`,
      `${BASE}/2024/12/LINE_ALBUM_201224_241220_2-scaled.jpg`,
      `${BASE}/2024/12/LINE_ALBUM_201224_241220_3-scaled.jpg`,
      `${BASE}/2024/12/LINE_ALBUM_201224_241220_4-scaled.jpg`,
      `${BASE}/2024/12/LINE_ALBUM_201224_241220_5-scaled.jpg`,
      `${BASE}/2024/12/LINE_ALBUM_201224_241220_6-scaled.jpg`,
      `${BASE}/2024/12/LINE_ALBUM_201224_241220_7-scaled.jpg`,
      `${BASE}/2024/12/S__4472836.jpg`,
      `${BASE}/2024/12/S__4472836-scaled.jpg`,
      // Try 1024x768 versions
      `${BASE}/2024/12/LINE_ALBUM_201224_241220_1-1024x768.jpg`,
      `${BASE}/2024/12/LINE_ALBUM_201224_241220_2-1024x768.jpg`,
      `${BASE}/2024/12/LINE_ALBUM_201224_241220_3-1024x768.jpg`,
      `${BASE}/2024/12/LINE_ALBUM_201224_241220_4-1024x768.jpg`,
      `${BASE}/2024/12/LINE_ALBUM_201224_241220_5-1024x768.jpg`,
      `${BASE}/2024/12/LINE_ALBUM_201224_241220_6-1024x768.jpg`,
      `${BASE}/2024/12/LINE_ALBUM_201224_241220_7-1024x768.jpg`,
    ]
  },
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

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  if (!process.env.SANITY_TOKEN) { console.error('Set SANITY_TOKEN!'); process.exit(1) }

  for (const [slug, config] of Object.entries(albumPhotos)) {
    console.log(`\n========== ${slug} ==========`)
    const photoRefs = []
    const seen = new Set()
    let skipped = 0
    
    for (let i = 0; i < config.urls.length; i++) {
      const url = config.urls[i]
      
      const buf = await downloadBuffer(url)
      if (!buf || buf.length < 1000) { skipped++; continue }
      
      // Dedup by file size
      const key = buf.length
      if (seen.has(key)) { continue }
      seen.add(key)

      const fn = decodeURIComponent(url.split('/').pop())
      console.log(`  [${photoRefs.length+1}] ${fn.substring(0, 40)}... ${Math.round(buf.length/1024)}KB`)
      
      const asset = await client.assets.upload('image', buf, {
        filename: `${slug}-${photoRefs.length+1}.jpg`,
      })
      
      photoRefs.push({
        _type: 'image',
        _key: `photo-${photoRefs.length}`,
        asset: { _type: 'reference', _ref: asset._id },
      })
      
      await sleep(150)
    }
    
    if (photoRefs.length > 0) {
      console.log(`  💾 Saving ${photoRefs.length} photos (${skipped} 404s skipped)...`)
      await client.patch(config.sanityId)
        .set({ photos: photoRefs })
        .commit()
      console.log(`  ✅ ${slug}: ${photoRefs.length} photos!`)
    } else {
      console.log(`  ⚠️ No photos for ${slug} (${skipped} 404s)`)
    }
  }
  
  console.log('\n🎉 All albums re-imported!')
}

main().catch(console.error)
