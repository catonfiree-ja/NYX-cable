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

const css = `
  .vt-container { margin-top: 8px; }
  .vt-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }
  .vt-header h2 { font-size: 1.3rem; font-weight: 800; color: #1a1a2e; margin: 0; }
  .vt-header h2 span { color: #3b82f6; font-weight: 700; }

  .vt-search { position: relative; }
  .vt-search input {
    padding: 10px 16px 10px 40px; border: 2px solid #e2e8f0; border-radius: 10px;
    font-size: 0.88rem; width: 300px; outline: none; transition: all 0.25s; background: #f8fafc;
  }
  .vt-search input:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  .vt-search::before {
    content: '🔍'; position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    font-size: 0.9rem; pointer-events: none;
  }

  .vt-tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
  .vt-tab {
    padding: 7px 16px; border-radius: 20px; font-size: 0.82rem; cursor: pointer;
    border: 1.5px solid #e2e8f0; background: #fff; color: #64748b; font-weight: 500;
    transition: all 0.2s; user-select: none;
  }
  .vt-tab:hover { border-color: #93c5fd; background: #eff6ff; color: #1e40af; }
  .vt-tab.active {
    background: linear-gradient(135deg, #1a3c6e, #2563eb); color: #fff;
    border-color: transparent; font-weight: 700; box-shadow: 0 2px 8px rgba(37,99,235,0.3);
  }
  .vt-tab .count { opacity: 0.7; font-size: 0.75rem; margin-left: 3px; }

  .vt-info { font-size: 0.82rem; color: #94a3b8; margin-bottom: 8px; }

  .vt-scroll {
    max-height: 550px; overflow: auto; border-radius: 12px;
    border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  .vt-scroll::-webkit-scrollbar { width: 6px; }
  .vt-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
  .vt-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

  .vt-table { width: 100%; border-collapse: collapse; font-size: 0.84rem; margin: 0; }
  .vt-table thead { position: sticky; top: 0; z-index: 2; }
  .vt-table thead th {
    background: linear-gradient(180deg, #1a3c6e, #0f2d54); color: #fff;
    padding: 12px 14px; text-align: left; font-weight: 600; font-size: 0.78rem;
    letter-spacing: 0.3px; white-space: nowrap; border-bottom: 2px solid #f0a500;
  }
  .vt-table tbody tr { transition: background 0.15s; }
  .vt-table tbody tr:nth-child(even) { background: #f8fafc; }
  .vt-table tbody tr:hover { background: #eff6ff; }
  .vt-table tbody td {
    padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #334155;
    white-space: nowrap;
  }

  .vt-name-link {
    font-weight: 700; color: #f0a500; text-decoration: none;
    border-bottom: 1.5px solid transparent; transition: all 0.2s;
  }
  .vt-name-link:hover { color: #d4940a; border-bottom-color: #f0a500; }

  .vt-stock {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 4px 10px; border-radius: 12px; font-size: 0.72rem; font-weight: 600;
  }
  .vt-stock.in { background: #ecfdf5; color: #059669; }
  .vt-stock.in::before { content: '●'; font-size: 0.5rem; }
  .vt-stock.out { background: #fef3c7; color: #92400e; }
  .vt-stock.out::before { content: '○'; font-size: 0.5rem; }

  .vt-empty { text-align: center; padding: 40px 20px; color: #94a3b8; }
  .vt-empty .icon { font-size: 2rem; margin-bottom: 8px; }

  @media (max-width: 768px) {
    .vt-search input { width: 100%; }
    .vt-header { flex-direction: column; align-items: flex-start; }
    .vt-table { font-size: 0.78rem; }
    .vt-table thead th, .vt-table tbody td { padding: 8px 10px; }
  }
`

export default function VariantTable({ variants }: { variants: Variant[] }) {
  const crossSections = useMemo(() => {
    const sizes = [...new Set(variants.map(v => v.crossSection).filter(Boolean))] as number[]
    return sizes.sort((a, b) => a - b)
  }, [variants])

  const [activeTab, setActiveTab] = useState<number | 'all'>(crossSections[0] || 'all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let result = variants
    if (activeTab !== 'all') result = result.filter(v => v.crossSection === activeTab)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(v =>
        (v.model || v.title || '').toLowerCase().includes(q) || String(v.cores || '').includes(q)
      )
    }
    return result
  }, [variants, activeTab, search])

  return (
    <section className="variants-section vt-container">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="vt-header">
        <h2>ตารางขนาดสินค้า <span>({variants.length} ขนาด)</span></h2>
        <div className="vt-search">
          <input
            type="text"
            placeholder="ค้นหารุ่น เช่น 7G, YSLY-OZ..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {crossSections.length > 1 && (
        <div className="vt-tabs">
          <button className={`vt-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
            ทั้งหมด<span className="count">({variants.length})</span>
          </button>
          {crossSections.map(cs => {
            const count = variants.filter(v => v.crossSection === cs).length
            return (
              <button key={cs} className={`vt-tab ${activeTab === cs ? 'active' : ''}`} onClick={() => setActiveTab(cs)}>
                {cs} mm²<span className="count">({count})</span>
              </button>
            )
          })}
        </div>
      )}

      {(search || activeTab !== 'all') && (
        <p className="vt-info">แสดง {filtered.length} จาก {variants.length} ขนาด{search && ` • "${search}"`}</p>
      )}

      <div className="vt-scroll">
        <table className="vt-table">
          <thead>
            <tr>
              <th>รุ่น</th>
              <th>แกน</th>
              <th>พท.หน้าตัด (mm²)</th>
              <th>Strands × Dia.</th>
              <th>OD (mm)</th>
              <th>Cu Wt. (kg/km)</th>
              <th>น้ำหนัก (kg/km)</th>
              <th>Resistance (Ω/km)</th>
              <th>สต็อก</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="vt-empty">
                    <div className="icon">🔍</div>
                    ไม่พบรุ่นที่ค้นหา
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(v => (
                <tr key={v._id}>
                  <td>
                    {v.slug?.current ? (
                      <a href={`/products/variant/${v.slug.current}`} className="vt-name-link">{v.model || v.title}</a>
                    ) : (
                      <span style={{ fontWeight: 600, color: '#1a3c6e' }}>{v.model || v.title}</span>
                    )}
                  </td>
                  <td>{v.cores || '-'}</td>
                  <td>{v.crossSection || '-'}</td>
                  <td>{v.strandsInfo || '-'}</td>
                  <td>{v.outerDiameter || '-'}</td>
                  <td>{v.copperWeight || '-'}</td>
                  <td>{v.totalWeight || '-'}</td>
                  <td>{v.conductorResistance || '-'}</td>
                  <td>
                    <span className={`vt-stock ${v.inStock !== false ? 'in' : 'out'}`}>
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
