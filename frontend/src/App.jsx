import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import FilesPage from './pages/FilesPage.jsx'
import ReposPage from './pages/ReposPage.jsx'
import StructurePage from './pages/StructurePage.jsx'
import AssistantPage from './pages/AssistantPage.jsx'
import useThemeStore from './store/useThemeStore.js'
import useFileStore from './store/useFileStore.js'
import useRepoStore from './store/useRepoStore.js'
import useChatStore from './store/useChatStore.js'

const App = () => {
  const { theme } = useThemeStore()
  const { fetchFiles } = useFileStore()
  const { fetchRepos } = useRepoStore()
  const { fetchStatus } = useChatStore()

  // fetch all the data on first load
  useEffect(() => {
    fetchRepos()
    fetchFiles()
    fetchStatus()
  }, [fetchRepos, fetchFiles, fetchStatus])

  // apply the DaisyUI theme to the whole page
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div>
      <Navbar />
      <Sidebar />

      <main className="min-h-screen p-4 pb-20 pt-20 md:ml-56 md:pb-4">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/files" element={<FilesPage />} />
          <Route path="/repos" element={<ReposPage />} />
          <Route path="/structure" element={<StructurePage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Toaster />
    </div>
  )
}

export default App
