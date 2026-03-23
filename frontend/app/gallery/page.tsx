import type { Metadata } from 'next'
import { getGalleryAlbums } from '@/lib/queries'
import GalleryLightbox from '@/components/GalleryLightbox'

export const metadata: Metadata = {
  title: 'แกลเลอรี่ ผลงาน & การจัดส่ง | NYX Cable',
  description: 'ภาพผลงานจริงจากลูกค้าและการจัดส่งสายไฟ NYX Cable ทั่วประเทศ รูปภาพกว่า 50+ ภาพ',
  openGraph: {
    title: 'แกลเลอรี่ ผลงาน & การจัดส่ง | NYX Cable',
    description: 'ภาพผลงานจัดส่งสินค้าจริง สายไฟอุตสาหกรรม NYX Cable ถึงมือลูกค้าทั่วประเทศ',
    images: [{ url: '/images/gallery/profile.webp', width: 1200, height: 630, alt: 'NYX Cable แกลเลอรี่' }],
  },
}

const styles = `
  /* ─── Gallery Hero ─── */
  .gallery-hero {
    position: relative;
    background: linear-gradient(160deg, #001a33 0%, #002d5c 35%, #003d7a 70%, #002244 100%);
    color: #fff;
    padding: 64px 0 56px;
    text-align: center;
    overflow: hidden;
  }
  .gallery-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 400'%3E%3Ccircle cx='200' cy='200' r='200' fill='rgba(0,153,255,0.06)'/%3E%3Ccircle cx='1200' cy='100' r='150' fill='rgba(240,165,0,0.04)'/%3E%3C/svg%3E") no-repeat center;
    background-size: cover;
  }
  .gallery-hero h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 12px; position: relative; }
  .gallery-hero p { font-size: 1.05rem; opacity: 0.8; position: relative; }
  .gallery-hero .photo-count {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 16px; border-radius: 50px;
    background: rgba(240,165,0,0.15); border: 1px solid rgba(240,165,0,0.3);
    font-size: 0.82rem; font-weight: 600; color: #f0a500;
    margin-top: 16px; position: relative;
  }

  .album-breadcrumb { padding: 16px 0 8px; font-size: 0.82rem; color: #6b7280; }
  .album-breadcrumb a { color: #0066cc; text-decoration: none; font-weight: 500; }
  .album-breadcrumb a:hover { color: #003d7a; }

  /* ─── Album Grid ─── */
  .album-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 20px 0 56px; }
  .album-card { all: unset; cursor: pointer; display: block; text-align: left; }
  .album-card:hover .album-img img { transform: scale(1.05); }
  .album-card:hover .album-overlay { opacity: 1; }
  .album-img {
    aspect-ratio: 4/3; overflow: hidden; border-radius: 16px;
    background: linear-gradient(135deg, #f0f4f8, #e2e8f0);
    position: relative;
  }
  .album-img img { transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); }
  .album-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,51,102,0.6) 100%);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.3s; border-radius: 16px; z-index: 1;
    backdrop-filter: blur(2px);
  }
  .album-icon {
    color: #fff; font-size: 0.9rem; font-weight: 600;
    background: rgba(255,255,255,0.15); backdrop-filter: blur(8px);
    padding: 8px 18px; border-radius: 50px;
    border: 1px solid rgba(255,255,255,0.25);
  }
  .album-title {
    font-size: 0.95rem; font-weight: 600; color: #1a1a2e;
    margin-top: 12px; padding-bottom: 10px;
    border-bottom: 2px solid #e5e7eb;
    transition: border-color 0.2s;
  }
  .album-card:hover .album-title { border-bottom-color: #f0a500; }

  .new-badge {
    position: absolute; top: 12px; left: 12px; z-index: 2;
    background: linear-gradient(135deg, #f0a500, #d4940a);
    color: #fff; font-size: 0.7rem; font-weight: 700;
    padding: 5px 14px; border-radius: 50px; letter-spacing: 0.5px;
    box-shadow: 0 2px 8px rgba(240,165,0,0.4);
  }

  /* ─── Lightbox ─── */
  .lightbox-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 9999; display: flex; align-items: center; justify-content: center; }
  .lightbox-content { width: 95vw; max-width: 1100px; max-height: 95vh; display: flex; flex-direction: column; }
  .lightbox-header { display: flex; align-items: center; gap: 12px; padding: 12px 0; color: #fff; }
  .lightbox-header h3 { flex: 1; font-size: 1.1rem; font-weight: 500; margin: 0; }
  .lightbox-counter { font-size: 0.85rem; opacity: 0.7; }
  .lightbox-close { all: unset; cursor: pointer; font-size: 1.5rem; color: #fff; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.2s; }
  .lightbox-close:hover { background: rgba(255,255,255,0.15); }
  .lightbox-main { flex: 1; display: flex; align-items: center; position: relative; min-height: 0; }
  .lightbox-photo { flex: 1; position: relative; height: 55vh; }
  .lightbox-nav { all: unset; cursor: pointer; font-size: 2.5rem; color: #fff; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.2s; flex-shrink: 0; }
  .lightbox-nav:hover:not(:disabled) { background: rgba(255,255,255,0.15); }
  .lightbox-nav:disabled { opacity: 0.25; cursor: default; }
  .lightbox-thumbs { display: flex; gap: 6px; padding: 8px 0; overflow-x: auto; flex-wrap: nowrap; }
  .lightbox-thumb { all: unset; cursor: pointer; border: 2px solid transparent; border-radius: 6px; overflow: hidden; opacity: 0.5; transition: all 0.2s; flex-shrink: 0; }
  .lightbox-thumb.active { border-color: var(--color-secondary, #f0c040); opacity: 1; }
  .lightbox-thumb:hover { opacity: 0.8; }
  .lightbox-thumb img { display: block; width: 60px; height: 45px; object-fit: cover; }

  /* ─── Bottom CTA ─── */
  .gallery-cta {
    background: linear-gradient(135deg, #003366, #0066cc);
    color: #fff; padding: 56px 0; text-align: center;
    position: relative; overflow: hidden;
  }
  .gallery-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 50%, rgba(0,153,255,0.15), transparent 60%);
  }
  .gallery-cta h2 { font-size: 1.6rem; font-weight: 700; margin-bottom: 12px; position: relative; }
  .gallery-cta p { font-size: 0.95rem; opacity: 0.85; margin-bottom: 24px; position: relative; }
  .gallery-cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; position: relative; }
  .gallery-cta-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 32px; border-radius: 50px; font-weight: 700; font-size: 0.95rem;
    text-decoration: none; transition: all 0.25s; color: #fff;
  }
  .gallery-cta-btn.call { background: linear-gradient(135deg, #f0a500, #d48900); box-shadow: 0 4px 14px rgba(240,165,0,0.3); }
  .gallery-cta-btn.call:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(240,165,0,0.4); color: #fff; }
  .gallery-cta-btn.line { background: linear-gradient(135deg, #06c755, #04a845); box-shadow: 0 4px 14px rgba(6,199,85,0.3); }
  .gallery-cta-btn.line:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(6,199,85,0.4); color: #fff; }

  @media (max-width: 768px) {
    .gallery-hero h1 { font-size: 1.6rem; }
    .album-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .lightbox-photo { height: 50vh; }
    .lightbox-nav { width: 36px; height: 36px; font-size: 2rem; }
    .gallery-cta h2 { font-size: 1.3rem; }
    .gallery-cta-btns { flex-direction: column; align-items: center; }
  }
  @media (max-width: 480px) {
    .album-grid { grid-template-columns: 1fr; }
    .lightbox-photo { height: 40vh; }
  }
`

export const revalidate = 60

export default async function GalleryPage() {
  const albums = await getGalleryAlbums()

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* ─── Hero ─── */}
      <section className="gallery-hero">
        <div className="container">
          <h1>แกลเลอรี่ ผลงาน & การจัดส่ง</h1>
          <p>ภาพผลงานจริงจากลูกค้าและการจัดส่งสินค้าทั่วประเทศ</p>
          <div className="photo-count">รูปภาพกว่า 50+ ภาพ</div>
        </div>
      </section>

      <div className="container">
        <div className="album-breadcrumb">
          <a href="/">หน้าแรก</a> › แกลเลอรี่
        </div>
        <GalleryLightbox albums={albums} />
      </div>

    </>
  )
}
