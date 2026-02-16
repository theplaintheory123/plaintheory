'use client'

import { useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Template } from '@/lib/types/database'
import { useTemplateAction } from '@/lib/actions/playbook'
import {
  Layers,
  Star,
  ListChecks,
  Users,
  ArrowRight,
  Filter,
  Sparkles,
  Loader2,
  Lightbulb,
  Mail,
  LayoutTemplate,
  TrendingUp,
  Crown,
  Grid,
  Search,
  X,
  Check,
  Clock,
  Zap,
} from 'lucide-react'

type Props = {
  templates: Template[]
  featuredTemplate: Template | null
  workspaceId: string
}

const categories = ['All', 'HR', 'Operations', 'Support', 'Finance', 'Marketing', 'Sales', 'Other']

export function TemplatesClient({ templates, featuredTemplate, workspaceId }: Props) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null)

  // Filter templates by category and search
  const filteredTemplates = useMemo(() => {
    let filtered = templates
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((t) => t.category === selectedCategory)
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }, [templates, selectedCategory, searchQuery])

  // Calculate category counts
  const categoryCounts = templates.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Get total uses
  const totalUses = templates.reduce((sum, t) => sum + (t.uses_count || 0), 0)

  const handleUseTemplate = async (templateId: string) => {
    setLoadingTemplate(templateId)
    startTransition(async () => {
      const result = await useTemplateAction(templateId, workspaceId)
      if (result.playbookId) {
        router.push(`/playbooks/${result.playbookId}`)
      } else {
        setLoadingTemplate(null)
      }
    })
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <LayoutTemplate className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{templates.length}</p>
              <p className="text-xs text-gray-500">Templates</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Layers className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{Object.keys(categoryCounts).length}</p>
              <p className="text-xs text-gray-500">Categories</p>
            </div>
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{totalUses}</p>
              <p className="text-xs text-gray-500">Total Uses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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

        {/* Category Filters - Scrollable on Mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
          <span className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
            <Filter className="w-3 h-3" />
            Filter:
          </span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {category}
              {category !== 'All' && categoryCounts[category] && (
                <span className={`ml-1 ${selectedCategory === category ? 'text-emerald-200' : 'text-gray-400'}`}>
                  {categoryCounts[category]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Template */}
      {featuredTemplate && selectedCategory === 'All' && !searchQuery && (
        <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
          {/* Popular Badge - Mobile Adjusted */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 sm:px-3 py-1 text-xs font-medium text-amber-700">
              <Crown className="w-3 h-3" />
              <span className="hidden sm:inline">Most Popular</span>
              <span className="sm:hidden">Popular</span>
            </span>
          </div>

          <div className="p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">{featuredTemplate.title}</h2>
                  <span className={`inline-flex self-start rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryColor(featuredTemplate.category)}`}>
                    {featuredTemplate.category}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 max-w-xl">
                  {featuredTemplate.description}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-0">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <ListChecks className="w-4 h-4 text-emerald-500" />
                    {featuredTemplate.steps_count} steps
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Users className="w-4 h-4 text-purple-500" />
                    {featuredTemplate.uses_count} uses
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleUseTemplate(featuredTemplate.id)}
                disabled={isPending && loadingTemplate === featuredTemplate.id}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 sm:px-6 py-3 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 mt-2 sm:mt-0"
              >
                {isPending && loadingTemplate === featuredTemplate.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Use Template
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">{filteredTemplates.length}</span> template{filteredTemplates.length !== 1 ? 's' : ''}
          {searchQuery && <span> for "{searchQuery}"</span>}
        </p>
        {filteredTemplates.length > 0 && (
          <span className="text-xs text-gray-400">
            Last updated today
          </span>
        )}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group relative bg-white rounded-xl border border-gray-200 p-5 hover:border-emerald-200 hover:shadow-md transition-all"
            >
              {/* Category Badge - Mobile Optimized */}
              <div className="absolute top-4 right-4">
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(template.category)}`}>
                  {template.category}
                </span>
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6 text-emerald-600" />
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-medium text-gray-900 mb-2 pr-16">
                {template.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 min-h-[40px]">
                {template.description}
              </p>

              {/* Footer Stats */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <ListChecks className="w-3.5 h-3.5" />
                    {template.steps_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {template.uses_count}
                  </span>
                </div>
                <button
                  onClick={() => handleUseTemplate(template.id)}
                  disabled={isPending && loadingTemplate === template.id}
                  className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors disabled:opacity-50"
                >
                  {isPending && loadingTemplate === template.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Creating
                    </>
                  ) : (
                    <>
                      Use Template
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Hover Accent Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div className="bg-white rounded-xl border border-gray-200 py-12 sm:py-16 text-center">
          <div className="inline-flex p-3 bg-gray-100 rounded-xl mb-4">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">No templates found</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            {searchQuery 
              ? `No templates matching "${searchQuery}"`
              : 'Try selecting a different category'
            }
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All')
              setSearchQuery('')
            }}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Request Template */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <Lightbulb className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Need a specific template?</h3>
              <p className="text-xs text-gray-500">
                Can't find what you're looking for? Contact us and we'll help create a custom template.
              </p>
            </div>
          </div>
          <a
            href="mailto:support@plantheory.com?subject=Template%20Request"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center"
          >
            <Mail className="w-4 h-4" />
            Request Template
          </a>
        </div>
      </div>

      {/* Quick Tip */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Pro Tip</h4>
            <p className="text-xs text-gray-600">
              Using templates saves time and ensures consistency across your playbooks. 
              Each template includes pre-built steps you can customize.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    HR: 'bg-blue-50 text-blue-700',
    Operations: 'bg-purple-50 text-purple-700',
    Support: 'bg-emerald-50 text-emerald-700',
    Finance: 'bg-amber-50 text-amber-700',
    Marketing: 'bg-pink-50 text-pink-700',
    Sales: 'bg-cyan-50 text-cyan-700',
    Other: 'bg-gray-100 text-gray-700',
  }
  return colors[category] || colors.Other
}