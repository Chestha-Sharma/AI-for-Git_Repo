import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios.js'

const useStructureStore = create((set) => ({
  nodes: [], // { id, files, lines }
  edges: [], // { from, to }

  fetchGraph: async (repo) => {
    try {
      const res = await axiosInstance.get('/structure/graph', { params: { repo } })
      set({ nodes: res.data.nodes, edges: res.data.edges })
    } catch (error) {
      toast.error('Could not load the structure', { id: 'api-error' })
    }
  },
}))

export default useStructureStore
