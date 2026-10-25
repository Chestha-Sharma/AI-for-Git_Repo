import React from 'react'

const StatCard = ({ title, value, icon: Icon, color = 'text-primary' }) => {
  return (
    <div className="card border border-base-300 bg-base-100/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="card-body flex-row items-center justify-between p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide opacity-60">{title}</p>
          <p className="mt-0.5 text-2xl font-bold">{value}</p>
        </div>
        <div className="flex size-11 items-center justify-center rounded-xl bg-base-200">
          <Icon className={`size-6 ${color}`} />
        </div>
      </div>
    </div>
  )
}

export default StatCard
