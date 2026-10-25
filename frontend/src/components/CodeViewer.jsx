import React, { useEffect, useRef, useState } from 'react'
import { X, FileCode } from 'lucide-react'
import { axiosInstance } from '../lib/axios.js'
import PageLoader from './PageLoader.jsx'

// file ka poora code line numbers ke saath dikhata hai. start/end diye ho to wo lines highlight hoti hain
const CodeViewer = ({ repo, path, start, end, onClose }) => {
  const [content, setContent] = useState(null)
  const firstRef = useRef(null)

  useEffect(() => {
    setContent(null)
    axiosInstance
      .get('/files/content', { params: { repo, path } })
      .then((res) => setContent(res.data.content))
      .catch(() => setContent('Could not load this file.'))
  }, [repo, path])

  useEffect(() => {
    if (content !== null) firstRef.current?.scrollIntoView({ block: 'center' })
  }, [content])

  const last = end || start

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-4xl overflow-hidden p-0">
        <div className="flex items-center justify-between gap-3 border-b border-base-300 bg-base-100 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <FileCode className="size-4 shrink-0 text-primary" />
            <span className="truncate font-mono text-sm font-semibold">{path}</span>
            {start && <span className="badge badge-primary badge-outline badge-sm shrink-0">lines {start}{end && end !== start ? `-${end}` : ''}</span>}
          </div>
          <button className="btn btn-ghost btn-xs btn-circle" onClick={onClose} aria-label="Close"><X className="size-4" /></button>
        </div>
        {content === null ? (
          <PageLoader />
        ) : (
          <div className="max-h-[70vh] overflow-auto bg-base-200 py-2 font-mono text-xs">
            {content.split('\n').map((line, i) => {
              const n = i + 1
              const hit = start && n >= start && n <= last
              return (
                <div key={i} ref={n === start ? firstRef : null} className={`flex ${hit ? 'bg-primary/15' : ''}`}>
                  <span className={`w-12 shrink-0 select-none pr-3 text-right ${hit ? 'text-primary opacity-100' : 'opacity-40'}`}>{n}</span>
                  <span className="whitespace-pre">{line || ' '}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  )
}

export default CodeViewer
