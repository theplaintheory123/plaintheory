'use client'

import { useState } from 'react'
import { Share2, X, Copy, Check, Link2, Info } from 'lucide-react'

type Props = {
  playbookId: string
  workspaceId: string
}

export function ShareButton({ playbookId, workspaceId }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/share/${workspaceId}/playbook/${playbookId}`
    : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
      >
        <Share2 className="h-4 w-4 text-slate-400 transition-colors group-hover:text-indigo-500" />
        Share
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Share Playbook</h3>
                  <p className="text-xs text-slate-500">Share read-only access</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="mb-4 text-sm text-slate-600">
                Share this link with anyone to give them read-only access to this playbook.
              </p>

              <div className="mb-4 flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
                <button
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                    copied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-amber-700 ring-1 ring-amber-200/50">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p className="text-xs">
                  You need to enable workspace sharing in Settings for this link to work.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
