// Scrape variant spec table data from original nyxcable.com
const https = require('https')
const http = require('http')

function fetch(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve).catch(reject)
      }
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(data))
    }).on('error', reject)
  })
}

async function main() {
  console.log('Fetching page...')
  const html = await fetch('https://nyxcable.com/product/ysly-jz/')
  
  // Extract table rows using regex (no external deps needed)
  // The table has header: Core x Conductor Size, Model, NO of strands, Outer Dia, Cu Weight, Weight, Conductor Resistance
  const tableMatch = html.match(/<table[\s\S]*?<\/table>/gi)
  if (!tableMatch) {
    console.log('No tables found!')
    return
  }
  
  console.log(`Found ${tableMatch.length} tables`)
  
  const results = []
  for (const table of tableMatch) {
    const rows = table.match(/<tr[\s\S]*?<\/tr>/gi)
    if (!rows || rows.length < 5) continue // Skip small tables
    
    console.log(`Table with ${rows.length} rows`)
    
    for (const row of rows) {
      const cells = row.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)
      if (!cells || cells.length < 5) continue
      
      const values = cells.map(c => {
        // Strip HTML tags and get text content
        return c.replace(/<[^>]+>/g, '').trim()
      })
      
      // Skip header row
      if (values[0] && values[0].includes('Conductor')) continue
      if (values[0] && values[0].includes('mm2')) continue
      
      // Parse: [coreSize, model, strands, outerDia, cuWeight, weight, resistance]
      if (values.length >= 7 && values[0].match(/\d+[GX]/i)) {
        results.push({
          coreSize: values[0],
          model: values[1],
          strands: values[2],
          outerDiameter: parseFloat(values[3]) || null,
          cuWeight: parseFloat(values[4]) || null,
          totalWeight: parseFloat(values[5]) || null,
          conductorResistance: parseFloat(values[6]) || null
        })
      }
    }
  }
  
  console.log(`\nExtracted ${results.length} variant specs`)
  results.slice(0, 5).forEach(r => console.log(JSON.stringify(r)))
  console.log('...')
  results.slice(-3).forEach(r => console.log(JSON.stringify(r)))
  
  // Save full results
  const fs = require('fs')
  fs.writeFileSync('migration/original-specs.json', JSON.stringify(results, null, 2))
  console.log('\nSaved to migration/original-specs.json')
}

main().catch(err => console.error('Error:', err.message))
