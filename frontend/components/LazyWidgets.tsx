'use client'

import dynamic from 'next/dynamic'

const CookieConsent = dynamic(() => import('@/components/CookieConsent'), { ssr: false })
const FloatingContactFAB = dynamic(() => import('@/components/FloatingContactFAB'), { ssr: false })

export default function LazyWidgets() {
    return (
        <>
            <CookieConsent />
            <FloatingContactFAB />
        </>
    )
}
