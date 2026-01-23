'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Playbook, PlaybookCategory } from '@/lib/types/database'
import { formatDistanceToNow } from '@/lib/utils/date'

type Props = {
  playbooks: Playbook[]
  initialCategory: string
}

const categories = ['All', 'HR', 'Operations', 'Support', 'Finance', 'Marketing', 'Sales', 'Other']

export function PlaybooksClient({ playbooks, initialCategory }: Props) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)

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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search playbooks..."
            className="w-full rounded-xl border-2 border-slate-200 bg-white py-2.5 pl-12 pr-4 text-slate-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Playbooks Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPlaybooks.map((playbook) => (
          <Link
            key={playbook.id}
            href={`/playbooks/${playbook.id}`}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-lg"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-600 transition-transform group-hover:scale-110">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(playbook.category)}`}>
                {playbook.category}
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 group-hover:text-indigo-600">
              {playbook.title}
            </h3>
            <p className="mb-4 text-sm text-slate-600 line-clamp-2">
              {playbook.description || 'No description'}
            </p>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-[10px] font-medium text-white">
                  {playbook.owner?.full_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-xs text-slate-600">
                  {playbook.owner?.full_name || 'Unknown'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {playbook._count?.steps || 0} steps
                </span>
              </div>
            </div>
          </Link>
        ))}

        {/* Create New Card */}
        <Link
          href="/playbooks/new"
          className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition-all hover:border-indigo-400 hover:bg-indigo-50"
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-all group-hover:bg-indigo-100 group-hover:text-indigo-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="font-medium text-slate-600 group-hover:text-indigo-600">Create New Playbook</p>
        </Link>
      </div>

      {/* Empty State */}
      {filteredPlaybooks.length === 0 && (
        <div className="mt-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900">No playbooks found</h3>
          <p className="text-slate-600">
            {searchQuery
              ? 'Try adjusting your search query'
              : 'Create your first playbook to get started'}
          </p>
        </div>
      )}
    </>
  )
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    HR: 'bg-blue-100 text-blue-700',
    Operations: 'bg-purple-100 text-purple-700',
    Support: 'bg-green-100 text-green-700',
    Finance: 'bg-yellow-100 text-yellow-700',
    Marketing: 'bg-pink-100 text-pink-700',
    Sales: 'bg-cyan-100 text-cyan-700',
    Other: 'bg-slate-100 text-slate-700',
  }
  return colors[category] || colors.Other
}
