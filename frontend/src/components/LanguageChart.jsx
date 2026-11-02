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
    <section>
      <h3 className="mb-2 text-sm font-semibold">Lines of code by language</h3>
      {rows.length === 0 ? (
        <EmptyState text="No code indexed yet." />
      ) : (
        <div className="space-y-1">
          {rows.map(([lang, n]) => (
            <button key={lang} className="flex w-full items-center gap-3 text-xs hover:text-primary" onClick={() => onSelect(lang)}>
              <span className="w-24 text-left font-mono">{lang}</span>
              <span className="flex-1"><span className="block h-1.5 bg-primary/70" style={{ width: `${(n / max) * 100}%` }} /></span>
              <span className="w-16 text-right font-mono opacity-60">{n.toLocaleString()}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default LanguageChart
