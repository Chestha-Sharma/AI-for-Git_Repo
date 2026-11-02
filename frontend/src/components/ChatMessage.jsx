import React, { useState } from 'react'
import useChatStore from '../store/useChatStore.js'
import useRepoStore from '../store/useRepoStore.js'
import Markdown from './Markdown.jsx'
import { LINK, LABEL } from '../constants/ui.js'

const confidenceColor = (c) => (c >= 0.5 ? 'text-success' : c >= 0.25 ? 'text-warning' : 'text-error')

const ChatMessage = ({ message, onOpen, resolvePath }) => {
  const rateMessage = useChatStore((s) => s.rateMessage)
  const isUser = message.role === 'user'
  const repo = message.meta?.repoId
  const reindexRepo = useRepoStore((s) => s.reindexRepo)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const needsReindex = !isUser && message.meta?.note === 'index_empty'

  const open = (ref) => repo && onOpen({ repo, ...ref })

  const handleReindex = async () => {
    setBusy(true)
    const ok = await reindexRepo(repo)
    setBusy(false)
    if (ok) setDone(true)
  }

  // user question: simple tinted block. answer: plain text on the page, like a transcript
  if (isUser) {
    return (
      <div>
        <p className={`${LABEL} mb-1 font-mono`}>you</p>
        <p className="whitespace-pre-wrap border-l-2 border-base-300 pl-3 text-sm">{message.content}</p>
      </div>
    )
  }

  return (
    <div>
      <p className={`${LABEL} mb-1 font-mono`}>codelens</p>
      <Markdown text={message.content} onRef={open} resolvePath={resolvePath} />

      {/* chunks vector_db se gayab ho gaye hon to ek click me dobara bana do */}
      {needsReindex && (
        <button className="btn btn-primary btn-sm mt-2 font-normal" onClick={handleReindex} disabled={busy || done}>
          {busy ? 'Re-indexing…' : done ? 'Done, ask again' : 'Re-index this repo'}
        </button>
      )}

      {/* sources: kaun si file / lines se jawab aaya. click karo to code khulta hai */}
      {message.citations?.length > 0 && (
        <div className="mt-3">
          <p className={`${LABEL} mb-1`}>sources</p>
          <ul className="space-y-0.5">
            {message.citations.map((c, i) => (
              <li key={i}>
                <button title={c.snippet} className={`${LINK} max-w-full truncate text-left font-mono text-xs`} onClick={() => open({ path: c.path, start: c.start, end: c.end })}>
                  {c.path}:{c.start}-{c.end}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {message.meta && (
        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs opacity-80">
          <span className="opacity-60">{message.meta.source === 'extractive' ? 'code match only' : 'ai answer'}</span>
          {message.citations?.length > 0 && <span className={confidenceColor(message.meta.confidence)}>{(message.meta.confidence * 100).toFixed(0)}% match</span>}
          <span className="opacity-60">{(message.meta.latencyMs / 1000).toFixed(1)}s</span>
          <button className={`hover:text-primary ${message.rating === 1 ? 'font-medium text-primary' : 'opacity-60'}`} onClick={() => rateMessage(repo, message.id, 1)}>helpful</button>
          <button className={`hover:text-error ${message.rating === -1 ? 'font-medium text-error' : 'opacity-60'}`} onClick={() => rateMessage(repo, message.id, -1)}>not helpful</button>
        </p>
      )}
    </div>
  )
}

export default ChatMessage
