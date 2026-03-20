'use client'

import { useState, useMemo } from 'react'

interface SiblingVariant {
  _id: string
  title: string
  slug?: { current: string }
  model?: string
  cores?: number
  crossSection?: number
  inStock?: boolean
}

interface Props {
  siblings: SiblingVariant[]
  currentVariant: SiblingVariant
  parentTitle: string
}

export default function SiblingVariants({ siblings, currentVariant, parentTitle }: Props) {
  // Combine current + siblings for tab counting
  const all = useMemo(() => [currentVariant, ...siblings], [currentVariant, siblings])

  const crossSections = useMemo(() => {
    const sizes = [...new Set(all.map(v => v.crossSection).filter(Boolean))] as number[]
    return sizes.sort((a, b) => a - b)
  }, [all])

  // Default to the current variant's cross-section tab
  const [activeTab, setActiveTab] = useState<number | 'all'>(currentVariant.crossSection || 'all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let result = all
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
  }, [all, activeTab, search])

  return (
    <section className="variant-siblings">
      <h2>ขนาดอื่นๆ ของ {parentTitle} ({all.length} รุ่น)</h2>

      {/* Search */}
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="🔍 ค้นหา เช่น 7G, 25G..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: '320px', padding: '8px 14px',
            borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem', outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = '#3b82f6'}
          onBlur={e => e.target.style.borderColor = '#d1d5db'}
        />
      </div>

      {/* Tabs */}
      {crossSections.length > 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
          <button onClick={() => setActiveTab('all')} style={{
            padding: '6px 14px', borderRadius: '16px', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
            border: activeTab === 'all' ? '2px solid #1a3c6e' : '1px solid #d1d5db',
            background: activeTab === 'all' ? '#1a3c6e' : '#fff',
            color: activeTab === 'all' ? '#fff' : '#374151',
            fontWeight: activeTab === 'all' ? 700 : 500,
          }}>ทั้งหมด</button>
          {crossSections.map(cs => (
            <button key={cs} onClick={() => setActiveTab(cs)} style={{
              padding: '6px 14px', borderRadius: '16px', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
              border: activeTab === cs ? '2px solid #1a3c6e' : '1px solid #d1d5db',
              background: activeTab === cs ? '#1a3c6e' : '#fff',
              color: activeTab === cs ? '#fff' : '#374151',
              fontWeight: activeTab === cs ? 700 : 500,
            }}>{cs} mm²</button>
          ))}
        </div>
      )}

      {/* Info text */}
      {(search || activeTab !== 'all') && (
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '8px' }}>
          แสดง {filtered.length} จาก {all.length} รุ่น
        </p>
      )}

      {/* Grid */}
      <div className="siblings-grid" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '20px', color: '#9ca3af', textAlign: 'center', gridColumn: '1/-1' }}>
            ไม่พบรุ่นที่ค้นหา
          </div>
        ) : (
          filtered.map(s => {
            const isCurrent = s._id === currentVariant._id
            if (isCurrent) {
              return (
                <div key={s._id} className="sibling-card current">
                  <div>
                    <div className="sibling-name">{s.title} ← ดูอยู่</div>
                    {s.crossSection && <div className="sibling-spec">{s.cores && `${s.cores} แกน × `}{s.crossSection} mm²</div>}
                  </div>
                </div>
              )
            }
            return (
              <a key={s._id} href={`/products/variant/${s.slug?.current}`} className="sibling-card">
                <div>
                  <div className="sibling-name">{s.title}</div>
                  {s.crossSection && <div className="sibling-spec">{s.cores && `${s.cores} แกน × `}{s.crossSection} mm²</div>}
                </div>
              </a>
            )
          })
        )}
      </div>
    </section>
  )
}
