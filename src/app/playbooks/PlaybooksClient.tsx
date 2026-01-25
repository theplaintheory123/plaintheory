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
} from 'lucide-react'

type Props = {
  playbooks: Playbook[]
  initialCategory: string
}

const categories = ['All', 'HR', 'Operations', 'Support', 'Finance', 'Marketing', 'Sales', 'Other']

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
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" strokeWidth={2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search playbooks..."
              className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-[14px] text-neutral-900 placeholder-neutral-400 transition-all focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-neutral-200 bg-white p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-md p-2 transition-colors ${
                  viewMode === 'grid' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <LayoutGrid className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-md p-2 transition-colors ${
                  viewMode === 'list' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <List className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            <Link
              href="/playbooks/new"
              className="hidden items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-neutral-800 active:scale-[0.98] sm:inline-flex"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              New Playbook
            </Link>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-500">
            <Filter className="h-3.5 w-3.5" strokeWidth={2} />
            Filter:
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-600 ring-1 ring-neutral-200 hover:bg-neutral-50 hover:ring-neutral-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[13px] text-neutral-500">
          {filteredPlaybooks.length} {filteredPlaybooks.length === 1 ? 'playbook' : 'playbooks'}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlaybooks.map((playbook) => (
            <Link
              key={playbook.id}
              href={`/playbooks/${playbook.id}`}
              className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:border-neutral-300 hover:shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-neutral-100 transition-colors group-hover:bg-neutral-200">
                  <FileText className="h-5 w-5 text-neutral-600" strokeWidth={1.5} />
                </div>
                <span className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${getCategoryStyle(playbook.category)}`}>
                  {playbook.category}
                </span>
              </div>
              <h3 className="mb-1.5 text-[15px] font-medium text-neutral-900 group-hover:text-neutral-700">
                {playbook.title}
              </h3>
              <p className="mb-4 text-[13px] text-neutral-500 line-clamp-2">
                {playbook.description || 'No description'}
              </p>
              <div className="flex items-center justify-between border-t border-neutral-100 pt-4 text-[12px] text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                  {formatDistanceToNow(playbook.updated_at)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" strokeWidth={2} />
                  {playbook.view_count || 0} views
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-neutral-800 to-neutral-900 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}

          {/* Create New Card */}
          <Link
            href="/playbooks/new"
            className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-white p-8 transition-all hover:border-neutral-300 hover:bg-neutral-50"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400 transition-all group-hover:bg-neutral-900 group-hover:text-white group-hover:scale-105">
              <Plus className="h-6 w-6" strokeWidth={2} />
            </div>
            <p className="text-[14px] font-medium text-neutral-700">Create Playbook</p>
            <p className="text-[12px] text-neutral-400">Start from scratch</p>
          </Link>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          {filteredPlaybooks.map((playbook, index) => (
            <Link
              key={playbook.id}
              href={`/playbooks/${playbook.id}`}
              className={`group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-neutral-50 ${
                index !== filteredPlaybooks.length - 1 ? 'border-b border-neutral-100' : ''
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 transition-colors group-hover:bg-neutral-200">
                <FileText className="h-5 w-5 text-neutral-600" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-[14px] font-medium text-neutral-900">{playbook.title}</p>
                <p className="truncate text-[13px] text-neutral-500">{playbook.description || 'No description'}</p>
              </div>
              <div className="hidden items-center gap-6 text-[12px] text-neutral-400 sm:flex">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                  {formatDistanceToNow(playbook.updated_at)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" strokeWidth={2} />
                  {playbook.view_count || 0}
                </span>
              </div>
              <span className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${getCategoryStyle(playbook.category)}`}>
                {playbook.category}
              </span>
              <ArrowUpRight className="h-4 w-4 text-neutral-300 opacity-0 transition-all group-hover:opacity-100" strokeWidth={2} />
            </Link>
          ))}

          <Link
            href="/playbooks/new"
            className="flex items-center gap-4 border-t border-neutral-100 px-5 py-4 transition-colors hover:bg-neutral-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 text-neutral-400">
              <Plus className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[14px] font-medium text-neutral-600">Create Playbook</p>
              <p className="text-[12px] text-neutral-400">Start from scratch</p>
            </div>
          </Link>
        </div>
      )}

      {/* Empty State */}
      {filteredPlaybooks.length === 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-100">
            <Search className="h-7 w-7 text-neutral-400" strokeWidth={1.5} />
          </div>
          <h3 className="mb-1 text-[15px] font-medium text-neutral-900">No playbooks found</h3>
          <p className="mb-5 text-[13px] text-neutral-500">
            {searchQuery ? 'Try adjusting your search or filter' : 'Create your first playbook to get started'}
          </p>
          <Link
            href="/playbooks/new"
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-neutral-800"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Create Playbook
          </Link>
        </div>
      )}

      {/* Mobile FAB */}
      <Link
        href="/playbooks/new"
        className="fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 sm:hidden"
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
    Other: 'bg-neutral-100 text-neutral-700',
  }
  return styles[category] || styles.Other
}
