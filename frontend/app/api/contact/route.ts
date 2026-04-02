import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { recaptchaToken, ...formData } = body

    // 1. Verify reCAPTCHA v3 token
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY
    if (recaptchaSecret && recaptchaToken) {
      const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
      })
      const verifyData = await verifyRes.json()
      
      if (!verifyData.success || verifyData.score < 0.3) {
        return NextResponse.json(
          { success: false, message: 'reCAPTCHA verification failed' },
          { status: 403 }
        )
      }
    }

    // 2. Send to Web3Forms
    const web3Key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY
    if (!web3Key) {
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
    const web3Data = await web3Res.json()

    if (web3Data.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to send message' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[Contact API] Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
