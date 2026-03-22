/**
 * Add SEO-friendly captions (alt text) to ALL gallery photos in Sanity
 * Captions are Thai + English for maximum SEO value
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

// Thai album descriptions for SEO
const albumMeta = {
  'gallery-delivery-2025': { th: 'ส่งสินค้าสายไฟ NYX Cable ปี 2025', en: 'NYX Cable wire delivery 2025' },
  'gallery-delivery-2024': { th: 'ส่งสินค้าสายไฟ NYX Cable ปี 2024', en: 'NYX Cable wire delivery 2024' },
  'gallery-delivery-2023': { th: 'ส่งสินค้าสายไฟ NYX Cable ปี 2023', en: 'NYX Cable wire delivery 2023' },
  'gallery-delivery-2022': { th: 'ส่งสินค้าสายไฟ NYX Cable ปี 2022', en: 'NYX Cable wire delivery 2022' },
  'gallery-delivery-2021': { th: 'ส่งสินค้าสายไฟ NYX Cable ปี 2021', en: 'NYX Cable wire delivery 2021' },
  'gallery-delivery-2020': { th: 'ส่งสินค้าสายไฟ NYX Cable ปี 2020', en: 'NYX Cable wire delivery 2020' },
  'gallery-delivery-2019': { th: 'ส่งสินค้าสายไฟ NYX Cable ปี 2019', en: 'NYX Cable wire delivery 2019' },
  'gallery-delivery-2018': { th: 'ส่งสินค้าสายไฟ NYX Cable ปี 2018', en: 'NYX Cable wire delivery 2018' },
  'gallery-delivery-2017': { th: 'ส่งสินค้าสายไฟ NYX Cable ปี 2017', en: 'NYX Cable wire delivery 2017' },
  'gallery-profile-picture': { th: 'ภาพบรรยากาศบริษัท NYX Cable', en: 'NYX Cable company atmosphere' },
  'gallery-merit-ceremony': { th: 'ทำบุญบริษัท NYX Cable', en: 'NYX Cable merit ceremony' },
}

async function main() {
  if (!process.env.SANITY_TOKEN) { console.error('Set SANITY_TOKEN!'); process.exit(1) }

  const albums = await client.fetch(`*[_type == "galleryAlbum"] { _id, title, photos }`)
  
  let totalUpdated = 0
  
  for (const album of albums) {
    const meta = albumMeta[album._id]
    if (!meta || !album.photos?.length) {
      console.log(`⏭ ${album.title}: skip (no photos or no meta)`)
      continue
    }
    
    let changed = false
    const updatedPhotos = album.photos.map((photo, i) => {
      if (photo.caption) return photo // Already has caption
      changed = true
      return {
        ...photo,
        caption: `${meta.th} ภาพที่ ${i + 1} - ${meta.en} photo ${i + 1}`,
      }
    })
    
    if (changed) {
      await client.patch(album._id).set({ photos: updatedPhotos }).commit()
      console.log(`✅ ${album.title}: ${updatedPhotos.length} photos captioned`)
      totalUpdated += updatedPhotos.length
    } else {
      console.log(`✅ ${album.title}: already has captions`)
    }
  }
  
  console.log(`\n🎉 Done! ${totalUpdated} photos updated with SEO captions`)
}

main().catch(console.error)
