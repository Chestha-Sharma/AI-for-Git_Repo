import React from 'react'
import { NavLink } from 'react-router-dom'
import { NAV_LINKS } from '../constants/index.js'
import useChatStore from '../store/useChatStore.js'
import useRepoStore from '../store/useRepoStore.js'
import useActiveRepo from '../hooks/useActiveRepo.js'
import { LABEL } from '../constants/ui.js'

const Sidebar = () => {
  const { llm, provider } = useChatStore()
  const { repos, setActiveRepo } = useRepoStore()
  const repo = useActiveRepo()

  return (
    <>
      {/* desktop: left sidebar */}
      <aside className="fixed left-0 top-12 hidden h-[calc(100vh-3rem)] w-52 flex-col border-r border-base-300 bg-base-100 px-4 py-5 md:flex">
        {/* abhi kis repo par kaam ho raha hai */}
        <div className="mb-6">
          <p className={`${LABEL} mb-1`}>current repo</p>
          {repo ? (
            <>
              <a href={repo.url} target="_blank" rel="noreferrer" className="block truncate font-mono text-sm font-medium hover:text-primary" title="Open on GitHub">
                {repo.name}
              </a>
              <p className="mt-0.5 font-mono text-xs opacity-60">{repo.files} files, {repo.lines.toLocaleString()} lines</p>
            </>
          ) : (
            <p className="text-sm opacity-60">Nothing indexed yet. Use “add repo” at the top.</p>
          )}
        </div>

        <nav>
          <ul className="space-y-0.5">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `block border-l-2 py-1 pl-3 text-sm ${isActive ? 'border-primary font-medium' : 'border-transparent opacity-70 hover:opacity-100'}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* saari indexed repos, click karke switch karo */}
        <div className="mt-6 min-h-0 flex-1 overflow-auto">
          {repos.length > 1 && (
            <>
              <p className={`${LABEL} mb-1`}>switch repo</p>
              <ul>
                {repos.map((r) => (
                  <li key={r.id}>
                    <button
                      className={`w-full truncate py-0.5 text-left font-mono text-xs ${r.id === repo?.id ? 'font-medium text-primary' : 'opacity-70 hover:opacity-100'}`}
                      onClick={() => setActiveRepo(r.id)}
                    >
                      {r.id === repo?.id ? '> ' : '  '}{r.name}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* AI model ka status, taaki pata rahe jawab LLM se aa raha hai ya nahi */}
        <div className="border-t border-base-300 pt-3 text-xs">
          <p className="flex items-center gap-2">
            <span className={`inline-block size-1.5 rounded-full ${llm ? 'bg-success' : llm === false ? 'bg-warning' : 'bg-base-300'}`} />
            {llm ? `model: ${provider}` : llm === false ? 'model not connected' : 'checking model…'}
          </p>
          {llm === false && <p className="mt-1 opacity-60">Add an API key in backend/.env for written answers.</p>}
        </div>
      </aside>

      {/* mobile: bottom navigation */}
      <nav className="fixed bottom-0 z-40 flex w-full border-t border-base-300 bg-base-100 md:hidden">
        {NAV_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `flex-1 py-3 text-center text-xs ${isActive ? 'border-t-2 border-primary font-medium text-primary' : 'border-t-2 border-transparent opacity-70'}`}
          >
            {label === 'Repositories' ? 'Repos' : label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}

export default Sidebar
