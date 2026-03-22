import { getBlogPosts } from '@/lib/queries'
import { urlFor as sanityUrlFor } from '@/lib/sanity'

const styles = `
  .blog-hero { background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary)); color: var(--color-white); padding: var(--spacing-3xl) 0; text-align: center; }
  .blog-hero h1 { font-size: var(--font-size-3xl); font-weight: 700; margin-bottom: var(--spacing-sm); }
  .blog-hero p { font-size: var(--font-size-lg); opacity: 0.85; }
  .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: var(--spacing-xl); padding: var(--spacing-3xl) 0; }
  .blog-card { border-radius: var(--radius-xl); overflow: hidden; background: var(--color-white); border: 1px solid var(--color-gray-200); transition: all var(--transition-normal); text-decoration: none; color: inherit; display: block; }
  .blog-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-xl); border-color: var(--color-secondary); color: inherit; }
  .blog-card-image { height: 200px; background: linear-gradient(135deg, var(--color-gray-100), var(--color-gray-200)); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800; color: var(--color-primary); letter-spacing: 1px; position: relative; overflow: hidden; }
  .blog-card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
  .blog-card:hover .blog-card-image img { transform: scale(1.05); }
  .blog-card-image .date-badge { position: absolute; top: 12px; right: 12px; background: var(--color-primary); color: var(--color-white); font-size: var(--font-size-xs); padding: 4px 12px; border-radius: var(--radius-md); z-index: 1; }
  .blog-card-body { padding: var(--spacing-lg); }
  .blog-card-body .tags { display: flex; gap: var(--spacing-xs); margin-bottom: var(--spacing-sm); flex-wrap: wrap; }
  .blog-card-body .tag { font-size: var(--font-size-xs); background: rgba(0,153,255,0.08); color: var(--color-secondary); padding: 2px 8px; border-radius: var(--radius-full); font-weight: 500; }
  .blog-card-body h3 { font-size: var(--font-size-lg); font-weight: 600; color: var(--color-primary); margin-bottom: var(--spacing-sm); line-height: 1.4; }
  .blog-card-body p { font-size: var(--font-size-sm); color: var(--color-gray-500); line-height: 1.7; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .blog-card-footer { padding: 0 var(--spacing-lg) var(--spacing-lg); }
  .blog-card-footer span { font-size: var(--font-size-sm); color: var(--color-secondary); font-weight: 500; }
  .empty-state { text-align: center; padding: var(--spacing-4xl); color: var(--color-gray-400); font-size: var(--font-size-lg); }
  @media (max-width: 768px) { .blog-grid { grid-template-columns: 1fr; } }
`

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const metadata = {
  title: 'บทความ & ความรู้สายไฟอุตสาหกรรม',
  description: 'บทความให้ความรู้เกี่ยวกับสายไฟอุตสาหกรรม วิธีเลือกสายไฟ มาตรฐาน DIN VDE',
}

export default async function BlogPage() {
  let posts: any[] = []
  try {
    posts = await getBlogPosts()
  } catch (e) {
    console.error('Failed to fetch blog posts:', e)
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <section className="blog-hero">
        <div className="container">
          <h1>บทความ & ความรู้</h1>
          <p>ข้อมูลเชิงลึกจากทีมวิศวกร — {posts.length} บทความ</p>
        </div>
      </section>
      <div className="container">
        {posts.length === 0 ? (
          <div className="empty-state">ยังไม่มีบทความ</div>
        ) : (
          <div className="blog-grid">
            {posts.map((post: any) => (
              <a key={post._id} href={`/blog/${post.slug?.current}`} className="blog-card">
                <div className="blog-card-image">
                  {post.featuredImage ? (
                    <img
                      src={sanityUrlFor(post.featuredImage).width(700).height(400).fit('crop').auto('format').url()}
                      alt={post.title}
                      loading="lazy"
                    />
                  ) : (
                    'BLOG'
                  )}
                  <span className="date-badge">{formatDate(post.publishedAt)}</span>
                </div>
                <div className="blog-card-body">
                  {(post.tags || post.categories) && (
                    <div className="tags">
                      {(post.categories || []).map((c: any) => (
                        <span key={c._id} className="tag">{c.title}</span>
                      ))}
                      {(post.tags || []).slice(0, 2).map((t: string) => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                  )}
                  <h3>{post.title}</h3>
                  <p>{post.excerpt || ''}</p>
                </div>
                <div className="blog-card-footer">
                  <span>อ่านต่อ →</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* CTA ท้ายหน้า Blog — ป้องกัน Dead End */}
      <section className="cta-section">
        <div className="container">
          <h2>สนใจสายไฟสำหรับโรงงาน?</h2>
          <p>ดูแคตตาล็อกสินค้ากว่า 50 รุ่น หรือปรึกษาทีมวิศวกรเลย</p>
          <div className="cta-actions">
            <a href="/products" className="btn btn-accent btn-lg">ดูสินค้าทั้งหมด →</a>
            <a href="/contact" className="btn btn-primary btn-lg">ติดต่อเรา</a>
          </div>
        </div>
      </section>
    </>
  )
}
