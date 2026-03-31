import { createClient } from '@sanity/client'

const client = createClient({
    projectId: '30wikoy9',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
})

// Check all document types
const types = [
    'homePage',
    'contactPage',
    'privacyPage',
    'aboutPage',
    'productCategory',
    'product',
    'blogPost',
    'review',
    'galleryAlbum',
    'faq',
    'page',
]

console.log('=== Sanity Data Audit ===\n')

for (const type of types) {
    const docs = await client.fetch(`*[_type == "${type}"]{ _id, title, metaTitle, metaDescription }`)
    console.log(`📄 ${type}: ${docs.length} document(s)`)
    if (docs.length > 0 && docs.length <= 5) {
        docs.forEach(d => {
            console.log(`   - ${d.title || d._id}`)
            if (d.metaTitle) console.log(`     SEO Title: ${d.metaTitle}`)
            if (d.metaDescription) console.log(`     SEO Desc: ${d.metaDescription?.substring(0, 60)}...`)
        })
    } else if (docs.length > 5) {
        docs.slice(0, 3).forEach(d => console.log(`   - ${d.title || d._id}`))
        console.log(`   ... and ${docs.length - 3} more`)
    }
    console.log('')
}

// Check homepage specific data
console.log('=== Homepage Data ===')
const home = await client.fetch(`*[_type == "homePage"][0]`)
console.log(JSON.stringify(home, null, 2))

console.log('\n=== Contact Page Data ===')
const contact = await client.fetch(`*[_type == "contactPage"][0]`)
console.log(JSON.stringify(contact, null, 2))

console.log('\n=== Privacy Page Data ===')
const privacy = await client.fetch(`*[_type == "privacyPage"][0]`)
console.log(JSON.stringify(privacy, null, 2))

console.log('\n=== About Page Data ===')
const about = await client.fetch(`*[_type == "aboutPage"][0]`)
if (about) {
    console.log('Fields present:', Object.keys(about).filter(k => !k.startsWith('_')).join(', '))
    console.log('metaTitle:', about.metaTitle || '❌ NOT SET')
    console.log('metaDescription:', about.metaDescription || '❌ NOT SET')
} else {
    console.log('❌ NO DOCUMENT')
}
