import { getBlogPost, getBlogPosts } from '@/lib/queries'
import { notFound } from 'next/navigation'

const styles = `
  .blog-detail-hero { background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary)); color: var(--color-white); padding: var(--spacing-3xl) 0; }
  .blog-detail-hero .breadcrumb { font-size: var(--font-size-sm); opacity: 0.7; margin-bottom: var(--spacing-md); }
  .blog-detail-hero .breadcrumb a { color: rgba(255,255,255,0.7); }
  .blog-detail-hero .breadcrumb a:hover { color: var(--color-accent); }
  .blog-detail-hero h1 { font-size: var(--font-size-3xl); font-weight: 700; line-height: 1.3; max-width: 800px; }
  .blog-detail-hero .meta { display: flex; gap: var(--spacing-lg); margin-top: var(--spacing-md); font-size: var(--font-size-sm); opacity: 0.8; }
  .blog-detail-hero .tags { display: flex; gap: var(--spacing-xs); margin-top: var(--spacing-md); flex-wrap: wrap; }
  .blog-detail-hero .tag { font-size: var(--font-size-xs); background: rgba(255,255,255,0.15); padding: 4px 12px; border-radius: var(--radius-full); }
  .blog-content { max-width: 800px; margin: 0 auto; padding: var(--spacing-3xl) var(--container-padding); }
  .blog-content h2 { font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-primary); margin: var(--spacing-2xl) 0 var(--spacing-md); }
  .blog-content h3 { font-size: var(--font-size-xl); font-weight: 600; color: var(--color-primary); margin: var(--spacing-xl) 0 var(--spacing-sm); }
  .blog-content p { font-size: var(--font-size-base); color: var(--color-gray-700); line-height: 1.9; margin-bottom: var(--spacing-lg); }
  .blog-content ul, .blog-content ol { margin: var(--spacing-md) 0 var(--spacing-lg) var(--spacing-xl); color: var(--color-gray-700); line-height: 1.8; }
  .blog-content li { margin-bottom: var(--spacing-xs); }
  .blog-content blockquote { border-left: 4px solid var(--color-secondary); padding: var(--spacing-md) var(--spacing-xl); margin: var(--spacing-xl) 0; background: var(--color-gray-50); border-radius: 0 var(--radius-md) var(--radius-md) 0; font-style: italic; color: var(--color-gray-600); }
  .blog-content strong { color: var(--color-primary); }
  .blog-content a { color: var(--color-secondary); text-decoration: underline; }
  .blog-share { display: flex; gap: var(--spacing-md); align-items: center; padding: var(--spacing-xl) 0; border-top: 1px solid var(--color-gray-200); margin-top: var(--spacing-2xl); }
  .blog-share span { font-weight: 600; color: var(--color-primary); }
  .blog-nav { display: flex; justify-content: space-between; padding: var(--spacing-xl) 0; }
  .blog-nav a { color: var(--color-secondary); font-weight: 500; }
  @media (max-width: 768px) { .blog-detail-hero h1 { font-size: var(--font-size-2xl); } }
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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <section className="blog-detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">หน้าแรก</a> / <a href="/blog">บทความ</a> / {post.title}
          </div>
          <h1>{post.title}</h1>
          <div className="meta">
            {post.publishedAt && <span>📅 {formatDate(post.publishedAt)}</span>}
            <span>✍️ NYX Cable Team</span>
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

      <section className="cta-section">
        <div className="container">
          <h2>สนใจผลิตภัณฑ์ที่เกี่ยวข้อง?</h2>
          <p>ทีมวิศวกรพร้อมให้คำปรึกษาเลือกสายไฟที่เหมาะกับงาน</p>
          <div className="cta-actions">
            <a href="/products" className="btn btn-accent btn-lg">ดูผลิตภัณฑ์ →</a>
            <a href="https://page.line.me/ubb9405u" className="btn btn-line btn-lg" target="_blank" rel="noopener noreferrer">💬 LINE สอบถาม</a>
          </div>
        </div>
      </section>
    </>
  )
}
