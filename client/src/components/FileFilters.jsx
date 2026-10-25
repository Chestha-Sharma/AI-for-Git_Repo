import React from 'react'
import { Search, X } from 'lucide-react'
import useFileStore from '../store/useFileStore.js'
import useRepoStore from '../store/useRepoStore.js'

const FileFilters = ({ total }) => {
  const { files, filters, setFilters, clearFilters } = useFileStore()
  const repos = useRepoStore((s) => s.repos)
  const languages = [...new Set(files.map((f) => f.language))].sort()

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="input input-bordered input-sm flex min-w-[12rem] flex-1 items-center gap-2">
        <Search className="size-4 opacity-60" />
        <input type="text" className="grow" placeholder="Search file paths" value={filters.q} onChange={(e) => setFilters({ q: e.target.value })} />
      </label>

      <select className="select select-bordered select-sm" value={filters.language} onChange={(e) => setFilters({ language: e.target.value })}>
        <option value="ALL">All languages</option>
        {languages.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      <select className="select select-bordered select-sm" value={filters.repo} onChange={(e) => setFilters({ repo: e.target.value })}>
        <option value="ALL">All repos</option>
        {repos.map((r) => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>

      <button className="btn btn-ghost btn-sm gap-1" onClick={clearFilters}>
        <X className="size-4" /> Clear
      </button>
      <span className="text-xs opacity-60">{total.toLocaleString()} matches</span>
    </div>
  )
}

export default FileFilters
