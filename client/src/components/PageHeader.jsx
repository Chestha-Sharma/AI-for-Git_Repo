import React from 'react'

// har page ke upar same heading dikhane ke liye
const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm opacity-60">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export default PageHeader
