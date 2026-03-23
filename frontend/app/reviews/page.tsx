import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'รีวิวจากลูกค้า | NYX Cable',
  description: 'ลูกค้ากว่า 50 องค์กรไว้วางใจสายไฟ NYX Cable คะแนนเฉลี่ย 4.8/5 ดาว',
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
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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
    position: absolute;
    top: 16px;
    right: 16px;
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
    .reviews-summary { flex-direction: column; gap: 32px; }
    .reviews-bars { max-width: 100%; width: 100%; }
    .reviews-grid { grid-template-columns: 1fr; }
    .reviews-cta h2 { font-size: 1.3rem; }
    .reviews-cta-buttons { flex-direction: column; align-items: center; }
  }
`

const reviews = [
  { name: 'คุณสมชาย', initial: 'ส', company: 'บริษัท ออโตเมชั่น ซิสเต็มส์ จำกัด', stars: 5, text: 'ใช้สาย YSLY-JZ กับตู้คอนโทรล ได้มาตรฐาน DIN VDE ตามที่ต้องการ สั่งง่าย ส่งไว สต็อกครบ', product: 'YSLY-JZ', slug: 'ysly-jz' },
  { name: 'คุณวิภา', initial: 'ว', company: 'หจก. เอ็นจิเนียริ่ง โปร', stars: 5, text: 'สั่งสาย LiYCY ชีลด์ป้องกัน EMI ได้ผลดีมาก สัญญาณไม่มี noise ทีมงานให้คำปรึกษาเลือกขนาดได้ดี', product: 'LiYCY', slug: 'liycy' },
  { name: 'คุณประเสริฐ', initial: 'ป', company: 'บริษัท ไทย อินดัสเทรียล จำกัด', stars: 5, text: 'ซื้อสายเครนติดตั้งในโรงงาน ทนทานมาก ใช้งานมา 2 ปีไม่มีปัญหา ราคาดีกว่านำเข้าเอง', product: 'Crane Cable', slug: 'nshtou' },
  { name: 'คุณอรุณ', initial: 'อ', company: 'บริษัท เพาเวอร์ เทค จำกัด', stars: 4, text: 'สั่งสาย VFD Servo Cable มาใช้กับเครื่อง CNC คุณภาพดี ตรงสเปค ส่งตรงเวลา แนะนำครับ', product: 'VFD Cable', slug: 'multiflex-y' },
  { name: 'คุณนภา', initial: 'น', company: 'บริษัท สมาร์ท แมนูแฟคเจอริ่ง จำกัด', stars: 5, text: 'ใช้สายทนความร้อน SiHF ในห้องเตาอบ ทนได้ 180 องศา ไม่มีปัญหาเลย คุณภาพยุโรปจริงๆ', product: 'SiHF', slug: 'sihf' },
  { name: 'คุณธนา', initial: 'ธ', company: 'หจก. ธนา อิเล็กทริค', stars: 5, text: 'ซื้อสายคอนโทรลหลายรุ่น ได้ราคาส่ง ทีมงานช่วยเลือกขนาดให้ถูกต้อง ประทับใจบริการมาก', product: 'Control Cable', slug: 'ysly-jz' },
]

const avatarColors = [
  'linear-gradient(135deg, #003366, #0066cc)',
  'linear-gradient(135deg, #059669, #34d399)',
  'linear-gradient(135deg, #7c3aed, #a78bfa)',
  'linear-gradient(135deg, #dc2626, #f87171)',
  'linear-gradient(135deg, #d97706, #fbbf24)',
  'linear-gradient(135deg, #0891b2, #22d3ee)',
]

function StarSVG({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill={filled ? '#f0a500' : '#e5e7eb'}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.28-3.957z" />
    </svg>
  )
}

export default function ReviewsPage() {
  const avgRating = (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(1)
  const starCounts = [5, 4, 3, 2, 1].map(s => reviews.filter(r => r.stars === s).length)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <section className="reviews-hero">
        <div className="container">
          <div className="trust-badge">★ คะแนนเฉลี่ย {avgRating}/5 จากผู้ใช้งานจริงกว่า 50+ องค์กร</div>
          <h1>รีวิวจากลูกค้า</h1>
          <p>ความคิดเห็นจากวิศวกรและช่างไฟฟ้าที่ไว้วางใจสายไฟ NYX Cable</p>
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
            <div className="count">{reviews.length} รีวิว</div>
          </div>
          <div className="reviews-bars">
            {[5, 4, 3, 2, 1].map((star, i) => (
              <div key={star} className="bar-row">
                <span className="bar-label">{star} ดาว</span>
                <div className="bar-track">
                  <div
                    className={`bar-fill bar-fill-${star}`}
                    style={{ width: `${reviews.length > 0 ? (starCounts[i] / reviews.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="bar-count">{starCounts[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="reviews-grid">
          {reviews.map((review, idx) => (
            <div key={idx} className="review-card">
              <div className="verified-badge">✓ ผู้ซื้อจริง</div>
              <div className="review-header">
                <div className="review-avatar" style={{ background: avatarColors[idx % avatarColors.length] }}>{review.initial}</div>
                <div>
                  <div className="review-name">{review.name}</div>
                  <div className="review-company">{review.company}</div>
                  <div className="review-card-stars">
                    {[1, 2, 3, 4, 5].map(i => (
                      <StarSVG key={i} filled={i <= review.stars} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="review-text">&ldquo;{review.text}&rdquo;</div>
              <a href={`/products/detail/${review.slug}`} className="review-product">
                สินค้าที่ใช้: {review.product}
              </a>
            </div>
          ))}
        </div>
      </div>


    </>
  )
}
