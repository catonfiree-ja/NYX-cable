import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

// Enable Draft Mode for Sanity Visual Editing / Preview
// Usage: /api/draft?secret=YOUR_SECRET&slug=/product/ysly-jz
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const slug = request.nextUrl.searchParams.get('slug') || '/'
  const expectedSecret = process.env.SANITY_WEBHOOK_SECRET

  // Validate secret
  if (!expectedSecret || secret !== expectedSecret) {
    return new Response('Invalid secret', { status: 401 })
  }

  // Enable draft mode
  const draft = await draftMode()
  draft.enable()

  // Redirect to the previewed page
  redirect(slug)
}
