import React from 'react'
import { getProduct, getProducts, getVariants } from '@/lib/queries'
import { notFound } from 'next/navigation'

const styles = `
  .product-detail-hero { background: linear-gradient(160deg, #001a33, #003366, #002d5c); color: var(--color-white); padding: var(--spacing-2xl) 0; position: relative; }
  .product-detail-hero::before { content: ''; position: absolute; inset: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="g" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="0.5"/></pattern></defs><rect fill="url(%23g)" width="100" height="100"/></svg>'); }
  .product-detail-hero .container { position: relative; z-index: 1; }
  .breadcrumb { font-size: var(--font-size-sm); opacity: 0.7; margin-bottom: var(--spacing-md); }
  .breadcrumb a { color: rgba(255,255,255,0.7); }
  .breadcrumb a:hover { color: var(--color-accent); }
  .product-detail { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-3xl); padding: var(--spacing-3xl) 0; }
  .product-image-box { background: linear-gradient(135deg, #f0f7ff, #e8f0fe); border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: center; min-height: 400px; font-size: 1.4rem; font-weight: 800; color: var(--color-primary); letter-spacing: 2px; border: 1px solid rgba(0,51,102,0.06); position: sticky; top: 100px; }
  .product-info h1 { font-size: var(--font-size-3xl); font-weight: 800; color: var(--color-primary); margin-bottom: var(--spacing-sm); line-height: 1.3; letter-spacing: -0.3px; }
  .product-code { display: inline-flex; padding: 4px 14px; background: rgba(0,153,255,0.1); color: var(--color-secondary); font-size: var(--font-size-sm); font-weight: 600; border-radius: var(--radius-full); margin-bottom: var(--spacing-md); }
  .product-categories { display: flex; gap: var(--spacing-xs); flex-wrap: wrap; margin-bottom: var(--spacing-lg); }
  .product-cat-tag { font-size: var(--font-size-xs); background: var(--color-gray-100); color: var(--color-gray-600); padding: 4px 12px; border-radius: var(--radius-full); }
  .product-desc { font-size: var(--font-size-base); color: var(--color-gray-600); line-height: 1.8; margin-bottom: var(--spacing-xl); }
  .product-full-desc { margin-bottom: var(--spacing-2xl); }
  .product-full-desc h2, .product-full-desc h3 { color: var(--color-primary); font-weight: 600; margin: var(--spacing-xl) 0 var(--spacing-sm); }
  .product-full-desc p { color: var(--color-gray-600); line-height: 1.8; margin-bottom: var(--spacing-md); }
  .product-full-desc ul { margin: var(--spacing-sm) 0 var(--spacing-lg) var(--spacing-xl); color: var(--color-gray-600); line-height: 1.8; }
  .product-full-desc li { margin-bottom: var(--spacing-xs); }
  .spec-list { list-style: none; margin-bottom: var(--spacing-2xl); }
  .spec-list li { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--color-gray-100); font-size: var(--font-size-sm); }
  .spec-list .label { color: var(--color-gray-500); }
  .spec-list .value { font-weight: 600; color: var(--color-primary); }
  .product-actions { display: flex; gap: var(--spacing-md); flex-wrap: wrap; margin-bottom: var(--spacing-xl); }
  .variants-section { padding: var(--spacing-3xl) 0; }
  .variants-section h2 { font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-primary); margin-bottom: var(--spacing-xl); }
  .variants-table { width: 100%; border-collapse: collapse; font-size: var(--font-size-sm); background: var(--color-white); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md); }
  .variants-table th { background: var(--color-primary); color: var(--color-white); padding: 0.75rem 1rem; text-align: left; font-weight: 500; }
  .variants-table td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--color-gray-100); color: var(--color-gray-700); }
  .variants-table tr:hover td { background: rgba(0,153,255,0.04); }
  .stock-badge { display: inline-flex; padding: 2px 10px; border-radius: var(--radius-full); font-size: var(--font-size-xs); font-weight: 600; }
  .stock-in { background: rgba(16,185,129,0.1); color: var(--color-success); }
  .stock-out { background: rgba(239,68,68,0.1); color: var(--color-danger); }
  .related-products { padding: var(--spacing-3xl) 0; }
  .related-products h2 { font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-primary); margin-bottom: var(--spacing-xl); }
  .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--spacing-lg); }
  .related-card { display: block; padding: var(--spacing-lg); background: var(--color-white); border: 1px solid var(--color-gray-200); border-radius: var(--radius-lg); text-decoration: none; transition: all var(--transition-normal); }
  .related-card:hover { border-color: var(--color-secondary); box-shadow: var(--shadow-lg); transform: translateY(-2px); }
  .related-card h3 { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-primary); }

  /* ─── Quick Quote Floating Bar ─── */
  .quick-quote-bar {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 90;
    background: linear-gradient(160deg, #001a33, #003366);
    border-top: 2px solid rgba(251,176,59,0.4);
    padding: 12px 0;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
    backdrop-filter: blur(12px);
  }
  .quick-quote-inner {
    max-width: 1280px; margin: 0 auto; padding: 0 1.5rem;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
  }
  .quick-quote-info { display: flex; align-items: center; gap: 12px; color: #fff; min-width: 0; }
  .quick-quote-badge {
    font-size: 0.65rem; font-weight: 800; color: #fbb03b;
    width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
    border: 1.5px solid rgba(251,176,59,0.3); border-radius: 8px;
    background: rgba(251,176,59,0.08); flex-shrink: 0; letter-spacing: 0.5px;
  }
  .quick-quote-name { font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .quick-quote-code { font-size: 0.7rem; opacity: 0.5; }
  .quick-quote-actions { display: flex; gap: 10px; flex-shrink: 0; }
  .quick-quote-actions .btn { font-size: 0.82rem; padding: 8px 20px; border-radius: 8px; font-weight: 700; white-space: nowrap; }

  @media (max-width: 768px) {
    .product-detail { grid-template-columns: 1fr; }
    .product-image-box { min-height: 250px; font-size: 1rem; position: static; }
    .variants-table { display: block; overflow-x: auto; }
    .quick-quote-inner { flex-direction: column; gap: 8px; }
    .quick-quote-info { width: 100%; }
    .quick-quote-actions { width: 100%; }
    .quick-quote-actions .btn { flex: 1; text-align: center; padding: 10px 12px; font-size: 0.78rem; }
  }
`

// HTML tag names filter for WordPress-imported content
const HTML_TAG_NAMES = new Set([
  'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'ul', 'ol', 'li', 'table', 'thead',
  'tbody', 'tr', 'th', 'td', 'span', 'strong', 'em',
  'a', 'br', 'hr', 'img', 'figure', 'figcaption',
  'section', 'article', 'header', 'footer', 'nav',
  'pre', 'code', 'sup', 'sub', 'b', 'i', 'u',
])

function decodeHtmlEntities(text: string) {
  if (!text) return ''
  return text
    .replace(/&#8230;/g, '…')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\[&#8230;\]/g, '…')
    .replace(/\[…\]/g, '…')
}

// Build a map of product names/codes → slug for auto-linking
type ProductLinkMap = { pattern: string; slug: string; label: string; prefix: string }[]

function buildProductLinkMap(products: any[], variants?: any[]): ProductLinkMap {
  const map: ProductLinkMap = []
  for (const p of products) {
    const slug = p.slug?.current
    if (!slug) continue
    // Add productCode as match pattern (e.g., "YSLY-JZ", "OPVC-JZ")
    if (p.productCode && p.productCode.length > 2) {
      map.push({ pattern: p.productCode, slug, label: p.productCode, prefix: '/products/detail/' })
    }
  }
  // Add variant models (e.g., "YSLY-JZ 3G0.5")
  if (variants) {
    for (const v of variants) {
      const slug = v.slug?.current
      if (!slug) continue
      if (v.model && v.model.length > 3) {
        map.push({ pattern: v.model, slug, label: v.model, prefix: '/products/variant/' })
      }
    }
  }
  // Sort by pattern length descending so longer patterns match first
  map.sort((a, b) => b.pattern.length - a.pattern.length)
  return map
}

// Auto-link product codes in text content
function autoLinkText(text: string, linkMap: ProductLinkMap, currentSlug: string): React.ReactNode {
  if (!text || linkMap.length === 0) return text
  
  const parts: React.ReactNode[] = []
  let remaining = text
  let keyIdx = 0
  
  while (remaining.length > 0) {
    let bestMatch: { index: number; pattern: string; slug: string; label: string; prefix: string } | null = null
    
    for (const entry of linkMap) {
      // Skip self-linking
      if (entry.slug === currentSlug) continue
      const idx = remaining.indexOf(entry.pattern)
      if (idx >= 0 && (bestMatch === null || idx < bestMatch.index || (idx === bestMatch.index && entry.pattern.length > bestMatch.pattern.length))) {
        bestMatch = { index: idx, ...entry }
      }
    }
    
    if (!bestMatch) {
      parts.push(remaining)
      break
    }
    
    // Add text before the match
    if (bestMatch.index > 0) {
      parts.push(remaining.substring(0, bestMatch.index))
    }
    
    // Add the linked product/variant
    parts.push(
      <a key={`al-${keyIdx++}`} href={`${bestMatch.prefix}${bestMatch.slug}`} 
         style={{ color: '#f0a500', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 600 }}>
        {bestMatch.pattern}
      </a>
    )
    
    remaining = remaining.substring(bestMatch.index + bestMatch.pattern.length)
  }
  
  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : <>{parts}</>
}

// Rewrite old WordPress URLs to new Next.js routes
function rewriteLinks(html: string): string {
  return html
    // /product/slug → /products/detail/slug
    .replace(/https?:\/\/nyxcable\.com\/product\/([^/"'\s]+)\/?/g, '/products/detail/$1')
    // /cat/slug → /products
    .replace(/https?:\/\/nyxcable\.com\/cat\/[^/"'\s]+\/?/g, '/products')
    // /shop/slug → /products
    .replace(/https?:\/\/nyxcable\.com\/shop\/[^/"'\s]+\/?/g, '/products')
    // /สายคอนโทรล/variant-slug → /products/variant/variant-slug
    .replace(/https?:\/\/nyxcable\.com\/%E0%B8%AA%E0%B8%B2%E0%B8%A2%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%82%E0%B8%97%E0%B8%A3%E0%B8%A5\/([^/"'\s]+)\/?/g, '/products/variant/$1')
    // Any remaining nyxcable.com links → homepage
    .replace(/https?:\/\/nyxcable\.com\/?/g, '/')
}

function renderDescription(body: any, shortDesc?: string, productTitle?: string, linkMap?: ProductLinkMap, currentSlug?: string) {
  if (!body) return null
  if (typeof body === 'string') {
    // If it's the same as shortDescription, skip
    if (shortDesc && body.includes(shortDesc.substring(0, 50))) return null
    return <div className="product-full-desc" dangerouslySetInnerHTML={{ __html: rewriteLinks(body) }} />
  }
  if (!Array.isArray(body)) return null

  // Extract significant words from product title for fuzzy matching
  const titleWords = productTitle
    ? productTitle.replace(/[:\-–—|\/]/g, ' ').split(/\s+/).filter(w => w.length >= 3)
    : []

  // Track seen texts to remove duplicates
  const seenTexts = new Set<string>()

  // WHITELIST approach: only keep blocks that are meaningful paragraphs
  // This handles all WordPress table remnants (broken cells, labels, repeated titles)
  const cleanBlocks = body.filter((block: any) => {
    if (block._type !== 'block') return true
    const children = block.children || []
    
    // Multi-child blocks (mixed formatting) — check combined text
    const fullText = children.map((c: any) => c.text || '').join('').trim()
    if (!fullText) return false
    
    const lower = fullText.toLowerCase()

    // Filter WordPress HTML tag names (single-word remnants like 'div', 'p', 'table')
    if (HTML_TAG_NAMES.has(lower)) return false
    
    // Filter duplicate text
    if (seenTexts.has(lower)) return false
    seenTexts.add(lower)

    // Keep text that is meaningful (> 15 chars, or Thai text > 10 chars)
    const hasThai = /[\u0E00-\u0E7F]/.test(fullText)
    const isRealContent = fullText.length > 15
    const isThaiContent = hasThai && fullText.length > 10
    
    if (!isRealContent && !isThaiContent) return false
    
    return true
  })

  // Limit to max 50 blocks to allow full product descriptions
  const limitedBlocks = cleanBlocks.slice(0, 50)

  const elements = limitedBlocks.map((block: any, i: number) => {
    if (block._type === 'block') {
      // Build markDefs lookup for links
      const markDefs = (block.markDefs || []).reduce((acc: any, def: any) => {
        acc[def._key] = def
        return acc
      }, {} as Record<string, any>)

      const children = (block.children || []).map((child: any, j: number) => {
        const decoded = decodeHtmlEntities(child.text || '')
        
        // Check for link marks first (from Portable Text markDefs)
        const linkMark = child.marks?.find((m: string) => markDefs[m]?.href)
        if (linkMark) {
          const href = rewriteLinks(markDefs[linkMark].href)
          return <a key={j} href={href} style={{ color: 'var(--nyx-orange)', textDecoration: 'underline' }}>{decoded}</a>
        }
        
        // Apply auto-linking for product codes
        let content: React.ReactNode = linkMap && currentSlug ? autoLinkText(decoded, linkMap, currentSlug) : decoded
        
        if (child.marks?.includes('strong')) {
          return <strong key={j}>{content}</strong>
        } else if (child.marks?.includes('em')) {
          return <em key={j}>{content}</em>
        }
        return <span key={j}>{content}</span>
      })
      const textContent = (block.children || []).map((c: any) => c.text || '').join('')
      if (!textContent.trim()) return null

      // Skip blocks that partially match shortDescription (fuzzy dedup)
      if (shortDesc && shortDesc.length > 20) {
        const shortPrefix = shortDesc.substring(0, 30).replace(/[^\u0E00-\u0E7Fa-zA-Z0-9]/g, '')
        const blockPrefix = textContent.substring(0, 30).replace(/[^\u0E00-\u0E7Fa-zA-Z0-9]/g, '')
        if (shortPrefix === blockPrefix) return null
      }

      switch (block.style) {
        case 'h2': return <h2 key={i}>{children}</h2>
        case 'h3': return <h3 key={i}>{children}</h3>
        case 'h4': return <h4 key={i}>{children}</h4>
        default: return <p key={i}>{children}</p>
      }
    }
    return null
  }).filter(Boolean)

  if (elements.length === 0) return null
  return <div className="product-full-desc">{elements}</div>
}

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p: any) => ({ slug: p.slug?.current }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)
  const product = await getProduct(slug)
  if (!product) return { title: 'ไม่พบสินค้า' }
  return {
    title: product.metaTitle || product.title,
    description: product.metaDescription || decodeHtmlEntities(product.shortDescription),
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)
  const product = await getProduct(slug)
  if (!product) notFound()

  const variants = product.variants || []
  const specs = product.specifications || []
  const categories = product.categories || []
  const relatedProducts = product.relatedProducts || []

  // Build auto-link map from all products + ALL variants (parentProduct refs not set in Sanity)
  const [allProducts, allVariants] = await Promise.all([getProducts(), getVariants()])
  const linkMap = buildProductLinkMap(allProducts, allVariants)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="product-detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">หน้าแรก</a> / <a href="/products">ผลิตภัณฑ์</a> / {product.title}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="product-detail">
          <div className="product-image-box">{product.productCode || 'NYX'}</div>
          <div className="product-info">
            <h1>{product.title}</h1>
            {product.productCode && <span className="product-code">{product.productCode}</span>}
            {categories.length > 0 && (
              <div className="product-categories">
                {categories.map((c: any) => (
                  <span key={c._id} className="product-cat-tag">{c.title}</span>
                ))}
              </div>
            )}
            <p className="product-desc">{decodeHtmlEntities(product.shortDescription)}</p>

            {/* Full description from Portable Text */}
            {renderDescription(product.description, product.shortDescription, product.title, linkMap, slug)}

            <ul className="spec-list">
              {product.voltageRating && <li><span className="label">แรงดันใช้งาน</span><span className="value">{product.voltageRating}</span></li>}
              {product.temperatureRange && <li><span className="label">ช่วงอุณหภูมิ</span><span className="value">{product.temperatureRange}</span></li>}
              {product.standards && <li><span className="label">มาตรฐาน</span><span className="value">{product.standards}</span></li>}
              {specs.map((s: any, i: number) => (
                <li key={i}><span className="label">{s.key}</span><span className="value">{s.value}</span></li>
              ))}
            </ul>
            <div className="product-actions">
              <a href="tel:021115588" className="btn btn-primary btn-lg">สอบถามราคา</a>
              <a href={`https://page.line.me/ubb9405u?text=${encodeURIComponent(`สนใจสินค้า: ${product.title}${product.productCode ? ` (${product.productCode})` : ''} — ขอใบเสนอราคา`)}`} className="btn btn-line btn-lg" target="_blank" rel="noopener noreferrer">แอด LINE</a>
            </div>
          </div>
        </div>

        {variants.length > 0 && (() => {
          // Check if variants have actual spec data 
          const hasSpecs = variants.some((v: any) => v.cores || v.crossSection)

          // Helper: render variant name as link or text
          const VariantName = ({ v, fallback }: { v: any, fallback?: string }) => {
            const name = v.model || v.title || fallback || 'ขนาด'
            if (v.slug?.current) {
              return <a href={`/products/variant/${v.slug.current}`} style={{ fontWeight: 700, color: '#f0a500', textDecoration: 'underline', textUnderlineOffset: '3px' }}>{name}</a>
            }
            return <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{name}</span>
          }

          if (hasSpecs) {
            return (
              <section className="variants-section">
                <h2>ตารางขนาดสินค้า ({variants.length} ขนาด)</h2>
                <table className="variants-table">
                  <thead>
                    <tr>
                      <th>รุ่น</th>
                      <th>แกน</th>
                      <th>พท.หน้าตัด (mm²)</th>
                      <th>OD (mm)</th>
                      <th>น้ำหนัก (kg/km)</th>
                      <th>สต็อก</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((v: any) => (
                      <tr key={v._id}>
                        <td><VariantName v={v} /></td>
                        <td>{v.cores || '-'}</td>
                        <td>{v.crossSection || '-'}</td>
                        <td>{v.outerDiameter || '-'}</td>
                        <td>{v.totalWeight || '-'}</td>
                        <td>
                          <span className={`stock-badge ${v.inStock !== false ? 'stock-in' : 'stock-out'}`}>
                            {v.inStock !== false ? 'พร้อมส่ง' : 'สั่งผลิต'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )
          }

          // No specs — show card grid (linked if slug exists)
          return (
            <section className="variants-section">
              <h2>ขนาดสินค้าที่มี ({variants.length} รุ่น)</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', marginTop: '16px' }}>
                {variants.map((v: any, idx: number) => {
                  const name = v.model || v.title?.replace(product.title, '').trim() || `ขนาดที่ ${idx + 1}`
                  const content = (
                    <>
                      {name}
                      {v.crossSection && <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>{v.crossSection} mm²</span>}
                    </>
                  )
                  const cardStyle = { display: 'block', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', textDecoration: 'none', color: '#1a1a2e', transition: 'all 0.2s', fontWeight: 600, fontSize: '0.85rem' } as const
                  
                  if (v.slug?.current) {
                    return <a key={v._id} href={`/products/variant/${v.slug.current}`} style={cardStyle}>{content}</a>
                  }
                  return <div key={v._id} style={cardStyle}>{content}</div>
                })}
              </div>
              <div className="cta-actions" style={{ justifyContent: 'flex-start', marginTop: '20px' }}>
                <a href={`https://page.line.me/ubb9405u?text=${encodeURIComponent(`สอบถามขนาด: ${product.title} (${variants.length} รุ่น)`)}`} className="btn btn-accent" target="_blank" rel="noopener noreferrer">สอบถามขนาดทาง LINE</a>
                <a href="tel:021115588" className="btn btn-primary">โทร 02-111-5588</a>
              </div>
            </section>
          )
        })()}

        {relatedProducts.length > 0 && (
          <section className="related-products">
            <h2>สินค้าที่เกี่ยวข้อง</h2>
            <div className="related-grid">
              {relatedProducts.map((rp: any) => (
                <a key={rp._id} href={`/products/detail/${rp.slug?.current}`} className="related-card">
                  <h3>{rp.title}</h3>
                  {rp.productCode && <span className="product-code" style={{ marginTop: '8px' }}>{rp.productCode}</span>}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
      <section className="cta-section">
        <div className="container">
          <h2>สนใจ {product.title}? ติดต่อเราวันนี้</h2>
          <p>ทีมวิศวกรพร้อมให้คำปรึกษาเลือกขนาดที่เหมาะกับงาน</p>
          <div className="cta-actions">
            <a href="tel:021115588" className="btn btn-accent btn-lg">โทร 02-111-5588</a>
            <a href={`https://page.line.me/ubb9405u?text=${encodeURIComponent(`สนใจสินค้า: ${product.title}${product.productCode ? ` (${product.productCode})` : ''} — ขอใบเสนอราคา`)}`} className="btn btn-line btn-lg" target="_blank" rel="noopener noreferrer">แอด LINE</a>
          </div>
        </div>
      </section>

      {/* ─── Quick Quote Floating Bar ─── */}
      <div className="quick-quote-bar">
        <div className="quick-quote-inner">
          <div className="quick-quote-info">
            <div className="quick-quote-badge">NYX</div>
            <div>
              <div className="quick-quote-name">{product.title}</div>
              {product.productCode && <div className="quick-quote-code">{product.productCode}</div>}
            </div>
          </div>
          <div className="quick-quote-actions">
            <a href={`https://page.line.me/ubb9405u?text=${encodeURIComponent(`ขอใบเสนอราคา: ${product.title}${product.productCode ? ` (${product.productCode})` : ''}`)}`} className="btn btn-accent" target="_blank" rel="noopener noreferrer">ขอใบเสนอราคารุ่นนี้</a>
            <a href="tel:021115588" className="btn btn-primary">โทรสอบถาม</a>
          </div>
        </div>
      </div>

      {/* ─── Schema.org Product + Organization JSON-LD ─── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.shortDescription ? decodeHtmlEntities(product.shortDescription) : undefined,
        sku: product.productCode || undefined,
        brand: { '@type': 'Brand', name: 'NYX Cable' },
        manufacturer: { '@type': 'Organization', name: 'NYX Cable' },
        category: categories.length > 0 ? categories.map((c: any) => c.title).join(', ') : 'สายไฟอุตสาหกรรม',
        url: `https://nyx-cable.vercel.app/products/detail/${slug}`,
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'THB',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'NYX Cable',
            url: 'https://nyx-cable.vercel.app',
            telephone: '02-111-5588',
            email: 'sales@nyxcable.com',
            address: { '@type': 'PostalAddress', addressLocality: 'บางนา', addressRegion: 'กรุงเทพฯ', addressCountry: 'TH' }
          }
        }
      }) }} />
    </>
  )
}
