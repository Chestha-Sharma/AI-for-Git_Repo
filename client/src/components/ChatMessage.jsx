import React from 'react'
import { Bot, FileCode, ThumbsDown, ThumbsUp, User } from 'lucide-react'
import useChatStore from '../store/useChatStore.js'
import Markdown from './Markdown.jsx'

const confidenceColor = (c) => (c >= 0.5 ? 'badge-success' : c >= 0.25 ? 'badge-warning' : 'badge-error')

const ChatMessage = ({ message, onOpen, resolvePath }) => {
  const rateMessage = useChatStore((s) => s.rateMessage)
  const isUser = message.role === 'user'
  const repo = message.meta?.repoId

  const open = (ref) => repo && onOpen({ repo, ...ref })

  return (
    <div className={`rise flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${isUser ? 'bg-base-300' : 'bg-gradient-to-br from-primary to-secondary text-primary-content'}`}>
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </div>

      <div className={`min-w-0 max-w-[88%] space-y-2 ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block rounded-2xl px-4 py-2.5 text-left shadow-sm ${isUser ? 'rounded-tr-sm bg-primary text-primary-content' : 'rounded-tl-sm border border-base-300 bg-base-100'}`}>
          {isUser ? <p className="whitespace-pre-wrap text-sm">{message.content}</p> : <Markdown text={message.content} onRef={open} resolvePath={resolvePath} />}
        </div>

        {/* sources: kaun si file / lines se jawab aaya. click karo to code khulta hai */}
        {message.citations?.length > 0 && (
          <div className="text-left">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wide opacity-50">Sources</p>
            <div className="flex flex-wrap gap-1.5">
              {message.citations.map((c, i) => (
                <button
                  key={i}
                  title={c.snippet}
                  className="flex items-center gap-1.5 rounded-lg border border-base-300 bg-base-100 px-2 py-1 font-mono text-[11px] transition hover:border-primary hover:text-primary"
                  onClick={() => open({ path: c.path, start: c.start, end: c.end })}
                >
                  <FileCode className="size-3 shrink-0" />
                  <span className="max-w-[16rem] truncate">{c.path}</span>
                  <span className="opacity-50">{c.start}-{c.end}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {message.meta && (
          <div className="flex flex-wrap items-center gap-2 text-xs opacity-80">
            {message.meta.source === 'extractive' ? (
              <span className="badge badge-ghost badge-sm">Code match only</span>
            ) : (
              <span className="badge badge-primary badge-outline badge-sm">AI answer</span>
            )}
            {message.citations?.length > 0 && (
              <span className={`badge badge-sm ${confidenceColor(message.meta.confidence)} badge-outline`}>{(message.meta.confidence * 100).toFixed(0)}% match</span>
            )}
            <span className="opacity-60">{(message.meta.latencyMs / 1000).toFixed(1)}s</span>
            <button className={`hover:text-primary ${message.rating === 1 ? 'text-primary' : ''}`} onClick={() => rateMessage(repo, message.id, 1)} aria-label="Helpful">
              <ThumbsUp className="size-3.5" />
            </button>
            <button className={`hover:text-error ${message.rating === -1 ? 'text-error' : ''}`} onClick={() => rateMessage(repo, message.id, -1)} aria-label="Not helpful">
              <ThumbsDown className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
