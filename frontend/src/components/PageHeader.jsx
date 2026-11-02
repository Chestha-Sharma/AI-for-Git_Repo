import React from 'react'

// har page ke upar same heading dikhane ke liye
const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-base-300 pb-4">
      <div>
        <h2 className="font-serif text-2xl font-semibold">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm opacity-60">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export default PageHeader
