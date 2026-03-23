import type { Metadata } from 'next'
import { getAboutPage } from '@/lib/queries'

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage()
  return {
    title: about?.metaTitle || 'เกี่ยวกับ NYX Cable | ผู้นำสายไฟอุตสาหกรรมมาตรฐานยุโรป',
    description: about?.metaDescription || 'NYX Cable ผู้นำด้านสายไฟอุตสาหกรรมมาตรฐาน DIN VDE จากยุโรป ประสบการณ์กว่า 10 ปี ส่งตรงจากโกดังบางนา',
  }
}

const styles = `
  /* ─── Corporate Hero ─── */
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
  .about-hero .hero-sub { font-size: 1.1rem; opacity: 0.8; max-width: 600px; margin: 0 auto 24px; position: relative; line-height: 1.8; }
  .about-hero .hero-badges { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; position: relative; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; border-radius: 50px;
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
    font-size: 0.82rem; font-weight: 500; color: rgba(255,255,255,0.9);
    backdrop-filter: blur(8px);
  }

  /* ─── Split Section ─── */
  .about-content { padding: 64px 0; }
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; margin-bottom: 80px; }
  .about-text h2 { font-size: 1.8rem; font-weight: 800; color: #1a1a2e; margin-bottom: 16px; line-height: 1.4; }
  .about-text h2 span { color: #f0a500; }
  .about-text p { color: #4b5563; line-height: 1.9; margin-bottom: 16px; font-size: 0.95rem; }
  .about-stats {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 24px;
    padding: 20px; background: #f8fafc; border-radius: 16px; border: 1px solid #e5e7eb;
  }
  .about-stat { text-align: center; }
  .about-stat .num { font-size: 1.8rem; font-weight: 800; color: #003366; line-height: 1; }
  .about-stat .label { font-size: 0.75rem; color: #6b7280; margin-top: 4px; }

  /* Image placeholder → premium styled box */
  .about-image-box {
    position: relative;
    background: linear-gradient(135deg, #f0f4f8, #e2e8f0);
    border-radius: 20px;
    min-height: 380px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 1px solid #e5e7eb;
  }
  .about-image-box::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cpath d='M100,200 Q200,50 300,200 Q200,350 100,200' fill='none' stroke='rgba(0,51,102,0.05)' stroke-width='2'/%3E%3Ccircle cx='200' cy='200' r='100' fill='none' stroke='rgba(0,51,102,0.04)' stroke-width='2'/%3E%3C/svg%3E") no-repeat center;
    background-size: cover;
  }
  .about-image-box .logo-display {
    font-size: 2rem; font-weight: 800; color: #003366; letter-spacing: 3px;
    position: relative; z-index: 1;
  }
  .about-image-box .tagline {
    font-size: 0.8rem; color: #6b7280; margin-top: 8px; position: relative; z-index: 1;
  }
  /* Floating experience badge */
  .exp-badge {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #003366, #0066cc);
    color: #fff;
    padding: 12px 20px;
    border-radius: 14px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0,51,102,0.25);
    z-index: 2;
  }
  .exp-badge .big { font-size: 1.6rem; font-weight: 800; line-height: 1; }
  .exp-badge .small { font-size: 0.7rem; opacity: 0.8; }

  /* ─── Certifications ─── */
  .cert-section { padding: 48px 0; background: #f8fafc; margin-bottom: 64px; }
  .cert-grid {
    display: flex; gap: 32px; justify-content: center; align-items: center; flex-wrap: wrap;
  }
  .cert-item {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    padding: 16px 24px; background: #fff; border-radius: 12px;
    border: 1px solid #e5e7eb; min-width: 100px;
    transition: all 0.3s;
  }
  .cert-item:hover { border-color: #0066cc; box-shadow: 0 4px 16px rgba(0,51,102,0.08); transform: translateY(-2px); }
  .cert-name { font-size: 1.1rem; font-weight: 800; color: #003366; }
  .cert-desc { font-size: 0.65rem; color: #9ca3af; text-align: center; }

  /* ─── Values Cards ─── */
  .section-title { text-align: center; margin-bottom: 40px; }
  .section-title h2 { font-size: 1.8rem; font-weight: 800; color: #1a1a2e; margin-bottom: 8px; }
  .section-title p { font-size: 0.95rem; color: #6b7280; }
  .section-title .accent-bar { width: 48px; height: 4px; background: linear-gradient(90deg, #f0a500, #fbbf24); border-radius: 4px; margin: 12px auto 0; }

  .values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 80px; }
  .value-card {
    text-align: center; padding: 32px 24px; border-radius: 16px;
    background: #fff; border: 1px solid #e5e7eb;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1); position: relative; overflow: hidden;
  }
  .value-card:hover { border-color: #0066cc; box-shadow: 0 8px 30px rgba(0,51,102,0.08); transform: translateY(-4px); }
  .value-icon-wrap {
    width: 56px; height: 56px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px; font-size: 1.5rem;
  }
  .value-icon-wrap.quality { background: linear-gradient(135deg, rgba(0,102,204,0.1), rgba(0,51,102,0.08)); }
  .value-icon-wrap.speed { background: linear-gradient(135deg, rgba(240,165,0,0.1), rgba(240,165,0,0.06)); }
  .value-icon-wrap.service { background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.06)); }
  .value-card h3 { font-size: 1.1rem; font-weight: 700; color: #1a1a2e; margin-bottom: 8px; }
  .value-card p { font-size: 0.85rem; color: #6b7280; line-height: 1.7; }

  /* ─── Timeline ─── */
  .timeline { position: relative; max-width: 700px; margin: 0 auto 64px; padding-left: 40px; }
  .timeline::before {
    content: '';
    position: absolute;
    left: 14px;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, #0066cc, #f0a500);
    border-radius: 3px;
  }
  .tl-item { position: relative; margin-bottom: 36px; }
  .tl-item::before {
    content: '';
    position: absolute;
    left: -33px;
    top: 4px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid #0066cc;
    z-index: 1;
  }
  .tl-item:last-child::before { border-color: #f0a500; }
  .tl-year {
    display: inline-block;
    padding: 3px 12px;
    background: linear-gradient(135deg, #003366, #0066cc);
    color: #fff;
    font-size: 0.8rem;
    font-weight: 700;
    border-radius: 50px;
    margin-bottom: 8px;
  }
  .tl-item:last-child .tl-year { background: linear-gradient(135deg, #d48900, #f0a500); }
  .tl-item h3 { font-size: 1rem; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }
  .tl-item p { font-size: 0.85rem; color: #6b7280; line-height: 1.7; }

  /* ─── CTA ─── */
  .about-cta {
    background: linear-gradient(135deg, #003366, #0066cc);
    color: #fff; padding: 56px 0; text-align: center;
    position: relative; overflow: hidden;
  }
  .about-cta::before {
    content: '';
    position: absolute;
    inset: 0;
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

  @media (max-width: 768px) {
    .about-hero h1 { font-size: 1.6rem; }
    .about-grid { grid-template-columns: 1fr; }
    .about-stats { grid-template-columns: repeat(3, 1fr); }
    .values-grid { grid-template-columns: 1fr; }
    .cert-grid { gap: 12px; }
    .cert-item { min-width: 80px; padding: 12px 16px; }
    .about-cta h2 { font-size: 1.3rem; }
    .about-cta-buttons { flex-direction: column; align-items: center; }
  }
`

export default function AboutPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* ─── Corporate Hero ─── */}
      <section className="about-hero">
        <div className="container">
          <h1>เกี่ยวกับ NYX Cable</h1>
          <p className="hero-sub">ผู้นำด้านสายไฟอุตสาหกรรมคุณภาพสูง มาตรฐานยุโรป ส่งมอบความเชื่อมั่นให้อุตสาหกรรมไทยมากว่า 10 ปี</p>
          <div className="hero-badges">
            <span className="hero-badge">🏭 โรงงานนำเข้าตรง</span>
            <span className="hero-badge">🇪🇺 มาตรฐาน DIN VDE</span>
            <span className="hero-badge">🚚 ส่งด่วน 2 ชม.</span>
          </div>
        </div>
      </section>

      <div className="container about-content">
        {/* ─── Split Layout ─── */}
        <div className="about-grid">
          <div className="about-text">
            <h2>เราคือผู้เชี่ยวชาญ<br /><span>สายไฟอุตสาหกรรม</span></h2>
            <p>NYX Cable เป็นผู้นำเข้าและจำหน่ายสายไฟอุตสาหกรรมคุณภาพสูง ผลิตด้วยเทคโนโลยีขั้นสูงจากยุโรป ผ่านมาตรฐาน DIN VDE ทุกรุ่น</p>
            <p>เรามุ่งมั่นส่งมอบสายไฟที่มีคุณภาพสูงสุดให้กับโรงงานอุตสาหกรรมในประเทศไทย พร้อมทีมวิศวกรที่พร้อมให้คำปรึกษาตลอดเวลา</p>
            <div className="about-stats">
              <div className="about-stat"><div className="num">10+</div><div className="label">ปีประสบการณ์</div></div>
              <div className="about-stat"><div className="num">150+</div><div className="label">รุ่นสินค้า</div></div>
              <div className="about-stat"><div className="num">50+</div><div className="label">องค์กรลูกค้า</div></div>
            </div>
          </div>
          <div className="about-image-box">
            <div className="logo-display">NYX CABLE</div>
            <div className="tagline">European Standard Industrial Cables</div>
            <div className="exp-badge">
              <div className="big">10+</div>
              <div className="small">Years Experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Certifications ─── */}
      <section className="cert-section">
        <div className="container">
          <div className="section-title">
            <h2>มาตรฐานที่เราปฏิบัติตาม</h2>
            <p>สายไฟ NYX Cable ผ่านการรับรองมาตรฐานสากลทุกรุ่น</p>
            <div className="accent-bar" />
          </div>
          <div className="cert-grid">
            <div className="cert-item"><div className="cert-name">DIN</div><div className="cert-desc">German Institute<br />for Standardization</div></div>
            <div className="cert-item"><div className="cert-name">VDE</div><div className="cert-desc">Electrical Engineering<br />Testing</div></div>
            <div className="cert-item"><div className="cert-name">CE</div><div className="cert-desc">European<br />Conformity</div></div>
            <div className="cert-item"><div className="cert-name">RoHS</div><div className="cert-desc">Restriction of<br />Hazardous Substances</div></div>
            <div className="cert-item"><div className="cert-name">ISO</div><div className="cert-desc">Quality Management<br />System</div></div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* ─── Values ─── */}
        <div className="section-title">
          <h2>ค่านิยมของเรา</h2>
          <p>สิ่งที่เราให้ความสำคัญในทุกย่างก้าว</p>
          <div className="accent-bar" />
        </div>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon-wrap quality">🛡️</div>
            <h3>คุณภาพ</h3>
            <p>คัดสรรเฉพาะสายไฟที่ผ่านมาตรฐาน DIN VDE ระดับสูงสุดจากยุโรป</p>
          </div>
          <div className="value-card">
            <div className="value-icon-wrap speed">⚡</div>
            <h3>รวดเร็ว</h3>
            <p>สต็อกพร้อมส่งทันที จากคลังบางนา ลดเวลาหยุดเครื่องจักรให้น้อยที่สุด</p>
          </div>
          <div className="value-card">
            <div className="value-icon-wrap service">🤝</div>
            <h3>บริการ</h3>
            <p>ทีมวิศวกรพร้อมให้คำปรึกษาทุกโปรเจกต์ ตลอดอายุการใช้งาน</p>
          </div>
        </div>

        {/* ─── Timeline ─── */}
        <div className="section-title">
          <h2>เส้นทางของเรา</h2>
          <p>จากจุดเริ่มต้นสู่ผู้นำสายไฟอุตสาหกรรม</p>
          <div className="accent-bar" />
        </div>
        <div className="timeline">
          <div className="tl-item">
            <span className="tl-year">2015</span>
            <h3>ก่อตั้ง NYX Cable</h3>
            <p>เริ่มต้นนำเข้าสายไฟอุตสาหกรรมจากยุโรป ด้วยความมุ่งมั่นที่จะยกระดับมาตรฐานสายไฟในไทย</p>
          </div>
          <div className="tl-item">
            <span className="tl-year">2018</span>
            <h3>ขยายไลน์ผลิตภัณฑ์</h3>
            <p>เพิ่มสาย VFD, สายทนความร้อน, สายเครน และสายชีลด์ เพื่อครอบคลุมทุกความต้องการ</p>
          </div>
          <div className="tl-item">
            <span className="tl-year">2021</span>
            <h3>คลังสินค้าใหม่</h3>
            <p>เปิดคลังสินค้าขนาดใหญ่ที่บางนา สต็อกพร้อมส่งกว่า 150 ขนาด ส่งด่วนได้ภายใน 2 ชั่วโมง</p>
          </div>
          <div className="tl-item">
            <span className="tl-year">2026</span>
            <h3>ก้าวสู่ดิจิทัล</h3>
            <p>เปิดตัวเว็บไซต์ใหม่พร้อมระบบ CMS ทันสมัย เพิ่มช่องทางให้ลูกค้าเข้าถึงข้อมูลสินค้าได้ง่ายขึ้น</p>
          </div>
        </div>
      </div>

    </>
  )
}
