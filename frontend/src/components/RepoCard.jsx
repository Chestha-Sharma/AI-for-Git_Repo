import React from 'react'
import { formatDateTime } from '../lib/utils.js'
import { LINK } from '../constants/ui.js'

const RepoCard = ({ repo, isActive, onBrowse, onAsk, onDelete }) => {
  const langs = Object.entries(repo.languages).map(([lang, n]) => `${lang} ${n}`).join(', ')

  return (
    <div className={`rounded border bg-base-100 p-4 ${isActive ? 'border-l-4 border-primary' : 'border-base-300'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-mono text-sm font-medium">{repo.name}</h3>
          <p className="text-xs opacity-50">indexed {formatDateTime(repo.indexedAt)}</p>
        </div>
        <button className={`${LINK} shrink-0 text-xs opacity-60`} onClick={() => onDelete(repo)}>delete</button>
      </div>

      <p className="mt-3 font-mono text-xs">
        {repo.files} files · {repo.lines.toLocaleString()} lines · {repo.chunks} chunks
      </p>
      {langs && <p className="mt-1 text-xs opacity-60">{langs}</p>}

      <div className="mt-4 flex items-center gap-4 text-sm">
        <button className={`${LINK}`} onClick={() => onBrowse(repo)}>Browse files</button>
        <button className={`${LINK} font-medium text-primary`} onClick={() => onAsk(repo)}>Ask about it</button>
      </div>
    </div>
  )
}

export default RepoCard
