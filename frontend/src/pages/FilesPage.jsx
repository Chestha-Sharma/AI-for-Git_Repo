import React, { useEffect, useRef, useState } from 'react'
import useFileStore from '../store/useFileStore.js'
import useRepoStore from '../store/useRepoStore.js'
import useFilteredFiles from '../hooks/useFilteredFiles.js'
import PageHeader from '../components/PageHeader.jsx'
import PageLoader from '../components/PageLoader.jsx'
import FileFilters from '../components/FileFilters.jsx'
import LanguageChart from '../components/LanguageChart.jsx'
import FileTable from '../components/FileTable.jsx'
import CodeViewer from '../components/CodeViewer.jsx'

const FilesPage = () => {
  const { files, isLoading, setFilters } = useFileStore()
  const filtered = useFilteredFiles()
  const activeRepo = useRepoStore((s) => s.activeRepo)
  const [open, setOpen] = useState(null)

  // files hamesha active repo ki dikhao. sidebar se repo badlo to filter bhi badal jaye
  const firstRender = useRef(true)
  useEffect(() => {
    if (!activeRepo) return
    const alreadyFiltered = useFileStore.getState().filters.repo !== 'ALL'
    if (firstRender.current && alreadyFiltered) {
      firstRender.current = false
      return
    }
    firstRender.current = false
    setFilters({ repo: activeRepo })
  }, [activeRepo, setFilters])

  if (isLoading && files.length === 0) return <PageLoader />

  return (
    <div className="space-y-4">
      <PageHeader title="Files" subtitle="Browse every indexed file. Click a row to read the code" />

      <FileFilters total={filtered.length} />
      <LanguageChart files={filtered} onSelect={(language) => setFilters({ language })} />
      <FileTable files={filtered} onOpen={setOpen} />

      {open && <CodeViewer repo={open.repo} path={open.path} onClose={() => setOpen(null)} />}
    </div>
  )
}

export default FilesPage
