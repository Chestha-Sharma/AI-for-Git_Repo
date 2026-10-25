import React, { useState } from 'react'
import { ArrowUp } from 'lucide-react'

const ChatInput = ({ onSend, disabled, placeholder }) => {
  const [text, setText] = useState('')

  const handleSend = () => {
    const question = text.trim()
    if (!question || disabled) return
    onSend(question)
    setText('')
  }

  return (
    <div className="border-t border-base-300 bg-base-100/80 p-3">
      <div className="flex items-end gap-2 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-sm focus-within:border-primary">
        <textarea
          rows={1}
          className="max-h-32 min-h-[2.25rem] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none"
          placeholder={placeholder || 'Ask about the code…'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
        />
        <button className="btn btn-primary btn-sm btn-circle" onClick={handleSend} disabled={disabled || !text.trim()} aria-label="Send">
          <ArrowUp className="size-4" />
        </button>
      </div>
      <p className="mt-1.5 text-center text-[11px] opacity-40">Enter to send · Shift+Enter for a new line</p>
    </div>
  )
}

export default ChatInput
