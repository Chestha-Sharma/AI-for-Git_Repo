import React from 'react'
import { Bot, FileCode, FolderGit2, Trash2 } from 'lucide-react'
import { formatDateTime } from '../lib/utils.js'

const RepoCard = ({ repo, isActive, onBrowse, onAsk, onDelete }) => {
  return (
    <div className={`card border bg-base-100/80 shadow-sm transition hover:shadow-md ${isActive ? 'border-primary ring-1 ring-primary/30' : 'border-base-300'}`}>
      <div className="card-body gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FolderGit2 className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-semibold">{repo.name}</h3>
              <p className="text-xs opacity-50">indexed {formatDateTime(repo.indexedAt)}</p>
            </div>
          </div>
          <button className="btn btn-ghost btn-xs btn-circle" onClick={() => onDelete(repo)} aria-label="Delete repository">
            <Trash2 className="size-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          {[['Files', repo.files], ['Lines', repo.lines.toLocaleString()], ['Chunks', repo.chunks]].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-base-200 py-1.5">
              <p className="text-sm font-semibold">{value}</p>
              <p className="text-[10px] uppercase tracking-wide opacity-50">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1">
          {Object.entries(repo.languages).map(([lang, n]) => (
            <span key={lang} className="badge badge-ghost badge-sm">{lang} {n}</span>
          ))}
        </div>

        <div className="card-actions justify-end">
          <button className="btn btn-ghost btn-sm gap-1" onClick={() => onBrowse(repo)}>
            <FileCode className="size-3.5" /> Browse files
          </button>
          <button className="btn btn-primary btn-sm gap-1" onClick={() => onAsk(repo)}>
            <Bot className="size-3.5" /> Ask AI
          </button>
        </div>
      </div>
    </div>
  )
}

export default RepoCard
