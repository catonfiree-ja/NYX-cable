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

const css = `
  .sv-container { margin-top: 32px; }
  .sv-header { margin-bottom: 16px; }
  .sv-header h2 { font-size: 1.2rem; font-weight: 800; color: #1a1a2e; margin: 0 0 4px 0; }
  .sv-header h2 span { color: #3b82f6; }
  .sv-header p { font-size: 0.82rem; color: #94a3b8; margin: 0; }

  .sv-controls { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }

  .sv-search { position: relative; flex-shrink: 0; }
  .sv-search input {
    padding: 8px 14px 8px 36px; border: 2px solid #e2e8f0; border-radius: 10px;
    font-size: 0.84rem; width: 260px; outline: none; transition: all 0.25s; background: #f8fafc;
  }
  .sv-search input:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  .sv-search::before {
    content: '⌕'; position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    font-size: 0.8rem; pointer-events: none;
  }

  .sv-tabs { display: flex; gap: 5px; flex-wrap: wrap; }
  .sv-tab {
    padding: 6px 14px; border-radius: 16px; font-size: 0.78rem; cursor: pointer;
    border: 1.5px solid #e2e8f0; background: #fff; color: #64748b; font-weight: 500;
    transition: all 0.2s; user-select: none;
  }
  .sv-tab:hover { border-color: #93c5fd; background: #eff6ff; color: #1e40af; }
  .sv-tab.active {
    background: linear-gradient(135deg, #1a3c6e, #2563eb); color: #fff;
    border-color: transparent; font-weight: 700; box-shadow: 0 2px 6px rgba(37,99,235,0.25);
  }

  .sv-info { font-size: 0.8rem; color: #94a3b8; margin-bottom: 10px; }

  .sv-grid-wrap {
    max-height: 420px; overflow-y: auto; border-radius: 12px;
    background: #f8fafc; padding: 12px; border: 1px solid #e2e8f0;
  }
  .sv-grid-wrap::-webkit-scrollbar { width: 5px; }
  .sv-grid-wrap::-webkit-scrollbar-track { background: transparent; }
  .sv-grid-wrap::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

  .sv-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px;
  }

  .sv-card {
    display: block; padding: 12px 14px; border-radius: 10px;
    border: 1.5px solid #e2e8f0; background: #fff; text-decoration: none;
    color: #1a1a2e; transition: all 0.2s; cursor: pointer;
  }
  .sv-card:hover {
    border-color: #3b82f6; background: #eff6ff;
    box-shadow: 0 2px 8px rgba(59,130,246,0.12); transform: translateY(-1px);
  }
  .sv-card.current {
    border-color: #f0a500; background: linear-gradient(135deg, #fffbf0, #fef3cd);
    box-shadow: 0 2px 8px rgba(240,165,0,0.15);
  }
  .sv-card-name { font-size: 0.84rem; font-weight: 700; margin-bottom: 2px; }
  .sv-card.current .sv-card-name { color: #92400e; }
  .sv-card-spec { font-size: 0.72rem; color: #94a3b8; }
  .sv-card-badge {
    display: inline-block; margin-top: 4px; padding: 2px 8px;
    border-radius: 8px; font-size: 0.65rem; font-weight: 600;
    background: #fef3cd; color: #92400e;
  }

  .sv-empty { text-align: center; padding: 30px; color: #94a3b8; grid-column: 1 / -1; }

  @media (max-width: 768px) {
    .sv-search input { width: 100%; }
    .sv-controls { flex-direction: column; align-items: flex-start; }
    .sv-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
  }
`

export default function SiblingVariants({ siblings, currentVariant, parentTitle }: Props) {
  const all = useMemo(() => [currentVariant, ...siblings], [currentVariant, siblings])

  const crossSections = useMemo(() => {
    const sizes = [...new Set(all.map(v => v.crossSection).filter(Boolean))] as number[]
    return sizes.sort((a, b) => a - b)
  }, [all])

  const [activeTab, setActiveTab] = useState<number | 'all'>(currentVariant.crossSection || 'all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let result = all
    if (activeTab !== 'all') result = result.filter(v => v.crossSection === activeTab)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(v => (v.model || v.title || '').toLowerCase().includes(q) || String(v.cores || '').includes(q))
    }
    return result
  }, [all, activeTab, search])

  return (
    <section className="variant-siblings sv-container">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="sv-header">
        <h2>ขนาดอื่นๆ ของ {parentTitle} <span>({all.length} รุ่น)</span></h2>
        <p>เลือกขนาดที่ต้องการเพื่อดูรายละเอียดและสอบถามราคา</p>
      </div>

      <div className="sv-controls">
        <div className="sv-search">
          <input
            type="text"
            placeholder="ค้นหา เช่น 7G, 25G..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {crossSections.length > 1 && (
          <div className="sv-tabs">
            <button className={`sv-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>ทั้งหมด</button>
            {crossSections.map(cs => (
              <button key={cs} className={`sv-tab ${activeTab === cs ? 'active' : ''}`} onClick={() => setActiveTab(cs)}>
                {cs} mm²
              </button>
            ))}
          </div>
        )}
      </div>

      {(search || activeTab !== 'all') && (
        <p className="sv-info">แสดง {filtered.length} จาก {all.length} รุ่น</p>
      )}

      <div className="sv-grid-wrap">
        <div className="sv-grid">
          {filtered.length === 0 ? (
            <div className="sv-empty">ไม่พบรุ่นที่ค้นหา</div>
          ) : (
            filtered.map(s => {
              const isCurrent = s._id === currentVariant._id
              if (isCurrent) {
                return (
                  <div key={s._id} className="sv-card current">
                    <div className="sv-card-name">{s.title}</div>
                    {s.crossSection && <div className="sv-card-spec">{s.cores && `${s.cores} แกน × `}{s.crossSection} mm²</div>}
                    <span className="sv-card-badge">← ดูอยู่</span>
                  </div>
                )
              }
              return (
                <a key={s._id} href={`/products/variant/${s.slug?.current}`} className="sv-card">
                  <div className="sv-card-name">{s.title}</div>
                  {s.crossSection && <div className="sv-card-spec">{s.cores && `${s.cores} แกน × `}{s.crossSection} mm²</div>}
                </a>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
