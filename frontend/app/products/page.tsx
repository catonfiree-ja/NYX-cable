import type { Metadata } from 'next'
import { getProducts, getCategories, getSiteSettings } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'
import Link from 'next/link'
import ProductSearch from '@/components/ProductSearch'
import { decodeHtmlEntities } from '@/lib/decode-html'
import { BreadcrumbSchema, FAQSchema } from '@/components/StructuredData'
import { categoryProductsMap } from '@/data/category-products'

const styles = `
  .products-hero { background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary)); color: var(--color-white); padding: var(--spacing-3xl) 0; text-align: center; }
  .products-hero h1 { font-size: 2.8rem; font-weight: 700; margin-bottom: var(--spacing-sm); }
  .products-hero p { font-size: 1.4rem; opacity: 0.85; }
  .products-hero .highlight { color: #FFD700; font-weight: 700; }
  .breadcrumb { font-size: var(--font-size-sm); opacity: 0.7; margin-bottom: var(--spacing-md); }
  .breadcrumb a { color: rgba(255,255,255,0.7); }
  .breadcrumb a:hover { color: var(--color-accent); }

  /* ─── Category Hub ─── */
  .cat-hub { padding: 48px 0 64px; }
  .cat-hub-title { font-size: 2.8rem; font-weight: 700; color: var(--color-primary); margin-bottom: 24px; text-align: center; letter-spacing: 2px; }
  .cat-hub-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
  .cat-card {
    display: block; text-decoration: none; color: inherit;
    border: 1px solid #e8edf3; border-radius: 16px;
    overflow: hidden; transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
    position: relative; background: #fff;
    box-shadow: 0 2px 8px rgba(0,51,102,0.04);
  }
  .cat-card:hover { transform: translateY(-6px); box-shadow: 0 12px 36px rgba(0,51,102,0.12); border-color: rgba(0,153,255,0.3); }
  .cat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #003366, #0099ff); opacity: 0; transition: opacity 0.3s; z-index: 1; }
  .cat-card:hover::before { opacity: 1; }
  .cat-card-img-wrap { background: #f8fafc; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .cat-card-img-wrap img { width: 100%; height: auto; display: block; transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); }
  .cat-card:hover .cat-card-img-wrap img { transform: scale(1.05); }
  .cat-card-header { padding: 20px 24px 12px; display: flex; align-items: center; gap: 14px; }
  .cat-card-icon { width: 44px; height: 44px; border-radius: 10px; background: linear-gradient(135deg, #003366, #0066cc); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.5px; flex-shrink: 0; }
  .cat-card-meta h3 { font-size: 1.05rem; font-weight: 700; color: #003366; margin-bottom: 2px; line-height: 1.3; }
  .cat-card-count { font-size: 0.72rem; color: #0099ff; font-weight: 600; }
  .cat-card-desc { padding: 0 24px 16px; font-size: 0.82rem; color: #64748b; line-height: 1.6; }
  .cat-card-footer { padding: 14px 24px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; background: #fafbfc; }
  .cat-card-footer span { font-size: 0.85rem; color: #0099ff; font-weight: 600; }
  .cat-card-footer .arrow { font-size: 1.1rem; color: #0099ff; transition: transform 0.3s; }
  .cat-card:hover .arrow { transform: translateX(4px); }

  /* ─── All Products Grid ─── */
  .all-products-section { padding: 48px 0; background: #f8fafc; }
  .all-products-title { font-size: 2.8rem; font-weight: 700; color: var(--color-primary); margin-bottom: 24px; text-align: center; }
  .all-products-sub { font-size: 0.9rem; color: #64748b; text-align: center; margin-bottom: 32px; }
  .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
  .product-mini {
    display: block; text-decoration: none; color: inherit;
    border: 1px solid #e8edf3; border-radius: 16px;
    overflow: hidden; transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
    position: relative; background: #fff;
    box-shadow: 0 2px 8px rgba(0,51,102,0.04);
  }
  .product-mini:hover { transform: translateY(-6px); box-shadow: 0 12px 36px rgba(0,51,102,0.12); border-color: rgba(0,153,255,0.3); }
  .product-mini::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #003366, #0099ff); opacity: 0; transition: opacity 0.3s; z-index: 1; }
  .product-mini:hover::before { opacity: 1; }
  .product-mini-img { background: #f8fafc; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .product-mini-img img { width: 100%; height: auto; display: block; transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); }
  .product-mini:hover .product-mini-img img { transform: scale(1.05); }
  .product-mini-body { padding: 20px; }
  .product-mini h4 { font-size: 0.95rem; font-weight: 700; color: #003366; margin-bottom: 6px; line-height: 1.4; }
  .product-mini .code { font-size: 0.72rem; color: #0099ff; font-weight: 600; margin-bottom: 10px; letter-spacing: 0.3px; }
  .product-mini p { font-size: 0.82rem; color: #64748b; margin-top: 0; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

  @media (max-width: 768px) { .cat-hub-grid { grid-template-columns: 1fr; } .products-grid { grid-template-columns: 1fr; } }
`

const catIcons: Record<string, string> = {
  'control-cable': 'CC',
  'shielded-cable': 'SHD',
  'instrument-cable': 'INS',
  'twisted-pair-cable': 'TP',
  'high-flex-cable': 'HFX',
  'industrial-bus-cable': 'BUS',
  'resistant-cable': 'HRC',
  'water-resistant-cable': 'RBR',
  'wiring-cable': 'WIR',
  'vsf': 'WIR',
  'special-cable': 'SPL',
}

// CMS slug → hardcoded slug mapping
const cmsSlugRemap: Record<string, string> = {
  'vsf': 'wiring-cable',
  'rubber-cable': 'water-resistant-cable',
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings().catch(() => null)
  return {
    title: s?.seoTitle || 'ผลิตภัณฑ์สายไฟอุตสาหกรรม | แบ่งตามหมวดหมู่',
    description: s?.seoDescription || 'สายไฟอุตสาหกรรมคุณภาพสูง มาตรฐานยุโรป — สายคอนโทรล สาย VFD สายทนความร้อน สายชีลด์ สายเครน แบ่งตามหมวดหมู่ เลือกง่าย',
    alternates: { canonical: 'https://www.nyxcable.com/products' },
  }
}

export default async function ProductsPage() {
  const settings = await getSiteSettings().catch(() => null)
  const sitePhone = settings?.phone || '02-111-5588'
  const siteLineOA = settings?.lineOA || '@nyxcable'
  let products: any[] = []
  let categories: any[] = []

  try {
    [products, categories] = await Promise.all([getProducts(), getCategories()])
  } catch (e) {
    console.error('Failed to fetch from Sanity:', e)
  }

  // Custom display order and title overrides per client
  const categoryOrder: Record<string, number> = {
    'control-cable': 1,
    'shielded-cable': 2,
    'twisted-pair-cable': 3,
    'water-resistant-cable': 4,
    'wiring-cable': 5,
    'high-flex-cable': 6,
    'industrial-bus-cable': 7,
    'resistant-cable': 8,
  }

  const titleOverrides: Record<string, string> = {
    'control-cable': 'สายคอนโทรล',
    'shielded-cable': 'สายชีลด์ (Shielded Cable)',
    'twisted-pair-cable': 'สายคู่บิดเกลียว RS485 / RS422',
    'water-resistant-cable': 'สายไฟฉนวนทำจากยาง/กันน้ำ',
    'wiring-cable': 'สายวายริ่งตู้ (VSF)',
    'high-flex-cable': 'สายเคเบิลสำหรับงานเคลื่อนที่',
    'industrial-bus-cable': 'สายฟิลด์บัส (Industrial Bus Cables)',
    'resistant-cable': 'สายทนความร้อน ทนสารเคมี',
  }

  // Sort categories by custom order (unordered ones go to end)
  const sortedCategories = categories
    .filter((c: any) => !c.parent)
    .sort((a: any, b: any) => {
      const orderA = categoryOrder[a.slug?.current] ?? 99
      const orderB = categoryOrder[b.slug?.current] ?? 99
      return orderA - orderB
    })
    .map((c: any) => ({
      ...c,
      title: titleOverrides[c.slug?.current] || c.title,
    }))

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'หน้าแรก', url: 'https://www.nyxcable.com' },
        { name: 'ผลิตภัณฑ์', url: 'https://www.nyxcable.com/products' },
      ]} />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* Hero */}
      <section className="products-hero">
        <div className="container">

          <h1>{settings?.productsHeading || 'ผลิตภัณฑ์สายไฟอุตสาหกรรม'}</h1>
          <p><span className="highlight">{categories.filter((c: any) => !c.parent).length} หมวดหมู่สินค้า</span> / {products.length} รุ่น</p>
        </div>
      </section>

      {/* ─── Category Hub Grid ─── */}
      <div className="container">
        <section className="cat-hub">
          <div className="cat-hub-title">หมวดหมู่สินค้า</div>

          <div className="cat-hub-grid">
            {sortedCategories.map((cat: any) => {
              const cmsSlug = cat.slug?.current || ''
              const slug = cmsSlugRemap[cmsSlug] || cmsSlug
              const icon = catIcons[cmsSlug] || catIcons[slug] || 'NYX'
              // Use hardcoded product count (matches what category page actually shows)
              const hardcoded = categoryProductsMap[slug]
              const count = hardcoded?.products?.length || cat.productCount || 0
              const desc = hardcoded?.shortDescription || cat.shortDescription
              const catImg = hardcoded?.products?.[0]?.image
              return (
                <a key={cat._id} href={`/category/${slug}`} className="cat-card">
                  {catImg && (
                    <div className="cat-card-img-wrap">
                      <img src={catImg} alt={cat.title} width={400} height={400} style={{ width: '100%', height: 'auto', display: 'block' }} loading="lazy" />
                    </div>
                  )}
                  <div className="cat-card-header">
                    <div className="cat-card-icon">{icon}</div>
                    <div className="cat-card-meta">
                      <h3>{cat.title}</h3>
                      {count > 0 && <div className="cat-card-count">{count} รุ่น</div>}
                    </div>
                  </div>
                  {desc && (
                    <div className="cat-card-desc">{decodeHtmlEntities(desc)}</div>
                  )}
                  <div className="cat-card-footer">
                    <span>ดูสินค้าในหมวดนี้</span>
                    <span className="arrow">→</span>
                  </div>
                </a>
              )
            })}
          </div>
        </section>
      </div>

      {/* ─── All Products Grid with Images (Sanity CMS + Hardcoded) ─── */}
      <section className="all-products-section">
        <div className="container">
          <div className="all-products-title">สินค้าทั้งหมด</div>

          <div className="products-grid">
            {(() => {
              // Build CMS product lookup by slug
              const cmsMap: Record<string, any> = {}
              for (const p of products) {
                const s = p.slug?.current
                if (s) cmsMap[s] = p
              }

              // Merge hardcoded + CMS data
              const seenSlugs = new Set<string>()
              const allProducts: any[] = []

              // 1) Hardcoded products enriched with CMS data
              for (const [, catData] of Object.entries(categoryProductsMap)) {
                for (const hp of catData.products) {
                  if (seenSlugs.has(hp.slug)) continue
                  seenSlugs.add(hp.slug)
                  const cms = cmsMap[hp.slug]
                  const cmsImage = cms?.image ? urlFor(cms.image).width(400).height(400).url() : null
                  allProducts.push({
                    slug: hp.slug,
                    title: cms?.title || hp.title,
                    code: cms?.productCode || hp.code,
                    shortDescription: cms?.shortDescription || hp.shortDescription,
                    image: cmsImage || hp.image || null,
                  })
                }
              }

              // 2) CMS-only products (added by client in Sanity, not in hardcode)
              for (const cp of products) {
                const s = cp.slug?.current
                if (!s || seenSlugs.has(s)) continue
                seenSlugs.add(s)
                allProducts.push({
                  slug: s,
                  title: cp.title,
                  code: cp.productCode || '',
                  shortDescription: cp.shortDescription || '',
                  image: cp.image ? urlFor(cp.image).width(400).height(400).url() : null,
                })
              }

              return allProducts.map((p) => (
                <a key={p.slug} href={`/product/${p.slug}`} className="product-mini">
                  <div className="product-mini-img">
                    {p.image ? (
                      <img src={p.image} alt={p.title} width={400} height={400} style={{ width: '100%', height: 'auto', display: 'block' }} loading="lazy" />
                    ) : (
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#003366' }}>{p.code || 'NYX'}</span>
                    )}
                  </div>
                  <div className="product-mini-body">
                    <h4>{p.title}</h4>
                    <div className="code">{p.code}</div>
                    <p>{p.shortDescription}</p>
                  </div>
                </a>
              ))
            })()}
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <FAQSchema faqs={[
        { question: 'สายคอนโทรล YSLY-JZ กับ YSLY-JB ต่างกันอย่างไร?', answer: 'YSLY-JZ เหมาะสำหรับเดินสายในตู้คอนโทรลและภายในอาคาร ส่วน YSLY-JB มีเปลือกนอกหนากว่า ฝังดินได้ ทนความชื้นและแรงกดทับ' },
        { question: 'เลือกขนาดสายไฟอย่างไรให้เหมาะกับงาน?', answer: `ต้องพิจารณากระแสไฟที่ใช้ ระยะทาง และจำนวนแกนที่ต้องการ สอบถามทีมวิศวกร NYX Cable ฟรี โทร ${sitePhone}` },
        { question: 'สายไฟ NYX Cable มาตรฐานอะไร?', answer: 'ผลิตตามมาตรฐาน DIN VDE ยุโรป (DIN VDE 0281, 0282) ผ่าน IEC 60502, IEC 60332, CE Marking และ RoHS' },
        { question: 'มีสต็อกพร้อมส่งหรือต้องรอนานแค่ไหน?', answer: 'สต็อกพร้อมส่งกว่า 150 ขนาดจากโกดังบางนา จัดส่งภายใน 1-2 วันทำการทั่วประเทศ' },
        { question: 'ราคาสายไฟ NYX Cable เท่าไหร่?', answer: `ราคาขึ้นอยู่กับรุ่น ขนาด และจำนวน สอบถามราคาตรงได้ที่ ${sitePhone} หรือ LINE ${siteLineOA} ราคาขายส่งโรงงาน ไม่ผ่านคนกลาง` },
      ]} />
      <section style={{ background: '#f8fafc', padding: '48px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 32 }}>คำถามที่พบบ่อย</h2>
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { q: 'สายคอนโทรล YSLY-JZ กับ YSLY-JB ต่างกันอย่างไร?', a: 'YSLY-JZ เหมาะสำหรับเดินสายในตู้คอนโทรลและภายในอาคาร ส่วน YSLY-JB มีเปลือกนอกหนากว่า ฝังดินได้ ทนความชื้นและแรงกดทับ' },
              { q: 'เลือกขนาดสายไฟอย่างไรให้เหมาะกับงาน?', a: `ต้องพิจารณากระแสไฟที่ใช้ ระยะทาง และจำนวนแกนที่ต้องการ สอบถามทีมวิศวกร NYX Cable ฟรี โทร ${sitePhone}` },
              { q: 'สายไฟ NYX Cable มาตรฐานอะไร?', a: 'ผลิตตามมาตรฐาน DIN VDE ยุโรป (DIN VDE 0281, 0282) ผ่าน IEC 60502, IEC 60332, CE Marking และ RoHS' },
              { q: 'มีสต็อกพร้อมส่งหรือต้องรอนานแค่ไหน?', a: 'สต็อกพร้อมส่งกว่า 150 ขนาดจากโกดังบางนา จัดส่งภายใน 1-2 วันทำการทั่วประเทศ' },
              { q: 'ราคาสายไฟ NYX Cable เท่าไหร่?', a: `ราคาขึ้นอยู่กับรุ่น ขนาด และจำนวน สอบถามราคาตรงได้ที่ ${sitePhone} หรือ LINE ${siteLineOA} ราคาขายส่งโรงงาน ไม่ผ่านคนกลาง` },
            ].map((item, i) => (
              <details key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <summary style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-primary)', cursor: 'pointer' }}>{item.q}</summary>
                <div style={{ padding: '0 20px 16px', fontSize: '0.9rem', color: '#64748b', lineHeight: 1.7 }}>{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
