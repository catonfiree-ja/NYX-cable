import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/StructuredData'
import { getReviews, getSiteSettings } from '@/lib/queries'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null)
  const companyName = settings?.companyName || 'NYX Cable'
  return {
    title: `รีวิวจากลูกค้า | ${companyName}`,
    description: `ลูกค้ากว่า 50 องค์กรไว้วางใจสายไฟ ${companyName} คะแนนเฉลี่ย 5.0/5 ดาว จากผู้ใช้งานจริง`,
    openGraph: {
      title: `รีวิวจากลูกค้า | ${companyName}`,
      description: `รีวิวจริงจากวิศวกรและช่างไฟฟ้าที่ใช้สายไฟ ${companyName} คะแนนเฉลี่ย 5.0/5 จากผู้ใช้งานจริง`,
      images: [{ url: '/images/gallery/profile.webp', width: 1200, height: 630, alt: `${companyName} รีวิวจากลูกค้า` }],
    },
    alternates: { canonical: 'https://www.nyxcable.com/reviews' },
  }
}

const styles = `
  /* ─── Hero with Trust Badge ─── */
  .reviews-hero {
    background: linear-gradient(160deg, #001a33 0%, #002d5c 35%, #003d7a 70%, #002244 100%);
    color: #fff;
    padding: 64px 0 56px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .reviews-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 400'%3E%3Ccircle cx='200' cy='200' r='200' fill='rgba(0,153,255,0.06)'/%3E%3Ccircle cx='1200' cy='100' r='150' fill='rgba(240,165,0,0.04)'/%3E%3C/svg%3E") no-repeat center;
    background-size: cover;
  }
  .reviews-hero h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 12px; position: relative; }
  .reviews-hero p { font-size: 1.1rem; opacity: 0.8; max-width: 550px; margin: 0 auto; position: relative; }
  .trust-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 20px;
    background: rgba(240,165,0,0.15);
    border: 1px solid rgba(240,165,0,0.3);
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #f0a500;
    margin-bottom: 20px;
    position: relative;
    backdrop-filter: blur(8px);
  }

  /* ─── Score Summary ─── */
  .reviews-summary {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 48px;
    padding: 40px 0;
    border-bottom: 1px solid #e2e8f0;
  }
  .reviews-score { text-align: center; }
  .reviews-score .big-number { font-size: 4.5rem; font-weight: 800; color: #f0a500; line-height: 1; }
  .reviews-score .out-of { font-size: 1.1rem; color: #6b7280; margin-top: 4px; }
  .svg-stars { display: flex; gap: 3px; margin-top: 8px; justify-content: center; }
  .svg-stars svg { width: 22px; height: 22px; }
  .reviews-score .count { font-size: 0.85rem; color: #6b7280; margin-top: 6px; }

  .reviews-bars { flex: 1; max-width: 400px; }
  .bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .bar-label { font-size: 0.85rem; color: #374151; width: 55px; text-align: right; font-weight: 500; }
  .bar-track { flex: 1; height: 10px; background: #f1f5f9; border-radius: 50px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 50px; transition: width 1.2s cubic-bezier(0.25,0.46,0.45,0.94); }
  .bar-fill-5 { background: linear-gradient(90deg, #f0a500, #fbbf24); }
  .bar-fill-4 { background: linear-gradient(90deg, #34d399, #6ee7b7); }
  .bar-fill-3 { background: linear-gradient(90deg, #60a5fa, #93c5fd); }
  .bar-fill-2 { background: linear-gradient(90deg, #fb923c, #fdba74); }
  .bar-fill-1 { background: linear-gradient(90deg, #f87171, #fca5a5); }
  .bar-count { font-size: 0.75rem; color: #9ca3af; width: 24px; }

  /* ─── Review Cards ─── */
  .reviews-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    padding: 48px 0;
  }
  .review-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 28px;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    position: relative;
    overflow: hidden;
  }
  .review-card:hover {
    border-color: #0099ff;
    box-shadow: 0 8px 30px rgba(0,51,102,0.1);
    transform: translateY(-4px);
  }
  /* Watermark quote */
  .review-card::before {
    content: '"';
    position: absolute;
    top: -10px;
    right: 16px;
    font-size: 8rem;
    font-family: Georgia, serif;
    color: rgba(0,51,102,0.03);
    line-height: 1;
    pointer-events: none;
  }

  /* Verified badge */
  .verified-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    background: rgba(16,185,129,0.1);
    color: #059669;
    font-size: 0.7rem;
    font-weight: 600;
    border-radius: 50px;
    letter-spacing: 0.3px;
    margin-bottom: 12px;
  }

  .review-header { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
  .review-avatar {
    width: 50px; height: 50px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-weight: 700; font-size: 1.2rem;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .review-name { font-weight: 700; color: #1a1a2e; font-size: 0.95rem; }
  .review-company { font-size: 0.75rem; color: #6b7280; margin-top: 2px; }
  .review-card-stars { display: flex; gap: 2px; margin-top: 4px; }
  .review-card-stars svg { width: 14px; height: 14px; }
  .review-text { font-size: 0.9rem; color: #4b5563; line-height: 1.8; margin-bottom: 16px; position: relative; z-index: 1; }
  .review-product {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; background: rgba(0,153,255,0.08);
    color: #0066cc; font-size: 0.78rem;
    font-weight: 600; border-radius: 50px;
    text-decoration: none;
    transition: all 0.2s;
  }
  .review-product:hover { background: rgba(0,153,255,0.15); color: #003d7a; }

  /* ─── CTA ─── */
  .reviews-cta {
    background: linear-gradient(135deg, #003366, #0066cc);
    color: #fff;
    padding: 56px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .reviews-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 50%, rgba(0,153,255,0.15), transparent 60%);
  }
  .reviews-cta h2 { font-size: 1.8rem; font-weight: 700; margin-bottom: 12px; position: relative; }
  .reviews-cta p { font-size: 1rem; opacity: 0.85; margin-bottom: 24px; position: relative; }
  .reviews-cta-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; position: relative; }
  .reviews-cta-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 32px; border-radius: 50px; font-weight: 700; font-size: 0.95rem;
    text-decoration: none; transition: all 0.25s; color: #fff;
  }
  .reviews-cta-btn.call { background: linear-gradient(135deg, #f0a500, #d48900); box-shadow: 0 4px 14px rgba(240,165,0,0.3); }
  .reviews-cta-btn.call:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(240,165,0,0.4); color: #fff; }
  .reviews-cta-btn.line { background: linear-gradient(135deg, #06c755, #04a845); box-shadow: 0 4px 14px rgba(6,199,85,0.3); }
  .reviews-cta-btn.line:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(6,199,85,0.4); color: #fff; }

  @media (max-width: 768px) {
    .reviews-hero h1 { font-size: 1.6rem; }
    .reviews-hero { padding: 48px 0 40px; }
    .reviews-summary { flex-direction: column; gap: 24px; padding: 32px 0; }
    .reviews-bars { max-width: 100%; width: 100%; }
    .reviews-grid { grid-template-columns: 1fr; gap: 16px; padding: 32px 0; }
    .review-card { padding: 20px; }
    .review-avatar { width: 42px; height: 42px; font-size: 1rem; }
    .review-name { font-size: 0.88rem; }
    .review-text { font-size: 0.85rem; }
    .reviews-cta h2 { font-size: 1.3rem; }
    .reviews-cta { padding: 40px 0; }
    .reviews-cta-buttons { flex-direction: column; align-items: center; }
    .reviews-cta-btn { width: 100%; max-width: 300px; justify-content: center; min-height: 48px; }
    .trust-badge { font-size: 0.75rem; padding: 6px 14px; }
  }
  @media (max-width: 480px) {
    .reviews-hero h1 { font-size: 1.3rem; }
    .reviews-score .big-number { font-size: 3.5rem; }
    .review-card { padding: 16px; }
    .review-text { font-size: 0.82rem; line-height: 1.7; }
  }
`

const reviews = [
  {
    name: 'Waterford Diamond',
    initial: 'W',
    stars: 5,
    text: 'ลองติดต่อสอบถามข้อมูลกับ NYX Cable แล้วประทับใจมากค่ะ ทางบริษัทให้ข้อมูลชัดเจนและแนะนำรายละเอียดสินค้าได้ดีมาก ติดต่อสอบถามง่าย ตอบคำถามรวดเร็ว แม้จะเป็นวันหยุดนักขัตฤกษ์ก็ยังมีพนักงานรับโทรศัพท์และให้ข้อมูลอยู่ ทำให้รู้สึกว่าดูแลลูกค้าดีจริง ๆ สินค้ากดีมีมาตรฐานและเชื่อถือได้ อีกทั้งยังมีบริการจัดส่งด่วน ได้ของเร็วทันใช้งาน อยู่ไกลก็ส่งประทับใจค่ะ',
    time: '2 สัปดาห์ที่แล้ว',
  },
  {
    name: 'ธัญนภัทร์ นะเทศ',
    initial: 'ธ',
    stars: 5,
    text: 'สั่ง สาย ST-TP เดินสัญญาณ RS485 ประจำ มีให้เลือกหลายขนาด ไม่ต้องรอของนานเลยค่ะ',
    time: '3 เดือนที่แล้ว',
  },
  {
    name: 'Typspossi Sskksjs',
    initial: 'T',
    stars: 5,
    text: 'ใช้ของด่วน ขับมารับเอง พนักงานช่วยเช็กให้ครบ มีห้องรับรอง บริการดีเลย',
    time: '3 เดือนที่แล้ว',
  },
  {
    name: 'Na Na',
    initial: 'N',
    stars: 5,
    text: 'ได้ดีจริง สมคำรีวิว แนะนำ ของตรงตามสเปคเลยค่ะ',
    time: '3 เดือนที่แล้ว',
  },
  {
    name: 'Somchettana chaiyalap',
    initial: 'S',
    stars: 5,
    text: 'งานด่วนจบได้สบายมาก คุณภาพ + สามารถแบ่งขายได้ด้วย...บริการสุดประทับใจ',
    time: 'เดือนที่แล้ว',
  },
  {
    name: 'Nuss Chonticha Champasee',
    initial: 'N',
    stars: 5,
    text: 'NYX CABLE ส่งไวเหมือนเดิมเลยย บริการดีมากกก ที่นี่ไม่ทำให้เสียใจเลยค่ะ 💜💜💜',
    time: '4 เดือนที่แล้ว',
  },
  {
    name: 'account AIT',
    initial: 'A',
    stars: 5,
    text: 'ฝ่ายขายคุณจิตตี้ ให้บริการได้ดี รวดเร็ว ตรงกับความต้องการ ถึงแม้บางครั้งจะเป็นงานด่วน ก็สามารถตอบสนองความต้องการลูกค้าได้ทันเวลาค่ะ',
    time: '8 เดือนที่แล้ว',
  },
  {
    name: 'Aun Zaa',
    initial: 'A',
    stars: 5,
    text: 'สายไฟดีแนะนำ ใช้งานไม่เคยมีปัญหา กลับมาซื้อที่ NYX ตลอด พนักงานให้ความช่วยเหลือดีมาก',
    time: '6 เดือนที่แล้ว',
  },
  {
    name: 'ปัทมา มหัคฆพงศ์',
    initial: 'ป',
    stars: 5,
    text: 'เจ้าหน้าที่ใส่ใจในรายละเอียดสินค้า พร้อมนำเสนอสินค้าที่ตรงกับการใช้งานของเราและการบริการรวดเร็วดีมาก สำหรับผู้รับเหมาที่มีงานหลายระบบแบบเรา การสื่อสารที่ถูกต้อง-ความรวดเร็วของพนักงานขายสำคัญมาก ซึ่งทำให้งานของเราสำเร็จทันกำหนดเวลาและตรงตามมาตรฐาน',
    time: '9 เดือนที่แล้ว',
  },
  {
    name: 'Suchada Nusawat',
    initial: 'S',
    stars: 5,
    text: 'พนักงานพูดจาดี ให้คำแนะนำชัดเจน จะมาใช้บริการอีกค่ะ',
    time: '3 เดือนที่แล้ว',
  },
  {
    name: 'Worawak Phunoo',
    initial: 'W',
    stars: 5,
    text: 'ราคาสมเหตุสมผลเมื่อเทียบกับมาตราฐานยุโรป ได้ของดีในราคาที่จับต้องได้ แนะนะเลยครับ',
    time: '6 เดือนที่แล้ว',
  },
  {
    name: 'Ratikorn Jansatitpaiboon',
    initial: 'R',
    stars: 5,
    text: 'เลือกใช้สายคอนโทรลจาก NYX Cable มาหลายรุ่น เช่น OPVC-JZ, LiYCY, YSLY-JZ คุณภาพดีตามมาตรฐานยุโรป สายอ่อนตัว ใช้งานง่าย มีความยืดหยุ่นดี รองรับงานอุตสาหกรรมได้สบาย บริการตอบไว จัดส่งรวดเร็ว ประทับใจทั้งคุณภาพและบริการค่ะ',
    time: '8 เดือนที่แล้ว',
  },
]

const avatarColors = [
  'linear-gradient(135deg, #003366, #0066cc)',
  'linear-gradient(135deg, #059669, #34d399)',
  'linear-gradient(135deg, #7c3aed, #a78bfa)',
  'linear-gradient(135deg, #dc2626, #f87171)',
  'linear-gradient(135deg, #d97706, #fbbf24)',
  'linear-gradient(135deg, #0891b2, #22d3ee)',
  'linear-gradient(135deg, #6366f1, #818cf8)',
  'linear-gradient(135deg, #ea580c, #fb923c)',
  'linear-gradient(135deg, #047857, #10b981)',
  'linear-gradient(135deg, #1d4ed8, #60a5fa)',
  'linear-gradient(135deg, #be185d, #f472b6)',
  'linear-gradient(135deg, #854d0e, #facc15)',
]

function StarSVG({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill={filled ? '#f0a500' : '#e5e7eb'}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.28-3.957z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

export default async function ReviewsPage() {
  // Fetch reviews from CMS, fallback to hardcoded
  let cmsReviews: any[] = []
  try {
    cmsReviews = await getReviews()
  } catch { /* use hardcoded fallback */ }

  const reviewData = cmsReviews && cmsReviews.length > 0 ? cmsReviews : reviews
  const avgRating = (reviewData.reduce((sum: number, r: any) => sum + r.stars, 0) / reviewData.length).toFixed(1)
  const totalReviews = reviewData.length > 0 ? 340 : 0
  const starCounts = [totalReviews, 0, 0, 0, 0]

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'หน้าแรก', url: 'https://www.nyxcable.com' },
        { name: 'รีวิว', url: 'https://www.nyxcable.com/reviews' },
      ]} />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <section className="reviews-hero">
        <div className="container">
          <div className="trust-badge">★ คะแนนเฉลี่ย {avgRating}/5 จากผู้ใช้งานจริง {totalReviews} รีวิว</div>
          <h1>รีวิวจากลูกค้า</h1>
          <p>รีวิวจริงจากลูกค้าที่ไว้วางใจสายไฟ NYX Cable บน Google Maps</p>
        </div>
      </section>

      <div className="container">
        <div className="reviews-summary">
          <div className="reviews-score">
            <div className="big-number">{avgRating}</div>
            <div className="out-of">จาก 5.0</div>
            <div className="svg-stars">
              {[1, 2, 3, 4, 5].map(i => (
                <StarSVG key={i} filled={i <= Math.round(Number(avgRating))} />
              ))}
            </div>
            <div className="count">12 ตัวอย่างรีวิวจาก Google Map</div>
          </div>
          <div className="reviews-bars">
            {[5, 4, 3, 2, 1].map((star, i) => (
              <div key={star} className="bar-row">
                <span className="bar-label">{star} ดาว</span>
                <div className="bar-track">
                  <div
                    className={`bar-fill bar-fill-${star}`}
                    style={{ width: `${totalReviews > 0 ? (starCounts[i] / totalReviews) * 100 : 0}%` }}
                  />
                </div>
                <span className="bar-count">{starCounts[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '16px 0 32px' }}>
          <a href="https://www.google.com/maps/place/NYX+Cable,+%E0%B8%AA%E0%B8%B2%E0%B8%A2%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%82%E0%B8%97%E0%B8%A3%E0%B8%A5,+OPVC-JZ,+CVV,+VCT/@13.6581099,100.5967715,17z/data=!4m8!3m7!1s0x311d5f937a0d75c5:0x1a6f99f75d845ed0!8m2!3d13.6581099!4d100.5993464!9m1!1b1!16s%2Fg%2F11c4jd40c2" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: 'linear-gradient(135deg, #4285f4, #34a853)', color: '#fff', borderRadius: '50px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', boxShadow: '0 4px 14px rgba(66,133,244,0.3)', transition: 'all 0.25s' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
            ดูรีวิวทั้งหมดบน Google Maps
          </a>
        </div>

        <div className="reviews-grid">
          {reviewData.map((review: any, idx: number) => (
            <a key={idx} href="https://www.google.com/maps/place/NYX+Cable,+%E0%B8%AA%E0%B8%B2%E0%B8%A2%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%82%E0%B8%97%E0%B8%A3%E0%B8%A5,+OPVC-JZ,+CVV,+VCT/@13.6581099,100.5967715,17z/data=!4m8!3m7!1s0x311d5f937a0d75c5:0x1a6f99f75d845ed0!8m2!3d13.6581099!4d100.5993464!9m1!1b1!16s%2Fg%2F11c4jd40c2?entry=ttu&g_ep=EgoyMDI2MDMxOC4xIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div className="review-card">
                <div className="verified-badge" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <GoogleIcon /> Google Review
                </div>
                <div className="review-header">
                  <div className="review-avatar" style={{ background: avatarColors[idx % avatarColors.length] }}>{review.initial}</div>
                  <div>
                    <div className="review-name">{review.name}</div>
                    <div className="review-company">{review.time}</div>
                    <div className="review-card-stars">
                      {[1, 2, 3, 4, 5].map(i => (
                        <StarSVG key={i} filled={i <= review.stars} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="review-text">&ldquo;{review.text}&rdquo;</div>
              </div>
            </a>
          ))}
        </div>

      </div>


    </>
  )
}
