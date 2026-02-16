'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Plus,
  Search,
  Grid,
  List,
  X,
  FileText,
  Eye,
  Clock,
  ChevronRight,
  Filter,
  ArrowUpDown,
  FolderOpen,
  Tag,
  MoreHorizontal,
  Copy,
  Archive,
  Trash2,
  Sparkles,
  Check,
} from 'lucide-react'
import { formatDistanceToNow } from '@/lib/utils/date'
import type { Playbook, PlaybookCategory } from '@/lib/types/database'

type PlaybooksClientProps = {
  playbooks: Playbook[]
  initialCategory: string
}

const categories: { value: PlaybookCategory | 'All'; label: string }[] = [
  { value: 'All', label: 'All Playbooks' },
  { value: 'HR', label: 'HR' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Support', label: 'Support' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Other', label: 'Other' },
]

export function PlaybooksClient({ playbooks, initialCategory }: PlaybooksClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'views' | 'title'>('updated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedPlaybooks, setSelectedPlaybooks] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)

  // Filter and sort playbooks
  const filteredPlaybooks = useMemo(() => {
    let filtered = [...playbooks]

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(pb => pb.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(pb => 
        pb.title.toLowerCase().includes(query) ||
        pb.description?.toLowerCase().includes(query) ||
        pb.category.toLowerCase().includes(query)
      )
    }

    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'updated':
          comparison = new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          break
        case 'created':
          comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          break
        case 'views':
          comparison = (b.view_count || 0) - (a.view_count || 0)
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
      }
      return sortOrder === 'desc' ? comparison : -comparison
    })

    return filtered
  }, [playbooks, selectedCategory, searchQuery, sortBy, sortOrder])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    const params = new URLSearchParams(searchParams.toString())
    if (category !== 'All') {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    router.push(`/playbooks?${params.toString()}`)
  }

  const toggleSelect = (id: string) => {
    setSelectedPlaybooks(prev => {
      const updatedSelection = prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
      setShowBulkActions(updatedSelection.length > 0)
      return updatedSelection
    })
  }

  const selectAll = () => {
    if (selectedPlaybooks.length === filteredPlaybooks.length) {
      setSelectedPlaybooks([])
      setShowBulkActions(false)
    } else {
      setSelectedPlaybooks(filteredPlaybooks.map(p => p.id))
      setShowBulkActions(true)
    }
  }

  const clearSelection = () => {
    setSelectedPlaybooks([])
    setShowBulkActions(false)
  }

  return (
    <div className="space-y-6">
      {/* Search and Actions Bar */}
      <div className="flex flex-col gap-4">
        {/* Top Row - Search and View Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search playbooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 relative"
          >
            <Filter className="w-4 h-4 text-gray-600" />
            {(selectedCategory !== 'All' || sortBy !== 'updated') && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          {/* Desktop View Toggle */}
          <div className="hidden sm:flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-white text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-white text-gray-400 hover:text-gray-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Create Button */}
          <Link
            href="/playbooks/new"
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Playbook</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>

        {/* Filters Row - Expandable on Mobile */}
        <div className={`${showFilters ? 'flex' : 'hidden sm:flex'} flex-col sm:flex-row gap-3`}>
          {/* Category Filter */}
          <div className="relative flex-1 sm:max-w-xs">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90" />
          </div>

          {/* Sort Controls */}
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-40">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full pl-9 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="updated">Last updated</option>
                <option value="created">Date created</option>
                <option value="views">Most viewed</option>
                <option value="title">Title</option>
              </select>
            </div>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              <ArrowUpDown className={`w-4 h-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Clear Filters Button */}
          {(selectedCategory !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All')
                setSearchQuery('')
                handleCategoryChange('All')
                setShowFilters(false)
              }}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-emerald-600 bg-emerald-50 rounded-xl"
            >
              <X className="w-4 h-4" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="fixed bottom-20 left-0 right-0 sm:bottom-6 sm:left-auto sm:right-6 z-50 mx-4 sm:mx-0 animate-slide-up">
          <div className="bg-gray-900 text-white rounded-xl shadow-2xl p-3 flex items-center justify-between sm:min-w-[400px]">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                {selectedPlaybooks.length} selected
              </span>
              <button
                onClick={clearSelection}
                className="text-xs text-gray-400 hover:text-white"
              >
                Clear
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors" title="Copy">
                <Copy className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors" title="Archive">
                <Archive className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition-colors" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {filteredPlaybooks.length} playbook{filteredPlaybooks.length !== 1 ? 's' : ''}
        </p>
        {filteredPlaybooks.length > 0 && (
          <button
            onClick={selectAll}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {selectedPlaybooks.length === filteredPlaybooks.length ? 'Deselect all' : 'Select all'}
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredPlaybooks.length === 0 && (
        <div className="text-center py-12 sm:py-16 bg-white rounded-xl border border-gray-200">
          <div className="inline-flex p-3 bg-gray-100 rounded-xl mb-4">
            <FolderOpen className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">No playbooks found</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'All'
              ? 'Try adjusting your filters or search query'
              : 'Get started by creating your first playbook'}
          </p>
          {!searchQuery && selectedCategory === 'All' && (
            <Link
              href="/playbooks/new"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Playbook
            </Link>
          )}
        </div>
      )}

      {/* Playbooks Display */}
      {filteredPlaybooks.length > 0 && (
        <>
          {/* Mobile Grid View */}
          <div className="sm:hidden space-y-3">
            {filteredPlaybooks.map((playbook) => (
              <div
                key={playbook.id}
                className={`bg-white border rounded-xl p-4 transition-all ${
                  selectedPlaybooks.includes(playbook.id)
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-gray-200 hover:border-emerald-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedPlaybooks.includes(playbook.id)}
                      onChange={() => toggleSelect(playbook.id)}
                      className="absolute -left-1 -top-1 w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center ml-4">
                      <FileText className="w-6 h-6 text-gray-500" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{playbook.title}</h3>
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${getCategoryStyle(playbook.category)}`}>
                          {playbook.category}
                        </span>
                      </div>
                      <Link
                        href={`/playbooks/${playbook.id}`}
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                    {playbook.description && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{playbook.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {playbook.view_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(playbook.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Views */}
          <div className="hidden sm:block">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlaybooks.map((playbook) => (
                  <div
                    key={playbook.id}
                    className={`group relative bg-white border rounded-xl p-5 transition-all ${
                      selectedPlaybooks.includes(playbook.id)
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 hover:border-emerald-200 hover:shadow-md'
                    }`}
                  >
                    <div className="absolute top-4 left-4">
                      <input
                        type="checkbox"
                        checked={selectedPlaybooks.includes(playbook.id)}
                        onChange={() => toggleSelect(playbook.id)}
                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </div>
                    
                    <Link href={`/playbooks/${playbook.id}`} className="block">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-emerald-50 transition-colors">
                          <FileText className="w-8 h-8 text-gray-500 group-hover:text-emerald-600 transition-colors" />
                        </div>
                        <h3 className="font-medium text-gray-900 truncate w-full mb-1">
                          {playbook.title}
                        </h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full mb-2 ${getCategoryStyle(playbook.category)}`}>
                          {playbook.category}
                        </span>
                        {playbook.description && (
                          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                            {playbook.description}
                          </p>
                        )}
                        <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {playbook.view_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(playbook.updated_at)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="w-10 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedPlaybooks.length === filteredPlaybooks.length && filteredPlaybooks.length > 0}
                          onChange={selectAll}
                          className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                        Title
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                        Category
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                        Views
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                        Last updated
                      </th>
                      <th className="w-10 px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPlaybooks.map((playbook) => (
                      <tr
                        key={playbook.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          selectedPlaybooks.includes(playbook.id) ? 'bg-emerald-50/50' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedPlaybooks.includes(playbook.id)}
                            onChange={() => toggleSelect(playbook.id)}
                            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/playbooks/${playbook.id}`} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-gray-500" />
                            </div>
                            <span className="font-medium text-gray-900 hover:text-emerald-600 transition-colors">
                              {playbook.title}
                            </span>
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryStyle(playbook.category)}`}>
                            {playbook.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {playbook.view_count || 0}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {formatDistanceToNow(playbook.updated_at)}
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
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
    Other: 'bg-gray-100 text-gray-700',
  }
  return styles[category] || styles.Other
}