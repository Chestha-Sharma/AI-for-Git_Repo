import React from 'react'
import { NavLink } from 'react-router-dom'
import { ExternalLink, FolderGit2 } from 'lucide-react'
import { NAV_LINKS } from '../constants/index.js'
import useChatStore from '../store/useChatStore.js'
import useRepoStore from '../store/useRepoStore.js'
import useActiveRepo from '../hooks/useActiveRepo.js'

const Sidebar = () => {
  const { llm, provider } = useChatStore()
  const { repos, setActiveRepo } = useRepoStore()
  const repo = useActiveRepo()

  return (
    <>
      {/* desktop: left sidebar */}
      <aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-56 flex-col gap-3 border-r border-base-300 bg-base-100/70 p-3 backdrop-blur-xl md:flex">
        {/* abhi kis repo par kaam ho raha hai */}
        <div className="rounded-xl border border-base-300 bg-base-100 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wide opacity-50">Working on</p>
          {repo ? (
            <>
              <a href={repo.url} target="_blank" rel="noreferrer" className="mt-1 flex items-center gap-2 font-semibold hover:text-primary" title="Open on GitHub">
                <FolderGit2 className="size-4 shrink-0 text-primary" />
                <span className="truncate text-sm">{repo.name}</span>
                <ExternalLink className="ml-auto size-3 shrink-0 opacity-40" />
              </a>
              <p className="mt-0.5 text-xs opacity-60">{repo.files} files · {repo.lines.toLocaleString()} lines</p>
            </>
          ) : (
            <p className="mt-1 text-xs opacity-60">No repository yet. Click Add repo.</p>
          )}
        </div>

        <ul className="menu gap-1 p-0">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink to={to} end={to === '/'} className={({ isActive }) => `rounded-xl text-sm font-medium ${isActive ? 'active !bg-primary !text-primary-content shadow-md' : ''}`}>
                <Icon className="size-4" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* saari indexed repos, click karke switch karo */}
        <div className="min-h-0 flex-1 overflow-auto">
          {repos.length > 1 && (
            <>
              <p className="mb-1 px-1 text-[10px] font-medium uppercase tracking-wide opacity-50">Your repositories</p>
              <ul className="space-y-0.5">
                {repos.map((r) => (
                  <li key={r.id}>
                    <button className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-base-200 ${r.id === repo?.id ? 'bg-base-200 font-semibold' : ''}`} onClick={() => setActiveRepo(r.id)}>
                      <span className={`size-1.5 shrink-0 rounded-full ${r.id === repo?.id ? 'bg-primary' : 'bg-base-300'}`} />
                      <span className="truncate">{r.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* AI model ka status, taaki pata rahe jawab LLM se aa raha hai ya nahi */}
        <div className="rounded-xl border border-base-300 bg-base-100 p-3 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <span className={`size-2 rounded-full ${llm ? 'bg-success' : llm === false ? 'bg-warning' : 'bg-base-300'}`} />
            {llm ? `AI connected (${provider})` : llm === false ? 'AI not connected' : 'Checking AI…'}
          </div>
          {llm === false && <p className="mt-1 opacity-60">Add an API key in backend/.env for written answers.</p>}
        </div>
      </aside>

      {/* mobile: bottom navigation */}
      <nav className="btm-nav btm-nav-sm z-40 border-t border-base-300 md:hidden">
        {NAV_LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active text-primary' : '')}>
            <Icon className="size-4" />
            <span className="btm-nav-label text-xs">{label.replace('AI ', '')}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}

export default Sidebar
