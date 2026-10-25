import React from 'react'
import { Inbox } from 'lucide-react'

const EmptyState = ({ text }) => {
  return (
    <div className="flex flex-col items-center gap-2 p-8 text-center text-sm opacity-60">
      <Inbox className="size-8 opacity-50" />
      <p>{text}</p>
    </div>
  )
}

export default EmptyState
