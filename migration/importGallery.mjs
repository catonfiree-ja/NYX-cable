/**
 * Re-import gallery albums with CORRECTED image URLs
 * Verified from DOM inspection with visual confirmation
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

// CORRECTED mapping - verified by clicking each album on the original page
// and matching visible label to the loaded image
const albums = [
  { title: 'ส่งสินค้า 2025', slug: 'delivery-2025', year: 2025, order: 1,
    coverUrl: 'https://nyxcable.com/wp-content/uploads/2025/02/P1224537-1024x683.jpg' },
  { title: 'ส่งสินค้า 2024', slug: 'delivery-2024', year: 2024, order: 2,
    coverUrl: 'https://nyxcable.com/wp-content/uploads/2025/01/delivery_2024_11-1024x768.jpg' },
  { title: 'ส่งสินค้า 2023', slug: 'delivery-2023', year: 2023, order: 3,
    coverUrl: 'https://nyxcable.com/wp-content/uploads/2024/09/38920-1024x768.jpg' },
  { title: 'ส่งสินค้า 2022', slug: 'delivery-2022', year: 2022, order: 4,
    coverUrl: 'https://nyxcable.com/wp-content/uploads/2023/03/cover-2022.jpg' },
  { title: 'ส่งสินค้า 2021', slug: 'delivery-2021', year: 2021, order: 5,
    coverUrl: 'https://nyxcable.com/wp-content/uploads/2021/10/2021-update.jpg' },
  { title: 'ส่งสินค้า 2020', slug: 'delivery-2020', year: 2020, order: 6,
    coverUrl: 'https://nyxcable.com/wp-content/uploads/2021/10/%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B8%82%E0%B8%AD%E0%B8%87-2020_%E0%B9%92%E0%B9%91%E0%B9%90%E0%B9%91%E0%B9%91%E0%B9%94_11.jpg' },
  { title: 'ส่งสินค้า 2019', slug: 'delivery-2019', year: 2019, order: 7,
    coverUrl: 'https://nyxcable.com/wp-content/uploads/2021/10/%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B8%AA%E0%B8%B4%E0%B8%99%E0%B8%84%E0%B9%89%E0%B8%B2-62_%E0%B9%92%E0%B9%91%E0%B9%90%E0%B9%91%E0%B9%91%E0%B9%94_27.jpg' },
  { title: 'ส่งสินค้า 2018', slug: 'delivery-2018', year: 2018, order: 8,
    coverUrl: 'https://nyxcable.com/wp-content/uploads/2021/10/%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B8%AA%E0%B8%B4%E0%B8%99%E0%B8%84%E0%B9%89%E0%B8%B2-61_%E0%B9%92%E0%B9%91%E0%B9%90%E0%B9%91%E0%B9%91%E0%B9%94_21.jpg' },
  { title: 'ส่งสินค้า 2017', slug: 'delivery-2017', year: 2017, order: 9,
    coverUrl: 'https://nyxcable.com/wp-content/uploads/2021/10/%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B8%AA%E0%B8%B4%E0%B8%99%E0%B8%84%E0%B9%89%E0%B8%B2-60_%E0%B9%92%E0%B9%91%E0%B9%90%E0%B9%91%E0%B9%91%E0%B9%94_11.jpg' },
  { title: 'PROFILE PICTURE', slug: 'profile-picture', year: null, order: 10,
    coverUrl: 'https://nyxcable.com/wp-content/uploads/2024/12/LINE_ALBUM_201224_241220_1-1024x768.jpg' },
  { title: 'ทำบุญบริษัท', slug: 'merit-ceremony', year: null, order: 11,
    coverUrl: 'https://nyxcable.com/wp-content/uploads/2021/10/%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%9A%E0%B8%A3%E0%B8%A3%E0%B8%A2%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%97%E0%B8%B3%E0%B8%9A%E0%B8%B8%E0%B8%8D%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%A9%E0%B8%B1%E0%B8%97_8.jpg' },
]

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadBuffer(res.headers.location).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`))
        return
      }
      const chunks = []
      res.on('data', (c) => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    }).on('error', reject)
  })
}

async function main() {
  if (!process.env.SANITY_TOKEN) {
    console.error('ERROR: Set SANITY_TOKEN environment variable first!')
    process.exit(1)
  }

  console.log('Re-importing gallery albums with CORRECTED URLs...\n')

  for (const album of albums) {
    console.log(`[${album.order}/11] ${album.title}`)
    const fn = decodeURIComponent(album.coverUrl.split('/').pop())
    console.log(`  File: ${fn}`)

    try {
      const buf = await downloadBuffer(album.coverUrl)
      console.log(`  Downloaded (${Math.round(buf.length / 1024)}KB)`)

      const asset = await client.assets.upload('image', buf, {
        filename: `${album.slug}-cover.jpg`,
      })

      const doc = {
        _id: `gallery-${album.slug}`,
        _type: 'galleryAlbum',
        title: album.title,
        slug: { _type: 'slug', current: album.slug },
        cover: {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
        },
        year: album.year,
        orderRank: album.order,
      }

      await client.createOrReplace(doc)
      console.log(`  ✅ Done\n`)
    } catch (e) {
      console.log(`  ❌ ERROR: ${e.message}\n`)
    }
  }

  console.log('🎉 All done!')
}

main().catch(console.error)
