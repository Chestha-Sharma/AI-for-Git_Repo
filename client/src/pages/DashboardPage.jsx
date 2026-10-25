import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderGit2, FileCode, Braces, Layers } from 'lucide-react'
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
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your indexed repositories and code" />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard title="Repositories" value={repos.length} icon={FolderGit2} />
        <StatCard title="Files" value={files.length.toLocaleString()} icon={FileCode} color="text-info" />
        <StatCard title="Lines of code" value={lines.toLocaleString()} icon={Braces} color="text-success" />
        <StatCard title="Code chunks" value={chunks.toLocaleString()} icon={Layers} color="text-warning" />
      </div>

      <div className="mb-4">
        <LanguageChart files={files} onSelect={openLanguage} />
      </div>

      <h3 className="mb-2 font-semibold">Repositories</h3>
      {repos.length === 0 ? (
        <EmptyState text="No repositories yet. Click Add repo or run `npm run seed`." />
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
