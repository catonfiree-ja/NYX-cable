/**
 * Set linkUrl for 2025 album (links to Facebook instead of lightbox)
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

  console.log('Setting linkUrl for ส่งสินค้า 2025 → Facebook...')
  await client.patch('gallery-delivery-2025')
    .set({ linkUrl: 'https://www.facebook.com/nyxcable' })
    .commit()
  console.log('✅ Done! 2025 album now links to Facebook')
}

main().catch(console.error)
