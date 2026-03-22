/**
 * Import warehouse photos + client logos from WordPress to Sanity
 */
import { createClient } from '@sanity/client'
import https from 'https'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN || 'sk53VR1KBUCe8pVqCKfQM4qRoELeLQnc9TRVy1vSEZIQTohrvagv2Gw95EXx9Viua8uu0wBal7UxTwQV07fo1hFn8rrLph7eePHwoNnXxoandZwQONOqfOTM9V4GJbDxjuahLebq4lJg9SuOkYua592MBbIcgTx6anwiL77kWeGjdyj6bHJP',
  useCdn: false,
})

const warehousePhotos = [
  'https://nyxcable.com/wp-content/uploads/2024/12/NYX-Cable-1200x1000.jpg',
  'https://nyxcable.com/wp-content/uploads/2024/09/61778.jpg',
  'https://nyxcable.com/wp-content/uploads/2024/09/61777.jpg',
  'https://nyxcable.com/wp-content/uploads/2024/12/86205.jpg',
  'https://nyxcable.com/wp-content/uploads/2024/09/61766.jpg',
]

const clientLogos = [
  { url: 'https://nyxcable.com/wp-content/uploads/2019/04/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%A0%E0%B8%B2%E0%B8%9E14.png', name: 'EVERGREEN' },
  { url: 'https://nyxcable.com/wp-content/uploads/2019/04/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%A0%E0%B8%B2%E0%B8%9E12.png', name: 'STECON' },
  { url: 'https://nyxcable.com/wp-content/uploads/2019/04/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%A0%E0%B8%B2%E0%B8%9E4.png', name: 'ThaiBev' },
  { url: 'https://nyxcable.com/wp-content/uploads/2019/04/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%A0%E0%B8%B2%E0%B8%9E5.png', name: 'TOA' },
  { url: 'https://nyxcable.com/wp-content/uploads/2019/04/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%A0%E0%B8%B2%E0%B8%9E15.png', name: 'BITEC' },
  { url: 'https://nyxcable.com/wp-content/uploads/2023/03/%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%A9%E0%B8%B1%E0%B8%97-%E0%B9%80%E0%B8%AD%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%98-%E0%B9%80%E0%B8%97%E0%B9%87%E0%B8%84-%E0%B9%80%E0%B8%AD%E0%B8%99%E0%B9%84%E0%B8%A7%E0%B8%A3%E0%B8%AD%E0%B8%99%E0%B9%80%E0%B8%A1%E0%B8%99%E0%B8%97%E0%B9%8C-%E0%B8%88%E0%B8%B3%E0%B8%81%E0%B8%B1%E0%B8%94-%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%8A%E0%B8%99.jpg', name: 'Earth Tech Environment' },
  { url: 'https://nyxcable.com/wp-content/uploads/2023/03/%E0%B8%AA%E0%B8%A2%E0%B8%B2%E0%B8%A1%E0%B9%81%E0%B8%A1%E0%B9%87%E0%B8%84%E0%B9%82%E0%B8%84%E0%B8%A3-%E0%B8%88%E0%B8%B3%E0%B8%81%E0%B8%B1%E0%B8%94.jpg', name: 'Siam Makro' },
  { url: 'https://nyxcable.com/wp-content/uploads/2023/03/%E0%B9%81%E0%B8%AA%E0%B8%99%E0%B8%AA%E0%B8%B4%E0%B8%A3%E0%B8%B4.png', name: 'Sansiri' },
  { url: 'https://nyxcable.com/wp-content/uploads/2019/04/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%A0%E0%B8%B2%E0%B8%9E9.png', name: 'INSEE' },
  { url: 'https://nyxcable.com/wp-content/uploads/2019/04/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%A0%E0%B8%B2%E0%B8%9E2.png', name: 'PTT' },
  { url: 'https://nyxcable.com/wp-content/uploads/2019/11/ref2_%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%97%E0%B8%B5%E0%B9%88_6.jpg', name: 'Mitsubishi Electric' },
  { url: 'https://nyxcable.com/wp-content/uploads/2023/03/%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%A9%E0%B8%B1%E0%B8%97-%E0%B8%A2%E0%B8%B9%E0%B9%84%E0%B8%99%E0%B9%80%E0%B8%95%E0%B9%87%E0%B8%94-%E0%B9%80%E0%B8%9B%E0%B9%80%E0%B8%9B%E0%B8%AD%E0%B8%A3%E0%B9%8C-%E0%B8%88%E0%B8%B3%E0%B8%81%E0%B8%B1%E0%B8%94-%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%8A%E0%B8%99.png', name: 'United Paper' },
  { url: 'https://nyxcable.com/wp-content/uploads/2021/11/TOYOTA-TSUSHO-ME-THAILAND.jpg', name: 'Toyota Tsusho' },
  { url: 'https://nyxcable.com/wp-content/uploads/2021/11/THAI-SUMMIT-HARNESS-PUBLIC-COMPANY-LIMITED.png', name: 'Thai Summit' },
  { url: 'https://nyxcable.com/wp-content/uploads/2019/11/ref2_%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%97%E0%B8%B5%E0%B9%88_9.png', name: 'Sena Development' },
  { url: 'https://nyxcable.com/wp-content/uploads/2019/04/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%A0%E0%B8%B2%E0%B8%9E7.png', name: 'Bangchak' },
  { url: 'https://nyxcable.com/wp-content/uploads/2019/04/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%A0%E0%B8%B2%E0%B8%9E10.png', name: 'Ford' },
  { url: 'https://nyxcable.com/wp-content/uploads/2019/04/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%A0%E0%B8%B2%E0%B8%9E11.png', name: 'Mitr Phol' },
  { url: 'https://nyxcable.com/wp-content/uploads/2019/04/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%A0%E0%B8%B2%E0%B8%9E13.png', name: 'TEAM Group' },
  { url: 'https://nyxcable.com/wp-content/uploads/2019/11/ref2_%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%97%E0%B8%B5%E0%B9%88_1.jpg', name: 'B.Grimm' },
  { url: 'https://nyxcable.com/wp-content/uploads/2019/11/ref2_%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%97%E0%B8%B5%E0%B9%88_2.jpg', name: 'BUHLER' },
  { url: 'https://nyxcable.com/wp-content/uploads/2019/11/ref2_%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%97%E0%B8%B5%E0%B9%88_3.jpg', name: 'TORAY' },
  { url: 'https://nyxcable.com/wp-content/uploads/2019/04/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%A0%E0%B8%B2%E0%B8%9E1.png', name: 'SCG' },
  { url: 'https://nyxcable.com/wp-content/uploads/2019/04/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%A0%E0%B8%B2%E0%B8%9E3.png', name: 'Panasonic' },
  { url: 'https://nyxcable.com/wp-content/uploads/2019/04/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%A0%E0%B8%B2%E0%B8%9E6.png', name: 'Central Group' },
  { url: 'https://nyxcable.com/wp-content/uploads/2019/04/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%A0%E0%B8%B2%E0%B8%9E8.png', name: 'Delta' },
]

function downloadBuffer(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
        return downloadBuffer(res.headers.location).then(resolve)
      if (res.statusCode !== 200) { resolve(null); return }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    }).on('error', () => resolve(null))
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {

  // 1. Upload warehouse photos
  console.log('\n=== WAREHOUSE PHOTOS ===')
  const warehouseRefs = []
  for (let i = 0; i < warehousePhotos.length; i++) {
    const buf = await downloadBuffer(warehousePhotos[i])
    if (!buf) { console.log(`  [${i+1}] SKIP 404`); continue }
    console.log(`  [${i+1}] ${Math.round(buf.length/1024)}KB`)
    const asset = await client.assets.upload('image', buf, { filename: `warehouse-${i+1}.jpg` })
    warehouseRefs.push({ _type: 'image', _key: `wh-${i}`, asset: { _type: 'reference', _ref: asset._id } })
    await sleep(200)
  }
  
  // Save as a global document for the contact page
  const whDocId = 'siteSettings-warehousePhotos'
  try {
    await client.createIfNotExists({ _id: whDocId, _type: 'siteSettings' })
    await client.patch(whDocId).set({ warehousePhotos: warehouseRefs }).commit()
    console.log(`  ✅ ${warehouseRefs.length} warehouse photos saved!`)
  } catch (e) {
    console.log(`  Saving refs to console instead:`)
    console.log(JSON.stringify(warehouseRefs.map(r => r.asset._ref)))
  }
  
  // 2. Upload client logos
  console.log('\n=== CLIENT LOGOS ===')
  const logoData = []
  for (let i = 0; i < clientLogos.length; i++) {
    const { url, name } = clientLogos[i]
    const buf = await downloadBuffer(url)
    if (!buf || buf.length < 500) { console.log(`  [${i+1}] ${name}: SKIP`); continue }
    const ext = url.includes('.png') ? 'png' : 'jpg'
    console.log(`  [${i+1}] ${name}: ${Math.round(buf.length/1024)}KB`)
    const asset = await client.assets.upload('image', buf, { filename: `logo-${name.toLowerCase().replace(/\s+/g,'-')}.${ext}` })
    logoData.push({ name, assetId: asset._id })
    await sleep(200)
  }
  
  console.log(`\n  ✅ ${logoData.length} client logos uploaded!`)
  console.log('\n  Logo asset IDs:')
  logoData.forEach(l => console.log(`    ${l.name}: ${l.assetId}`))
  
  // Save logo data as JSON for homepage use
  console.log('\n  JSON for homepage:')
  console.log(JSON.stringify(logoData, null, 2))
}

main().catch(console.error)
