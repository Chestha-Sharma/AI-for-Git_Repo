import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios.js'
import useFileStore from './useFileStore.js'

const SAVED_KEY = 'codelens-active-repo'

const useRepoStore = create((set, get) => ({
  repos: [],
  activeRepo: localStorage.getItem(SAVED_KEY) || '', // the repo currently being worked on
  progress: null, // text shown while indexing is running (null = not indexing)

  fetchRepos: async () => {
    try {
      const res = await axiosInstance.get('/repos')
      const repos = res.data
      // if the saved repo was deleted or this is the first run, pick the latest repo
      const { activeRepo } = get()
      const valid = repos.some((r) => r.id === activeRepo)
      set({ repos })
      if (!valid) get().setActiveRepo(repos[0]?.id || '')
    } catch (error) {
      toast.error('Could not load repositories', { id: 'api-error' })
    }
  },

  addRepo: async (url) => {
    set({ progress: 'Indexing…' })
    try {
      const res = await axiosInstance.post('/repos', { url }, { timeout: 600000 })
      toast.success(`Indexed ${res.data.name}`)
      await get().fetchRepos()
      get().setActiveRepo(res.data.id)
      useFileStore.getState().fetchFiles()
      return true
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Indexing failed. Try again.')
      return false
    } finally {
      set({ progress: null })
    }
  },

  removeRepo: async (id) => {
    try {
      await axiosInstance.delete(`/repos/${id}`)
      await get().fetchRepos()
      useFileStore.getState().fetchFiles()
    } catch (error) {
      toast.error('Could not delete the repository')
    }
  },

  setActiveRepo: (id) => {
    localStorage.setItem(SAVED_KEY, id)
    set({ activeRepo: id })
  },
}))

export default useRepoStore
