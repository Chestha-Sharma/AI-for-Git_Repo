import React, { useEffect, useRef } from 'react'
import useChatStore from '../store/useChatStore.js'
import { SUGGESTED_QUESTIONS } from '../constants/index.js'
import ChatMessage from './ChatMessage.jsx'
import ChatInput from './ChatInput.jsx'
import { LINK, LABEL } from '../constants/ui.js'

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
    <div className="flex h-full min-h-[28rem] flex-col overflow-hidden rounded border border-base-300">
      {llm === false && (
        <div className="border-b border-warning/40 bg-warning/10 px-4 py-2 text-xs">
          <span className="font-semibold">Model not connected.</span> You will only get the closest code, not written answers. Add <code className="font-mono">MISTRAL_API_KEY</code> or <code className="font-mono">GROQ_API_KEY</code> to <code className="font-mono">backend/.env</code>, then restart <code className="font-mono">npm run dev</code>.
        </div>
      )}

      <div className="flex-1 space-y-6 overflow-auto p-5">
        {messages.length === 0 && (
          <div className="max-w-xl pt-4">
            <h3 className="font-serif text-xl font-semibold">Ask about {repo ? repo.name : 'your repository'}</h3>
            <p className="mt-1 text-sm opacity-60">It searches the code first, then answers and points to the files and lines it used.</p>
            <ul className="mt-5 space-y-1.5 text-sm">
              {SUGGESTED_QUESTIONS.map((q) => (
                <li key={q}>
                  <button className={`${LINK} text-left`} onClick={() => send(q)}>{q}</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} onOpen={onOpen} resolvePath={resolvePath} />
        ))}

        {isAsking && (
          <div>
            <p className={`${LABEL} mb-1 font-mono`}>codelens</p>
            <p className="text-sm opacity-70">Reading the repository<span className="animate-pulse">…</span></p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={send} disabled={isAsking} placeholder={repo ? `Ask about ${repo.name}` : 'Ask about the code'} />
    </div>
  )
}

export default ChatWindow
