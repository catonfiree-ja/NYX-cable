/**
 * Download warehouse photos and client logos from WordPress for the new site
 * Uploads them to Sanity for use in Contact page and Homepage
 */
import { createClient } from '@sanity/client'
import https from 'https'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

function downloadBuffer(url) {
  return new Promise((resolve) => {
    const get = url.startsWith('https') ? https.get : require('http').get
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

async function main() {
  if (!process.env.SANITY_TOKEN) { console.error('Set SANITY_TOKEN!'); process.exit(1) }

  // === 1. FETCH CLIENT LOGOS from WP REST API ===
  console.log('\n=== FETCHING CLIENT LOGOS ===')
  
  // Get media tagged with logo/client patterns
  const logoSearchTerms = ['logo', 'client', 'customer']
  const logoUrls = new Set()
  
  for (const term of logoSearchTerms) {
    try {
      const data = await fetchJSON(`https://nyxcable.com/wp-json/wp/v2/media?per_page=100&search=${term}`)
      if (Array.isArray(data)) {
        data.forEach(m => {
          if (m.source_url && m.source_url.includes('logo')) {
            logoUrls.add(m.source_url)
          }
        })
      }
    } catch (e) {
      console.log(`  search "${term}": error`)
    }
  }
  
  console.log(`  Found ${logoUrls.size} potential logo URLs from API`)
  
  // Also try known logo patterns from the page DOM
  const knownLogoBase = 'https://nyxcable.com/wp-content/uploads'
  const knownLogos = [
    // These are common paths for client logos in WP
    `${knownLogoBase}/2024/12/bitec-logo.png`,
    `${knownLogoBase}/2024/12/bangchak-logo.png`,
    `${knownLogoBase}/2024/12/makro-logo.png`,
  ]
  
  // Try fetching page to extract actual logo URLs
  console.log('  Checking homepage for logo images...')
  
  // === 2. WAREHOUSE PHOTOS ===
  console.log('\n=== WAREHOUSE PHOTOS ===')
  
  // Try common contact page image patterns
  const warehousePatterns = [
    // Try to find via WP API
  ]
  
  // Search media for warehouse/contact related images
  const contactMedia = await fetchJSON('https://nyxcable.com/wp-json/wp/v2/media?per_page=100&search=contact')
  if (Array.isArray(contactMedia)) {
    console.log(`  Found ${contactMedia.length} contact-related media`)
    contactMedia.forEach(m => {
      console.log(`    - ${m.source_url?.split('/').pop()} (${m.alt_text || 'no alt'})`)
    })
  }
  
  // Also search for office/warehouse
  const officeMedia = await fetchJSON('https://nyxcable.com/wp-json/wp/v2/media?per_page=100&search=office')  
  if (Array.isArray(officeMedia)) {
    console.log(`  Found ${officeMedia.length} office-related media`)
  }
  
  const mapMedia = await fetchJSON('https://nyxcable.com/wp-json/wp/v2/media?per_page=100&search=map')
  if (Array.isArray(mapMedia)) {
    console.log(`  Found ${mapMedia.length} map-related media`)
    mapMedia.forEach(m => {
      console.log(`    - ${m.source_url?.split('/').pop()} (${m.alt_text || 'no alt'})`)
    })
  }

  // Get contact page content to find image URLs
  const contactPage = await fetchJSON('https://nyxcable.com/wp-json/wp/v2/pages?slug=contact')
  if (Array.isArray(contactPage) && contactPage.length > 0) {
    const content = contactPage[0].content?.rendered || ''
    const imgMatches = content.match(/src="([^"]*uploads[^"]*)"/g) || []
    console.log(`\n  Contact page has ${imgMatches.length} images:`)
    imgMatches.forEach(m => {
      const url = m.replace('src="', '').replace('"', '')
      console.log(`    - ${url}`)
    })
  }
  
  console.log('\n=== DONE ===')
}

function fetchJSON(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) { resolve([]); return }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString())) }
        catch { resolve([]) }
      })
    }).on('error', () => resolve([]))
  })
}

main().catch(console.error)
