import { create } from 'zustand'

const useThemeStore = create((set) => ({
  theme: localStorage.getItem('codelens-theme') || 'light',
  toggleTheme: () =>
    set((state) => {
      const theme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('codelens-theme', theme)
      return { theme }
    }),
}))

export default useThemeStore
