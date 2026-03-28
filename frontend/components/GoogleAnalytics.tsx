'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export default function GoogleAnalytics() {
  const [consented, setConsented] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('nyx-cookie-consent')
    if (consent === 'accepted') {
      setConsented(true)
    }
    // Listen for consent changes
    const handler = () => {
      const c = localStorage.getItem('nyx-cookie-consent')
      setConsented(c === 'accepted')
    }
    window.addEventListener('storage', handler)
    // Also check on each render cycle (same-tab changes)
    const interval = setInterval(handler, 2000)
    return () => {
      window.removeEventListener('storage', handler)
      clearInterval(interval)
    }
  }, [])

  if (!GA_ID || !consented) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  )
}
