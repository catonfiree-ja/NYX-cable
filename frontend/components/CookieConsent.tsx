'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('nyx-cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('nyx-cookie-consent', 'accepted')
    setVisible(false)
  }

  const reject = () => {
    localStorage.setItem('nyx-cookie-consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: 'rgba(0, 26, 51, 0.97)', backdropFilter: 'blur(12px)',
      padding: '16px 24px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: 16, flexWrap: 'wrap',
      borderTop: '1px solid rgba(251,176,59,0.3)',
      animation: 'slideUp 0.4s ease-out',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}} />
      <p style={{ color: '#e2e8f0', fontSize: '0.84rem', margin: 0, lineHeight: 1.5, maxWidth: 600 }}>
        เว็บไซต์นี้ใช้คุกกี้เพื่อพัฒนาประสบการณ์การใช้งาน{' '}
        <Link href="/privacy-policy" style={{ color: '#fbb03b', textDecoration: 'underline' }}>นโยบายความเป็นส่วนตัว</Link>
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={reject} style={{
          background: 'rgba(255,255,255,0.1)',
          color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 20px',
          borderRadius: 8, fontWeight: 600, fontSize: '0.84rem',
          cursor: 'pointer', whiteSpace: 'nowrap',
          transition: 'background 0.2s',
        }}
        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
        >
          ปฏิเสธ
        </button>
        <button onClick={accept} style={{
          background: 'linear-gradient(135deg, #fbb03b, #f0a500)',
          color: '#001a33', border: 'none', padding: '8px 24px',
          borderRadius: 8, fontWeight: 700, fontSize: '0.84rem',
          cursor: 'pointer', whiteSpace: 'nowrap',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(251,176,59,0.3)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          ยอมรับ
        </button>
      </div>
    </div>
  )
}

