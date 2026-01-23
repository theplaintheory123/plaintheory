'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { searchWorkspaceAction } from './actions'
import type { SearchResult } from '@/lib/types/database'

type Props = {
  workspaceId: string
}

export function SearchClient({ workspaceId }: Props) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'playbooks' | 'steps' | 'tools'>('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Save search to recent
  const saveSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return

    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== searchTerm)
      const updated = [searchTerm, ...filtered].slice(0, 5)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Perform search
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.length >= 2) {
        setIsSearching(true)
        try {
          const searchResults = await searchWorkspaceAction(workspaceId, query)
          setResults(searchResults)
          saveSearch(query)
        } catch (error) {
          console.error('Search error:', error)
          setResults([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, workspaceId, saveSearch])

  const filteredResults = results.filter((result) => {
    if (filter === 'all') return true
    if (filter === 'playbooks') return result.result_type === 'playbook'
    if (filter === 'steps') return result.result_type === 'step'
    if (filter === 'tools') return result.result_type === 'tool'
    return true
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
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <svg className="h-5 w-5 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            )}
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
        {query.length >= 2 && (
          <p className="mb-4 text-sm text-slate-600">
            {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} for "{query}"
          </p>
        )}

        <div className="space-y-3">
          {filteredResults.map((result) => (
            <div
              key={`${result.result_type}-${result.result_id}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                {getTypeIcon(result.result_type)}
                <div className="flex-1 min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-600">
                      {result.result_type}
                    </span>
                  </div>
                  {result.result_type === 'playbook' ? (
                    <Link
                      href={`/playbooks/${result.result_id}`}
                      className="text-lg font-semibold text-slate-900 hover:text-indigo-600"
                    >
                      {result.title}
                    </Link>
                  ) : result.result_type === 'tool' && result.description ? (
                    <a
                      href={result.description}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-slate-900 hover:text-indigo-600"
                    >
                      {result.title}
                    </a>
                  ) : (
                    <p className="text-lg font-semibold text-slate-900">{result.title}</p>
                  )}
                  {result.result_type !== 'tool' && result.description && (
                    <p className="mt-1 text-slate-600 line-clamp-2">{result.description}</p>
                  )}
                  {result.playbook_title && result.result_type !== 'playbook' && (
                    <p className="mt-2 text-sm text-slate-500">
                      From:{' '}
                      <Link
                        href={`/playbooks/${result.playbook_id}`}
                        className="font-medium hover:text-indigo-600"
                      >
                        {result.playbook_title}
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredResults.length === 0 && query.length >= 2 && !isSearching && (
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

          {query.length < 2 && (
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
        {query.length < 2 && recentSearches.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Searches</h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
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
