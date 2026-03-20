'use client'

import { useState, useMemo } from 'react'

interface Variant {
  _id: string
  title?: string
  model?: string
  slug?: { current: string }
  cores?: number
  crossSection?: number
  strandsInfo?: string
  outerDiameter?: number
  copperWeight?: number
  totalWeight?: number
  conductorResistance?: number
  inStock?: boolean
}

export default function VariantTable({ variants }: { variants: Variant[] }) {
  // Get unique cross-section sizes, sorted numerically
  const crossSections = useMemo(() => {
    const sizes = [...new Set(variants.map(v => v.crossSection).filter(Boolean))] as number[]
    return sizes.sort((a, b) => a - b)
  }, [variants])

  const [activeTab, setActiveTab] = useState<number | 'all'>(crossSections[0] || 'all')
  const [search, setSearch] = useState('')

  // Filter variants by active tab + search
  const filtered = useMemo(() => {
    let result = variants
    if (activeTab !== 'all') {
      result = result.filter(v => v.crossSection === activeTab)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(v =>
        (v.model || v.title || '').toLowerCase().includes(q) ||
        String(v.cores || '').includes(q)
      )
    }
    return result
  }, [variants, activeTab, search])

  const VariantName = ({ v }: { v: Variant }) => {
    const name = v.model || v.title || 'ขนาด'
    if (v.slug?.current) {
      return <a href={`/products/variant/${v.slug.current}`} style={{ fontWeight: 700, color: '#f0a500', textDecoration: 'underline', textUnderlineOffset: '3px' }}>{name}</a>
    }
    return <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{name}</span>
  }

  return (
    <section className="variants-section">
      <h2>ตารางขนาดสินค้า ({variants.length} ขนาด)</h2>

      {/* Search bar */}
      <div style={{ marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="🔍 ค้นหารุ่น เช่น 7G, 25G0.5, YSLY-OZ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = '#3b82f6'}
          onBlur={e => e.target.style.borderColor = '#d1d5db'}
        />
      </div>

      {/* Tabs by cross-section */}
      {crossSections.length > 1 && (
        <div className="variant-tabs" style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          marginBottom: '16px',
        }}>
          <button
            onClick={() => setActiveTab('all')}
            className={`variant-tab ${activeTab === 'all' ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: activeTab === 'all' ? '2px solid #1a3c6e' : '1px solid #d1d5db',
              background: activeTab === 'all' ? '#1a3c6e' : '#fff',
              color: activeTab === 'all' ? '#fff' : '#374151',
              fontWeight: activeTab === 'all' ? 700 : 500,
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'all 0.2s',
            }}
          >
            ทั้งหมด ({variants.length})
          </button>
          {crossSections.map(cs => {
            const count = variants.filter(v => v.crossSection === cs).length
            return (
              <button
                key={cs}
                onClick={() => setActiveTab(cs)}
                className={`variant-tab ${activeTab === cs ? 'active' : ''}`}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: activeTab === cs ? '2px solid #1a3c6e' : '1px solid #d1d5db',
                  background: activeTab === cs ? '#1a3c6e' : '#fff',
                  color: activeTab === cs ? '#fff' : '#374151',
                  fontWeight: activeTab === cs ? 700 : 500,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                }}
              >
                {cs} mm² ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* Results count */}
      {(search || activeTab !== 'all') && (
        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '8px' }}>
          แสดง {filtered.length} จาก {variants.length} ขนาด
          {search && <> • ค้นหา: &quot;{search}&quot;</>}
        </p>
      )}

      {/* Table with sticky header */}
      <div style={{ maxHeight: '600px', overflow: 'auto', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <table className="variants-table" style={{ margin: 0, borderRadius: 0 }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
            <tr>
              <th>รุ่น</th>
              <th>แกน</th>
              <th>พท.หน้าตัด (mm²)</th>
              <th>NO of strands × Max strand Dia.(mm)</th>
              <th>OD (mm)</th>
              <th>Cu Weight (kg/km)</th>
              <th>น้ำหนัก (kg/km)</th>
              <th>Conductor Resistance @ 20°C (Ω/km)</th>
              <th>สต็อก</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: '#9ca3af' }}>
                  ไม่พบรุ่นที่ค้นหา
                </td>
              </tr>
            ) : (
              filtered.map((v) => (
                <tr key={v._id}>
                  <td><VariantName v={v} /></td>
                  <td>{v.cores || '-'}</td>
                  <td>{v.crossSection || '-'}</td>
                  <td>{v.strandsInfo || '-'}</td>
                  <td>{v.outerDiameter || '-'}</td>
                  <td>{v.copperWeight || '-'}</td>
                  <td>{v.totalWeight || '-'}</td>
                  <td>{v.conductorResistance || '-'}</td>
                  <td>
                    <span className={`stock-badge ${v.inStock !== false ? 'stock-in' : 'stock-out'}`}>
                      {v.inStock !== false ? 'พร้อมส่ง' : 'สั่งผลิต'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
