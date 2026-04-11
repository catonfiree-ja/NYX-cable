import React from 'react'
import type { Metadata } from 'next'
import { getProduct, getProducts, getVariants, getBlogPosts, getSiteSettings } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'
import { notFound } from 'next/navigation'
import VariantTable from './VariantTable'
import ExcelSpecTable from './ExcelSpecTable'
import SpecTableCollapsible from './SpecTableCollapsible'
import productSpecsData from '@/data/product-specs.json'
import { productContentMap } from '@/data/product-content'
import { BreadcrumbSchema } from '@/components/StructuredData'
// Hardcoded data removed — all product data now comes from CMS

// ISR: revalidate every 60 seconds so CMS changes appear without redeploy
export const revalidate = 60

// Slug aliases are no longer needed — CMS slugs were updated to match hardcoded slugs
const slugAliases: Record<string, string> = {}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const resolvedSlug = slugAliases[slug] || slug
  const product = await getProduct(resolvedSlug).catch(() => null)

  if (product) {
    const title = product.metaTitle || `${product.title} | สายไฟอุตสาหกรรม NYX Cable`
    const description = product.metaDescription || product.shortDescription || `${product.title} คุณภาพมาตรฐานยุโรป NYX Cable`
    const ogImage = product.ogImage ? urlFor(product.ogImage).width(1200).height(630).url() : undefined

    return {
      title,
      description,
      alternates: { canonical: `https://www.nyxcable.com/product/${slug}` },
      openGraph: {
        title,
        description,
        ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
      },
    }
  }

  return { title: 'สินค้าไม่พบ | NYX Cable' }
}

const styles = `
  /* ─── Hero ─── */
  .product-detail-hero { background: linear-gradient(160deg, #001a33 0%, #002d5c 35%, #003d7a 70%, #002244 100%); color: #fff; padding: 32px 0 48px; position: relative; overflow: hidden; }
  .product-detail-hero::before { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 400'%3E%3Ccircle cx='200' cy='200' r='200' fill='rgba(0,153,255,0.06)'/%3E%3Ccircle cx='1200' cy='100' r='150' fill='rgba(240,165,0,0.04)'/%3E%3C/svg%3E") no-repeat center; background-size: cover; }
  .product-detail-hero .container { position: relative; z-index: 1; }
  .breadcrumb { font-size: 0.82rem; margin-bottom: 20px; }
  .breadcrumb a { color: rgba(255,255,255,0.65); text-decoration: none; transition: color 0.2s; }
  .breadcrumb a:hover { color: #f0a500; }
  .hero-product-layout { display: grid; grid-template-columns: 440px 1fr; gap: 40px; align-items: start; }
  .hero-image-box { background: rgba(255,255,255,0.08); border-radius: 20px; display: flex; align-items: center; justify-content: center; padding: 24px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(4px); }
  .hero-image-box img, .hero-image-box > span { width: 100%; height: auto; object-fit: contain; border-radius: 12px; filter: drop-shadow(0 4px 20px rgba(0,0,0,0.2)); }
  .hero-image-box .fallback-text { font-size: 1.4rem; font-weight: 800; color: rgba(255,255,255,0.2); letter-spacing: 2px; text-align: center; line-height: 1.4; word-break: break-word; padding: 12px; }
  .hero-product-info h1 { font-size: 1.8rem; font-weight: 800; margin-bottom: 8px; line-height: 1.35; }
  .hero-product-code { display: inline-flex; padding: 4px 14px; background: rgba(0,153,255,0.2); color: #7dd3fc; font-size: 0.85rem; font-weight: 600; border-radius: 50px; margin-bottom: 12px; border: 1px solid rgba(0,153,255,0.3); }
  .hero-categories { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
  .hero-cat-tag { font-size: 0.72rem; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); padding: 4px 12px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); }
  .hero-desc { font-size: 0.9rem; color: rgba(255,255,255,0.75); line-height: 1.7; margin-bottom: 20px; max-width: 600px; }
  .hero-cta { display: flex; gap: 12px; flex-wrap: wrap; }
  .hero-cta .cta-btn-call { padding: 12px 28px; font-size: 0.9rem; }
  .hero-cta .cta-btn-line { padding: 12px 24px; font-size: 0.85rem; }
  .hero-cta .cta-btn-detail { padding: 12px 24px; font-size: 0.85rem; font-weight: 700; border-radius: 50px; background: linear-gradient(135deg, #f0a500, #e89400); color: #fff; text-decoration: none; display: inline-flex; align-items: center; box-shadow: 0 4px 15px rgba(240,165,0,0.3); transition: all 0.2s; }
  .hero-cta .cta-btn-detail:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(240,165,0,0.45); }
  .hero-cta a:hover { transform: translateY(-2px); }

  /* ─── Section Jump Navigation ─── */
  .section-nav { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 14px 0; position: sticky; top: 0; z-index: 80; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  .section-nav-inner { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
  .section-nav-pill { padding: 8px 20px; border-radius: 50px; font-size: 0.82rem; font-weight: 600; color: #475569; background: #f1f5f9; text-decoration: none; transition: all 0.2s; border: 1px solid transparent; white-space: nowrap; }
  .section-nav-pill:hover { background: #e0f2fe; color: #0369a1; border-color: #bae6fd; }

  /* ─── Content Sections ─── */
  .product-content { padding-bottom: 80px; }
  .section-block { padding: 40px 0; }
  .section-block:nth-child(odd) { background: #fff; }
  .section-block:nth-child(even) { background: #f8fafc; }
  .section-block-title { font-size: 1.2rem; font-weight: 700; color: #003366; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #f0a500; display: inline-block; }

  /* ─── Spec Card ─── */
  .spec-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); max-width: 640px; }
  .spec-card-title { font-size: 1rem; font-weight: 700; color: #003366; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #f0a500; display: inline-block; }
  .spec-list { list-style: none; margin: 0; padding: 0; }
  .spec-list li { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 0.88rem; }
  .spec-list li:last-child { border-bottom: none; }
  .spec-list .label { color: #64748b; }
  .spec-list .value { font-weight: 600; color: #003366; }

  /* ─── Description ─── */
  .product-full-desc { background: #f8fafc; border-radius: 16px; padding: 28px; border: 1px solid #e2e8f0; }
  .product-full-desc h2, .product-full-desc h3 { color: #003366; font-weight: 700; margin: 24px 0 10px; font-size: 1.1rem; }
  .product-full-desc h2:first-child, .product-full-desc h3:first-child { margin-top: 0; }
  .product-full-desc p { color: #475569; line-height: 1.85; margin-bottom: 14px; font-size: 0.9rem; max-width: 800px; }
  .product-full-desc ul { margin: 8px 0 16px 24px; color: #475569; line-height: 1.85; }
  .product-full-desc li { margin-bottom: 6px; }
  .product-full-desc a { color: #f0a500; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; transition: color 0.2s; }
  .product-full-desc a:hover { color: #d4940a; }
  .product-full-desc strong, .product-full-desc b { color: #1e293b; font-weight: 700; }
  .product-full-desc table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin: 20px 0; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0; }
  .product-full-desc table th { background: #003366; color: #fff; padding: 10px 14px; text-align: left; font-weight: 600; }
  .product-full-desc table td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #334155; }
  .product-full-desc table tr:nth-child(even) td { background: #f8fafc; }

  /* ─── Variants ─── */
  .product-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; }
  .variants-section { padding: 32px 0; }
  .variants-section h2 { font-size: 1.4rem; font-weight: 700; color: #003366; margin-bottom: 20px; }
  .variants-table { width: 100%; border-collapse: collapse; font-size: var(--font-size-sm); background: var(--color-white); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md); }
  .variants-table th { background: var(--color-primary); color: var(--color-white); padding: 0.75rem 1rem; text-align: left; font-weight: 500; }
  .variants-table td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--color-gray-100); color: var(--color-gray-700); }
  .variants-table tr:hover td { background: rgba(0,153,255,0.04); }
  .stock-badge { display: inline-flex; padding: 2px 10px; border-radius: var(--radius-full); font-size: var(--font-size-xs); font-weight: 600; }
  .stock-in { background: rgba(16,185,129,0.1); color: var(--color-success); }
  .stock-out { background: rgba(239,68,68,0.1); color: var(--color-danger); }

  /* ─── Related Products ─── */
  .related-products { padding: 32px 0; }
  .related-products h2 { font-size: 1.2rem; font-weight: 700; color: var(--color-primary); margin-bottom: 16px; }
  .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
  .related-card { display: block; padding: 16px; background: var(--color-white); border: 1px solid var(--color-gray-200); border-radius: 12px; text-decoration: none; transition: all 0.2s; }
  .related-card:hover { border-color: var(--color-secondary); box-shadow: 0 4px 16px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .related-card h3 { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-primary); }

  /* ─── Blogs & Other Products ─── */
  .related-blogs { padding: 48px 0; background: linear-gradient(180deg, #f0f7ff, #fff); }
  .related-blogs h2 { font-size: 1.2rem; font-weight: 700; color: var(--color-primary); margin-bottom: 20px; text-align: center; }
  .blogs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .blog-card-link { display: block; text-decoration: none; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; background: #fff; transition: all 0.25s; }
  .blog-card-link:hover { border-color: #2563eb; box-shadow: 0 4px 16px rgba(37,99,235,0.1); transform: translateY(-2px); }
  .blog-card-link .bc-title { font-size: 0.95rem; font-weight: 700; color: #1a3c6e; line-height: 1.4; margin-bottom: 6px; }
  .blog-card-link .bc-excerpt { font-size: 0.8rem; color: #64748b; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .blog-card-link .bc-date { font-size: 0.7rem; color: #475569; margin-top: 8px; }
  .other-products { padding: 48px 0; background: #fff; }
  .other-products h2 { font-size: 1.2rem; font-weight: 700; color: var(--color-primary); margin-bottom: 20px; text-align: center; }
  .op-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
  .op-card { display: flex; flex-direction: column; align-items: center; justify-content: center; text-decoration: none; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px 24px; text-align: center; background: #fff; transition: all 0.25s; min-height: 100px; }
  .op-card:hover { border-color: #2563eb; box-shadow: 0 4px 16px rgba(37,99,235,0.1); transform: translateY(-2px); }
  .op-card .op-code { font-size: 0.7rem; color: #475569; letter-spacing: 0.5px; margin-bottom: 6px; }
  .op-card .op-name { font-size: 0.88rem; font-weight: 700; color: #1a3c6e; line-height: 1.5; text-wrap: balance; }

  /* ─── CTA Buttons ─── */
  .cta-btn-call { display: inline-flex; align-items: center; gap: 8px; padding: 14px 36px; background: linear-gradient(135deg, #1a3c6e, #2563eb); color: #fff; border-radius: 50px; font-weight: 700; font-size: 1rem; text-decoration: none; box-shadow: 0 4px 14px rgba(37,99,235,0.25); transition: all 0.25s; }
  .cta-btn-call:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37,99,235,0.35); color: #fff; }
  .cta-btn-line { display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; background: linear-gradient(135deg, #06c755, #00b843); color: #fff; border-radius: 50px; font-weight: 700; font-size: 0.95rem; text-decoration: none; box-shadow: 0 4px 14px rgba(6,199,85,0.25); transition: all 0.25s; }
  .cta-btn-line:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(6,199,85,0.35); color: #fff; }

  /* ─── Quick Quote Floating Bar ─── */
  .quick-quote-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 90; background: linear-gradient(160deg, #001a33, #003366); border-top: 2px solid rgba(251,176,59,0.4); padding: 12px 0; box-shadow: 0 -4px 20px rgba(0,0,0,0.15); backdrop-filter: blur(12px); }
  .quick-quote-inner { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .quick-quote-info { display: flex; align-items: center; gap: 12px; color: #fff; min-width: 0; }
  .quick-quote-badge { font-size: 0.65rem; font-weight: 800; color: #fbb03b; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(251,176,59,0.3); border-radius: 8px; background: rgba(251,176,59,0.08); flex-shrink: 0; letter-spacing: 0.5px; }
  .quick-quote-name { font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .quick-quote-code { font-size: 0.7rem; opacity: 0.5; }
  .quick-quote-actions { display: flex; gap: 10px; flex-shrink: 0; }
  .quick-quote-actions .btn { font-size: 0.82rem; padding: 8px 20px; border-radius: 8px; font-weight: 700; white-space: nowrap; }

  /* ─── Spec Table (from Sanity specTable) ─── */
  .spec-table-wrap { margin: 24px 0; }
  .spec-table-caption { font-size: 1.05rem; font-weight: 700; color: #003366; margin-bottom: 12px; }
  .spec-table-container { position: relative; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
  .spec-table--compact { width: 100%; border-collapse: collapse; font-size: 0.75rem; table-layout: fixed; }
  .spec-table--compact thead { background: linear-gradient(135deg, #003366, #004a8f); color: #fff; position: sticky; top: 0; z-index: 2; }
  .spec-table--compact th { padding: 8px 6px; text-align: center; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.1); white-space: normal; word-break: break-word; line-height: 1.3; font-size: 0.68rem; }
  .spec-table--compact th:last-child { border-right: none; }
  .spec-table--compact td { padding: 6px 5px; text-align: center; border-bottom: 1px solid #f0f4f8; border-right: 1px solid #f0f4f8; color: #334155; white-space: nowrap; font-size: 0.75rem; }
  .spec-table--compact td:last-child { border-right: none; font-weight: 600; color: #003366; }
  .spec-table--compact tbody tr:nth-child(even) { background: #f8fafc; }
  .spec-table--compact tbody tr:hover { background: #eef4ff; }
  /* Fade overlay */
  .spec-table-fade { position: absolute; bottom: 0; left: 0; right: 0; height: 80px; background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.95)); pointer-events: none; z-index: 1; }
  /* Toggle button */
  .spec-table-toggle { display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 12px 0; margin-top: -1px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; background: #f8fafc; color: #003366; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: background 0.2s, color 0.2s; }
  .spec-table-toggle:hover { background: #eef4ff; color: #004a8f; }
  .spec-table-toggle-icon { transition: transform 0.3s ease; }
  .spec-table-toggle-icon.expanded { transform: rotate(180deg); }
  /* Legacy scroll wrapper (kept for backward compat) */
  .spec-table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; border: 1px solid #e2e8f0; border-radius: 12px; }
  .spec-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; white-space: nowrap; }
  .spec-table thead { background: linear-gradient(135deg, #003366, #004a8f); color: #fff; }
  .spec-table th { padding: 10px 14px; text-align: center; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.1); }
  .spec-table th:last-child { border-right: none; }
  .spec-table td { padding: 8px 14px; text-align: center; border-bottom: 1px solid #f0f4f8; border-right: 1px solid #f0f4f8; color: #334155; }
  .spec-table td:last-child { border-right: none; }
  .spec-table tbody tr:nth-child(even) { background: #f8fafc; }
  .spec-table tbody tr:hover { background: #eef4ff; }
  @media (max-width: 640px) {
    .spec-table--compact th { font-size: 0.6rem; padding: 6px 3px; }
    .spec-table--compact td { font-size: 0.68rem; padding: 5px 3px; }
  }

  /* ─── Description Bullet List ─── */
  .desc-bullet-list { margin: 8px 0 16px 24px; color: #475569; line-height: 1.85; font-size: 0.9rem; list-style: disc; }
  .desc-bullet-list li { margin-bottom: 6px; }

  /* ─── Responsive ─── */
  @media (max-width: 900px) {
    .hero-product-layout { grid-template-columns: 1fr; gap: 24px; }
    .hero-image-box { max-width: 320px; margin: 0 auto; min-height: 200px; }
    .section-nav-inner { justify-content: flex-start; overflow-x: auto; -webkit-overflow-scrolling: touch; flex-wrap: nowrap; padding: 0 1rem; }
  }
  @media (max-width: 768px) {
    .hero-product-info h1 { font-size: 1.3rem; }
    .hero-desc { font-size: 0.85rem; }
    .hero-cta { flex-direction: column; }
    .hero-cta .cta-btn-call, .hero-cta .cta-btn-line, .hero-cta .cta-btn-detail { width: 100%; justify-content: center; min-height: 48px; font-size: 0.88rem; }
    .variants-table { display: block; overflow-x: auto; }
    .quick-quote-bar { max-width: 100vw; overflow: hidden; }
    .quick-quote-inner { flex-direction: column; gap: 8px; }
    .quick-quote-info { width: 100%; }
    .quick-quote-name { font-size: 0.78rem; }
    .quick-quote-actions { width: 100%; }
    .quick-quote-actions .btn { flex: 1; text-align: center; padding: 10px 12px; font-size: 0.78rem; min-height: 44px; }
    .blogs-grid { grid-template-columns: 1fr !important; gap: 12px; }
    .blog-card-link { padding: 14px; }
    .blog-card-link .bc-title { font-size: 0.85rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .blog-card-link .bc-excerpt { font-size: 0.75rem; -webkit-line-clamp: 2; }
    .op-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px; }
    .op-card { padding: 14px 10px; min-height: auto; }
    .op-card .op-name { font-size: 0.75rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .op-card .op-code { font-size: 0.6rem; margin-bottom: 4px; }
    .related-grid { grid-template-columns: 1fr !important; }
    .product-full-desc { padding: 18px; }
    .spec-card { padding: 16px; }
    .section-block { padding: 28px 0; }
    .section-nav-inner { gap: 4px; }
    .section-nav-pill { padding: 6px 14px; font-size: 0.75rem; min-height: 36px; }
    .hero-product-code { font-size: 0.75rem; padding: 3px 10px; }
    .hero-cat-tag { font-size: 0.65rem; }
    .breadcrumb { font-size: 0.75rem; margin-bottom: 14px; }
  }

  /* ─── Hardcoded Content Sections ─── */
  .hc-section { margin-bottom: 28px; }
  .hc-section h3 { font-size: 1.05rem; font-weight: 700; color: #003366; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; }
  .hc-section p { color: #475569; line-height: 1.85; margin-bottom: 12px; font-size: 0.9rem; }
  .hc-section ul, .hc-section ol { margin: 8px 0 16px 24px; color: #475569; line-height: 1.85; font-size: 0.9rem; }
  .hc-section li { margin-bottom: 8px; }
  .hc-section strong { color: #1e293b; }
  .hc-section a { color: #f0a500; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
  .hc-section a:hover { color: #d4940a; }

  /* ─── FAQ Accordion ─── */
  .faq-section { margin-top: 0; }
  .faq-item { border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 10px; overflow: hidden; background: #fff; }
  .faq-item summary { padding: 14px 20px; font-size: 0.92rem; font-weight: 600; color: #003366; cursor: pointer; list-style: none; display: flex; align-items: center; gap: 10px; transition: background 0.2s; }
  .faq-item summary:hover { background: #f0f7ff; }
  .faq-item summary::before { content: '▸'; font-size: 0.8rem; color: #f0a500; transition: transform 0.2s; }
  .faq-item[open] summary::before { transform: rotate(90deg); }
  .faq-item .faq-answer { padding: 0 20px 14px; font-size: 0.88rem; color: #475569; line-height: 1.75; }
  @media (max-width: 768px) {
    .faq-item summary { font-size: 0.85rem; padding: 12px 14px; }
    .faq-item .faq-answer { padding: 0 14px 12px; font-size: 0.82rem; }
    .hc-section h3 { font-size: 0.95rem; }
    .hc-section p, .hc-section ul, .hc-section ol { font-size: 0.84rem; line-height: 1.75; }
    .hc-section ul, .hc-section ol { margin-left: 18px; }
  }
  @media (max-width: 480px) {
    .op-grid { grid-template-columns: 1fr !important; }
    .quick-quote-name { font-size: 0.72rem; }
    .quick-quote-badge { width: 30px; height: 30px; font-size: 0.55rem; }
  }
  /* ── Product CTA Block ── */
  .product-cta-block { background: linear-gradient(135deg, #003366 0%, #1a4f8a 100%); padding: 40px 0; margin-top: 8px; }
  .product-cta-inner { text-align: center; color: #fff; }
  .product-cta-inner h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 12px; color: #fff; }
  .product-cta-inner p { font-size: 0.92rem; line-height: 1.7; color: rgba(255,255,255,0.9); margin-bottom: 20px; max-width: 700px; margin-left: auto; margin-right: auto; }
  .product-cta-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .product-cta-buttons a { display: inline-flex; align-items: center; gap: 6px; padding: 12px 28px; border-radius: 50px; font-weight: 700; font-size: 0.9rem; text-decoration: none !important; transition: all 0.2s; }
  .cta-phone-btn { background: #003366; color: #fff !important; }
  .cta-phone-btn:hover { background: #004a8f; transform: translateY(-1px); }
  .cta-line-btn { background: #06c755; color: #fff !important; }
  .cta-line-btn:hover { background: #05b04a; transform: translateY(-1px); }
  @media (max-width: 640px) {
    .product-cta-inner h3 { font-size: 1rem; }
    .product-cta-inner p { font-size: 0.85rem; }
    .product-cta-buttons a { padding: 10px 22px; font-size: 0.85rem; }
  }
`

// HTML tag names filter for WordPress-imported content
const HTML_TAG_NAMES = new Set([
  'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'ul', 'ol', 'li', 'table', 'thead',
  'tbody', 'tr', 'th', 'td', 'span', 'strong', 'em',
  'a', 'br', 'hr', 'img', 'figure', 'figcaption',
  'section', 'article', 'header', 'footer', 'nav',
  'pre', 'code', 'sup', 'sub', 'b', 'i', 'u',
])

function decodeHtmlEntities(text: string) {
  if (!text) return ''
  return text
    .replace(/&#8230;/g, '…')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\[&#8230;\]/g, '…')
    .replace(/\[…\]/g, '…')
}

// Build a map of product names/codes → slug for auto-linking
type ProductLinkMap = { pattern: string; slug: string; label: string; prefix: string }[]

function buildProductLinkMap(products: any[], variants?: any[]): ProductLinkMap {
  const map: ProductLinkMap = []
  const addedPatterns = new Set<string>()
  
  const addPattern = (pattern: string, slug: string, prefix: string) => {
    if (pattern.length < 3 || addedPatterns.has(pattern.toLowerCase())) return
    addedPatterns.add(pattern.toLowerCase())
    map.push({ pattern, slug, label: pattern, prefix })
  }
  
  for (const p of products) {
    const slug = p.slug?.current
    if (!slug) continue
    
    // 1. productCode exact match (e.g., "YSLY-JZ", "H05V-K")
    if (p.productCode && p.productCode.length > 2) {
      addPattern(p.productCode, slug, '/product/')
    }
    
    // 2. Title before colon (e.g., "Olflex Classic 110" from "Olflex Classic 110 : สายคอนโทรล")
    if (p.title) {
      const beforeColon = p.title.split(/\s*[:\-–—]\s*/)[0].trim()
      if (beforeColon.length > 3 && beforeColon.length < 40 && /[A-Za-z]/.test(beforeColon)) {
        addPattern(beforeColon, slug, '/product/')
      }
    }
    
    // 3. Thai name patterns - "สาย{CODE}", "สายคอนโทรล {CODE}"  
    if (p.productCode && p.productCode.length > 2) {
      addPattern(`สาย ${p.productCode}`, slug, '/product/')
      addPattern(`สายคอนโทรล ${p.productCode}`, slug, '/product/')
    }
  }
  
  // Add variant models (e.g., "YSLY-JZ 3G0.5")
  if (variants) {
    for (const v of variants) {
      const slug = v.slug?.current
      if (!slug) continue
      if (v.model && v.model.length > 3) {
        addPattern(v.model, slug, '/product/variant/')
      }
    }
  }
  
  // Sort by pattern length descending so longer patterns match first
  map.sort((a, b) => b.pattern.length - a.pattern.length)
  return map
}

// Auto-link product codes in text content
function autoLinkText(text: string, linkMap: ProductLinkMap, currentSlug: string): React.ReactNode {
  if (!text || linkMap.length === 0) return text

  const parts: React.ReactNode[] = []
  let remaining = text
  let keyIdx = 0

  while (remaining.length > 0) {
    let bestMatch: { index: number; pattern: string; slug: string; label: string; prefix: string } | null = null

    for (const entry of linkMap) {
      // Skip self-linking
      if (entry.slug === currentSlug) continue
      const idx = remaining.indexOf(entry.pattern)
      if (idx >= 0 && (bestMatch === null || idx < bestMatch.index || (idx === bestMatch.index && entry.pattern.length > bestMatch.pattern.length))) {
        bestMatch = { index: idx, ...entry }
      }
    }

    if (!bestMatch) {
      parts.push(remaining)
      break
    }

    // Add text before the match
    if (bestMatch.index > 0) {
      parts.push(remaining.substring(0, bestMatch.index))
    }

    // Add the linked product/variant
    parts.push(
      <a key={`al-${keyIdx++}`} href={`${bestMatch.prefix}${bestMatch.slug}`}
        style={{ color: '#f0a500', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 600 }}>
        {bestMatch.pattern}
      </a>
    )

    remaining = remaining.substring(bestMatch.index + bestMatch.pattern.length)
  }

  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : <>{parts}</>
}

// Rewrite old WordPress URLs to new Next.js routes
// WordPress slugs use periods (e.g. ysly-jz-3g0.5) but Sanity uses hyphens (ysly-jz-3g0-5)
function normalizeSlug(slug: string): string {
  return slug.replace(/\./g, '-').replace(/%20/g, '').trim()
}

function rewriteLinks(html: string): string {
  return html
    // /product/slug → /product/slug
    .replace(/https?:\/\/nyxcable\.com\/product\/([^/"'\s]+)\/?/g, (_, s) => `/product/${normalizeSlug(s)}`)
    // /cat/slug → /products
    .replace(/https?:\/\/nyxcable\.com\/cat\/[^/"'\s]+\/?/g, '/products')
    // /shop/slug → /products
    .replace(/https?:\/\/nyxcable\.com\/shop\/[^/"'\s]+\/?/g, '/products')
    // /สายคอนโทรล/variant-slug → /products/variant/variant-slug (normalize periods to hyphens)
    .replace(/https?:\/\/nyxcable\.com\/%E0%B8%AA%E0%B8%B2%E0%B8%A2%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%82%E0%B8%97%E0%B8%A3%E0%B8%A5\/([^/"'\s]+)\/?/g, (_, s) => `/product/variant/${normalizeSlug(s)}`)
    // Any remaining nyxcable.com links → homepage
    .replace(/https?:\/\/nyxcable\.com\/?/g, '/')
}

function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'h5', 'span', 'div', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'figure', 'figcaption', 'blockquote', 'pre', 'code', 'sub', 'sup'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'width', 'height', 'style', 'class', 'id', 'colspan', 'rowspan'],
  })
}

function renderDescription(body: any, shortDesc?: string, productTitle?: string, linkMap?: ProductLinkMap, currentSlug?: string) {
  if (!body) return null
  if (typeof body === 'string') {
    // If it's the same as shortDescription, skip
    if (shortDesc && body.includes(shortDesc.substring(0, 50))) return null
    return <div className="product-full-desc" dangerouslySetInnerHTML={{ __html: sanitizeHtml(rewriteLinks(body)) }} />
  }
  if (!Array.isArray(body)) return null

  // Extract significant words from product title for fuzzy matching
  const titleWords = productTitle
    ? productTitle.replace(/[:\-–—|\/]/g, ' ').split(/\s+/).filter(w => w.length >= 3)
    : []

  // Track seen texts to remove duplicates
  const seenTexts = new Set<string>()

  // If body contains specTable blocks, it's curated CMS content — skip aggressive filtering
  const hasSpecTable = body.some((b: any) => b._type === 'specTable')

  // WHITELIST approach: only keep blocks that are meaningful paragraphs
  // This handles all WordPress table remnants (broken cells, labels, repeated titles)
  // Skip filtering for curated content (contains specTable)
  const cleanBlocks = hasSpecTable ? body.filter((block: any) => {
    if (block._type !== 'block') return true
    const children = block.children || []
    const fullText = children.map((c: any) => c.text || '').join('').trim()
    return fullText.length > 0
  }) : body.filter((block: any) => {
    if (block._type !== 'block') return true
    const children = block.children || []

    // Multi-child blocks (mixed formatting) — check combined text
    const fullText = children.map((c: any) => c.text || '').join('').trim()
    if (!fullText) return false

    const lower = fullText.toLowerCase()

    // Filter WordPress HTML tag names (single-word remnants like 'div', 'p', 'table')
    if (HTML_TAG_NAMES.has(lower)) return false

    // Filter duplicate text
    if (seenTexts.has(lower)) return false
    seenTexts.add(lower)

    // Filter variant model link lines (e.g., "สายคอนโทรล YSLY-JZ 3G0.5")
    // These are already in the Excel spec table
    if (/^สาย\S*\s+YSLY/i.test(fullText) && fullText.length < 80) return false
    if (/^YSLY-[A-Z]+\s+\d+/i.test(fullText) && fullText.length < 60) return false

    // Filter short technical table remnant patterns (< 60 chars)
    if (fullText.length < 60) {
      // Table header/value patterns from WordPress comparison tables
      const tablePatterns = [
        /conductor/i, /resistance/i, /strand/i, /ohm\/km/i,
        /cross\s*section/i, /current\s*rat/i, /bending\s*radius/i,
        /weight\s*kg/i, /o\.?d\.?\s*mm/i, /outer\s*dia/i,
        /core\s*x\s*conductor/i, /power\s*rating/i, /voltage/i,
        /@\s*\d+\.?\d*mm/i, /@\s*\d+oC/i,
        /bare\s*copper/i, /number\s*core/i,
        /คะแนน/i,  // scoring labels
      ]
      if (tablePatterns.some(p => p.test(fullText))) return false

      // Short blocks that are just adjectives/comparisons from table values
      const comparisonPatterns = [
        /^(อ่อนตัว|แข็ง|เล็ก|ใหญ่|สูง|ต่ำ|มาก|น้อย)/,
        /กว่า\s*$/,  // ends with "กว่า" (comparative)
        /ประหยัด.*%/,  // percentage comparisons
        /มีจำนวน.*กว่า/,
        /มีขนาด.*กว่า/,
        /รับ(อุณหภูมิ|แรงดัน|กระแส).*กว่า/,
      ]
      if (comparisonPatterns.some(p => p.test(fullText))) return false
    }

    // Keep text that is meaningful (> 15 chars, or Thai text > 10 chars)
    const hasThai = /[\u0E00-\u0E7F]/.test(fullText)
    const isRealContent = fullText.length > 15
    const isThaiContent = hasThai && fullText.length > 10

    if (!isRealContent && !isThaiContent) return false

    return true
  })

  // Limit to max 200 blocks to allow full product descriptions
  const limitedBlocks = cleanBlocks.slice(0, 200)

  // Render a single block element
  const renderBlock = (block: any, i: number) => {
    // Build markDefs lookup for links
    const markDefs = (block.markDefs || []).reduce((acc: any, def: any) => {
      acc[def._key] = def
      return acc
    }, {} as Record<string, any>)

    const children = (block.children || []).map((child: any, j: number) => {
      const decoded = decodeHtmlEntities(child.text || '')

      // Check for link marks first (from Portable Text markDefs)
      const linkMark = child.marks?.find((m: string) => markDefs[m]?.href)
      if (linkMark) {
        const href = rewriteLinks(markDefs[linkMark].href)
        return <a key={j} href={href} style={{ color: '#f0a500', fontWeight: 700, textDecoration: 'underline' }}>{decoded}</a>
      }

      // Apply auto-linking for product codes
      let content: React.ReactNode = linkMap && currentSlug ? autoLinkText(decoded, linkMap, currentSlug) : decoded

      if (child.marks?.includes('strong')) {
        return <strong key={j}>{content}</strong>
      } else if (child.marks?.includes('em')) {
        return <em key={j}>{content}</em>
      }
      return <span key={j}>{content}</span>
    })
    const textContent = (block.children || []).map((c: any) => c.text || '').join('')
    if (!textContent.trim()) return null

    // Skip blocks that partially match shortDescription (fuzzy dedup)
    // Skip this for curated content that has specTable
    if (!hasSpecTable && shortDesc && shortDesc.length > 20) {
      const shortPrefix = shortDesc.substring(0, 30).replace(/[^\u0E00-\u0E7Fa-zA-Z0-9]/g, '')
      const blockPrefix = textContent.substring(0, 30).replace(/[^\u0E00-\u0E7Fa-zA-Z0-9]/g, '')
      if (shortPrefix === blockPrefix) return null
    }

    switch (block.style) {
      case 'h2': return <h2 key={i}>{children}</h2>
      case 'h3': return <h3 key={i}>{children}</h3>
      case 'h4': return <h4 key={i}>{children}</h4>
      default: return <p key={i}>{children}</p>
    }
  }

  // Group blocks into elements, merging consecutive bullet items into <ul>
  const elements: React.ReactNode[] = []
  let currentBulletItems: React.ReactNode[] = []

  const flushBullets = () => {
    if (currentBulletItems.length > 0) {
      elements.push(<ul key={`ul-${elements.length}`} className="desc-bullet-list">{currentBulletItems}</ul>)
      currentBulletItems = []
    }
  }

  limitedBlocks.forEach((block: any, i: number) => {
    // Handle specTable type
    if (block._type === 'specTable') {
      flushBullets()
      const headers = block.headers || []
      const rows = block.rows || []
      if (headers.length === 0 && rows.length === 0) return
      elements.push(
        <SpecTableCollapsible
          key={i}
          caption={block.caption}
          headers={headers}
          rows={rows}
          initialRows={15}
        />
      )
      return
    }

    // Handle image type
    if (block._type === 'image' && block.asset?._ref) {
      flushBullets()
      const ref = block.asset._ref
      // Convert Sanity image ref to URL: image-{id}-{dimensions}-{format}
      const match = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/)
      if (match) {
        const [, id, dims, format] = match
        const url = `https://cdn.sanity.io/images/30wikoy9/production/${id}-${dims}.${format}`
        elements.push(
          <div key={i} style={{ margin: '24px 0', borderRadius: '12px', overflow: 'hidden' }}>
            <img
              src={url}
              alt={block.alt || ''}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              loading="lazy"
            />
          </div>
        )
      }
      return
    }

    if (block._type !== 'block') return

    // Check if it's a bullet list item
    if (block.listItem === 'bullet') {
      const rendered = renderBlock(block, i)
      if (rendered) {
        const textContent = (block.children || []).map((c: any) => c.text || '').join('')
        currentBulletItems.push(<li key={i}>{textContent}</li>)
      }
      return
    }

    // Not a bullet — flush any pending bullets, then render normally
    flushBullets()
    const rendered = renderBlock(block, i)
    if (rendered) elements.push(rendered)
  })
  flushBullets() // flush any remaining bullets

  if (elements.length === 0) return null
  return <div className="product-full-desc">{elements}</div>
}

export async function generateStaticParams() {
  const products = await getProducts()
  return products
    .map((p: any) => p.slug?.current)
    .filter(Boolean)
    .map((slug: string) => ({ slug }))
}


export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const settings = await getSiteSettings().catch(() => null);
  const siteInfo = {
    phone: settings?.phone || '02-111-5588',
    phoneRaw: (settings?.phone || '02-111-5588').replace(/[^0-9]/g, ''),
    email: settings?.email || 'sales@nyxcable.com',
    lineUrl: settings?.lineUrl || 'https://page.line.me/ubb9405u',
  };
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)
  // Try CMS with original slug first, then alias
  let product = await getProduct(slug)
  if (!product && slugAliases[slug]) {
    product = await getProduct(slugAliases[slug])
  }
  if (!product) notFound()

  const variants = product.variants || []
  const specs = product.specifications || []
  const categories = product.categories || []
  const relatedProducts = product.relatedProducts || []

  // Build auto-link map from all products + ALL variants (parentProduct refs not set in Sanity)
  const [allProducts, allVariants, blogPosts] = await Promise.all([getProducts(), getVariants(), getBlogPosts()])
  const linkMap = buildProductLinkMap(allProducts, allVariants)
  const relatedArticles = blogPosts.slice(0, 3)

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'หน้าแรก', url: 'https://www.nyxcable.com' },
        { name: 'ผลิตภัณฑ์', url: 'https://www.nyxcable.com/products' },
        { name: product.title, url: `https://www.nyxcable.com/product/${slug}` },
      ]} />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="product-detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">หน้าแรก</Link> › <Link href="/products">ผลิตภัณฑ์</Link> › {product.title}
          </div>
          <div className="hero-product-layout">
            <div className="hero-image-box">
              {product.images?.[0] ? (
                <Image src={urlFor(product.images[0]).width(800).height(750).url()} alt={product.title} width={800} height={750} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} priority />
              ) : <span className="fallback-text">{product.productCode || 'NYX'}</span>}
            </div>
            <div className="hero-product-info">
              <h1>{product.title}</h1>
              {product.productCode && <span className="hero-product-code">{product.productCode}</span>}
              {categories.length > 0 && (
                <div className="hero-categories">
                  {categories.map((c: any) => (
                    <span key={c._id} className="hero-cat-tag">{c.title}</span>
                  ))}
                </div>
              )}
              {product.shortDescription && !productContentMap[slug] && <p className="hero-desc">{decodeHtmlEntities(product.shortDescription)}</p>}
              <div className="hero-cta">
                <a href={`tel:${siteInfo.phoneRaw}`} className="cta-btn-call">สอบถามราคา</a>
                <a href={`${siteInfo.lineUrl}?text=${encodeURIComponent(`สนใจสินค้า: ${product.title}${product.productCode ? ` (${product.productCode})` : ''} — ขอใบเสนอราคา`)}`} target="_blank" rel="noopener noreferrer" className="cta-btn-line">แอด LINE</a>
                {(() => {
                  const detailLinks: Record<string, { href: string; label: string }> = {
                    'control-cable': { href: '/product/ysly-jz', label: 'ดูสเปก YSLY-JZ' },
                    'multicore-cable': { href: '/product/ysly-jz', label: 'ดูสเปก YSLY-JZ' },
                    'opvc-jz': { href: '/product/ysly-jz', label: 'เทียบสเปก YSLY-JZ' },
                    'jz-500': { href: '/product/ysly-jz', label: 'เทียบสเปก YSLY-JZ' },
                    'olflex-classic-110': { href: '/product/ysly-jz', label: 'เทียบสเปก YSLY-JZ' },
                    'flex-jz': { href: '/product/ysly-jz', label: 'เทียบสเปก YSLY-JZ' },
                    'h05v-k': { href: '/product/h07v-k', label: 'ดู H07V-K (750V)' },
                    'h07v-k': { href: '/product/h05v-k', label: 'ดู H05V-K (500V)' },
                    'vct': { href: '/product/control-cable', label: 'ดูสายคอนโทรลทั้งหมด' },
                    'cvv': { href: '/product/vct', label: 'เทียบสเปก VCT' },
                    'liycy': { href: '/product/liycy-jz', label: 'ดู LiYCY-JZ' },
                    'liycy-jz': { href: '/product/liycy', label: 'ดู LiYCY' },
                    'ysly-jz-1kv': { href: '/product/ysly-jz', label: 'ดู YSLY-JZ (500V)' },
                    'olflex-classic-115-cy': { href: '/product/liycy', label: 'เทียบสเปก LiYCY' },
                  }
                  const link = detailLinks[slug]
                  if (!link) return null
                  return <a href={link.href} className="cta-btn-detail">{link.label}</a>
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Section Jump Navigation ─── */}
      <nav className="section-nav">
        <div className="container">
          <div className="section-nav-inner">
            {(product.voltageRating || product.temperatureRange || product.standards || specs.length > 0) && <a href="#specs" className="section-nav-pill">ข้อมูลเทคนิค</a>}
            {(productSpecsData as any)[slug] && <a href="#spec-table" className="section-nav-pill">ตารางสเปค</a>}
            {!productContentMap[slug] && (product.description || product.shortDescription) && <a href="#description" className="section-nav-pill">รายละเอียด</a>}
            {variants.length > 0 && !(productSpecsData as any)[slug] && <a href="#variants" className="section-nav-pill">ขนาดสินค้า</a>}
            {relatedProducts.length > 0 && <a href="#related" className="section-nav-pill">สินค้าที่เกี่ยวข้อง</a>}
            {productContentMap[slug]?.faqs && <a href="#faqs" className="section-nav-pill">FAQs</a>}
            {!productContentMap[slug]?.faqs && product.faqItems?.length > 0 && <a href="#faqs" className="section-nav-pill">FAQs</a>}
            <a href="#blogs" className="section-nav-pill">บทความ</a>
          </div>
        </div>
      </nav>

      {/* ─── Content Sections (stacked full-width) ─── */}
      <div className="product-content">

        {/* ── Technical Specs Card ── */}
        {(product.voltageRating || product.temperatureRange || product.standards || specs.length > 0) && (
          <div className="section-block" id="specs">
            <div className="container">
              <div className="section-block-title">ข้อมูลทางเทคนิค</div>
              <div className="spec-card">
                <ul className="spec-list">
                  {product.voltageRating && <li><span className="label">แรงดันใช้งาน</span><span className="value">{product.voltageRating}</span></li>}
                  {product.temperatureRange && <li><span className="label">ช่วงอุณหภูมิ</span><span className="value">{product.temperatureRange}</span></li>}
                  {product.standards && <li><span className="label">มาตรฐาน</span><span className="value">{product.standards}</span></li>}
                  {specs.map((s: any, i: number) => (
                    <li key={i}><span className="label">{s.key}</span><span className="value">{s.value}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── Excel Product Spec Table (full-width) ── */}
        {(() => {
          const specData = (productSpecsData as any)[slug]
          if (!specData) return null
          return (
            <div className="section-block" id="spec-table">
              <div className="container">
                <ExcelSpecTable slug={slug} data={specData} />
              </div>
            </div>
          )
        })()}

        {/* ── Full Description (skip if hardcoded content exists) ── */}
        {!productContentMap[slug] && (product.description || product.shortDescription) && (
          <div className="section-block" id="description">
            <div className="container">
              <div className="section-block-title">รายละเอียดสินค้า</div>
              {renderDescription(product.description, product.shortDescription, product.title, linkMap, slug)}
            </div>
          </div>
        )}

        {/* ── Hardcoded Content Sections (from original site) ── */}
        {(() => {
          const hcData = productContentMap[slug]
          if (!hcData) return null
          return (
            <>
              {hcData.sections.map((section) => (
                <div className="section-block" key={section.id} id={section.id}>
                  <div className="container">
                    <div className="hc-section">
                      <h3>{section.title}</h3>
                      {section.content}
                    </div>
                  </div>
                </div>
              ))}
              {hcData.faqs && hcData.faqs.length > 0 && (
                <div className="section-block" id="faqs">
                  <div className="container">
                    <div className="section-block-title">คำถามที่พบบ่อย (FAQs)</div>
                    <div className="faq-section">
                      {hcData.faqs.map((faq, idx) => (
                        <details key={idx} className="faq-item">
                          <summary>{faq.q}</summary>
                          <div className="faq-answer">{faq.a}</div>
                        </details>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )
        })()}

        {/* ── CMS FAQ Items (from Sanity faqItems field) ── */}
        {!productContentMap[slug]?.faqs && product.faqItems?.length > 0 && (
          <div className="section-block" id="faqs">
            <div className="container">
              <div className="section-block-title">คำถามที่พบบ่อย (FAQs)</div>
              <div className="faq-section">
                {product.faqItems.map((faq: any, idx: number) => (
                  <details key={idx} className="faq-item">
                    <summary>{faq.question}</summary>
                    <div className="faq-answer">
                      {Array.isArray(faq.answer) ? faq.answer.map((block: any, bi: number) => {
                        const text = block.children?.map((c: any) => c.text || '').join('') || ''
                        if (!text) return null
                        if (block.listItem === 'bullet') return <li key={bi}>{text}</li>
                        return <p key={bi}>{text}</p>
                      }) : <p>{String(faq.answer)}</p>}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Variants (skip if ExcelSpecTable already shows the same data) ── */}
        {variants.length > 0 && !(productSpecsData as any)[slug] && (() => {
          const hasSpecs = variants.some((v: any) => v.cores || v.crossSection)
          const VariantName = ({ v, fallback }: { v: any, fallback?: string }) => {
            const name = v.model || v.title || fallback || 'ขนาด'
            if (v.slug?.current) return <a href={`/product/variant/${v.slug.current}`} style={{ fontWeight: 700, color: '#f0a500', textDecoration: 'underline', textUnderlineOffset: '3px' }}>{name}</a>
            return <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{name}</span>
          }
          if (hasSpecs) return <div className="section-block" id="variants"><div className="container"><VariantTable variants={variants} /></div></div>
          return (
            <div className="section-block" id="variants">
              <div className="container">
                <section className="variants-section">
                  <h2>ขนาดสินค้าที่มี ({variants.length} รุ่น)</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', marginTop: '16px' }}>
                    {variants.map((v: any, idx: number) => {
                      const name = v.model || v.title?.replace(product.title, '').trim() || `ขนาดที่ ${idx + 1}`
                      const content = (<>{name}{v.crossSection && <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>{v.crossSection} mm²</span>}</>)
                      const cardStyle = { display: 'block', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', textDecoration: 'none', color: '#1a1a2e', transition: 'all 0.2s', fontWeight: 600, fontSize: '0.85rem' } as const
                      if (v.slug?.current) return <a key={v._id} href={`/product/variant/${v.slug.current}`} style={cardStyle}>{content}</a>
                      return <div key={v._id} style={cardStyle}>{content}</div>
                    })}
                  </div>
                  <div className="cta-actions" style={{ justifyContent: 'flex-start', marginTop: '20px' }}>
                    <a href={`${siteInfo.lineUrl}?text=${encodeURIComponent(`สอบถามขนาด: ${product.title} (${variants.length} รุ่น)`)}`} className="btn btn-accent" target="_blank" rel="noopener noreferrer">สอบถามขนาดทาง LINE</a>
                    <a href={`tel:${siteInfo.phoneRaw}`} className="btn btn-primary">โทร {siteInfo.phone}</a>
                  </div>
                </section>
              </div>
            </div>
          )
        })()}

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <div className="section-block" id="related">
            <div className="container">
              <section className="related-products">
                <h2>สินค้าที่เกี่ยวข้อง</h2>
                <div className="related-grid">
                  {relatedProducts.map((rp: any) => (
                    <a key={rp._id} href={`/product/${rp.slug?.current}`} className="related-card">
                      <h3>{rp.title}</h3>
                      {rp.productCode && <span className="product-code" style={{ marginTop: '8px' }}>{rp.productCode}</span>}
                    </a>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ─── Related Blog Posts ─── */}
        {
          (async () => {
            const allBlogPosts = await getBlogPosts()
            const blogPosts = allBlogPosts.slice(0, 3)
            if (blogPosts.length === 0) return null

            // Helper: extract plain text from Portable Text or string
            const getExcerptText = (bp: any): string => {
              // If excerpt is already a string, use it
              if (typeof bp.excerpt === 'string' && bp.excerpt.trim()) return bp.excerpt.trim()
              // If excerpt is Portable Text array, extract text from any block with children
              if (Array.isArray(bp.excerpt)) {
                const text = bp.excerpt
                  .filter((b: any) => Array.isArray(b.children))
                  .map((b: any) => b.children.map((c: any) => c.text || '').join(''))
                  .join(' ')
                  .trim()
                if (text) return text
              }
              // Fallback: try body field
              if (Array.isArray(bp.body)) {
                return bp.body
                  .filter((b: any) => Array.isArray(b.children))
                  .slice(0, 2)
                  .map((b: any) => b.children.map((c: any) => c.text || '').join(''))
                  .join(' ')
                  .trim()
              }
              return ''
            }

            return (
              <section className="related-blogs" id="blogs">
                <div className="container">
                  <h2>บทความที่เกี่ยวข้อง</h2>
                  <div className="blogs-grid">
                    {blogPosts.map((bp: any) => {
                      const excerptText = getExcerptText(bp)
                      return (
                        <a key={bp._id} href={`/blog/${bp.slug?.current}`} className="blog-card-link">
                          <div className="bc-title">{bp.title}</div>
                          {excerptText && <div className="bc-excerpt">{excerptText.length > 120 ? excerptText.slice(0, 120) + '...' : excerptText}</div>}
                          {bp.publishedAt && <div className="bc-date">{new Date(bp.publishedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}</div>}
                        </a>
                      )
                    })}
                  </div>
                </div>
              </section>
            )
          })()
        }

        {/* ─── Other Products ─── */}
        {
          (async () => {
            const allProducts = await getProducts()
            const otherProducts = allProducts.filter((p: any) => p.slug?.current !== slug).slice(0, 4)
            if (otherProducts.length === 0) return null
            return (
              <section className="other-products">
                <div className="container">
                  <h2>สินค้าหมวดอื่นที่น่าสนใจ</h2>
                  <div className="op-grid">
                    {otherProducts.map((p: any) => (
                      <a key={p._id} href={`/product/${p.slug?.current}`} className="op-card">
                        {p.productCode && <div className="op-code">{p.productCode}</div>}
                        <div className="op-name">{p.title}</div>
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            )
          })()
        }
      </div>

      {/* ─── Quick Quote Floating Bar ─── */}
      <div className="quick-quote-bar">
        <div className="quick-quote-inner">
          <div className="quick-quote-info">
            <div className="quick-quote-badge">NYX</div>
            <div>
              <div className="quick-quote-name">{product.title}</div>
              {product.productCode && <div className="quick-quote-code">{product.productCode}</div>}
            </div>
          </div>
          <div className="quick-quote-actions">
            <a href={`${siteInfo.lineUrl}?text=${encodeURIComponent(`ขอใบเสนอราคา: ${product.title}${product.productCode ? ` (${product.productCode})` : ''}`)}`} className="btn btn-accent" target="_blank" rel="noopener noreferrer">ขอใบเสนอราคารุ่นนี้</a>
            <a href={`tel:${siteInfo.phoneRaw}`} className="btn btn-primary">โทรสอบถาม</a>
          </div>
        </div>
      </div>


      {/* ─── Schema.org Product + Organization JSON-LD ─── */}

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.title,
          description: product.shortDescription ? decodeHtmlEntities(product.shortDescription) : undefined,
          sku: product.productCode || undefined,
          brand: { '@type': 'Brand', name: 'NYX Cable' },
          manufacturer: { '@type': 'Organization', name: 'NYX Cable' },
          category: categories.length > 0 ? categories.map((c: any) => c.title).join(', ') : 'สายไฟอุตสาหกรรม',
          url: `https://www.nyxcable.com/product/${slug}`,
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'THB',
            availability: 'https://schema.org/InStock',
            seller: {
              '@type': 'Organization',
              name: 'NYX Cable',
              url: 'https://www.nyxcable.com',
              telephone: siteInfo.phone,
              email: siteInfo.email,
              address: { '@type': 'PostalAddress', addressLocality: 'บางนา', addressRegion: 'กรุงเทพฯ', addressCountry: 'TH' }
            }
          }
        })
      }} />
    </>
  )
}
