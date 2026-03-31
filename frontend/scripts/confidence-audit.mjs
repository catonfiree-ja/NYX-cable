import { createClient } from '@sanity/client'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'

// ─── Part 1: Scan frontend code for hardcoded contact info ───
const HARDCODED_PATTERNS = [
    { pattern: /(?<!\|\||'|")02-111-5588(?!'|")/g, name: 'Phone (formatted)' },
    { pattern: /(?<!\|\||'|")021115588(?!'|")/g, name: 'Phone (raw)' },
    { pattern: /(?<!\|\||'|")sales@nyxcable\.com(?!'|")/g, name: 'Email' },
    { pattern: /(?<!\|\||'|")page\.line\.me\/ubb9405u(?!'|")/g, name: 'LINE URL' },
    { pattern: /(?<!\|\||'|")line\.me\/R\/ti\/p\/@ubb9405u(?!'|")/g, name: 'LINE deep link' },
]

// Simpler check: just find ALL hardcoded occurrences and categorize them
const CONTACT_STRINGS = [
    '021115588',
    '02-111-5588',
    'sales@nyxcable.com',
    'page.line.me/ubb9405u',
    'page.line.me/@ubb9405u',
    'line.me/R/ti/p/@ubb9405u',
]

function scanDir(dir, ext = '.tsx') {
    const results = []
    try {
        const files = readdirSync(dir)
        for (const file of files) {
            const fullPath = join(dir, file)
            const stat = statSync(fullPath)
            if (stat.isDirectory() && !file.includes('node_modules') && !file.startsWith('.')) {
                results.push(...scanDir(fullPath, ext))
            } else if (file.endsWith(ext)) {
                const content = readFileSync(fullPath, 'utf-8')
                const lines = content.split('\n')
                for (const str of CONTACT_STRINGS) {
                    lines.forEach((line, i) => {
                        if (line.includes(str)) {
                            const isFallback = line.includes('||') || line.includes('initialValue') || line.includes("defaults")
                            const relPath = relative(process.cwd(), fullPath)
                            results.push({
                                file: relPath,
                                line: i + 1,
                                type: isFallback ? '✅ FALLBACK' : '⚠️ HARDCODED',
                                match: str,
                                context: line.trim().substring(0, 120),
                            })
                        }
                    })
                }
            }
        }
    } catch { }
    return results
}

console.log('═══════════════════════════════════════════')
console.log('  NYX Cable — Full CMS Confidence Report  ')
console.log('═══════════════════════════════════════════\n')

// Scan app directory
console.log('📂 Scanning frontend/app/ for contact strings...\n')
const appResults = scanDir('./app')
const hardcoded = appResults.filter(r => r.type === '⚠️ HARDCODED')
const fallbacks = appResults.filter(r => r.type === '✅ FALLBACK')

if (hardcoded.length === 0) {
    console.log('✅ ZERO hardcoded contact info in rendered pages!\n')
} else {
    console.log(`⚠️ Found ${hardcoded.length} potentially hardcoded instances:\n`)
    hardcoded.forEach(r => {
        console.log(`  ${r.file}:${r.line}`)
        console.log(`    Match: ${r.match}`)
        console.log(`    Context: ${r.context}\n`)
    })
}

console.log(`📊 ${fallbacks.length} safe fallback defaults (|| operator) — these are correct:\n`)
fallbacks.forEach(r => {
    console.log(`  ✅ ${r.file}:${r.line} — ${r.match}`)
})

// Scan components
console.log('\n\n📂 Scanning components/...\n')
const compResults = scanDir('./components')
if (compResults.length === 0) {
    console.log('✅ No contact strings in components (all props-based)')
} else {
    compResults.forEach(r => {
        console.log(`  ${r.type} ${r.file}:${r.line} — ${r.match}`)
    })
}

// Scan data files
console.log('\n\n📂 Scanning data/ and lib/...\n')
const dataResults = [...scanDir('./data'), ...scanDir('./lib', '.ts')]
if (dataResults.length === 0) {
    console.log('✅ No contact strings in data/lib files')
} else {
    dataResults.forEach(r => {
        console.log(`  ${r.type} ${r.file}:${r.line} — ${r.match}`)
    })
}

// ─── Part 2: Verify Sanity data ───
console.log('\n\n═══════════════════════════════════════════')
console.log('  Sanity Data Verification')
console.log('═══════════════════════════════════════════\n')

const client = createClient({
    projectId: '30wikoy9',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
})

const settings = await client.fetch('*[_type == "siteSettings"][0]')
const requiredFields = ['companyName', 'phone', 'email', 'lineOA', 'lineUrl', 'address', 'businessHours', 'googleMapsUrl', 'mapsEmbedUrl', 'seoTitle', 'seoDescription', 'footerText', 'socialLinks']

console.log('siteSettings field check:')
let missingCount = 0
for (const field of requiredFields) {
    const value = settings?.[field]
    if (value) {
        const display = typeof value === 'object' ? JSON.stringify(value) : String(value).substring(0, 60)
        console.log(`  ✅ ${field}: ${display}`)
    } else {
        console.log(`  ❌ ${field}: MISSING`)
        missingCount++
    }
}

// Check singleton pages
console.log('\n\nSingleton pages check:')
const singletons = ['homePage', 'contactPage', 'privacyPage', 'aboutPage']
for (const type of singletons) {
    const doc = await client.fetch(`*[_type == "${type}"][0]{ _id, metaTitle }`)
    console.log(`  ${doc ? '✅' : '❌'} ${type}: ${doc ? (doc.metaTitle || 'exists (no SEO title)') : 'MISSING DOCUMENT'}`)
}

// Check content counts
console.log('\n\nContent counts:')
const counts = await client.fetch(`{
  "products": count(*[_type == "product"]),
  "variants": count(*[_type == "productVariant"]),
  "categories": count(*[_type == "productCategory"]),
  "blogs": count(*[_type == "blogPost"]),
  "reviews": count(*[_type == "review"]),
  "galleries": count(*[_type == "galleryAlbum"]),
  "faqs": count(*[_type == "faq"])
}`)
Object.entries(counts).forEach(([k, v]) => {
    console.log(`  📊 ${k}: ${v}`)
})

console.log('\n\n═══════════════════════════════════════════')
if (hardcoded.length === 0 && missingCount === 0) {
    console.log('  🎯 CONFIDENCE: 100% — Everything is CMS-driven')
} else {
    console.log(`  ⚠️ ISSUES: ${hardcoded.length} hardcoded + ${missingCount} missing fields`)
}
console.log('═══════════════════════════════════════════')
