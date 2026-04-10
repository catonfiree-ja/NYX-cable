'use client'

import { useState } from 'react'

interface SpecTableCollapsibleProps {
  caption?: string
  headers: string[]
  rows: { cells: string[] }[]
  initialRows?: number
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

  return (
    <div className="spec-table-wrap">
      {caption && <h3 className="spec-table-caption">{caption}</h3>}
      <div className="spec-table-container">
        <table className="spec-table spec-table--compact">
          <thead>
            <tr>
              {headers.map((h, hi) => (
                <th key={hi}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, ri) => (
              <tr key={ri}>
                {(row.cells || []).map((cell, ci) => (
                  <td key={ci}>{cell}</td>
                ))}
              </tr>
            ))}
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
