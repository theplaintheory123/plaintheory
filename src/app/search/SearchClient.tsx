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
  ChevronRight,
  Hash,
  Link2,
} from 'lucide-react'

type Props = {
  workspaceId: string
  playbooksCount: number
}

const filterOptions = [
  { value: 'all', label: 'All', icon: Search },
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
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-emerald-600" />
          </div>
        )
      case 'step':
        return (
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <ListChecks className="w-5 h-5 text-blue-600" />
          </div>
        )
      case 'tool':
        return (
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
            <Wrench className="w-5 h-5 text-purple-600" />
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
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-gray-900">
            <span className="font-medium text-gray-900">Search</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Find playbooks, steps, and tools across your workspace
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 bg-white px-3 py-2 rounded-xl border border-gray-200">
          <FileText className="w-4 h-4" />
          <span>{playbooksCount} playbooks indexed</span>
        </div>
      </div>

      {/* Search Box */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search playbooks, steps, tools..."
          className="w-full pl-12 pr-20 py-4 text-base sm:text-lg bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
          autoFocus
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isSearching && (
            <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
          )}
          {query.length > 0 && !isSearching && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-gray-400">
            <Command className="w-3.5 h-3.5" />
            <span className="text-xs">K</span>
          </div>
        </div>
      </div>

      {/* Filter Pills - Scrollable on Mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
        <span className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
          <Filter className="w-3 h-3" />
          Filter:
        </span>
        {filterOptions.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === value
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            {query.length >= 2 && (
              <span className={`ml-0.5 ${filter === value ? 'text-emerald-200' : 'text-gray-400'}`}>
                {resultCounts[value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Results Info */}
      {query.length >= 2 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Found <span className="font-medium text-gray-900">{filteredResults.length}</span> result{filteredResults.length !== 1 ? 's' : ''} for "<span className="font-medium text-gray-900">{query}</span>"
          </p>
          {filteredResults.length > 0 && (
            <span className="text-xs text-gray-400">
              Sorted by relevance
            </span>
          )}
        </div>
      )}

      {/* Results List */}
      {filteredResults.length > 0 && (
        <div className="space-y-3">
          {filteredResults.map((result) => (
            <div
              key={`${result.result_type}-${result.result_id}`}
              className="group bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:border-emerald-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {getTypeIcon(result.result_type)}
                
                <div className="flex-1 min-w-0">
                  {/* Type Badge and Context */}
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      result.result_type === 'playbook' ? 'bg-emerald-50 text-emerald-700' :
                      result.result_type === 'step' ? 'bg-blue-50 text-blue-700' :
                      'bg-purple-50 text-purple-700'
                    }`}>
                      {result.result_type}
                    </span>
                    {result.playbook_title && result.result_type !== 'playbook' && (
                      <>
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 truncate max-w-[200px]">
                          {result.playbook_title}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  {result.result_type === 'playbook' ? (
                    <Link
                      href={`/playbooks/${result.result_id}`}
                      className="text-base sm:text-lg font-medium text-gray-900 hover:text-emerald-600 transition-colors inline-flex items-center gap-1"
                    >
                      {result.title}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ) : result.result_type === 'tool' && result.description ? (
                    <a
                      href={result.description}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base sm:text-lg font-medium text-gray-900 hover:text-emerald-600 transition-colors inline-flex items-center gap-2"
                    >
                      {result.title}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <p className="text-base sm:text-lg font-medium text-gray-900">{result.title}</p>
                  )}

                  {/* Description */}
                  {result.result_type !== 'tool' && result.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{result.description}</p>
                  )}

                  {/* View Link for nested items */}
                  {result.playbook_title && result.result_type !== 'playbook' && (
                    <Link
                      href={`/playbooks/${result.playbook_id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 mt-2"
                    >
                      View full playbook
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>

                {/* Quick Action */}
                {result.result_type === 'playbook' && (
                  <Link
                    href={`/playbooks/${result.result_id}`}
                    className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State - No Results */}
      {filteredResults.length === 0 && query.length >= 2 && !isSearching && (
        <div className="bg-white rounded-xl border border-gray-200 py-12 sm:py-16 text-center">
          <div className="inline-flex p-3 bg-gray-100 rounded-xl mb-4">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">No results found</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            We couldn't find anything matching "<span className="font-medium text-gray-700">{query}</span>". Try different keywords.
          </p>
          <button
            onClick={() => setQuery('')}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Empty State - Start Searching */}
      {query.length < 2 && (
        <div className="bg-white rounded-xl border border-gray-200 py-12 sm:py-16 text-center">
          <div className="inline-flex p-3 bg-emerald-50 rounded-xl mb-4">
            <Sparkles className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">Search your workspace</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Find playbooks, steps, and tools across your entire workspace. Start typing to search.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              Playbooks
            </span>
            <span className="flex items-center gap-1.5">
              <ListChecks className="w-4 h-4 text-blue-500" />
              Steps
            </span>
            <span className="flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-purple-500" />
              Tools
            </span>
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {query.length < 2 && recentSearches.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-medium text-gray-700">Recent Searches</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <div
                key={term}
                className="group flex items-center gap-1 bg-white border border-gray-200 rounded-lg pl-3 pr-1 py-1.5 hover:border-emerald-200 transition-colors"
              >
                <button
                  onClick={() => setQuery(term)}
                  className="text-xs font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  {term}
                </button>
                <button
                  onClick={() => clearRecentSearch(term)}
                  className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Tips */}
      {query.length < 2 && (
        <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Hash className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Search Tips</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Search for playbook titles, step descriptions, or tool names</li>
                <li>• Use specific keywords for better results</li>
                <li>• Results are sorted by relevance</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}