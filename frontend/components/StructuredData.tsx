export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NYX Cable',
    alternateName: 'บริษัท เอ็นวายเอ็กซ์ เคเบิ้ล จำกัด',
    url: 'https://www.nyxcable.com',
    logo: 'https://www.nyxcable.com/logo.png',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+66-2-111-5588',
        contactType: 'sales',
        areaServed: 'TH',
        availableLanguage: ['Thai', 'English'],
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'บางนา',
      addressRegion: 'กรุงเทพมหานคร',
      addressCountry: 'TH',
    },
    sameAs: [
      'https://page.line.me/ubb9405u',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ProductSchema({ product }: { product: any }) {
  if (!product) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.shortDescription || product.metaDescription,
    sku: product.productCode,
    brand: {
      '@type': 'Brand',
      name: 'NYX Cable',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'THB',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'NYX Cable',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  if (!faqs?.length) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ArticleSchema({ post }: { post: any }) {
  if (!post) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'NYX Cable',
    },
    publisher: {
      '@type': 'Organization',
      name: 'NYX Cable',
      url: 'https://www.nyxcable.com',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
