import React from 'react'

// just a number with a label under it, no box
const StatCard = ({ title, value }) => {
  return (
    <div className="py-1">
      <p className="font-mono text-2xl font-medium">{value}</p>
      <p className="text-xs opacity-60">{title}</p>
    </div>
  )
}

export default StatCard
