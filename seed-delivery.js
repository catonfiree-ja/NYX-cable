/**
 * Upload delivery photos to Sanity and populate homePage.deliveryPhotos
 * Usage: node seed-delivery.js
 */
const { createClient } = require('@sanity/client')
const fs = require('fs')
const path = require('path')

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skAzH4XD6usVeXN7iEyopum4t0xe4pUEP0DnB8Gk7Fco8GE30SrjauDcCXgz83dD2yi8tzY0xQodvAocdObd8Ln7hcADMIiFJ8pehJM44K2uZ1H9uN1O3aRzzxbLgpXvYLFW5Hrw7PS01fgU7Csv9sgsl4jm3YCVfq4AbxSu3ktS6Ku1JeVQ',
  useCdn: false,
})

const PUBLIC = path.join(__dirname, 'frontend', 'public')

const photos = [
  { file: 'delivery-orig/delivery-orig-01.jpg', alt: 'NYX Cable คนงานในโกดัง', gridColumn: '1', gridRow: '1' },
  { file: 'delivery-orig/delivery-orig-02.jpg', alt: 'NYX Cable สายไฟบนรถบรรทุก', gridColumn: '2', gridRow: '1 / 3' },
  { file: 'delivery-orig/delivery-orig-03.jpg', alt: 'NYX Cable ลานจัดเก็บสายไฟ', gridColumn: '3', gridRow: '1' },
  { file: 'delivery-orig/delivery-orig-04.jpg', alt: 'NYX Cable โฟร์คลิฟท์ขนสายไฟ', gridColumn: '4', gridRow: '1' },
  { file: 'delivery-orig/delivery-orig-05.jpg', alt: 'NYX Cable โกดังสายไฟ', gridColumn: '1', gridRow: '2 / 4' },
  { file: 'delivery-orig/delivery-orig-06.jpg', alt: 'NYX Cable ม้วนสายไฟไม้ในคลัง', gridColumn: '3', gridRow: '2 / 4' },
  { file: 'delivery-orig/delivery-orig-07.jpg', alt: 'NYX Cable รถบรรทุกสายไฟ', gridColumn: '4', gridRow: '2' },
  { file: 'delivery-orig/delivery-orig-08.jpg', alt: 'ลูกค้ายิ้มรับสายไฟ NYX Cable', gridColumn: '2', gridRow: '3' },
  { file: 'delivery-orig/delivery-orig-09.jpg', alt: 'ลูกค้ารับสายไฟเอง NYX Cable', gridColumn: '4', gridRow: '3' },
  { file: 'delivery-orig/delivery-orig-10.jpg', alt: 'ลูกค้าถือสายไฟ NYX Cable', gridColumn: '1', gridRow: '4' },
  { file: 'delivery-2026/delivery-2026-20.jpg', alt: 'NYX Cable สายไฟพร้อมขนส่ง', gridColumn: '2', gridRow: '4' },
  { file: 'delivery-2026/delivery-2026-30.jpg', alt: 'NYX Cable จัดส่งสายไฟให้ลูกค้า', gridColumn: '3', gridRow: '4' },
  { file: 'delivery-2026/delivery-2026-40.jpg', alt: 'NYX Cable คลังสินค้าสายไฟ', gridColumn: '4', gridRow: '4' },
]

async function main() {
  const deliveryPhotos = []
  for (let i = 0; i < photos.length; i++) {
    const p = photos[i]
    const filePath = path.join(PUBLIC, p.file)
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`)
      process.exit(1)
    }
    console.log(`Uploading ${p.file}...`)
    const asset = await client.assets.upload('image', fs.createReadStream(filePath), { filename: path.basename(p.file) })
    console.log(`  ✓ ${asset._id}`)
    deliveryPhotos.push({
      _type: 'image',
      _key: `del${String(i + 1).padStart(2, '0')}`,
      alt: p.alt,
      gridColumn: p.gridColumn,
      gridRow: p.gridRow,
      asset: { _type: 'reference', _ref: asset._id },
    })
  }

  const homePage = await client.fetch('*[_type == "homePage"][0]{ _id }')
  if (!homePage) { console.error('No homePage!'); process.exit(1) }

  console.log(`\nPatching ${deliveryPhotos.length} photos into homePage...`)
  await client.patch(homePage._id).set({ deliveryPhotos }).commit()
  console.log('✅ Done!')
}

main().catch(err => { console.error(err); process.exit(1) })
