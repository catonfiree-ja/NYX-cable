export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'Store'],
    name: 'NYX Cable',
    alternateName: ['บริษัท เอ็นวายเอ็กซ์ เคเบิ้ล จำกัด', 'NYX Cable Co., Ltd.'],
    url: 'https://www.nyxcable.com',
    logo: 'https://www.nyxcable.com/images/NYXcable-Logo.png',
    description: 'ผู้นำด้านสายไฟอุตสาหกรรมคุณภาพสูง มาตรฐานยุโรป สายคอนโทรล สาย VFD สายทนความร้อน สายชีลด์ ส่งตรงจากโรงงาน',
    telephone: '+66-2-111-5588',
    email: 'sales@nyxcable.com',
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
      streetAddress: '2098 หมู่ 1 ต.สำโรงเหนือ (ซ.สุขุมวิท 72)',
      addressLocality: 'เมืองสมุทรปราการ',
      addressRegion: 'สมุทรปราการ',
      postalCode: '10270',
      addressCountry: 'TH',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:30',
      closes: '17:30',
    },
    sameAs: [
      'https://page.line.me/ubb9405u',
      'https://www.facebook.com/NYXCable',
      'https://www.youtube.com/@time7222',
    ],
    knowsAbout: [
      'สายคอนโทรล', 'Control Cable', 'YSLY-JZ', 'YSLY-JB',
      'สาย VFD', 'VFD Cable', 'Servo Cable',
      'สายทนความร้อน', 'Heat Resistant Cable', 'SiHF',
      'สายชีลด์', 'Shielded Cable', 'YSLYCY',
      'สายเครน', 'Crane Cable',
      'สายไฟอุตสาหกรรม', 'Industrial Cable',
      'DIN VDE', 'IEC 60502',
    ],
    priceRange: '฿฿',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'NYX Cable',
    image: 'https://www.nyxcable.com/images/gallery/profile.webp',
    url: 'https://www.nyxcable.com',
    telephone: '+66-2-111-5588',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '2098 หมู่ 1 ต.สำโรงเหนือ (ซ.สุขุมวิท 72)',
      addressLocality: 'เมืองสมุทรปราการ',
      addressRegion: 'สมุทรปราการ',
      postalCode: '10270',
      addressCountry: 'TH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 13.6477,
      longitude: 100.6202,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:30',
      closes: '17:30',
    },
    priceRange: '฿฿',
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
