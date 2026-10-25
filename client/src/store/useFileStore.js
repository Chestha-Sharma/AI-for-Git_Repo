import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios.js'

const DEFAULT_FILTERS = { q: '', language: 'ALL', repo: 'ALL' }

const useFileStore = create((set) => ({
  files: [],
  isLoading: false,
  filters: DEFAULT_FILTERS,

  fetchFiles: async () => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.get('/files', { params: { limit: 5000 } })
      set({ files: res.data })
    } catch (error) {
      toast.error('Could not reach the CodeLens API. Is the backend running on port 4000?', { id: 'api-error' })
    } finally {
      set({ isLoading: false })
    }
  },

  setFilters: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  clearFilters: () => set({ filters: DEFAULT_FILTERS }),
}))

export default useFileStore
