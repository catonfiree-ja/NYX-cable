'use client'

import { useState, useEffect, useCallback } from 'react'

interface DeliveryPhoto {
    src: string
    alt: string
    gridColumn?: string
    gridRow?: string
}

export default function DeliveryGallery({ photos }: { photos: DeliveryPhoto[] }) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const close = useCallback(() => setActiveIndex(null), [])
    const next = useCallback(() => {
        setActiveIndex((i) => (i !== null && i < photos.length - 1 ? i + 1 : i))
    }, [photos.length])
    const prev = useCallback(() => {
        setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : i))
    }, [])

    useEffect(() => {
        if (activeIndex === null) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close()
            if (e.key === 'ArrowRight') next()
            if (e.key === 'ArrowLeft') prev()
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [activeIndex, close, next, prev])

    useEffect(() => {
        document.body.style.overflow = activeIndex !== null ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [activeIndex])

    return (
        <>
            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: '200px 200px 200px 300px', gap: 6, maxWidth: 1000, margin: '0 auto' }}>
                {photos.map((photo, i) => (
                    <div
                        key={i}
                        style={{
                            gridColumn: photo.gridColumn,
                            gridRow: photo.gridRow,
                            borderRadius: 8,
                            overflow: 'hidden',
                            cursor: 'pointer',
                        }}
                        onClick={() => setActiveIndex(i)}
                    >
                        <img
                            src={photo.src}
                            alt={photo.alt}
                            loading="lazy"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                                transition: 'transform 0.3s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {activeIndex !== null && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 10000,
                        background: 'rgba(0,0,0,0.92)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(8px)',
                    }}
                    onClick={close}
                >
                    <div
                        style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close */}
                        <button
                            onClick={close}
                            style={{
                                position: 'absolute',
                                top: -44,
                                right: 0,
                                background: 'none',
                                border: 'none',
                                color: '#fff',
                                fontSize: '2rem',
                                cursor: 'pointer',
                                padding: '4px 12px',
                                lineHeight: 1,
                                zIndex: 2,
                            }}
                            type="button"
                        >
                            ✕
                        </button>

                        {/* Counter */}
                        <div style={{ position: 'absolute', top: -40, left: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                            {activeIndex + 1} / {photos.length}
                        </div>

                        {/* Prev */}
                        {activeIndex > 0 && (
                            <button
                                onClick={prev}
                                style={{
                                    position: 'absolute',
                                    left: -60,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '50%',
                                    width: 48,
                                    height: 48,
                                    color: '#fff',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                                type="button"
                            >
                                ‹
                            </button>
                        )}

                        {/* Image */}
                        <img
                            src={photos[activeIndex].src}
                            alt={photos[activeIndex].alt}
                            style={{
                                maxWidth: '90vw',
                                maxHeight: '85vh',
                                objectFit: 'contain',
                                borderRadius: 8,
                                boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
                            }}
                        />

                        {/* Next */}
                        {activeIndex < photos.length - 1 && (
                            <button
                                onClick={next}
                                style={{
                                    position: 'absolute',
                                    right: -60,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '50%',
                                    width: 48,
                                    height: 48,
                                    color: '#fff',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                                type="button"
                            >
                                ›
                            </button>
                        )}
                    </div>

                    {/* Thumbnail strip */}
                    <div
                        style={{
                            position: 'fixed',
                            bottom: 20,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: 6,
                            padding: '8px 12px',
                            background: 'rgba(0,0,0,0.6)',
                            borderRadius: 12,
                            maxWidth: '90vw',
                            overflowX: 'auto',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {photos.map((photo, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                type="button"
                                style={{
                                    flexShrink: 0,
                                    width: 60,
                                    height: 45,
                                    borderRadius: 6,
                                    overflow: 'hidden',
                                    border: i === activeIndex ? '2px solid #fbb03b' : '2px solid transparent',
                                    cursor: 'pointer',
                                    opacity: i === activeIndex ? 1 : 0.5,
                                    transition: 'all 0.2s',
                                    padding: 0,
                                    background: 'none',
                                }}
                            >
                                <img
                                    src={photo.src}
                                    alt=""
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
