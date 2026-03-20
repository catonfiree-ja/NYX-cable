import { getVariant, getVariants } from '@/lib/queries'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// ─── Static Params for SSG ───
export async function generateStaticParams() {
  const variants = await getVariants()
  return variants
    .filter((v: any) => v.slug?.current)
    .map((v: any) => ({ slug: v.slug.current }))
}

// ─── Dynamic Metadata ───
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  if (!slug) return { title: 'ไม่พบสินค้า | NYX Cable' }
  const variant = await getVariant(slug)
  if (!variant) return { title: 'ไม่พบสินค้า | NYX Cable' }
  const parent = variant.parentProduct
  return {
    title: variant.metaTitle || `${variant.title} | NYX Cable`,
    description: variant.metaDescription || `${variant.title} — สายไฟอุตสาหกรรมคุณภาพยุโรป ${parent?.productCode || ''} สอบถามราคาและสั่งซื้อวันนี้`,
  }
}

// ─── CSS ───
const styles = `
  .variant-hero { background: linear-gradient(135deg, #f8fbff, #eef4fb); padding: 16px 0; border-bottom: 1px solid #e2e8f0; }
  .variant-detail { display: grid; grid-template-columns: 300px 1fr; gap: 40px; padding: 32px 0; }
  .variant-image-box { background: linear-gradient(145deg, #f0f4f8, #e8edf3); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 900; color: #003366; letter-spacing: 2px; min-height: 250px; }
  .variant-info h1 { font-size: 1.6rem; font-weight: 800; color: #1a1a2e; margin-bottom: 8px; }
  .variant-parent-link { display: inline-flex; align-items: center; gap: 6px; color: #3b82f6; font-size: 0.85rem; margin-bottom: 16px; text-decoration: none; }
  .variant-parent-link:hover { text-decoration: underline; }
  .variant-specs { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin: 20px 0; }
  .spec-card { background: #f8fbff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; }
  .spec-card .spec-label { font-size: 0.72rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .spec-card .spec-value { font-size: 1.1rem; font-weight: 700; color: #1a1a2e; }
  .spec-card .spec-unit { font-size: 0.75rem; color: #94a3b8; margin-left: 4px; }
  .variant-siblings { margin-top: 32px; }
  .variant-siblings h2 { font-size: 1.2rem; font-weight: 700; margin-bottom: 16px; color: #1a1a2e; }
  .siblings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; }
  .sibling-card { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; text-decoration: none; color: #1a1a2e; transition: all 0.2s; }
  .sibling-card:hover { border-color: #3b82f6; background: #f0f7ff; }
  .sibling-card.current { border-color: #f0a500; background: #fffbf0; }
  .sibling-card .sibling-name { font-size: 0.82rem; font-weight: 600; }
  .sibling-card .sibling-spec { font-size: 0.7rem; color: #64748b; }

  .quick-quote-bar { position: fixed; bottom: 0; left: 0; right: 0; background: linear-gradient(180deg, #001a33, #002d5c); padding: 10px 20px; z-index: 100; border-top: 2px solid rgba(240,165,0,0.3); }
  .quick-quote-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .quick-quote-info { display: flex; align-items: center; gap: 12px; color: #fff; }
  .quick-quote-badge { background: linear-gradient(135deg, #003366, #0066cc); padding: 6px 10px; border-radius: 6px; font-weight: 800; font-size: 0.7rem; letter-spacing: 1px; }
  .quick-quote-name { font-weight: 700; font-size: 0.9rem; }
  .quick-quote-code { font-size: 0.72rem; opacity: 0.6; }
  .quick-quote-actions { display: flex; gap: 8px; }

  @media (max-width: 768px) {
    .variant-detail { grid-template-columns: 1fr; gap: 20px; }
    .variant-image-box { min-height: 150px; font-size: 1.2rem; }
    .variant-specs { grid-template-columns: repeat(2, 1fr); }
    .siblings-grid { grid-template-columns: 1fr; }
    .quick-quote-inner { flex-direction: column; gap: 8px; }
    .quick-quote-actions { width: 100%; }
    .quick-quote-actions .btn { flex: 1; text-align: center; font-size: 0.78rem; }
  }
`

export default async function VariantDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const variant = await getVariant(slug)
  if (!variant) notFound()

  const parent = variant.parentProduct
  const siblings = variant.siblingVariants || []

  const specItems = [
    { label: 'จำนวนแกน', value: variant.cores, unit: 'แกน' },
    { label: 'พื้นที่หน้าตัด', value: variant.crossSection, unit: 'mm²' },
    { label: 'เส้นผ่านศูนย์กลาง', value: variant.outerDiameter, unit: 'mm' },
    { label: 'น้ำหนักทองแดง', value: variant.copperWeight, unit: 'kg/km' },
    { label: 'น้ำหนักรวม', value: variant.totalWeight, unit: 'kg/km' },
    { label: 'ความต้านทาน @20°C', value: variant.conductorResistance, unit: 'Ω/km' },
    { label: 'เส้นลวด', value: variant.strandsInfo, unit: '' },
    { label: 'ความยาวบรรจุ', value: variant.packingLength, unit: 'm/ม้วน' },
  ].filter(s => s.value)

  const lineText = encodeURIComponent(`ขอใบเสนอราคา: ${variant.title}${variant.model ? ` (${variant.model})` : ''}`)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="variant-hero">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">หน้าแรก</a> / <a href="/products">ผลิตภัณฑ์</a> / {parent && <><a href={`/products/detail/${parent.slug?.current}`}>{parent.title}</a> / </>}{variant.title}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="variant-detail">
          <div className="variant-image-box">
            {variant.model || parent?.productCode || 'NYX'}
          </div>
          <div className="variant-info">
            <h1>{variant.title}</h1>
            {parent && (
              <a href={`/products/detail/${parent.slug?.current}`} className="variant-parent-link">
                ← ดูสินค้าหลัก: {parent.title}
              </a>
            )}
            {variant.model && <span className="product-code">{variant.model}</span>}

            <span className={`stock-badge ${variant.inStock !== false ? 'stock-in' : 'stock-out'}`} style={{ display: 'inline-block', marginTop: '12px' }}>
              {variant.inStock !== false ? 'พร้อมส่ง' : 'สั่งผลิต'}
            </span>

            {specItems.length > 0 ? (
              <div className="variant-specs">
                {specItems.map((s, i) => (
                  <div key={i} className="spec-card">
                    <div className="spec-label">{s.label}</div>
                    <div className="spec-value">{s.value}<span className="spec-unit">{s.unit}</span></div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#64748b', marginTop: '16px', lineHeight: 1.7 }}>
                สอบถามรายละเอียดสเปกและราคาได้ที่ทีมงาน
              </p>
            )}

            {/* Parent product specs */}
            {parent && (
              <ul className="spec-list" style={{ marginTop: '16px' }}>
                {parent.voltageRating && <li><span className="label">แรงดันใช้งาน</span><span className="value">{parent.voltageRating}</span></li>}
                {parent.temperatureRange && <li><span className="label">ช่วงอุณหภูมิ</span><span className="value">{parent.temperatureRange}</span></li>}
                {parent.standards && <li><span className="label">มาตรฐาน</span><span className="value">{parent.standards}</span></li>}
              </ul>
            )}

            <div className="product-actions" style={{ marginTop: '20px' }}>
              <a href="tel:021115588" className="btn btn-primary btn-lg">สอบถามราคา</a>
              <a href={`https://page.line.me/ubb9405u?text=${lineText}`} className="btn btn-line btn-lg" target="_blank" rel="noopener noreferrer">แอด LINE</a>
            </div>
          </div>
        </div>

        {/* Sibling Variants */}
        {siblings.length > 0 && (
          <section className="variant-siblings">
            <h2>ขนาดอื่นๆ ของ {parent?.title || 'สินค้านี้'}</h2>
            <div className="siblings-grid">
              {/* Current variant */}
              <div className="sibling-card current">
                <div>
                  <div className="sibling-name">{variant.title} ← ดูอยู่</div>
                  {variant.crossSection && <div className="sibling-spec">{variant.cores && `${variant.cores} แกน × `}{variant.crossSection} mm²</div>}
                </div>
              </div>
              {siblings.map((s: any) => (
                <a key={s._id} href={`/products/variant/${s.slug?.current}`} className="sibling-card">
                  <div>
                    <div className="sibling-name">{s.title}</div>
                    {s.crossSection && <div className="sibling-spec">{s.cores && `${s.cores} แกน × `}{s.crossSection} mm²</div>}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* CTA Section */}
      <section className="cta-section" style={{ marginTop: '40px' }}>
        <div className="container">
          <h2>สนใจ {variant.title}? ติดต่อเราวันนี้</h2>
          <p>ทีมวิศวกรพร้อมให้คำปรึกษาเลือกขนาดที่เหมาะกับงาน</p>
          <div className="cta-actions">
            <a href="tel:021115588" className="btn btn-accent btn-lg">โทร 02-111-5588</a>
            <a href={`https://page.line.me/ubb9405u?text=${lineText}`} className="btn btn-line btn-lg" target="_blank" rel="noopener noreferrer">แอด LINE</a>
          </div>
        </div>
      </section>

      {/* Quick Quote Floating Bar */}
      <div className="quick-quote-bar">
        <div className="quick-quote-inner">
          <div className="quick-quote-info">
            <div className="quick-quote-badge">NYX</div>
            <div>
              <div className="quick-quote-name">{variant.title}</div>
              {variant.model && <div className="quick-quote-code">{variant.model}</div>}
            </div>
          </div>
          <div className="quick-quote-actions">
            <a href={`https://page.line.me/ubb9405u?text=${lineText}`} className="btn btn-accent" target="_blank" rel="noopener noreferrer">ขอใบเสนอราคารุ่นนี้</a>
            <a href="tel:021115588" className="btn btn-primary">โทรสอบถาม</a>
          </div>
        </div>
      </div>

      {/* Schema.org Product JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: variant.title,
            description: `${variant.title} — สายไฟอุตสาหกรรมคุณภาพยุโรป`,
            sku: variant.model || variant.slug?.current,
            brand: { "@type": "Brand", name: "NYX Cable" },
            manufacturer: { "@type": "Organization", name: "NYX Cable" },
            category: "สายไฟอุตสาหกรรม",
            url: `https://nyx-cable.vercel.app/products/variant/${variant.slug?.current}`,
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "THB",
              availability: variant.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
              seller: { "@type": "Organization", name: "NYX Cable", url: "https://nyx-cable.vercel.app", telephone: "021115588" }
            },
          })
        }}
      />
    </>
  )
}
