/**
 * NYX Cable — WordPress → Sanity Data Migration Script
 * 
 * Prerequisites:
 * 1. cd sanity/
 * 2. npx sanity login (login via browser)
 * 3. cd ..
 * 4. node migrate-to-sanity.js
 * 
 * This script reads the extracted WordPress JSON data from ./data/
 * and creates NDJSON import files for Sanity.
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const DATA_DIR = path.join(__dirname, 'data')
const OUTPUT_DIR = path.join(__dirname, 'migration')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// ─── Helpers ────────────────────────────────────────────

function generateId(prefix, wpId) {
  return `${prefix}-${wpId}`
}

function slugify(text) {
  if (!text) return ''
  return text
    .toLowerCase()
    .replace(/[^\u0E00-\u0E7Fa-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function stripHtml(html) {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim()
}

function htmlToPortableText(html) {
  if (!html || !html.trim()) return []

  // Simple HTML → Portable Text block conversion
  // Splits on paragraph/heading tags and creates basic blocks
  const blocks = []
  const cleaned = html
    .replace(/\r\n/g, '\n')
    .replace(/<br\s*\/?>/gi, '\n')

  // Split by block-level elements
  const parts = cleaned.split(/<\/?(p|h[1-6]|div|ul|ol|li|table|tr|td|th|blockquote)[^>]*>/gi)

  for (const part of parts) {
    const text = stripHtml(part).trim()
    if (text) {
      blocks.push({
        _type: 'block',
        _key: crypto.randomBytes(6).toString('hex'),
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: crypto.randomBytes(6).toString('hex'),
            text: text,
            marks: [],
          },
        ],
      })
    }
  }

  return blocks
}

function readJSON(filename) {
  const filepath = path.join(DATA_DIR, filename)
  return JSON.parse(fs.readFileSync(filepath, 'utf-8'))
}

function writeNDJSON(filename, documents) {
  const filepath = path.join(OUTPUT_DIR, filename)
  const lines = documents.map((doc) => JSON.stringify(doc)).join('\n')
  fs.writeFileSync(filepath, lines, 'utf-8')
  console.log(`  ✅ ${filepath} — ${documents.length} documents`)
}

// ─── Migrate Product Categories ─────────────────────────

function migrateCategories() {
  console.log('\n📂 MIGRATING PRODUCT CATEGORIES...')
  const categories = readJSON('product-categories.json')

  const docs = categories
    .filter((c) => c.slug !== 'uncategorized')
    .map((cat) => ({
      _type: 'productCategory',
      _id: generateId('cat', cat.id),
      title: stripHtml(cat.name),
      slug: { _type: 'slug', current: cat.slug },
      parent: cat.parent
        ? { _type: 'reference', _ref: generateId('cat', cat.parent) }
        : undefined,
      shortDescription: stripHtml(cat.description).substring(0, 300),
      description: htmlToPortableText(cat.description),
      orderRank: cat.count || 0,
    }))

  writeNDJSON('categories.ndjson', docs)
  return categories
}

// ─── Migrate Products ───────────────────────────────────

function migrateProducts() {
  console.log('\n📦 MIGRATING PRODUCTS...')
  const products = readJSON('products.json')

  const docs = products.map((prod) => ({
    _type: 'product',
    _id: generateId('prod', prod.id),
    title: stripHtml(prod.title?.rendered),
    slug: {
      _type: 'slug',
      current: decodeURIComponent(prod.slug),
    },
    productCode: extractProductCode(stripHtml(prod.title?.rendered)),
    categories: (prod.product_cat || []).map((catId) => ({
      _type: 'reference',
      _ref: generateId('cat', catId),
      _key: crypto.randomBytes(6).toString('hex'),
    })),
    description: htmlToPortableText(prod.content?.rendered),
    shortDescription: stripHtml(prod.excerpt?.rendered).substring(0, 300),
    featured: false,
    metaTitle: stripHtml(prod.title?.rendered),
  }))

  writeNDJSON('products.ndjson', docs)
  return products
}

function extractProductCode(title) {
  if (!title) return ''
  // Extract product code from title like "YSLY-JZ: สายคอนโทรล" → "YSLY-JZ"
  const match = title.match(/^([A-Za-z0-9\-\/()]+(?:\s+[A-Za-z0-9\-\/()]+)?)\s*[:：]/)
  return match ? match[1].trim() : ''
}

// ─── Migrate Product Variants (Pages) ───────────────────

function migrateVariants() {
  console.log('\n📐 MIGRATING PRODUCT VARIANTS...')
  const pages = readJSON('pages.json')

  // Filter variant pages — those with parent IDs matching product-related pages
  // Variant pages typically have model numbers in the title like "YSLY-JZ 5G35"
  const variantPattern = /^[A-Za-z].*\d+[GXx]\d+/
  const variantPages = pages.filter(
    (p) => p.parent && variantPattern.test(stripHtml(p.title?.rendered))
  )

  console.log(`  Found ${variantPages.length} potential variant pages`)

  const docs = variantPages.map((page) => {
    const title = stripHtml(page.title?.rendered)
    const specs = parseVariantSpecs(title, page.content?.rendered)

    return {
      _type: 'productVariant',
      _id: generateId('var', page.id),
      title: title,
      slug: {
        _type: 'slug',
        current: decodeURIComponent(page.slug),
      },
      model: title,
      cores: specs.cores,
      crossSection: specs.crossSection,
      outerDiameter: specs.od,
      copperWeight: specs.cuWeight,
      totalWeight: specs.weight,
      conductorResistance: specs.resistance,
      price: specs.price,
      unit: 'เมตร',
      inStock: true,
      description: htmlToPortableText(page.content?.rendered),
      metaTitle: title,
    }
  })

  writeNDJSON('variants.ndjson', docs)
  return variantPages
}

function parseVariantSpecs(title, html) {
  const specs = {}

  // Parse cores and size from title like "YSLY-JZ 5G35" → 5 cores, 35mm²
  const coreMatch = title.match(/(\d+)[GXx](\d+(?:\.\d+)?)/)
  if (coreMatch) {
    specs.cores = parseInt(coreMatch[1])
    specs.crossSection = parseFloat(coreMatch[2])
  }

  // Try to extract numbers from HTML content
  if (html) {
    const text = stripHtml(html)
    const odMatch = text.match(/(?:OD|เส้นผ่า[นศ])[^\d]*(\d+\.?\d*)/i)
    if (odMatch) specs.od = parseFloat(odMatch[1])

    const priceMatch = text.match(/(?:ราคา|price|฿)[^\d]*(\d+\.?\d*)/i)
    if (priceMatch) specs.price = parseFloat(priceMatch[1])

    const weightMatch = text.match(/(?:weight|น้ำหนัก)[^\d]*(\d+\.?\d*)/i)
    if (weightMatch) specs.weight = parseFloat(weightMatch[1])
  }

  return specs
}

// ─── Migrate Blog Posts ─────────────────────────────────

function migrateBlogPosts() {
  console.log('\n📝 MIGRATING BLOG POSTS...')
  const posts = readJSON('posts.json')

  const docs = posts.map((post) => ({
    _type: 'blogPost',
    _id: generateId('post', post.id),
    title: stripHtml(post.title?.rendered),
    slug: {
      _type: 'slug',
      current: decodeURIComponent(post.slug),
    },
    publishedAt: post.date,
    excerpt: stripHtml(post.excerpt?.rendered).substring(0, 300),
    body: htmlToPortableText(post.content?.rendered),
    tags: (post.tags || []).map(String),
    metaTitle: stripHtml(post.title?.rendered),
  }))

  writeNDJSON('blog-posts.ndjson', docs)
  return posts
}

// ─── Migrate Static Pages ───────────────────────────────

function migrateStaticPages() {
  console.log('\n📄 MIGRATING STATIC PAGES...')
  const pages = readJSON('pages.json')

  // Only migrate non-variant pages (top-level or important ones)
  const variantPattern = /^[A-Za-z].*\d+[GXx]\d+/
  const staticPages = pages.filter(
    (p) => !variantPattern.test(stripHtml(p.title?.rendered))
  )

  console.log(`  Found ${staticPages.length} static pages (excl. variants)`)

  const docs = staticPages.map((page) => ({
    _type: 'page',
    _id: generateId('page', page.id),
    title: stripHtml(page.title?.rendered),
    slug: {
      _type: 'slug',
      current: decodeURIComponent(page.slug),
    },
    template: 'default',
    body: htmlToPortableText(page.content?.rendered),
    parent: page.parent
      ? { _type: 'reference', _ref: generateId('page', page.parent) }
      : undefined,
    menuOrder: page.menu_order || 0,
    metaTitle: stripHtml(page.title?.rendered),
  }))

  writeNDJSON('pages.ndjson', docs)
  return staticPages
}

// ─── Migrate Post Categories ────────────────────────────

function migratePostCategories() {
  console.log('\n🏷️ MIGRATING POST CATEGORIES...')
  const categories = readJSON('post-categories.json')

  const docs = categories
    .filter((c) => c.slug !== 'uncategorized')
    .map((cat) => ({
      _type: 'postCategory',
      _id: generateId('pcat', cat.id),
      title: stripHtml(cat.name),
      slug: { _type: 'slug', current: cat.slug },
      description: cat.description || '',
    }))

  writeNDJSON('post-categories.ndjson', docs)
  return categories
}

// ─── Create Site Settings ───────────────────────────────

function createSiteSettings() {
  console.log('\n⚙️ CREATING SITE SETTINGS...')

  const settings = {
    _type: 'siteSettings',
    _id: 'siteSettings',
    companyName: 'NYX Cable',
    tagline: 'ผู้เชี่ยวชาญสายไฟอุตสาหกรรมคุณภาพยุโรป',
    phone: '02-111-5588',
    lineOA: '@nyxcable',
    lineUrl: 'https://page.line.me/ubb9405u',
    address: 'บางนา, กรุงเทพฯ',
    footerText: '© NYX Cable — สายไฟอุตสาหกรรมคุณภาพสูงมาตรฐานยุโรป',
  }

  writeNDJSON('site-settings.ndjson', [settings])
}

// ─── Generate Import Script ─────────────────────────────

function generateImportScript() {
  const script = `@echo off
echo ═══════════════════════════════════════════
echo   NYX Cable — Sanity Data Import
echo ═══════════════════════════════════════════
echo.
echo Make sure you are logged in: npx sanity login
echo.
echo Step 1: Import Post Categories
npx sanity dataset import migration\\post-categories.ndjson production --replace
echo.
echo Step 2: Import Product Categories
npx sanity dataset import migration\\categories.ndjson production --replace
echo.
echo Step 3: Import Products
npx sanity dataset import migration\\products.ndjson production --replace
echo.
echo Step 4: Import Product Variants
npx sanity dataset import migration\\variants.ndjson production --replace
echo.
echo Step 5: Import Blog Posts
npx sanity dataset import migration\\blog-posts.ndjson production --replace
echo.
echo Step 6: Import Static Pages
npx sanity dataset import migration\\pages.ndjson production --replace
echo.
echo Step 7: Import Site Settings
npx sanity dataset import migration\\site-settings.ndjson production --replace
echo.
echo ═══════════════════════════════════════════
echo   ✅ IMPORT COMPLETE!
echo ═══════════════════════════════════════════
pause
`

  fs.writeFileSync(path.join(__dirname, 'import-to-sanity.bat'), script, 'utf-8')
  console.log('\n  ✅ Created import-to-sanity.bat')
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════
async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  NYX Cable — Data Migration Preparation')
  console.log('═══════════════════════════════════════════')
  console.log(`  Source: ${DATA_DIR}`)
  console.log(`  Output: ${OUTPUT_DIR}`)
  console.log('═══════════════════════════════════════════')

  const categories = migrateCategories()
  const products = migrateProducts()
  const variants = migrateVariants()
  const posts = migrateBlogPosts()
  const pages = migrateStaticPages()
  const postCats = migratePostCategories()
  createSiteSettings()
  generateImportScript()

  console.log('\n═══════════════════════════════════════════')
  console.log('  ✅ MIGRATION FILES READY')
  console.log('═══════════════════════════════════════════')
  console.log(`  Categories:      ${categories.length - 1}`)
  console.log(`  Products:        ${products.length}`)
  console.log(`  Variants:        ${variants.length}`)
  console.log(`  Blog Posts:      ${posts.length}`)
  console.log(`  Static Pages:    ${pages.length}`)
  console.log(`  Post Categories: ${postCats.length}`)
  console.log('═══════════════════════════════════════════')
  console.log('\n  To import into Sanity:')
  console.log('  1. cd sanity')
  console.log('  2. npx sanity login')
  console.log('  3. cd ..')
  console.log('  4. import-to-sanity.bat')
  console.log('═══════════════════════════════════════════\n')
}

main().catch(console.error)
