'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Step = {
  id: string
  title: string
  description: string
  tools: { name: string; url: string }[]
}

export default function NewPlaybookPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [steps, setSteps] = useState<Step[]>([
    { id: '1', title: '', description: '', tools: [] },
  ])
  const [saving, setSaving] = useState(false)

  const categories = ['HR', 'Operations', 'Support', 'Finance', 'Marketing', 'Sales', 'Other']

  const addStep = () => {
    setSteps([
      ...steps,
      { id: String(Date.now()), title: '', description: '', tools: [] },
    ])
  }

  const removeStep = (id: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter((step) => step.id !== id))
    }
  }

  const updateStep = (id: string, field: keyof Step, value: string) => {
    setSteps(
      steps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step
      )
    )
  }

  const addTool = (stepId: string) => {
    setSteps(
      steps.map((step) =>
        step.id === stepId
          ? { ...step, tools: [...step.tools, { name: '', url: '' }] }
          : step
      )
    )
  }

  const updateTool = (stepId: string, toolIndex: number, field: 'name' | 'url', value: string) => {
    setSteps(
      steps.map((step) =>
        step.id === stepId
          ? {
              ...step,
              tools: step.tools.map((tool, i) =>
                i === toolIndex ? { ...tool, [field]: value } : tool
              ),
            }
          : step
      )
    )
  }

  const removeTool = (stepId: string, toolIndex: number) => {
    setSteps(
      steps.map((step) =>
        step.id === stepId
          ? { ...step, tools: step.tools.filter((_, i) => i !== toolIndex) }
          : step
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, save to database here
    console.log({ title, description, category, steps })

    router.push('/playbooks')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/playbooks"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">New Playbook</h1>
              <p className="text-sm text-slate-500">Create a new operational playbook</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/playbooks"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={saving || !title}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Playbook'}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-slate-900">Basic Information</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="mb-2 block text-sm font-semibold text-slate-900">
                  Playbook Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g., Employee Onboarding Process"
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                />
              </div>
              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-900">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe what this playbook is for..."
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                />
              </div>
              <div>
                <label htmlFor="category" className="mb-2 block text-sm font-semibold text-slate-900">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Steps</h2>
              <button
                type="button"
                onClick={addStep}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Step
              </button>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                        {index + 1}
                      </div>
                      <span className="font-medium text-slate-900">Step {index + 1}</span>
                    </div>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(step.id)}
                        className="text-slate-400 transition-colors hover:text-red-600"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Step Title
                      </label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                        placeholder="e.g., Send Welcome Email"
                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Instructions
                      </label>
                      <textarea
                        value={step.description}
                        onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                        rows={3}
                        placeholder="Describe what needs to be done in this step..."
                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                      />
                    </div>

                    {/* Tools */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-700">
                          Tools & Links (optional)
                        </label>
                        <button
                          type="button"
                          onClick={() => addTool(step.id)}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          + Add Tool
                        </button>
                      </div>
                      {step.tools.length > 0 && (
                        <div className="space-y-2">
                          {step.tools.map((tool, toolIndex) => (
                            <div key={toolIndex} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={tool.name}
                                onChange={(e) => updateTool(step.id, toolIndex, 'name', e.target.value)}
                                placeholder="Tool name"
                                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-indigo-600 focus:outline-none"
                              />
                              <input
                                type="url"
                                value={tool.url}
                                onChange={(e) => updateTool(step.id, toolIndex, 'url', e.target.value)}
                                placeholder="https://..."
                                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-indigo-600 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => removeTool(step.id, toolIndex)}
                                className="text-slate-400 hover:text-red-600"
                              >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Step Button */}
            <button
              type="button"
              onClick={addStep}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 py-4 text-sm font-medium text-slate-600 transition-colors hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Step
            </button>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
            <Link
              href="/playbooks"
              className="rounded-xl border-2 border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || !title}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Create Playbook'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
