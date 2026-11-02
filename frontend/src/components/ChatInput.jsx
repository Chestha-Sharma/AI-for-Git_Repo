import React, { useState } from 'react'

const ChatInput = ({ onSend, disabled, placeholder }) => {
  const [text, setText] = useState('')

  const handleSend = () => {
    const question = text.trim()
    if (!question || disabled) return
    onSend(question)
    setText('')
  }

  return (
    <div className="border-t border-base-300 p-3">
      <div className="flex items-end gap-2">
        <textarea
          rows={2}
          className="textarea textarea-bordered max-h-32 flex-1 resize-none text-sm leading-snug"
          placeholder={placeholder || 'Ask about the code'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
        />
        <button className="btn btn-primary btn-sm h-10 font-normal" onClick={handleSend} disabled={disabled || !text.trim()}>
          Send
        </button>
      </div>
      <p className="mt-1.5 text-xs opacity-40">Enter sends, Shift+Enter adds a new line</p>
    </div>
  )
}

export default ChatInput
