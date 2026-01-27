'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { searchWorkspaceAction } from './actions'
import type { SearchResult } from '@/lib/types/database'
import {
  Search,
  BookOpen,
  ListChecks,
  Wrench,
  Clock,
  ArrowUpRight,
  Sparkles,
  X,
  Loader2,
  FileText,
  ExternalLink,
  History,
  Filter,
  Command,
} from 'lucide-react'

type Props = {
  workspaceId: string
  playbooksCount: number
}

const filterOptions = [
  { value: 'all', label: 'All Results', icon: Search },
  { value: 'playbooks', label: 'Playbooks', icon: BookOpen },
  { value: 'steps', label: 'Steps', icon: ListChecks },
  { value: 'tools', label: 'Tools', icon: Wrench },
] as const

export function SearchClient({ workspaceId, playbooksCount }: Props) {
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

  const resultCounts = {
    all: results.length,
    playbooks: results.filter(r => r.result_type === 'playbook').length,
    steps: results.filter(r => r.result_type === 'step').length,
    tools: results.filter(r => r.result_type === 'tool').length,
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'playbook':
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
            <BookOpen className="h-5 w-5 text-indigo-600" strokeWidth={1.5} />
          </div>
        )
      case 'step':
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
            <ListChecks className="h-5 w-5 text-emerald-600" strokeWidth={1.5} />
          </div>
        )
      case 'tool':
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50">
            <Wrench className="h-5 w-5 text-purple-600" strokeWidth={1.5} />
          </div>
        )
      default:
        return null
    }
  }

  const clearRecentSearch = (term: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== term)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Search</h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Find playbooks, steps, and tools across your workspace
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FileText className="h-4 w-4" />
            <span>{playbooksCount} playbooks indexed</span>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" strokeWidth={2} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search playbooks, steps, tools..."
            className="w-full rounded-2xl border-2 border-slate-200 bg-white py-4 pl-14 pr-14 text-lg text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
            autoFocus
          />
          {isSearching ? (
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" strokeWidth={2} />
            </div>
          ) : query.length > 0 ? (
            <button
              onClick={() => setQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          ) : (
            <div className="absolute right-5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1">
              <Command className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-400">K</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Pills */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <Filter className="h-4 w-4" strokeWidth={2} />
          Filter:
        </span>
        {filterOptions.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              filter === value
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300'
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={2} />
            {label}
            {query.length >= 2 && (
              <span className={`ml-1 ${filter === value ? 'text-indigo-200' : 'text-slate-400'}`}>
                ({resultCounts[value]})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Results */}
      {query.length >= 2 && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">{filteredResults.length}</span> results for "<span className="font-medium text-slate-900">{query}</span>"
          </p>
        </div>
      )}

      {/* Results List */}
      {filteredResults.length > 0 && (
        <div className="space-y-3">
          {filteredResults.map((result) => (
            <div
              key={`${result.result_type}-${result.result_id}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                {getTypeIcon(result.result_type)}
                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize ${
                      result.result_type === 'playbook' ? 'bg-indigo-50 text-indigo-700' :
                      result.result_type === 'step' ? 'bg-emerald-50 text-emerald-700' :
                      'bg-purple-50 text-purple-700'
                    }`}>
                      {result.result_type}
                    </span>
                    {result.playbook_title && result.result_type !== 'playbook' && (
                      <span className="text-xs text-slate-400">
                        in {result.playbook_title}
                      </span>
                    )}
                  </div>
                  {result.result_type === 'playbook' ? (
                    <Link
                      href={`/playbooks/${result.result_id}`}
                      className="text-lg font-semibold text-slate-900 transition-colors hover:text-indigo-600"
                    >
                      {result.title}
                    </Link>
                  ) : result.result_type === 'tool' && result.description ? (
                    <a
                      href={result.description}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-lg font-semibold text-slate-900 transition-colors hover:text-indigo-600"
                    >
                      {result.title}
                      <ExternalLink className="h-4 w-4" strokeWidth={2} />
                    </a>
                  ) : (
                    <p className="text-lg font-semibold text-slate-900">{result.title}</p>
                  )}
                  {result.result_type !== 'tool' && result.description && (
                    <p className="mt-1 text-sm text-slate-500 line-clamp-2">{result.description}</p>
                  )}
                  {result.playbook_title && result.result_type !== 'playbook' && (
                    <Link
                      href={`/playbooks/${result.playbook_id}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
                    >
                      View playbook
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                    </Link>
                  )}
                </div>
                {result.result_type === 'playbook' && (
                  <Link
                    href={`/playbooks/${result.result_id}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 opacity-0 transition-all group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:opacity-100"
                  >
                    <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State - No Results */}
      {filteredResults.length === 0 && query.length >= 2 && !isSearching && (
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
            <Search className="h-10 w-10 text-slate-400" strokeWidth={1.5} />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-slate-900">No results found</h3>
          <p className="mb-6 max-w-sm mx-auto text-sm text-slate-500">
            We couldn't find anything matching "<span className="font-medium">{query}</span>". Try different keywords or check your spelling.
          </p>
          <button
            onClick={() => setQuery('')}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Empty State - Start Searching */}
      {query.length < 2 && (
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50">
            <Sparkles className="h-10 w-10 text-indigo-600" strokeWidth={1.5} />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-slate-900">Search your workspace</h3>
          <p className="mb-6 max-w-sm mx-auto text-sm text-slate-500">
            Find playbooks, steps, and tools across your entire workspace. Start typing to search.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-500" />
              Playbooks
            </span>
            <span className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-emerald-500" />
              Steps
            </span>
            <span className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-purple-500" />
              Tools
            </span>
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {query.length < 2 && recentSearches.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <History className="h-4 w-4 text-slate-400" strokeWidth={2} />
            <h2 className="text-sm font-semibold text-slate-900">Recent Searches</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <div
                key={term}
                className="group flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 ring-1 ring-slate-200 transition-all hover:ring-slate-300"
              >
                <button
                  onClick={() => setQuery(term)}
                  className="text-sm font-medium text-slate-700"
                >
                  {term}
                </button>
                <button
                  onClick={() => clearRecentSearch(term)}
                  className="rounded-md p-0.5 text-slate-400 opacity-0 transition-all hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
