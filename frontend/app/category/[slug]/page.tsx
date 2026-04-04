import { getCategory, getCategories, getProducts, getSiteSettings } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { decodeHtmlEntities } from '@/lib/decode-html'
import { categoryProductsMap } from '@/data/category-products'
import { BreadcrumbSchema, FAQSchema } from '@/components/StructuredData'

// CMS slug → hardcoded slug mapping (for categories where CMS uses different slug)
const categorySlugAliases: Record<string, string> = {
  'vsf': 'wiring-cable',
  'rubber-cable': 'water-resistant-cable',
}

// Resolve CMS slug to hardcoded key
function resolveSlug(slug: string): string {
  return categorySlugAliases[slug] || slug
}

const styles = `
  .cat-hero {
    background: linear-gradient(160deg, #001a33 0%, #002d5c 35%, #003d7a 70%, #002244 100%);
    color: #fff; padding: 48px 0 40px;
    position: relative; overflow: hidden;
  }
  .cat-hero::before {
    content: ''; position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 400'%3E%3Ccircle cx='200' cy='200' r='200' fill='rgba(0,153,255,0.06)'/%3E%3Ccircle cx='1200' cy='100' r='150' fill='rgba(240,165,0,0.04)'/%3E%3C/svg%3E") no-repeat center;
    background-size: cover;
  }
  .cat-hero .container { position: relative; z-index: 1; }
  .cat-hero .breadcrumb { font-size: 0.82rem; margin-bottom: 12px; }
  .cat-hero .breadcrumb a { color: rgba(255,255,255,0.65); text-decoration: none; transition: color 0.2s; }
  .cat-hero .breadcrumb a:hover { color: #f0a500; }
  .cat-hero h1 { font-size: 2.2rem; font-weight: 800; margin-bottom: 12px; }
  .cat-hero p { font-size: 1rem; opacity: 0.8; max-width: 600px; line-height: 1.7; }
  .cat-hero .product-count-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 16px; border-radius: 50px;
    background: rgba(240,165,0,0.15); border: 1px solid rgba(240,165,0,0.3);
    font-size: 0.82rem; font-weight: 600; color: #f0a500;
    margin-top: 16px;
  }
  .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; padding: 36px 0 56px; }
  .cat-product-card {
    display: block; text-decoration: none; color: inherit;
    border: 1px solid #e8edf3; border-radius: 16px;
    overflow: hidden; transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
    position: relative; background: #fff;
    box-shadow: 0 2px 8px rgba(0,51,102,0.04);
  }
  .cat-product-card:hover { transform: translateY(-6px); box-shadow: 0 12px 36px rgba(0,51,102,0.12); border-color: rgba(0,153,255,0.3); }
  .cat-product-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #003366, #0099ff); opacity: 0; transition: opacity 0.3s; z-index: 1; }
  .cat-product-card:hover::before { opacity: 1; }
  .cat-product-img { background: #f8fafc; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; font-weight: 700; color: #003366; letter-spacing: 0.3px; overflow: hidden; text-align: center; line-height: 1.5; word-break: break-word; }
  .cat-product-img img { width: 100%; height: auto; display: block; transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); }
  .cat-product-card:hover .cat-product-img img { transform: scale(1.05); }
  .cat-product-body { padding: 20px; }
  .cat-product-body h3 { font-size: 0.95rem; font-weight: 700; color: #003366; margin-bottom: 6px; }
  .cat-product-body .code { font-size: 0.72rem; color: #0099ff; font-weight: 600; margin-bottom: 10px; letter-spacing: 0.3px; }
  .cat-product-body p { font-size: 0.82rem; color: #64748b; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .cat-empty { text-align: center; padding: 80px 0; color: #64748b; }
  @media (max-width: 768px) {
    .cat-hero h1 { font-size: 1.5rem; }
    .cat-grid { grid-template-columns: 1fr; }
  }
`

export async function generateStaticParams() {
  // Combine CMS slugs + hardcoded slugs + alias slugs
  const categories = await getCategories().catch(() => [])
  const cmsParams = categories
    .filter((c: any) => c.slug?.current)
    .map((c: any) => ({ slug: c.slug.current }))
  const hardcodedParams = Object.keys(categoryProductsMap).map(slug => ({ slug }))
  const aliasParams = Object.keys(categorySlugAliases).map(slug => ({ slug }))
  const allSlugs = new Set([...cmsParams.map((p: any) => p.slug), ...hardcodedParams.map(p => p.slug), ...aliasParams.map(p => p.slug)])
  return Array.from(allSlugs).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params
  const slug = resolveSlug(rawSlug)

  // Try CMS first for SEO data
  const cmsCategory = await getCategory(slug).catch(() => null)
  const hardcoded = categoryProductsMap[slug]

  const title = cmsCategory?.metaTitle
    || (hardcoded ? `${hardcoded.title} | สายไฟอุตสาหกรรม NYX Cable` : null)
    || (cmsCategory ? `${cmsCategory.title} | สายไฟอุตสาหกรรม NYX Cable` : 'หมวดหมู่ไม่พบ | NYX Cable')

  const description = cmsCategory?.metaDescription
    || hardcoded?.shortDescription
    || cmsCategory?.shortDescription
    || `สายไฟคุณภาพมาตรฐานยุโรป NYX Cable`

  return {
    title,
    description,
    alternates: { canonical: `https://www.nyxcable.com/category/${slug}` },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params
  const slug = resolveSlug(rawSlug)

  // Fetch CMS data first
  const cmsCategory = await getCategory(slug).catch(() => null)
  const hardcoded = categoryProductsMap[slug]

  // Determine title (CMS or hardcoded)
  const categoryTitle = hardcoded?.title || cmsCategory?.title
  if (!categoryTitle) notFound()

  const categoryDesc = hardcoded?.shortDescription || cmsCategory?.shortDescription || ''

  // Build CMS product lookup by slug for enrichment (ALL products, not just this category)
  const allCmsProducts = await getProducts().catch(() => [])
  const settings = await getSiteSettings().catch(() => null)
  const sitePhone = settings?.phone || '02-111-5588'
  const sitePhoneRaw = sitePhone.replace(/[^0-9]/g, '')
  const siteLineOA = settings?.lineOA || '@nyxcable'
  const siteLineUrl = settings?.lineUrl || 'https://page.line.me/ubb9405u'
  const cmsProductMap: Record<string, any> = {}
  for (const p of allCmsProducts) {
    const s = p.slug?.current
    if (s) cmsProductMap[s] = p
  }

  // Master product list: hardcoded structure enriched with CMS data
  const hardcodedProducts = hardcoded?.products || []
  const hardcodedSlugs = new Set(hardcodedProducts.map((hp: any) => hp.slug))

  const products = hardcodedProducts.map((hp: any) => {
    const cms = cmsProductMap[hp.slug]
    const cmsImage = cms?.image ? urlFor(cms.image).width(400).height(400).url() : null
    return {
      slug: hp.slug,
      title: cms?.title || hp.title,
      code: cms?.productCode || hp.code,
      shortDescription: cms?.shortDescription || hp.shortDescription,
      image: cmsImage || hp.image || null,
      subGroup: hp.subGroup || null,
    }
  })

  // Also include CMS-only products (added by client in Sanity but not in hardcode)
  const cmsOnlyProducts = (cmsCategory?.products || [])
    .filter((cp: any) => cp.slug?.current && !hardcodedSlugs.has(cp.slug.current))
    .map((cp: any) => ({
      slug: cp.slug.current,
      title: cp.title,
      code: cp.productCode || '',
      shortDescription: cp.shortDescription || '',
      image: cp.image ? urlFor(cp.image).width(400).height(400).url() : null,
    }))
  products.push(...cmsOnlyProducts)

  // For "other categories" sidebar, use hardcoded keys
  const otherCatSlugs = Object.keys(categoryProductsMap).filter(s => s !== slug).slice(0, 6)

  // Build FAQ data for schema
  const faqData = (cmsCategory?.faqItems || []).map((item: any) => ({
    question: item.question || '',
    answer: item.answer || '',
  })).filter((f: any) => f.question && f.answer)

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'หน้าแรก', url: 'https://www.nyxcable.com' },
        { name: 'ผลิตภัณฑ์', url: 'https://www.nyxcable.com/products' },
        { name: categoryTitle, url: `https://www.nyxcable.com/category/${slug}` },
      ]} />
      {faqData.length > 0 && <FAQSchema faqs={faqData} />}
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <section className="cat-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">หน้าแรก</Link> › <Link href="/products">ผลิตภัณฑ์</Link> › {categoryTitle}
          </div>
          <h1>{categoryTitle}</h1>
          {categoryDesc && <p>{categoryDesc}</p>}
          {products.length > 0 && <div className="product-count-badge">{products.length} รุ่นในหมวดนี้</div>}
        </div>
      </section>

      <div className="container">
        {products.length > 0 ? (
          <div className="cat-grid">
            {(() => {
              let lastGroup = ''
              return products.map((product: any, idx: number) => {
                const groupHeader = product.subGroup && product.subGroup !== lastGroup
                  ? <h2 key={`group-${product.subGroup}`} style={{ gridColumn: '1 / -1', fontSize: '1.6rem', fontWeight: 800, color: '#003366', margin: idx === 0 ? '0 0 -8px' : '24px 0 -8px', padding: 0 }}>{product.subGroup}</h2>
                  : null
                if (product.subGroup) lastGroup = product.subGroup
                return (
                  <>{groupHeader}
                  <a key={product.slug} href={`/product/${product.slug}`} className="cat-product-card">
                    <div className="cat-product-img">
                      {product.image ? (
                        <img src={product.image} alt={product.title} width={400} height={400} style={{ width: '100%', height: 'auto', display: 'block' }} loading="lazy" />
                      ) : (product.code || 'NYX')}
                    </div>
                    <div className="cat-product-body">
                      <h3>{product.title}</h3>
                      <div className="code">{product.code}</div>
                      <p>{product.shortDescription}</p>
                    </div>
                  </a></>
                )
              })
            })()}
          </div>
        ) : (
          <div className="cat-empty">
            <p>ยังไม่มีสินค้าในหมวดนี้</p>
            <Link href="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>ดูสินค้าทั้งหมด</Link>
          </div>
        )}
      </div>

      {/* ─── SEO Educational Content ─── */}
      {slug === 'control-cable' && (
        <section style={{ padding: '48px 0', background: '#f8fafc' }}>
          <div className="container" style={{ maxWidth: 800, lineHeight: 1.8, color: '#334155' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#003366', marginBottom: 16 }}>YSLY-JZ สายคอนโทรลคุณภาพสูงสำหรับโรงงานอุตสาหกรรม</h2>
            <img src="/images/products/compare-multi-core-cable-2.jpg" alt="เปรียบเทียบสายคอนโทรล YSLY-JZ กับสาย VCT และ CVV" width={1024} height={576} style={{ width: '100%', height: 'auto', borderRadius: 12, marginBottom: 20 }} />
            <p>สายไฟคอนโทรล ถือเป็นหัวใจสำคัญของงานระบบไฟฟ้าในโรงงานอุตสาหกรรมและระบบอัตโนมัติ (Automation System) เพราะเป็นสายที่ใช้ควบคุมการทำงานของเครื่องจักร การส่งสัญญาณ และการเชื่อมต่ออุปกรณ์ไฟฟ้าหลายชนิดเข้าด้วยกันอย่างมีประสิทธิภาพ รวมถึงต้องมีความทนทาน ความแม่นยำในการส่งสัญญาณ และความปลอดภัย ซึ่งเป็นคุณสมบัติหลักที่ไม่อาจมองข้ามได้</p>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#003366', margin: '28px 0 12px' }}>สายคอนโทรล (Control Cable) คืออะไร ?</h3>
            <p>สายคอนโทรล (Control Cable) คือ สายไฟฟ้าประเภทหนึ่งที่ออกแบบมาโดยเฉพาะสำหรับการส่งสัญญาณควบคุม การวัดค่า และการเชื่อมต่อระหว่างแผงควบคุม (Control Panel) หรือตู้ควบคุม กับอุปกรณ์ภาคสนาม เช่น เซนเซอร์, สวิตช์, วาล์ว, มอเตอร์ หรือเครื่องจักรต่าง ๆ โดยทั่วไปแล้วสายคอนโทรลจะมีลักษณะเป็นสายหลายแกน (Multi-Core) ที่มีความยืดหยุ่นสูง เพื่อให้ง่ายต่อการติดตั้งและเดินสายในพื้นที่จำกัดของตู้ควบคุมหรือตามรางเดินสายไฟ</p>
            <p>เมื่อเปรียบเทียบกับสายไฟฟ้าที่ใช้ในระบบไฟฟ้าทั่วไป สายคอนโทรลมักจะออกแบบให้มีฉนวนที่บางกว่า เนื่องจากเกรดของ PVC ที่ใช้มีคุณภาพสูงกว่า ทำให้ทนทานต่อสภาพแวดล้อมทางอุตสาหกรรมได้ดี มีความอ่อนตัว และรองรับแรงดันไฟฟ้าได้ถึง 1,000V อย่างมีประสิทธิภาพ</p>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#003366', margin: '28px 0 12px' }}>ประเภทของสายคอนโทรลที่ NYX Cable จำหน่าย</h3>
            <ol style={{ paddingLeft: 20, marginBottom: 24 }}>
              <li><Link href="/products?category=control-cable" style={{ color: '#0066cc', fontWeight: 600 }}>สายมัลติคอร์ (Multicore Cable)</Link></li>
              <li><Link href="/products?category=control-cable" style={{ color: '#0066cc', fontWeight: 600 }}>สายไฟอ่อนสำหรับเดินงาน Control และ Power</Link></li>
              <li><Link href="/category/twisted-pair-cable" style={{ color: '#0066cc', fontWeight: 600 }}>สายคู่บิดเกลียว ไม่มีชีลด์</Link></li>
              <li><Link href="/products?category=control-cable" style={{ color: '#0066cc', fontWeight: 600 }}>สาย Wiring ตู้คอนโทรล</Link></li>
            </ol>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#003366', margin: '28px 0 12px' }}>สายคอนโทรลเหมาะสำหรับการใช้งานหรืออุตสาหกรรมประเภทใด ?</h3>
            <p>ด้วยคุณสมบัติเด่นด้านความยืดหยุ่นและความทนทาน สายไฟฟ้าคอนโทรลจึงเป็นที่ต้องการอย่างยิ่งในหลากหลายอุตสาหกรรมที่ต้องพึ่งพาระบบการวัดและควบคุมอุปกรณ์ต่าง ๆ ระบบอัตโนมัติภายในโรงงาน เช่น</p>
            <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
              <li><strong>อุตสาหกรรมการผลิตและโรงงานอัตโนมัติ :</strong> โดยจะใช้สาย Wiring สำหรับตู้คอนโทรล เพื่อเชื่อมต่อ PLC, รีเลย์ และอุปกรณ์ควบคุมต่าง ๆ ให้เข้ากับเครื่องจักรและสายพานการผลิต</li>
              <li><strong>ระบบอาคารอัจฉริยะ (Smart Building) :</strong> สำหรับการควบคุมระบบ HVAC (เครื่องปรับอากาศ), ระบบไฟส่องสว่าง และระบบรักษาความปลอดภัย</li>
              <li><strong>เครื่องจักรและอุปกรณ์เคลื่อนที่ :</strong> เนื่องจากสายคอนโทรลมีความยืดหยุ่นสูง จึงเหมาะสำหรับส่วนที่ต้องมีการเคลื่อนไหว เช่น รางกระดูกงู เครน Cable Reel แขนกล หุ่นยนต์ และเครื่องมือกล</li>
              <li><strong>ระบบขนส่งและโลจิสติกส์ :</strong> นิยมใช้สายไฟตู้คอนโทรลในระบบลำเลียง (Conveyor System) และระบบคลังสินค้าอัตโนมัติ</li>
            </ul>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#003366', margin: '28px 0 12px' }}>แนะนำสายคอนโทรล YSLY-JZ</h3>
            <p>สายไฟฟ้าคอนโทรลตระกูล YSLY เป็นตัวเลือกยอดนิยมที่หลายประเทศในยุโรปเลือกใช้ ด้วยโครงสร้างที่ออกแบบมาให้มีความยืดหยุ่น สามารถนำไฟฟ้าได้ดี ใช้ฉนวน PVC ตามมาตรฐาน จึงทำให้มีความน่าเชื่อถือสูง</p>

            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#003366', margin: '20px 0 10px' }}>โครงสร้างของสาย YSLY-JZ</h4>
            <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #0066cc' }}>
                <strong>1. ตัวนำทองแดง</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>ใช้ตัวนำทองแดงเปลือยเส้นฝอยละเอียด (Class 5) ทำให้มีความอ่อนตัวสูงเทียบเท่าสาย VCT เมื่อมีขนาดหน้าตัดเท่ากัน</p>
              </div>
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #0066cc' }}>
                <strong>2. ฉนวนภายใน</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>ทำจาก PVC มีสีดำ โดยแต่ละแกนจะพิมพ์กำกับด้วยตัวเลข เพื่อความง่ายและแม่นยำในการระบุสายขณะติดตั้ง</p>
              </div>
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #0066cc' }}>
                <strong>3. ฉนวนภายนอก</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>ทำจาก PVC มีสีเทาหรือสีดำ พิมพ์กำกับด้วยสีดำหรือสีขาว บอกขนาดของสายไฟเป็น mm² และจำนวน Core ของสายไฟ</p>
              </div>
            </div>

            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#003366', margin: '20px 0 10px' }}>สรุปความแตกต่างของสายไฟฟ้าคอนโทรลรุ่น YSLY-JZ และ YSLY-OZ</h4>
            <p>รุ่นหลักที่ใช้กันทั่วไปในตลาดคือ YSLY-JZ และ YSLY-OZ ซึ่งความแตกต่างของรหัส JZ และ OZ นั้น เป็นการบ่งชี้ถึงรูปแบบการเดินสายดิน (Grounding) ตามมาตรฐานการติดตั้งในยุโรป ดังนี้</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20, fontSize: '0.9rem' }}>
              <thead><tr style={{ background: '#003366', color: '#fff' }}><th style={{ padding: '10px 14px', textAlign: 'left' }}>รุ่น</th><th style={{ padding: '10px 14px', textAlign: 'left' }}>สายดิน</th><th style={{ padding: '10px 14px', textAlign: 'left' }}>ตัวอย่าง</th><th style={{ padding: '10px 14px', textAlign: 'left' }}>รูปแบบสาย</th></tr></thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: '10px 14px' }}><strong>YSLY-JZ</strong></td><td style={{ padding: '10px 14px' }}>มี (สีเขียวคาดเหลือง)</td><td style={{ padding: '10px 14px' }}>YSLY-JZ 3G1 = 3 แกน, G = มีกราวนด์, 1 = 1.0 mm²</td><td style={{ padding: '10px 14px' }}>พิมพ์กำกับด้วยเลข 1, 2 และสีเขียวคาดเหลือง</td></tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f1f5f9' }}><td style={{ padding: '10px 14px' }}><strong>YSLY-OZ</strong></td><td style={{ padding: '10px 14px' }}>ไม่มี</td><td style={{ padding: '10px 14px' }}>YSLY-OZ 3X1 = 3 แกน, X = ไม่มีกราวนด์, 1 = 1.0 mm²</td><td style={{ padding: '10px 14px' }}>มาร์คด้วยเลข 1, 2, 3 (ทุกแกนเป็นสีดำ)</td></tr>
              </tbody>
            </table>
            <p>การจำแนกด้วยรหัส JZ และ OZ ช่วยให้ผู้ใช้งานสามารถเลือกสาย Control Cable ที่มีโครงสร้างตรงตามข้อกำหนดของระบบควบคุมไฟฟ้าและข้อบังคับด้านความปลอดภัยได้อย่างถูกต้องแม่นยำ</p>

            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#003366', margin: '20px 0 10px' }}>จุดเด่นของ YSLY-JZ เมื่อเทียบกับสายคอนโทรลทั่วไป (VCT / IEC 53 และ CVV)</h4>
            <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #f0a500' }}>
                <strong>ประหยัดพื้นที่</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>YSLY-JZ ออกแบบมาสำหรับติดตั้งในระบบไฟฟ้าสำหรับโรงงานอุตสาหกรรมโดยเฉพาะ จึงมีฉนวนที่บางกว่าเพราะใช้ PVC เกรดที่ดีกว่าสายไฟทั่วไป ทำให้สามารถลดขนาดพื้นที่หน้าตัดของสายไฟได้ 40-65% แต่คุณสมบัติทางไฟฟ้ายังเหมือนเดิม ซึ่งทำให้ประหยัดขนาดและลดค่าท่อของท่อร้อยสายไฟ</p>
              </div>
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #f0a500' }}>
                <strong>ความยืดหยุ่นสูง</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>มีความอ่อนตัวมากกว่าแม้จะใช้ทองแดงความละเอียดเท่ากับสายไฟ VCT เนื่องจากฉนวน PVC ที่บางกว่า จึงทำให้ติดตั้งได้ดีและดัดโค้งงอได้อย่างยืดหยุ่น ทำให้สามารถจบงานได้ไวและลดค่าแรงลง</p>
              </div>
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #f0a500' }}>
                <strong>รองรับแรงดันไฟฟ้าได้สูง</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>สามารถรับแรงดันไฟฟ้าได้ถึง 500V จึงทำให้สามารถนำไปใช้กับไฟฟ้า 3 เฟส ที่มีกระแสไฟฟ้าที่ 380-420V ได้เป็นอย่างดี</p>
              </div>
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #f0a500' }}>
                <strong>ผลิตได้หลายขนาด</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>มีพื้นที่หน้าตัดตั้งแต่ 0.5 mm² – 240 mm² และสามารถสั่งผลิตได้ถึง 100 คอร์ ต่างจากสาย CVV ที่มีไลน์การผลิตเพียง 30 คอร์เท่านั้น</p>
              </div>
            </div>
            <p>ในส่วนของชื่อเรียกแต่ละแบรนด์ของสายไฟฟ้าคอนโทรล YSLY-JZ ที่มีขายในประเทศไทยนั้นมีหลายชื่อ เช่น Olflex Classic 110, OPVC-JZ และ JZ-500 โดยแต่ละชื่อของสายไฟ จะกำหนดให้แตกต่างกันไปในแต่ละยี่ห้อ</p>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#003366', margin: '28px 0 12px' }}>วิธีเลือกซื้อสายคอนโทรล YSLY-JZ</h3>
            <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #0066cc' }}>
                <strong>1. จำนวนแกน</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>พิจารณาจากอุปกรณ์ควบคุมที่ต้องการเชื่อมต่อ</p>
              </div>
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #0066cc' }}>
                <strong>2. ขนาดพื้นที่หน้าตัด (Core &amp; Size)</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>พิจารณาจากปริมาณกระแสไฟฟ้าที่ต้องใช้และความต้านทานรวมของสายไฟ</p>
              </div>
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #0066cc' }}>
                <strong>3. แรงดันไฟฟ้าที่รองรับ (Voltage Rating)</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>สาย Control Cable ทั่วไปมักรองรับแรงดัน 300-500V แต่บางรุ่นสามารถรองรับได้สูงถึง 1,000V ดังนั้น จึงควรสอบถามคุณสมบัติการรองรับกระแสไฟฟ้า เพื่อให้ได้สายไฟที่เหมาะสมกับการติดตั้งและใช้งาน</p>
              </div>
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #0066cc' }}>
                <strong>4. โครงสร้างฉนวนและชีลด์ (Insulation &amp; Shielding)</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>หากติดตั้งในพื้นที่ที่มีคลื่นรบกวนสูง ควรเลือกสาย Control Cable แบบมีชีลด์ เพื่อให้การส่งสัญญาณแม่นยำ ไม่ถูกรบกวนจากคลื่นแม่เหล็กไฟฟ้าที่เกิดจากอุปกรณ์ต่าง ๆ ในโรงงาน โดยเฉพาะอินเวอร์เตอร์</p>
              </div>
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #0066cc' }}>
                <strong>5. สีของฉนวนภายนอก</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>สีเทาเหมาะสำหรับการเดินภายในและภายนอก (ต้องร้อยท่อ) / สีดำเหมาะสำหรับเดินภายในและภายนอก (โดยตรงไม่ต้องร้อยท่อ)</p>
              </div>
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #0066cc' }}>
                <strong>6. ความยืดหยุ่นและความทนทาน</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>สำหรับงานที่มีการสั่นสะเทือนหรือต้องเคลื่อนไหว โค้งงอเล็กน้อย ควรเลือกสายที่มีความอ่อนตัว เช่น สาย YSLY-JZ ที่ทำมาจากวัสดุที่ได้คุณภาพ ช่วยยืดอายุการใช้งานของสายไฟ ทองแดงไม่ขาดในเหมือนสายทั่วๆไปตามท้องตลาด</p>
              </div>
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, borderLeft: '4px solid #0066cc' }}>
                <strong>7. สายคอนโทรล ราคา และมาตรฐาน</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>เลือกจากผู้ผลิตหรือผู้นำเข้าที่มีมาตรฐานรองรับ เช่น IEC, CE, TIS หรือ VDE เพื่อความปลอดภัยและอายุการใช้งานที่ยาวนาน</p>
              </div>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#003366', margin: '32px 0 16px' }}>ราคาสายคอนโทรล YSLY-JZ ของ NYX CABLE</h2>
            <div style={{ overflowX: 'auto', marginBottom: 24 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', minWidth: 700 }}>
                <thead><tr style={{ background: '#003366', color: '#fff' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', whiteSpace: 'nowrap' }}>Model</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>NO. of strands × Max strand Dia.(mm)</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Outer Dia. (mm)</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Cu Weight (kg/km)</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Weight (kg/km)</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Conductor Resistance @ 20°C (Ω/km)</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right', whiteSpace: 'nowrap' }}>ราคา (บาท/ม.)</th>
                </tr></thead>
                <tbody>
                  {[
                    ['YSLY-OZ 2X0.5', '16×0.20', '4.9', '9.6', '38', '39.0', '14.44'],
                    ['YSLY-JZ 3G0.5', '16×0.20', '5.2', '14.4', '47', '39.0', '19.54'],
                    ['YSLY-JZ 4G0.5', '16×0.20', '5.7', '19.2', '58', '39.0', '24.37'],
                    ['YSLY-JZ 5G0.5', '16×0.20', '6.0', '24', '75', '39.0', '30.34'],
                    ['YSLY-JZ 6G0.5', '16×0.20', '6.5', '28.8', '89', '39.0', '40.00'],
                    ['YSLY-JZ 7G0.5', '16×0.20', '7.1', '33.6', '93', '39.0', '44.58'],
                    ['YSLY-JZ 8G0.5', '16×0.20', '7.7', '38.4', '110', '39.0', '51.40'],
                    ['YSLY-JZ 10G0.5', '16×0.20', '8.6', '48', '140', '39.0', '64.42'],
                    ['YSLY-JZ 12G0.5', '16×0.20', '9.1', '58', '150', '39.0', '75.54'],
                    ['YSLY-JZ 14G0.5', '16×0.20', '9.3', '67', '170', '39.0', '90.65'],
                    ['YSLY-JZ 16G0.5', '16×0.20', '10.4', '77', '195', '39.0', '101.46'],
                    ['YSLY-JZ 18G0.5', '16×0.20', '10.8', '86', '215', '39.0', '113.29'],
                    ['YSLY-JZ 20G0.5', '16×0.20', '11.8', '96', '230', '39.0', '123.86'],
                    ['YSLY-JZ 21G0.5', '16×0.20', '12.0', '101', '245', '39.0', '135.44'],
                    ['YSLY-JZ 25G0.5', '16×0.20', '12.8', '120', '280', '39.0', '152.66'],
                    ['YSLY-JZ 30G0.5', '16×0.20', '13.7', '144', '310', '39.0', '184.45'],
                    ['YSLY-JZ 32G0.5', '16×0.20', '14.0', '154', '345', '39.0', '199.00'],
                    ['YSLY-JZ 35G0.5', '16×0.20', '14.9', '168', '390', '39.0', '235.08'],
                    ['YSLY-JZ 50G0.5', '16×0.20', '17.6', '240', '510', '39.0', '409.97'],
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', background: i % 2 === 1 ? '#f1f5f9' : '#fff' }}>
                      <td style={{ padding: '7px 10px', fontWeight: 600, whiteSpace: 'nowrap' }}>{row[0]}</td>
                      <td style={{ padding: '7px 10px', textAlign: 'center' }}>{row[1]}</td>
                      <td style={{ padding: '7px 10px', textAlign: 'center' }}>{row[2]}</td>
                      <td style={{ padding: '7px 10px', textAlign: 'center' }}>{row[3]}</td>
                      <td style={{ padding: '7px 10px', textAlign: 'center' }}>{row[4]}</td>
                      <td style={{ padding: '7px 10px', textAlign: 'center' }}>{row[5]}</td>
                      <td style={{ padding: '7px 10px', textAlign: 'right', fontWeight: 600, color: '#0066cc' }}>{row[6]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#003366', margin: '28px 0 12px' }}>สินค้าในหมวดสายคอนโทรล — ดูตารางรายละเอียดและสเปก</h3>
            <p>เลือกรุ่นสายคอนโทรลที่ต้องการ เพื่อดูตารางขนาด-สเปก และราคา:</p>
            <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
              <li><Link href="/product/ysly-jz" style={{ color: '#0066cc', fontWeight: 600 }}>YSLY-JZ</Link> — สายคอนโทรลยอดนิยม มีสายกราวนด์ (153 ขนาด)</li>
              <li><Link href="/product/opvc-jz" style={{ color: '#0066cc', fontWeight: 600 }}>OPVC-JZ</Link> — สเปกเหมือน YSLY-JZ 100% (153 ขนาด)</li>
              <li><Link href="/product/jz-500" style={{ color: '#0066cc', fontWeight: 600 }}>JZ-500</Link> — สเปกเหมือน YSLY-JZ 100% (153 ขนาด)</li>
              <li><Link href="/product/olflex-classic-110" style={{ color: '#0066cc', fontWeight: 600 }}>OLFLEX CLASSIC 110</Link> — สเปกเหมือน YSLY-JZ 100% (153 ขนาด)</li>
              <li><Link href="/product/flex-jz" style={{ color: '#0066cc', fontWeight: 600 }}>Flex-JZ</Link> — สเปกเหมือน YSLY-JZ 100% (153 ขนาด)</li>
              <li><Link href="/product/vct" style={{ color: '#0066cc', fontWeight: 600 }}>สายไฟ VCT</Link> — สายอ่อน ทนกระแส รับแรงดัน 450/750V</li>
              <li><Link href="/product/h05v-k" style={{ color: '#0066cc', fontWeight: 600 }}>H05V-K</Link> — สาย Wiring ตู้คอนโทรล 500V (0.5–1 mm²)</li>
              <li><Link href="/product/h07v-k" style={{ color: '#0066cc', fontWeight: 600 }}>H07V-K</Link> — สาย Wiring ตู้คอนโทรล 750V (1.5–240 mm²)</li>
            </ul>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#003366', margin: '28px 0 12px' }}>NYX CABLE จำหน่ายสายคอนโทรลงานอุตสาหกรรม ราคาปลีก-ส่ง พร้อมส่งด่วนใน 3 ชม. จากโกดังบางนา</h3>
            <p>สายไฟคอนโทรล (Control Cable) จาก NYX CABLE คือสายไฟอุตสาหกรรมคุณภาพสูงที่ออกแบบมาเพื่อตอบโจทย์งานควบคุมทุกประเภท ที่นี่เราจำหน่ายสายไฟคอนโทรล VSF (THW-F) ที่ใช้สำหรับเดินตู้คอนโทรลโดยเฉพาะ อีกทั้งยังจำหน่ายสายรุ่นยอดนิยมอย่าง YSLY-JZ / YSLY-OZ โดยทุกสายผ่านการผลิตตามมาตรฐานสากล จึงมั่นใจได้ในความปลอดภัย ความทนทาน และอายุการใช้งานที่ยาวนาน เหมาะสำหรับงานระบบเครื่องจักรอัตโนมัติ ตู้ควบคุมไฟฟ้า และโครงสร้างระบบไฟฟ้าในโรงงานอุตสาหกรรมโดยเฉพาะ</p>
            <p>NYX CABLE มีสต๊อกพร้อมส่ง ตั้งแต่ขนาด 0.5 mm² – 240 mm² พร้อมบริการให้คำปรึกษาโดยผู้เชี่ยวชาญด้านสายไฟฟ้า ช่วยให้คุณเลือกสเปกสายได้ตรงตามการใช้งานจริง ทั้งรุ่นและขนาด ทำให้ไม่ต้องเผื่อขนาดสายไฟให้ใหญ่เกินความจำเป็น ช่วยให้ลดต้นทุน และมีโอกาสปิดงานได้เพิ่มขึ้น ปลอดภัย และคุ้มค่าในระยะยาว สนใจสั่งซื้อสอบถามข้อมูลเพิ่มเติมได้ที่โทร <a href={`tel:+66${sitePhoneRaw}`} style={{ color: '#0066cc', fontWeight: 600 }}>{sitePhone}</a> หรือ LINE OA : <a href={`${siteLineUrl}?openQrModal=true`} target="_blank" rel="noopener noreferrer" style={{ color: '#06c755', fontWeight: 600 }}>{siteLineOA}</a></p>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#003366', margin: '28px 0 12px' }}>FAQs คำถามที่พบบ่อยเกี่ยวกับสายคอนโทรล</h3>
            <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
              <details style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 600, color: '#003366' }}>Q: สายคอนโทรลคืออะไร และแตกต่างจากสายไฟทั่วไปอย่างไร ?</summary>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>สายคอนโทรลออกแบบมาเพื่อส่งสัญญาณควบคุมและเชื่อมต่ออุปกรณ์ในระบบอัตโนมัติ โดยมีความยืดหยุ่นสูงและฉนวนทำจาก PVC ที่คุณภาพสูงกว่าทำให้มีฉนวนที่บางกว่าสายไฟทั่วไปที่มักออกแบบมาเพื่อส่งกำลังไฟฟ้า แต่ในขณะเดียวกันคุณสมบัติทางไฟฟ้ายังคงเหมือนเดิม</p>
              </details>
              <details style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 600, color: '#003366' }}>Q: สาย YSLY-JZ ใช้กับงานประเภทใดได้บ้าง ?</summary>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>เหมาะสำหรับงานคอนโทรลและพาวเวอร์ในโรงงานอุตสาหกรรม ระบบควบคุมอัตโนมัติ ตู้คอนโทรล เครื่องจักร มอเตอร์ 1 เฟส และ 3 เฟส ที่ต้องการความยืดหยุ่นในการเดินสาย และสามารถรับแรงดันได้สูงถึง 1,000V</p>
              </details>
              <details style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 600, color: '#003366' }}>Q: ความแตกต่างระหว่างสาย YSLY-JZ กับ YSLY-OZ คืออะไร ?</summary>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>รุ่น YSLY-JZ มีสายกราวนด์สีเขียว-เหลือง ในขณะที่รุ่น YSLY-OZ ไม่มีสายกราวด์ และพิมพ์กำกับด้วยหมายเลขทุกเส้น</p>
              </details>
              <details style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 600, color: '#003366' }}>Q: ทำไมสาย YSLY-JZ ถึงประหยัดพื้นที่ได้มากกว่าสายทั่วไป ?</summary>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>เพราะใช้ฉนวน PVC คุณภาพสูงกว่าสายไฟทั่วไปทำให้บางกว่าแต่คุณสมบัติทางไฟฟ้ายังเหมือนเดิม จึงลดพื้นที่หน้าตัดของสายได้ถึง 40-65% เหมาะสำหรับงานที่มีพื้นที่จำกัด</p>
              </details>
              <details style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 600, color: '#003366' }}>Q: สายคอนโทรล YSLY-JZ รองรับแรงดันไฟฟ้าได้เท่าไร ?</summary>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>รองรับแรงดันไฟฟ้าได้สูงถึง 500V หรือ 1000V สามารถใช้กับระบบไฟฟ้า 3 เฟส 380-420V ได้อย่างปลอดภัย</p>
              </details>
              <details style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 600, color: '#003366' }}>Q: ควรเลือกสายคอนโทรลอย่างไรให้เหมาะกับงาน ?</summary>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>พิจารณาจำนวนแกน ขนาดหน้าตัด ชนิดฉนวน การมีชีลด์กันสัญญาณรบกวน และมาตรฐานความปลอดภัยที่รองรับ เช่น IEC, CE หรือ VDE</p>
              </details>
              <details style={{ background: '#fff', padding: '14px 18px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 600, color: '#003366' }}>Q: สั่งซื้อสายคอนโทรลจาก NYX CABLE ได้อย่างไร ?</summary>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>สามารถสั่งซื้อได้โดยโทร {sitePhone} หรือติดต่อผ่าน LINE OA : {siteLineOA} ทีมผู้เชี่ยวชาญพร้อมให้คำปรึกษาและช่วยเลือกสเปคสายให้ตรงกับงาน มีสต๊อกพร้อมส่งด่วนใน 3 ชม. จากโกดังบางนา</p>
              </details>
            </div>
          </div>
        </section >
      )
      }

      {
        slug === 'shielded-cable' && (
          <section style={{ padding: '48px 0', background: '#f8fafc' }}>
            <div className="container" style={{ maxWidth: 800, lineHeight: 1.8, color: '#334155' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#003366', marginBottom: 16 }}>สายชีลด์ (Shielded Cable) คืออะไร? ครบทุกเรื่องที่ต้องรู้</h2>
              <p>สายชีลด์คือสายไฟที่มีตัวป้องกันสัญญาณรบกวนแม่เหล็กไฟฟ้า (EMI) และคลื่นวิทยุ (RFI) ครอบรอบตัวนำ ทำให้สัญญาณที่ส่งผ่านมีความถูกต้อง ไม่ถูกบิดเบือนจากสภาพแวดล้อมภายนอก จำเป็นอย่างยิ่งเมื่อเดินสายใกล้กับสาย Power, มอเตอร์ขนาดใหญ่ หรือ Inverter (VSD/VFD)</p>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#003366', margin: '28px 0 12px' }}>เปรียบเทียบประเภทชีลด์</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20, fontSize: '0.9rem' }}>
                <thead><tr style={{ background: '#003366', color: '#fff' }}><th style={{ padding: '10px 14px', textAlign: 'left' }}>ประเภท</th><th style={{ padding: '10px 14px', textAlign: 'left' }}>ป้องกัน</th><th style={{ padding: '10px 14px', textAlign: 'left' }}>จุดเด่น</th><th style={{ padding: '10px 14px', textAlign: 'left' }}>รุ่นแนะนำ</th></tr></thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: '10px 14px' }}><strong>Tinned Copper Braid</strong></td><td style={{ padding: '10px 14px' }}>ความถี่ต่ำ ✓</td><td style={{ padding: '10px 14px' }}>ทนแรงกระแทก ความครอบคลุมสูง</td><td style={{ padding: '10px 14px' }}><Link href="/product/liycy" style={{ color: '#0066cc' }}>LiYCY</Link></td></tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f1f5f9' }}><td style={{ padding: '10px 14px' }}><strong>Aluminum Foil</strong></td><td style={{ padding: '10px 14px' }}>ความถี่สูง ✓</td><td style={{ padding: '10px 14px' }}>น้ำหนักเบา มี Drain Wire</td><td style={{ padding: '10px 14px' }}>LiYCY(TP)</td></tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: '10px 14px' }}><strong>Double Shield (Foil+Braid)</strong></td><td style={{ padding: '10px 14px' }}>ทุกย่านความถี่ ✓✓</td><td style={{ padding: '10px 14px' }}>ป้องกันสูงสุดสำหรับงานวิกฤต</td><td style={{ padding: '10px 14px' }}><Link href="/product/double-shielded-cable" style={{ color: '#0066cc' }}>Double Shield</Link></td></tr>
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
                <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem' }}>ระบบ PLC — ป้องกัน EMI จาก VFD</div>
                <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem' }}>เครือข่ายเซ็นเซอร์ — สัญญาณ 4-20mA</div>
                <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem' }}>ระบบ Servo Drive — ป้องกัน Noise</div>
                <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem' }}>อุปกรณ์วัดคุม — ต้องการความแม่นยำสูง</div>
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
                  <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>รุ่นยอดนิยม ได้แก่ <Link href="/product/liycy" style={{ color: '#0066cc' }}>LiYCY</Link> (มาตรฐานยุโรป), <Link href="/product/olflex-classic-115-cy" style={{ color: '#0066cc' }}>Olflex Classic 115 CY</Link>, CVV-S (มาตรฐาน JIS), และ <Link href="/product/double-shielded-cable" style={{ color: '#0066cc' }}>Double Shielded Cable</Link> สำหรับงานที่ต้องการป้องกันสูงสุด</p>
                </details>
              </div>
            </div>
          </section>
        )
      }

      {
        slug === 'instrument-cable' && (
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
        )
      }

      {/* ─── Other Categories ─── */}
      {
        otherCatSlugs.length > 0 && (
          <section style={{ padding: '36px 0', background: '#fff' }}>
            <div className="container" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2 }}>หมวดหมู่อื่น</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                {otherCatSlugs.map((catSlug) => (
                  <a
                    key={catSlug}
                    href={`/category/${catSlug}`}
                    style={{ padding: '8px 18px', border: '1px solid #e2e8f0', borderRadius: 20, fontSize: '0.85rem', color: '#003366', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s' }}
                  >
                    {categoryProductsMap[catSlug]?.title || catSlug} ({categoryProductsMap[catSlug]?.products.length || 0})
                  </a>
                ))}
                <Link href="/products" style={{ padding: '8px 18px', border: '1px solid #0099ff', borderRadius: 20, fontSize: '0.85rem', color: '#0099ff', fontWeight: 600, textDecoration: 'none' }}>ดูทั้งหมด →</Link>
              </div>
            </div>
          </section>
        )
      }
    </>
  )
}
