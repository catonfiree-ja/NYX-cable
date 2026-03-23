import React from 'react'
import { getProduct, getProducts, getVariants, getBlogPosts } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import VariantTable from './VariantTable'
import ExcelSpecTable from './ExcelSpecTable'
import productSpecsData from '@/data/product-specs.json'

const styles = `
  .product-detail-hero { background: linear-gradient(160deg, #001a33 0%, #002d5c 35%, #003d7a 70%, #002244 100%); color: #fff; padding: 32px 0 48px; position: relative; overflow: hidden; }
  .product-detail-hero::before { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 400'%3E%3Ccircle cx='200' cy='200' r='200' fill='rgba(0,153,255,0.06)'/%3E%3Ccircle cx='1200' cy='100' r='150' fill='rgba(240,165,0,0.04)'/%3E%3C/svg%3E") no-repeat center; background-size: cover; }
  .product-detail-hero .container { position: relative; z-index: 1; }
  .breadcrumb { font-size: 0.82rem; margin-bottom: 20px; }
  .breadcrumb a { color: rgba(255,255,255,0.65); text-decoration: none; transition: color 0.2s; }
  .breadcrumb a:hover { color: #f0a500; }
  .hero-product-layout { display: grid; grid-template-columns: 320px 1fr; gap: 40px; align-items: center; }
  .hero-image-box { background: rgba(255,255,255,0.08); border-radius: 20px; display: flex; align-items: center; justify-content: center; padding: 20px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(4px); min-height: 240px; }
  .hero-image-box img, .hero-image-box > span { width: 100%; height: auto; max-height: 300px; object-fit: contain; border-radius: 12px; filter: drop-shadow(0 4px 20px rgba(0,0,0,0.2)); }
  .hero-image-box .fallback-text { font-size: 2.5rem; font-weight: 900; color: rgba(255,255,255,0.15); letter-spacing: 4px; }
  .hero-product-info h1 { font-size: 1.8rem; font-weight: 800; margin-bottom: 8px; line-height: 1.35; }
  .hero-product-code { display: inline-flex; padding: 4px 14px; background: rgba(0,153,255,0.2); color: #7dd3fc; font-size: 0.85rem; font-weight: 600; border-radius: 50px; margin-bottom: 12px; border: 1px solid rgba(0,153,255,0.3); }
  .hero-categories { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
  .hero-cat-tag { font-size: 0.72rem; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); padding: 4px 12px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); }
  .hero-desc { font-size: 0.9rem; color: rgba(255,255,255,0.75); line-height: 1.7; margin-bottom: 20px; max-width: 600px; }
  .hero-cta { display: flex; gap: 12px; flex-wrap: wrap; }
  .hero-cta .cta-btn-call { padding: 12px 28px; font-size: 0.9rem; }
  .hero-cta .cta-btn-line { padding: 12px 24px; font-size: 0.85rem; }
  .product-content { padding: 40px 0 32px; }
  .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
  .content-grid.single { grid-template-columns: 1fr; }
  .spec-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
  .spec-card-title { font-size: 1rem; font-weight: 700; color: #003366; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #f0a500; display: inline-block; }
  .spec-list { list-style: none; margin: 0; }
  .spec-list li { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 0.88rem; }
  .spec-list li:last-child { border-bottom: none; }
  .spec-list .label { color: #64748b; }
  .spec-list .value { font-weight: 600; color: #003366; }
  .product-full-desc { background: #f8fafc; border-radius: 16px; padding: 28px; border: 1px solid #e2e8f0; margin-bottom: 32px; }
  .product-full-desc h2, .product-full-desc h3 { color: #003366; font-weight: 700; margin: 20px 0 8px; font-size: 1.1rem; }
  .product-full-desc p { color: #475569; line-height: 1.8; margin-bottom: 12px; font-size: 0.9rem; }
  .product-full-desc ul { margin: 8px 0 16px 24px; color: #475569; line-height: 1.8; }
  .product-full-desc li { margin-bottom: 4px; }
  .product-full-desc table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin: 16px 0; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0; }
  .product-full-desc table th { background: #003366; color: #fff; padding: 10px 14px; text-align: left; font-weight: 600; }
  .product-full-desc table td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #334155; }
  .product-full-desc table tr:nth-child(even) td { background: #f8fafc; }
  .product-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; }
  .variants-section { padding: 32px 0; }
  .variants-section h2 { font-size: 1.4rem; font-weight: 700; color: #003366; margin-bottom: 20px; }
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
  .section-divider { background: linear-gradient(180deg, #f8fafc 0%, #fff 100%); padding: 56px 0; }
  .section-divider:nth-child(even) { background: #fff; }
  .section-title-center { font-size: 1.4rem; font-weight: 700; color: var(--color-primary); margin-bottom: 8px; text-align: center; }
  .section-sub-center { font-size: 0.9rem; color: #64748b; text-align: center; margin-bottom: 32px; }
  .related-blogs { padding: 56px 0; background: linear-gradient(180deg, #f0f7ff, #fff); }
  .related-blogs .container { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; }
  .related-blogs h2 { font-size: 1.4rem; font-weight: 700; color: var(--color-primary); margin-bottom: 20px; text-align: center; }
  .blogs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .blog-card-link { display: block; text-decoration: none; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; background: #fff; transition: all 0.25s; }
  .blog-card-link:hover { border-color: #2563eb; box-shadow: 0 4px 16px rgba(37,99,235,0.1); transform: translateY(-2px); }
  .blog-card-link .bc-title { font-size: 0.95rem; font-weight: 700; color: #1a3c6e; line-height: 1.4; margin-bottom: 6px; }
  .blog-card-link .bc-excerpt { font-size: 0.8rem; color: #64748b; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .blog-card-link .bc-date { font-size: 0.7rem; color: #94a3b8; margin-top: 8px; }
  .other-products { padding: 56px 0; background: #fff; }
  .other-products .container { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; }
  .other-products h2 { font-size: 1.4rem; font-weight: 700; color: var(--color-primary); margin-bottom: 20px; text-align: center; }
  .op-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
  .op-card { display: flex; flex-direction: column; align-items: center; justify-content: center; text-decoration: none; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px 16px; text-align: center; background: #fff; transition: all 0.25s; min-height: 100px; }
  .op-card:hover { border-color: #2563eb; box-shadow: 0 4px 16px rgba(37,99,235,0.1); transform: translateY(-2px); }
  .op-card .op-code { font-size: 0.7rem; color: #94a3b8; letter-spacing: 0.5px; margin-bottom: 6px; }
  .op-card .op-name { font-size: 0.95rem; font-weight: 700; color: #1a3c6e; line-height: 1.4; }
  .cta-btn-call { display: inline-flex; align-items: center; gap: 8px; padding: 14px 36px; background: linear-gradient(135deg, #1a3c6e, #2563eb); color: #fff; border-radius: 50px; font-weight: 700; font-size: 1rem; text-decoration: none; box-shadow: 0 4px 14px rgba(37,99,235,0.25); transition: all 0.25s; }
  .cta-btn-call:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37,99,235,0.35); color: #fff; }
  .cta-btn-line { display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; background: linear-gradient(135deg, #06c755, #00b843); color: #fff; border-radius: 50px; font-weight: 700; font-size: 0.95rem; text-decoration: none; box-shadow: 0 4px 14px rgba(6,199,85,0.25); transition: all 0.25s; }
  .cta-btn-line:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(6,199,85,0.35); color: #fff; }
  .quick-quote-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 90; background: linear-gradient(160deg, #001a33, #003366); border-top: 2px solid rgba(251,176,59,0.4); padding: 12px 0; box-shadow: 0 -4px 20px rgba(0,0,0,0.15); backdrop-filter: blur(12px); }
  .quick-quote-inner { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .quick-quote-info { display: flex; align-items: center; gap: 12px; color: #fff; min-width: 0; }
  .quick-quote-badge { font-size: 0.65rem; font-weight: 800; color: #fbb03b; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(251,176,59,0.3); border-radius: 8px; background: rgba(251,176,59,0.08); flex-shrink: 0; letter-spacing: 0.5px; }
  .quick-quote-name { font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .quick-quote-code { font-size: 0.7rem; opacity: 0.5; }
  .quick-quote-actions { display: flex; gap: 10px; flex-shrink: 0; }
  .quick-quote-actions .btn { font-size: 0.82rem; padding: 8px 20px; border-radius: 8px; font-weight: 700; white-space: nowrap; }
  @media (max-width: 900px) {
    .hero-product-layout { grid-template-columns: 1fr; gap: 24px; }
    .hero-image-box { max-width: 320px; margin: 0 auto; min-height: 200px; }
    .content-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .hero-product-info h1 { font-size: 1.3rem; }
    .hero-desc { font-size: 0.85rem; }
    .hero-cta { flex-direction: column; }
    .hero-cta .cta-btn-call, .hero-cta .cta-btn-line { width: 100%; justify-content: center; }
    .variants-table { display: block; overflow-x: auto; }
    .quick-quote-bar { max-width: 100vw; overflow: hidden; }
    .quick-quote-inner { flex-direction: column; gap: 8px; }
    .quick-quote-info { width: 100%; }
    .quick-quote-name { font-size: 0.78rem; }
    .quick-quote-actions { width: 100%; }
    .quick-quote-actions .btn { flex: 1; text-align: center; padding: 10px 12px; font-size: 0.78rem; }
    .blogs-grid { grid-template-columns: 1fr !important; gap: 12px; }
    .blog-card-link { padding: 14px; }
    .blog-card-link .bc-title { font-size: 0.85rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .blog-card-link .bc-excerpt { font-size: 0.75rem; -webkit-line-clamp: 2; }
    .op-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px; }
    .op-card { padding: 14px 10px; min-height: auto; }
    .op-card .op-name { font-size: 0.75rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .op-card .op-code { font-size: 0.6rem; margin-bottom: 4px; }
    .related-grid { grid-template-columns: 1fr !important; }
    .product-full-desc { padding: 18px; }
    .spec-card { padding: 16px; }
  }
  @media (max-width: 480px) {
    .op-grid { grid-template-columns: 1fr !important; }
    .quick-quote-name { font-size: 0.72rem; }
    .quick-quote-badge { width: 30px; height: 30px; font-size: 0.55rem; }
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
      <a key={`al - ${keyIdx++} `} href={`${bestMatch.prefix}${bestMatch.slug} `}
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

    // Skip broken table headers from WP import (no data rows)
    const brokenHeaders = ['Cross Section', 'Current rating', 'Current Rating', 'Bending radius', 'Weight kg', 'O.D. mm', 'Outer Diameter']
    if (brokenHeaders.some(h => fullText.includes(h) && fullText.length < 60)) return false

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
            <a href="/">หน้าแรก</a> › <a href="/products">ผลิตภัณฑ์</a> › {product.title}
          </div>
          <div className="hero-product-layout">
            <div className="hero-image-box">
              {product.images?.[0] ? (
                <Image src={urlFor(product.images[0]).width(600).height(500).url()} alt={product.title} width={600} height={500} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} priority />
              ) : <span className="fallback-text">{product.productCode || 'NYX'}</span>}
            </div>
            <div className="hero-product-info">
              <h1>{product.title}</h1>
              {product.productCode && <span className="hero-product-code">{product.productCode}</span>}
              {categories.length > 0 && (
                <div className="hero-categories">
                  {categories.map((c: any) => (
                    <span key={c._id} className="hero-cat-tag">{c.title}</span>
                  ))}
                </div>
              )}
              {product.shortDescription && <p className="hero-desc">{decodeHtmlEntities(product.shortDescription)}</p>}
              <div className="hero-cta">
                <a href="tel:021115588" className="cta-btn-call">สอบถามราคา</a>
                <a href={`https://page.line.me/ubb9405u?text=${encodeURIComponent(`สนใจสินค้า: ${product.title}${product.productCode ? ` (${product.productCode})` : ''} — ขอใบเสนอราคา`)}`} target="_blank" rel="noopener noreferrer" className="cta-btn-line">แอด LINE</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Content Sections ─── */}
      <div className="product-content">
        <div className="container">

          {/* Specs + Excel table side by side */}
          <div className={`content-grid${!(product.voltageRating || product.temperatureRange || product.standards || specs.length > 0) ? ' single' : ''}`}>
            {(product.voltageRating || product.temperatureRange || product.standards || specs.length > 0) && (
              <div className="spec-card">
                <div className="spec-card-title">ข้อมูลทางเทคนิค</div>
                <ul className="spec-list">
                  {product.voltageRating && <li><span className="label">แรงดันใช้งาน</span><span className="value">{product.voltageRating}</span></li>}
                  {product.temperatureRange && <li><span className="label">ช่วงอุณหภูมิ</span><span className="value">{product.temperatureRange}</span></li>}
                  {product.standards && <li><span className="label">มาตรฐาน</span><span className="value">{product.standards}</span></li>}
                  {specs.map((s: any, i: number) => (
                    <li key={i}><span className="label">{s.key}</span><span className="value">{s.value}</span></li>
                  ))}
                </ul>
              </div>
            )}

            {/* Excel Product Spec Table */}
            {(() => {
              const specData = (productSpecsData as any)[slug]
              if (!specData) return null
              return <ExcelSpecTable slug={slug} data={specData} />
            })()}
          </div>

          {/* Full description from Portable Text */}
          {renderDescription(product.description, product.shortDescription, product.title, linkMap, slug)}

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
              return <VariantTable variants={variants} />
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
      </div>

      {/* ─── Related Blog Posts ─── */}
      {
        (async () => {
          const allBlogPosts = await getBlogPosts()
          const blogPosts = allBlogPosts.slice(0, 3)
          if (blogPosts.length === 0) return null
          return (
            <section className="related-blogs">
              <div className="container">
                <h2>คู่มือ & บทความที่เกี่ยวข้อง</h2>
                <div className="blogs-grid">
                  {blogPosts.map((bp: any) => (
                    <a key={bp._id} href={`/blog/${bp.slug?.current}`} className="blog-card-link">
                      <div className="bc-title">{bp.title}</div>
                      {bp.excerpt && <div className="bc-excerpt">{bp.excerpt}</div>}
                      {bp.publishedAt && <div className="bc-date">{new Date(bp.publishedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}</div>}
                    </a>
                  ))}
                </div>
              </div>
            </section>
          )
        })()
      }

      {/* ─── Other Products ─── */}
      {
        (async () => {
          const allProducts = await getProducts()
          const otherProducts = allProducts.filter((p: any) => p.slug?.current !== slug).slice(0, 4)
          if (otherProducts.length === 0) return null
          return (
            <section className="other-products">
              <div className="container">
                <h2>สินค้าหมวดอื่นที่น่าสนใจ</h2>
                <div className="op-grid">
                  {otherProducts.map((p: any) => (
                    <a key={p._id} href={`/products/detail/${p.slug?.current}`} className="op-card">
                      {p.productCode && <div className="op-code">{p.productCode}</div>}
                      <div className="op-name">{p.title}</div>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          )
        })()
      }

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
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
        })
      }} />
    </>
  )
}
