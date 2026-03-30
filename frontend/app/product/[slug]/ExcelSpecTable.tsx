'use client'

import { useState, useMemo } from 'react'

interface SpecItem {
  partNo?: string | null
  coreSize?: string | null
  model?: string | null
  strands?: string | null
  outerDia?: string | null
  cuWeight?: string | null
  weight?: string | null
  resistance?: string | null
  price?: string | null
  link?: string | null
}

interface ProductSpecData {
  sheetName: string
  productUrl: string
  items: SpecItem[]
  count: number
}

const css = `
  .excel-spec { margin-top: 12px; }

  .excel-spec-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }
  .excel-spec-header h2 { font-size: 1.3rem; font-weight: 800; color: #1a1a2e; margin: 0; }
  .excel-spec-header h2 span { color: #f0a500; font-weight: 700; }

  .excel-spec-search { position: relative; }
  .excel-spec-search input {
    padding: 10px 16px 10px 40px; border: 2px solid #e2e8f0; border-radius: 10px;
    font-size: 0.88rem; width: 300px; outline: none; transition: all 0.25s; background: #f8fafc;
  }
  .excel-spec-search input:focus { border-color: #f0a500; background: #fff; box-shadow: 0 0 0 3px rgba(240,165,0,0.1); }
  .excel-spec-search::before {
    content: '⌕'; position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    font-size: 0.9rem; pointer-events: none;
  }

  .excel-spec-tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
  .excel-spec-tab {
    padding: 7px 16px; border-radius: 20px; font-size: 0.82rem; cursor: pointer;
    border: 1.5px solid #e2e8f0; background: #fff; color: #64748b; font-weight: 500;
    transition: all 0.2s; user-select: none;
  }
  .excel-spec-tab:hover { border-color: #f0a500; background: #fffbeb; color: #92400e; }
  .excel-spec-tab.active {
    background: linear-gradient(135deg, #f0a500, #d4940a); color: #fff;
    border-color: transparent; font-weight: 700; box-shadow: 0 2px 8px rgba(240,165,0,0.3);
  }
  .excel-spec-tab .count { opacity: 0.7; font-size: 0.75rem; margin-left: 3px; }

  .excel-spec-info { font-size: 0.82rem; color: #94a3b8; margin-bottom: 8px; }

  .excel-spec-scroll {
    max-height: 600px; overflow: auto; border-radius: 12px;
    border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  .excel-spec-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
  .excel-spec-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
  .excel-spec-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

  .excel-spec-table { width: 100%; border-collapse: collapse; font-size: 0.84rem; margin: 0; }
  .excel-spec-table thead { position: sticky; top: 0; z-index: 2; }
  .excel-spec-table thead th {
    background: linear-gradient(180deg, #1a3c6e, #0f2d54); color: #fff;
    padding: 12px 14px; text-align: left; font-weight: 600; font-size: 0.78rem;
    letter-spacing: 0.3px; white-space: nowrap; border-bottom: 2px solid #f0a500;
  }
  .excel-spec-table tbody tr { transition: background 0.15s; }
  .excel-spec-table tbody tr:nth-child(even) { background: #f8fafc; }
  .excel-spec-table tbody tr:hover { background: #eff6ff; }
  .excel-spec-table tbody td {
    padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #334155;
    white-space: nowrap;
  }

  .excel-spec-model {
    font-weight: 700; color: #1a3c6e;
  }
  .excel-spec-model a {
    color: #f0a500; text-decoration: none;
    border-bottom: 1.5px solid transparent; transition: all 0.2s;
  }
  .excel-spec-model a:hover { color: #d4940a; border-bottom-color: #f0a500; }

  .excel-spec-price {
    font-weight: 700; color: #059669; font-size: 0.88rem;
  }
  .excel-spec-price.no-price { color: #94a3b8; font-weight: 400; }

  .excel-spec-empty { text-align: center; padding: 40px 20px; color: #94a3b8; }
  .excel-spec-empty .icon { font-size: 2rem; margin-bottom: 8px; }

  .excel-spec-note {
    margin-top: 12px; padding: 12px 16px; background: #fffbeb; border: 1px solid #f0a500;
    border-radius: 8px; font-size: 0.8rem; color: #92400e; line-height: 1.5;
  }

  @media (max-width: 768px) {
    .excel-spec-search input { width: 100%; }
    .excel-spec-header { flex-direction: column; align-items: flex-start; gap: 8px; }
    .excel-spec-header h2 { font-size: 1.1rem; }
    .excel-spec-table { font-size: 0.75rem; }
    .excel-spec-table thead th { padding: 8px 6px; font-size: 0.7rem; }
    .excel-spec-table tbody td { padding: 6px 6px; }
    .excel-spec-tabs { flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 4px; gap: 4px; }
    .excel-spec-tab { white-space: nowrap; flex-shrink: 0; padding: 6px 12px; font-size: 0.75rem; }
    .excel-spec-scroll { max-height: 500px; border-radius: 8px; }
    /* Hide less important columns on mobile */
    .excel-spec-table .col-partno,
    .excel-spec-table .col-cuweight,
    .excel-spec-table .col-strands { display: none; }
    .excel-spec-note { font-size: 0.75rem; padding: 10px 12px; }
  }
  @media (max-width: 480px) {
    .excel-spec-table { font-size: 0.7rem; }
    .excel-spec-table thead th { padding: 6px 4px; font-size: 0.65rem; }
    .excel-spec-table tbody td { padding: 5px 4px; }
    /* Also hide weight column on very small screens */
    .excel-spec-table .col-weight { display: none; }
  }
`

function extractSize(coreSize: string | null | undefined): string {
  if (!coreSize) return ''
  // Extract the mm² part: "3G0.5" → "0.5", "2X0.75" → "0.75"
  const m = coreSize.match(/[0-9.]+$/);
  return m ? m[0] : ''
}

function isValidPrice(price: string | null | undefined): boolean {
  if (!price) return false
  if (price === '-' || price === 'None' || price.startsWith('=')) return false
  const num = parseFloat(price)
  return !isNaN(num) && num > 0
}

export default function ExcelSpecTable({ slug, data }: { slug: string; data: ProductSpecData }) {
  // Group by cross-section size
  const sizes = useMemo(() => {
    const sizeSet = new Set<string>()
    data.items.forEach(item => {
      const s = extractSize(item.coreSize)
      if (s) sizeSet.add(s)
    })
    return [...sizeSet].sort((a, b) => parseFloat(a) - parseFloat(b))
  }, [data])

  const [activeTab, setActiveTab] = useState<string | 'all'>(sizes[0] || 'all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let result = data.items
    if (activeTab !== 'all') {
      result = result.filter(item => extractSize(item.coreSize) === activeTab)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(item =>
        (item.model || '').toLowerCase().includes(q) ||
        (item.coreSize || '').toLowerCase().includes(q) ||
        (item.partNo || '').toLowerCase().includes(q)
      )
    }
    return result
  }, [data, activeTab, search])

  const hasPrice = data.items.some(item => isValidPrice(item.price))

  return (
    <section className="variants-section excel-spec">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="excel-spec-header">
        <h2>ตารางข้อมูลสินค้า <span>({data.count} ขนาด)</span></h2>
        <div className="excel-spec-search">
          <input
            type="text"
            placeholder="ค้นหารุ่น เช่น 3G0.5, YSLY-OZ..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {sizes.length > 1 && (
        <div className="excel-spec-tabs">
          <button className={`excel-spec-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
            ทั้งหมด<span className="count">({data.items.length})</span>
          </button>
          {sizes.map(s => {
            const count = data.items.filter(item => extractSize(item.coreSize) === s).length
            return (
              <button key={s} className={`excel-spec-tab ${activeTab === s ? 'active' : ''}`} onClick={() => setActiveTab(s)}>
                {s} mm²<span className="count">({count})</span>
              </button>
            )
          })}
        </div>
      )}

      {(search || activeTab !== 'all') && (
        <p className="excel-spec-info">แสดง {filtered.length} จาก {data.items.length} ขนาด{search && ` • "${search}"`}</p>
      )}

      <div className="excel-spec-scroll">
        <table className="excel-spec-table">
          <thead>
            <tr>
              <th className="col-partno">Part No.</th>
              <th>ขนาด</th>
              <th>Model</th>
              <th className="col-strands">Strands × Dia.</th>
              <th>OD (mm)</th>
              <th className="col-cuweight">Cu Wt. (kg/km)</th>
              <th className="col-weight">น้ำหนัก (kg/km)</th>
              <th>Resistance (Ω/km)</th>
              {hasPrice && <th>ราคา (฿/ม.)</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={hasPrice ? 9 : 8}>
                  <div className="excel-spec-empty">
                    <div className="icon">⌕</div>
                    ไม่พบรุ่นที่ค้นหา
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td className="col-partno" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.partNo || '-'}</td>
                    <td style={{ fontWeight: 600, color: '#003366' }}>{item.coreSize || '-'}</td>
                    <td className="excel-spec-model">
                      {item.model || '-'}
                    </td>
                    <td className="col-strands">{item.strands || '-'}</td>
                    <td>{item.outerDia || '-'}</td>
                    <td className="col-cuweight">{item.cuWeight || '-'}</td>
                    <td className="col-weight">{item.weight || '-'}</td>
                    <td>{item.resistance || '-'}</td>
                    {hasPrice && (
                      <td className={`excel-spec-price ${isValidPrice(item.price) ? '' : 'no-price'}`}>
                        {isValidPrice(item.price) ? `฿${parseFloat(item.price!).toFixed(2)}` : 'สอบถาม'}
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {hasPrice && (
        <div className="excel-spec-note">
          ราคาที่แสดงเป็นราคาต่อเมตร (บาท/ม.) — สำหรับราคาขายส่งหรือสั่งจำนวนมากกรุณาติดต่อฝ่ายขาย
        </div>
      )}
    </section>
  )
}
