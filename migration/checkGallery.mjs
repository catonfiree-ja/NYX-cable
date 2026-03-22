import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'sk53VR1KBUCe8pVqCKfQM4qRoELeLQnc9TRVy1vSEZIQTohrvagv2Gw95EXx9Viua8uu0wBal7UxTwQV07fo1hFn8rrLph7eePHwoNnXxoandZwQONOqfOTM9V4GJbDxjuahLebq4lJg9SuOkYua592MBbIcgTx6anwiL77kWeGjdyj6bHJP',
  useCdn: false,
})

async function main() {
  const albums = await client.fetch(`*[_type == "galleryAlbum"]{ _id, title, slug, cover, "photoCount": count(photos), "hasCover": defined(cover) }`)
  console.log(`Gallery Albums: ${albums.length}`)
  albums.forEach(a => {
    console.log(`  - ${a.title} | hasCover: ${a.hasCover} | photos: ${a.photoCount}`)
    if (a.cover) {
      console.log(`    cover asset: ${JSON.stringify(a.cover?.asset)}`)
    }
  })
}

main().catch(console.error)
