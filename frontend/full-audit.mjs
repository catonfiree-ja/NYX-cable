import { createClient } from '@sanity/client'
import crypto from 'crypto'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skJ5kRM7I1M1vvpxPqnGUcwXMLfnMSzYhM9ee92f0dovI77y7EuvbzGjbQofg4ck1BXghdR47ExHM7wdjxhaUQpz6HGXRaYEUgeA6yRtRc579f55rUBADf0s7KPpyhO1zt1oAT9gFqiTo6GJRqRsYzDB81ZCiGJPNFWZ4rgY0qp7uCeUihs9',
  useCdn: false,
})

const key = () => crypto.randomBytes(12).toString('hex').slice(0, 12)

function mkBlock(text, style = 'normal', marks = []) {
  return { _type: 'block', _key: key(), style, markDefs: [], children: [{ _type: 'span', _key: key(), text, marks }] }
}

function mkListBlock(text, listItem = 'bullet') {
  return { _type: 'block', _key: key(), style: 'normal', listItem, level: 1, markDefs: [], children: [{ _type: 'span', _key: key(), text, marks: [] }] }
}

function mkSpecTable(caption, headers, rows) {
  return { _type: 'specTable', _key: key(), caption, headers, rows }
}

// Extract Description tab content from HTML
function extractDescriptionTab(html) {
  // Method 1: Try WooCommerce Description tab
  const tabMatch = html.match(/<div[^>]*id="tab-description"[^>]*>([\s\S]*?)(?:<\/div>\s*<\/div>|<div[^>]*class="[^"]*related)/i)
  if (tabMatch) return tabMatch[1]
  
  // Method 2: Try woocommerce_tabs
  const tabsMatch = html.match(/<div[^>]*class="[^"]*woocommerce-Tabs[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<section|<div[^>]*class="[^"]*related)/i)
  if (tabsMatch) return tabsMatch[1]
  
  return ''
}

// Extract short description
function extractShortDesc(html) {
  const match = html.match(/<div[^>]*class="[^"]*woocommerce-product-details__short-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
  return match ? match[1] : ''
}

// Parse HTML tables into structured data
function parseTables(html) {
  const tables = []
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi
  let tableMatch
  while ((tableMatch = tableRegex.exec(html)) !== null) {
    const tableHtml = tableMatch[1]
    const rows = []
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi
    let rowMatch
    while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
      const cells = []
      const cellRegex = /<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi
      let cellMatch
      while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
        const text = cellMatch[1]
          .replace(/<br\s*\/?>/gi, ' ')
          .replace(/<[^>]+>/g, '')
          .replace(/&nbsp;/gi, ' ')
          .replace(/&amp;/gi, '&')
          .replace(/&#8211;/g, '–')
          .replace(/&#8230;/g, '…')
          .replace(/&#215;/g, '×')
          .replace(/\s+/g, ' ')
          .trim()
        cells.push(text)
      }
      if (cells.length > 0) rows.push(cells)
    }
    if (rows.length > 0) tables.push(rows)
  }
  return tables
}

// Convert HTML description to clean text blocks
function htmlToBlocks(html) {
  if (!html || html.trim().length < 10) return []
  
  const blocks = []
  const seenTexts = new Set()
  
  // Extract tables first
  const tables = parseTables(html)
  
  // Remove tables from HTML for text extraction
  let textHtml = html.replace(/<table[^>]*>[\s\S]*?<\/table>/gi, '{{TABLE}}')
  
  // Extract headings
  const headingRegex = /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi
  let headingMatch
  const headings = []
  while ((headingMatch = headingRegex.exec(textHtml)) !== null) {
    const tag = headingMatch[1].toLowerCase()
    const text = headingMatch[2].replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim()
    if (text.length > 2 && !seenTexts.has(text.toLowerCase())) {
      headings.push({ tag, text })
      seenTexts.add(text.toLowerCase())
    }
  }
  
  // Remove headings for paragraph extraction
  textHtml = textHtml.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, '')
  
  // Extract list items
  const listItems = []
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi
  let liMatch
  while ((liMatch = liRegex.exec(textHtml)) !== null) {
    const text = liMatch[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim()
    if (text.length > 3 && !seenTexts.has(text.toLowerCase())) {
      listItems.push(text)
      seenTexts.add(text.toLowerCase())
    }
  }
  
  // Remove lists
  textHtml = textHtml.replace(/<[ou]l[^>]*>[\s\S]*?<\/[ou]l>/gi, '')
  
  // Extract paragraphs
  const paragraphs = []
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi
  let pMatch
  while ((pMatch = pRegex.exec(textHtml)) !== null) {
    let text = pMatch[1]
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&#8211;/g, '–')
      .replace(/&#8230;/g, '…')
      .replace(/&#215;/g, '×')
      .replace(/\s+/g, ' ')
      .trim()
    if (text.length > 5 && !seenTexts.has(text.toLowerCase())) {
      paragraphs.push(text)
      seenTexts.add(text.toLowerCase())
    }
  }
  
  // Also try div-based content
  const divTexts = textHtml
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&#8230;/g, '…')
    .replace(/&#215;/g, '×')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 10 && !seenTexts.has(l.toLowerCase()))
  
  // Build blocks
  for (const h of headings) {
    const style = h.tag === 'h1' ? 'h2' : h.tag
    blocks.push(mkBlock(h.text, style))
  }
  
  for (const p of paragraphs) {
    blocks.push(mkBlock(p))
  }
  
  for (const li of listItems) {
    blocks.push(mkListBlock(li))
  }
  
  // Add tables as specTable
  for (const table of tables) {
    if (table.length < 2) continue
    const headers = table[0]
    const dataRows = table.slice(1).map(r => r.map(c => c || ''))
    // Only include tables with meaningful data  
    if (headers.some(h => h.length > 1) && dataRows.length > 0) {
      blocks.push(mkSpecTable('', headers, dataRows))
    }
  }
  
  // Add remaining div text that wasn't captured
  for (const t of divTexts.slice(0, 10)) {
    if (!seenTexts.has(t.toLowerCase())) {
      blocks.push(mkBlock(t))
      seenTexts.add(t.toLowerCase())
    }
  }
  
  return blocks
}

async function scrapeProduct(slug) {
  try {
    const url = `https://nyxcable.com/product/${slug}/`
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(15000),
    })
    if (!resp.ok) return { descHtml: '', shortDescHtml: '', fullHtml: '' }
    const html = await resp.text()
    
    const descHtml = extractDescriptionTab(html)
    const shortDescHtml = extractShortDesc(html)
    
    return { descHtml, shortDescHtml, fullHtml: html }
  } catch (e) {
    return { descHtml: '', shortDescHtml: '', fullHtml: '' }
  }
}

function getCmsDescText(blocks) {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter(b => b._type === 'block')
    .map(b => (b.children || []).map(c => c.text || '').join(''))
    .join(' ')
    .trim()
}

async function main() {
  console.log('📦 Fetching all products from Sanity...')
  const products = await client.fetch(`
    *[_type == "product"] | order(orderRank asc) {
      _id, title, "slug": slug.current, shortDescription, description
    }
  `)
  
  console.log(`Total: ${products.length} products\n`)
  
  const results = { perfect: [], enriched: [], needsFix: [], noOriginal: [], errors: [] }
  
  for (const p of products) {
    if (!p.slug) continue
    
    process.stdout.write(`🔍 ${p.slug}... `)
    
    // Scrape original
    const { descHtml, shortDescHtml } = await scrapeProduct(p.slug)
    
    // Extract original text content
    const origDescText = descHtml
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&#\d+;/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    
    const cmsDescText = getCmsDescText(p.description)
    const cmsBlocks = Array.isArray(p.description) ? p.description : []
    const hasSpecTable = cmsBlocks.some(b => b._type === 'specTable')
    
    // Compare content lengths
    const origLen = origDescText.length
    const cmsLen = cmsDescText.length
    
    if (origLen === 0) {
      // Original site has no Description tab
      console.log(`⬜ no original desc (CMS: ${cmsLen} chars)`)
      results.noOriginal.push(p.slug)
      await new Promise(r => setTimeout(r, 200))
      continue
    }
    
    // Check coverage: does CMS contain the key content from original?
    const origWords = origDescText.split(/\s+/).filter(w => w.length > 3)
    const cmsText = cmsDescText.toLowerCase()
    const matchedWords = origWords.filter(w => cmsText.includes(w.toLowerCase()))
    const coverage = origWords.length > 0 ? matchedWords.length / origWords.length : 1
    
    // Check if original has tables that CMS doesn't
    const origTables = parseTables(descHtml)
    const origHasTables = origTables.some(t => t.length > 2)
    
    if (coverage > 0.6 && (!origHasTables || hasSpecTable)) {
      console.log(`✅ good coverage ${(coverage*100).toFixed(0)}% (orig: ${origLen}, cms: ${cmsLen})`)
      results.perfect.push(p.slug)
    } else {
      // Need to enrich CMS with original content
      console.log(`⚠️ low coverage ${(coverage*100).toFixed(0)}% (orig: ${origLen}, cms: ${cmsLen}) tables:${origHasTables}`)
      
      // Build enriched description from original
      const origBlocks = htmlToBlocks(descHtml)
      
      if (origBlocks.length > 0) {
        // Merge: keep existing specTable blocks from CMS, add new content from original
        const existingSpecTables = cmsBlocks.filter(b => b._type === 'specTable')
        const newBlocks = [...origBlocks]
        
        // Add existing spec tables if not already present
        for (const st of existingSpecTables) {
          if (!newBlocks.some(b => b._type === 'specTable')) {
            newBlocks.push(st)
          }
        }
        
        // Add "สินค้ามีในสต๊อกพร้อมส่ง" at end if not present
        const lastText = (newBlocks[newBlocks.length - 1]?.children || []).map(c => c.text || '').join('')
        if (!lastText.includes('สต๊อก')) {
          newBlocks.push(mkBlock('สินค้ามีในสต๊อกพร้อมส่ง', 'normal', ['strong']))
        }
        
        // Update CMS
        try {
          await client.patch(p._id).set({ description: newBlocks }).commit()
          console.log(`   → UPDATED: ${cmsBlocks.length} → ${newBlocks.length} blocks`)
          results.enriched.push(p.slug)
        } catch (e) {
          console.log(`   → ERROR: ${e.message}`)
          results.errors.push(p.slug)
        }
      } else {
        console.log(`   → no blocks extracted from original`)
        results.needsFix.push(p.slug)
      }
    }
    
    await new Promise(r => setTimeout(r, 300))
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 FINAL REPORT')
  console.log('='.repeat(60))
  console.log(`✅ Good coverage (${results.perfect.length}): ${results.perfect.join(', ')}`)
  console.log(`🔄 Enriched (${results.enriched.length}): ${results.enriched.join(', ')}`)
  console.log(`⬜ No original desc (${results.noOriginal.length}): ${results.noOriginal.join(', ')}`)
  console.log(`⚠️ Needs manual fix (${results.needsFix.length}): ${results.needsFix.join(', ')}`)
  console.log(`❌ Errors (${results.errors.length}): ${results.errors.join(', ')}`)
}

main().catch(console.error)
