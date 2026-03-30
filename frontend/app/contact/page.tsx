'use client'

import { useState } from 'react'
import Image from 'next/image'

const styles = `
  /* ─── Contact Hero ─── */
  .contact-hero {
    position: relative;
    background: linear-gradient(160deg, #001a33 0%, #002d5c 35%, #003d7a 70%, #002244 100%);
    color: #fff;
    padding: 64px 0 32px;
    text-align: center;
    overflow: hidden;
  }
  .contact-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 400'%3E%3Ccircle cx='200' cy='200' r='200' fill='rgba(0,153,255,0.06)'/%3E%3Ccircle cx='1200' cy='100' r='150' fill='rgba(240,165,0,0.04)'/%3E%3C/svg%3E") no-repeat center;
    background-size: cover;
  }
  .contact-hero h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 12px; position: relative; }
  .contact-hero p { font-size: 1.05rem; opacity: 0.8; max-width: 500px; margin: 0 auto 28px; position: relative; line-height: 1.7; }

  /* ─── Quick Contact Ribbon (inside hero) ─── */
  .quick-ribbon {
    display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;
    position: relative; z-index: 2;
  }
  .ribbon-btn {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 12px 24px; border-radius: 50px; font-weight: 700; font-size: 0.88rem;
    text-decoration: none; transition: all 0.25s; color: #fff;
  }
  .ribbon-btn.call { background: linear-gradient(135deg, #f0a500, #d48900); box-shadow: 0 4px 14px rgba(240,165,0,0.3); }
  .ribbon-btn.call:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(240,165,0,0.4); color: #fff; }
  .ribbon-btn.line { background: linear-gradient(135deg, #06c755, #04a845); box-shadow: 0 4px 14px rgba(6,199,85,0.3); }
  .ribbon-btn.line:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(6,199,85,0.4); color: #fff; }
  .ribbon-btn.email { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.4); }
  .ribbon-btn.email:hover { background: rgba(255,255,255,0.25); transform: translateY(-2px); color: #fff; }

  /* ─── Contact Grid ─── */
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; padding: 40px 0 56px; }

  /* ─── Contact Cards ─── */
  .contact-info-cards { display: grid; gap: 16px; }
  .contact-card {
    display: flex; gap: 16px; padding: 22px; background: #fff;
    border: 1px solid #e5e7eb; border-radius: 16px;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  .contact-card:hover {
    border-color: #0099ff; box-shadow: 0 8px 30px rgba(0,51,102,0.08);
    transform: translateY(-3px);
  }
  .contact-card-icon {
    width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; flex-shrink: 0;
  }
  .icon-tel { background: transparent; }
  .icon-line { background: transparent; }
  .icon-mail { background: transparent; }
  .icon-loc { background: transparent; }
  .icon-time { background: transparent; }
  .contact-card h3 { font-size: 0.95rem; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }
  .contact-card p { font-size: 0.85rem; color: #4b5563; line-height: 1.6; }
  .contact-card a { color: #0066cc; font-weight: 600; text-decoration: none; }
  .contact-card a:hover { color: #003d7a; }

  /* ─── Contact Form ─── */
  .contact-form-box {
    background: #fff; border: 1px solid #e5e7eb; border-radius: 20px;
    padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  }
  .contact-form-box h2 { font-size: 1.3rem; font-weight: 700; color: #1a1a2e; margin-bottom: 24px; }
  .form-group { margin-bottom: 18px; position: relative; }
  .form-group label {
    display: block; font-size: 0.82rem; font-weight: 600; color: #374151;
    margin-bottom: 6px;
  }
  .form-group input, .form-group textarea, .form-group select {
    width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb;
    border-radius: 12px; font-family: inherit; font-size: 0.9rem;
    outline: none; transition: all 0.2s; background: #fafbfc;
  }
  .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
    border-color: #0066cc; box-shadow: 0 0 0 3px rgba(0,102,204,0.08);
    background: #fff;
  }
  .form-group textarea { min-height: 110px; resize: vertical; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .success-msg {
    background: linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.04));
    border: 1px solid rgba(16,185,129,0.25); border-radius: 16px;
    padding: 32px; text-align: center;
  }
  .success-msg .check { font-size: 2.5rem; margin-bottom: 12px; }
  .success-msg h3 { font-size: 1.1rem; font-weight: 700; color: #059669; margin-bottom: 8px; }
  .success-msg p { font-size: 0.85rem; color: #6b7280; }
  .error-msg {
    background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2);
    border-radius: 12px; padding: 14px; text-align: center;
    color: #dc2626; font-weight: 500; font-size: 0.85rem; margin-bottom: 16px;
  }
  .submit-btn-premium {
    width: 100%; padding: 14px; border: none; border-radius: 12px;
    background: linear-gradient(135deg, #003366, #0066cc);
    color: #fff; font-size: 0.95rem; font-weight: 700;
    cursor: pointer; transition: all 0.25s; font-family: inherit;
  }
  .submit-btn-premium:hover { box-shadow: 0 6px 20px rgba(0,51,102,0.25); transform: translateY(-1px); }
  .submit-btn-premium:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* ─── Map ─── */
  .map-section { position: relative; padding: 56px 0 0; }
  .map-section h2 { font-size: 1.3rem; font-weight: 700; color: #1a1a2e; margin-bottom: 20px; text-align: center; }
  .map-wrapper { position: relative; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .map-wrapper iframe { width: 100%; height: 400px; border: 0; display: block; }
  .map-overlay {
    position: absolute; bottom: 20px; left: 20px;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(12px);
    border-radius: 16px; padding: 20px 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    max-width: 320px;
  }
  .map-overlay h3 { font-size: 0.9rem; font-weight: 700; color: #003366; margin-bottom: 6px; }
  .map-overlay p { font-size: 0.78rem; color: #4b5563; line-height: 1.6; margin-bottom: 10px; }
  .map-overlay a {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; background: linear-gradient(135deg, #003366, #0066cc);
    color: #fff; font-size: 0.78rem; font-weight: 600;
    border-radius: 50px; text-decoration: none; transition: all 0.2s;
  }
  .map-overlay a:hover { box-shadow: 0 4px 12px rgba(0,51,102,0.3); color: #fff; }

  /* ─── Warehouse ─── */
  .warehouse-section { padding: 56px 0; }
  .warehouse-section h2 { font-size: 1.3rem; font-weight: 700; color: #1a1a2e; margin-bottom: 20px; text-align: center; }
  .warehouse-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .warehouse-photo {
    border-radius: 14px; overflow: hidden; aspect-ratio: 4/3;
    cursor: pointer; position: relative;
  }
  .warehouse-photo img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s cubic-bezier(0.4,0,0.2,1); }
  .warehouse-photo:hover img { transform: scale(1.08); }
  .warehouse-photo::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.3));
    opacity: 0;
    transition: opacity 0.3s;
  }
  .warehouse-photo:hover::after { opacity: 1; }

  @media (max-width: 768px) {
    .contact-hero h1 { font-size: 1.6rem; }
    .contact-hero { padding: 48px 0 24px; }
    .quick-ribbon { flex-direction: column; align-items: center; padding: 0 20px; }
    .ribbon-btn { width: 100%; justify-content: center; min-height: 48px; }
    .contact-grid { grid-template-columns: 1fr; gap: 24px; }
    .form-row { grid-template-columns: 1fr; }
    .warehouse-grid { grid-template-columns: repeat(2, 1fr); }
    .map-overlay { position: relative; bottom: auto; left: auto; max-width: 100%; border-radius: 0 0 16px 16px; }
    .warehouse-section h2 { font-size: 1.3rem !important; }
    .contact-form-box { padding: 24px 16px; }
    .contact-card { padding: 16px; gap: 12px; }
    .contact-card-icon { width: 44px; height: 44px; }
  }
  @media (max-width: 480px) {
    .contact-hero h1 { font-size: 1.3rem; }
    .contact-card h3 { font-size: 0.85rem; }
    .contact-card p { font-size: 0.78rem; }
  }
`

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    // Rate limiting: prevent rapid re-submissions (3s cooldown)
    const lastSubmit = sessionStorage.getItem('nyx-form-last-submit')
    if (lastSubmit && Date.now() - parseInt(lastSubmit) < 3000) {
      setError('กรุณารอสักครู่ก่อนส่งอีกครั้ง')
      return
    }

    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const company = formData.get('company') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const product = formData.get('product') as string
    const message = formData.get('message') as string

    // Honeypot check — bots fill hidden fields
    const botCheck = formData.get('botcheck') as string
    if (botCheck) {
      setSubmitted(true)
      setLoading(false)
      return
    }

    // Try Web3Forms if key is set, otherwise use mailto fallback
    const web3Key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY
    if (web3Key && web3Key !== 'YOUR_WEB3FORMS_KEY') {
      try {
        formData.append('access_key', web3Key)
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (data.success) {
          sessionStorage.setItem('nyx-form-last-submit', Date.now().toString())
          setSubmitted(true)
          setLoading(false)
          return
        }
      } catch { /* fallback to mailto */ }
    }

    // Mailto fallback — always works
    const subject = encodeURIComponent(`[เว็บไซต์] สอบถามจาก ${name}`)
    const body = encodeURIComponent(
      `ชื่อ: ${name}\nบริษัท: ${company || '-'}\nเบอร์โทร: ${phone}\nอีเมล: ${email || '-'}\nสินค้าที่สนใจ: ${product || '-'}\n\nรายละเอียด:\n${message}`
    )
    window.open(`https://mail.google.com/mail/?view=cm&to=sales@nyxcable.com&su=${subject}&body=${body}`, '_blank')
    sessionStorage.setItem('nyx-form-last-submit', Date.now().toString())
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* ─── Hero ─── */}
      <section className="contact-hero">
        <div className="container">
          <h1>ติดต่อเรา</h1>
          <p>ทีมวิศวกรพร้อมให้คำปรึกษา สอบถามราคาและสต็อกสินค้า</p>
          <div className="quick-ribbon">
            <a href="tel:021115588" className="ribbon-btn call">โทร 02-111-5588</a>
            <a href="https://page.line.me/@ubb9405u" className="ribbon-btn line" target="_blank" rel="noopener noreferrer">แอด LINE @nyxcable</a>
            <a href="https://mail.google.com/mail/?view=cm&to=sales@nyxcable.com" target="_blank" rel="noopener noreferrer" className="ribbon-btn email">sales@nyxcable.com</a>
          </div>
        </div>
      </section>

      {/* ─── Contact Grid ─── */}
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info-cards">
            <div className="contact-card">
              <div className="contact-card-icon icon-tel"><Image src="/images/icons/contact-phone.svg" alt="โทรศัพท์" width={32} height={32} /></div>
              <div><h3>โทรศัพท์</h3><p><a href="tel:021115588">02-111-5588</a><br />ตอบทันที ในเวลาทำการ</p></div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon icon-line"><Image src="/images/icons/contact-line.svg" alt="LINE" width={32} height={32} /></div>
              <div><h3>LINE Official</h3><p><a href="https://page.line.me/@ubb9405u" target="_blank" rel="noopener noreferrer">@nyxcable</a><br />ตอบไว 5 นาที</p></div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon icon-mail"><Image src="/images/icons/contact-email.svg" alt="อีเมล" width={32} height={32} /></div>
              <div><h3>อีเมล</h3><p><a href="https://mail.google.com/mail/?view=cm&to=sales@nyxcable.com" target="_blank" rel="noopener noreferrer">sales@nyxcable.com</a><br />ตอบกลับภายใน 1 ชม.</p></div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon icon-loc"><Image src="/images/icons/contact-location.svg" alt="ที่อยู่" width={32} height={32} /></div>
              <div><h3>ที่อยู่</h3><p><a href="https://maps.app.goo.gl/ovpmCTPfoeTeNRwV8" target="_blank" rel="noopener noreferrer">2098 หมู่ 1 ต.สำโรงเหนือ (ซ.สุขุมวิท 72)<br />อ.เมือง สมุทรปราการ 10270</a></p></div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon icon-time"><Image src="/images/icons/contact-clock.svg" alt="เวลาทำการ" width={32} height={32} /></div>
              <div><h3>เวลาทำการ</h3><p><span style={{ color: '#0066cc', fontWeight: 600 }}>จันทร์ - ศุกร์ 8:30 - 17:30</span><br />เสาร์-อาทิตย์ ปิดทำการ</p></div>
            </div>
          </div>

          {/* ─── Form ─── */}
          <div className="contact-form-box">
            <h2>ส่งข้อความถึงเรา</h2>
            {submitted ? (
              <div className="success-msg">
                <div className="check">✓</div>
                <h3>ส่งข้อความสำเร็จ!</h3>
                <p>ทีมงานจะติดต่อกลับภายใน 1 ชั่วโมง</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <input type="hidden" name="subject" value="สอบถามจากเว็บไซต์ NYX Cable" />
                <input type="hidden" name="from_name" value="NYX Cable Website" />
                <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

                {error && <div className="error-msg">{error}</div>}
                <div className="form-row">
                  <div className="form-group"><label htmlFor="name">ชื่อ *</label><input id="name" name="name" type="text" placeholder="ชื่อ-นามสกุล" required /></div>
                  <div className="form-group"><label htmlFor="company">บริษัท</label><input id="company" name="company" type="text" placeholder="ชื่อบริษัท" /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label htmlFor="phone">เบอร์โทร *</label><input id="phone" name="phone" type="tel" placeholder="0XX-XXX-XXXX" required /></div>
                  <div className="form-group"><label htmlFor="email">อีเมล</label><input id="email" name="email" type="email" placeholder="email@company.com" /></div>
                </div>
                <div className="form-group">
                  <label htmlFor="product">สินค้าที่สนใจ</label>
                  <select id="product" name="product">
                    <option value="">-- เลือกหมวดหมู่ --</option>
                    <option>สายคอนโทรล</option>
                    <option>สายชีลด์ (Shielded Cable)</option>
                    <option>สายคู่บิดเกลียว RS485 / RS422</option>
                    <option>สายไฟฉนวนทำจากยาง/กันน้ำ</option>
                    <option>สายวายริ่งตู้ (VSF)</option>
                    <option>สายเคเบิลสำหรับงานเคลื่อนที่</option>
                    <option>สายฟิลด์บัส (Industrial Bus Cables)</option>
                    <option>สายทนความร้อน ทนสารเคมี</option>
                    <option>อื่นๆ</option>
                  </select>
                </div>
                <div className="form-group"><label htmlFor="message">รายละเอียด *</label><textarea id="message" name="message" placeholder="ระบุจำนวนคอร์ / ขนาด mm2 / ความยาวที่ต้องการ เช่น 3G2.5 500m" required></textarea></div>
                <button type="submit" className="submit-btn-premium" disabled={loading}>
                  {loading ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ─── Map with overlay ─── */}
      <div className="container">
        <div className="map-section">
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <a href="https://maps.app.goo.gl/eiNSyf1Rqcwnh58M7" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'linear-gradient(135deg, #003366, #0066cc)', color: '#fff', borderRadius: 50, fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,51,102,0.3)', transition: 'all 0.25s' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
              นำทาง Google Maps
            </a>
          </div>
          <div className="map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.5!2d100.5993!3d13.6581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDM5JzI5LjIiTiAxMDDCsDM1JzU3LjYiRQ!5e0!3m2!1sth!2sth!4v1234567890"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="แผนที่ NYX Cable - บางนา สมุทรปราการ"
            />
          </div>
        </div>
      </div>

      {/* ─── Warehouse ─── */}
      <div className="container">
        <section className="warehouse-section">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>สำนักงานและคลังสินค้า</h2>
          <div className="warehouse-grid">
            {[
              { src: '/images/office/office-building.jpg', alt: 'อาคารสำนักงาน NYX Cable' },
              { src: '/images/office/office-entrance.jpg', alt: 'ทางเข้าสำนักงาน NYX Cable' },
              { src: '/images/office/office-door.jpg', alt: 'ประตูสำนักงาน NYX Cable' },
              { src: '/images/office/warehouse.jpg', alt: 'คลังสินค้าสายไฟ NYX Cable' },
              { src: '/images/office/cable-rolls.jpg', alt: 'ม้วนสายไฟพร้อมส่ง NYX Cable' },
              { src: '/images/office/cable-shelves.jpg', alt: 'ชั้นวางสินค้าสายไฟ NYX Cable' },
              { src: '/images/office/meeting-room.jpg', alt: 'ห้องประชุม NYX Cable' },
              { src: '/images/office/cable-cutting.jpg', alt: 'เครื่องตัดสายไฟ NYX Cable' },
            ].map((photo, i) => (
              <div key={i} className="warehouse-photo">
                <Image src={photo.src} alt={photo.alt} loading="lazy" fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
            ))}
          </div>
        </section>
      </div>

    </>
  )
}
