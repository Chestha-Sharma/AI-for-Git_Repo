import React, { useCallback, useMemo, useState } from 'react'
import { Trash2 } from 'lucide-react'
import useChatStore from '../store/useChatStore.js'
import useFileStore from '../store/useFileStore.js'
import useActiveRepo from '../hooks/useActiveRepo.js'
import PageHeader from '../components/PageHeader.jsx'
import RepoSelect from '../components/RepoSelect.jsx'
import ChatWindow from '../components/ChatWindow.jsx'
import RepoPanel from '../components/RepoPanel.jsx'
import CodeViewer from '../components/CodeViewer.jsx'
import EmptyState from '../components/EmptyState.jsx'

const AssistantPage = () => {
  const repo = useActiveRepo()
  const clearChat = useChatStore((s) => s.clearChat)
  const hasMessages = useChatStore((s) => (s.chats[repo?.id] || []).length > 0)
  const allFiles = useFileStore((s) => s.files)
  const [viewer, setViewer] = useState(null)

  const files = useMemo(() => (repo ? allFiles.filter((f) => f.repo === repo.id) : []), [allFiles, repo])

  // AI "timed.py" likhe to poora path dhoondh lo, taaki click karke khul sake
  const resolvePath = useCallback(
    (name) => {
      const hit = files.find((f) => f.path === name) || files.find((f) => f.path.endsWith('/' + name))
      return hit ? hit.path : null
    },
    [files]
  )

  if (!repo) return <EmptyState text="No repositories yet. Click Add repo or run `npm run seed`." />

  return (
    <div>
      <PageHeader title="AI Assistant" subtitle={`Ask about ${repo.name}. Answers use its code and cite the files and lines.`}>
        <div className="flex items-center gap-2">
          <RepoSelect />
          {hasMessages && (
            <button className="btn btn-ghost btn-sm gap-1" onClick={() => clearChat(repo.id)}>
              <Trash2 className="size-4" /> Clear
            </button>
          )}
        </div>
      </PageHeader>

      <div className="grid gap-4 lg:h-[calc(100vh-11rem)] lg:grid-cols-[18rem_1fr]">
        <div className="hidden min-h-0 lg:block">
          <RepoPanel repo={repo} files={files} onOpen={setViewer} />
        </div>
        <div className="h-[calc(100vh-13rem)] min-h-0 lg:h-full">
          <ChatWindow repo={repo} onOpen={setViewer} resolvePath={resolvePath} />
        </div>
      </div>

      {viewer && <CodeViewer repo={viewer.repo} path={viewer.path} start={viewer.start} end={viewer.end} onClose={() => setViewer(null)} />}
    </div>
  )
}

export default AssistantPage
