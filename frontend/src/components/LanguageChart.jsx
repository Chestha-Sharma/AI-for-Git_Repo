import React, { useMemo } from 'react'
import EmptyState from './EmptyState.jsx'

// files ko language ke hisaab se lines of code me baant ke bars banata hai. bar par click karo to wo language select hoti hai
const LanguageChart = ({ files, onSelect }) => {
  const rows = useMemo(() => {
    const totals = {}
    files.forEach((f) => (totals[f.language] = (totals[f.language] || 0) + f.lines))
    return Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [files])
  const max = rows[0]?.[1] || 1

  return (
    <div className="card border border-base-300 bg-base-100">
      <div className="card-body gap-2 p-4">
        <h3 className="text-sm font-semibold">Lines of code by language</h3>
        {rows.length === 0 ? (
          <EmptyState text="No code indexed yet." />
        ) : (
          rows.map(([lang, n]) => (
            <button key={lang} className="flex items-center gap-3 text-xs hover:opacity-80" onClick={() => onSelect(lang)}>
              <span className="w-24 text-left">{lang}</span>
              <span className="flex-1"><span className="block h-3 rounded bg-primary" style={{ width: `${(n / max) * 100}%` }} /></span>
              <span className="w-16 text-right opacity-60">{n.toLocaleString()}</span>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

export default LanguageChart
