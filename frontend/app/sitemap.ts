import { MetadataRoute } from 'next'
import { getProducts, getBlogPosts, getVariants, getCategories } from '@/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.nyxcable.com'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/reviews`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  let productPages: MetadataRoute.Sitemap = []
  let variantPages: MetadataRoute.Sitemap = []
  let categoryPages: MetadataRoute.Sitemap = []
  let blogPages: MetadataRoute.Sitemap = []

  try {
    const [products, variants, categories, posts] = await Promise.all([
      getProducts(), getVariants(), getCategories(), getBlogPosts(),
    ])

    productPages = products.map((p: any) => ({
      url: encodeURI(`${baseUrl}/product/${p.slug?.current}`),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    variantPages = variants.map((v: any) => ({
      url: encodeURI(`${baseUrl}/product/variant/${v.slug?.current}`),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    categoryPages = categories
      .filter((c: any) => c.slug?.current)
      .map((c: any) => ({
        url: encodeURI(`${baseUrl}/category/${c.slug.current}`),
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))

    blogPages = posts.map((p: any) => ({
      url: encodeURI(`${baseUrl}/blog/${p.slug?.current}`),
      lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch (e) {
    console.error('Sitemap generation error:', e)
  }

  return [...staticPages, ...productPages, ...variantPages, ...categoryPages, ...blogPages]
}
