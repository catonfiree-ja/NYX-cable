'use client'

import dynamic from 'next/dynamic'

const CookieConsent = dynamic(() => import('@/components/CookieConsent'), { ssr: false })
const FloatingContactFAB = dynamic(() => import('@/components/FloatingContactFAB'), { ssr: false })

interface LazyWidgetsProps {
    phoneRaw?: string;
    lineUrl?: string;
}

export default function LazyWidgets({ phoneRaw, lineUrl }: LazyWidgetsProps) {
    return (
        <>
            <CookieConsent />
            <FloatingContactFAB phoneRaw={phoneRaw} lineUrl={lineUrl} />
        </>
    )
}
