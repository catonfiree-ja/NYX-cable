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
  @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } .form-row { grid-template-columns: 1fr; } }
`

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
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
              <div><h3>โทรศัพท์</h3><p><a href="tel:021115588">02-111-5588</a><br/><a href="tel:0957275453">095-727-5453</a></p></div>
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
              <div><h3>ที่อยู่</h3><p>บางนา, กรุงเทพฯ<br/>จ-ศ 8:30-17:30</p></div>
            </div>
          </div>
          <div className="contact-form-box">
            <h2>ส่งข้อความถึงเรา</h2>
            {submitted ? (
              <div className="success-msg">
                ส่งข้อความสำเร็จ! ทีมงานจะติดต่อกลับภายใน 1 ชั่วโมง
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group"><label>ชื่อ *</label><input type="text" placeholder="ชื่อ-นามสกุล" required/></div>
                  <div className="form-group"><label>บริษัท</label><input type="text" placeholder="ชื่อบริษัท"/></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>เบอร์โทร *</label><input type="tel" placeholder="0XX-XXX-XXXX" required/></div>
                  <div className="form-group"><label>อีเมล</label><input type="email" placeholder="email@company.com"/></div>
                </div>
                <div className="form-group"><label>สินค้าที่สนใจ</label><select><option value="">-- เลือก --</option><option>สายคอนโทรล</option><option>สาย VFD</option><option>สายทนความร้อน</option><option>อื่นๆ</option></select></div>
                <div className="form-group"><label>รายละเอียด *</label><textarea placeholder="ระบุรุ่น ขนาด จำนวนที่ต้องการ" required></textarea></div>
                <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center'}}>ส่งข้อความ →</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
