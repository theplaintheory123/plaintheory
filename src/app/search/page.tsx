'use client'

import { useState } from 'react'
import Link from 'next/link'

type SearchResult = {
  id: string
  type: 'playbook' | 'step' | 'tool'
  title: string
  description: string
  category?: string
  playbookTitle?: string
  url?: string
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'playbooks' | 'steps' | 'tools'>('all')

  // Mock search results
  const allResults: SearchResult[] = [
    {
      id: '1',
      type: 'playbook',
      title: 'Employee Onboarding Process',
      description: 'Complete guide for onboarding new team members',
      category: 'HR',
    },
    {
      id: '2',
      type: 'playbook',
      title: 'Customer Support Workflow',
      description: 'Standard operating procedures for handling customer inquiries',
      category: 'Support',
    },
    {
      id: '3',
      type: 'step',
      title: 'Send Welcome Email',
      description: 'Send a personalized welcome email to the new employee',
      playbookTitle: 'Employee Onboarding Process',
    },
    {
      id: '4',
      type: 'step',
      title: 'Create User Accounts',
      description: 'Set up email, Slack, and other tool access',
      playbookTitle: 'Employee Onboarding Process',
    },
    {
      id: '5',
      type: 'tool',
      title: 'Google Workspace',
      description: 'Email, calendar, and document collaboration',
      url: 'https://workspace.google.com',
    },
    {
      id: '6',
      type: 'tool',
      title: 'Slack',
      description: 'Team communication and messaging platform',
      url: 'https://slack.com',
    },
    {
      id: '7',
      type: 'playbook',
      title: 'Store Opening Checklist',
      description: 'Daily tasks for opening the store',
      category: 'Operations',
    },
    {
      id: '8',
      type: 'step',
      title: 'Check Inventory Levels',
      description: 'Review and restock inventory as needed',
      playbookTitle: 'Store Opening Checklist',
    },
  ]

  const filteredResults = allResults.filter((result) => {
    const matchesQuery = query === '' ||
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.toLowerCase())

    const matchesFilter = filter === 'all' ||
      (filter === 'playbooks' && result.type === 'playbook') ||
      (filter === 'steps' && result.type === 'step') ||
      (filter === 'tools' && result.type === 'tool')

    return matchesQuery && matchesFilter
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'playbook':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )
      case 'step':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        )
      case 'tool':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="mb-6 text-3xl font-bold text-slate-900">Search</h1>

          {/* Search Input */}
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search playbooks, steps, tools..."
              className="w-full rounded-2xl border-2 border-slate-200 bg-white py-4 pl-14 pr-4 text-lg text-slate-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
              autoFocus
            />
          </div>

          {/* Filters */}
          <div className="mt-4 flex gap-2">
            {(['all', 'playbooks', 'steps', 'tools'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Results */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {query && (
          <p className="mb-4 text-sm text-slate-600">
            {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} for "{query}"
          </p>
        )}

        <div className="space-y-3">
          {filteredResults.map((result) => (
            <div
              key={`${result.type}-${result.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                {getTypeIcon(result.type)}
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-600">
                      {result.type}
                    </span>
                    {result.category && (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                        {result.category}
                      </span>
                    )}
                  </div>
                  {result.type === 'playbook' ? (
                    <Link
                      href={`/playbooks/${result.id}`}
                      className="text-lg font-semibold text-slate-900 hover:text-indigo-600"
                    >
                      {result.title}
                    </Link>
                  ) : result.type === 'tool' && result.url ? (
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-slate-900 hover:text-indigo-600"
                    >
                      {result.title}
                    </a>
                  ) : (
                    <p className="text-lg font-semibold text-slate-900">{result.title}</p>
                  )}
                  <p className="mt-1 text-slate-600">{result.description}</p>
                  {result.playbookTitle && (
                    <p className="mt-2 text-sm text-slate-500">
                      From: <span className="font-medium">{result.playbookTitle}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredResults.length === 0 && query && (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">No results found</h3>
              <p className="text-slate-600">Try adjusting your search or filter to find what you're looking for</p>
            </div>
          )}

          {!query && (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">Search your workspace</h3>
              <p className="text-slate-600">Find playbooks, steps, and tools across your entire workspace</p>
            </div>
          )}
        </div>

        {/* Recent Searches */}
        {!query && (
          <div className="mt-12">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Searches</h2>
            <div className="flex flex-wrap gap-2">
              {['onboarding', 'customer support', 'inventory', 'slack'].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
