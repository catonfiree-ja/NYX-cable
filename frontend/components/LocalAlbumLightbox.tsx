'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

interface SanityAlbum {
  _id: string
  title: string
  slug: { current: string }
  cover: any
  photos?: any[]
  year?: number
  orderRank: number
  linkUrl?: string
}

type OpenItem =
  | { type: 'local'; title: string; photos: string[] }
  | { type: 'sanity'; album: SanityAlbum }

export default function LocalAlbumLightbox({
  title,
  photos,
  sanityAlbums,
}: {
  title: string
  photos: string[]
  sanityAlbums: SanityAlbum[]
}) {
  const [openItem, setOpenItem] = useState<OpenItem | null>(null)
  const [activePhoto, setActivePhoto] = useState(0)

  // Compute all photos for current lightbox
  const allPhotos = openItem
    ? openItem.type === 'local'
      ? openItem.photos
      : [openItem.album.cover, ...(openItem.album.photos || [])]
    : []

  const closeLightbox = useCallback(() => {
    setOpenItem(null)
    setActivePhoto(0)
  }, [])

  const nextPhoto = useCallback(() => {
    setActivePhoto(p => Math.min(p + 1, allPhotos.length - 1))
  }, [allPhotos.length])

  const prevPhoto = useCallback(() => {
    setActivePhoto(p => Math.max(p - 1, 0))
  }, [])

  useEffect(() => {
    if (!openItem) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextPhoto()
      if (e.key === 'ArrowLeft') prevPhoto()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [openItem, closeLightbox, nextPhoto, prevPhoto])

  useEffect(() => {
    document.body.style.overflow = openItem ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [openItem])

  const currentTitle = openItem
    ? openItem.type === 'local'
      ? openItem.title
      : openItem.album.title
    : ''

  return (
    <>
      {/* Album Grid */}
      <div className="album-grid">
        {/* Local Delivery 2026 Album — shown first with NEW badge */}
        <button
          className="album-card"
          onClick={() => {
            setActivePhoto(0)
            setOpenItem({ type: 'local', title, photos })
          }}
          type="button"
        >
          <div className="album-img">

            <Image
              src={photos[0]}
              alt={title}
              fill
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
            <div className="album-overlay">
              <span className="album-icon">📷 {photos.length} ภาพ</span>
            </div>
          </div>
          <div className="album-title">{title}</div>
        </button>

        {/* Sanity Albums */}
        {sanityAlbums.map(album => (
          <button
            key={album._id}
            className="album-card"
            onClick={() => {
              if (album.linkUrl) {
                window.open(album.linkUrl, '_blank', 'noopener,noreferrer')
                return
              }
              setActivePhoto(0)
              setOpenItem({ type: 'sanity', album })
            }}
            type="button"
          >
            <div className="album-img">
              {album.cover && (
                <Image
                  src={urlFor(album.cover).width(800).height(600).url()}
                  alt={album.title}
                  fill
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              )}
              <div className="album-overlay">
                {album.linkUrl ? (
                  <span className="album-icon">🔗 ดูเพิ่มเติม</span>
                ) : (
                  <span className="album-icon">
                    📷 {(album.photos?.length || 0) + 1} ภาพ
                  </span>
                )}
              </div>
            </div>
            <div className="album-title">{album.title}</div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {openItem && allPhotos.length > 0 && (
        <div className="lightbox-backdrop" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <div className="lightbox-header">
              <h3>{currentTitle}</h3>
              <span className="lightbox-counter">
                {activePhoto + 1} / {allPhotos.length}
              </span>
              <button className="lightbox-close" onClick={closeLightbox} type="button">
                ✕
              </button>
            </div>

            <div className="lightbox-main">
              <button
                className="lightbox-nav lightbox-prev"
                onClick={prevPhoto}
                disabled={activePhoto === 0}
                type="button"
              >
                ‹
              </button>

              <div className="lightbox-photo">
                {openItem.type === 'local' ? (
                  <Image
                    src={allPhotos[activePhoto]}
                    alt={`${currentTitle} - ภาพที่ ${activePhoto + 1}`}
                    fill
                    sizes="90vw"
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                ) : (
                  <Image
                    src={urlFor(allPhotos[activePhoto]).width(1200).height(800).url()}
                    alt={(allPhotos[activePhoto] as any)?.caption || `${currentTitle} - ภาพที่ ${activePhoto + 1}`}
                    fill
                    sizes="90vw"
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                )}
              </div>

              <button
                className="lightbox-nav lightbox-next"
                onClick={nextPhoto}
                disabled={activePhoto === allPhotos.length - 1}
                type="button"
              >
                ›
              </button>
            </div>

            {allPhotos.length > 1 && (
              <div className="lightbox-thumbs">
                {allPhotos.map((photo: any, i: number) => (
                  <button
                    key={i}
                    className={`lightbox-thumb ${i === activePhoto ? 'active' : ''}`}
                    onClick={() => setActivePhoto(i)}
                    type="button"
                  >
                    {openItem.type === 'local' ? (
                      <Image
                        src={photo}
                        alt={`${currentTitle} - ภาพที่ ${i + 1}`}
                        width={80}
                        height={60}
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Image
                        src={urlFor(photo).width(120).height(90).url()}
                        alt={photo?.caption || `${currentTitle} - ภาพที่ ${i + 1}`}
                        width={80}
                        height={60}
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
