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
            <style dangerouslySetInnerHTML={{
                __html: `
                .delivery-gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    grid-template-rows: 200px 200px 200px 300px;
                    gap: 6px;
                    max-width: 1000px;
                    margin: 0 auto;
                }
                @media (max-width: 768px) {
                    .delivery-gallery-grid {
                        grid-template-columns: 1fr !important;
                        grid-template-rows: auto !important;
                        gap: 4px;
                    }
                    .delivery-gallery-grid > div {
                        grid-column: auto !important;
                        grid-row: auto !important;
                        aspect-ratio: auto;
                    }
                }
            ` }} />
            {/* Grid */}
            <div className="delivery-gallery-grid">
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
                                height: 'auto',
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

            {/* Lightbox — vertical scroll layout (same as Gallery) */}
            {activeIndex !== null && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 10000,
                        background: 'rgba(0,0,0,0.95)',
                        overflowY: 'auto',
                        display: 'block',
                    }}
                    onClick={close}
                >
                    <div
                        style={{
                            maxWidth: 1000, margin: '0 auto', padding: '0 16px',
                            minHeight: '100vh',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Sticky Header */}
                        <div
                            id="delivery-lightbox-top"
                            style={{
                                position: 'sticky', top: 0, zIndex: 10,
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '14px 0', color: '#fff',
                                background: 'rgba(0,0,0,0.9)',
                                backdropFilter: 'blur(8px)',
                            }}
                        >
                            <span style={{ flex: 1, fontSize: '1.1rem', fontWeight: 500 }}>
                                การส่งสินค้า
                            </span>
                            <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                                {activeIndex + 1} / {photos.length}
                            </span>
                            <button
                                onClick={close}
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

                        {/* Main Photo with nav arrows */}
                        <div style={{
                            position: 'relative', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', marginBottom: 24,
                            background: 'rgba(0,0,0,0.3)', borderRadius: 12,
                            minHeight: '60vh',
                        }}>
                            {/* Prev */}
                            <button
                                onClick={prev}
                                disabled={activeIndex === 0}
                                type="button"
                                style={{
                                    all: 'unset', cursor: activeIndex === 0 ? 'default' : 'pointer',
                                    position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                                    fontSize: '2.5rem', color: '#fff', width: 50, height: 50,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    borderRadius: '50%', zIndex: 2,
                                    opacity: activeIndex === 0 ? 0.25 : 1,
                                    background: 'rgba(0,0,0,0.3)',
                                }}
                            >
                                ‹
                            </button>

                            {/* Photo */}
                            <div style={{ position: 'relative', width: '100%', height: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img
                                    src={photos[activeIndex].src}
                                    alt={photos[activeIndex].alt}
                                    style={{
                                        maxWidth: '100%', maxHeight: '65vh',
                                        objectFit: 'contain', borderRadius: 8,
                                    }}
                                />
                            </div>

                            {/* Next */}
                            <button
                                onClick={next}
                                disabled={activeIndex === photos.length - 1}
                                type="button"
                                style={{
                                    all: 'unset', cursor: activeIndex === photos.length - 1 ? 'default' : 'pointer',
                                    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                                    fontSize: '2.5rem', color: '#fff', width: 50, height: 50,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    borderRadius: '50%', zIndex: 2,
                                    opacity: activeIndex === photos.length - 1 ? 0.25 : 1,
                                    background: 'rgba(0,0,0,0.3)',
                                }}
                            >
                                ›
                            </button>
                        </div>

                        {/* Thumbnail Grid — wrapping, scroll down */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                            gap: 6,
                            paddingBottom: 40,
                        }}>
                            {photos.map((photo, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setActiveIndex(i)
                                        document.getElementById('delivery-lightbox-top')?.scrollIntoView({ behavior: 'smooth' })
                                    }}
                                    type="button"
                                    style={{
                                        all: 'unset', cursor: 'pointer',
                                        aspectRatio: '4/3',
                                        borderRadius: 6, overflow: 'hidden',
                                        border: i === activeIndex ? '3px solid #f0a500' : '3px solid transparent',
                                        opacity: i === activeIndex ? 1 : 0.5,
                                        transition: 'all 0.2s',
                                        position: 'relative',
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
                </div>
            )}
        </>
    )
}
