import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

async function patchSpecs() {
  console.log('Fetching CVV product...')
  const products = await client.fetch(`*[_type == "product" && slug.current == "cvv"]{_id, title, voltageRating, temperatureRange, standards}`)
  if (products.length === 0) { console.error('Product "cvv" not found!'); process.exit(1) }
  const product = products[0]
  console.log('Found:', product.title, '-', product._id)
  console.log('Current specs:', JSON.stringify({ voltageRating: product.voltageRating, temperatureRange: product.temperatureRange, standards: product.standards }))

  console.log('Patching with full technical specs...')
  const res = await client.patch(product._id).set({
    temperatureRange: '70°C',
    standards: 'IEC, VDE, CE',
    specifications: [
      { _key: 'conductor', key: 'ตัวนำ', value: 'ทองแดงเส้นฝอยละเอียด (Class 5)' },
      { _key: 'insulation', key: 'ฉนวน', value: 'PVC' },
      { _key: 'cores', key: 'จำนวนคอร์', value: '2 - 48 คอร์' },
      { _key: 'crossSection', key: 'ขนาดหน้าตัด', value: '0.5 - 6 mm²' },
      { _key: 'shield', key: 'ชีลด์', value: 'ไม่มี (CVV-S มี Copper Tape Shield)' },
    ],
  }).commit()

  console.log('✅ SUCCESS! Patched:', res._id)
}

patchSpecs().catch(e => { console.error('FAILED:', e.message); process.exit(1) })
