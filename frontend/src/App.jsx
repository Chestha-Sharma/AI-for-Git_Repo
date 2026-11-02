import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import FilesPage from './pages/FilesPage.jsx'
import ReposPage from './pages/ReposPage.jsx'
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
    <div className="min-h-screen bg-base-100 font-sans text-[15px] text-base-content antialiased">
      <Navbar />
      <Sidebar />

      <main className="min-h-screen px-5 pb-20 pt-16 md:ml-52 md:px-8 md:pb-6">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/files" element={<FilesPage />} />
          <Route path="/repos" element={<ReposPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
        </Routes>
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { borderRadius: '4px', fontSize: '0.85rem', background: 'var(--fallback-b1,oklch(var(--b1)))', color: 'var(--fallback-bc,oklch(var(--bc)))', border: '1px solid var(--fallback-b3,oklch(var(--b3)))', boxShadow: 'none' },
        }}
      />
    </div>
  )
}

export default App
