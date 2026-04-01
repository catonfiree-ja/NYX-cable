import type { Metadata } from 'next'
import { getAboutPage } from '@/lib/queries'
import Image from 'next/image'
import Link from 'next/link'
import { BreadcrumbSchema } from '@/components/StructuredData'

// Helper: safely extract string from CMS value (handles Portable Text blocks)
function safeStr(val: any, fallback: string = ''): string {
  if (!val) return fallback
  if (typeof val === 'string') return val
  if (Array.isArray(val)) return val.map((b: any) => b?.children?.map((c: any) => c?.text).join('')).join('\n') || fallback
  if (typeof val === 'object' && val?.text) return val.text
  return fallback
}

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage()
  return {
    title: about?.metaTitle || 'เกี่ยวกับ NYX Cable | ผู้เชี่ยวชาญสายไฟอุตสาหกรรม 20 ปี',
    description: about?.metaDescription || 'บริษัท นิกซ์ เคเบิ้ล จำกัด ผู้เชี่ยวชาญสายไฟคอนโทรลและสายไฟฟ้าพิเศษ ประสบการณ์ 20 ปี ลูกค้ากว่า 5,000 บริษัท สินค้า 15,000 SKU',
    alternates: { canonical: 'https://www.nyxcable.com/about' },
  }
}

const styles = `
  /* ─── About Hero ─── */
  .about-hero {
    position: relative;
    background: linear-gradient(160deg, #001a33 0%, #002d5c 35%, #003d7a 70%, #002244 100%);
    color: #fff;
    padding: 72px 0 64px;
    text-align: center;
    overflow: hidden;
  }
  .about-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 400'%3E%3Ccircle cx='250' cy='200' r='250' fill='rgba(0,153,255,0.06)'/%3E%3Ccircle cx='1100' cy='150' r='200' fill='rgba(240,165,0,0.04)'/%3E%3Ccircle cx='700' cy='350' r='180' fill='rgba(0,153,255,0.03)'/%3E%3C/svg%3E") no-repeat center;
    background-size: cover;
  }
  .about-hero h1 { font-size: 2.8rem; font-weight: 800; margin-bottom: 12px; position: relative; }
  .about-hero .hero-sub { font-size: 1.1rem; opacity: 0.8; max-width: 700px; margin: 0 auto 24px; position: relative; line-height: 1.8; }
  .about-hero .hero-badges { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; position: relative; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; border-radius: 50px;
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
    font-size: 0.82rem; font-weight: 500; color: rgba(255,255,255,0.9);
    backdrop-filter: blur(8px);
  }

  /* ─── Split Content + Video ─── */
  .about-content { padding: 64px 0; }
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; margin-bottom: 64px; }
  .about-text h2 { font-size: 1.8rem; font-weight: 800; color: #1a1a2e; margin-bottom: 16px; line-height: 1.4; }
  .about-text h2 span { color: #f0a500; }
  .about-text p { color: #4b5563; line-height: 1.9; margin-bottom: 16px; font-size: 0.95rem; }
  .about-stats {
    display: grid; grid-template-columns: 1fr; gap: 16px; margin-top: 24px;
    padding: 20px; background: #f8fafc; border-radius: 16px; border: 1px solid #e5e7eb;
  }
  .about-stat { text-align: center; }
  .about-stat .num { font-size: 1.8rem; font-weight: 800; color: #003366; line-height: 1; }
  .about-stat .label { font-size: 0.75rem; color: #6b7280; margin-top: 4px; }

  .about-video-box {
    position: relative; border-radius: 20px; overflow: hidden;
    border: 1px solid #e5e7eb; box-shadow: 0 8px 30px rgba(0,51,102,0.1);
    aspect-ratio: 16 / 9;
  }
  .about-video-box iframe {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    border: 0; border-radius: 20px;
  }

  /* ─── Section Title ─── */
  .section-title { text-align: center; margin-bottom: 40px; }
  .section-title h2 { font-size: 1.8rem; font-weight: 800; color: #1a1a2e; margin-bottom: 8px; }
  .section-title p { font-size: 0.95rem; color: #6b7280; }
  .section-title .accent-bar { width: 48px; height: 4px; background: linear-gradient(90deg, #f0a500, #fbbf24); border-radius: 4px; margin: 12px auto 0; }

  /* ─── Vision / About / Stats Boxes ─── */
  .info-boxes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 64px; }
  .info-box {
    padding: 32px 24px; border-radius: 16px;
    background: #fff; border: 1px solid #e5e7eb;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    position: relative; overflow: hidden;
  }
  .info-box:hover { border-color: #0066cc; box-shadow: 0 8px 30px rgba(0,51,102,0.08); transform: translateY(-4px); }
  .info-box .box-icon {
    width: 56px; height: 56px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px; font-size: 1.5rem;
  }
  .info-box .box-icon.vision { background: linear-gradient(135deg, rgba(0,102,204,0.1), rgba(0,51,102,0.08)); }
  .info-box .box-icon.about { background: linear-gradient(135deg, rgba(240,165,0,0.1), rgba(240,165,0,0.06)); }
  .info-box .box-icon.stats { background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.06)); }
  .info-box h3 { font-size: 1.15rem; font-weight: 700; color: #1a1a2e; margin-bottom: 10px; }
  .info-box p { font-size: 0.88rem; color: #6b7280; line-height: 1.8; }
  .info-box.about-detail p { font-size: 0.82rem; line-height: 1.9; }
  .info-box .stat-row { display: flex; gap: 20px; margin-top: 16px; flex-wrap: wrap; }
  .info-box .stat-item { text-align: center; flex: 1; min-width: 80px; }
  .info-box .stat-item .big { font-size: 2rem; font-weight: 800; color: #003366; line-height: 1; }
  .info-box .stat-item .txt { font-size: 0.7rem; color: #9ca3af; margin-top: 4px; }



  /* ─── Atmosphere Gallery ─── */
  .atmosphere-section { padding: 0; }
  .atmosphere-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 0;
  }
  .atmosphere-photo {
    overflow: hidden; aspect-ratio: 4/3;
  }
  .atmosphere-photo img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
  .atmosphere-photo:hover img { transform: scale(1.05); }

  /* ─── CTA ─── */
  .about-cta {
    background: linear-gradient(135deg, #003366, #0066cc);
    color: #fff; padding: 56px 0; text-align: center;
    position: relative; overflow: hidden;
  }
  .about-cta::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(circle at 30% 50%, rgba(0,153,255,0.15), transparent 60%);
  }
  .about-cta h2 { font-size: 1.8rem; font-weight: 700; margin-bottom: 12px; position: relative; }
  .about-cta p { font-size: 1rem; opacity: 0.85; margin-bottom: 24px; position: relative; max-width: 500px; margin-left: auto; margin-right: auto; }
  .about-cta-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; position: relative; }
  .about-cta-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 32px; border-radius: 50px; font-weight: 700; font-size: 0.95rem;
    text-decoration: none; transition: all 0.25s; color: #fff;
  }
  .about-cta-btn.products { background: linear-gradient(135deg, #f0a500, #d48900); box-shadow: 0 4px 14px rgba(240,165,0,0.3); }
  .about-cta-btn.products:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(240,165,0,0.4); color: #fff; }
  .about-cta-btn.contact { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); }
  .about-cta-btn.contact:hover { background: rgba(255,255,255,0.25); color: #fff; }

  /* ─── Responsive ─── */
  @media (max-width: 768px) {
    .about-hero { padding: 40px 0 32px; }
    .about-hero h1 { font-size: 1.6rem; }
    .about-hero .hero-sub { font-size: 0.9rem; padding: 0 8px; }
    .about-content { padding: 32px 8px; }
    .about-grid { grid-template-columns: 1fr; gap: 24px; margin-bottom: 40px; }
    .about-text h2 { font-size: 1.3rem; }
    .about-text p { font-size: 0.88rem; }
    .about-stats { grid-template-columns: 1fr; gap: 8px; padding: 16px; }
    .about-stat .num { font-size: 1.4rem; }
    .about-stat .label { font-size: 0.68rem; }
    .about-video-box { border-radius: 14px; }
    .about-video-box iframe { border-radius: 14px; }
    .info-boxes { grid-template-columns: 1fr; gap: 14px; }
    .info-box { padding: 20px 16px; }
    .section-title h2 { font-size: 1.3rem; }

    .atmosphere-grid { grid-template-columns: repeat(2, 1fr); gap: 0; }
    .about-cta { padding: 36px 0; }
    .about-cta h2 { font-size: 1.3rem; }
    .about-cta-buttons { flex-direction: column; align-items: center; }
  }
  @media (max-width: 480px) {
    .about-hero h1 { font-size: 1.3rem; }
    .hero-badge { font-size: 0.72rem; padding: 6px 12px; }

    .about-stat .num { font-size: 1.2rem; }
  }
`



export default async function AboutPage() {
  const aboutCms = await getAboutPage()
  const heroHeading = aboutCms?.heroHeading || 'เกี่ยวกับ NYX Cable'
  const heroSub = aboutCms?.heroSubheading || 'ผู้นำด้านสายไฟอุตสาหกรรมมาตรฐานยุโรป ลูกค้ากว่า 99% กลับมาซื้อซ้ำ'
  const heroBadges = aboutCms?.heroBadges?.length > 0
    ? aboutCms.heroBadges.map((b: any) => typeof b === 'string' ? b : (b?.text || ''))
    : ['📋 ประสบการณ์กว่า 20 ปี', '🏭 ลูกค้ากว่า 5,000 บริษัท', '📦 สินค้ากว่า 15,000 SKU']

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'หน้าแรก', url: 'https://www.nyxcable.com' },
        { name: 'เกี่ยวกับเรา', url: 'https://www.nyxcable.com/about' },
      ]} />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* ─── Hero ─── */}
      <section className="about-hero">
        <div className="container">
          <h1>{heroHeading}</h1>
          <p className="hero-sub">{heroSub}</p>
          <div className="hero-badges">
            {heroBadges.map((badge: string, i: number) => (
              <span key={i} className="hero-badge">{badge}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Main Content: Text + VDO ─── */}
      <div className="container about-content">
        <div className="about-grid">
          <div className="about-text">
            <h2>{aboutCms?.storyHeading || <>NYX CABLE<br /><span>ผู้เชี่ยวชาญสายไฟอุตสาหกรรม</span></>}</h2>
            <p>
              {safeStr(aboutCms?.storyContent, `NYX CABLE คือผู้จัดจำหน่ายและผู้เชี่ยวชาญด้านผลิตภัณฑ์สายไฟคุณภาพสูง
              ที่มุ่งมั่นส่งมอบโซลูชันด้านระบบไฟฟ้าที่ปลอดภัย ทนทาน และได้มาตรฐานระดับสากล
              เพื่อตอบสนองความต้องการของลูกค้าในทุกกลุ่มอุตสาหกรรม ไม่ว่าจะเป็นโครงการระดับเมกะโปรเจกต์
              โรงงานอุตสาหกรรม ตลอดจนกลุ่มธุรกิจรับเหมาก่อสร้างชั้นนำ`)}
            </p>
            <div className="about-stats" style={{ textAlign: 'center' }}>
              <div className="about-stat" style={{ width: '100%' }}>
                <div className="label" style={{ fontSize: '1rem', marginBottom: 8 }}>{aboutCms?.stats?.[0]?.label || 'เราขายสายไปแล้วกว่า'}</div>
                <div className="num" style={{ fontSize: '2.5rem', color: '#fbb03b' }}>{aboutCms?.stats?.[0]?.number || '20,000,000 เมตร+'}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 20, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                {/* IEC */}
                <div style={{ textAlign: 'center', width: 110 }}>
                  <div style={{ width: 72, height: 72, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image src="/images/certifications/iec-logo.png" alt="IEC มาตรฐานสากล" width={58} height={58} style={{ objectFit: 'contain' }} />
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 500, whiteSpace: 'nowrap' }}>มาตรฐานสากล</span>
                </div>
                {/* VDE */}
                <div style={{ textAlign: 'center', width: 110 }}>
                  <div style={{ width: 72, height: 72, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image src="/images/certifications/vde-logo.png" alt="VDE มาตรฐานเยอรมนี" width={72} height={72} style={{ objectFit: 'contain', background: '#fff', borderRadius: 8 }} />
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 500, whiteSpace: 'nowrap' }}>มาตรฐานเยอรมนี</span>
                </div>
                {/* TISI มอก. */}
                <div style={{ textAlign: 'center', width: 110 }}>
                  <div style={{ width: 72, height: 72, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image src="/images/certifications/tisi-logo.png" alt="มอก. มาตรฐาน มอก." width={64} height={64} style={{ objectFit: 'contain' }} />
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 500, whiteSpace: 'nowrap' }}>มาตรฐาน มอก.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="about-video-box">
            <a href="https://www.youtube.com/watch?v=IEu9jZBH3qQ" target="_blank" rel="noopener noreferrer" style={{ display: 'block', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <Image
                src="https://i.ytimg.com/vi/IEu9jZBH3qQ/hqdefault.jpg"
                alt="NYX Cable - สายไฟอุตสาหกรรมคุณภาพสูง"
                loading="lazy"
                width={800}
                height={450}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 68, height: 48, background: 'rgba(255,0,0,0.85)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" fill="#fff" width="28" height="28"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* ─── 3 Info Boxes: Vision / About Us / Stats ─── */}
      <div className="container" style={{ paddingBottom: 64 }}>
        <div className="info-boxes">
          {/* Box 1: Vision */}
          <div className="info-box">
            <div className="box-icon vision">🎯</div>
            <h3>{aboutCms?.visionHeading || 'วิสัยทัศน์องค์กร (Our Vision)'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {(aboutCms?.whyNyxItems?.length > 0 ? aboutCms.whyNyxItems : [
                { icon: '🚀', title: 'นวัตกรรม & ความเร็ว', description: 'จัดส่งเร็วกว่า บริการ Same/Next Day Delivery และประยุกต์ใช้ AI ในการจัดการสต๊อกอย่างแม่นยำ' },
                { icon: '🤝', title: 'เป็นพันธมิตรเชิงกลยุทธ์', description: "ที่กลุ่มอุตสาหกรรมไว้วางใจสูงสุด ด้วยการส่งมอบสายไฟฟ้าที่ 'ใช่ที่สุด' เพื่อลดต้นทุนและยกระดับประสิทธิภาพอย่างยั่งยืน" },
                { icon: '⚡', title: 'ตัวจริงด้านสายไฟคอนโทรล', description: 'เติบโตเคียงข้างลูกค้า ด้วยกระบวนการทำงานที่เป็นเลิศ และทีมงานที่มุ่งมั่นสู่ความสำเร็จอย่างแท้จริง' },
              ]).map((item: any, i: number) => (
                <div key={i}>
                  <h4 style={{ color: '#003366', fontWeight: 700, marginBottom: 6 }}>{item.icon} {item.title}</h4>
                  <p style={{ margin: 0 }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Box 2: About Us */}
          <div className="info-box about-detail">
            <div className="box-icon about">🏢</div>
            <h3>เกี่ยวกับเรา</h3>
            <p>
              {safeStr(aboutCms?.storyContent, `บริษัท นิกซ์ เคเบิ้ล จำกัด เราเป็นผู้เชี่ยวชาญและนำเข้า สายไฟคอนโทรล
              และสายไฟฟ้าชนิดพิเศษแบบต่างๆสำหรับโรงงานอุตสาหกรรมโดยเฉพาะ
              มีประสบการณ์มากกว่า 20 ปี ในการบริการให้คำปรึกษา แนะนำ แก้ไขปัญหา
              เปรียบเทียบ และ จัดส่งสินค้า ทางด้านสายไฟฟ้าสำหรับโรงงาน
              โดยมีบริษัทชั้นนำเชื่อใจสินค้าและผลิตภัณฑ์ของเรามากกว่า 5,000 บริษัท
              เรามีสายไฟสำหรับโรงงานอุตสาหกรรมให้เลือกหลากหลายมากกว่า 15,000 SKU
              ทำให้ตอบสนองทุกความต้องการ มีการจัดส่งได้ยืดหยุ่น ตามความต้องการของลูกค้า
              ทั้งแบบธรรมดาและด่วนพิเศษ โดยสายคอนโทรลทุกรุ่นนั้นมีเทคโนโลยีการผลิตชั้นสูงจากยุโรป
              และควบคุมการผลิตด้วยระบบคอมพิวเตอร์ที่ทันสมัย ตามมาตราฐาน VDE และ IEC
              ทำให้ได้สายไฟฟ้าที่มีคุณภาพ สร้างความพึงพอใจและ มีลูกค้ากลับมาซื้อซ้ำกว่า 99%`)}
            </p>
          </div>

          {/* Box 3: Quality & Standards */}
          <div className="info-box">
            <div className="box-icon stats">⚡</div>
            <h3>มาตรฐานและคุณภาพ</h3>
            <p>
              สายคอนโทรลทุกรุ่นนั้นใช้เทคโนโลยีการผลิตชั้นสูงจากยุโรป
              และควบคุมการผลิตด้วยระบบคอมพิวเตอร์ที่ทันสมัย ตามมาตรฐาน VDE และ IEC
              ทำให้ได้สายไฟฟ้าที่มีคุณภาพ สร้างความพึงพอใจให้ลูกค้า
            </p>
            <div className="stat-row">
              {(aboutCms?.stats?.length > 1 ? aboutCms.stats.slice(1) : [
                { number: '99%', label: 'ลูกค้ากลับมาซื้อซ้ำ' },
                { number: 'VDE', label: 'มาตรฐานยุโรป' },
                { number: 'IEC', label: 'มาตรฐานสากล' },
              ]).map((stat: any, i: number) => (
                <div key={i} className="stat-item"><div className="big">{stat.number}</div><div className="txt">{stat.label}</div></div>
              ))}
            </div>
          </div>
        </div>
      </div>



      {/* ─── บรรยากาศของเรา (Full-frame Gallery) ─── */}
      <section className="atmosphere-section">
        <div className="atmosphere-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
            <div key={n} className="atmosphere-photo">
              <Image
                src={`/delivery-2026/delivery-2026-${String(n).padStart(2, '0')}.jpg`}
                alt={`บรรยากาศ NYX Cable #${n}`}
                width={400}
                height={300}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="about-cta">
        <div className="container">
          <h2>พร้อมให้บริการคุณ</h2>
          <p>ติดต่อเราวันนี้ เพื่อรับคำปรึกษาจากผู้เชี่ยวชาญ</p>
          <div className="about-cta-buttons">
            <Link href="/products" className="about-cta-btn products">ดูผลิตภัณฑ์ →</Link>
            <Link href="/contact" className="about-cta-btn contact">ติดต่อเรา</Link>
          </div>
        </div>
      </section>
    </>
  )
}
