'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

interface Album {
  _id: string
  title: string
  slug: { current: string }
  cover: any
  photos?: any[]
  year?: number
  orderRank: number
  linkUrl?: string
}

export default function GalleryLightbox({ albums }: { albums: Album[] }) {
  const [openAlbum, setOpenAlbum] = useState<Album | null>(null)
  const [activePhoto, setActivePhoto] = useState(0)

  const handleAlbumClick = (album: Album) => {
    if (album.linkUrl) {
      window.open(album.linkUrl, '_blank', 'noopener,noreferrer')
      return
    }
    setActivePhoto(0)
    setOpenAlbum(album)
  }

  const allPhotos = openAlbum
    ? [openAlbum.cover, ...(openAlbum.photos || [])]
    : []

  const closeLightbox = useCallback(() => {
    setOpenAlbum(null)
    setActivePhoto(0)
  }, [])

  const nextPhoto = useCallback(() => {
    setActivePhoto((p) => Math.min(p + 1, allPhotos.length - 1))
  }, [allPhotos.length])

  const prevPhoto = useCallback(() => {
    setActivePhoto((p) => Math.max(p - 1, 0))
  }, [])

  // Keyboard navigation
  useEffect(() => {
    if (!openAlbum) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextPhoto()
      if (e.key === 'ArrowLeft') prevPhoto()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [openAlbum, closeLightbox, nextPhoto, prevPhoto])

  // Lock body scroll when lightbox open
  useEffect(() => {
    if (openAlbum) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [openAlbum])

  return (
    <>
      {/* Album Grid */}
      <div className="album-grid">
        {albums.map((album) => (
          <button
            key={album._id}
            className="album-card"
            onClick={() => handleAlbumClick(album)}
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
      {openAlbum && allPhotos.length > 0 && (
        <div className="lightbox-backdrop" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="lightbox-header">
              <h3>{openAlbum.title}</h3>
              <span className="lightbox-counter">
                {activePhoto + 1} / {allPhotos.length}
              </span>
              <button className="lightbox-close" onClick={closeLightbox} type="button">✕</button>
            </div>

            {/* Main Photo */}
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
                <Image
                  src={urlFor(allPhotos[activePhoto]).width(1200).height(800).url()}
                  alt={allPhotos[activePhoto]?.caption || `${openAlbum.title} - ภาพที่ ${activePhoto + 1}`}
                  fill
                  sizes="90vw"
                  style={{ objectFit: 'contain' }}
                  priority
                />
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

            {/* Thumbnails */}
            {allPhotos.length > 1 && (
              <div className="lightbox-thumbs">
                {allPhotos.map((photo: any, i: number) => (
                  <button
                    key={i}
                    className={`lightbox-thumb ${i === activePhoto ? 'active' : ''}`}
                    onClick={() => setActivePhoto(i)}
                    type="button"
                  >
                    <Image
                      src={urlFor(photo).width(120).height(90).url()}
                      alt={photo?.caption || `${openAlbum.title} - ภาพที่ ${i + 1}`}
                      width={80}
                      height={60}
                      style={{ objectFit: 'cover' }}
                    />
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
