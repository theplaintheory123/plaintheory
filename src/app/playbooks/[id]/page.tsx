import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/ui/DashboardLayout'
import Link from 'next/link'

type Props = {
  params: Promise<{ id: string }>
}

export default async function PlaybookViewPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Mock data for the playbook
  const playbook = {
    id,
    title: 'Employee Onboarding Process',
    description: 'Complete guide for onboarding new team members to ensure a smooth transition and quick productivity.',
    category: 'HR',
    owner: {
      name: 'John Doe',
      email: 'john@example.com',
    },
    createdAt: 'January 15, 2026',
    updatedAt: '2 hours ago',
    steps: [
      {
        id: '1',
        title: 'Send Welcome Email',
        description: 'Send a personalized welcome email to the new employee with first-day instructions.',
        tools: [{ name: 'Gmail', url: 'https://mail.google.com' }],
      },
      {
        id: '2',
        title: 'Prepare Workstation',
        description: 'Set up the new employee\'s desk with computer, monitor, keyboard, and necessary office supplies.',
        tools: [],
      },
      {
        id: '3',
        title: 'Create Accounts',
        description: 'Create all necessary accounts including email, Slack, project management tools, and HR system access.',
        tools: [
          { name: 'Google Admin', url: 'https://admin.google.com' },
          { name: 'Slack Admin', url: 'https://slack.com/admin' },
        ],
      },
      {
        id: '4',
        title: 'Schedule Orientation Meeting',
        description: 'Book a 1-hour orientation meeting with HR and the new employee\'s direct manager.',
        tools: [{ name: 'Google Calendar', url: 'https://calendar.google.com' }],
      },
      {
        id: '5',
        title: 'Assign Onboarding Buddy',
        description: 'Pair the new employee with an experienced team member who can help answer questions and provide guidance.',
        tools: [],
      },
      {
        id: '6',
        title: 'Review Company Policies',
        description: 'Walk through important company policies, benefits, and procedures during the first week.',
        tools: [{ name: 'Employee Handbook', url: '#' }],
      },
    ],
  }

  return (
    <DashboardLayout user={user}>
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm">
        <Link href="/playbooks" className="text-slate-500 hover:text-slate-700">
          Playbooks
        </Link>
        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-medium text-slate-900">{playbook.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                  {playbook.category}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{playbook.title}</h1>
              <p className="mt-1 text-slate-600">{playbook.description}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="rounded-xl border-2 border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
              Share
            </button>
            <Link
              href={`/playbooks/${id}/edit`}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl"
            >
              Edit
            </Link>
          </div>
        </div>

        {/* Meta Info */}
        <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-slate-100 pt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600" />
            <div>
              <span className="text-slate-500">Owner:</span>{' '}
              <span className="font-medium text-slate-900">{playbook.owner.name}</span>
            </div>
          </div>
          <div>
            <span className="text-slate-500">Created:</span>{' '}
            <span className="font-medium text-slate-900">{playbook.createdAt}</span>
          </div>
          <div>
            <span className="text-slate-500">Last updated:</span>{' '}
            <span className="font-medium text-slate-900">{playbook.updatedAt}</span>
          </div>
          <div>
            <span className="text-slate-500">Steps:</span>{' '}
            <span className="font-medium text-slate-900">{playbook.steps.length}</span>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Steps</h2>
        <div className="space-y-4">
          {playbook.steps.map((step, index) => (
            <div
              key={step.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200"
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
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button className="rounded-xl border-2 border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50">
          Delete Playbook
        </button>
        <Link
          href={`/playbooks/${id}/edit`}
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl"
        >
          Edit Playbook
        </Link>
      </div>
    </DashboardLayout>
  )
}
