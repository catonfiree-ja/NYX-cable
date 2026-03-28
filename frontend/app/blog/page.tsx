import type { Metadata } from 'next'
import { getBlogPosts } from '@/lib/queries'
import { urlFor as sanityUrlFor } from '@/lib/sanity'
import blogImages from '@/data/blog-images.json'
import Image from 'next/image'
import Link from 'next/link'
import { filterBlogPosts } from '@/lib/blog-utils'
import { BreadcrumbSchema } from '@/components/StructuredData'

const styles = `
  /* ─── Blog Hero ─── */
  .blog-hero {
    position: relative;
    background: linear-gradient(160deg, #001a33 0%, #002d5c 35%, #003d7a 70%, #002244 100%);
    color: #fff;
    padding: 64px 0 56px;
    text-align: center;
    overflow: hidden;
  }
  .blog-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 400'%3E%3Ccircle cx='200' cy='200' r='200' fill='rgba(0,153,255,0.06)'/%3E%3Ccircle cx='1200' cy='100' r='150' fill='rgba(240,165,0,0.04)'/%3E%3C/svg%3E") no-repeat center;
    background-size: cover;
  }
  .blog-hero h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 12px; position: relative; }
  .blog-hero p { font-size: 1.05rem; opacity: 0.8; position: relative; }

  /* ─── Featured Post ─── */
  .featured-post {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 0;
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    margin-bottom: 48px;
  }
  .featured-post:hover { box-shadow: 0 12px 40px rgba(0,51,102,0.1); transform: translateY(-4px); color: inherit; }
  .featured-img { position: relative; overflow: hidden; min-height: 320px; }
  .featured-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .featured-post:hover .featured-img img { transform: scale(1.05); }
  .featured-badge {
    position: absolute; top: 16px; left: 16px;
    background: linear-gradient(135deg, #f0a500, #d48900);
    color: #fff; font-size: 0.72rem; font-weight: 700;
    padding: 5px 14px; border-radius: 50px; z-index: 1;
    letter-spacing: 0.5px;
  }
  .featured-body { padding: 40px 36px; display: flex; flex-direction: column; justify-content: center; }
  .featured-body .date { font-size: 0.8rem; color: #6b7280; margin-bottom: 12px; }
  .featured-body h2 { font-size: 1.5rem; font-weight: 800; color: #1a1a2e; margin-bottom: 14px; line-height: 1.4; }
  .featured-body p { font-size: 0.9rem; color: #4b5563; line-height: 1.8; margin-bottom: 20px; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
  .featured-body .read-more { font-size: 0.9rem; font-weight: 700; color: #0066cc; }

  /* ─── Section Title ─── */
  .blog-section-title { font-size: 1.3rem; font-weight: 700; color: #1a1a2e; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 2px solid #f0a500; display: inline-block; }

  /* ─── Blog Cards Grid ─── */
  .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; padding-bottom: 56px; }
  .blog-card {
    border-radius: 16px; overflow: hidden; background: #fff;
    border: 1px solid #e5e7eb; transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    text-decoration: none; color: inherit; display: block;
  }
  .blog-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,51,102,0.08); border-color: #0099ff; color: inherit; }
  .blog-card-image {
    height: 200px; background: linear-gradient(135deg, #f0f4f8, #e2e8f0);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; font-weight: 800; color: #003366; letter-spacing: 1px;
    position: relative; overflow: hidden;
  }
  .blog-card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
  .blog-card:hover .blog-card-image img { transform: scale(1.05); }
  .blog-card-image .date-badge {
    position: absolute; top: 12px; right: 12px;
    background: rgba(0,51,102,0.85); backdrop-filter: blur(4px);
    color: #fff; font-size: 0.7rem; padding: 4px 12px;
    border-radius: 50px; z-index: 1; font-weight: 500;
  }
  .blog-card-body { padding: 20px; }
  .blog-card-body .tags { display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap; }
  .blog-card-body .tag {
    font-size: 0.68rem; background: rgba(0,153,255,0.08); color: #0066cc;
    padding: 3px 10px; border-radius: 50px; font-weight: 600;
  }
  .blog-card-body h3 { font-size: 1rem; font-weight: 700; color: #1a1a2e; margin-bottom: 8px; line-height: 1.5; }
  .blog-card-body p { font-size: 0.82rem; color: #6b7280; line-height: 1.7; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .blog-card-footer { padding: 0 20px 18px; }
  .blog-card-footer span { font-size: 0.82rem; color: #0066cc; font-weight: 600; }

  .empty-state { text-align: center; padding: 80px 0; color: #9ca3af; font-size: 1.1rem; }

  /* ─── Bottom CTA ─── */
  .blog-cta {
    background: linear-gradient(135deg, #003366, #0066cc);
    color: #fff; padding: 56px 0; text-align: center;
    position: relative; overflow: hidden;
  }
  .blog-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 50%, rgba(0,153,255,0.15), transparent 60%);
  }
  .blog-cta h2 { font-size: 1.6rem; font-weight: 700; margin-bottom: 12px; position: relative; }
  .blog-cta p { font-size: 0.95rem; opacity: 0.85; margin-bottom: 24px; position: relative; }
  .blog-cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; position: relative; }
  .blog-cta-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 32px; border-radius: 50px; font-weight: 700; font-size: 0.95rem;
    text-decoration: none; transition: all 0.25s; color: #fff;
  }
  .blog-cta-btn.products { background: linear-gradient(135deg, #f0a500, #d48900); box-shadow: 0 4px 14px rgba(240,165,0,0.3); }
  .blog-cta-btn.products:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(240,165,0,0.4); color: #fff; }
  .blog-cta-btn.contact { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); }
  .blog-cta-btn.contact:hover { background: rgba(255,255,255,0.25); color: #fff; }

  @media (max-width: 768px) {
    .blog-hero h1 { font-size: 1.6rem; }
    .featured-post { grid-template-columns: 1fr; }
    .featured-img { min-height: 200px; }
    .featured-body { padding: 24px 20px; }
    .featured-body h2 { font-size: 1.2rem; }
    .blog-grid { grid-template-columns: 1fr; }
    .blog-cta h2 { font-size: 1.3rem; }
    .blog-cta-btns { flex-direction: column; align-items: center; }
  }
`

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getPostImage(post: any): string | null {
  if (post.featuredImage) {
    return sanityUrlFor(post.featuredImage).width(700).height(400).fit('crop').auto('format').url()
  }
  const wpImage = (blogImages as Record<string, string>)[post.slug?.current]
  if (wpImage) return wpImage
  return null
}

export const metadata: Metadata = {
  title: 'บทความ & ความรู้สายไฟอุตสาหกรรม | NYX Cable',
  description: 'บทความให้ความรู้เกี่ยวกับสายไฟอุตสาหกรรม วิธีเลือกสายไฟ มาตรฐาน DIN VDE จากทีมวิศวกร NYX Cable',
  openGraph: {
    title: 'บทความ & ความรู้สายไฟอุตสาหกรรม | NYX Cable',
    description: 'ความรู้สายไฟอุตสาหกรรม วิธีเลือกสายไฟ มาตรฐาน DIN VDE เคล็ดลับจากวิศวกร NYX Cable',
    images: [{ url: '/images/gallery/profile.webp', width: 1200, height: 630, alt: 'NYX Cable บทความ' }],
  },
  alternates: { canonical: 'https://www.nyxcable.com/blog' },
}

export default async function BlogPage() {
  let posts: any[] = []
  try {
    posts = await getBlogPosts()
  } catch (e) {
    console.error('Failed to fetch blog posts:', e)
  }

  posts = filterBlogPosts(posts)

  const featuredPost = posts.length > 0 ? posts[0] : null
  const remainingPosts = posts.length > 1 ? posts.slice(1) : []

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'หน้าแรก', url: 'https://www.nyxcable.com' },
        { name: 'บทความ', url: 'https://www.nyxcable.com/blog' },
      ]} />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* ─── Hero ─── */}
      <section className="blog-hero">
        <div className="container">
          <h1>บทความ & ความรู้</h1>
          <p>ข้อมูลเชิงลึกจากทีมวิศวกร — {posts.length} บทความ</p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: 48 }}>
        {posts.length === 0 ? (
          <div className="empty-state">ยังไม่มีบทความ</div>
        ) : (
          <>
            {/* ─── Featured Post ─── */}
            {featuredPost && (
              <a href={`/blog/${featuredPost.slug?.current}`} className="featured-post">
                <div className="featured-img">
                  <span className="featured-badge">★ บทความแนะนำ</span>
                  {getPostImage(featuredPost) ? (
                    <Image src={getPostImage(featuredPost)!} alt={featuredPost.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 60vw" priority />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #f0f4f8, #e2e8f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#003366' }}>NYX CABLE</div>
                  )}
                </div>
                <div className="featured-body">
                  <div className="date">{formatDate(featuredPost.publishedAt)}</div>
                  <h2>{featuredPost.title}</h2>
                  <p>{featuredPost.excerpt || ''}</p>
                  <span className="read-more">อ่านบทความ →</span>
                </div>
              </a>
            )}

            {/* ─── Remaining Posts ─── */}
            <div className="blog-section-title">บทความทั้งหมด</div>
            <div className="blog-grid">
              {remainingPosts.map((post: any) => (
                <a key={post._id} href={`/blog/${post.slug?.current}`} className="blog-card">
                  <div className="blog-card-image">
                    {getPostImage(post) ? (
                      <Image src={getPostImage(post)!} alt={post.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #003366, #0066cc)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', gap: 4 }}>
                        <span style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 700 }}>NYX</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.8 }}>NYX Cable Blog</span>
                      </div>
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
          </>
        )}
      </div>

      {/* ─── Bottom CTA ─── */}
      <section className="blog-cta">
        <div className="container">
          <h2>สนใจสายไฟสำหรับโรงงาน?</h2>
          <p>ดูแคตตาล็อกสินค้ากว่า 150 รุ่น หรือปรึกษาทีมวิศวกรเลย</p>
          <div className="blog-cta-btns">
            <Link href="/products" className="blog-cta-btn products">ดูสินค้าทั้งหมด</Link>
            <Link href="/contact" className="blog-cta-btn contact">ติดต่อเรา</Link>
          </div>
        </div>
      </section>
    </>
  )
}
