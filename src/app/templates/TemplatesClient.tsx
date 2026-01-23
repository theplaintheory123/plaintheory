'use client'

import { useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Template } from '@/lib/types/database'
import { useTemplateAction } from '@/lib/actions/playbook'

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
      {/* Category Filters */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
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

      {/* Featured Template */}
      {featuredTemplate && selectedCategory === 'All' && (
        <div className="mb-8 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Most Popular
              </div>
              <h2 className="mb-2 text-2xl font-bold text-slate-900">{featuredTemplate.title}</h2>
              <p className="mb-4 text-slate-600">
                {featuredTemplate.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {featuredTemplate.steps_count} steps
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {featuredTemplate.uses_count} uses
                </span>
              </div>
            </div>
            <button
              onClick={() => handleUseTemplate(featuredTemplate.id)}
              disabled={isPending && loadingTemplate === featuredTemplate.id}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50"
            >
              {isPending && loadingTemplate === featuredTemplate.id ? (
                'Creating...'
              ) : (
                <>
                  Use Template
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-lg"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-600 transition-transform group-hover:scale-110">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(template.category)}`}>
                  {template.category}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 group-hover:text-indigo-600">
                {template.title}
              </h3>
              <p className="mb-4 text-sm text-slate-600 line-clamp-2">{template.description}</p>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {template.steps_count} steps
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {template.uses_count} uses
                  </span>
                </div>
                <button
                  onClick={() => handleUseTemplate(template.id)}
                  disabled={isPending && loadingTemplate === template.id}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
                >
                  {isPending && loadingTemplate === template.id ? 'Creating...' : 'Use'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <h3 className="mb-1 font-semibold text-slate-900">No templates in this category</h3>
          <p className="text-sm text-slate-600">Try selecting a different category</p>
        </div>
      )}

      {/* Request Template */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-900">Need a specific template?</h3>
        <p className="mb-4 text-slate-600">
          Can't find what you're looking for? Contact us and we'll help you create it.
        </p>
        <a
          href="mailto:support@plantheory.app?subject=Template%20Request"
          className="rounded-xl border-2 border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Request Template
        </a>
      </div>
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
