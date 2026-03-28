import Link from 'next/link'

export default function NotFound() {
  return (
    <section style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(160deg, #001a33 0%, #002d5c 35%, #003d7a 70%, #002244 100%)',
      color: '#fff',
    }}>
      <div>
        <div style={{ fontSize: '6rem', fontWeight: 800, opacity: 0.15, lineHeight: 1 }}>404</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 12, marginTop: -20 }}>
          ไม่พบหน้าที่คุณต้องการ
        </h1>
        <p style={{ fontSize: '1rem', opacity: 0.7, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
          หน้านี้อาจถูกย้าย ลบ หรือ URL ไม่ถูกต้อง
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: '0.95rem',
            textDecoration: 'none', color: '#001a33',
            background: 'linear-gradient(135deg, #fbb03b, #f0a500)',
            boxShadow: '0 4px 14px rgba(240,165,0,0.3)',
            transition: 'transform 0.2s',
          }}>
            กลับหน้าหลัก
          </Link>
          <Link href="/products" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: '0.95rem',
            textDecoration: 'none', color: '#fff',
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
            transition: 'background 0.2s',
          }}>
            ดูสินค้า
          </Link>
          <Link href="/contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: '0.95rem',
            textDecoration: 'none', color: '#fff',
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
            transition: 'background 0.2s',
          }}>
            ติดต่อเรา
          </Link>
        </div>
      </div>
    </section>
  )
}
