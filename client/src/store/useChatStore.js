import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import { makeId } from '../lib/utils.js'

const useChatStore = create((set, get) => ({
  chats: {}, // each repo has its own chat: { repoId: [messages] }
  isAsking: false,
  llm: null, // null = unknown, true/false = whether an AI key is set
  provider: '',

  fetchStatus: async () => {
    try {
      const res = await axiosInstance.get('/status')
      set({ llm: res.data.llm, provider: res.data.provider })
    } catch (error) {
      // if the backend is down, the toast is already shown
    }
  },

  addMessage: (repoId, message) =>
    set((state) => ({ chats: { ...state.chats, [repoId]: [...(state.chats[repoId] || []), message] } })),

  askQuestion: async (question, repoId) => {
    // send a few previous messages so follow-up questions make sense (code-only answers are left out)
    const history = (get().chats[repoId] || [])
      .filter((m) => m.role === 'user' || m.meta?.source === 'llm')
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }))

    get().addMessage(repoId, { id: makeId(), role: 'user', content: question })
    set({ isAsking: true })

    try {
      const res = await axiosInstance.post('/assistant/ask', { question, repoId, history })
      get().addMessage(repoId, { id: makeId(), role: 'assistant', ...res.data })
    } catch (error) {
      get().addMessage(repoId, { id: makeId(), role: 'assistant', content: 'The assistant did not respond. Check that the backend is running, then try again.' })
    } finally {
      set({ isAsking: false })
    }
  },

  rateMessage: (repoId, id, rating) => {
    set((state) => ({
      chats: { ...state.chats, [repoId]: (state.chats[repoId] || []).map((m) => (m.id === id ? { ...m, rating } : m)) },
    }))
    axiosInstance.post('/assistant/feedback', { messageId: id, rating }).catch(() => {})
  },

  clearChat: (repoId) => set((state) => ({ chats: { ...state.chats, [repoId]: [] } })),
}))

export default useChatStore
