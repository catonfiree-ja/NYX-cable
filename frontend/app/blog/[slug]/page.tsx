import { getBlogPost, getBlogPosts, getProducts } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { decodeHtmlEntities } from '@/lib/decode-html'
import { BreadcrumbSchema, ArticleSchema } from '@/components/StructuredData'

const styles = `
  .blog-detail-hero {
    background: linear-gradient(160deg, #001a33 0%, #002d5c 35%, #003d7a 70%, #002244 100%);
    color: #fff; padding: 56px 0 48px;
    position: relative; overflow: hidden;
  }
  .blog-detail-hero::before {
    content: ''; position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 400'%3E%3Ccircle cx='200' cy='200' r='200' fill='rgba(0,153,255,0.06)'/%3E%3Ccircle cx='1200' cy='100' r='150' fill='rgba(240,165,0,0.04)'/%3E%3C/svg%3E") no-repeat center;
    background-size: cover;
  }
  .blog-detail-hero .container { position: relative; z-index: 1; }
  .blog-detail-hero .breadcrumb { font-size: 0.82rem; margin-bottom: 16px; }
  .blog-detail-hero .breadcrumb a { color: rgba(255,255,255,0.65); text-decoration: none; transition: color 0.2s; }
  .blog-detail-hero .breadcrumb a:hover { color: #f0a500; }
  .blog-detail-hero h1 { font-size: 2.2rem; font-weight: 800; line-height: 1.3; max-width: 800px; }
  .blog-detail-hero .meta { display: flex; gap: 16px; margin-top: 16px; font-size: 0.85rem; opacity: 0.75; align-items: center; }
  .blog-detail-hero .tags { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; }
  .blog-detail-hero .tag {
    font-size: 0.72rem; font-weight: 600;
    background: rgba(255,255,255,0.12); backdrop-filter: blur(8px);
    padding: 5px 14px; border-radius: 50px;
    border: 1px solid rgba(255,255,255,0.15);
  }
  .blog-content { max-width: 800px; margin: 0 auto; padding: 48px 1.5rem; }
  .blog-content h2 { font-size: 1.5rem; font-weight: 700; color: #003366; margin: 36px 0 16px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; }
  .blog-content h3 { font-size: 1.2rem; font-weight: 600; color: #003366; margin: 28px 0 12px; }
  .blog-content p { font-size: 1rem; color: #374151; line-height: 1.9; margin-bottom: 20px; }
  .blog-content ul, .blog-content ol { margin: 12px 0 20px 24px; color: #374151; line-height: 1.8; }
  .blog-content li { margin-bottom: 6px; }
  .blog-content blockquote {
    border-left: 4px solid #f0a500; padding: 16px 24px;
    margin: 24px 0; background: linear-gradient(135deg, #fffbeb, #fef3c7);
    border-radius: 0 12px 12px 0; font-style: italic; color: #92400e;
  }
  .blog-content strong { color: #003366; }
  .blog-content a:not(.btn) { color: #0066cc; text-decoration: underline; text-underline-offset: 3px; }
  .blog-content table {
    width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 0.9rem;
    border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }
  .blog-content table th {
    background: #003366; color: #fff; padding: 10px 14px; text-align: left; font-weight: 600; font-size: 0.85rem;
  }
  .blog-content table td {
    padding: 8px 14px; border-bottom: 1px solid #e8edf3; color: #374151; font-size: 0.85rem;
  }
  .blog-content table tr:nth-child(even) { background: #f8fafc; }
  .blog-content table tr:hover { background: #f0f7ff; }
  .table-scroll-wrapper {
    overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 24px 0;
    border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }
  .table-scroll-wrapper table { margin: 0; box-shadow: none; }
  .blog-share {
    display: flex; gap: 12px; align-items: center;
    padding: 24px 0; border-top: 2px solid #e5e7eb;
    margin-top: 36px;
  }
  .blog-share span { font-weight: 700; color: #003366; }
  .blog-nav { display: flex; justify-content: space-between; padding: 24px 0; }
  .blog-nav a { color: #0066cc; font-weight: 600; }

  .related-products { max-width: 800px; margin: 0 auto; padding: 0 1.5rem 48px; }
  .related-products h2 { font-size: 1.3rem; font-weight: 700; color: #003366; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid #e5e7eb; }
  .related-products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 16px; }
  .rp-card { display: block; text-decoration: none; color: #1a1a2e; border: 1px solid #e8edf3; border-radius: 14px; padding: 20px 16px; text-align: center; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); background: #fff; box-shadow: 0 2px 6px rgba(0,51,102,0.03); }
  .rp-card:hover { border-color: #0099ff; box-shadow: 0 8px 24px rgba(0,51,102,0.1); transform: translateY(-4px); }
  .rp-card .rp-code { font-size: 0.7rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .rp-card .rp-name { font-size: 0.9rem; font-weight: 700; color: #003366; line-height: 1.3; }
  .rp-card .rp-desc { font-size: 0.75rem; color: #64748b; margin-top: 6px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

  @media (max-width: 768px) {
    .blog-detail-hero h1 { font-size: 1.3rem; }
    .blog-detail-hero { padding: 36px 0 28px; }
    .blog-detail-hero .meta { flex-wrap: wrap; gap: 8px; font-size: 0.78rem; }
    .blog-content { padding: 28px 1rem; }
    .blog-content h2 { font-size: 1.2rem; }
    .blog-content h3 { font-size: 1rem; }
    .blog-content p { font-size: 0.9rem; }
    .blog-content table {
      font-size: 0.78rem; table-layout: fixed !important;
      display: table !important; overflow: visible !important;
    }
    .blog-content table th { padding: 10px 12px; font-size: 0.75rem; text-align: center !important; }
    .blog-content table td { padding: 8px 12px; font-size: 0.78rem; text-align: center !important; }
    .table-scroll-wrapper {
      margin: 16px 0; border-radius: 8px;
      overflow-x: auto; -webkit-overflow-scrolling: touch;
    }
    .blog-content > div { overflow-x: auto; -webkit-overflow-scrolling: touch; max-width: 100%; }
    .blog-share { flex-wrap: wrap; gap: 8px; }
    .related-products-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .rp-card { padding: 14px 12px; }
    .rp-card .rp-name { font-size: 0.82rem; }
  }
`

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Simple server-safe HTML sanitizer: strip dangerous tags (script, iframe, on* attributes)
function sanitizeHtml(html: string): string {
  if (!html) return ''
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[^>]*>[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/<link[^>]*>/gi, '')
    .replace(/<meta[^>]*>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\son\w+\s*=\s*\S+/gi, '')
    .replace(/javascript\s*:/gi, 'blocked:')
    .replace(/data\s*:/gi, 'blocked:')
}

// ALL HTML tag names to filter out from WordPress migration
const HTML_TAG_NAMES = new Set([
  'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'ul', 'ol', 'li', 'table', 'thead',
  'tbody', 'tr', 'th', 'td', 'span', 'strong', 'em',
  'a', 'br', 'hr', 'img', 'figure', 'figcaption',
  'section', 'article', 'header', 'footer', 'nav',
  'pre', 'code', 'sup', 'sub', 'b', 'i', 'u',
  '/div', '/p', '/h1', '/h2', '/h3', '/h4', '/h5', '/h6',
  '/blockquote', '/ul', '/ol', '/li', '/table', '/thead',
  '/tbody', '/tr', '/th', '/td', '/span', '/strong', '/em',
  '/a', '/figure', '/figcaption', '/section', '/article',
  '/header', '/footer', '/nav', '/pre', '/code', '/b', '/i', '/u',
])

// Check if text is just an HTML tag artifact
function isHtmlTagJunk(text: string): boolean {
  const t = text.trim().toLowerCase()
  if (HTML_TAG_NAMES.has(t)) return true
  // Match patterns like </div>, <table>, <tr class="...">, etc
  if (/^<\/?[a-z][a-z0-9]*[\s>\/]/.test(t)) return true
  if (/^<\/?[a-z]+>?$/.test(t)) return true
  return false
}

// Decode HTML entities
function decodeEntities(text: string): string {
  if (!text) return text
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8230;/g, '…')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#8221;/g, '\u201D')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
}

// Detect if a sequence of blocks looks like table data
function detectTableBlocks(blocks: any[]): { start: number; end: number; cols: number }[] {
  const tables: { start: number; end: number; cols: number }[] = []
  let i = 0

  while (i < blocks.length) {
    const b = blocks[i]
    if (b._type !== 'block') { i++; continue }

    const text = (b.children || []).map((c: any) => c.text || '').join('').trim()

    // Short text block (< 20 chars, no sentence-like content)
    if (text.length > 0 && text.length < 20 && !text.includes('. ') && !isHtmlTagJunk(text)) {
      // Count consecutive short blocks
      let j = i
      const cells: string[] = []
      while (j < blocks.length) {
        const bj = blocks[j]
        if (bj._type !== 'block') break
        const t = (bj.children || []).map((c: any) => c.text || '').join('').trim()
        if (t.length === 0 || isHtmlTagJunk(t)) { j++; continue }
        if (t.length >= 25 || t.includes('. ')) break
        cells.push(t)
        j++
      }

      // Need at least 4 cells to be a table
      if (cells.length >= 4) {
        // Try to detect column count: check if first 2 cells look like headers
        // Common patterns: 2 cols, 3 cols, 4 cols
        let cols = 2 // default
        // Heuristic: if total cells divisible by 3 or 4 and makes sense
        if (cells.length % 3 === 0 && cells.length % 2 !== 0) cols = 3
        else if (cells.length % 4 === 0) cols = 4
        else if (cells.length % 3 === 0) cols = 3
        else if (cells.length % 2 === 0) cols = 2
        else cols = 2

        tables.push({ start: i, end: j - 1, cols })
        i = j
        continue
      }
    }
    i++
  }
  return tables
}

// Render Portable Text — handles WordPress-imported content with table reconstruction
function renderBody(body: any) {
  if (typeof body === 'string') {
    return <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' as any }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(body) }} />
  }
  if (!body || !Array.isArray(body)) return <p>ไม่มีเนื้อหา</p>

  // Step 1: Filter out HTML tag junk blocks
  const cleanBlocks = body.filter((block: any) => {
    if (block._type !== 'block') return true
    const children = block.children || []
    const text = children.map((c: any) => c.text || '').join('').trim()
    if (!text) return false // drop empty blocks
    return !isHtmlTagJunk(text)
  })

  // Step 2: Trim trailing junk (blocks that are just tag names at the end)
  while (cleanBlocks.length > 0) {
    const last = cleanBlocks[cleanBlocks.length - 1]
    if (last._type !== 'block') break
    const text = (last.children || []).map((c: any) => c.text || '').join('').trim()
    if (isHtmlTagJunk(text) || !text) {
      cleanBlocks.pop()
    } else break
  }

  // Step 3: Detect table regions  
  const tableRegions = detectTableBlocks(cleanBlocks)
  const inTable = new Set<number>()
  tableRegions.forEach(t => { for (let k = t.start; k <= t.end; k++) inTable.add(k) })

  // Step 4: Render
  const elements: React.ReactNode[] = []
  let blockIdx = 0

  while (blockIdx < cleanBlocks.length) {
    // Check if this block is in a table region
    const tableRegion = tableRegions.find(t => t.start === blockIdx)
    if (tableRegion) {
      // Collect all cells
      const cells: string[] = []
      for (let k = tableRegion.start; k <= tableRegion.end; k++) {
        const b = cleanBlocks[k]
        if (b._type !== 'block') continue
        const text = (b.children || []).map((c: any) => c.text || '').join('').trim()
        if (text && !isHtmlTagJunk(text)) {
          cells.push(decodeEntities(text))
        }
      }

      if (cells.length >= 4) {
        const cols = tableRegion.cols
        const rows: string[][] = []
        for (let c = 0; c < cells.length; c += cols) {
          rows.push(cells.slice(c, c + cols))
        }

        elements.push(
          <div key={`table-${blockIdx}`} className="table-scroll-wrapper">
            <table style={{ tableLayout: 'fixed', width: '100%' }}>
              <colgroup>
                {rows[0]?.map((_, ci) => <col key={ci} style={{ width: `${100 / (rows[0]?.length || 1)}%` }} />)}
              </colgroup>
              <thead>
                <tr>{rows[0]?.map((cell, ci) => <th key={ci} style={{ textAlign: 'center' }}>{cell}</th>)}</tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, ri) => (
                  <tr key={ri}>{row.map((cell, ci) => <td key={ci} style={{ textAlign: 'center' }}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      blockIdx = tableRegion.end + 1
      continue
    }

    // Skip if part of a table
    if (inTable.has(blockIdx)) { blockIdx++; continue }

    const block = cleanBlocks[blockIdx]

    if (block._type === 'block') {
      const children = (block.children || []).map((child: any, j: number) => {
        const rawText = decodeEntities(child.text || '')
        let text: React.ReactNode = rawText
        if (child.marks?.includes('strong')) text = <strong key={j}>{rawText}</strong>
        else if (child.marks?.includes('em')) text = <em key={j}>{rawText}</em>
        else text = <span key={j}>{rawText}</span>
        return text
      })

      const textContent = (block.children || []).map((c: any) => c.text || '').join('')
      if (!textContent.trim()) { blockIdx++; continue }

      switch (block.style) {
        case 'h1': elements.push(<h2 key={blockIdx}>{children}</h2>); break
        case 'h2': elements.push(<h2 key={blockIdx}>{children}</h2>); break
        case 'h3': elements.push(<h3 key={blockIdx}>{children}</h3>); break
        case 'h4': elements.push(<h4 key={blockIdx}>{children}</h4>); break
        case 'blockquote': elements.push(<blockquote key={blockIdx}>{children}</blockquote>); break
        default: elements.push(<p key={blockIdx}>{children}</p>)
      }
    } else if (block._type === 'html' && block.code) {
      elements.push(<div key={blockIdx} style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' as any }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.code) }} />)
    }

    blockIdx++
  }

  return elements
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((p: any) => ({ slug: p.slug?.current }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)
  const post = await getBlogPost(slug)
  if (!post) return { title: 'ไม่พบบทความ' }
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    alternates: { canonical: `https://www.nyxcable.com/blog/${slug}` },
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)
  const post = await getBlogPost(slug)
  if (!post) notFound()

  // Get related products — use Sanity relatedProducts first, fallback to all products
  let relatedProducts = post.relatedProducts || []
  if (relatedProducts.length === 0) {
    const allProducts = await getProducts()
    // Deterministic fallback: sort by _id for consistent CDN caching
    relatedProducts = allProducts
      .sort((a: any, b: any) => (a._id || '').localeCompare(b._id || ''))
      .slice(0, 4)
  }

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'หน้าแรก', url: 'https://www.nyxcable.com' },
        { name: 'บทความ', url: 'https://www.nyxcable.com/blog' },
        { name: post.title, url: `https://www.nyxcable.com/blog/${slug}` },
      ]} />
      <ArticleSchema post={post} />
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <section className="blog-detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">หน้าแรก</Link> › <Link href="/blog">บทความ</Link> › {post.title.length > 40 ? post.title.substring(0, 40) + '…' : post.title}
          </div>
          <h1>{post.title}</h1>
          <div className="meta">
            {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
            <span>NYX Cable Team</span>
            <span>อ่าน ~3 นาที</span>
          </div>
          {(post.tags || post.categories) && (
            <div className="tags">
              {(post.categories || []).map((c: any) => (
                <span key={c._id} className="tag">{c.title}</span>
              ))}
              {(post.tags || []).map((t: string) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      <article className="blog-content">
        {post.excerpt && <p><strong>{post.excerpt}</strong></p>}
        {renderBody(post.body)}

        <div className="blog-share">
          <span>แชร์บทความ:</span>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=https://www.nyxcable.com/blog/${post.slug?.current}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" aria-label="แชร์ทาง Facebook">Facebook</a>
          <a href={`https://lin.ee/share?url=https://www.nyxcable.com/blog/${post.slug?.current}`} target="_blank" rel="noopener noreferrer" className="btn btn-line btn-sm" aria-label="แชร์ทาง LINE">LINE</a>
        </div>
      </article>

      {relatedProducts.length > 0 && (
        <section className="related-products">
          <h2>สินค้าที่เกี่ยวข้อง</h2>
          <div className="related-products-grid">
            {relatedProducts.slice(0, 4).map((p: any) => (
              <a key={p._id} href={`/product/${p.slug?.current}`} className="rp-card">
                {p.productCode && <div className="rp-code">{p.productCode}</div>}
                <div className="rp-name">{p.title}</div>
                {p.shortDescription && <div className="rp-desc">{decodeHtmlEntities(p.shortDescription)}</div>}
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
