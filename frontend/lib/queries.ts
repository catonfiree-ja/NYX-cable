import { client } from './sanity'

// ─── Product Queries ────────────────────────────────────

export async function getProducts() {
  return client.fetch(`
    *[_type == "product"] | order(title asc) {
      _id,
      title,
      slug,
      productCode,
      shortDescription,
      featured,
      "categories": categories[]->{ _id, title, slug },
      "image": images[0]
    }
  `)
}

export async function getProduct(slug: string) {
  return client.fetch(
    `
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      productCode,
      shortDescription,
      description,
      specifications,
      images,
      datasheet,
      voltageRating,
      temperatureRange,
      standards,
      featured,
      metaTitle,
      metaDescription,
      "categories": categories[]->{ _id, title, slug },
      "variants": *[_type == "productVariant" && references(^._id)] | order(cores asc, crossSection asc) {
        _id,
        title,
        slug,
        model,
        cores,
        crossSection,
        strandsInfo,
        outerDiameter,
        copperWeight,
        totalWeight,
        conductorResistance,
        price,
        unit,
        inStock
      },
      "relatedProducts": relatedProducts[]->{ _id, title, slug, productCode, "image": images[0] }
    }
  `,
    { slug }
  )
}

// ─── Variant Queries ─────────────────────────────────────

export async function getVariant(slug: string) {
  return client.fetch(
    `
    *[_type == "productVariant" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      model,
      cores,
      crossSection,
      strandsInfo,
      outerDiameter,
      copperWeight,
      totalWeight,
      conductorResistance,
      price,
      unit,
      inStock,
      packingLength,
      description,
      image,
      metaTitle,
      metaDescription,
      "parentProduct": parentProduct-> {
        _id, title, slug, productCode, shortDescription,
        voltageRating, temperatureRange, standards,
        "categories": categories[]->{ _id, title, slug },
        "image": images[0]
      },
      "siblingVariants": *[_type == "productVariant" && parentProduct._ref == ^.parentProduct._ref && _id != ^._id] | order(cores asc, crossSection asc) {
        _id, title, slug, model, cores, crossSection, inStock
      }
    }
  `,
    { slug }
  )
}

export async function getVariants() {
  return client.fetch(`
    *[_type == "productVariant"] | order(title asc) {
      _id,
      title,
      slug,
      model,
      cores,
      crossSection,
      inStock,
      "parentSlug": parentProduct->slug.current,
      "parentTitle": parentProduct->title
    }
  `)
}

export async function getFeaturedProducts() {
  return client.fetch(`
    *[_type == "product" && featured == true] | order(title asc) {
      _id,
      title,
      slug,
      productCode,
      shortDescription,
      "image": images[0]
    }
  `)
}

// ─── Category Queries ───────────────────────────────────

export async function getCategories() {
  return client.fetch(`
    *[_type == "productCategory"] | order(orderRank desc) {
      _id,
      title,
      slug,
      shortDescription,
      image,
      icon,
      orderRank,
      "parent": parent->{ _id, title, slug },
      "productCount": count(*[_type == "product" && references(^._id)])
    }
  `)
}

export async function getCategory(slug: string) {
  return client.fetch(
    `
    *[_type == "productCategory" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      shortDescription,
      description,
      image,
      faqItems,
      metaTitle,
      metaDescription,
      "parent": parent->{ _id, title, slug },
      "children": *[_type == "productCategory" && parent._ref == ^._id] {
        _id, title, slug, shortDescription, image
      },
      "products": *[_type == "product" && references(^._id)] | order(title asc) {
        _id,
        title,
        slug,
        productCode,
        shortDescription,
        "image": images[0]
      }
    }
  `,
    { slug }
  )
}

// ─── Blog Queries ───────────────────────────────────────

export async function getBlogPosts() {
  return client.fetch(`
    *[_type == "blogPost"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      featuredImage,
      "categories": categories[]->{ _id, title, slug },
      tags
    }
  `)
}

export async function getBlogPost(slug: string) {
  return client.fetch(
    `
    *[_type == "blogPost" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      body,
      featuredImage,
      "categories": categories[]->{ _id, title, slug },
      tags,
      "relatedProducts": relatedProducts[]->{ _id, title, slug, "image": images[0] },
      metaTitle,
      metaDescription
    }
  `,
    { slug }
  )
}

// ─── Site Settings ──────────────────────────────────────

export async function getSiteSettings() {
  return client.fetch(`
    *[_type == "siteSettings"][0] {
      companyName,
      tagline,
      phone,
      email,
      lineOA,
      lineUrl,
      address,
      businessHours,
      googleMapsUrl,
      mapsEmbedUrl,
      heroSlides,
      "featuredProducts": featuredProducts[]->{ _id, title, slug, productCode, "image": images[0] },
      clientLogos,
      socialLinks,
      footerText,
      googleAnalyticsId,
      seoTitle,
      seoDescription,
      ogImage
    }
  `)
}

// ─── FAQ Queries ────────────────────────────────────────

export async function getFAQs() {
  return client.fetch(`
    *[_type == "faq"] | order(orderRank asc) {
      _id,
      question,
      answer,
      "product": product->{ _id, title, slug },
      "category": category->{ _id, title, slug }
    }
  `)
}

// ─── Page Queries ───────────────────────────────────────

export async function getPage(slug: string) {
  return client.fetch(
    `
    *[_type == "page" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      template,
      body,
      galleryImages,
      metaTitle,
      metaDescription
    }
  `,
    { slug }
  )
}

// ─── Gallery Queries ────────────────────────────────────

export async function getGalleryAlbums() {
  return client.fetch(`
    *[_type == "galleryAlbum"] | order(year desc, orderRank asc) {
      _id,
      title,
      slug,
      cover,
      photos[] {
        _key,
        _type,
        asset,
        caption,
        hotspot,
        crop
      },
      year,
      orderRank,
      linkUrl
    }
  `)
}

// ─── Page Queries ────────────────────────────────────────

export async function getHomePage() {
  return client.fetch(`
    *[_type == "homePage"][0] {
      heroTitle,
      heroSubtitle,
      heroBadges,
      heroCtaText,
      heroCtaUrl,
      heroTagline,
      heroTrustBadges,
      whyNyxHeading,
      whyNyxSubheading,
      whyNyxItems,
      deliveryHeading,
      deliverySubheading,
      servicesHeading,
      articlesHeading,
      articlesSubheading,
      comparisonHeading,
      comparisonSubheading,
      ctaHeading,
      ctaSubheading,
      ctaButtons,
      videoUrl,
      videoHeading,
      faqHeading,
      faqSubheading,
      metaTitle,
      metaDescription,
      ogImage
    }
  `)
}

export async function getAboutPage() {
  return client.fetch(`
    *[_type == "aboutPage"][0] {
      heroHeading,
      heroSubheading,
      heroBadges,
      storyHeading,
      storyContent,
      storyImage,
      stats,
      visionHeading,
      visionContent,
      whyNyxHeading,
      whyNyxItems,
      certificates,
      metaTitle,
      metaDescription
    }
  `)
}

export async function getContactPage() {
  return client.fetch(`
    *[_type == "contactPage"][0] {
      heroHeading,
      heroSubheading,
      businessHours,
      googleMapsEmbed,
      additionalInfo,
      metaTitle,
      metaDescription
    }
  `)
}

export async function getGlobalSeo() {
  return client.fetch(`
    *[_type == "siteSettings"][0] {
      seoTitle,
      seoDescription,
      ogImage
    }
  `)
}

export async function getPrivacyPage() {
  return client.fetch(`
    *[_type == "privacyPage"][0] {
      heading,
      subheading,
      body,
      lastUpdated,
      metaTitle,
      metaDescription
    }
  `)
}

// ─── Review Queries ─────────────────────────────────────

export async function getReviews() {
  return client.fetch(`
    *[_type == "review"] | order(orderRank desc, _createdAt desc) {
      _id,
      name,
      initial,
      stars,
      text,
      time
    }
  `)
}
