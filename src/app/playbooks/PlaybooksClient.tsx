'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Playbook } from '@/lib/types/database'
import { formatDistanceToNow } from '@/lib/utils/date'
import {
  Search,
  Plus,
  Clock,
  Eye,
  FileText,
  LayoutGrid,
  List,
  ArrowUpRight,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Calendar,
  FolderOpen,
  BookOpen,
} from 'lucide-react'

type Props = {
  playbooks: Playbook[]
  initialCategory: string
}

type SortOption = 'updated' | 'created' | 'title' | 'views'

const categories = ['All', 'HR', 'Operations', 'Support', 'Finance', 'Marketing', 'Sales', 'Other']

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'updated', label: 'Last Updated' },
  { value: 'created', label: 'Date Created' },
  { value: 'title', label: 'Title (A-Z)' },
  { value: 'views', label: 'Most Viewed' },
]

export function PlaybooksClient({ playbooks, initialCategory }: Props) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('updated')
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  const filteredPlaybooks = useMemo(() => {
    let filtered = playbooks.filter((playbook) => {
      const matchesSearch =
        !searchQuery ||
        playbook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        playbook.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === 'All' || playbook.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    // Sort playbooks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        case 'views':
          return (b.view_count || 0) - (a.view_count || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [playbooks, searchQuery, selectedCategory, sortBy])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category === 'All') {
      router.push('/playbooks')
    } else {
      router.push(`/playbooks?category=${category}`)
    }
  }

  // Stats
  const totalViews = playbooks.reduce((sum, p) => sum + (p.view_count || 0), 0)
  const categoryCounts = playbooks.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <>
      {/* Stats Bar */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
            <BookOpen className="h-5 w-5 text-indigo-600" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{playbooks.length}</p>
            <p className="text-xs font-medium text-slate-500">Total Playbooks</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
            <Eye className="h-5 w-5 text-amber-600" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{totalViews}</p>
            <p className="text-xs font-medium text-slate-500">Total Views</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
            <FolderOpen className="h-5 w-5 text-emerald-600" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{Object.keys(categoryCounts).length}</p>
            <p className="text-xs font-medium text-slate-500">Categories Used</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
            <TrendingUp className="h-5 w-5 text-purple-600" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{filteredPlaybooks.length}</p>
            <p className="text-xs font-medium text-slate-500">Showing</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search playbooks by title or description..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            />
          </div>
          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                <ArrowUpDown className="h-4 w-4 text-slate-400" strokeWidth={2} />
                <span className="hidden sm:inline">{sortOptions.find(o => o.value === sortBy)?.label}</span>
                <ChevronDown className="h-4 w-4 text-slate-400" strokeWidth={2} />
              </button>
              {showSortDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value)
                          setShowSortDropdown(false)
                        }}
                        className={`flex w-full items-center px-4 py-2 text-left text-sm transition-colors ${
                          sortBy === option.value
                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex rounded-xl border border-slate-200 bg-white p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-2.5 transition-colors ${
                  viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <LayoutGrid className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-lg p-2.5 transition-colors ${
                  viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <List className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            <Link
              href="/playbooks/new"
              className="hidden items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-xl active:scale-[0.98] sm:inline-flex"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              New Playbook
            </Link>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Filter className="h-4 w-4" strokeWidth={2} />
            <span className="hidden sm:inline">Filter:</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300'
                }`}
              >
                {category}
                {category !== 'All' && categoryCounts[category] && (
                  <span className={`ml-1.5 ${selectedCategory === category ? 'text-indigo-200' : 'text-slate-400'}`}>
                    ({categoryCounts[category]})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-900">{filteredPlaybooks.length}</span>
          {filteredPlaybooks.length !== playbooks.length && (
            <span> of <span className="font-medium text-slate-900">{playbooks.length}</span></span>
          )}
          {' '}{filteredPlaybooks.length === 1 ? 'playbook' : 'playbooks'}
          {selectedCategory !== 'All' && <span> in <span className="font-medium text-slate-900">{selectedCategory}</span></span>}
        </p>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlaybooks.map((playbook) => (
            <Link
              key={playbook.id}
              href={`/playbooks/${playbook.id}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-lg"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-indigo-50">
                  <FileText className="h-6 w-6 text-slate-500 transition-colors group-hover:text-indigo-600" strokeWidth={1.5} />
                </div>
                <span className={`rounded-lg px-3 py-1 text-xs font-semibold ${getCategoryStyle(playbook.category)}`}>
                  {playbook.category}
                </span>
              </div>
              <h3 className="mb-2 text-base font-semibold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {playbook.title}
              </h3>
              <p className="mb-4 text-sm text-slate-500 line-clamp-2 min-h-[40px]">
                {playbook.description || 'No description provided'}
              </p>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                  {formatDistanceToNow(playbook.updated_at)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" strokeWidth={2} />
                  {playbook.view_count || 0} views
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}

          {/* Create New Card */}
          <Link
            href="/playbooks/new"
            className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 transition-all hover:border-indigo-300 hover:bg-indigo-50/50"
          >
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/20 group-hover:scale-105">
              <Plus className="h-7 w-7" strokeWidth={2} />
            </div>
            <p className="text-base font-semibold text-slate-700">Create Playbook</p>
            <p className="text-sm text-slate-400">Start from scratch</p>
          </Link>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Table Header */}
          <div className="hidden sm:grid sm:grid-cols-12 border-b border-slate-100 bg-slate-50/50 px-6 py-3">
            <div className="col-span-5 text-xs font-semibold uppercase tracking-wider text-slate-500">Playbook</div>
            <div className="col-span-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Category</div>
            <div className="col-span-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Updated</div>
            <div className="col-span-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Views</div>
            <div className="col-span-1"></div>
          </div>
          {filteredPlaybooks.map((playbook, index) => (
            <Link
              key={playbook.id}
              href={`/playbooks/${playbook.id}`}
              className={`group flex sm:grid sm:grid-cols-12 items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50 ${
                index !== filteredPlaybooks.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              <div className="col-span-5 flex items-center gap-4 min-w-0">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-indigo-50">
                  <FileText className="h-5 w-5 text-slate-500 transition-colors group-hover:text-indigo-600" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{playbook.title}</p>
                  <p className="truncate text-sm text-slate-500">{playbook.description || 'No description'}</p>
                </div>
              </div>
              <div className="col-span-2 hidden sm:block">
                <span className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${getCategoryStyle(playbook.category)}`}>
                  {playbook.category}
                </span>
              </div>
              <div className="col-span-2 hidden sm:flex items-center gap-1.5 text-sm text-slate-500">
                <Calendar className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
                {formatDistanceToNow(playbook.updated_at)}
              </div>
              <div className="col-span-2 hidden sm:flex items-center gap-1.5 text-sm text-slate-500">
                <Eye className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
                {playbook.view_count || 0}
              </div>
              <div className="col-span-1 flex justify-end">
                <ArrowUpRight className="h-5 w-5 text-slate-300 opacity-0 transition-all group-hover:opacity-100 group-hover:text-indigo-500" strokeWidth={2} />
              </div>
            </Link>
          ))}

          <Link
            href="/playbooks/new"
            className="flex items-center gap-4 border-t border-slate-100 px-6 py-4 transition-colors hover:bg-indigo-50/50"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-slate-400 group-hover:border-indigo-300 group-hover:text-indigo-500">
              <Plus className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <p className="font-medium text-slate-600">Create New Playbook</p>
              <p className="text-sm text-slate-400">Document a new process</p>
            </div>
          </Link>
        </div>
      )}

      {/* Empty State */}
      {filteredPlaybooks.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
            {searchQuery ? (
              <Search className="h-10 w-10 text-slate-400" strokeWidth={1.5} />
            ) : (
              <BookOpen className="h-10 w-10 text-slate-400" strokeWidth={1.5} />
            )}
          </div>
          <h3 className="mb-2 text-xl font-semibold text-slate-900">
            {searchQuery ? 'No playbooks found' : 'No playbooks yet'}
          </h3>
          <p className="mb-6 text-sm text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'Try adjusting your search terms or clearing the filter to see more results'
              : 'Get started by creating your first playbook to document your processes and workflows'}
          </p>
          <div className="flex items-center justify-center gap-3">
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
              >
                Clear Filters
              </button>
            )}
            <Link
              href="/playbooks/new"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Create Playbook
            </Link>
          </div>
        </div>
      )}

      {/* Mobile FAB */}
      <Link
        href="/playbooks/new"
        className="fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 hover:shadow-xl active:scale-95 sm:hidden"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </Link>
    </>
  )
}

function getCategoryStyle(category: string) {
  const styles: Record<string, string> = {
    HR: 'bg-blue-50 text-blue-700',
    Operations: 'bg-purple-50 text-purple-700',
    Support: 'bg-emerald-50 text-emerald-700',
    Finance: 'bg-amber-50 text-amber-700',
    Marketing: 'bg-pink-50 text-pink-700',
    Sales: 'bg-cyan-50 text-cyan-700',
    Other: 'bg-slate-100 text-slate-700',
  }
  return styles[category] || styles.Other
}
