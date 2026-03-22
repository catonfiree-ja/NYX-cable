import { getCategory, getCategories, getProducts } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'
import { notFound } from 'next/navigation'

const styles = `
  .cat-hero { background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary)); color: var(--color-white); padding: var(--spacing-2xl) 0; }
  .cat-hero .breadcrumb { font-size: var(--font-size-sm); opacity: 0.7; margin-bottom: var(--spacing-md); }
  .cat-hero .breadcrumb a { color: rgba(255,255,255,0.7); }
  .cat-hero .breadcrumb a:hover { color: var(--color-accent); }
  .cat-hero h1 { font-size: var(--font-size-3xl); font-weight: 700; margin-bottom: var(--spacing-sm); }
  .cat-hero p { font-size: var(--font-size-base); opacity: 0.85; max-width: 600px; }
  .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--spacing-xl); padding: var(--spacing-3xl) 0; }
  .cat-product-card { display: block; text-decoration: none; color: inherit; border: 1px solid var(--color-gray-200); border-radius: var(--radius-xl); overflow: hidden; transition: all var(--transition-normal); position: relative; }
  .cat-product-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-xl); border-color: var(--color-secondary); }
  .cat-product-img { height: 200px; background: linear-gradient(135deg, #f0f7ff, #e8f0fe); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800; color: var(--color-primary); letter-spacing: 1px; overflow: hidden; }
  .cat-product-img img { width: 100%; height: 100%; object-fit: cover; }
  .cat-product-body { padding: var(--spacing-lg); }
  .cat-product-body h3 { font-size: var(--font-size-base); font-weight: 600; color: var(--color-primary); margin-bottom: var(--spacing-xs); }
  .cat-product-body .code { font-size: var(--font-size-xs); color: var(--color-secondary); font-weight: 500; margin-bottom: var(--spacing-sm); }
  .cat-product-body p { font-size: var(--font-size-sm); color: var(--color-gray-500); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .cat-empty { text-align: center; padding: var(--spacing-4xl) 0; color: var(--color-gray-500); }
  @media (max-width: 768px) { .cat-grid { grid-template-columns: 1fr; } }
`

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories
    .filter((c: any) => c.slug?.current)
    .map((c: any) => ({ slug: c.slug.current }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) return { title: 'หมวดหมู่ไม่พบ | NYX Cable' }
  return {
    title: `${category.title} | สายไฟอุตสาหกรรม NYX Cable`,
    description: category.shortDescription || `สายไฟ ${category.title} คุณภาพมาตรฐานยุโรป NYX Cable`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) notFound()

  const allProducts = await getProducts()
  const allCategories = await getCategories()
  const products = allProducts.filter((p: any) =>
    p.categories?.some((c: any) => c.slug?.current === slug)
  )
  const otherCategories = allCategories
    .filter((c: any) => !c.parent && c.slug?.current !== slug)
    .sort((a: any, b: any) => (b.productCount || 0) - (a.productCount || 0))
    .slice(0, 6)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <section className="cat-hero">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">หน้าแรก</a> / <a href="/products">ผลิตภัณฑ์</a> / {category.title}
          </div>
          <h1>{category.title}</h1>
          {category.shortDescription && <p>{category.shortDescription}</p>}
        </div>
      </section>

      <div className="container">
        {products.length > 0 ? (
          <div className="cat-grid">
            {products.map((product: any) => (
              <a key={product._id} href={`/products/detail/${product.slug?.current}`} className="cat-product-card">
                <div className="cat-product-img">
                  {product.image ? (
                    <Image src={urlFor(product.image).width(400).height(300).url()} alt={product.title} width={400} height={300} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                  ) : (product.productCode || 'NYX')}
                </div>
                <div className="cat-product-body">
                  <h3>{product.title}</h3>
                  {product.productCode && <div className="code">{product.productCode}</div>}
                  {product.shortDescription && <p>{product.shortDescription}</p>}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="cat-empty">
            <p>ยังไม่มีสินค้าในหมวดนี้</p>
            <a href="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>ดูสินค้าทั้งหมด</a>
          </div>
        )}
      </div>

      {/* ─── SEO Educational Content ─── */}
      {slug === 'control-cable' && (
        <section style={{ padding: '48px 0', background: '#f8fafc' }}>
          <div className="container" style={{ maxWidth: 800, lineHeight: 1.8, color: '#334155' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#003366', marginBottom: 16 }}>สายคอนโทรลคืออะไร? รู้รอบด้านพร้อมวิธีเลือก</h2>
            <p>สายคอนโทรลเป็น &quot;หัวใจ&quot; ของระบบ Automation ในโรงงานอุตสาหกรรม ใช้สำหรับส่งสัญญาณควบคุม (Control Signal) ระหว่างอุปกรณ์ต่างๆ เช่น PLC, Sensor, Motor Drive เน้นความแม่นยำของสัญญาณ ไม่ใช่พลังงานไฟฟ้าแรงสูง</p>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#003366', margin: '28px 0 12px' }}>เปรียบเทียบ: สายคอนโทรล vs สายไฟทั่วไป</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20, fontSize: '0.9rem' }}>
              <thead><tr style={{ background: '#003366', color: '#fff' }}><th style={{ padding: '10px 14px', textAlign: 'left' }}>คุณสมบัติ</th><th style={{ padding: '10px 14px', textAlign: 'left' }}>สายคอนโทรล</th><th style={{ padding: '10px 14px', textAlign: 'left' }}>สายไฟทั่วไป (Power)</th></tr></thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: '10px 14px' }}>วัตถุประสงค์</td><td style={{ padding: '10px 14px' }}>ส่งสัญญาณ / คำสั่ง (24VDC, 4-20mA)</td><td style={{ padding: '10px 14px' }}>ส่งพลังงานไฟฟ้าแรงดันสูง</td></tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f1f5f9' }}><td style={{ padding: '10px 14px' }}>โครงสร้างตัวนำ</td><td style={{ padding: '10px 14px' }}>ฝอยละเอียด Class 5/6 ยืดหยุ่นสูง</td><td style={{ padding: '10px 14px' }}>ตัวนำแข็ง Class 1/2</td></tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: '10px 14px' }}>จำนวน Core</td><td style={{ padding: '10px 14px' }}>Multicore 2-60+ Core มีตัวเลขกำกับ</td><td style={{ padding: '10px 14px' }}>2-5 Core ระบุด้วยแถบสี</td></tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f1f5f9' }}><td style={{ padding: '10px 14px' }}>การป้องกันสัญญาณ</td><td style={{ padding: '10px 14px' }}>มักมี Shield (Braid/Foil)</td><td style={{ padding: '10px 14px' }}>ไม่มี — เป็นแหล่งกำเนิดสัญญาณรบกวน</td></tr>
              </tbody>
            </table>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#003366', margin: '28px 0 12px' }}>ประเภทสายคอนโทรลที่นิยมในอุตสาหกรรม</h3>
            <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
              <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#003366' }}>1. สาย Multicore (สายคอนโทรลทั่วไป)</strong>
                <p style={{ margin: '6px 0 0', fontSize: '0.9rem' }}>ใช้เชื่อมต่อระหว่างตู้คอนโทรลไปยังเครื่องจักร — รุ่นยอดนิยม: <a href="/products/detail/ysly-jz" style={{ color: '#0066cc' }}>YSLY-JZ</a>, OPVC-JZ, JZ-500, Olflex Classic 110, CVV, VCT</p>
              </div>
              <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#003366' }}>2. สาย Shielded (สายคอนโทรลมีชีลด์)</strong>
                <p style={{ margin: '6px 0 0', fontSize: '0.9rem' }}>จำเป็นเมื่อเดินสายใกล้ VFD/Inverter — รุ่นยอดนิยม: <a href="/products/detail/liycy" style={{ color: '#0066cc' }}>LiYCY</a>, <a href="/products/detail/olflex-classic-115-cy" style={{ color: '#0066cc' }}>Olflex Classic 115 CY</a>, CVV-S มี Braided Copper Shield ป้องกัน EMI</p>
              </div>
              <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#003366' }}>3. สาย Wiring (สายเดินภายในตู้)</strong>
                <p style={{ margin: '6px 0 0', fontSize: '0.9rem' }}>สายเดี่ยวเดินวงจรภายในตู้ Switchboard — รุ่นยอดนิยม: H05V-K, H07V-K, VSF, THW-F</p>
              </div>
              <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#003366' }}>4. สาย Drag Chain (สายสำหรับรางกระดูกงู)</strong>
                <p style={{ margin: '6px 0 0', fontSize: '0.9rem' }}>ออกแบบมาพิเศษสำหรับเครื่องจักรที่เคลื่อนที่ เช่น แขนหุ่นยนต์, CNC — ฉนวน PUR ทนการเสียดสี รองรับการโค้งงอนับล้านรอบ</p>
              </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#003366', margin: '28px 0 12px' }}>วิธีเลือกสายคอนโทรลให้เหมาะกับการใช้งาน (4 ปัจจัย)</h3>
            <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #0066cc' }}>
                <strong>1. สภาพแวดล้อมสัญญาณรบกวน (EMI)</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>มี Inverter/VFD ใกล้เคียงหรือไม่? ถ้ามี &quot;ต้อง&quot; ใช้ <a href="/products/shielded-cable" style={{ color: '#0066cc' }}>สายชีลด์</a> (LiYCY, CVV-S)</p>
              </div>
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #0066cc' }}>
                <strong>2. ลักษณะการติดตั้ง: อยู่นิ่ง vs เคลื่อนที่</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>ติดตั้งถาวร → YSLY-JZ, CVV ได้ | เคลื่อนที่ → ต้องใช้สาย Drag Chain / Robot Cable</p>
              </div>
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #0066cc' }}>
                <strong>3. สภาพแวดล้อมทางกายภาพ</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>ในร่ม → PVC มาตรฐาน | เจอน้ำมัน/สารเคมี → PUR | กลางแจ้ง/UV → Black Sheath ทน UV</p>
              </div>
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #0066cc' }}>
                <strong>4. ขนาดพื้นที่หน้าตัดกับ Voltage Drop</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>ระบบ 24VDC ระยะไกล ควรขยับขนาดสาย (0.5 → 1.5 mm²) เพื่อลดความต้านทาน ป้องกัน Relay/Sensor ไม่ทำงาน</p>
              </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#003366', margin: '28px 0 12px' }}>คำถามที่พบบ่อยเกี่ยวกับสายคอนโทรล (FAQ)</h3>
            <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
              <details style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 600, color: '#003366' }}>Q: สายคอนโทรลแบบมีชีลด์ดีอย่างไร?</summary>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>มีชั้นตัวนำถักหรือฟอยล์ทำหน้าที่เป็นโล่ป้องกัน EMI จากมอเตอร์ขนาดใหญ่หรือ Inverter (VSD/VFD) ไม่ให้เข้ามาบิดเบือนสัญญาณ จำเป็นอย่างยิ่งในระบบ Analog (4-20mA)</p>
              </details>
              <details style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 600, color: '#003366' }}>Q: ใช้สายไฟทั่วไปแทนสายคอนโทรลได้ไหม?</summary>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>ไม่แนะนำ เพราะสายคอนโทรลมีตัวนำฝอยละเอียด (Class 5/6) ยืดหยุ่นสูง มี &quot;หมายเลข Core&quot; สำหรับไล่วงจร เหมาะกับตู้คอนโทรลที่พื้นที่จำกัด ซึ่งสายไฟทั่วไปไม่มีคุณสมบัติเหล่านี้</p>
              </details>
              <details style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 600, color: '#003366' }}>Q: สายคอนโทรลทนความร้อนได้กี่องศา?</summary>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>ฉนวน PVC มาตรฐาน (YSLY-JZ, CVV) ทน 70-80°C หากหน้างานร้อนกว่านี้ ควรใช้ Silicone (180°C) หรือ Teflon (260°C)</p>
              </details>
              <details style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 600, color: '#003366' }}>Q: เลือกขนาดสายคอนโทรลอย่างไร?</summary>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>พิจารณา 2 ปัจจัย: (1) พิกัดกระแสต้องรองรับโหลดปลายทาง (2) Voltage Drop โดยเฉพาะ DC 24V ระยะไกล ควรขยับขนาดสาย (0.5 → 1.5 mm²)</p>
              </details>
              <details style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 600, color: '#003366' }}>Q: สายคอนโทรลใช้กับไฟบ้าน 220V ได้ไหม?</summary>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>ได้ หากเป็นสาย Rated 300/500V ขึ้นไป แต่ต้องใช้ขนาดที่รองรับกระแสเพียงพอ สายคอนโทรลทั่วไปขนาด 0.5-1 mm² ไม่เหมาะกับโหลดกำลังสูง</p>
              </details>
              <details style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 600, color: '#003366' }}>Q: สายคอนโทรลใช้กับไฟ 3 Phase 380-400V ได้ไหม?</summary>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>บางรุ่นเช่น YSLY-JZ 1kV หรือ CVV (600V) รองรับแรงดันได้ แต่ต้องคำนวณขนาดให้เหมาะกับกระแสจริง สายคอนโทรลไม่ได้ออกแบบมาเป็นสาย Power หลัก</p>
              </details>
            </div>
          </div>
        </section>
      )}

      {slug === 'shielded-cable' && (
        <section style={{ padding: '48px 0', background: '#f8fafc' }}>
          <div className="container" style={{ maxWidth: 800, lineHeight: 1.8, color: '#334155' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#003366', marginBottom: 16 }}>สายชีลด์ (Shielded Cable) คืออะไร? ครบทุกเรื่องที่ต้องรู้</h2>
            <p>สายชีลด์คือสายไฟที่มีตัวป้องกันสัญญาณรบกวนแม่เหล็กไฟฟ้า (EMI) และคลื่นวิทยุ (RFI) ครอบรอบตัวนำ ทำให้สัญญาณที่ส่งผ่านมีความถูกต้อง ไม่ถูกบิดเบือนจากสภาพแวดล้อมภายนอก จำเป็นอย่างยิ่งเมื่อเดินสายใกล้กับสาย Power, มอเตอร์ขนาดใหญ่ หรือ Inverter (VSD/VFD)</p>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#003366', margin: '28px 0 12px' }}>เปรียบเทียบประเภทชีลด์</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20, fontSize: '0.9rem' }}>
              <thead><tr style={{ background: '#003366', color: '#fff' }}><th style={{ padding: '10px 14px', textAlign: 'left' }}>ประเภท</th><th style={{ padding: '10px 14px', textAlign: 'left' }}>ป้องกัน</th><th style={{ padding: '10px 14px', textAlign: 'left' }}>จุดเด่น</th><th style={{ padding: '10px 14px', textAlign: 'left' }}>รุ่นแนะนำ</th></tr></thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: '10px 14px' }}><strong>Tinned Copper Braid</strong></td><td style={{ padding: '10px 14px' }}>ความถี่ต่ำ ✓</td><td style={{ padding: '10px 14px' }}>ทนแรงกระแทก ความครอบคลุมสูง</td><td style={{ padding: '10px 14px' }}><a href="/products/detail/liycy" style={{ color: '#0066cc' }}>LiYCY</a></td></tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f1f5f9' }}><td style={{ padding: '10px 14px' }}><strong>Aluminum Foil</strong></td><td style={{ padding: '10px 14px' }}>ความถี่สูง ✓</td><td style={{ padding: '10px 14px' }}>น้ำหนักเบา มี Drain Wire</td><td style={{ padding: '10px 14px' }}>LiYCY(TP)</td></tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: '10px 14px' }}><strong>Double Shield (Foil+Braid)</strong></td><td style={{ padding: '10px 14px' }}>ทุกย่านความถี่ ✓✓</td><td style={{ padding: '10px 14px' }}>ป้องกันสูงสุดสำหรับงานวิกฤต</td><td style={{ padding: '10px 14px' }}><a href="/products/detail/double-shielded-cable" style={{ color: '#0066cc' }}>Double Shield</a></td></tr>
              </tbody>
            </table>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#003366', margin: '28px 0 12px' }}>การต่อกราวนด์ชีลด์ที่ถูกวิธี</h3>
            <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #0066cc' }}>
                <strong>ต่อปลายเดียว (One-end Grounding)</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>ป้องกัน Ground Loop — เหมาะกับสัญญาณ Analog 4-20mA, Thermocouple, RTD</p>
              </div>
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #0066cc' }}>
                <strong>ต่อทั้งสองปลาย (Both-ends Grounding)</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>เหมาะกับสาย Data ความเร็วสูง เช่น RS485, Ethernet, Industrial Bus</p>
              </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#003366', margin: '28px 0 12px' }}>การใช้งานในอุตสาหกรรม</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
              <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem' }}>🏭 ระบบ PLC — ป้องกัน EMI จาก VFD</div>
              <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem' }}>📡 เครือข่ายเซ็นเซอร์ — สัญญาณ 4-20mA</div>
              <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem' }}>⚡ ระบบ Servo Drive — ป้องกัน Noise</div>
              <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem' }}>🔬 อุปกรณ์วัดคุม — ต้องการความแม่นยำสูง</div>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#003366', margin: '28px 0 12px' }}>คำถามที่พบบ่อยเกี่ยวกับสายชีลด์ (FAQ)</h3>
            <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
              <details style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 600, color: '#003366' }}>Q: เมื่อไหร่ต้องใช้สายชีลด์?</summary>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>เมื่อเดินสายใกล้ Inverter/VFD, มอเตอร์ขนาดใหญ่ หรือเดินในรางเดียวกับสาย Power ต้องใช้สายชีลด์ (LiYCY, CVV-S) เพื่อป้องกัน EMI ไม่ให้บิดเบือนสัญญาณควบคุม</p>
              </details>
              <details style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 600, color: '#003366' }}>Q: Braid Shield กับ Foil Shield ต่างกันอย่างไร?</summary>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>Braid Shield (ถักทองแดง) ป้องกันความถี่ต่ำได้ดีกว่า ทนทาน เหมาะกับงานอุตสาหกรรม ส่วน Foil Shield (ฟอยล์อลูมิเนียม) ป้องกันความถี่สูงได้ดีกว่า น้ำหนักเบา ราคาถูกกว่า</p>
              </details>
              <details style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 600, color: '#003366' }}>Q: ชีลด์ต้องต่อกราวนด์ไหม?</summary>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>ต้อง! ชีลด์ที่ไม่ได้ต่อกราวนด์จะไม่ทำหน้าที่ป้องกัน แนะนำต่อปลายเดียว (One-end) สำหรับงาน Analog เพื่อป้องกัน Ground Loop หรือต่อสองปลาย (Both-ends) สำหรับสาย Data ความเร็วสูง</p>
              </details>
              <details style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 600, color: '#003366' }}>Q: สายชีลด์สามัญมีรุ่นไหนบ้าง?</summary>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>รุ่นยอดนิยม ได้แก่ <a href="/products/detail/liycy" style={{ color: '#0066cc' }}>LiYCY</a> (มาตรฐานยุโรป), <a href="/products/detail/olflex-classic-115-cy" style={{ color: '#0066cc' }}>Olflex Classic 115 CY</a>, CVV-S (มาตรฐาน JIS), และ <a href="/products/detail/double-shielded-cable" style={{ color: '#0066cc' }}>Double Shielded Cable</a> สำหรับงานที่ต้องการป้องกันสูงสุด</p>
              </details>
            </div>
          </div>
        </section>
      )}

      {slug === 'instrument-cable' && (
        <section style={{ padding: '48px 0', background: '#f8fafc' }}>
          <div className="container" style={{ maxWidth: 800, lineHeight: 1.8, color: '#334155' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#003366', marginBottom: 16 }}>สาย Instrument / Twisted Pair Cable คืออะไร?</h2>
            <p>สายอินสตรูเมนท์เป็นสายสัญญาณที่ใช้หลักการ Differential Signaling ตัวนำทบกันเป็นคู่ (Twisted Pair) เพื่อลด Crosstalk และสัญญาณรบกวนแม่เหล็ก เหมาะสำหรับระบบ RS485, RS422 และอุปกรณ์ตรวจวัดในโรงงาน</p>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#003366', margin: '28px 0 12px' }}>ประเภทสาย Twisted Pair</h3>
            <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
              <li><strong>UTP (Unshielded Twisted Pair)</strong> — สาย LAN ทั่วไป</li>
              <li><strong>FTP / STP (Shielded)</strong> — มีฟอยล์หรือถักชีลด์ป้องกันสัญญาณรบกวน เหมาะกับงานอุตสาหกรรม</li>
            </ul>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#003366', margin: '28px 0 12px' }}>การใช้งาน</h3>
            <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
              <li><strong>โรงงานอุตสาหกรรม:</strong> เชื่อมต่อ PLC, Industrial Bus (RS485/RS422), Solar Farm Monitoring</li>
              <li><strong>อาคาร/สำนักงาน:</strong> ระบบ LAN, VoIP, ระบบรักษาความปลอดภัย</li>
              <li><strong>Data Center:</strong> Backbone เครือข่ายความเร็วสูง</li>
            </ul>
          </div>
        </section>
      )}

      {/* ─── Other Categories ─── */}
      {otherCategories.length > 0 && (
        <section style={{ padding: '36px 0', background: '#fff' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2 }}>หมวดหมู่อื่น</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {otherCategories.map((c: any) => (
                <a
                  key={c._id}
                  href={`/products/${c.slug?.current}`}
                  style={{ padding: '8px 18px', border: '1px solid #e2e8f0', borderRadius: 20, fontSize: '0.85rem', color: '#003366', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s' }}
                >
                  {c.title} {c.productCount ? `(${c.productCount})` : ''}
                </a>
              ))}
              <a href="/products" style={{ padding: '8px 18px', border: '1px solid #0099ff', borderRadius: 20, fontSize: '0.85rem', color: '#0099ff', fontWeight: 600, textDecoration: 'none' }}>ดูทั้งหมด →</a>
            </div>
          </div>
        </section>
      )}

      <section className="cta-section">
        <div className="container">
          <h2>สนใจ{category.title}? ติดต่อเราวันนี้</h2>
          <p>ทีมวิศวกรพร้อมให้คำปรึกษาเลือกสายไฟที่เหมาะกับงาน</p>
          <div className="cta-actions">
            <a href="tel:021115588" className="btn btn-accent btn-lg">โทร 02-111-5588</a>
            <a href="https://page.line.me/ubb9405u" className="btn btn-line btn-lg" target="_blank" rel="noopener noreferrer">แอด LINE</a>
          </div>
        </div>
      </section>
    </>
  )
}
