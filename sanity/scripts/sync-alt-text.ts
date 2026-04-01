// Sync Alt Text Script — ใส่ alt text ให้รูปสินค้าและ Gallery ใน Sanity
// วิธีใช้: cd sanity && npx sanity exec scripts/sync-alt-text.ts --with-user-token

import { getCliClient } from 'sanity/cli'

const client = getCliClient().withConfig({ apiVersion: '2024-01-01' })

async function syncAltText() {
  console.log('🔧 กำลังใส่ alt text ให้รูปภาพใน Sanity...\n')

  // 1. Products — ใส่ alt text ให้ images[] ที่ยังไม่มี
  const products = await client.fetch<any[]>(`
    *[_type == "product"] {
      _id,
      title,
      productCode,
      "images": images[] {
        _key,
        "hasAlt": defined(alt) && alt != ""
      }
    }
  `)

  let productUpdates = 0
  for (const product of products) {
    if (!product.images?.length) continue

    const needsUpdate = product.images.some((img: any) => !img.hasAlt)
    if (!needsUpdate) continue

    // Fetch the actual document to patch
    const doc = await client.fetch<any>(`*[_id == $id][0]`, { id: product._id })
    if (!doc?.images?.length) continue

    const updatedImages = doc.images.map((img: any, i: number) => {
      if (!img.alt || img.alt.trim() === '') {
        const altText = i === 0
          ? `${product.title} - สายไฟอุตสาหกรรม NYX Cable`
          : `${product.title} ${product.productCode || ''} รูปที่ ${i + 1}`
        return { ...img, alt: altText.trim() }
      }
      return img
    })

    await client.patch(product._id).set({ images: updatedImages }).commit()
    productUpdates++
    console.log(`✅ Product: "${product.title}" — ใส่ alt ${product.images.length} รูป`)
  }

  // 2. Product Variants — ใส่ alt text ให้ image
  const variants = await client.fetch<any[]>(`
    *[_type == "productVariant" && defined(image) && (!defined(image.alt) || image.alt == "")] {
      _id,
      title,
      variantCode,
      image
    }
  `)

  let variantUpdates = 0
  for (const variant of variants) {
    const altText = `${variant.title} ${variant.variantCode || ''} - NYX Cable`.trim()
    await client.patch(variant._id).set({ 'image.alt': altText }).commit()
    variantUpdates++
    if (variantUpdates <= 5 || variantUpdates % 20 === 0) {
      console.log(`✅ Variant: "${variant.title}" → alt: "${altText}"`)
    }
  }
  if (variantUpdates > 5) {
    console.log(`  ... (${variantUpdates} variants total)`)
  }

  // 3. Blog Posts — ใส่ alt text ให้ featuredImage
  const posts = await client.fetch<any[]>(`
    *[_type == "blogPost" && defined(featuredImage) && (!defined(featuredImage.alt) || featuredImage.alt == "")] {
      _id,
      title,
      featuredImage
    }
  `)

  let blogUpdates = 0
  for (const post of posts) {
    const altText = `${post.title} - บทความ NYX Cable`
    await client.patch(post._id).set({ 'featuredImage.alt': altText }).commit()
    blogUpdates++
    console.log(`✅ Blog: "${post.title}"`)
  }

  // 4. Gallery Albums — ใส่ alt text ให้ photos[]
  const albums = await client.fetch<any[]>(`
    *[_type == "galleryAlbum"] {
      _id,
      title,
      photos
    }
  `)

  let galleryUpdates = 0
  for (const album of albums) {
    if (!album.photos?.length) continue

    const needsUpdate = album.photos.some((p: any) => !p.alt || p.alt.trim() === '')
    if (!needsUpdate) continue

    const updatedPhotos = album.photos.map((photo: any, i: number) => {
      if (!photo.alt || photo.alt.trim() === '') {
        return { ...photo, alt: `${album.title} - ภาพที่ ${i + 1} | NYX Cable` }
      }
      return photo
    })

    await client.patch(album._id).set({ photos: updatedPhotos }).commit()
    galleryUpdates++
    console.log(`✅ Gallery: "${album.title}" — ${album.photos.length} photos`)
  }

  // 5. Categories — ใส่ alt text ให้ image
  const categories = await client.fetch<any[]>(`
    *[_type == "productCategory" && defined(image) && (!defined(image.alt) || image.alt == "")] {
      _id,
      title,
      image
    }
  `)

  let catUpdates = 0
  for (const cat of categories) {
    const altText = `${cat.title} - หมวดหมู่สินค้า NYX Cable`
    await client.patch(cat._id).set({ 'image.alt': altText }).commit()
    catUpdates++
    console.log(`✅ Category: "${cat.title}"`)
  }

  // 6. Singleton Pages — ใส่ alt text ให้ OG images
  const singletons = ['homePage', 'aboutPage', 'contactPage', 'privacyPage', 'siteSettings']
  let singletonUpdates = 0
  for (const docId of singletons) {
    const doc = await client.fetch<any>(`*[_id == $id][0]`, { id: docId })
    if (!doc) continue

    const patches: Record<string, string> = {}

    // Check ogImage
    if (doc.ogImage && (!doc.ogImage.alt || doc.ogImage.alt.trim() === '')) {
      patches['ogImage.alt'] = `${doc.title || doc.seoTitle || docId} - NYX Cable`
    }
    // Check image
    if (doc.image && (!doc.image.alt || doc.image.alt.trim() === '')) {
      patches['image.alt'] = `${doc.title || docId} - NYX Cable`
    }
    // Check heroImage
    if (doc.heroImage && (!doc.heroImage.alt || doc.heroImage.alt.trim() === '')) {
      patches['heroImage.alt'] = `${doc.title || docId} - NYX Cable`
    }

    if (Object.keys(patches).length > 0) {
      await client.patch(docId).set(patches).commit()
      singletonUpdates++
      console.log(`✅ Page: "${docId}" — ${Object.keys(patches).length} images`)
    }
  }

  console.log(`\n🎉 สรุป:`)
  console.log(`  Products: ${productUpdates} updated`)
  console.log(`  Variants: ${variantUpdates} updated`)
  console.log(`  Blog: ${blogUpdates} updated`)
  console.log(`  Gallery: ${galleryUpdates} updated`)
  console.log(`  Categories: ${catUpdates} updated`)
  console.log(`  Singletons: ${singletonUpdates} updated`)
  console.log(`  Total: ${productUpdates + variantUpdates + blogUpdates + galleryUpdates + catUpdates + singletonUpdates} documents`)
}

syncAltText().catch(console.error)
