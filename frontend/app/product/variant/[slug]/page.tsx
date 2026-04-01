import { getVariant, getVariants, getSiteSettings } from '@/lib/queries'
import { SITE_CONSTANTS } from '@/lib/constants'
import { urlFor } from '@/lib/sanity'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import SiblingVariants from './SiblingVariants'

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
  .variant-image-box { background: linear-gradient(145deg, #f0f4f8, #e8edf3); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 900; color: #003366; letter-spacing: 2px; min-height: 250px; overflow: hidden; position: relative; }
  .variant-image-box img { width: 100%; height: 100%; object-fit: contain; max-height: 350px; }
  .variant-info h1 { font-size: 1.6rem; font-weight: 800; color: #1a1a2e; margin-bottom: 12px; }
  .variant-parent-link { display: inline-flex; align-items: center; gap: 6px; color: #3b82f6; font-size: 0.85rem; margin-bottom: 16px; text-decoration: none; clear: both; }
  .variant-parent-link:hover { text-decoration: underline; }
  .variant-specs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 24px 0; }
  .spec-card { background: #fff; border: 1px solid #e2e8f0; border-left: 3px solid #2563eb; border-radius: 10px; padding: 16px 20px; transition: all 0.2s; }
  .spec-card:hover { box-shadow: 0 2px 8px rgba(37,99,235,0.08); border-left-color: #f0a500; }
  .spec-card .spec-label { font-size: 0.72rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .spec-card .spec-value { font-size: 1.15rem; font-weight: 800; color: #1a3c6e; }
  .spec-card .spec-unit { font-size: 0.75rem; color: #94a3b8; margin-left: 4px; font-weight: 500; }
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

  .cta-btn-call { display: inline-flex; align-items: center; gap: 8px; padding: 14px 36px; background: linear-gradient(135deg, #1a3c6e, #2563eb); color: #fff; border-radius: 50px; font-weight: 700; font-size: 1rem; text-decoration: none; box-shadow: 0 4px 14px rgba(37,99,235,0.25); transition: all 0.25s; }
  .cta-btn-call:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37,99,235,0.35); color: #fff; }
  .cta-btn-line { display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; background: linear-gradient(135deg, #06c755, #00b843); color: #fff; border-radius: 50px; font-weight: 700; font-size: 0.95rem; text-decoration: none; box-shadow: 0 4px 14px rgba(6,199,85,0.25); transition: all 0.25s; }
  .cta-btn-line:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(6,199,85,0.35); color: #fff; }
  .parent-spec-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-top: 20px; }
  .parent-spec-card .spec-card-title { font-size: 0.9rem; font-weight: 700; color: #003366; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #f0a500; display: inline-block; }
  .parent-spec-card .spec-list { list-style: none; margin: 0; }
  .parent-spec-card .spec-list li { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e8edf3; font-size: 0.85rem; }
  .parent-spec-card .spec-list li:last-child { border-bottom: none; }
  .parent-spec-card .spec-list .label { color: #64748b; }
  .parent-spec-card .spec-list .value { font-weight: 600; color: #003366; }

  @media (max-width: 768px) {
    .variant-detail { grid-template-columns: 1fr; gap: 20px; }
    .variant-image-box { min-height: 150px; font-size: 1.2rem; }
    .variant-specs { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .variant-info h1 { font-size: 1.3rem; }
    .siblings-grid { grid-template-columns: 1fr; }
    .quick-quote-inner { flex-direction: column; gap: 8px; }
    .quick-quote-actions { width: 100%; }
    .quick-quote-actions .btn { flex: 1; text-align: center; font-size: 0.78rem; }
    .cta-btn-call, .cta-btn-line { width: 100%; justify-content: center; padding: 12px 20px; font-size: 0.9rem; }
  }
  @media (max-width: 480px) {
    .variant-specs { grid-template-columns: 1fr; }
    .spec-card .spec-value { font-size: 1rem; }
  }
`

export default async function VariantDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const variant = await getVariant(slug)
  if (!variant) notFound()
  const settings = await getSiteSettings().catch(() => null)
  const phoneRaw = (settings?.phone || SITE_CONSTANTS.contact.phone).replace(/[^0-9]/g, '')
  const lineUrl = settings?.lineUrl || SITE_CONSTANTS.contact.lineUrl

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
            <Link href="/">หน้าแรก</Link> / <Link href="/products">ผลิตภัณฑ์</Link> / {parent && <><Link href={`/product/${parent.slug?.current}`}>{parent.title}</Link> / </>}{variant.title}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="variant-detail">
          <div className="variant-image-box">
            {(variant.image || parent?.image) ? (
              <Image
                src={urlFor(variant.image || parent.image).width(600).height(450).url()}
                alt={variant.title}
                width={600}
                height={450}
                style={{ objectFit: 'contain', width: '100%', height: 'auto', maxHeight: '350px', padding: '12px' }}
                priority
              />
            ) : (
              variant.model || parent?.productCode || 'NYX'
            )}
          </div>
          <div className="variant-info">
            <h1>{variant.title}</h1>
            {parent && (
              <Link href={`/product/${parent.slug?.current}`} className="variant-parent-link" style={{ display: 'block', marginBottom: '12px' }}>
                ← ดูสินค้าหลัก: {parent.title}
              </Link>
            )}
            {variant.model && <span className="product-code" style={{ display: 'inline-block', marginBottom: '8px' }}>{variant.model}</span>}

            <div style={{ marginTop: '4px' }}>
              <span className={`stock-badge ${variant.inStock !== false ? 'stock-in' : 'stock-out'}`}>
                {variant.inStock !== false ? 'พร้อมส่ง' : 'สั่งผลิต'}
              </span>
            </div>

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
            {parent && (parent.voltageRating || parent.temperatureRange || parent.standards) && (
              <div className="parent-spec-card">
                <div className="spec-card-title">ข้อมูลจากสินค้าหลัก ({parent.title})</div>
                <ul className="spec-list">
                  {parent.voltageRating && <li><span className="label">แรงดันใช้งาน</span><span className="value">{parent.voltageRating}</span></li>}
                  {parent.temperatureRange && <li><span className="label">ช่วงอุณหภูมิ</span><span className="value">{parent.temperatureRange}</span></li>}
                  {parent.standards && <li><span className="label">มาตรฐาน</span><span className="value">{parent.standards}</span></li>}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '20px' }}>
              <a href={`tel:${phoneRaw}`} className="cta-btn-call">สอบถามราคา</a>
              <a href={`${lineUrl}?text=${lineText}`} target="_blank" rel="noopener noreferrer" className="cta-btn-line">แอด LINE</a>
            </div>
          </div>
        </div>

        {/* Sibling Variants */}
        {siblings.length > 0 && (
          <SiblingVariants
            siblings={siblings}
            currentVariant={variant}
            parentTitle={parent?.title || 'สินค้านี้'}
          />
        )}
      </div>

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
            <a href={`${lineUrl}?text=${lineText}`} className="btn btn-accent" target="_blank" rel="noopener noreferrer">ขอใบเสนอราคารุ่นนี้</a>
            <a href={`tel:${phoneRaw}`} className="btn btn-primary">โทรสอบถาม</a>
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
            url: `https://www.nyxcable.com/products/variant/${variant.slug?.current}`,
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "THB",
              availability: variant.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
              seller: { "@type": "Organization", name: "NYX Cable", url: "https://www.nyxcable.com", telephone: phoneRaw }
            },
          })
        }}
      />
    </>
  )
}
