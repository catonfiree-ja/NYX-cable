/**
 * Rename gallery album titles that are unclear
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

async function main() {
  if (!process.env.SANITY_TOKEN) { console.error('Set SANITY_TOKEN!'); process.exit(1) }

  // Fetch all gallery albums
  const albums = await client.fetch(`*[_type == "galleryAlbum"] | order(orderRank asc) { _id, title, slug }`)
  
  console.log('Current album titles:')
  albums.forEach((a, i) => console.log(`  ${i+1}. ${a.title} (${a.slug.current})`))
  
  // Albums to rename
  const renames = [
    { id: 'gallery-profile-picture', newTitle: 'ภาพบรรยากาศบริษัท', reason: 'PROFILE PICTURE → ภาษาอังกฤษไม่สื่อ' },
  ]

  console.log('\n--- Renaming ---')
  for (const r of renames) {
    console.log(`\n${r.reason}`)
    console.log(`  → ${r.newTitle}`)
    await client.patch(r.id).set({ title: r.newTitle }).commit()
    console.log('  ✅ Done')
  }

  console.log('\n🎉 Renamed!')
}

main().catch(console.error)
