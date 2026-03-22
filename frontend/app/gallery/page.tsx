import { getGalleryAlbums } from '@/lib/queries'
import GalleryLightbox from '@/components/GalleryLightbox'
import LocalAlbumLightbox from '@/components/LocalAlbumLightbox'

const DELIVERY_2026_PHOTOS = Array.from({ length: 54 }, (_, i) =>
  `/delivery-2026/delivery-2026-${String(i + 1).padStart(2, '0')}.jpg`
)

const styles = `
  .album-breadcrumb { padding: var(--spacing-lg) 0 var(--spacing-sm); font-size: var(--font-size-sm); color: var(--color-gray-500); }
  .album-breadcrumb a { color: var(--color-secondary); }
  .album-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-xl); padding: var(--spacing-lg) 0 var(--spacing-3xl); }
  .album-card { all: unset; cursor: pointer; display: block; text-align: left; }
  .album-card:hover .album-img img { transform: scale(1.05); }
  .album-card:hover .album-overlay { opacity: 1; }
  .album-img { aspect-ratio: 4/3; overflow: hidden; border-radius: var(--radius-lg); background: var(--color-gray-100); position: relative; }
  .album-img img { transition: transform var(--transition-normal); }
  .album-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; border-radius: var(--radius-lg); z-index: 1; }
  .album-icon { color: #fff; font-size: 1.1rem; background: rgba(0,0,0,0.5); padding: 6px 14px; border-radius: 20px; }
  .album-title { font-size: var(--font-size-base); font-weight: 500; color: var(--color-primary-dark); margin-top: var(--spacing-sm); padding-bottom: var(--spacing-sm); border-bottom: 1px solid var(--color-gray-200); }

  .lightbox-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 9999; display: flex; align-items: center; justify-content: center; }
  .lightbox-content { width: 95vw; max-width: 1100px; max-height: 95vh; display: flex; flex-direction: column; }
  .lightbox-header { display: flex; align-items: center; gap: 12px; padding: 12px 0; color: #fff; }
  .lightbox-header h3 { flex: 1; font-size: 1.1rem; font-weight: 500; margin: 0; }
  .lightbox-counter { font-size: 0.85rem; opacity: 0.7; }
  .lightbox-close { all: unset; cursor: pointer; font-size: 1.5rem; color: #fff; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.2s; }
  .lightbox-close:hover { background: rgba(255,255,255,0.15); }
  .lightbox-main { flex: 1; display: flex; align-items: center; position: relative; min-height: 0; }
  .lightbox-photo { flex: 1; position: relative; height: 65vh; }
  .lightbox-nav { all: unset; cursor: pointer; font-size: 2.5rem; color: #fff; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.2s; flex-shrink: 0; }
  .lightbox-nav:hover:not(:disabled) { background: rgba(255,255,255,0.15); }
  .lightbox-nav:disabled { opacity: 0.25; cursor: default; }
  .lightbox-thumbs { display: flex; gap: 6px; padding: 12px 0; overflow-x: auto; justify-content: center; flex-wrap: wrap; }
  .lightbox-thumb { all: unset; cursor: pointer; border: 2px solid transparent; border-radius: 6px; overflow: hidden; opacity: 0.5; transition: all 0.2s; }
  .lightbox-thumb.active { border-color: var(--color-secondary, #f0c040); opacity: 1; }
  .lightbox-thumb:hover { opacity: 0.8; }
  .lightbox-thumb img { display: block; }

  .new-badge { position: absolute; top: 10px; left: 10px; z-index: 2; background: linear-gradient(135deg, #f0a500, #d4940a); color: #fff; font-size: 0.72rem; font-weight: 800; padding: 4px 12px; border-radius: 12px; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(240,165,0,0.4); }

  @media (max-width: 768px) {
    .album-grid { grid-template-columns: repeat(2, 1fr); gap: var(--spacing-md); }
    .lightbox-photo { height: 50vh; }
    .lightbox-nav { width: 36px; height: 36px; font-size: 2rem; }
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
      <div className="container">
        <div className="album-breadcrumb">
          <a href="/">Home</a> &raquo; อัลบั้ม
        </div>
        <LocalAlbumLightbox
          title="ส่งสินค้า 2026"
          photos={DELIVERY_2026_PHOTOS}
          sanityAlbums={albums}
        />
      </div>

      <section className="cta-section">
        <div className="container">
          <h2>สนใจสินค้า? ติดต่อเราวันนี้</h2>
          <p>ทีมวิศวกรพร้อมให้คำปรึกษาเลือกสายไฟที่เหมาะกับงานของคุณ</p>
          <div className="cta-actions">
            <a href="tel:021115588" className="btn btn-accent btn-lg">โทร 02-111-5588</a>
            <a href="https://page.line.me/@ubb9405u" className="btn btn-line btn-lg" target="_blank" rel="noopener noreferrer">แอด LINE</a>
          </div>
        </div>
      </section>
    </>
  )
}
