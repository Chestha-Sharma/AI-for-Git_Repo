import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useRepoStore from '../store/useRepoStore.js'
import useStructureStore from '../store/useStructureStore.js'
import useFileStore from '../store/useFileStore.js'
import PageHeader from '../components/PageHeader.jsx'
import RepoSelect from '../components/RepoSelect.jsx'
import DependencyGraph from '../components/DependencyGraph.jsx'
import ModuleTable from '../components/ModuleTable.jsx'
import EmptyState from '../components/EmptyState.jsx'

const StructurePage = () => {
  const navigate = useNavigate()
  const { repos, activeRepo } = useRepoStore()
  const { nodes, edges, fetchGraph } = useStructureStore()
  const { setFilters, clearFilters } = useFileStore()
  const repoId = activeRepo || repos[0]?.id

  useEffect(() => {
    if (repoId) fetchGraph(repoId)
  }, [repoId, fetchGraph])

  const viewModuleFiles = (id) => {
    clearFilters()
    setFilters({ repo: repoId, q: id === '(root)' ? '' : `${id}/` })
    navigate('/files')
  }

  if (!repoId) return <EmptyState text="No repositories yet. Click Add repo or run `npm run seed`." />

  return (
    <div className="space-y-4">
      <PageHeader title="Structure" subtitle="Which module imports which, and how big each one is">
        <RepoSelect />
      </PageHeader>
      <DependencyGraph nodes={nodes} edges={edges} onSelect={viewModuleFiles} />
      <ModuleTable nodes={nodes} edges={edges} onSelect={viewModuleFiles} />
    </div>
  )
}

export default StructurePage
