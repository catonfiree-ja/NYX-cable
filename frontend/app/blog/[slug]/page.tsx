import { getBlogPost, getBlogPosts, getProducts } from '@/lib/queries'
import { notFound } from 'next/navigation'

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
  .rp-card .rp-code { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
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

// HTML tag names that WordPress migration stored as separate text blocks
const HTML_TAG_NAMES = new Set([
  'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'ul', 'ol', 'li', 'table', 'thead',
  'tbody', 'tr', 'th', 'td', 'span', 'strong', 'em',
  'a', 'br', 'hr', 'img', 'figure', 'figcaption',
  'section', 'article', 'header', 'footer', 'nav',
  'pre', 'code', 'sup', 'sub', 'b', 'i', 'u',
])

// Render Portable Text — handles WordPress-imported content
function renderBody(body: any) {
  // If body is a raw HTML string
  if (typeof body === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: body }} />
  }

  // If body is not an array
  if (!body || !Array.isArray(body)) return <p>ไม่มีเนื้อหา</p>

  // Filter out blocks that are just HTML tag names (WordPress migration artifacts)
  const cleanBlocks = body.filter((block: any) => {
    if (block._type !== 'block') return true
    const children = block.children || []
    if (children.length !== 1) return true
    const text = children[0]?.text?.trim()?.toLowerCase()
    return !text || !HTML_TAG_NAMES.has(text)
  })

  return cleanBlocks.map((block: any, i: number) => {
    if (block._type === 'block') {
      const children = (block.children || []).map((child: any, j: number) => {
        let text: React.ReactNode = child.text || ''
        if (child.marks?.includes('strong')) text = <strong key={j}>{text}</strong>
        else if (child.marks?.includes('em')) text = <em key={j}>{text}</em>
        else text = <span key={j}>{text}</span>
        return text
      })

      const textContent = (block.children || []).map((c: any) => c.text || '').join('')
      if (!textContent.trim()) return null

      switch (block.style) {
        case 'h1': return <h2 key={i}>{children}</h2>
        case 'h2': return <h2 key={i}>{children}</h2>
        case 'h3': return <h3 key={i}>{children}</h3>
        case 'h4': return <h4 key={i}>{children}</h4>
        case 'blockquote': return <blockquote key={i}>{children}</blockquote>
        default: return <p key={i}>{children}</p>
      }
    }

    if (block._type === 'html' && block.code) {
      return <div key={i} dangerouslySetInnerHTML={{ __html: block.code }} />
    }

    return null // Skip unknown types silently
  })
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
    // Shuffle and pick 4
    relatedProducts = allProducts.sort(() => Math.random() - 0.5).slice(0, 4)
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <section className="blog-detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">หน้าแรก</a> › <a href="/blog">บทความ</a> › {post.title.length > 40 ? post.title.substring(0, 40) + '…' : post.title}
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
          <a href={`https://www.facebook.com/sharer/sharer.php?u=https://www.nyxcable.com/blog/${post.slug?.current}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Facebook</a>
          <a href={`https://lin.ee/share?url=https://www.nyxcable.com/blog/${post.slug?.current}`} target="_blank" rel="noopener noreferrer" className="btn btn-line btn-sm">LINE</a>
        </div>
      </article>

      {relatedProducts.length > 0 && (
        <section className="related-products">
          <h2>สินค้าที่เกี่ยวข้อง</h2>
          <div className="related-products-grid">
            {relatedProducts.slice(0, 4).map((p: any) => (
              <a key={p._id} href={`/products/detail/${p.slug?.current}`} className="rp-card">
                {p.productCode && <div className="rp-code">{p.productCode}</div>}
                <div className="rp-name">{p.title}</div>
                {p.shortDescription && <div className="rp-desc">{p.shortDescription}</div>}
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
