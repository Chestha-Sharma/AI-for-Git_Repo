import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import useRepoStore from '../store/useRepoStore.js'

const AddRepoButton = () => {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const { addRepo, progress } = useRepoStore()
  const indexing = progress !== null

  const submit = async () => {
    if (!url.trim() || indexing) return
    const ok = await addRepo(url.trim())
    if (ok) {
      setUrl('')
      setOpen(false)
    }
  }

  return (
    <>
      <button className="btn btn-primary btn-sm gap-2" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        <span className="hidden sm:inline">{indexing ? 'Indexing…' : 'Add repo'}</span>
      </button>

      {open && (
        <dialog className="modal modal-open">
          <div className="modal-box space-y-3">
            <h3 className="text-lg font-bold">Add a GitHub repository</h3>
            <p className="text-sm opacity-60">Public repos only. Indexing takes a minute or two.</p>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="https://github.com/owner/repo"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              disabled={indexing}
            />
            {indexing && (
              <p className="flex items-center gap-2 text-sm">
                <span className="loading loading-spinner loading-xs" /> {progress}
              </p>
            )}
            <div className="modal-action">
              <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>Close</button>
              <button className="btn btn-primary btn-sm" onClick={submit} disabled={indexing || !url.trim()}>Index repo</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setOpen(false)} />
        </dialog>
      )}
    </>
  )
}

export default AddRepoButton
