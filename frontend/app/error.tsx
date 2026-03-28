'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 20px',
      background: '#f8fafc',
    }}>
      <div>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.05))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: '2rem',
        }}>
          ⚠
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>
          เกิดข้อผิดพลาด
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#6b7280', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
          ระบบเกิดข้อผิดพลาดชั่วคราว กรุณาลองใหม่อีกครั้ง
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: '0.95rem',
              cursor: 'pointer', color: '#fff', border: 'none',
              background: 'linear-gradient(135deg, #003366, #0066cc)',
              boxShadow: '0 4px 14px rgba(0,51,102,0.3)',
              transition: 'transform 0.2s',
              fontFamily: 'inherit',
            }}
          >
            ลองใหม่
          </button>
          <a href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: '0.95rem',
            textDecoration: 'none', color: '#003366',
            background: '#fff', border: '1px solid #e5e7eb',
            transition: 'background 0.2s',
          }}>
            กลับหน้าหลัก
          </a>
        </div>
      </div>
    </section>
  )
}
