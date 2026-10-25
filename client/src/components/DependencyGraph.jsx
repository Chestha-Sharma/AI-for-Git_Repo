import React, { useMemo } from 'react'

const DependencyGraph = ({ nodes, edges, selected, onSelect }) => {
  // har module ko uski import depth ke hisaab se column me rakho (cycles ke liye depth 3 par roko)
  const pos = useMemo(() => {
    const depth = {}
    nodes.forEach((n) => (depth[n.id] = 0))
    for (let i = 0; i < nodes.length; i++) {
      edges.forEach((e) => {
        if (depth[e.from] !== undefined && depth[e.to] !== undefined) depth[e.to] = Math.min(3, Math.max(depth[e.to], depth[e.from] + 1))
      })
    }

    const columns = {}
    nodes.forEach((n) => {
      if (!columns[depth[n.id]]) columns[depth[n.id]] = []
      columns[depth[n.id]].push(n.id)
    })

    const result = {}
    Object.entries(columns).forEach(([d, ids]) => {
      ids.forEach((id, i) => {
        result[id] = { x: 50 + Number(d) * 115, y: (320 / (ids.length + 1)) * (i + 1) }
      })
    })
    return result
  }, [nodes, edges])

  return (
    <div className="card border border-base-300 bg-base-100">
      <div className="card-body p-4">
        <svg viewBox="0 0 440 320" className="w-full">
          <defs>
            <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0L8 4L0 8z" className="fill-base-content/40" />
            </marker>
          </defs>

          {edges.map((e) =>
            pos[e.from] && pos[e.to] ? (
              <line
                key={e.from + e.to}
                x1={pos[e.from].x + 28}
                y1={pos[e.from].y}
                x2={pos[e.to].x - 30}
                y2={pos[e.to].y}
                className="stroke-base-content/40"
                markerEnd="url(#arrow)"
              />
            ) : null
          )}

          {nodes.map((n) =>
            pos[n.id] ? (
              <g key={n.id} transform={`translate(${pos[n.id].x},${pos[n.id].y})`} className="cursor-pointer" onClick={() => onSelect(n.id)}>
                <circle r="26" className="fill-base-100 stroke-primary" strokeWidth={selected === n.id ? 4 : 2} />
                <text textAnchor="middle" y="-2" fontSize="9" fontWeight="600" className="fill-base-content">
                  {n.id.split('/').pop().slice(0, 11)}
                </text>
                <text textAnchor="middle" y="10" fontSize="9" className="fill-primary">
                  {n.files} files
                </text>
              </g>
            ) : null
          )}
        </svg>
        <p className="text-xs opacity-60">Arrows point to the module being imported. Click a module to see its files.</p>
      </div>
    </div>
  )
}

export default DependencyGraph
