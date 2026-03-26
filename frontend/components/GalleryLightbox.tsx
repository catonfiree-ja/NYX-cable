'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  const mainRef = useRef<HTMLDivElement>(null)

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

  const handleThumbClick = useCallback((i: number) => {
    setActivePhoto(i)
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

      {/* Lightbox — fixed viewport, only thumbs scroll */}
      {openAlbum && allPhotos.length > 0 && (
        <div
          className="lightbox-backdrop"
          onWheel={(e) => e.stopPropagation()}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.95)',
            overflow: 'hidden',
            display: 'flex', alignItems: 'stretch', justifyContent: 'center',
            touchAction: 'none',
          }}
        >
          <div
            style={{
              maxWidth: 1000, width: '100%', padding: '0 16px',
              height: '100vh',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              ref={mainRef}
              style={{
                flexShrink: 0,
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 0', color: '#fff',
              }}
            >
              <h3 style={{ flex: 1, fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>
                {openAlbum.title}
              </h3>
              <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                {activePhoto + 1} / {allPhotos.length}
              </span>
              <button
                onClick={closeLightbox}
                type="button"
                style={{
                  all: 'unset', cursor: 'pointer', fontSize: '1.5rem', color: '#fff',
                  width: 40, height: 40, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', borderRadius: '50%',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                ✕
              </button>
            </div>

            {/* Main Photo with nav arrows — fixed height */}
            <div style={{
              position: 'relative', display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0,
              background: 'rgba(0,0,0,0.3)', borderRadius: 12,
              height: '55vh',
            }}>
              {/* Prev */}
              <button
                onClick={prevPhoto}
                disabled={activePhoto === 0}
                type="button"
                style={{
                  all: 'unset', cursor: activePhoto === 0 ? 'default' : 'pointer',
                  position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                  fontSize: '2.5rem', color: '#fff', width: 50, height: 50,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%', transition: 'background 0.2s', zIndex: 2,
                  opacity: activePhoto === 0 ? 0.25 : 1,
                  background: 'rgba(0,0,0,0.3)',
                }}
              >
                ‹
              </button>

              {/* Photo */}
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image
                  src={urlFor(allPhotos[activePhoto]).width(1200).height(800).url()}
                  alt={allPhotos[activePhoto]?.caption || `${openAlbum.title} - ภาพที่ ${activePhoto + 1}`}
                  fill
                  sizes="90vw"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>

              {/* Next */}
              <button
                onClick={nextPhoto}
                disabled={activePhoto === allPhotos.length - 1}
                type="button"
                style={{
                  all: 'unset', cursor: activePhoto === allPhotos.length - 1 ? 'default' : 'pointer',
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  fontSize: '2.5rem', color: '#fff', width: 50, height: 50,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%', transition: 'background 0.2s', zIndex: 2,
                  opacity: activePhoto === allPhotos.length - 1 ? 0.25 : 1,
                  background: 'rgba(0,0,0,0.3)',
                }}
              >
                ›
              </button>
            </div>

            {/* Thumbnail Grid — fills remaining space, scrolls internally */}
            {allPhotos.length > 1 && (
              <div
                onWheel={(e) => e.stopPropagation()}
                style={{
                  maxHeight: 225, overflowY: 'scroll',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(10, 1fr)',
                  gap: 4, alignContent: 'start',
                  padding: '8px 0 16px',
                  touchAction: 'pan-y',
                  overscrollBehavior: 'contain',
                }}>
                {allPhotos.map((photo: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleThumbClick(i)}
                    type="button"
                    style={{
                      all: 'unset', cursor: 'pointer',
                      borderRadius: 4, overflow: 'hidden',
                      border: i === activePhoto ? '2px solid #f0a500' : '2px solid transparent',
                      opacity: i === activePhoto ? 1 : 0.5,
                      transition: 'all 0.2s',
                      lineHeight: 0,
                    }}
                  >
                    <img
                      src={urlFor(photo).width(180).height(135).url()}
                      alt={photo?.caption || `${openAlbum.title} - ภาพที่ ${i + 1}`}
                      width={90}
                      height={68}
                      loading="lazy"
                      style={{ width: '100%', height: 65, objectFit: 'cover', display: 'block' }}
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
