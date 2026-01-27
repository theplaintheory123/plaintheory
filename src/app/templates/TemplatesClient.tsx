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
  const [isPending, startTransition] = useTransition()
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null)

  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'All') {
      return templates
    }
    return templates.filter((t) => t.category === selectedCategory)
  }, [templates, selectedCategory])

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
    <>
      {/* Stats Bar */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
            <LayoutTemplate className="h-5 w-5 text-indigo-600" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{templates.length}</p>
            <p className="text-xs font-medium text-slate-500">Available Templates</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
            <Layers className="h-5 w-5 text-purple-600" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{Object.keys(categoryCounts).length}</p>
            <p className="text-xs font-medium text-slate-500">Categories</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
            <TrendingUp className="h-5 w-5 text-emerald-600" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{totalUses}</p>
            <p className="text-xs font-medium text-slate-500">Total Uses</p>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-2">
        <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <Filter className="h-4 w-4" strokeWidth={2} />
          Filter:
        </span>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
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

      {/* Featured Template */}
      {featuredTemplate && selectedCategory === 'All' && (
        <div className="mb-8 overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="relative p-6 sm:p-8">
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">
                <Crown className="h-3.5 w-3.5" strokeWidth={2} />
                Most Popular
              </span>
            </div>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
                    <Sparkles className="h-7 w-7" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{featuredTemplate.title}</h2>
                    <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${getCategoryColor(featuredTemplate.category)}`}>
                      {featuredTemplate.category}
                    </span>
                  </div>
                </div>
                <p className="mb-6 text-slate-600 max-w-xl">
                  {featuredTemplate.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 shadow-sm">
                    <ListChecks className="h-4 w-4 text-indigo-500" strokeWidth={2} />
                    {featuredTemplate.steps_count} steps
                  </span>
                  <span className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 shadow-sm">
                    <Users className="h-4 w-4 text-purple-500" strokeWidth={2} />
                    {featuredTemplate.uses_count} uses
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleUseTemplate(featuredTemplate.id)}
                disabled={isPending && loadingTemplate === featuredTemplate.id}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98] disabled:opacity-50"
              >
                {isPending && loadingTemplate === featuredTemplate.id ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2} />
                    Creating...
                  </>
                ) : (
                  <>
                    Use This Template
                    <ArrowRight className="h-5 w-5" strokeWidth={2} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Info */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-900">{filteredTemplates.length}</span>
          {filteredTemplates.length !== templates.length && (
            <span> of <span className="font-medium text-slate-900">{templates.length}</span></span>
          )}
          {' '}templates
          {selectedCategory !== 'All' && <span> in <span className="font-medium text-slate-900">{selectedCategory}</span></span>}
        </p>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-lg"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 transition-transform group-hover:scale-110">
                  <Layers className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${getCategoryColor(template.category)}`}>
                  {template.category}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                {template.title}
              </h3>
              <p className="mb-4 text-sm text-slate-500 line-clamp-2 min-h-[40px]">{template.description}</p>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <ListChecks className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
                    {template.steps_count} steps
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
                    {template.uses_count} uses
                  </span>
                </div>
                <button
                  onClick={() => handleUseTemplate(template.id)}
                  disabled={isPending && loadingTemplate === template.id}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-600 transition-all hover:bg-indigo-100 disabled:opacity-50"
                >
                  {isPending && loadingTemplate === template.id ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                      Creating
                    </>
                  ) : (
                    <>
                      Use
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </>
                  )}
                </button>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
            <Layers className="h-10 w-10 text-slate-400" strokeWidth={1.5} />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-slate-900">No templates in this category</h3>
          <p className="mb-6 text-sm text-slate-500 max-w-sm mx-auto">
            Try selecting a different category or browse all templates
          </p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
          >
            View All Templates
          </button>
        </div>
      )}

      {/* Request Template */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                <Lightbulb className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Need a specific template?</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Can't find what you're looking for? Contact us and we'll help you create a custom template for your needs.
                </p>
              </div>
            </div>
            <a
              href="mailto:support@plaintheory.com?subject=Template%20Request"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
            >
              <Mail className="h-4 w-4" strokeWidth={2} />
              Request Template
            </a>
          </div>
        </div>
      </div>
    </>
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
    Other: 'bg-slate-100 text-slate-700',
  }
  return colors[category] || colors.Other
}
