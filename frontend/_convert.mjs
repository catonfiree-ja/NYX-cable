import { readFileSync, writeFileSync } from 'fs'

const parsed = JSON.parse(readFileSync('_parsed_tables.json', 'utf8'))
const specs = JSON.parse(readFileSync('./data/product-specs.json', 'utf8'))

// === CVV ===
// 1 table, 2-level headers, 9 cols, 117 rows
const cvv = parsed.cvv[0]
specs['cvv'] = {
  sheetName: 'สาย CVV / CVV-F',
  productUrl: '/product/cvv',
  headers: cvv.headerRows[0].map((h, i) => ({
    key: `col${i}`,
    label: h,
    subLabel: cvv.headerRows[1]?.[i] || null
  })),
  items: cvv.dataRows.map(row => {
    const obj = {}
    cvv.headerRows[0].forEach((_, i) => { obj[`col${i}`] = row[i] || '' })
    return obj
  }),
  count: cvv.dataRows.length,
  tabKey: 'col0', // Group by "Number of cores" (จำนวนแกน)
  tabLabel: 'แกน',
  searchKeys: ['col0', 'col1', 'col8'] // cores, cross-section, price
}

// === H07RN-F ===
// 1 table, 1-level header, 7 cols, 66 rows
const h07rnf = parsed['h07rn-f'][0]
specs['h07rn-f'] = {
  sheetName: 'สาย H07RN-F',
  productUrl: '/product/h07rn-f',
  headers: h07rnf.headerRows[0].map((h, i) => ({
    key: `col${i}`,
    label: h,
    subLabel: null
  })),
  items: h07rnf.dataRows.map(row => {
    const obj = {}
    h07rnf.headerRows[0].forEach((_, i) => { obj[`col${i}`] = row[i] || '' })
    return obj
  }),
  count: h07rnf.dataRows.length,
  tabKey: null, // No tabs - size is in col0 as model
  searchKeys: ['col0', 'col6']
}

// === RS485-RS422-BELDEN ===
// 2 tables — separate entries
const belden = parsed['rs485-rs422-belden']
specs['rs485-rs422-belden'] = {
  sheetName: 'RS485/RS422 Belden',
  productUrl: '/product/rs485-rs422-belden',
  tables: belden.map((t, idx) => ({
    title: t.title,
    headers: t.headerRows[0].map((h, i) => ({
      key: `col${i}`,
      label: h,
      subLabel: t.headerRows[1]?.[i] || null
    })),
    items: t.dataRows.map(row => {
      const obj = {}
      t.headerRows[0].forEach((_, i) => { obj[`col${i}`] = row[i] || '' })
      return obj
    }),
    count: t.dataRows.length
  })),
  count: belden.reduce((sum, t) => sum + t.dataRows.length, 0)
}

// === VCT ===
// 3 tables — separate entries
const vct = parsed.vct
specs['vct'] = {
  sheetName: 'สาย VCT / VCT-G',
  productUrl: '/product/vct',
  tables: vct.map((t, idx) => ({
    title: t.title,
    headers: t.headerRows[0].map((h, i) => ({
      key: `col${i}`,
      label: h,
      subLabel: t.headerRows[1]?.[i] || null
    })),
    items: t.dataRows.map(row => {
      const obj = {}
      t.headerRows[0].forEach((_, i) => { obj[`col${i}`] = row[i] || '' })
      return obj
    }),
    count: t.dataRows.length
  })),
  count: vct.reduce((sum, t) => sum + t.dataRows.length, 0)
}

writeFileSync('./data/product-specs.json', JSON.stringify(specs, null, 2))
console.log('✅ Updated product-specs.json')
console.log(`  CVV: ${specs.cvv.count} items, ${specs.cvv.headers.length} cols`)
console.log(`  H07RN-F: ${specs['h07rn-f'].count} items, ${specs['h07rn-f'].headers.length} cols`)
console.log(`  RS485-RS422-Belden: ${specs['rs485-rs422-belden'].count} items, ${specs['rs485-rs422-belden'].tables.length} tables`)
console.log(`  VCT: ${specs.vct.count} items, ${specs.vct.tables.length} tables`)
