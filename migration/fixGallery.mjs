/**
 * Fix 3 albums with VISUALLY VERIFIED correct images:
 * - 2025: 38920 (warehouse workers) NOT P1224537 (that's the monk)
 * - 2023: ส่งของ-2022-13 (UNIC crane truck) NOT 38920 (that's 2025)
 * - ทำบุญ: P1224537 (monk drawing) NOT 38920 (that's 2025)
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

const fixes = [
  { title: 'ส่งสินค้า 2025', slug: 'delivery-2025', year: 2025, order: 1,
    coverUrl: 'https://nyxcable.com/wp-content/uploads/2024/09/38920-1024x768.jpg' },
  { title: 'ส่งสินค้า 2023', slug: 'delivery-2023', year: 2023, order: 3,
    coverUrl: 'https://nyxcable.com/wp-content/uploads/2023/03/%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B8%82%E0%B8%AD%E0%B8%87-2022-13.jpg' },
  { title: 'ทำบุญบริษัท', slug: 'merit-ceremony', year: null, order: 11,
    coverUrl: 'https://nyxcable.com/wp-content/uploads/2025/02/P1224537-1024x683.jpg' },
]

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
        return downloadBuffer(res.headers.location).then(resolve).catch(reject)
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    }).on('error', reject)
  })
}

async function main() {
  if (!process.env.SANITY_TOKEN) { console.error('Set SANITY_TOKEN!'); process.exit(1) }
  
  for (const album of fixes) {
    console.log(`Fixing: ${album.title}`)
    const fn = decodeURIComponent(album.coverUrl.split('/').pop())
    console.log(`  Using: ${fn}`)
    const buf = await downloadBuffer(album.coverUrl)
    console.log(`  Downloaded (${Math.round(buf.length / 1024)}KB)`)
    const asset = await client.assets.upload('image', buf, { filename: `${album.slug}-cover.jpg` })
    await client.createOrReplace({
      _id: `gallery-${album.slug}`,
      _type: 'galleryAlbum',
      title: album.title,
      slug: { _type: 'slug', current: album.slug },
      cover: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
      year: album.year,
      orderRank: album.order,
    })
    console.log(`  ✅ Fixed!\n`)
  }
  console.log('Done! 2025=warehouse, 2023=crane-truck, ทำบุญ=monk')
}

main().catch(console.error)
