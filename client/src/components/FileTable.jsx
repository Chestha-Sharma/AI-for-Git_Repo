import React from 'react'
import EmptyState from './EmptyState.jsx'

const LIMIT = 300 // browser slow na ho isliye sirf pehli 300 rows

const FileTable = ({ files, onOpen }) => {
  if (files.length === 0) return <EmptyState text="No files match these filters. Clear the search or add a repository." />

  return (
    <div className="max-h-[55vh] overflow-auto rounded-lg border border-base-300">
      <table className="table table-xs table-pin-rows font-mono">
        <thead>
          <tr>
            <th>Path</th>
            <th>Repo</th>
            <th>Language</th>
            <th>Lines</th>
          </tr>
        </thead>
        <tbody>
          {files.slice(0, LIMIT).map((f) => (
            <tr key={f.id} className="hover cursor-pointer" onClick={() => onOpen(f)}>
              <td className="break-all font-semibold">{f.path}</td>
              <td className="whitespace-nowrap opacity-60">{f.repo.replace('--', '/')}</td>
              <td className="whitespace-nowrap opacity-60">{f.language}</td>
              <td>{f.lines}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {files.length > LIMIT && <p className="p-3 text-center text-xs opacity-60">Showing first {LIMIT}. Narrow the filters to see more.</p>}
    </div>
  )
}

export default FileTable
