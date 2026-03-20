// Update variant ndjson with real specs from original site
const fs = require('fs')

// Load scraped specs
const specs = JSON.parse(fs.readFileSync('migration/original-specs.json', 'utf8'))
console.log(`Loaded ${specs.length} specs from original site`)

// Load fixed variants (with parentProduct refs)
const vLines = fs.readFileSync('migration/variants-fixed.ndjson', 'utf8').split('\n').filter(l => l.trim())
const variants = vLines.map(l => JSON.parse(l))
console.log(`Loaded ${variants.length} variants`)

// Build lookup: model name → spec data
// The spec model is like "สายคอนโทรล YSLY-JZ 3G0.5" 
// The variant model/title is like "YSLY-JZ 3G0.5"
const specMap = new Map()
for (const s of specs) {
  // Extract the code part (e.g., "YSLY-JZ 3G0.5" from "สายคอนโทรล YSLY-JZ 3G0.5")
  const match = s.model.match(/(YSLY-[A-Z]+ \S+)/)
  if (match) {
    specMap.set(match[1].toUpperCase(), s)
  }
}
console.log(`Spec map has ${specMap.size} entries`)

let updated = 0, notFound = 0
for (const v of variants) {
  const vModel = (v.model || v.title || '').toUpperCase()
  const spec = specMap.get(vModel)
  
  if (spec) {
    // Update with real data
    v.outerDiameter = spec.outerDiameter
    v.totalWeight = spec.totalWeight
    v.copperWeight = spec.cuWeight
    v.conductorResistance = spec.conductorResistance
    // Clean up strands (remove HTML entities)
    v.strandsInfo = spec.strands.replace(/&#215;/g, '×').replace(/&times;/g, '×')
    updated++
  } else {
    // Try matching without the YSLY- prefix variations
    let found = false
    for (const [key, s] of specMap) {
      if (vModel === key || vModel.replace('YSLY-OZ ', 'YSLY-OZ ') === key) {
        v.outerDiameter = s.outerDiameter
        v.totalWeight = s.totalWeight
        v.copperWeight = s.cuWeight
        v.conductorResistance = s.conductorResistance
        v.strandsInfo = s.strands.replace(/&#215;/g, '×').replace(/&times;/g, '×')
        updated++
        found = true
        break
      }
    }
    if (!found) {
      console.log(`  NOT FOUND: "${v.model || v.title}"`)
      notFound++
    }
  }
}

console.log(`\nUpdated: ${updated}, Not found: ${notFound}`)

// Verify sample
const sample = variants.find(v => v.model === 'YSLY-JZ 3G0.5')
if (sample) {
  console.log('\nSample YSLY-JZ 3G0.5:')
  console.log('  OD:', sample.outerDiameter, '(should be 5.2)')
  console.log('  Weight:', sample.totalWeight, '(should be 47)')
  console.log('  Cu Weight:', sample.copperWeight, '(should be 14.4)')
  console.log('  Resistance:', sample.conductorResistance, '(should be 39)')
}

// Write updated variants
const output = variants.map(v => JSON.stringify(v)).join('\n')
fs.writeFileSync('migration/variants-fixed.ndjson', output)
console.log('\nWritten updated variants to migration/variants-fixed.ndjson')
