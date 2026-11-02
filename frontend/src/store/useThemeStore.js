import { create } from 'zustand'

// themes are "paper" (light) and "ink" (dark). old saved values (light/dark) are mapped over
const saved = localStorage.getItem('codelens-theme')
const initial = saved === 'ink' || saved === 'dark' ? 'ink' : 'paper'

const useThemeStore = create((set) => ({
  theme: initial,
  toggleTheme: () =>
    set((state) => {
      const theme = state.theme === 'paper' ? 'ink' : 'paper'
      localStorage.setItem('codelens-theme', theme)
      return { theme }
    }),
}))

export default useThemeStore
