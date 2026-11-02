import React from 'react'
import { useNavigate } from 'react-router-dom'
import useFileStore from '../store/useFileStore.js'
import useRepoStore from '../store/useRepoStore.js'
import PageHeader from '../components/PageHeader.jsx'
import PageLoader from '../components/PageLoader.jsx'
import StatCard from '../components/StatCard.jsx'
import LanguageChart from '../components/LanguageChart.jsx'
import RepoCard from '../components/RepoCard.jsx'
import EmptyState from '../components/EmptyState.jsx'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { files, isLoading, setFilters, clearFilters } = useFileStore()
  const { repos, activeRepo, setActiveRepo, removeRepo } = useRepoStore()

  if (isLoading && files.length === 0) return <PageLoader />

  const lines = repos.reduce((sum, r) => sum + r.lines, 0)
  const chunks = repos.reduce((sum, r) => sum + r.chunks, 0)

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

  const openLanguage = (language) => {
    clearFilters()
    setFilters({ language })
    navigate('/files')
  }

  return (
    <div className="max-w-5xl">
      <PageHeader title="Overview" subtitle="What you have indexed so far" />

      <div className="mb-8 grid grid-cols-2 gap-x-6 gap-y-4 border-b border-base-300 pb-6 lg:grid-cols-4">
        <StatCard title="repositories" value={repos.length} />
        <StatCard title="files" value={files.length.toLocaleString()} />
        <StatCard title="lines of code" value={lines.toLocaleString()} />
        <StatCard title="code chunks" value={chunks.toLocaleString()} />
      </div>

      <div className="mb-8">
        <LanguageChart files={files} onSelect={openLanguage} />
      </div>

      <h3 className="mb-2 text-sm font-semibold">Repositories</h3>
      {repos.length === 0 ? (
        <EmptyState text="No repositories yet. Use “add repo” at the top or run `npm run seed`." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {repos.map((r) => (
            <RepoCard key={r.id} repo={r} isActive={r.id === activeRepo} onBrowse={browse} onAsk={askAI} onDelete={(repo) => window.confirm(`Delete ${repo.name}?`) && removeRepo(repo.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardPage
