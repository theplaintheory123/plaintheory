'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Playbook, PlaybookCategory } from '@/lib/types/database'
import { formatDistanceToNow } from '@/lib/utils/date'
import {
  Search,
  BookOpen,
  Plus,
  ClipboardList,
  Clock,
  Eye,
  ChevronRight,
  Briefcase,
  Building2,
  Headphones,
  DollarSign,
  Megaphone,
  TrendingUp,
  FolderOpen,
  LayoutGrid,
  List,
  Filter,
} from 'lucide-react'

type Props = {
  playbooks: Playbook[]
  initialCategory: string
}

const categories = [
  { name: 'All', icon: LayoutGrid },
  { name: 'HR', icon: Briefcase },
  { name: 'Operations', icon: Building2 },
  { name: 'Support', icon: Headphones },
  { name: 'Finance', icon: DollarSign },
  { name: 'Marketing', icon: Megaphone },
  { name: 'Sales', icon: TrendingUp },
  { name: 'Other', icon: FolderOpen },
]

export function PlaybooksClient({ playbooks, initialCategory }: Props) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredPlaybooks = useMemo(() => {
    return playbooks.filter((playbook) => {
      const matchesSearch =
        !searchQuery ||
        playbook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        playbook.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === 'All' || playbook.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [playbooks, searchQuery, selectedCategory])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category === 'All') {
      router.push('/playbooks')
    } else {
      router.push(`/playbooks?category=${category}`)
    }
  }

  return (
    <>
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search playbooks..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-white p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-md p-2 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-md p-2 transition-all ${
                  viewMode === 'list'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon
              const isSelected = selectedCategory === category.name
              return (
                <button
                  key={category.name}
                  onClick={() => handleCategoryChange(category.name)}
                  className={`group inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? '' : 'text-slate-400 group-hover:text-slate-500'}`} />
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {filteredPlaybooks.length} {filteredPlaybooks.length === 1 ? 'playbook' : 'playbooks'} found
        </p>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlaybooks.map((playbook) => (
            <Link
              key={playbook.id}
              href={`/playbooks/${playbook.id}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-lg"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500/5 to-blue-500/5 transition-transform group-hover:scale-150" />
              <div className="relative">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 text-slate-600 ring-1 ring-slate-200/80 transition-all group-hover:from-indigo-100 group-hover:to-blue-50 group-hover:text-indigo-600 group-hover:ring-indigo-200">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(playbook.category)}`}>
                    {playbook.category}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 group-hover:text-indigo-600">
                  {playbook.title}
                </h3>
                <p className="mb-4 text-sm text-slate-500 line-clamp-2">
                  {playbook.description || 'No description provided'}
                </p>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-[10px] font-bold text-white ring-2 ring-white">
                      {playbook.owner?.full_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-xs font-medium text-slate-600">
                      {playbook.owner?.full_name || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <ClipboardList className="h-3.5 w-3.5" />
                      {playbook._count?.steps || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {playbook.view_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* Create New Card */}
          <Link
            href="/playbooks/new"
            className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 transition-all hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-white"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200/80 transition-all group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/30 group-hover:ring-0">
              <Plus className="h-6 w-6" />
            </div>
            <p className="font-semibold text-slate-600 group-hover:text-indigo-600">Create New Playbook</p>
            <p className="mt-1 text-sm text-slate-400">Start from scratch</p>
          </Link>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {filteredPlaybooks.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {filteredPlaybooks.map((playbook) => (
                <li key={playbook.id}>
                  <Link
                    href={`/playbooks/${playbook.id}`}
                    className="group flex items-center justify-between px-6 py-4 transition-all hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 text-slate-600 ring-1 ring-slate-200/80 transition-all group-hover:from-indigo-100 group-hover:to-blue-50 group-hover:text-indigo-600 group-hover:ring-indigo-200">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 group-hover:text-indigo-600">
                          {playbook.title}
                        </p>
                        <p className="truncate text-sm text-slate-500">
                          {playbook.description || 'No description'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden items-center gap-3 text-xs text-slate-400 sm:flex">
                        <span className="flex items-center gap-1">
                          <ClipboardList className="h-3.5 w-3.5" />
                          {playbook._count?.steps || 0} steps
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          {playbook.view_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDistanceToNow(playbook.updated_at)}
                        </span>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(playbook.category)}`}>
                        {playbook.category}
                      </span>
                      <ChevronRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          {/* Create row */}
          <Link
            href="/playbooks/new"
            className="group flex items-center gap-4 border-t border-slate-100 px-6 py-4 transition-all hover:bg-indigo-50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-slate-400 transition-all group-hover:border-indigo-400 group-hover:bg-indigo-100 group-hover:text-indigo-600">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-600 group-hover:text-indigo-600">Create New Playbook</p>
              <p className="text-sm text-slate-400">Start from scratch</p>
            </div>
          </Link>
        </div>
      )}

      {/* Empty State */}
      {filteredPlaybooks.length === 0 && (
        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 text-slate-400 ring-1 ring-slate-200/80">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900">No playbooks found</h3>
          <p className="mb-6 text-slate-600">
            {searchQuery
              ? 'Try adjusting your search query or filters'
              : 'Create your first playbook to get started'}
          </p>
          <Link
            href="/playbooks/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl"
          >
            <Plus className="h-4 w-4" />
            Create Playbook
          </Link>
        </div>
      )}
    </>
  )
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    HR: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200/50',
    Operations: 'bg-purple-100 text-purple-700 ring-1 ring-purple-200/50',
    Support: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200/50',
    Finance: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200/50',
    Marketing: 'bg-pink-100 text-pink-700 ring-1 ring-pink-200/50',
    Sales: 'bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200/50',
    Other: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200/50',
  }
  return colors[category] || colors.Other
}
