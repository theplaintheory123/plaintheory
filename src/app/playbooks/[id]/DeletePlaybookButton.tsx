'use client'

import { useState, useTransition } from 'react'
import { deletePlaybookAction } from '@/lib/actions/playbook'
import { Trash2, Loader2, X, AlertTriangle } from 'lucide-react'

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
      <div className="flex items-center gap-3 rounded-xl bg-red-50 p-3 ring-1 ring-red-200">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500" />
        <span className="text-sm font-medium text-red-700">Delete "{playbookTitle}"?</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isPending}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-white"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Confirm
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
    >
      <Trash2 className="h-4 w-4 text-slate-400 transition-colors group-hover:text-red-500" />
      Delete
    </button>
  )
}
