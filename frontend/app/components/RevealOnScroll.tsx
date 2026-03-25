'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface RevealProps {
    children: ReactNode
    className?: string
    stagger?: boolean
}

export default function RevealOnScroll({ children, className = '', stagger = false }: RevealProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        // Respect user preference for reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            el.querySelectorAll('.reveal').forEach(child => child.classList.add('is-visible'))
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (stagger) {
                            // For staggered grids: reveal each child
                            entry.target.querySelectorAll('.reveal').forEach(child => {
                                child.classList.add('is-visible')
                            })
                        }
                        entry.target.classList.add('is-visible')
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        )

        if (stagger) {
            observer.observe(el)
        } else {
            observer.observe(el)
        }

        return () => observer.disconnect()
    }, [stagger])

    const classes = stagger
        ? `reveal-stagger ${className}`.trim()
        : `reveal ${className}`.trim()

    return (
        <div ref={ref} className={classes}>
            {children}
        </div>
    )
}
