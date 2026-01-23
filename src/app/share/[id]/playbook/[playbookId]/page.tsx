'use client'

import { use } from 'react'
import Link from 'next/link'

type Props = {
  params: Promise<{ id: string; playbookId: string }>
}

export default function SharedPlaybookPage({ params }: Props) {
  const { id, playbookId } = use(params)

  // Mock data for the playbook
  const playbook = {
    id: playbookId,
    title: 'Employee Onboarding Process',
    description: 'Complete guide for onboarding new team members to ensure a smooth transition and quick productivity.',
    category: 'HR',
    updatedAt: '2 hours ago',
    steps: [
      {
        id: '1',
        title: 'Send Welcome Email',
        description: 'Send a personalized welcome email to the new employee with first-day instructions, including start time, dress code, what to bring, and parking information.',
        tools: [{ name: 'Gmail', url: 'https://mail.google.com' }],
      },
      {
        id: '2',
        title: 'Prepare Workstation',
        description: 'Set up the new employee\'s desk with computer, monitor, keyboard, mouse, and necessary office supplies. Ensure all equipment is tested and working properly.',
        tools: [],
      },
      {
        id: '3',
        title: 'Create Accounts',
        description: 'Create all necessary accounts including email, Slack, project management tools, and HR system access. Document credentials securely.',
        tools: [
          { name: 'Google Admin', url: 'https://admin.google.com' },
          { name: 'Slack Admin', url: 'https://slack.com/admin' },
        ],
      },
      {
        id: '4',
        title: 'Schedule Orientation Meeting',
        description: 'Book a 1-hour orientation meeting with HR and the new employee\'s direct manager for the first day.',
        tools: [{ name: 'Google Calendar', url: 'https://calendar.google.com' }],
      },
      {
        id: '5',
        title: 'Assign Onboarding Buddy',
        description: 'Pair the new employee with an experienced team member who can help answer questions and provide guidance during the first few weeks.',
        tools: [],
      },
      {
        id: '6',
        title: 'Review Company Policies',
        description: 'Walk through important company policies, benefits, and procedures during the first week. Ensure all required documents are signed.',
        tools: [{ name: 'Employee Handbook', url: '#' }],
      },
    ],
  }

  const workspace = {
    name: 'Acme Corporation',
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href={`/share/${id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to {workspace.name}
            </Link>
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Only
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Playbook Header */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                  {playbook.category}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{playbook.title}</h1>
              <p className="mt-1 text-slate-600">{playbook.description}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-6 border-t border-slate-100 pt-4 text-sm text-slate-500">
            <span>Last updated: {playbook.updatedAt}</span>
            <span>{playbook.steps.length} steps</span>
          </div>
        </div>

        {/* Steps */}
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Steps</h2>
        <div className="space-y-4">
          {playbook.steps.map((step, index) => (
            <div
              key={step.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                  {step.tools.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-sm font-medium text-slate-500">Tools:</p>
                      <div className="flex flex-wrap gap-2">
                        {step.tools.map((tool) => (
                          <a
                            key={tool.name}
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-indigo-100 hover:text-indigo-700"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            {tool.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-slate-600">
            Powered by{' '}
            <a href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              Plantheory
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
