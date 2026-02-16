'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createPlaybookAction, updatePlaybookAction } from '@/lib/actions/playbook'
import type { PlaybookCategory } from '@/lib/types/database'
import {
  ChevronLeft,
  Save,
  X,
  Plus,
  Trash2,
  GripVertical,
  Link2,
  FileText,
  Tag,
  AlertCircle,
  Check,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react'

type Step = {
  id?: string
  title: string
  description: string
  tools: { id?: string; name: string; url: string }[]
}

type Props = {
  workspaceId: string
  mode: 'create' | 'edit'
  initialData?: {
    id?: string
    title: string
    description: string
    category: PlaybookCategory
    steps: Step[]
  }
  templateId?: string
}

const categories: { value: PlaybookCategory; label: string; color: string }[] = [
  { value: 'HR', label: 'HR', color: 'blue' },
  { value: 'Operations', label: 'Operations', color: 'purple' },
  { value: 'Support', label: 'Support', color: 'emerald' },
  { value: 'Finance', label: 'Finance', color: 'amber' },
  { value: 'Marketing', label: 'Marketing', color: 'pink' },
  { value: 'Sales', label: 'Sales', color: 'cyan' },
  { value: 'Other', label: 'Other', color: 'gray' },
]

export function PlaybookForm({ workspaceId, mode, initialData, templateId }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [category, setCategory] = useState<PlaybookCategory>(initialData?.category || 'Other')
  const [steps, setSteps] = useState<Step[]>(
    initialData?.steps?.length
      ? initialData.steps
      : [{ title: '', description: '', tools: [] }]
  )

  const addStep = () => {
    setSteps([...steps, { title: '', description: '', tools: [] }])
    // Scroll to new step
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      })
    }, 100)
  }

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index))
    }
  }

  const updateStep = (index: number, field: keyof Step, value: string) => {
    setSteps(
      steps.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      )
    )
  }

  const addTool = (stepIndex: number) => {
    setSteps(
      steps.map((step, i) =>
        i === stepIndex
          ? { ...step, tools: [...step.tools, { name: '', url: '' }] }
          : step
      )
    )
  }

  const updateTool = (stepIndex: number, toolIndex: number, field: 'name' | 'url', value: string) => {
    setSteps(
      steps.map((step, i) =>
        i === stepIndex
          ? {
              ...step,
              tools: step.tools.map((tool, j) =>
                j === toolIndex ? { ...tool, [field]: value } : tool
              ),
            }
          : step
      )
    )
  }

  const removeTool = (stepIndex: number, toolIndex: number) => {
    setSteps(
      steps.map((step, i) =>
        i === stepIndex
          ? { ...step, tools: step.tools.filter((_, j) => j !== toolIndex) }
          : step
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    const formData = new FormData()
    formData.set('title', title)
    formData.set('description', description)
    formData.set('category', category)
    formData.set('steps', JSON.stringify(steps.filter(s => s.title.trim())))

    startTransition(async () => {
      try {
        if (mode === 'edit' && initialData?.id) {
          const result = await updatePlaybookAction(initialData.id, { error: undefined, success: false }, formData)
          if (result?.error) {
            setError(result.error)
          } else {
            setSuccess(true)
            setTimeout(() => router.push('/playbooks'), 1500)
          }
        } else {
          const result = await createPlaybookAction(workspaceId, { error: undefined, success: false }, formData)
          if (result?.error) {
            setError(result.error)
          } else {
            setSuccess(true)
            setTimeout(() => router.push('/playbooks'), 1500)
          }
        }
      } catch {
        setError('An unexpected error occurred')
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/playbooks"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-medium text-gray-900">
                {mode === 'edit' ? 'Edit Playbook' : 'Create New Playbook'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                {mode === 'edit' ? 'Update your playbook details' : 'Document your process step by step'}
              </p>
            </div>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/playbooks"
              className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={isPending || !title}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {mode === 'edit' ? 'Save Changes' : 'Create Playbook'}
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
        {/* Success Message */}
        {success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                <Check className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-800">
                  {mode === 'edit' ? 'Playbook updated successfully!' : 'Playbook created successfully!'}
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Redirecting to playbooks...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-xs text-red-600 mt-0.5">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-emerald-600" />
              </div>
              <h2 className="text-base font-medium text-gray-900">Basic Information</h2>
            </div>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Playbook Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Employee Onboarding Process"
                  className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe what this playbook is for and when to use it..."
                  className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PlaybookCategory)}
                    className="w-full pl-9 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <ChevronLeft className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90" />
                </div>
              </div>
            </div>
          </div>

          {/* Steps Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <h2 className="text-base font-medium text-gray-900">Steps</h2>
              </div>
              <button
                type="button"
                onClick={addStep}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                <Plus className="w-4 h-4" />
                Add Step
              </button>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 relative"
                >
                  {/* Step Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-sm font-medium text-emerald-700 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => updateStep(index, 'title', e.target.value)}
                        placeholder="Step title (e.g., Send Welcome Email)"
                        className="w-full text-sm font-medium text-gray-900 placeholder-gray-400 bg-transparent border-0 border-b border-transparent focus:border-emerald-500 focus:ring-0 px-0 py-1"
                      />
                    </div>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove step"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Step Description */}
                  <div className="ml-11 mb-4">
                    <textarea
                      value={step.description}
                      onChange={(e) => updateStep(index, 'description', e.target.value)}
                      rows={2}
                      placeholder="Describe what needs to be done in this step..."
                      className="w-full text-sm text-gray-600 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Tools Section */}
                  <div className="ml-11">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tools & Links
                      </label>
                      <button
                        type="button"
                        onClick={() => addTool(index)}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add Tool
                      </button>
                    </div>

                    {step.tools.length > 0 && (
                      <div className="space-y-2">
                        {step.tools.map((tool, toolIndex) => (
                          <div key={toolIndex} className="flex items-center gap-2">
                            <div className="flex-1 flex items-center gap-2">
                              <input
                                type="text"
                                value={tool.name}
                                onChange={(e) => updateTool(index, toolIndex, 'name', e.target.value)}
                                placeholder="Tool name"
                                className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                              <input
                                type="url"
                                value={tool.url}
                                onChange={(e) => updateTool(index, toolIndex, 'url', e.target.value)}
                                placeholder="https://..."
                                className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeTool(index, toolIndex)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {step.tools.length === 0 && (
                      <div className="text-center py-3 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                        <Link2 className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">No tools added yet</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Step Button (Mobile) */}
            <button
              type="button"
              onClick={addStep}
              className="mt-4 w-full sm:hidden flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Another Step
            </button>
          </div>

          {/* Mobile Submit Button */}
          <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
            <div className="flex gap-3">
              <Link
                href="/playbooks"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 text-center"
              >
                Cancel
              </Link>
              <button
                onClick={handleSubmit}
                disabled={isPending || !title}
                className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {isPending ? 'Saving...' : mode === 'edit' ? 'Save' : 'Create'}
              </button>
            </div>
          </div>

          {/* Desktop Bottom Bar */}
          <div className="hidden sm:flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              href="/playbooks"
              className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={isPending || !title}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-600/20"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {mode === 'edit' ? 'Save Changes' : 'Create Playbook'}
                </>
              )}
            </button>
          </div>

          {/* Template Info (if from template) */}
          {templateId && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Creating from template</p>
                  <p className="text-xs text-blue-600 mt-1">
                    You're using a template. Fill in the details to customize it for your needs.
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  )
}