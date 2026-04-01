import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Sanity Webhook → On-Demand Revalidation
// Protected by SANITY_WEBHOOK_SECRET (also checked in middleware.ts)
export async function POST(request: NextRequest) {
  try {
    // Double-check secret (middleware already validates, but defense in depth)
    const secret = request.nextUrl.searchParams.get('secret')
    const authHeader = request.headers.get('authorization')
    const expectedSecret = process.env.SANITY_WEBHOOK_SECRET

    if (expectedSecret) {
      const isValidSecret = secret === expectedSecret
      const isValidBearer = authHeader === `Bearer ${expectedSecret}`
      if (!isValidSecret && !isValidBearer) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    // Parse the webhook body to determine what changed
    const body = await request.json().catch(() => ({}))
    const type = body?._type as string | undefined
    const slug = body?.slug?.current as string | undefined

    // Revalidate based on document type
    const revalidatedPaths: string[] = []

    if (type === 'product' || type === 'productVariant') {
      revalidatePath('/products')
      revalidatePath('/product/[slug]', 'page')
      if (slug) revalidatePath(`/product/${slug}`)
      revalidatedPaths.push('/products', '/product/[slug]')
    }

    if (type === 'productCategory') {
      revalidatePath('/products')
      revalidatePath('/category/[slug]', 'page')
      if (slug) revalidatePath(`/category/${slug}`)
      revalidatedPaths.push('/products', '/category/[slug]')
    }

    if (type === 'blogPost' || type === 'postCategory') {
      revalidatePath('/blog')
      revalidatePath('/blog/[slug]', 'page')
      if (slug) revalidatePath(`/blog/${slug}`)
      revalidatedPaths.push('/blog')
    }

    if (type === 'siteSettings' || type === 'homePage' || type === 'aboutPage' || type === 'contactPage') {
      revalidatePath('/', 'layout') // Revalidate all pages (layout = global)
      revalidatedPaths.push('/')
    }

    if (type === 'review') {
      revalidatePath('/reviews')
      revalidatedPaths.push('/reviews')
    }

    // If unknown type, revalidate everything
    if (revalidatedPaths.length === 0) {
      revalidatePath('/', 'layout')
      revalidatedPaths.push('all')
    }

    return NextResponse.json({
      revalidated: true,
      paths: revalidatedPaths,
      type: type || 'unknown',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
