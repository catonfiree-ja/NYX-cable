'use client'

import { useState, useMemo } from 'react'

/* ─── Types ─── */
interface HeaderDef {
  key: string
  label: string
  subLabel?: string | null
}

interface SpecItem {
  [key: string]: string | null | undefined
}

// Legacy format (existing 10 products)
interface LegacySpecData {
  sheetName: string
  productUrl: string
  items: SpecItem[]
  count: number
}

// New format with custom headers
interface CustomSpecData {
  sheetName: string
  productUrl: string
  headers: HeaderDef[]
  items: SpecItem[]
  count: number
  tabKey?: string | null
  tabLabel?: string
  searchKeys?: string[]
}

// Multi-table format (VCT, RS485-Belden)
interface MultiTableSpecData {
  sheetName: string
  productUrl: string
  tables: {
    title?: string | null
    headers: HeaderDef[]
    items: SpecItem[]
    count: number
  }[]
  count: number
}

type ProductSpecData = LegacySpecData | CustomSpecData | MultiTableSpecData

interface VariantInfo {
  title?: string
  slug?: { current?: string }
  model?: string
}

/* ─── CSS ─── */
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
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border-radius: 12px;
    border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  .excel-spec-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
  .excel-spec-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
  .excel-spec-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
  .excel-spec-scroll.compact { overflow-x: visible; display: flex; justify-content: center; }

  .excel-spec-table { width: 100%; border-collapse: collapse; font-size: 0.84rem; margin: 0; min-width: 100%; }
  .compact .excel-spec-table { width: auto; min-width: unset; margin: 0 auto; }
  .excel-spec-table thead { position: sticky; top: 0; z-index: 2; }
  .excel-spec-table thead th {
    background: linear-gradient(180deg, #1a3c6e, #0f2d54); color: #fff;
    padding: 10px 12px; text-align: center; font-weight: 600; font-size: 0.76rem;
    letter-spacing: 0.3px; white-space: nowrap;
    border-right: 1px solid rgba(255,255,255,0.1);
  }
  .excel-spec-table thead th:last-child { border-right: none; }
  .excel-spec-table thead th.has-sub { border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 4px; }
  .excel-spec-table thead th .sub-label {
    display: block; font-weight: 400; font-size: 0.68rem; opacity: 0.7; margin-top: 2px;
  }
  .excel-spec-table thead tr.sub-header-row th {
    background: #0f2d54; font-weight: 400; font-size: 0.68rem; opacity: 0.85;
    padding: 4px 12px; border-bottom: 2px solid #f0a500;
    border-right: 1px solid rgba(255,255,255,0.1);
  }
  .excel-spec-table thead tr.sub-header-row th:last-child { border-right: none; }
  .excel-spec-table thead tr:last-child th { border-bottom: 2px solid #f0a500; }
  .excel-spec-table tbody tr { transition: background 0.15s; }
  .excel-spec-table tbody tr:nth-child(even) { background: #f8fafc; }
  .excel-spec-table tbody tr:hover { background: #eff6ff; }
  .excel-spec-table tbody td {
    padding: 8px 12px; border-bottom: 1px solid #f1f5f9; color: #334155;
    text-align: center; border-right: 1px solid #f0f4f8;
  }
  .excel-spec-table tbody td:last-child { border-right: none; }

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

  .excel-spec-section-title {
    font-size: 1.05rem; font-weight: 700; color: #003366; margin: 28px 0 12px;
    padding-left: 12px; border-left: 3px solid #f0a500;
  }
  .excel-spec-section-title:first-of-type { margin-top: 8px; }

  @media (max-width: 768px) {
    .excel-spec-search input { width: 100%; }
    .excel-spec-header { flex-direction: column; align-items: flex-start; gap: 8px; }
    .excel-spec-header h2 { font-size: 1.1rem; }
    .excel-spec-table { font-size: 0.75rem; min-width: 450px; }
    .excel-spec-table thead th { padding: 8px 6px; font-size: 0.68rem; }
    .excel-spec-table thead th .sub-label { font-size: 0.6rem; }
    .excel-spec-table tbody td { padding: 6px 6px; }
    .excel-spec-scroll { border-radius: 8px; overflow-x: auto; }
    .excel-spec-tabs { flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 4px; gap: 4px; }
    .excel-spec-tab { white-space: nowrap; flex-shrink: 0; padding: 6px 12px; font-size: 0.75rem; }
    .excel-spec-note { font-size: 0.75rem; padding: 10px 12px; }
  }
  @media (max-width: 480px) {
    .excel-spec-table { font-size: 0.7rem; }
    .excel-spec-table thead th { padding: 6px 4px; font-size: 0.63rem; }
    .excel-spec-table tbody td { padding: 5px 4px; }
  }
`

/* ─── Helpers ─── */
function extractSize(coreSize: string | null | undefined): string {
  if (!coreSize) return ''
  const m = coreSize.match(/[0-9.]+$/)
  return m ? m[0] : ''
}

function isValidPrice(price: string | null | undefined): boolean {
  if (!price) return false
  const clean = price.replace(/,/g, '')
  if (clean === '-' || clean === '–' || clean === 'None' || clean.startsWith('=')) return false
  const num = parseFloat(clean)
  return !isNaN(num) && num > 0
}

function isLegacyFormat(data: ProductSpecData): data is LegacySpecData {
  return 'items' in data && !('headers' in data) && !('tables' in data)
}

function isMultiTable(data: ProductSpecData): data is MultiTableSpecData {
  return 'tables' in data
}

function isCustomFormat(data: ProductSpecData): data is CustomSpecData {
  return 'headers' in data && 'items' in data
}

/* ─── Product Link Map (for internal linking in tables) ─── */
const PRODUCT_SLUG_MAP: Record<string, string> = {
  'ysly-jz': '/product/ysly-jz',
  'ysly-oz': '/product/ysly-jz',
  'opvc-jz': '/product/opvc-jz',
  'jz-500': '/product/jz-500',
  'jz500': '/product/jz-500',
  'olflex classic 110': '/product/olflex-classic-110',
  'olflex-classic-110': '/product/olflex-classic-110',
  'cvv': '/product/cvv',
  'cvv-f': '/product/cvv',
  'cvv-s': '/product/cvv',
  'vct': '/product/vct',
  'vct-g': '/product/vct',
  'h07rn-f': '/product/h07rn-f',
  'nyy': '/product/nyy',
  'thw': '/product/thw',
  'thw-a': '/product/thw-a',
  'vaf': '/product/vaf',
  'rs485': '/product/rs485-rs422-belden',
  'belden': '/product/rs485-rs422-belden',
}

/** Find a product page link from model text */
function findProductLink(text: string): string | null {
  const lower = text.toLowerCase()
  for (const [keyword, href] of Object.entries(PRODUCT_SLUG_MAP)) {
    if (lower.includes(keyword)) return href
  }
  return null
}

/** Convert a WordPress link — return original URL since variant data is on WP */
function convertWpLink(wpUrl: string): string | null {
  if (!wpUrl) return null
  // The WordPress site is still live, so link directly to it
  // This preserves the per-variant page links (e.g. /สายคอนโทรล/ysly-jz-3g0.5/)
  return wpUrl
}

/* ─── Legacy Table (Backward Compatible) ─── */
function LegacyTable({ items, variantSlugMap }: { items: SpecItem[]; variantSlugMap: Map<string, string> }) {
  const hasPrice = items.some(item => isValidPrice(item.price))
  return (
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
        {items.length === 0 ? (
          <tr><td colSpan={hasPrice ? 9 : 8}><div className="excel-spec-empty"><div className="icon">⌕</div>ไม่พบรุ่นที่ค้นหา</div></td></tr>
        ) : items.map((item, idx) => {
          const modelText = item.model || '-'
          // Use the link field from product-specs.json data
          // Convert WordPress URLs to internal links
          const itemLink = item.link ? convertWpLink(item.link) : null
          const variantSlug = !itemLink && item.model ? variantSlugMap.get(item.model.toLowerCase().trim()) : null
          const productLink = !itemLink && !variantSlug && item.model ? findProductLink(item.model) : null
          const href = itemLink || (variantSlug ? `/product/variant/${variantSlug}` : productLink)
          return (
            <tr key={idx}>
              <td className="col-partno" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.partNo || '-'}</td>
              <td style={{ fontWeight: 600, color: '#003366' }}>{item.coreSize || '-'}</td>
              <td className="excel-spec-model">
                {href ? (
                  <a href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{modelText}</a>
                ) : modelText}
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
        })}
      </tbody>
    </table>
  )
}

/* ─── Dynamic Table ─── */
function DynamicTable({ headers, items, hasSubHeaders }: { headers: HeaderDef[]; items: SpecItem[]; hasSubHeaders: boolean }) {
  // Detect if last column is a price column
  const lastHeader = headers[headers.length - 1]
  const isPriceCol = lastHeader && /price|ราคา/i.test(lastHeader.label + (lastHeader.subLabel || ''))
  const hasPrice = isPriceCol && items.some(item => isValidPrice(item[lastHeader.key]))

  return (
    <table className="excel-spec-table">
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} className={hasSubHeaders && h.subLabel ? 'has-sub' : ''}>
              {h.label}
              {!hasSubHeaders && h.subLabel && <span className="sub-label">{h.subLabel}</span>}
            </th>
          ))}
        </tr>
        {hasSubHeaders && (
          <tr className="sub-header-row">
            {headers.map((h, i) => (
              <th key={i}>{h.subLabel || ''}</th>
            ))}
          </tr>
        )}
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr><td colSpan={headers.length}><div className="excel-spec-empty"><div className="icon">⌕</div>ไม่พบรุ่นที่ค้นหา</div></td></tr>
        ) : items.map((item, idx) => (
          <tr key={idx}>
            {headers.map((h, i) => {
              const val = item[h.key] || '-'
              const isLast = i === headers.length - 1
              // Format price column
              if (isLast && isPriceCol && hasPrice) {
                return (
                  <td key={i} className={`excel-spec-price ${isValidPrice(val) ? '' : 'no-price'}`}>
                    {isValidPrice(val) ? `฿${parseFloat(val.replace(/,/g, '')).toFixed(2)}` : (val === '–' || val === '-' ? 'สอบถาม' : val)}
                  </td>
                )
              }
              // Detect model/product-name columns and add links
              const isModelCol = /model|รุ่น/i.test(h.label)
              const pLink = isModelCol ? findProductLink(val) : null
              // First column bold
              if (i === 0) return <td key={i} style={{ fontWeight: 600, color: '#003366' }}>{pLink ? <a href={pLink} className="excel-spec-model">{val}</a> : val}</td>
              if (pLink) return <td key={i} className="excel-spec-model"><a href={pLink}>{val}</a></td>
              return <td key={i}>{val}</td>
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ─── Main Component ─── */
export default function ExcelSpecTable({ slug, data, variants = [] }: { slug: string; data: ProductSpecData; variants?: VariantInfo[] }) {
  const variantSlugMap = useMemo(() => {
    const map = new Map<string, string>()
    variants.forEach(v => {
      const slugCurrent = v.slug?.current
      if (!slugCurrent) return
      if (v.title) map.set(v.title.toLowerCase().trim(), slugCurrent)
      if (v.model) map.set(v.model.toLowerCase().trim(), slugCurrent)
    })
    return map
  }, [variants])

  // Multi-table mode (VCT, RS485-Belden)
  if (isMultiTable(data)) {
    return (
      <section className="variants-section excel-spec">
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="excel-spec-header">
          <h2>ตารางข้อมูลสินค้า <span>({data.count} ขนาด)</span></h2>
        </div>
        {data.tables.map((table, tIdx) => {
          const hasSubHeaders = table.headers.some(h => h.subLabel)
          return (
            <div key={tIdx}>
              {table.title && <h3 className="excel-spec-section-title">{table.title}</h3>}
              <div className={`excel-spec-scroll${table.headers.length <= 5 ? ' compact' : ''}`}>
                <DynamicTable headers={table.headers} items={table.items} hasSubHeaders={hasSubHeaders} />
              </div>
            </div>
          )
        })}
        {data.tables.some(t => t.items.some(item => {
          const lastKey = t.headers[t.headers.length - 1]?.key
          return lastKey && isValidPrice(item[lastKey])
        })) && (
          <div className="excel-spec-note">
            ราคาที่แสดงเป็นราคาต่อเมตร (บาท/ม.) — สำหรับราคาขายส่งหรือสั่งจำนวนมากกรุณาติดต่อฝ่ายขาย
          </div>
        )}
      </section>
    )
  }

  // Custom format with dynamic headers
  if (isCustomFormat(data)) {
    const customData = data as CustomSpecData
    const hasSubHeaders = customData.headers.some(h => h.subLabel)

    // Tabs by tabKey
    const tabKey = customData.tabKey
    const tabs = useMemo(() => {
      if (!tabKey) return []
      const vals = new Set<string>()
      customData.items.forEach(item => {
        const v = item[tabKey]
        if (v) vals.add(v)
      })
      return [...vals].sort((a, b) => parseFloat(a) - parseFloat(b))
    }, [customData, tabKey])

    const [activeTab, setActiveTab] = useState<string | 'all'>('all')
    const [search, setSearch] = useState('')

    const filtered = useMemo(() => {
      let result = customData.items
      if (tabKey && activeTab !== 'all') {
        result = result.filter(item => item[tabKey] === activeTab)
      }
      if (search.trim()) {
        const q = search.toLowerCase()
        const sKeys = customData.searchKeys || customData.headers.map(h => h.key)
        result = result.filter(item =>
          sKeys.some(k => (item[k] || '').toLowerCase().includes(q))
        )
      }
      return result
    }, [customData, activeTab, search, tabKey])

    return (
      <section className="variants-section excel-spec">
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="excel-spec-header">
          <h2>ตารางข้อมูลสินค้า <span>({customData.count} ขนาด)</span></h2>
          <div className="excel-spec-search">
            <input type="text" placeholder="ค้นหา..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {tabs.length > 1 && (
          <div className="excel-spec-tabs">
            <button className={`excel-spec-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
              ทั้งหมด<span className="count">({customData.items.length})</span>
            </button>
            {tabs.map(t => {
              const count = customData.items.filter(item => item[tabKey!] === t).length
              return (
                <button key={t} className={`excel-spec-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                  {t} {customData.tabLabel || ''}<span className="count">({count})</span>
                </button>
              )
            })}
          </div>
        )}

        {(search || activeTab !== 'all') && (
          <p className="excel-spec-info">แสดง {filtered.length} จาก {customData.items.length} ขนาด{search && ` • "${search}"`}</p>
        )}

        <div className={`excel-spec-scroll${customData.headers.length <= 5 ? ' compact' : ''}`}>
          <DynamicTable headers={customData.headers} items={filtered} hasSubHeaders={hasSubHeaders} />
        </div>

        {customData.items.some(item => {
          const lastKey = customData.headers[customData.headers.length - 1]?.key
          return lastKey && isValidPrice(item[lastKey])
        }) && (
          <div className="excel-spec-note">
            ราคาที่แสดงเป็นราคาต่อเมตร (บาท/ม.) — สำหรับราคาขายส่งหรือสั่งจำนวนมากกรุณาติดต่อฝ่ายขาย
          </div>
        )}
      </section>
    )
  }

  // Legacy format (existing 10 products)
  const legacyData = data as LegacySpecData
  const sizes = useMemo(() => {
    const sizeSet = new Set<string>()
    legacyData.items.forEach(item => {
      const s = extractSize(item.coreSize)
      if (s) sizeSet.add(s)
    })
    return [...sizeSet].sort((a, b) => parseFloat(a) - parseFloat(b))
  }, [legacyData])

  const [activeTab, setActiveTab] = useState<string | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let result = legacyData.items
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
  }, [legacyData, activeTab, search])

  const hasPrice = legacyData.items.some(item => isValidPrice(item.price))

  return (
    <section className="variants-section excel-spec">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="excel-spec-header">
        <h2>ตารางข้อมูลสินค้า <span>({legacyData.count} ขนาด)</span></h2>
        <div className="excel-spec-search">
          <input type="text" placeholder="ค้นหารุ่น เช่น 3G0.5, YSLY-OZ..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {sizes.length > 1 && (
        <div className="excel-spec-tabs">
          <button className={`excel-spec-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
            ทั้งหมด<span className="count">({legacyData.items.length})</span>
          </button>
          {sizes.map(s => {
            const count = legacyData.items.filter(item => extractSize(item.coreSize) === s).length
            return (
              <button key={s} className={`excel-spec-tab ${activeTab === s ? 'active' : ''}`} onClick={() => setActiveTab(s)}>
                {s} mm²<span className="count">({count})</span>
              </button>
            )
          })}
        </div>
      )}

      {(search || activeTab !== 'all') && (
        <p className="excel-spec-info">แสดง {filtered.length} จาก {legacyData.items.length} ขนาด{search && ` • "${search}"`}</p>
      )}

      <div className="excel-spec-scroll">
        <LegacyTable items={filtered} variantSlugMap={variantSlugMap} />
      </div>

      {hasPrice && (
        <div className="excel-spec-note">
          ราคาที่แสดงเป็นราคาต่อเมตร (บาท/ม.) — สำหรับราคาขายส่งหรือสั่งจำนวนมากกรุณาติดต่อฝ่ายขาย
        </div>
      )}
    </section>
  )
}
