import React from 'react'
import useRepoStore from '../store/useRepoStore.js'

const RepoSelect = ({ className = '' }) => {
  const { repos, activeRepo, setActiveRepo } = useRepoStore()

  if (repos.length === 0) return null

  return (
    <select className={`select select-bordered select-sm bg-base-100 ${className}`} value={activeRepo} onChange={(e) => setActiveRepo(e.target.value)}>
      {repos.map((r) => (
        <option key={r.id} value={r.id}>{r.name}</option>
      ))}
    </select>
  )
}

export default RepoSelect
