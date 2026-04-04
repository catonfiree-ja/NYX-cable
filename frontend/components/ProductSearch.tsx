'use client'

import { useState } from 'react'
import Link from 'next/link'
import { decodeHtmlEntities } from '@/lib/decode-html'

const styles = `
  .product-search {
    max-width: 500px;
    margin: 0 auto 28px;
    position: relative;
  }
  .product-search input {
    width: 100%;
    padding: 14px 20px 14px 44px;
    border: 2px solid #e2e8f0;
    border-radius: 50px;
    font-size: 0.95rem;
    font-family: inherit;
    outline: none;
    transition: all 0.25s;
    background: #fff;
  }
  .product-search input:focus {
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0,102,204,0.1);
  }
  .product-search::before {
    content: '⌕';
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.1rem;
    color: #94a3b8;
    pointer-events: none;
  }
  .search-count {
    text-align: center;
    font-size: 0.82rem;
    color: #94a3b8;
    margin-top: 8px;
  }
`

interface ProductSearchProps {
    products: any[]
}

export default function ProductSearch({ products }: ProductSearchProps) {
    const [query, setQuery] = useState('')

    const filtered = query.trim()
        ? products.filter((p: any) => {
            const q = query.toLowerCase()
            return (
                p.title?.toLowerCase().includes(q) ||
                p.productCode?.toLowerCase().includes(q) ||
                p.shortDescription?.toLowerCase().includes(q)
            )
        })
        : products

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
            <div className="product-search">
                <input
                    type="text"
                    placeholder="ค้นหาสินค้า... เช่น YSLY-JZ, LiYCY, VFD"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="ค้นหาสินค้า"
                />
                {query && (
                    <div className="search-count">
                        พบ {filtered.length} จาก {products.length} รุ่น
                    </div>
                )}
            </div>
            <div className="products-grid">
                {filtered.map((prod: any) => (
                    <Link key={prod._id} href={`/product/${prod.slug?.current}`} className="product-mini">
                        <h4>{prod.title}</h4>
                        {prod.productCode && <div className="code">{prod.productCode}</div>}
                        {prod.shortDescription && <p>{decodeHtmlEntities(prod.shortDescription)}</p>}
                    </Link>
                ))}
                {filtered.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                        ไม่พบสินค้าที่ค้นหา
                    </div>
                )}
            </div>
        </>
    )
}
