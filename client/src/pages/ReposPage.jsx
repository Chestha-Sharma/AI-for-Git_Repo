import React from 'react'
import { useNavigate } from 'react-router-dom'
import useRepoStore from '../store/useRepoStore.js'
import useFileStore from '../store/useFileStore.js'
import PageHeader from '../components/PageHeader.jsx'
import RepoCard from '../components/RepoCard.jsx'
import EmptyState from '../components/EmptyState.jsx'

const ReposPage = () => {
  const navigate = useNavigate()
  const { repos, activeRepo, setActiveRepo, removeRepo } = useRepoStore()
  const { setFilters, clearFilters } = useFileStore()

  const browse = (repo) => {
    setActiveRepo(repo.id)
    clearFilters()
    setFilters({ repo: repo.id })
    navigate('/files')
  }

  const askAI = (repo) => {
    setActiveRepo(repo.id)
    navigate('/assistant')
  }

  return (
    <div>
      <PageHeader title="Repositories" subtitle="Pick a repository to browse its files or ask the AI about it" />

      {repos.length === 0 ? (
        <EmptyState text="No repositories yet. Click Add repo or run `npm run seed`." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {repos.map((r) => (
            <RepoCard key={r.id} repo={r} isActive={r.id === activeRepo} onBrowse={browse} onAsk={askAI} onDelete={(repo) => window.confirm(`Delete ${repo.name}?`) && removeRepo(repo.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ReposPage
