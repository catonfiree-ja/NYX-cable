import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ─── Webhook Protection (Strict Secret Check for Cache Invalidation) ───
  // Prevents hackers from spamming the revalidate API to burn Vercel cache quota
  if (pathname.startsWith('/api/revalidate')) {
    const authHeader = request.headers.get('authorization')
    const secretParams = request.nextUrl.searchParams.get('secret')
    const expectedSecret = process.env.SANITY_WEBHOOK_SECRET

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}` && secretParams !== expectedSecret) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized', message: 'Invalid webhook secret' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  // ─── Security Headers (Defense in Depth at Edge) ───
  const response = NextResponse.next()

  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}

export const config = {
  matcher: [
    // Match API routes and all pages, but exclude static assets
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
}
