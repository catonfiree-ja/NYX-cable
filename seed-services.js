/**
 * Seed servicesItems into homePage with icon images from /public/images/icons/
 * Usage: node seed-services.js
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

const ICONS_DIR = path.join(__dirname, 'frontend', 'public', 'images', 'icons')

const services = [
  {
    key: 'svc1',
    iconFile: 'service-delivery.png',
    title: 'ส่งด่วนจากโกดังบางนา',
    line1: 'ส่งด่วน 2 ชม.',
    line2: 'ในกรุงเทพฯ-ปริมณฑล',
  },
  {
    key: 'svc2',
    iconFile: 'service-consult.png',
    title: 'สต็อกพร้อมส่งทุกขนาด',
    line1: 'สินค้า 60+ รุ่น',
    line2: '15,000+ SKU',
  },
  {
    key: 'svc3',
    iconFile: 'service-solve.png',
    title: 'บรรจุภัณฑ์แข็งแรง',
    line1: 'แพ็คอย่างดี',
    line2: 'ป้องกันความเสียหาย',
  },
  {
    key: 'svc4',
    iconFile: 'service-nationwide.png',
    title: 'จัดส่งทั่วประเทศ',
    line1: 'ขนส่งผ่าน',
    line2: 'พาร์ทเนอร์ชั้นนำ',
  },
]

async function main() {
  const servicesItems = []
  for (const svc of services) {
    const filePath = path.join(ICONS_DIR, svc.iconFile)
    if (!fs.existsSync(filePath)) {
      console.error(`Icon not found: ${filePath}`)
      process.exit(1)
    }
    console.log(`Uploading ${svc.iconFile}...`)
    const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
      filename: svc.iconFile,
    })
    console.log(`  ✓ ${asset._id}`)
    servicesItems.push({
      _type: 'object',
      _key: svc.key,
      icon: {
        _type: 'image',
        alt: svc.title,
        asset: { _type: 'reference', _ref: asset._id },
      },
      title: svc.title,
      line1: svc.line1,
      line2: svc.line2,
    })
  }

  const homePage = await client.fetch('*[_type == "homePage"][0]{ _id }')
  if (!homePage) { console.error('No homePage!'); process.exit(1) }

  console.log(`\nPatching servicesItems into ${homePage._id}...`)
  await client.patch(homePage._id).set({ servicesItems }).commit()
  console.log('✅ Done!')
}

main().catch(err => { console.error(err); process.exit(1) })
