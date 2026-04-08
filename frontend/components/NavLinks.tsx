'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

const defaultLinks = [
  { href: '/', label: 'หน้าแรก' },
  { href: '/products', label: 'ผลิตภัณฑ์' },
  { href: '/gallery', label: 'แกลเลอรี่' },
  { href: '/blog', label: 'บทความ' },
  { href: '/reviews', label: 'รีวิว' },
  { href: '/about', label: 'เกี่ยวกับเรา' },
  { href: '/contact', label: 'ติดต่อเรา' },
]

interface NavLinksProps {
  navItems?: { label: string; href: string }[]
}

export default function NavLinks({ navItems }: NavLinksProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const links = navItems && navItems.length > 0 ? navItems : defaultLinks

  return (
    <>
      <ul className={`nav-links ${isOpen ? 'nav-open' : ''}`}>
        {links.map((link) => {
          const isActive =
            link.href === '/'
              ? pathname === '/'
              : pathname.startsWith(link.href)

          return (
            <li key={link.href}>
              <a
                href={link.href}
                className={`nav-link-animate ${isActive ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            </li>
          )
        })}
      </ul>
      <button
        className="mobile-menu-btn"
        aria-label={isOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '☰'}
      </button>
    </>
  )
}
