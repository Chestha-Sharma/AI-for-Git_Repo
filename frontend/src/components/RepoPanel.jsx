import React, { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, FileCode, Folder, Search } from 'lucide-react'

const buildTree = (files) => {
  const root = { children: {}, files: [] }
  files.forEach((f) => {
    const parts = f.path.split('/')
    let node = root
    parts.slice(0, -1).forEach((p) => {
      if (!node.children[p]) node.children[p] = { children: {}, files: [] }
      node = node.children[p]
    })
    node.files.push({ name: parts[parts.length - 1], file: f })
  })
  return root
}

const countFiles = (node) => node.files.length + Object.values(node.children).reduce((s, c) => s + countFiles(c), 0)

const Folder_ = ({ name, node, depth, onOpen }) => {
  const [open, setOpen] = useState(depth === 0 && name !== '.github')
  return (
    <li>
      <button className="flex w-full items-center gap-1 rounded px-1 py-1 text-left text-xs hover:bg-base-200" style={{ paddingLeft: depth * 12 + 4 }} onClick={() => setOpen(!open)}>
        {open ? <ChevronDown className="size-3 shrink-0" /> : <ChevronRight className="size-3 shrink-0" />}
        <Folder className="size-3.5 shrink-0 text-warning" />
        <span className="truncate font-medium">{name}</span>
        <span className="ml-auto opacity-40">{countFiles(node)}</span>
      </button>
      {open && <Tree node={node} depth={depth + 1} onOpen={onOpen} />}
    </li>
  )
}

const Tree = ({ node, depth, onOpen }) => (
  <ul>
    {Object.keys(node.children).sort().map((name) => (
      <Folder_ key={name} name={name} node={node.children[name]} depth={depth} onOpen={onOpen} />
    ))}
    {node.files.sort((a, b) => a.name.localeCompare(b.name)).map(({ name, file }) => (
      <li key={file.id}>
        <button className="flex w-full items-center gap-1.5 rounded px-1 py-1 text-left text-xs hover:bg-primary/10 hover:text-primary" style={{ paddingLeft: depth * 12 + 18 }} onClick={() => onOpen({ repo: file.repo, path: file.path })}>
          <FileCode className="size-3.5 shrink-0 opacity-60" />
          <span className="truncate">{name}</span>
        </button>
      </li>
    ))}
  </ul>
)

// assistant page ke left side par: repo ki info + file explorer
const RepoPanel = ({ repo, files, onOpen }) => {
  const [q, setQ] = useState('')
  const tree = useMemo(() => buildTree(files), [files])
  const matches = useMemo(() => {
    const t = q.trim().toLowerCase()
    return t ? files.filter((f) => f.path.toLowerCase().includes(t)).slice(0, 60) : []
  }, [files, q])

  if (!repo) {
    return <div className="rounded-2xl border border-dashed border-base-300 p-6 text-center text-sm opacity-60">No repository yet. Click <b>Add repo</b> to index one.</div>
  }

  return (
    <div className="flex h-full min-h-[20rem] flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100/70 shadow-sm">
      <div className="space-y-2 border-b border-base-300 p-3">
        <h3 className="truncate text-sm font-bold">{repo.name}</h3>
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
        <label className="input input-bordered input-sm flex items-center gap-2">
          <Search className="size-3.5 opacity-50" />
          <input className="grow" placeholder="Find a file…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {q.trim() ? (
          matches.length === 0 ? (
            <p className="p-3 text-center text-xs opacity-60">No files match “{q}”.</p>
          ) : (
            <ul>
              {matches.map((f) => (
                <li key={f.id}>
                  <button className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-xs hover:bg-primary/10 hover:text-primary" onClick={() => onOpen({ repo: f.repo, path: f.path })}>
                    <FileCode className="size-3.5 shrink-0 opacity-60" />
                    <span className="truncate">{f.path}</span>
                  </button>
                </li>
              ))}
            </ul>
          )
        ) : (
          <Tree node={tree} depth={0} onOpen={onOpen} />
        )}
      </div>
    </div>
  )
}

export default RepoPanel
