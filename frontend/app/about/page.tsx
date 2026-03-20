const styles = `
  .about-hero { background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary)); color: var(--color-white); padding: var(--spacing-4xl) 0; text-align: center; }
  .about-hero h1 { font-size: var(--font-size-4xl); font-weight: 800; margin-bottom: var(--spacing-md); }
  .about-hero p { font-size: var(--font-size-lg); opacity: 0.85; max-width: 600px; margin: 0 auto; }
  .about-content { padding: var(--spacing-3xl) 0; }
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-3xl); align-items: center; margin-bottom: var(--spacing-4xl); }
  .about-text h2 { font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-primary); margin-bottom: var(--spacing-md); }
  .about-text p { color: var(--color-gray-600); line-height: 1.8; margin-bottom: var(--spacing-md); }
  .about-image { background: var(--color-gray-100); border-radius: var(--radius-xl); min-height: 300px; display: flex; align-items: center; justify-content: center; font-size: 5rem; border: 1px solid var(--color-gray-200); }
  .values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-xl); margin-bottom: var(--spacing-4xl); }
  .value-card { text-align: center; padding: var(--spacing-2xl); border-radius: var(--radius-xl); background: var(--color-white); border: 1px solid var(--color-gray-200); }
  .value-card:hover { border-color: var(--color-secondary); box-shadow: var(--shadow-lg); }
  .value-icon { font-size: 1.4rem; font-weight: 800; color: var(--color-accent); margin-bottom: var(--spacing-md); }
  .value-card h3 { font-size: var(--font-size-lg); font-weight: 600; color: var(--color-primary); margin-bottom: var(--spacing-sm); }
  .value-card p { font-size: var(--font-size-sm); color: var(--color-gray-500); }
  .timeline { max-width: 700px; margin: 0 auto; }
  .timeline-item { display: flex; gap: var(--spacing-xl); margin-bottom: var(--spacing-2xl); }
  .timeline-year { font-size: var(--font-size-xl); font-weight: 800; color: var(--color-accent); min-width: 80px; }
  .timeline-desc h3 { font-size: var(--font-size-base); font-weight: 600; color: var(--color-primary); margin-bottom: var(--spacing-xs); }
  .timeline-desc p { font-size: var(--font-size-sm); color: var(--color-gray-500); }
  @media (max-width: 768px) { .about-grid, .values-grid { grid-template-columns: 1fr; } }
`

export const metadata = { title: 'เกี่ยวกับ NYX Cable', description: 'NYX Cable ผู้นำด้านสายไฟอุตสาหกรรม มาตรฐานยุโรป ประสบการณ์กว่า 10 ปี' }

export default function AboutPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <section className="about-hero">
        <div className="container">
          <h1>เกี่ยวกับ NYX Cable</h1>
          <p>ผู้นำด้านสายไฟอุตสาหกรรมคุณภาพสูง มาตรฐานยุโรป ส่งมอบความเชื่อมั่นให้อุตสาหกรรมไทยมากว่า 10 ปี</p>
        </div>
      </section>
      <div className="container about-content">
        <div className="about-grid">
          <div className="about-text">
            <h2>เราคือผู้เชี่ยวชาญสายไฟอุตสาหกรรม</h2>
            <p>NYX Cable เป็นผู้นำเข้าและจำหน่ายสายไฟอุตสาหกรรมคุณภาพสูง ผลิตด้วยเทคโนโลยีขั้นสูงจากยุโรป ผ่านมาตรฐาน DIN VDE ทุกรุ่น</p>
            <p>เรามุ่งมั่นส่งมอบสายไฟที่มีคุณภาพสูงสุดให้กับโรงงานอุตสาหกรรมในประเทศไทย พร้อมทีมวิศวกรที่พร้อมให้คำปรึกษาตลอดเวลา</p>
          </div>
          <div className="about-image" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '2px' }}>NYX CABLE</div>
        </div>

        <div className="section-header"><h2>ค่านิยมของเรา</h2><div className="accent-line"></div></div>
        <div className="values-grid">
          <div className="value-card"><div className="value-icon">01</div><h3>คุณภาพ</h3><p>คัดสรรเฉพาะสายไฟที่ผ่านมาตรฐานสากลระดับสูงสุด</p></div>
          <div className="value-card"><div className="value-icon">02</div><h3>รวดเร็ว</h3><p>สต็อกพร้อมส่งทันที ลดเวลาหยุดเครื่องจักร</p></div>
          <div className="value-card"><div className="value-icon">03</div><h3>บริการ</h3><p>ทีมวิศวกรพร้อมให้คำปรึกษาตลอดอายุการใช้งาน</p></div>
        </div>

        <div className="section-header"><h2>เส้นทางของเรา</h2><div className="accent-line"></div></div>
        <div className="timeline">
          <div className="timeline-item"><span className="timeline-year">2015</span><div className="timeline-desc"><h3>ก่อตั้ง NYX Cable</h3><p>เริ่มต้นนำเข้าสายไฟอุตสาหกรรมจากยุโรป</p></div></div>
          <div className="timeline-item"><span className="timeline-year">2018</span><div className="timeline-desc"><h3>ขยายไลน์ผลิตภัณฑ์</h3><p>เพิ่มสาย VFD, สายทนความร้อน, สายเครน</p></div></div>
          <div className="timeline-item"><span className="timeline-year">2021</span><div className="timeline-desc"><h3>คลังสินค้าใหม่</h3><p>เปิดคลังสินค้าขนาดใหญ่ สต็อกพร้อมส่งกว่า 150 ขนาด</p></div></div>
          <div className="timeline-item"><span className="timeline-year">2026</span><div className="timeline-desc"><h3>ก้าวสู่ดิจิทัล</h3><p>เปิดตัวเว็บไซต์ใหม่พร้อมระบบ CMS สำหรับอัพเดทข้อมูลสินค้า</p></div></div>
        </div>
      </div>
    </>
  )
}
