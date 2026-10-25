import React from 'react'
import { Link } from 'react-router-dom'
import { Braces, Moon, Sun } from 'lucide-react'
import useThemeStore from '../store/useThemeStore.js'
import AddRepoButton from './AddRepoButton.jsx'
import RepoSelect from './RepoSelect.jsx'

const Navbar = () => {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <header className="fixed top-0 z-40 h-16 w-full border-b border-base-300 bg-base-100/70 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5 transition-all hover:opacity-80">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md">
            <Braces className="size-5 text-primary-content" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">CodeLens</h1>
        </Link>

        <div className="flex items-center gap-2">
          <RepoSelect className="max-w-[9rem] md:hidden" />
          <AddRepoButton />
          <button className="btn btn-ghost btn-sm btn-circle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
