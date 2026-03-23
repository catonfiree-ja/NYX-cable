/**
 * Fix: Set cover for the delivery-2025 album to first photo
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

async function fixCover() {
  const album = await client.fetch(`*[_type == "galleryAlbum" && _id == "delivery-2025"][0]{ _id, title, cover, "firstPhoto": photos[0] }`)
  if (!album) {
    console.log('Album delivery-2025 not found')
    return
  }
  console.log('Album:', album.title)
  console.log('Cover:', album.cover ? 'SET' : 'MISSING')
  
  if (!album.cover && album.firstPhoto) {
    console.log('Setting cover to first photo...')
    await client.patch('delivery-2025').set({ cover: album.firstPhoto }).commit()
    console.log('Done! Cover set.')
  } else if (album.cover) {
    console.log('Cover already set, no changes needed.')
  } else {
    console.log('No photos found to use as cover.')
  }
}

fixCover().catch(console.error)
