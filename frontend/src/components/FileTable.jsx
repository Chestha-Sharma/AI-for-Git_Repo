import React from 'react'
import EmptyState from './EmptyState.jsx'

const LIMIT = 300 // browser slow na ho isliye sirf pehli 300 rows

const FileTable = ({ files, onOpen }) => {
  if (files.length === 0) return <EmptyState text="No files match these filters. Clear the search or add a repository." />

  return (
    <div className="max-h-[55vh] overflow-auto rounded border border-base-300">
      <table className="table table-xs table-pin-rows font-mono">
        <thead>
          <tr className="bg-base-200 text-base-content/70">
            <th className="font-medium">path</th>
            <th className="font-medium">repo</th>
            <th className="font-medium">language</th>
            <th className="text-right font-medium">lines</th>
          </tr>
        </thead>
        <tbody>
          {files.slice(0, LIMIT).map((f) => (
            <tr key={f.id} className="hover cursor-pointer border-base-300" onClick={() => onOpen(f)}>
              <td className="break-all">{f.path}</td>
              <td className="whitespace-nowrap opacity-60">{f.repo.replace('--', '/')}</td>
              <td className="whitespace-nowrap opacity-60">{f.language}</td>
              <td className="text-right">{f.lines}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {files.length > LIMIT && <p className="p-3 text-center text-xs opacity-60">Showing first {LIMIT}. Narrow the filters to see more.</p>}
    </div>
  )
}

export default FileTable
