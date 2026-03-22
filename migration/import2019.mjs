/**
 * Import 2019 photos using correct Thai filenames
 * Pattern: ส่งสินค้า-62_๒๑๐๑๑๔_N.jpg in /2021/02/
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

const BASE = 'https://nyxcable.com/wp-content/uploads/2021/02'

// Try indices 1-30 to cover all 21 with gaps
const urls = Array.from({length: 30}, (_, i) => 
  `${BASE}/${encodeURIComponent(`ส่งสินค้า-62_๒๑๐๑๑๔_${i+1}`)}.jpg`
)

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

async function main() {
  if (!process.env.SANITY_TOKEN) { console.error('Set SANITY_TOKEN!'); process.exit(1) }

  console.log('=== Importing 2019 photos ===')
  const photoRefs = []
  
  for (let i = 0; i < urls.length; i++) {
    const buf = await downloadBuffer(urls[i])
    if (!buf || buf.length < 1000) continue
    
    const fn = decodeURIComponent(urls[i].split('/').pop())
    console.log(`  [${photoRefs.length+1}] ${fn}... ${Math.round(buf.length/1024)}KB`)
    
    const asset = await client.assets.upload('image', buf, {
      filename: `delivery-2019-${photoRefs.length+1}.jpg`,
    })
    
    photoRefs.push({
      _type: 'image',
      _key: `photo-${photoRefs.length}`,
      asset: { _type: 'reference', _ref: asset._id },
    })
    
    await new Promise(r => setTimeout(r, 150))
  }
  
  if (photoRefs.length > 0) {
    await client.patch('gallery-delivery-2019').set({ photos: photoRefs }).commit()
    console.log(`\n✅ 2019: ${photoRefs.length} photos imported!`)
  } else {
    console.log('\n⚠️ No photos found')
  }
}

main().catch(console.error)
