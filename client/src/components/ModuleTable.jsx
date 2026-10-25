import React from 'react'

const ModuleTable = ({ nodes, edges, onSelect }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-base-300 bg-base-100">
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Module</th>
            <th>Files</th>
            <th>Lines</th>
            <th>Imports from</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((n) => (
            <tr key={n.id}>
              <td className="font-medium">{n.id}</td>
              <td>{n.files}</td>
              <td>{n.lines.toLocaleString()}</td>
              <td className="text-xs opacity-70">{edges.filter((e) => e.from === n.id).map((e) => e.to).join(', ') || '-'}</td>
              <td><button className="btn btn-ghost btn-xs" onClick={() => onSelect(n.id)}>View files</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ModuleTable
