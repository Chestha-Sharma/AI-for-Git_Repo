import React from 'react'
import { Link } from 'react-router-dom'
import useThemeStore from '../store/useThemeStore.js'
import AddRepoButton from './AddRepoButton.jsx'
import RepoSelect from './RepoSelect.jsx'
import { LINK } from '../constants/ui.js'

const Navbar = () => {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <header className="fixed top-0 z-40 h-12 w-full border-b border-base-300 bg-base-100">
      <div className="flex h-full items-center justify-between px-5">
        <Link to="/" className="font-mono text-[15px] font-medium tracking-tight">
          code<span className="text-primary">lens</span>
          <span className="text-primary">_</span>
        </Link>

        <div className="flex items-center gap-3">
          <RepoSelect className="max-w-[9rem] md:hidden" />
          <AddRepoButton />
          <button className={`${LINK} text-sm`} onClick={toggleTheme}>
            {theme === 'paper' ? 'dark' : 'light'}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
