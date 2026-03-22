import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'NYX Cable — สายไฟอุตสาหกรรมคุณภาพยุโรป'
  const subtitle = searchParams.get('subtitle') || 'มาตรฐาน DIN VDE | สต็อกพร้อมส่ง 150+ ขนาด'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #001a33 0%, #003366 50%, #004080 100%)',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FBB03B, #F0A500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 800,
              color: '#003366',
            }}
          >
            N
          </div>
          <div style={{ color: '#fff', fontSize: '32px', fontWeight: 700, letterSpacing: '3px' }}>
            NYX CABLE
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            color: '#fff',
            fontSize: '48px',
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.3,
            maxWidth: '900px',
            marginBottom: '20px',
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '24px',
            textAlign: 'center',
            maxWidth: '700px',
          }}
        >
          {subtitle}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '6px',
            background: 'linear-gradient(90deg, #FBB03B, #0099FF, #FBB03B)',
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
