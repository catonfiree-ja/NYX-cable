import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { recaptchaToken, ...formData } = body

    // 1. Verify reCAPTCHA v3 token (soft check — warn but don't block)
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY
    if (recaptchaSecret && recaptchaToken) {
      try {
        const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
        })
        const verifyData = await verifyRes.json()

        if (!verifyData.success || verifyData.score < 0.3) {
          console.warn('[Contact API] reCAPTCHA soft-fail:', {
            success: verifyData.success,
            score: verifyData.score,
            errors: verifyData['error-codes'],
          })
        }
      } catch (err) {
        console.warn('[Contact API] reCAPTCHA verify error:', err)
      }
    }

    // 2. Send to Web3Forms
    const web3Key = process.env.WEB3FORMS_KEY || process.env.NEXT_PUBLIC_WEB3FORMS_KEY
    if (!web3Key) {
      console.error('[Contact API] No WEB3FORMS_KEY found in env')
      return NextResponse.json(
        { success: false, message: 'Form service not configured' },
        { status: 500 }
      )
    }

    const web3Res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: web3Key,
        subject: `[เว็บไซต์] สอบถามจาก ${formData.name}`,
        from_name: 'NYX Cable Website',
        ...formData,
      }),
    })

    // Check if response is JSON before parsing
    const contentType = web3Res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      const text = await web3Res.text()
      console.error('[Contact API] Web3Forms returned non-JSON:', web3Res.status, text.substring(0, 200))
      return NextResponse.json(
        { success: false, message: `Web3Forms error (HTTP ${web3Res.status}). Please check your access key.` },
        { status: 500 }
      )
    }

    const web3Data = await web3Res.json()

    if (web3Data.success) {
      return NextResponse.json({ success: true })
    } else {
      console.error('[Contact API] Web3Forms error:', web3Data)
      return NextResponse.json(
        { success: false, message: web3Data.message || 'Failed to send message' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('[Contact API] Error:', error)
    return NextResponse.json(
      { success: false, message: `Error: ${error?.message || String(error)}` },
      { status: 500 }
    )
  }
}
