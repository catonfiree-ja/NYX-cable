import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const product = await client.fetch(`*[_type == "product" && slug.current == "multicore-cable"][0]{
  _id, title,
  "descLength": count(description),
  "firstBlock": description[0],
  "faqCount": count(faqItems),
  "descSample": description[0..2]
}`)

console.log('Product:', product.title)
console.log('Desc block count:', product.descLength)
console.log('FAQ count:', product.faqCount)
console.log('')
console.log('First block type:', product.firstBlock?._type)
console.log('First block text:', product.firstBlock?.children?.[0]?.text?.substring(0, 100))
console.log('')
if (typeof product.descLength === 'number' && product.descLength === 0) {
  console.log('⚠️  description might be a STRING, not array!')
}
if (product.firstBlock?._type === 'block') {
  console.log('✅ Description is Portable Text (array of blocks)')
} else if (typeof product.firstBlock === 'string') {
  console.log('❌ Description is a plain string:', product.firstBlock.substring(0, 200))
} else {
  console.log('First block raw:', JSON.stringify(product.firstBlock, null, 2)?.substring(0, 500))
}
