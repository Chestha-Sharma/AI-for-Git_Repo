import React, { useEffect, useRef } from 'react'
import { AlertTriangle, Bot, Sparkles } from 'lucide-react'
import useChatStore from '../store/useChatStore.js'
import { SUGGESTED_QUESTIONS } from '../constants/index.js'
import ChatMessage from './ChatMessage.jsx'
import ChatInput from './ChatInput.jsx'

const NO_MESSAGES = []

const ChatWindow = ({ repo, onOpen, resolvePath }) => {
  const { isAsking, askQuestion, llm } = useChatStore()
  const messages = useChatStore((s) => s.chats[repo?.id]) || NO_MESSAGES
  const bottomRef = useRef(null)

  // scroll to the bottom as soon as a new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = (question) => repo && askQuestion(question, repo.id)

  return (
    <div className="flex h-full min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100/70 shadow-sm">
      {llm === false && (
        <div className="flex items-start gap-2 border-b border-warning/30 bg-warning/10 px-4 py-2 text-xs">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
          <p>
            <span className="font-semibold">AI model not connected.</span> You will only get the closest code, not written answers. Add <code className="font-mono">MISTRAL_API_KEY</code> or <code className="font-mono">GROQ_API_KEY</code> to <code className="font-mono">backend/.env</code>, then restart <code className="font-mono">npm run dev</code>.
          </p>
        </div>
      )}

      <div className="flex-1 space-y-5 overflow-auto p-4">
        {messages.length === 0 && (
          <div className="mx-auto flex max-w-xl flex-col items-center pt-6 text-center">
            <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-lg">
              <Bot className="size-7" />
            </div>
            <h3 className="text-xl font-bold">Ask anything about {repo ? repo.name : 'your repository'}</h3>
            <p className="mt-1 text-sm opacity-60">I search the code, then answer and show the exact files and lines.</p>
            <div className="mt-5 grid w-full gap-2 sm:grid-cols-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button key={q} className="flex items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-3 py-2.5 text-left text-sm transition hover:border-primary hover:shadow-sm" onClick={() => send(q)}>
                  <Sparkles className="size-4 shrink-0 text-primary" />
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} onOpen={onOpen} resolvePath={resolvePath} />
        ))}

        {isAsking && (
          <div className="rise flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content">
              <Bot className="size-4" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-base-300 bg-base-100 px-4 py-2 text-sm opacity-80">
              <span className="loading loading-dots loading-sm" />
              <span>Reading the repository…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={send} disabled={isAsking} placeholder={repo ? `Ask about ${repo.name}…` : 'Ask about the code…'} />
    </div>
  )
}

export default ChatWindow
