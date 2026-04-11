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

const HTML_TAGS = new Set([
  'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'ul', 'ol', 'li', 'table', 'thead',
  'tbody', 'tr', 'th', 'td', 'span', 'strong', 'em',
  'a', 'br', 'hr', 'img', 'figure', 'figcaption',
  'section', 'article', 'header', 'footer', 'nav',
  'pre', 'code', 'sup', 'sub', 'b', 'i', 'u',
])

// Skip products that already have clean descriptions
const SKIP_SLUGS = new Set(['cvv', 'vct', 'multicore-cable', 'h05v-k', 'h07v-k'])

function mkBlock(text, style = 'normal', marks = []) {
  return {
    _type: 'block',
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks }],
  }
}

// Scrape original site and extract Description tab content
async function scrapeOriginal(slug) {
  try {
    const url = `https://nyxcable.com/product/${slug}/`
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(15000),
    })
    if (!resp.ok) return null
    const html = await resp.text()
    
    // Extract Description tab content
    // Look for woocommerce Description tab or main content area
    let descHtml = ''
    
    // Try to find Description tab panel content
    const tabMatch = html.match(/id="tab-description"[^>]*>([\s\S]*?)<\/div>/i)
    if (tabMatch) {
      descHtml = tabMatch[1]
    }
    
    // Extract text from HTML
    const text = descHtml
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/h[1-6]>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<[^>]+>/g, '')  // Remove remaining tags
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#8211;/g, '–')
      .replace(/&#8230;/g, '…')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
    
    return text || null
  } catch (e) {
    return null
  }
}

// Clean existing dirty description blocks
function cleanDescription(blocks) {
  if (!Array.isArray(blocks)) return []
  
  const seenTexts = new Set()
  const cleaned = []
  let prevWasTag = null  // Track tag name for setting heading style
  
  for (const block of blocks) {
    if (block._type !== 'block') {
      // Keep non-block types (specTable, etc.)
      cleaned.push(block)
      continue
    }
    
    const children = block.children || []
    const fullText = children.map(c => c.text || '').join('').trim()
    
    if (!fullText) continue
    
    const lower = fullText.toLowerCase().trim()
    
    // Skip HTML tag name blocks
    if (HTML_TAGS.has(lower)) {
      prevWasTag = lower
      continue
    }
    
    // Skip duplicate text
    const dedup = lower.replace(/\s+/g, ' ')
    if (seenTexts.has(dedup)) continue
    seenTexts.add(dedup)
    
    // Skip very short fragments (< 8 chars, likely table remnants)
    if (fullText.length < 8 && !/[ก-๙]/.test(fullText)) continue
    
    // Skip numeric-only or table-cell-like values
    if (/^\d+[\.,]?\d*\s*(mm|kg|ohm|kv|v|a|°c|%)?$/i.test(fullText)) continue
    if (/^\d+x\d/i.test(fullText) && fullText.length < 30) continue
    
    // Skip WordPress table remnant patterns
    if (/^(conductor|resistance|strand|weight|diameter|current|voltage|bending)/i.test(fullText) && fullText.length < 50) continue
    
    // Determine style based on previous tag (if it was an HTML tag name)
    let style = block.style || 'normal'
    if (prevWasTag) {
      if (prevWasTag === 'h1' || prevWasTag === 'h2') style = 'h2'
      else if (prevWasTag === 'h3') style = 'h3'
      else if (prevWasTag === 'h4') style = 'h4'
      prevWasTag = null
    }
    
    // Build cleaned block
    cleaned.push({
      _type: 'block',
      _key: key(),
      style,
      markDefs: block.markDefs || [],
      listItem: block.listItem,
      level: block.level,
      children: children.map(c => ({
        _type: 'span',
        _key: key(),
        text: c.text || '',
        marks: c.marks || [],
      })),
    })
  }
  
  return cleaned
}

async function main() {
  console.log('📦 Fetching all products from Sanity...')
  const products = await client.fetch(`
    *[_type == "product"] {
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      description
    }
  `)
  
  console.log(`Total: ${products.length} products\n`)
  
  let updated = 0
  let skipped = 0
  let errors = 0
  
  for (const p of products) {
    if (!p.slug) continue
    if (SKIP_SLUGS.has(p.slug)) {
      console.log(`⏭️  ${p.slug} — already clean, skipping`)
      skipped++
      continue
    }
    
    const descBlocks = p.description || []
    const blockCount = Array.isArray(descBlocks) ? descBlocks.length : 0
    
    // Check if description is dirty (has HTML tag text blocks)
    let isDirty = false
    if (Array.isArray(descBlocks)) {
      for (const b of descBlocks.slice(0, 10)) {
        if (b._type === 'block') {
          const text = (b.children || []).map(c => c.text || '').join('').trim().toLowerCase()
          if (HTML_TAGS.has(text)) {
            isDirty = true
            break
          }
        }
      }
    }
    
    if (!isDirty && blockCount > 0) {
      console.log(`⏭️  ${p.slug} — ${blockCount} blocks, not dirty, skipping`)
      skipped++
      continue
    }
    
    // === Clean or build description ===
    let newDesc = []
    
    if (isDirty && blockCount > 0) {
      // Clean existing dirty blocks
      newDesc = cleanDescription(descBlocks)
      
      // Cap at 50 blocks max (remove WordPress table dumps)
      if (newDesc.length > 50) {
        newDesc = newDesc.slice(0, 50)
      }
    }
    
    // If no meaningful content after cleaning, try to scrape original site
    if (newDesc.length < 2) {
      console.log(`  🌐 Scraping nyxcable.com/product/${p.slug}/...`)
      const scraped = await scrapeOriginal(p.slug)
      
      if (scraped && scraped.length > 20) {
        // Build blocks from scraped text
        const lines = scraped.split('\n').map(l => l.trim()).filter(l => l.length > 0)
        newDesc = lines.slice(0, 30).map(line => mkBlock(line))
      }
    }
    
    // If still empty, build minimal description from shortDescription
    if (newDesc.length < 1 && p.shortDescription) {
      // Extract first sentence as heading
      const firstSentence = p.shortDescription.split('\n')[0]?.trim()
      if (firstSentence) {
        newDesc = [
          mkBlock(firstSentence),
          mkBlock('สินค้ามีในสต๊อกพร้อมส่ง', 'normal', ['strong']),
        ]
      }
    }
    
    if (newDesc.length === 0) {
      console.log(`  ⚠️  ${p.slug} — no content to set, skipping`)
      skipped++
      continue
    }
    
    // Add "สินค้ามีในสต๊อกพร้อมส่ง" if not already present
    const lastText = (newDesc[newDesc.length - 1]?.children || []).map(c => c.text || '').join('')
    if (!lastText.includes('สต๊อก') && !lastText.includes('สินค้ามี')) {
      newDesc.push(mkBlock('สินค้ามีในสต๊อกพร้อมส่ง', 'normal', ['strong']))
    }
    
    // Patch Sanity
    try {
      await client.patch(p._id).set({ description: newDesc }).commit()
      console.log(`  ✅ ${p.slug} — ${blockCount} → ${newDesc.length} blocks`)
      updated++
    } catch (e) {
      console.log(`  ❌ ${p.slug} — ERROR: ${e.message}`)
      errors++
    }
    
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 300))
  }
  
  console.log(`\n🎉 Migration complete!`)
  console.log(`  ✅ Updated: ${updated}`)
  console.log(`  ⏭️  Skipped: ${skipped}`)
  console.log(`  ❌ Errors: ${errors}`)
}

main().catch(console.error)
