'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from '@/lib/actions/workspace'
import Image from 'next/image'

type IndustryOption = {
  id: string
  name: string
  icon: string
}

const industries: IndustryOption[] = [
  { id: 'restaurant', name: 'Restaurant & Food Service', icon: '🍽️' },
  { id: 'healthcare', name: 'Healthcare & Clinics', icon: '🏥' },
  { id: 'agency', name: 'Agency & Professional Services', icon: '🎨' },
  { id: 'retail', name: 'Retail & E-commerce', icon: '🛍️' },
  { id: 'technology', name: 'Technology & Startups', icon: '🚀' },
  { id: 'other', name: 'Other', icon: '📦' },
]

const teamSizes = [
  { id: '1-5', name: '1-5 employees' },
  { id: '6-20', name: '6-20 employees' },
  { id: '21-50', name: '21-50 employees' },
  { id: '51+', name: '51+ employees' },
]

const templates = [
  { id: 'employee-onboarding', name: 'Employee Onboarding', description: 'Streamline new hire processes' },
  { id: 'customer-support', name: 'Customer Support', description: 'Handle inquiries effectively' },
  { id: 'opening-closing', name: 'Opening & Closing', description: 'Daily operational checklists' },
  { id: 'inventory', name: 'Inventory Management', description: 'Track and manage stock' },
]

export function OnboardingClient() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [step, setStep] = useState(1)
  const [workspaceName, setWorkspaceName] = useState('')
  const [industry, setIndustry] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([])

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      // Complete onboarding
      const formData = new FormData()
      formData.set('workspaceName', workspaceName)
      formData.set('industry', industry)
      formData.set('teamSize', teamSize)
      formData.set('selectedTemplates', JSON.stringify(selectedTemplates))

      startTransition(async () => {
        const result = await completeOnboarding({ error: undefined, success: false }, formData)
        if (result?.error) {
          setError(result.error)
        }
      })
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const toggleTemplate = (id: string) => {
    setSelectedTemplates((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return workspaceName.length >= 2
      case 2:
        return industry !== ''
      case 3:
        return teamSize !== ''
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Image src="logo-text.svg" width={140} height={140} alt='plaintheory'/>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 w-8 rounded-full transition-colors ${
                  s <= step ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Step 1: Workspace Name */}
          {step === 1 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h1 className="mb-2 text-2xl font-bold text-slate-900">Welcome! Let's set up your workspace</h1>
                <p className="text-slate-600">What would you like to call your workspace?</p>
              </div>

              <div>
                <label htmlFor="workspaceName" className="mb-2 block text-sm font-semibold text-slate-900">
                  Workspace Name
                </label>
                <input
                  id="workspaceName"
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="e.g., Acme Corporation"
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                  autoFocus
                />
                <p className="mt-2 text-sm text-slate-500">
                  This is usually your company or team name
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Industry */}
          {step === 2 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
              <div className="mb-8 text-center">
                <h1 className="mb-2 text-2xl font-bold text-slate-900">What industry are you in?</h1>
                <p className="text-slate-600">We'll customize your experience based on your industry</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {industries.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => setIndustry(ind.id)}
                    className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                      industry === ind.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl">{ind.icon}</span>
                    <span className={`font-medium ${industry === ind.id ? 'text-indigo-900' : 'text-slate-900'}`}>
                      {ind.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Team Size */}
          {step === 3 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
              <div className="mb-8 text-center">
                <h1 className="mb-2 text-2xl font-bold text-slate-900">How big is your team?</h1>
                <p className="text-slate-600">This helps us recommend the right features for you</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {teamSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setTeamSize(size.id)}
                    className={`rounded-xl border-2 p-4 text-center transition-all ${
                      teamSize === size.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`font-medium ${teamSize === size.id ? 'text-indigo-900' : 'text-slate-900'}`}>
                      {size.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Templates */}
          {step === 4 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
              <div className="mb-8 text-center">
                <h1 className="mb-2 text-2xl font-bold text-slate-900">Start with templates</h1>
                <p className="text-slate-600">Select templates to add to your workspace (you can add more later)</p>
              </div>

              <div className="space-y-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => toggleTemplate(template.id)}
                    className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                      selectedTemplates.includes(template.id)
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-md border-2 ${
                        selectedTemplates.includes(template.id)
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {selectedTemplates.includes(template.id) && (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${selectedTemplates.includes(template.id) ? 'text-indigo-900' : 'text-slate-900'}`}>
                        {template.name}
                      </p>
                      <p className="text-sm text-slate-600">{template.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              <p className="mt-4 text-center text-sm text-slate-500">
                You can skip this step and add templates later
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`rounded-xl px-6 py-3 text-sm font-semibold transition-colors ${
                step === 1
                  ? 'invisible'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed() || isPending}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? 'Creating...' : step === 4 ? 'Complete Setup' : 'Continue'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
