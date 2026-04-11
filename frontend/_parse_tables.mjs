import { createClient } from '@sanity/client'
import { writeFileSync, readFileSync } from 'fs'

const c = createClient({
  projectId: '30wikoy9', dataset: 'production', apiVersion: '2024-01-01',
  token: 'skJ5kRM7I1M1vvpxPqnGUcwXMLfnMSzYhM9ee92f0dovI77y7EuvbzGjbQofg4ck1BXghdR47ExHM7wdjxhaUQpz6HGXRaYEUgeA6yRtRc579f55rUBADf0s7KPpyhO1zt1oAT9gFqiTo6GJRqRsYzDB81ZCiGJPNFWZ4rgY0qp7uCeUihs9',
  useCdn: false,
})

const slugs = ['cvv', 'h07rn-f', 'rs485-rs422-belden', 'vct']

function parseHtmlTable(html) {
  // Extract all tables
  const tables = []
  const tableRe = /<table[^>]*>([\s\S]*?)<\/table>/g
  let tableMatch
  while ((tableMatch = tableRe.exec(html))) {
    const tableHtml = tableMatch[1]
    
    // Extract thead headers (may have 2 rows)
    const theadMatch = tableHtml.match(/<thead>([\s\S]*?)<\/thead>/)
    const headerRows = []
    if (theadMatch) {
      const rowRe = /<tr>([\s\S]*?)<\/tr>/g
      let rowMatch
      while ((rowMatch = rowRe.exec(theadMatch[1]))) {
        const cells = [...rowMatch[1].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map(m => 
          m[1].replace(/<[^>]+>/g, '').trim()
        )
        headerRows.push(cells)
      }
    }
    
    // Extract tbody data rows
    const tbodyMatch = tableHtml.match(/<tbody>([\s\S]*?)<\/tbody>/)
    const dataRows = []
    if (tbodyMatch) {
      const rowRe = /<tr>([\s\S]*?)<\/tr>/g
      let rowMatch
      while ((rowMatch = rowRe.exec(tbodyMatch[1]))) {
        const cells = [...rowMatch[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(m =>
          m[1].replace(/<[^>]+>/g, '').trim()
        )
        if (cells.length > 0) dataRows.push(cells)
      }
    }
    
    tables.push({ headerRows, dataRows })
  }
  return tables
}

// Get the text before a table to use as section title
function getSectionTitle(html, tableStartIndex) {
  const before = html.substring(0, tableStartIndex)
  // Find last <h2>, <h3>, <h4>, or <strong> before the table
  const matches = [...before.matchAll(/<(?:h[2-4]|strong)[^>]*>([\s\S]*?)<\/(?:h[2-4]|strong)>/g)]
  if (matches.length > 0) {
    return matches[matches.length - 1][1].replace(/<[^>]+>/g, '').trim()
  }
  return null
}

const results = {}

for (const slug of slugs) {
  console.log(`\n=== ${slug.toUpperCase()} ===`)
  const p = await c.fetch(`*[_type=='product' && slug.current==$slug][0]{shortDescription}`, { slug })
  
  if (!p?.shortDescription) {
    console.log('  No shortDescription')
    continue
  }
  
  const html = p.shortDescription
  const tables = parseHtmlTable(html)
  
  console.log(`  Found ${tables.length} table(s)`)
  
  // Find section titles for each table
  const tableRe = /<table[^>]*>/g
  const tablePositions = []
  let tMatch
  while ((tMatch = tableRe.exec(html))) {
    tablePositions.push(tMatch.index)
  }
  
  for (let i = 0; i < tables.length; i++) {
    const t = tables[i]
    const title = tablePositions[i] ? getSectionTitle(html, tablePositions[i]) : null
    console.log(`\n  Table ${i + 1}: "${title || 'untitled'}"`)
    console.log(`    Header rows: ${t.headerRows.length}`)
    t.headerRows.forEach((row, idx) => console.log(`      Row ${idx}: [${row.join(' | ')}]`))
    console.log(`    Data rows: ${t.dataRows.length}`)
    if (t.dataRows.length > 0) {
      console.log(`    Columns per data row: ${t.dataRows[0].length}`)
      console.log(`    First row: [${t.dataRows[0].join(' | ')}]`)
      console.log(`    Last row:  [${t.dataRows[t.dataRows.length - 1].join(' | ')}]`)
    }
    
    // Store for JSON generation
    if (!results[slug]) results[slug] = []
    results[slug].push({
      title,
      headerRows: t.headerRows,
      dataRows: t.dataRows,
      colCount: t.headerRows[0]?.length || 0
    })
  }
}

// Write raw parsed data for inspection
writeFileSync('_parsed_tables.json', JSON.stringify(results, null, 2))
console.log('\n\nWritten _parsed_tables.json')
