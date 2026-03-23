/**
 * Upload delivery-2026 images to Sanity and create a galleryAlbum document.
 * Usage: node scripts/upload-delivery-album.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { join, basename } from 'path'

const PROJECT_ID = '30wikoy9'
const DATASET = 'production'
const TOKEN = process.env.SANITY_TOKEN

if (!TOKEN) {
  console.error('❌ SANITY_TOKEN env var is required')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: TOKEN,
})

const IMAGES_DIR = join(process.cwd(), 'frontend', 'public', 'delivery-2026')
const ALBUM_TITLE = 'ส่งสินค้า 2025'
const ALBUM_SLUG = 'delivery-2025'

// Generate file list: delivery-2026-00.jpg to delivery-2026-54.jpg
const files = [
  'delivery-2026-00.jpg',
  ...Array.from({ length: 54 }, (_, i) =>
    `delivery-2026-${String(i + 1).padStart(2, '0')}.jpg`
  ),
]

async function uploadImage(filePath) {
  const fileName = basename(filePath)
  const buffer = readFileSync(filePath)
  console.log(`  📤 Uploading ${fileName}...`)
  const asset = await client.assets.upload('image', buffer, {
    filename: fileName,
    contentType: 'image/jpeg',
  })
  return asset
}

async function main() {
  console.log(`🚀 Starting upload of ${files.length} images to Sanity...`)
  console.log(`   Project: ${PROJECT_ID} / ${DATASET}`)
  console.log('')

  const photos = []

  for (let i = 0; i < files.length; i++) {
    const filePath = join(IMAGES_DIR, files[i])
    try {
      const asset = await uploadImage(filePath)
      photos.push({
        _type: 'image',
        _key: `photo-${String(i).padStart(3, '0')}`,
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      })
      console.log(`  ✅ [${i + 1}/${files.length}] ${files[i]} → ${asset._id}`)
    } catch (err) {
      console.error(`  ❌ Failed: ${files[i]}`, err.message)
    }
  }

  console.log('')
  console.log(`📦 Creating galleryAlbum document with ${photos.length} photos...`)

  const doc = await client.createOrReplace({
    _id: ALBUM_SLUG,
    _type: 'galleryAlbum',
    title: ALBUM_TITLE,
    slug: { _type: 'slug', current: ALBUM_SLUG },
    year: 2025,
    photos,
    orderRank: 1,
  })

  console.log(`✅ Album created: ${doc._id}`)
  console.log(`🎉 Done! ${photos.length} photos uploaded.`)
}

main().catch(console.error)
