import { getProducts, getCategories } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'

const styles = `
  .products-hero { background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary)); color: var(--color-white); padding: var(--spacing-3xl) 0; text-align: center; }
  .products-hero h1 { font-size: var(--font-size-3xl); font-weight: 700; margin-bottom: var(--spacing-sm); }
  .products-hero p { font-size: var(--font-size-lg); opacity: 0.85; }
  .breadcrumb { font-size: var(--font-size-sm); opacity: 0.7; margin-bottom: var(--spacing-md); }
  .breadcrumb a { color: rgba(255,255,255,0.7); }
  .breadcrumb a:hover { color: var(--color-accent); }

  /* ─── Category Hub ─── */
  .cat-hub { padding: 48px 0 64px; }
  .cat-hub-title { font-size: 1.1rem; font-weight: 700; color: var(--color-primary); margin-bottom: 24px; text-align: center; text-transform: uppercase; letter-spacing: 2px; }
  .cat-hub-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
  .cat-card { display: block; text-decoration: none; color: inherit; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); position: relative; }
  .cat-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,51,102,0.12); border-color: var(--color-secondary); }
  .cat-card-header { padding: 28px 24px 20px; display: flex; align-items: center; gap: 16px; }
  .cat-card-icon { width: 56px; height: 56px; border-radius: 12px; background: linear-gradient(135deg, #003366, #0066cc); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 800; letter-spacing: 0.5px; flex-shrink: 0; }
  .cat-card-meta h3 { font-size: 1.1rem; font-weight: 700; color: var(--color-primary); margin-bottom: 2px; line-height: 1.3; }
  .cat-card-count { font-size: 0.78rem; color: var(--color-secondary); font-weight: 600; }
  .cat-card-desc { padding: 0 24px 20px; font-size: 0.88rem; color: #64748b; line-height: 1.7; }
  .cat-card-footer { padding: 14px 24px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; background: #fafbfc; }
  .cat-card-footer span { font-size: 0.85rem; color: var(--color-secondary); font-weight: 600; }
  .cat-card-footer .arrow { font-size: 1.1rem; color: var(--color-secondary); transition: transform 0.3s; }
  .cat-card:hover .arrow { transform: translateX(4px); }

  /* ─── All Products Grid ─── */
  .all-products-section { padding: 48px 0; background: #f8fafc; }
  .all-products-title { font-size: 1.3rem; font-weight: 700; color: var(--color-primary); margin-bottom: 8px; text-align: center; }
  .all-products-sub { font-size: 0.9rem; color: #64748b; text-align: center; margin-bottom: 32px; }
  .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
  .product-mini { display: block; text-decoration: none; color: inherit; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; transition: all 0.25s; }
  .product-mini:hover { border-color: var(--color-secondary); box-shadow: 0 4px 12px rgba(0,51,102,0.08); transform: translateY(-2px); }
  .product-mini h4 { font-size: 0.88rem; font-weight: 600; color: var(--color-primary); margin-bottom: 4px; line-height: 1.4; }
  .product-mini .code { font-size: 0.75rem; color: var(--color-secondary); font-weight: 500; }
  .product-mini p { font-size: 0.8rem; color: #94a3b8; margin-top: 6px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

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
  'rubber-cable': 'RBR',
  'crane-cable': 'CRN',
  'wiring-cable': 'WIR',
  'special-cable': 'SPL',
}

export const metadata = {
  title: 'ผลิตภัณฑ์สายไฟอุตสาหกรรม | แบ่งตามหมวดหมู่',
  description: 'สายไฟอุตสาหกรรมคุณภาพสูง มาตรฐานยุโรป — สายคอนโทรล สาย VFD สายทนความร้อน สายชีลด์ สายเครน แบ่งตามหมวดหมู่ เลือกง่าย',
}

export default async function ProductsPage() {
  let products: any[] = []
  let categories: any[] = []

  try {
    [products, categories] = await Promise.all([getProducts(), getCategories()])
  } catch (e) {
    console.error('Failed to fetch from Sanity:', e)
  }

  // Sort categories: ones with products first, then by productCount desc
  const sortedCategories = categories
    .filter((c: any) => !c.parent)
    .sort((a: any, b: any) => (b.productCount || 0) - (a.productCount || 0))

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* Hero */}
      <section className="products-hero">
        <div className="container">
          <div className="breadcrumb"><a href="/">หน้าแรก</a> / ผลิตภัณฑ์</div>
          <h1>ผลิตภัณฑ์สายไฟอุตสาหกรรม</h1>
          <p>เลือกตามหมวดหมู่ — {categories.filter((c: any) => !c.parent).length} หมวดหมู่ / {products.length} รุ่น</p>
        </div>
      </section>

      {/* ─── Category Hub Grid ─── */}
      <div className="container">
        <section className="cat-hub">
          <div className="cat-hub-title">เลือกหมวดหมู่สินค้า</div>
          <div className="cat-hub-grid">
            {sortedCategories.map((cat: any) => {
              const slug = cat.slug?.current || ''
              const icon = catIcons[slug] || 'NYX'
              const count = cat.productCount || 0
              return (
                <a key={cat._id} href={`/products/${slug}`} className="cat-card">
                  <div className="cat-card-header">
                    <div className="cat-card-icon">{icon}</div>
                    <div className="cat-card-meta">
                      <h3>{cat.title}</h3>
                      {count > 0 && <div className="cat-card-count">{count} รุ่น</div>}
                    </div>
                  </div>
                  {cat.shortDescription && (
                    <div className="cat-card-desc">{cat.shortDescription}</div>
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

      {/* ─── All Products Quick List ─── */}
      <section className="all-products-section">
        <div className="container">
          <div className="all-products-title">สินค้าทั้งหมด {products.length} รุ่น</div>
          <div className="all-products-sub">คลิกเพื่อดูรายละเอียดและสั่งซื้อ</div>
          <div className="products-grid">
            {products.slice(0, 24).map((prod: any) => (
              <a key={prod._id} href={`/products/detail/${prod.slug?.current}`} className="product-mini">
                <h4>{prod.title}</h4>
                {prod.productCode && <div className="code">{prod.productCode}</div>}
                {prod.shortDescription && <p>{prod.shortDescription}</p>}
              </a>
            ))}
          </div>
          {products.length > 24 && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <a href="#all" className="btn btn-primary" onClick={undefined}>
                ดูสินค้าทั้งหมด {products.length} รุ่น
              </a>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>ไม่แน่ใจเลือกรุ่นไหน?</h2>
          <p>ทีมวิศวกรพร้อมให้คำปรึกษาฟรี — โทรหาเราวันนี้</p>
          <div className="cta-actions">
            <a href="tel:021115588" className="btn btn-accent btn-lg">โทร 02-111-5588</a>
            <a href="https://page.line.me/ubb9405u" className="btn btn-line btn-lg" target="_blank" rel="noopener noreferrer">แอด LINE @nyxcable</a>
          </div>
        </div>
      </section>
    </>
  )
}
