const styles = `
  .reviews-hero {
    background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
    color: var(--color-white);
    padding: var(--spacing-3xl) 0;
    text-align: center;
  }
  .reviews-hero h1 { font-size: var(--font-size-3xl); font-weight: 700; margin-bottom: var(--spacing-sm); }
  .reviews-hero p { font-size: var(--font-size-lg); opacity: 0.85; max-width: 600px; margin: 0 auto; }

  .reviews-summary {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-3xl);
    padding: var(--spacing-2xl) 0;
    border-bottom: 1px solid var(--color-gray-200);
  }
  .reviews-score { text-align: center; }
  .reviews-score .big-number { font-size: 4rem; font-weight: 800; color: var(--color-accent); line-height: 1; }
  .reviews-score .out-of { font-size: var(--font-size-lg); color: var(--color-gray-500); }
  .reviews-score .stars { font-size: var(--font-size-2xl); margin-top: var(--spacing-xs); }
  .reviews-score .count { font-size: var(--font-size-sm); color: var(--color-gray-500); margin-top: var(--spacing-xs); }

  .reviews-bars { flex: 1; max-width: 400px; }
  .bar-row { display: flex; align-items: center; gap: var(--spacing-sm); margin-bottom: 6px; }
  .bar-label { font-size: var(--font-size-sm); color: var(--color-gray-600); width: 50px; text-align: right; }
  .bar-track { flex: 1; height: 8px; background: var(--color-gray-200); border-radius: var(--radius-full); overflow: hidden; }
  .bar-fill { height: 100%; background: var(--color-accent); border-radius: var(--radius-full); }
  .bar-count { font-size: var(--font-size-xs); color: var(--color-gray-400); width: 20px; }

  .reviews-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: var(--spacing-xl);
    padding: var(--spacing-3xl) 0;
  }

  .review-card {
    background: var(--color-white);
    border: 1px solid var(--color-gray-200);
    border-radius: var(--radius-xl);
    padding: var(--spacing-xl);
    transition: all var(--transition-normal);
  }
  .review-card:hover {
    border-color: var(--color-secondary);
    box-shadow: var(--shadow-lg);
  }
  .review-header { display: flex; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-md); }
  .review-avatar {
    width: 48px; height: 48px;
    border-radius: var(--radius-full);
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    display: flex; align-items: center; justify-content: center;
    color: var(--color-white); font-weight: 700; font-size: var(--font-size-lg);
    flex-shrink: 0;
  }
  .review-name { font-weight: 600; color: var(--color-primary); font-size: var(--font-size-base); }
  .review-company { font-size: var(--font-size-xs); color: var(--color-gray-500); }
  .review-stars { color: var(--color-accent); font-size: var(--font-size-sm); margin-top: 2px; }
  .review-text { font-size: var(--font-size-sm); color: var(--color-gray-600); line-height: 1.8; margin-bottom: var(--spacing-md); }
  .review-product {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px; background: rgba(0,153,255,0.08);
    color: var(--color-secondary); font-size: var(--font-size-xs);
    font-weight: 500; border-radius: var(--radius-full);
    text-decoration: none;
  }
  .review-product:hover { background: rgba(0,153,255,0.15); }

  @media (max-width: 768px) {
    .reviews-summary { flex-direction: column; gap: var(--spacing-xl); }
    .reviews-bars { max-width: 100%; width: 100%; }
    .reviews-grid { grid-template-columns: 1fr; }
  }
`

// Static review data — can be moved to Sanity later
const reviews = [
  { name: 'คุณสมชาย', initial: 'ส', company: 'บริษัท ออโตเมชั่น ซิสเต็มส์ จำกัด', stars: 5, text: 'ใช้สาย YSLY-JZ กับตู้คอนโทรล ได้มาตรฐาน DIN VDE ตามที่ต้องการ สั่งง่าย ส่งไว สต็อกครบ', product: 'YSLY-JZ', slug: 'control-cable' },
  { name: 'คุณวิภา', initial: 'ว', company: 'หจก. เอ็นจิเนียริ่ง โปร', stars: 5, text: 'สั่งสาย LiYCY ชีลด์ป้องกัน EMI ได้ผลดีมาก สัญญาณไม่มี noise ทีมงานให้คำปรึกษาเลือกขนาดได้ดี', product: 'LiYCY', slug: 'shielded-cable' },
  { name: 'คุณประเสริฐ', initial: 'ป', company: 'บริษัท ไทย อินดัสเทรียล จำกัด', stars: 5, text: 'ซื้อสายเครนติดตั้งในโรงงาน ทนทานมาก ใช้งานมา 2 ปีไม่มีปัญหา ราคาดีกว่านำเข้าเอง', product: 'Crane Cable', slug: 'crane-cable' },
  { name: 'คุณอรุณ', initial: 'อ', company: 'บริษัท เพาเวอร์ เทค จำกัด', stars: 4, text: 'สั่งสาย VFD Servo Cable มาใช้กับเครื่อง CNC คุณภาพดี ตรงสเปค ส่งตรงเวลา แนะนำครับ', product: 'VFD Cable', slug: 'vfd-servo-cable' },
  { name: 'คุณนภา', initial: 'น', company: 'บริษัท สมาร์ท แมนูแฟคเจอริ่ง จำกัด', stars: 5, text: 'ใช้สายทนความร้อน SiHF ในห้องเตาอบ ทนได้ 180 องศา ไม่มีปัญหาเลย คุณภาพยุโรปจริงๆ', product: 'SiHF', slug: 'heat-resistant-cable' },
  { name: 'คุณธนา', initial: 'ธ', company: 'หจก. ธนา อิเล็กทริค', stars: 5, text: 'ซื้อสายคอนโทรลหลายรุ่น ได้ราคาส่ง ทีมงานช่วยเลือกขนาดให้ถูกต้อง ประทับใจบริการมาก', product: 'Control Cable', slug: 'control-cable' },
]

export default function ReviewsPage() {
  const avgRating = (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(1)
  const starCounts = [5, 4, 3, 2, 1].map(s => reviews.filter(r => r.stars === s).length)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <section className="reviews-hero">
        <div className="container">
          <h1>รีวิวจากลูกค้า</h1>
          <p>ความคิดเห็นจากลูกค้าที่ไว้วางใจสายไฟ NYX Cable</p>
        </div>
      </section>

      <div className="container">
        <div className="reviews-summary">
          <div className="reviews-score">
            <div className="big-number">{avgRating}</div>
            <div className="out-of">จาก 5.0</div>
            <div className="stars">{'★'.repeat(Math.round(Number(avgRating)))}{'☆'.repeat(5 - Math.round(Number(avgRating)))}</div>
            <div className="count">{reviews.length} รีวิว</div>
          </div>
          <div className="reviews-bars">
            {[5, 4, 3, 2, 1].map((star, i) => (
              <div key={star} className="bar-row">
                <span className="bar-label">{star} ★</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${reviews.length > 0 ? (starCounts[i] / reviews.length) * 100 : 0}%` }} />
                </div>
                <span className="bar-count">{starCounts[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="reviews-grid">
          {reviews.map((review, idx) => (
            <div key={idx} className="review-card">
              <div className="review-header">
                <div className="review-avatar">{review.initial}</div>
                <div>
                  <div className="review-name">{review.name}</div>
                  <div className="review-company">{review.company}</div>
                  <div className="review-stars">{'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}</div>
                </div>
              </div>
              <div className="review-text">{review.text}</div>
              <a href={`/products/detail/${review.slug}`} className="review-product">
                สินค้าที่ใช้: {review.product}
              </a>
            </div>
          ))}
        </div>
      </div>

      <section className="cta-section">
        <div className="container">
          <h2>พร้อมใช้สายไฟคุณภาพยุโรป?</h2>
          <p>สอบถามราคาและสั่งซื้อสายไฟ NYX Cable วันนี้</p>
          <div className="cta-actions">
            <a href="tel:021115588" className="btn btn-accent btn-lg">โทร 02-111-5588</a>
            <a href="https://page.line.me/ubb9405u" className="btn btn-line btn-lg" target="_blank" rel="noopener noreferrer">แอด LINE</a>
          </div>
        </div>
      </section>
    </>
  )
}
