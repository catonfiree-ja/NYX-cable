import { createClient } from '@sanity/client'
const c = createClient({
  projectId: '30wikoy9', dataset: 'production', apiVersion: '2024-01-01',
  token: 'skJ5kRM7I1M1vvpxPqnGUcwXMLfnMSzYhM9ee92f0dovI77y7EuvbzGjbQofg4ck1BXghdR47ExHM7wdjxhaUQpz6HGXRaYEUgeA6yRtRc579f55rUBADf0s7KPpyhO1zt1oAT9gFqiTo6GJRqRsYzDB81ZCiGJPNFWZ4rgY0qp7uCeUihs9',
  useCdn: false,
})
const p = await c.fetch(`*[_type=='product' && slug.current=='cvv'][0]{shortDescription}`)
const desc = p.shortDescription || ''
console.log('Has <table>:', desc.includes('<table'))
console.log('Length:', desc.length)
// Extract the table portion
const tableStart = desc.indexOf('<table')
const tableEnd = desc.indexOf('</table>') + 8
if (tableStart >= 0) {
  const table = desc.substring(tableStart, tableEnd)
  // Show first 500 chars of table
  console.log('\nTable HTML (first 800 chars):')
  console.log(table.substring(0, 800))
  // Count columns
  const thMatches = table.match(/<th[^>]*>/g) || []
  console.log('\nNumber of <th> tags:', thMatches.length)
  // Extract header text
  const headers = [...table.matchAll(/<th[^>]*>(.*?)<\/th>/gs)].map(m => m[1].replace(/<[^>]+>/g, '').trim())
  console.log('\nHeaders:', headers)
}
