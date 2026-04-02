/**
 * NYX Cable — Product & Category Migration Script
 * Reads data from frontend/data/category-products.ts and creates documents in Sanity CMS
 * 
 * Usage: node scripts/migrate-products.mjs
 * 
 * Prerequisites:
 *   - Set SANITY_AUTH_TOKEN env variable (token with write access)
 *   - Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET env variables
 *   - Or use .env.local file
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local if exists
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

if (!process.env.SANITY_API_TOKEN && !process.env.SANITY_AUTH_TOKEN) {
  console.error('❌ SANITY_API_TOKEN is required! Set it in .env.local')
  console.error('   Get a token from: https://www.sanity.io/manage/project/30wikoy9/api#tokens')
  process.exit(1)
}

// ─── Category mapping (slug → Sanity-friendly data) ───
const categories = [
  { slug: 'control-cable', title: 'สายคอนโทรล', icon: '🔌', order: 1 },
  { slug: 'shielded-cable', title: 'สายชีลด์', icon: '🛡️', order: 2 },
  { slug: 'twisted-pair-cable', title: 'สาย Twisted Pair / RS485', icon: '🔗', order: 3 },
  { slug: 'water-resistant-cable', title: 'สายกันน้ำ', icon: '💧', order: 4 },
  { slug: 'wiring-cable', title: 'สายไฟเดินสาย', icon: '⚡', order: 5 },
  { slug: 'high-flex-cable', title: 'สายทนการเคลื่อนที่', icon: '🔄', order: 6 },
  { slug: 'industrial-bus-cable', title: 'สายสื่อสารอุตสาหกรรม', icon: '🏭', order: 7 },
  { slug: 'resistant-cable', title: 'สายทนความร้อน', icon: '🔥', order: 8 },
]

// ─── Product data from category-products.ts (parsed manually) ───
// We'll read the actual file and parse it
const dataFile = readFileSync(resolve(__dirname, '../data/category-products.ts'), 'utf-8')

// Extract all product objects using regex
function extractProducts(content) {
  const products = []
  const categoryBlocks = content.split(/'\w[\w-]*':\s*\{/)
  
  // Find all category slugs
  const catSlugs = [...content.matchAll(/'([\w-]+)':\s*\{\s*\n\s*title:/g)].map(m => m[1])
  
  for (let i = 0; i < catSlugs.length; i++) {
    const catSlug = catSlugs[i]
    // Find all products in this category
    const catRegex = new RegExp(`'${catSlug}':[\\s\\S]*?products:\\s*\\[([\\s\\S]*?)\\]\\s*,?\\s*\\}`, 'm')
    const catMatch = content.match(catRegex)
    if (!catMatch) continue
    
    const productsBlock = catMatch[1]
    // Extract individual product objects
    const productMatches = [...productsBlock.matchAll(/\{\s*slug:\s*'([^']+)',\s*\n\s*title:\s*'([^']+)',\s*\n\s*code:\s*'([^']+)',\s*\n\s*shortDescription:\s*'([^']+)'/g)]
    
    for (const pm of productMatches) {
      products.push({
        slug: pm[1],
        title: pm[2],
        code: pm[3],
        shortDescription: pm[4],
        categorySlug: catSlug,
      })
    }
  }
  return products
}

const allProducts = extractProducts(dataFile)
console.log(`📦 Found ${allProducts.length} products across ${categories.length} categories\n`)

// ─── Step 1: Create/update categories ───
async function migrateCategories() {
  console.log('━━━ STEP 1: Categories ━━━')
  const categoryIds = {}
  
  for (const cat of categories) {
    const docId = `category-${cat.slug}`
    const existing = await client.fetch(`*[_type == "productCategory" && slug.current == $slug][0]._id`, { slug: cat.slug })
    
    if (existing) {
      console.log(`  ✅ Category exists: ${cat.title} (${existing})`)
      categoryIds[cat.slug] = existing
    } else {
      const doc = await client.createOrReplace({
        _id: docId,
        _type: 'productCategory',
        title: cat.title,
        slug: { _type: 'slug', current: cat.slug },
        icon: cat.icon,
        orderRank: cat.order,
      })
      console.log(`  ✨ Created category: ${cat.title} → ${doc._id}`)
      categoryIds[cat.slug] = doc._id
    }
  }
  return categoryIds
}

// ─── Step 2: Create/update products with locked slugs ───
async function migrateProducts(categoryIds) {
  console.log('\n━━━ STEP 2: Products (with locked slugs) ━━━')
  let created = 0, skipped = 0
  
  for (const prod of allProducts) {
    const existing = await client.fetch(`*[_type == "product" && slug.current == $slug][0]._id`, { slug: prod.slug })
    
    if (existing) {
      console.log(`  ✅ Exists: ${prod.slug}`)
      skipped++
      continue
    }
    
    const catId = categoryIds[prod.categorySlug]
    if (!catId) {
      console.log(`  ⚠️ No category for: ${prod.slug} (cat: ${prod.categorySlug})`)
      continue
    }
    
    const doc = await client.create({
      _type: 'product',
      title: prod.title,
      slug: { _type: 'slug', current: prod.slug },
      productCode: prod.code,
      shortDescription: prod.shortDescription,
      categories: [{ _type: 'reference', _ref: catId, _key: prod.categorySlug }],
    })
    console.log(`  ✨ Created: ${prod.slug} → ${doc._id}`)
    created++
  }
  
  console.log(`\n📊 Results: ${created} created, ${skipped} already existed`)
}

// ─── Run ───
async function main() {
  console.log('🚀 NYX Cable — Product & Category Migration')
  console.log(`   Project: ${client.config().projectId}`)
  console.log(`   Dataset: ${client.config().dataset}\n`)
  
  const categoryIds = await migrateCategories()
  await migrateProducts(categoryIds)
  
  console.log('\n✅ Migration complete!')
  console.log('💡 Next: Open Sanity Studio to verify data and add images')
}

main().catch(err => {
  console.error('❌ Migration failed:', err.message)
  process.exit(1)
})
