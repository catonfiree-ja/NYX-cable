import { getProducts, getCategories } from '@/lib/queries'

const styles = `
  .products-hero { background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary)); color: var(--color-white); padding: var(--spacing-3xl) 0; text-align: center; }
  .products-hero h1 { font-size: var(--font-size-3xl); font-weight: 700; margin-bottom: var(--spacing-sm); }
  .products-hero p { font-size: var(--font-size-lg); opacity: 0.85; }
  .breadcrumb { font-size: var(--font-size-sm); opacity: 0.7; margin-bottom: var(--spacing-md); }
  .breadcrumb a { color: rgba(255,255,255,0.7); }
  .breadcrumb a:hover { color: var(--color-accent); }
  .products-layout { display: grid; grid-template-columns: 280px 1fr; gap: var(--spacing-2xl); padding: var(--spacing-3xl) 0; }
  .sidebar { position: sticky; top: 100px; align-self: start; }
  .sidebar h3 { font-size: var(--font-size-lg); font-weight: 600; color: var(--color-primary); margin-bottom: var(--spacing-md); padding-bottom: var(--spacing-sm); border-bottom: 2px solid var(--color-gray-200); }
  .sidebar-list { list-style: none; }
  .sidebar-list li { margin-bottom: 2px; }
  .sidebar-list a { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 1rem; color: var(--color-gray-700); font-size: var(--font-size-sm); border-radius: var(--radius-md); transition: all var(--transition-fast); }
  .sidebar-list a:hover { background: rgba(0,153,255,0.08); color: var(--color-secondary); }
  .sidebar-count { font-size: var(--font-size-xs); background: var(--color-gray-100); padding: 2px 8px; border-radius: var(--radius-full); color: var(--color-gray-500); }
  .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--spacing-xl); }
  .product-card { border-radius: var(--radius-xl); overflow: hidden; background: var(--color-white); border: 1px solid var(--color-gray-200); transition: all var(--transition-normal); text-decoration: none; color: inherit; display: block; }
  .product-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-xl); border-color: var(--color-secondary); color: inherit; }
  .product-card-image { height: 200px; background: linear-gradient(135deg, var(--color-gray-50), var(--color-gray-100)); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800; color: var(--color-primary); letter-spacing: 1px; position: relative; }
  .product-card-image .code-badge { position: absolute; top: 12px; left: 12px; background: var(--color-primary); color: var(--color-white); font-size: var(--font-size-xs); font-weight: 600; padding: 4px 10px; border-radius: var(--radius-full); }
  .product-card-body { padding: var(--spacing-lg); }
  .product-card-body h3 { font-size: var(--font-size-base); font-weight: 600; color: var(--color-primary); margin-bottom: var(--spacing-xs); line-height: 1.4; }
  .product-card-body p { font-size: var(--font-size-sm); color: var(--color-gray-500); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .product-card-footer { padding: 0 var(--spacing-lg) var(--spacing-lg); display: flex; justify-content: space-between; align-items: center; }
  .product-card-footer .view-btn { font-size: var(--font-size-sm); color: var(--color-secondary); font-weight: 500; }
  .empty-state { text-align: center; padding: var(--spacing-4xl); color: var(--color-gray-400); }
  @media (max-width: 768px) { .products-layout { grid-template-columns: 1fr; } .sidebar { position: static; } .products-grid { grid-template-columns: 1fr; } }
`

const icons: Record<string, string> = {
  'control-cable': 'CC', 'vfd-servo': 'VFD', 'heat-resistant': 'HRC', 'shielded': 'SHD',
  'crane': 'CRN', 'bus-data': 'BUS', 'default': 'NYX'
}

export const metadata = {
  title: 'ผลิตภัณฑ์สายไฟอุตสาหกรรม',
  description: 'สายไฟอุตสาหกรรมคุณภาพสูง มาตรฐานยุโรป — สายคอนโทรล สาย VFD สายทนความร้อน สายชีลด์ สายเครน',
}

export default async function ProductsPage() {
  let products: any[] = []
  let categories: any[] = []

  try {
    [products, categories] = await Promise.all([getProducts(), getCategories()])
  } catch (e) {
    console.error('Failed to fetch from Sanity:', e)
  }

  // Filter to top-level categories only
  const topCategories = categories.filter((c: any) => !c.parent)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <section className="products-hero">
        <div className="container">
          <div className="breadcrumb"><a href="/">หน้าแรก</a> / ผลิตภัณฑ์</div>
          <h1>ผลิตภัณฑ์สายไฟอุตสาหกรรม</h1>
          <p>สายไฟคุณภาพสูง มาตรฐานยุโรป สต็อกพร้อมส่ง — {products.length} รุ่น</p>
        </div>
      </section>
      <div className="container">
        <div className="products-layout">
          <aside className="sidebar">
            <h3>หมวดหมู่สินค้า</h3>
            <ul className="sidebar-list">
              <li>
                <a href="/products" style={{ background: 'rgba(0,153,255,0.08)', color: 'var(--color-secondary)', fontWeight: 500 }}>
                  ทั้งหมด <span className="sidebar-count">{products.length}</span>
                </a>
              </li>
              {topCategories.map((cat: any) => (
                <li key={cat._id}>
                  <a href={`/products?cat=${cat.slug?.current}`}>
                    {cat.title} <span className="sidebar-count">{cat.productCount || 0}</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
          <div>
            {products.length === 0 ? (
              <div className="empty-state">ไม่พบสินค้า</div>
            ) : (
              <div className="products-grid">
                {products.map((prod: any) => {
                  const catSlug = prod.categories?.[0]?.slug?.current || 'default'
                  const icon = icons[catSlug] || icons.default
                  return (
                    <a key={prod._id} href={`/products/detail/${prod.slug?.current}`} className="product-card">
                      <div className="product-card-image">
                        {icon}
                        {prod.productCode && <span className="code-badge">{prod.productCode}</span>}
                      </div>
                      <div className="product-card-body">
                        <h3>{prod.title}</h3>
                        <p>{prod.shortDescription || ''}</p>
                      </div>
                      <div className="product-card-footer">
                        <span className="view-btn">ดูรายละเอียด →</span>
                      </div>
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
