import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'นโยบายความเป็นส่วนตัว | Privacy Policy | NYX Cable',
  description: 'นโยบายความเป็นส่วนตัวของ NYX Cable — การเก็บรวบรวม ใช้ และปกป้องข้อมูลส่วนบุคคลของผู้ใช้งาน',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .pp-hero { background: linear-gradient(135deg, #001a33, #003366); color: #fff; padding: 60px 0 40px; text-align: center; }
        .pp-hero h1 { font-size: 2rem; font-weight: 800; margin-bottom: 8px; }
        .pp-hero p { opacity: 0.7; font-size: 0.9rem; }
        .pp-content { max-width: 800px; margin: 0 auto; padding: 48px 20px 60px; line-height: 1.9; color: #334155; }
        .pp-content h2 { font-size: 1.3rem; font-weight: 700; color: #003366; margin: 32px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #f0f7ff; }
        .pp-content h3 { font-size: 1.05rem; font-weight: 600; color: #003366; margin: 20px 0 8px; }
        .pp-content p { font-size: 0.9rem; margin-bottom: 12px; }
        .pp-content ul { padding-left: 20px; margin-bottom: 16px; }
        .pp-content li { font-size: 0.9rem; margin-bottom: 6px; }
        .pp-content .contact-box { background: #f0f7ff; border-radius: 12px; padding: 20px 24px; margin: 24px 0; border-left: 4px solid #003366; }
        .pp-content .contact-box strong { color: #003366; }
      `}} />

      <section className="pp-hero">
        <div className="container">
          <h1>นโยบายความเป็นส่วนตัว</h1>
          <p>Privacy Policy — บริษัท นิกซ์ เคเบิ้ล จำกัด</p>
        </div>
      </section>

      <div className="pp-content">
        <p>บริษัท นิกซ์ เคเบิ้ล จำกัด (&quot;บริษัท&quot;, &quot;เรา&quot;) ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของท่าน โดยนโยบายนี้อธิบายถึงวิธีที่เราเก็บรวบรวม ใช้ และปกป้องข้อมูลของท่าน ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)</p>

        <h2>1. ข้อมูลที่เราเก็บรวบรวม</h2>
        <ul>
          <li><strong>ข้อมูลติดต่อ:</strong> ชื่อ-สกุล, เบอร์โทรศัพท์, อีเมล, ชื่อบริษัท — เมื่อท่านติดต่อสอบถามสินค้า</li>
          <li><strong>ข้อมูลการใช้งานเว็บ:</strong> หน้าที่เยี่ยมชม, ระยะเวลาการใช้งาน, IP Address — ผ่าน Google Analytics</li>
          <li><strong>ข้อมูลจาก LINE Official Account:</strong> ชื่อ LINE, ข้อความที่ส่ง — เมื่อท่านติดต่อผ่าน LINE</li>
        </ul>

        <h2>2. วัตถุประสงค์ในการใช้ข้อมูล</h2>
        <ul>
          <li>ตอบกลับคำสอบถามเกี่ยวกับสินค้าและราคา</li>
          <li>จัดส่งใบเสนอราคาและข้อมูลสินค้า</li>
          <li>ปรับปรุงเว็บไซต์และประสบการณ์การใช้งาน</li>
          <li>ส่งข่าวสารและโปรโมชั่น (เฉพาะกรณีท่านยินยอม)</li>
        </ul>

        <h2>3. การแบ่งปันข้อมูล</h2>
        <p>เราไม่ขาย ไม่เปิดเผย และไม่แบ่งปันข้อมูลส่วนบุคคลของท่านให้บุคคลภายนอก ยกเว้น:</p>
        <ul>
          <li>ผู้ให้บริการขนส่งสินค้า — เพื่อจัดส่งสินค้าถึงท่าน</li>
          <li>หน่วยงานราชการ — กรณีเป็นไปตามกฎหมาย</li>
        </ul>

        <h2>4. คุกกี้ (Cookies)</h2>
        <p>เว็บไซต์ของเราใช้คุกกี้เพื่อ:</p>
        <ul>
          <li><strong>คุกกี้จำเป็น:</strong> เพื่อการทำงานพื้นฐานของเว็บไซต์</li>
          <li><strong>คุกกี้วิเคราะห์:</strong> Google Analytics เพื่อปรับปรุงเว็บไซต์</li>
        </ul>
        <p>ท่านสามารถปิดการใช้งานคุกกี้ได้ผ่านการตั้งค่าเบราว์เซอร์ของท่าน</p>

        <h2>5. การรักษาความปลอดภัย</h2>
        <p>เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อป้องกันการเข้าถึง การเปิดเผย การแก้ไข หรือการทำลายข้อมูลส่วนบุคคลโดยไม่ได้รับอนุญาต รวมถึงการเข้ารหัส SSL/TLS สำหรับข้อมูลที่ส่งผ่านเว็บไซต์</p>

        <h2>6. สิทธิของท่าน</h2>
        <p>ท่านมีสิทธิตาม PDPA ดังนี้:</p>
        <ul>
          <li>สิทธิในการเข้าถึงข้อมูลส่วนบุคคลของท่าน</li>
          <li>สิทธิในการแก้ไขข้อมูลให้ถูกต้อง</li>
          <li>สิทธิในการลบข้อมูล</li>
          <li>สิทธิในการถอนความยินยอม</li>
          <li>สิทธิในการคัดค้านการประมวลผลข้อมูล</li>
        </ul>

        <h2>7. ระยะเวลาการเก็บรักษาข้อมูล</h2>
        <p>เราจะเก็บรักษาข้อมูลส่วนบุคคลของท่านเท่าที่จำเป็นตามวัตถุประสงค์ที่ระบุไว้ หรือตามที่กฎหมายกำหนด</p>

        <h2>8. ติดต่อเรา</h2>
        <div className="contact-box">
          <strong>บริษัท นิกซ์ เคเบิ้ล จำกัด (NYX Cable Co., Ltd.)</strong>
          <p style={{ marginTop: 8 }}>
            2098 หมู่ 1 ต.สำโรงเหนือ (ซ.สุขุมวิท 72) อ.เมือง สมุทรปราการ 10270<br />
            โทร: <a href="tel:021115588" style={{ color: '#0066cc' }}>02-111-5588</a><br />
            อีเมล: <a href="mailto:sales@nyxcable.com" style={{ color: '#0066cc' }}>sales@nyxcable.com</a>
          </p>
        </div>

        <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 32 }}>ปรับปรุงล่าสุด: มีนาคม 2026</p>
      </div>
    </>
  )
}
