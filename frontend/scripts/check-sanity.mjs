import { createClient } from 'next-sanity'

const c = createClient({
    projectId: '30wikoy9',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
})

const [products, categories] = await Promise.all([
    c.fetch('count(*[_type == "product"])'),
    c.fetch('count(*[_type == "productCategory"])'),
])
console.log('Products in Sanity:', products)
console.log('Categories in Sanity:', categories)

// List category slugs
const cats = await c.fetch('*[_type == "productCategory"]{title, "slug": slug.current}')
console.log('\nCategory slugs:')
cats.forEach(cat => console.log(`  - ${cat.slug}: ${cat.title}`))

// List product slugs  
const prods = await c.fetch('*[_type == "product"]{title, "slug": slug.current, productCode} | order(title asc)')
console.log('\nProduct slugs:')
prods.forEach(p => console.log(`  - ${p.slug}: ${p.title} (${p.productCode || 'no code'})`))
