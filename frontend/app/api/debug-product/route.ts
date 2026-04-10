import { getProduct } from '@/lib/queries'
import { NextResponse } from 'next/server'

export async function GET() {
  const product = await getProduct('multicore-cable')
  
  if (!product) {
    return NextResponse.json({ error: 'Product not found' })
  }

  return NextResponse.json({
    title: product.title,
    descType: typeof product.description,
    descIsArray: Array.isArray(product.description),
    descLength: Array.isArray(product.description) ? product.description.length : 'N/A',
    firstBlockType: product.description?.[0]?._type,
    firstBlockText: product.description?.[0]?.children?.[0]?.text?.substring(0, 100),
    faqCount: product.faqItems?.length,
  })
}
