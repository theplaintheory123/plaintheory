'use client'

import { useState, useTransition } from 'react'
import { deletePlaybookAction } from '@/lib/actions/playbook'

type Props = {
  playbookId: string
  playbookTitle: string
}

export function DeletePlaybookButton({ playbookId, playbookTitle }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      await deletePlaybookAction(playbookId)
    })
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600">Delete "{playbookTitle}"?</span>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {isPending ? 'Deleting...' : 'Confirm Delete'}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="rounded-xl border-2 border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
    >
      Delete Playbook
    </button>
  )
}
