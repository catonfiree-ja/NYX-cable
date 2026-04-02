/**
 * NYX Cable — Migrate Product Specs (JSON → Sanity Variants)
 * Reads product-specs.json and creates productVariant documents in Sanity
 * Each item in the spec table becomes a variant of the parent product
 * 
 * Usage: node scripts/migrate-specs.mjs
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local
try {
  const envFile = readFileSync(resolve(__dirname, '../.env.local'), 'utf-8')
  envFile.split('\n').forEach(line => {
    const [key, ...val] = line.split('=')
    if (key && val.length) process.env[key.trim()] = val.join('=').trim()
  })
} catch {}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '30wikoy9',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
})

// Load product-specs.json
const specsData = JSON.parse(readFileSync(resolve(__dirname, '../data/product-specs.json'), 'utf-8'))

// Build specification key-value pairs from a spec item
function buildSpecifications(item) {
  const specs = []
  if (item.coreSize) specs.push({ key: 'ขนาดแกน (Core)', value: item.coreSize })
  if (item.strands) specs.push({ key: 'จำนวนเส้น (Strands)', value: item.strands })
  if (item.outerDia) specs.push({ key: 'เส้นผ่านศูนย์กลาง (mm)', value: item.outerDia })
  if (item.cuWeight) specs.push({ key: 'น้ำหนักทองแดง (kg/km)', value: item.cuWeight })
  if (item.weight) specs.push({ key: 'น้ำหนักรวม (kg/km)', value: item.weight })
  if (item.resistance) specs.push({ key: 'ความต้านทาน (Ω/km)', value: item.resistance })
  if (item.inductance) specs.push({ key: 'Inductance', value: item.inductance })
  if (item.capacitance) specs.push({ key: 'Capacitance', value: item.capacitance })
  return specs
}

// Generate variant slug from model name
function modelToSlug(model, parentSlug) {
  // Clean Thai characters and create URL-friendly slug
  const cleaned = model
    .replace(/สาย(คอนโทรล|ชีลด์|VFD|กันน้ำ|ไฟ|ทนความร้อน|Servo)\s*/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\-\.x]/g, '')
    .toLowerCase()
    .replace(/^-+|-+$/g, '')
  return cleaned || `${parentSlug}-variant`
}

async function main() {
  const productSlugs = Object.keys(specsData)
  console.log(`📋 Found spec data for ${productSlugs.length} products\n`)

  let totalVariants = 0, created = 0, skipped = 0, failed = 0

  for (const parentSlug of productSlugs) {
    const specGroup = specsData[parentSlug]
    const items = specGroup.items || []
    totalVariants += items.length

    // Find parent product ID
    const parentId = await client.fetch(
      `*[_type == "product" && slug.current == $slug][0]._id`,
      { slug: parentSlug }
    )

    if (!parentId) {
      console.log(`  ⚠️ No parent product for: ${parentSlug} (${items.length} variants skipped)`)
      failed += items.length
      continue
    }

    // Check how many variants already exist for this parent
    const existingCount = await client.fetch(
      `count(*[_type == "productVariant" && parentProduct._ref == $parentId])`,
      { parentId }
    )

    if (existingCount >= items.length) {
      console.log(`  ✅ ${parentSlug}: ${existingCount} variants (already migrated)`)
      skipped += items.length
      continue
    }

    console.log(`  🔄 ${parentSlug}: migrating ${items.length} variants...`)

    // Create variants using a transaction for speed
    const tx = client.transaction()

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const variantSlug = modelToSlug(item.model || `${parentSlug}-${item.coreSize}`, parentSlug)
      const uniqueSlug = `${variantSlug}-${i}`

      tx.create({
        _type: 'productVariant',
        title: item.model || `${specGroup.sheetName} ${item.coreSize}`,
        slug: { _type: 'slug', current: uniqueSlug },
        parentProduct: { _type: 'reference', _ref: parentId },
        partNumber: item.partNo || '',
        coreSize: item.coreSize || '',
        specifications: buildSpecifications(item),
        price: item.price ? parseFloat(item.price) : undefined,
      })
    }

    try {
      await tx.commit()
      console.log(`  ✨ Created ${items.length} variants for ${parentSlug}`)
      created += items.length
    } catch (err) {
      console.log(`  ❌ Failed ${parentSlug}: ${err.message}`)
      failed += items.length
    }

    // Small delay between products
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\n📊 Total: ${totalVariants} variants`)
  console.log(`   ✨ Created: ${created}`)
  console.log(`   ✅ Skipped: ${skipped}`)
  console.log(`   ❌ Failed: ${failed}`)
}

main().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
