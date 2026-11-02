import React, { useMemo, useState } from 'react'

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
      <button className="flex w-full items-center gap-1.5 py-0.5 text-left font-mono text-xs hover:text-primary" style={{ paddingLeft: depth * 12 + 4 }} onClick={() => setOpen(!open)}>
        <span className="w-2 shrink-0 opacity-50">{open ? '-' : '+'}</span>
        <span className="truncate">{name}/</span>
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
        <button className="block w-full truncate py-0.5 text-left font-mono text-xs opacity-80 hover:text-primary hover:opacity-100" style={{ paddingLeft: depth * 12 + 20 }} onClick={() => onOpen({ repo: file.repo, path: file.path })}>
          {name}
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
    return <div className="rounded border border-dashed border-base-300 p-6 text-center text-sm opacity-60">No repository yet. Use “add repo” to index one.</div>
  }

  return (
    <div className="flex h-full min-h-[20rem] flex-col overflow-hidden rounded border border-base-300">
      <div className="space-y-2 border-b border-base-300 p-3">
        <h3 className="truncate font-mono text-sm font-medium">{repo.name}</h3>
        <p className="font-mono text-xs opacity-60">{repo.files} files · {repo.lines.toLocaleString()} lines · {repo.chunks} chunks</p>
        <input className="input input-bordered input-sm w-full font-mono text-xs" placeholder="find a file" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="flex-1 overflow-auto p-2">
        {q.trim() ? (
          matches.length === 0 ? (
            <p className="p-3 text-center text-xs opacity-60">No files match “{q}”.</p>
          ) : (
            <ul>
              {matches.map((f) => (
                <li key={f.id}>
                  <button className="block w-full truncate px-1 py-0.5 text-left font-mono text-xs hover:text-primary" onClick={() => onOpen({ repo: f.repo, path: f.path })}>
                    {f.path}
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
