import React from 'react'

const EmptyState = ({ text }) => {
  return (
    <div className="rounded border border-dashed border-base-300 p-8 text-center text-sm opacity-70">
      <p>{text}</p>
    </div>
  )
}

export default EmptyState
