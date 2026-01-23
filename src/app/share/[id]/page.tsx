'use client'

import { useState, use } from 'react'
import Link from 'next/link'

type Props = {
  params: Promise<{ id: string }>
}

export default function SharedWorkspacePage({ params }: Props) {
  const { id } = use(params)
  const [pinRequired] = useState(true)
  const [pinVerified, setPinVerified] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')

  // Mock workspace data
  const workspace = {
    name: 'Acme Corporation',
    playbooksCount: 12,
  }

  const playbooks = [
    {
      id: '1',
      title: 'Employee Onboarding Process',
      description: 'Complete guide for onboarding new team members',
      category: 'HR',
      steps: 12,
      updatedAt: '2 hours ago',
    },
    {
      id: '2',
      title: 'Customer Support Workflow',
      description: 'Standard operating procedures for handling customer inquiries',
      category: 'Support',
      steps: 8,
      updatedAt: '1 day ago',
    },
    {
      id: '3',
      title: 'Store Opening Checklist',
      description: 'Daily tasks for opening the store',
      category: 'Operations',
      steps: 15,
      updatedAt: '3 days ago',
    },
  ]

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock PIN verification
    if (pin === '1234') {
      setPinVerified(true)
      setPinError('')
    } else {
      setPinError('Incorrect PIN. Please try again.')
    }
  }

  // PIN verification screen
  if (pinRequired && !pinVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl text-center">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 shadow-lg">
                  <span className="text-2xl font-bold text-white">P</span>
                </div>
                <span className="text-2xl font-bold text-slate-900">Plantheory</span>
              </div>
            </div>

            {/* Lock Icon */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
              <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <h1 className="mb-2 text-2xl font-bold text-slate-900">Protected Workspace</h1>
            <p className="mb-6 text-slate-600">
              Enter the PIN to access <strong>{workspace.name}</strong>
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={6}
                placeholder="Enter PIN"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-center text-2xl tracking-widest text-slate-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                autoFocus
              />
              {pinError && (
                <p className="text-sm text-red-600">{pinError}</p>
              )}
              <button
                type="submit"
                disabled={pin.length < 4}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                Access Workspace
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-500">
              Don't have the PIN? Contact the workspace owner.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Main shared view
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-lg">
                <span className="text-xl font-bold">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{workspace.name}</h1>
                <p className="text-sm text-slate-600">{workspace.playbooksCount} playbooks</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Only
            </div>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search playbooks..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-12 pr-4 text-slate-900 transition-colors focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-lg font-semibold text-slate-900">Playbooks</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playbooks.map((playbook) => (
            <Link
              key={playbook.id}
              href={`/share/${id}/playbook/${playbook.id}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-lg"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-600 transition-transform group-hover:scale-110">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {playbook.category}
                </span>
              </div>
              <h3 className="mb-2 font-semibold text-slate-900 group-hover:text-indigo-600">
                {playbook.title}
              </h3>
              <p className="mb-4 text-sm text-slate-600 line-clamp-2">{playbook.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{playbook.steps} steps</span>
                <span>Updated {playbook.updatedAt}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-slate-600">
            Powered by{' '}
            <a href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              Plantheory
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
