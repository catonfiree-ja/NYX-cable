'use client'

import { useState } from 'react'
import Link from 'next/link'

interface SpecTableCollapsibleProps {
  caption?: string
  headers: string[]
  rows: (string[] | { cells: string[] })[]
  initialRows?: number
}

// Known product slug mappings for internal linking
const PRODUCT_LINKS: Record<string, string> = {
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
}

/** Render cell text, converting product names into internal links */
function renderCellContent(text: string) {
  // First unescape HTML entities
  let clean = text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')

  // Check if the cell text contains a known product name and create a link
  const lowerText = clean.toLowerCase().trim()
  
  for (const [keyword, href] of Object.entries(PRODUCT_LINKS)) {
    if (lowerText.includes(keyword)) {
      // Create link wrapping the entire cell text
      return (
        <Link href={href} style={{ color: '#1a5fb4', textDecoration: 'none', fontWeight: 500 }}>
          {clean}
        </Link>
      )
    }
  }
  
  return clean
}

export default function SpecTableCollapsible({
  caption,
  headers,
  rows,
  initialRows = 15,
}: SpecTableCollapsibleProps) {
  const [expanded, setExpanded] = useState(false)
  const visibleRows = expanded ? rows : rows.slice(0, initialRows)
  const hasMore = rows.length > initialRows

  // Determine if table is "small" (few columns, few rows) → center it
  const isSmall = headers.length <= 5 && rows.length <= 20

  return (
    <div className={`spec-table-wrap ${isSmall ? 'spec-table-wrap--centered' : ''}`}>
      {caption && <h3 className="spec-table-caption">{caption}</h3>}
      <div className="spec-table-container">
        <table className="spec-table">
          <thead>
            <tr>
              {headers.map((h, hi) => (
                <th key={hi}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, ri) => {
              const cells = Array.isArray(row) ? row : (row.cells || [])
              return (
                <tr key={ri}>
                  {cells.map((cell: string, ci: number) => (
                    <td key={ci}>{renderCellContent(cell)}</td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Gradient fade overlay when collapsed */}
        {!expanded && hasMore && (
          <div className="spec-table-fade" />
        )}
      </div>

      {hasMore && (
        <button
          className="spec-table-toggle"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          <span>{expanded ? 'ย่อตาราง' : `ดูทั้งหมด (${rows.length} รายการ)`}</span>
          <svg
            className={`spec-table-toggle-icon ${expanded ? 'expanded' : ''}`}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
