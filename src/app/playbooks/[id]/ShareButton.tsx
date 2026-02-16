'use client'

import { useState } from 'react'
import { Share2, X, Copy, Check, Link2, Info, Globe, Users, Lock, ExternalLink } from 'lucide-react'
import Link from 'next/link'
type Props = {
  playbookId: string
  workspaceId: string
}

export function ShareButton({ playbookId, workspaceId }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareOption, setShareOption] = useState<'anyone' | 'team'>('anyone')

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
        className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Share</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 sm:px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                  <Share2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Share Playbook</h3>
                  <p className="text-xs text-gray-500">Share read-only access</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              {/* Share Options */}
              <div className="mb-4">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                  Who can access
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShareOption('anyone')}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                      shareOption === 'anyone'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <Globe className={`w-4 h-4 ${shareOption === 'anyone' ? 'text-emerald-600' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium">Anyone</span>
                  </button>
                  <button
                    onClick={() => setShareOption('team')}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                      shareOption === 'team'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <Users className={`w-4 h-4 ${shareOption === 'team' ? 'text-emerald-600' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium">Team only</span>
                  </button>
                </div>
              </div>

              {/* Share Link */}
              <div className="mb-4">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                  Share link
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all whitespace-nowrap ${
                      copied
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20'
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
              </div>

              {/* Preview Link */}
              <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <ExternalLink className="w-3 h-3" />
                  <span>Preview how this link will look:</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600 truncate flex-1">
                    {shareUrl.replace(/^https?:\/\//, '')}
                  </span>
                </div>
              </div>

              {/* Info Box */}
              <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-3 text-amber-800 border border-amber-200">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-500" />
                <div>
                  <p className="text-xs font-medium mb-1">Workspace sharing required</p>
                  <p className="text-xs text-amber-700">
                    You need to enable workspace sharing in{' '}
                    <Link href="/settings?tab=workspace" className="font-medium underline underline-offset-2 hover:text-amber-900">
                      Settings
                    </Link>{' '}
                    for this link to work.
                  </p>
                </div>
              </div>

              {/* Mobile Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 w-full sm:hidden bg-gray-100 text-gray-700 px-4 py-3 rounded-xl text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
