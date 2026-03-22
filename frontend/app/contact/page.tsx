'use client'

import { useState } from 'react'

const styles = `
  .contact-hero { background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary)); color: var(--color-white); padding: var(--spacing-3xl) 0; text-align: center; }
  .contact-hero h1 { font-size: var(--font-size-3xl); font-weight: 700; margin-bottom: var(--spacing-sm); }
  .contact-hero p { font-size: var(--font-size-lg); opacity: 0.85; }
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-3xl); padding: var(--spacing-3xl) 0; }
  .contact-info-cards { display: grid; gap: var(--spacing-lg); }
  .contact-card { display: flex; gap: var(--spacing-lg); padding: var(--spacing-xl); background: var(--color-white); border: 1px solid var(--color-gray-200); border-radius: var(--radius-xl); transition: all var(--transition-normal); }
  .contact-card:hover { border-color: var(--color-secondary); box-shadow: var(--shadow-lg); }
  .contact-card-icon { width: 56px; height: 56px; border-radius: var(--radius-lg); background: linear-gradient(135deg, rgba(0,153,255,0.1), rgba(0,51,102,0.1)); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; color: var(--color-primary); letter-spacing: 0.5px; flex-shrink: 0; }
  .contact-card h3 { font-size: var(--font-size-base); font-weight: 600; color: var(--color-primary); margin-bottom: var(--spacing-xs); }
  .contact-card p { font-size: var(--font-size-sm); color: var(--color-gray-600); line-height: 1.6; }
  .contact-card a { color: var(--color-secondary); font-weight: 500; }
  .contact-form-box { background: var(--color-white); border: 1px solid var(--color-gray-200); border-radius: var(--radius-xl); padding: var(--spacing-2xl); }
  .contact-form-box h2 { font-size: var(--font-size-xl); font-weight: 600; color: var(--color-primary); margin-bottom: var(--spacing-xl); }
  .form-group { margin-bottom: var(--spacing-lg); }
  .form-group label { display: block; font-size: var(--font-size-sm); font-weight: 500; color: var(--color-gray-700); margin-bottom: var(--spacing-xs); }
  .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--color-gray-300); border-radius: var(--radius-md); font-family: var(--font-family); font-size: var(--font-size-sm); outline: none; }
  .form-group input:focus, .form-group textarea:focus { border-color: var(--color-secondary); box-shadow: 0 0 0 3px rgba(0,153,255,0.1); }
  .form-group textarea { min-height: 120px; resize: vertical; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); }
  .success-msg { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: var(--radius-lg); padding: var(--spacing-xl); text-align: center; color: var(--color-success); font-weight: 500; }
  .error-msg { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: var(--radius-lg); padding: var(--spacing-lg); text-align: center; color: var(--color-danger); font-weight: 500; margin-bottom: var(--spacing-md); }
  .submit-btn { position: relative; }
  .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
  .contact-map { margin: 48px 0 0; }
  .contact-map h2 { font-size: var(--font-size-xl); font-weight: 700; color: var(--color-primary); margin-bottom: var(--spacing-lg); text-align: center; }
  .contact-map iframe { width: 100%; height: 350px; border: 0; border-radius: var(--radius-xl); box-shadow: var(--shadow-md); }
  .contact-map-btn { text-align: center; margin-top: var(--spacing-md); }
  .warehouse-section { padding: 48px 0; }
  .warehouse-section h2 { font-size: var(--font-size-xl); font-weight: 700; color: var(--color-primary); margin-bottom: var(--spacing-lg); text-align: center; }
  .warehouse-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .warehouse-photo { border-radius: var(--radius-lg); overflow: hidden; aspect-ratio: 4/3; cursor: pointer; position: relative; }
  .warehouse-photo img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
  .warehouse-photo:hover img { transform: scale(1.08); }
  @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } .form-row { grid-template-columns: 1fr; } .warehouse-grid { grid-template-columns: repeat(2, 1fr); } }
`

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    formData.append('access_key', 'YOUR_WEB3FORMS_KEY') // TODO: Replace with actual key

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
      } else {
        setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
      }
    } catch {
      setError('ไม่สามารถส่งข้อความได้ กรุณาโทรหาเราที่ 02-111-5588')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <section className="contact-hero">
        <div className="container">
          <h1>ติดต่อเรา</h1>
          <p>ทีมวิศวกรพร้อมให้คำปรึกษา สอบถามราคาและสต็อกสินค้า</p>
        </div>
      </section>
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info-cards">
            <div className="contact-card">
              <div className="contact-card-icon">Tel</div>
              <div><h3>โทรศัพท์</h3><p><a href="tel:021115588">02-111-5588</a></p></div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">LINE</div>
              <div><h3>LINE Official</h3><p><a href="https://page.line.me/ubb9405u" target="_blank" rel="noopener noreferrer">@nyxcable</a><br/>ตอบไว 5 นาที</p></div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">Mail</div>
              <div><h3>อีเมล</h3><p><a href="mailto:sales@nyxcable.com">sales@nyxcable.com</a></p></div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">Loc</div>
              <div><h3>ที่อยู่</h3><p>2098 หมู่ 1 ต.สำโรงเหนือ (ซ.สุขุมวิท 72)<br/>อ.เมือง สมุทรปราการ 10270<br/>จ-ศ 8:30-17:30<br/><a href="https://www.google.com/maps/dir/Current+Location/13.65811028970517,100.59934546581569" target="_blank" rel="noopener noreferrer">นำทาง Google Maps →</a></p></div>
            </div>
          </div>
          <div className="contact-form-box">
            <h2>ส่งข้อความถึงเรา</h2>
            {submitted ? (
              <div className="success-msg">
                ✅ ส่งข้อความสำเร็จ! ทีมงานจะติดต่อกลับภายใน 1 ชั่วโมง
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Web3Forms hidden fields */}
                <input type="hidden" name="subject" value="สอบถามจากเว็บไซต์ NYX Cable" />
                <input type="hidden" name="from_name" value="NYX Cable Website" />
                <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

                {error && <div className="error-msg">{error}</div>}
                <div className="form-row">
                  <div className="form-group"><label htmlFor="name">ชื่อ *</label><input id="name" name="name" type="text" placeholder="ชื่อ-นามสกุล" required/></div>
                  <div className="form-group"><label htmlFor="company">บริษัท</label><input id="company" name="company" type="text" placeholder="ชื่อบริษัท"/></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label htmlFor="phone">เบอร์โทร *</label><input id="phone" name="phone" type="tel" placeholder="0XX-XXX-XXXX" required/></div>
                  <div className="form-group"><label htmlFor="email">อีเมล</label><input id="email" name="email" type="email" placeholder="email@company.com"/></div>
                </div>
                <div className="form-group">
                  <label htmlFor="product">สินค้าที่สนใจ</label>
                  <select id="product" name="product">
                    <option value="">-- เลือก --</option>
                    <option>สายคอนโทรล (Control Cable)</option>
                    <option>สาย VFD / Servo Cable</option>
                    <option>สายทนความร้อน (Heat Resistant)</option>
                    <option>สายชีลด์ (Shielded Cable)</option>
                    <option>สายเครน (Crane Cable)</option>
                    <option>สาย Bus / Data Cable</option>
                    <option>อื่นๆ</option>
                  </select>
                </div>
                <div className="form-group"><label htmlFor="message">รายละเอียด *</label><textarea id="message" name="message" placeholder="ระบุรุ่น ขนาด จำนวนที่ต้องการ" required></textarea></div>
                <button type="submit" className="btn btn-primary btn-lg submit-btn" style={{width:'100%',justifyContent:'center'}} disabled={loading}>
                  {loading ? 'กำลังส่ง...' : 'ส่งข้อความ →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Google Maps */}
      <div className="container">
        <div className="contact-map">
          <h2>แผนที่</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.5!2d100.5993!3d13.6581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDM5JzI5LjIiTiAxMDDCsDM1JzU3LjYiRQ!5e0!3m2!1sth!2sth!4v1234567890"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="แผนที่ NYX Cable - บางนา สมุทรปราการ"
          />
          <div className="contact-map-btn">
            <a href="https://www.google.com/maps/dir/Current+Location/13.65811028970517,100.59934546581569" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              นำทาง Google Maps →
            </a>
          </div>
        </div>
      </div>

      {/* Warehouse Gallery */}
      <div className="container">
        <section className="warehouse-section">
          <h2>สำนักงานและคลังสินค้า</h2>
          <div className="warehouse-grid">
            {[
              { src: 'https://nyxcable.com/wp-content/uploads/2024/12/LINE_ALBUM_201224_241220_1-scaled.jpg', alt: 'อาคารสำนักงาน NYX Cable' },
              { src: 'https://nyxcable.com/wp-content/uploads/2024/09/61778.jpg', alt: 'ทางเข้าสำนักงาน NYX Cable' },
              { src: 'https://nyxcable.com/wp-content/uploads/2024/09/61777.jpg', alt: 'ประตูสำนักงาน NYX Cable' },
              { src: 'https://nyxcable.com/wp-content/uploads/2024/12/LINE_ALBUM_201224_241220_6-scaled.jpg', alt: 'คลังสินค้าสายไฟ NYX Cable' },
              { src: 'https://nyxcable.com/wp-content/uploads/2024/12/86205.jpg', alt: 'ม้วนสายไฟพร้อมส่ง NYX Cable' },
              { src: 'https://nyxcable.com/wp-content/uploads/2024/09/61766.jpg', alt: 'ชั้นวางสินค้าสายไฟ NYX Cable' },
              { src: 'https://nyxcable.com/wp-content/uploads/2024/12/LINE_ALBUM_201224_241220_7-scaled.jpg', alt: 'ห้องประชุม NYX Cable' },
              { src: 'https://nyxcable.com/wp-content/uploads/2024/12/S__4472836.jpg', alt: 'เครื่องตัดสายไฟ NYX Cable' },
            ].map((photo, i) => (
              <div key={i} className="warehouse-photo">
                <img src={photo.src} alt={photo.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="cta-section" style={{ marginTop: '0' }}>
        <div className="container">
          <h2>ยังไม่แน่ใจรุ่นไหน? ดูแคตตาล็อกก่อน</h2>
          <p>สำรวจสินค้ากว่า 150 รุ่น พร้อมสเปคและราคา</p>
          <div className="cta-actions">
            <a href="/products" className="btn btn-accent btn-lg">ดูสินค้าทั้งหมด →</a>
            <a href="/blog" className="btn btn-primary btn-lg">อ่านบทความ & คู่มือ</a>
          </div>
        </div>
      </section>
    </>
  )
}
