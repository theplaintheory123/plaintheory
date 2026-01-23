import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import DashboardLayout from '@/components/ui/DashboardLayout'
import Link from 'next/link'
import { getPlaybook, getUserWorkspace } from '@/lib/supabase/queries'
import { formatDate, formatDistanceToNow } from '@/lib/utils/date'
import { DeletePlaybookButton } from './DeletePlaybookButton'
import { ShareButton } from './ShareButton'

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

  const workspace = await getUserWorkspace(user.id)
  if (!workspace) {
    redirect('/onboarding')
  }

  const playbook = await getPlaybook(id)

  if (!playbook) {
    notFound()
  }

  // Verify playbook belongs to user's workspace
  if (playbook.workspace_id !== workspace.id) {
    notFound()
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
        <span className="font-medium text-slate-900 truncate max-w-xs">{playbook.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(playbook.category)}`}>
                  {playbook.category}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{playbook.title}</h1>
              {playbook.description && (
                <p className="mt-1 text-slate-600">{playbook.description}</p>
              )}
            </div>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <ShareButton playbookId={id} workspaceId={workspace.id} />
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
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-[10px] font-medium text-white">
              {playbook.owner?.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <span className="text-slate-500">Owner:</span>{' '}
              <span className="font-medium text-slate-900">
                {playbook.owner?.full_name || 'Unknown'}
              </span>
            </div>
          </div>
          <div>
            <span className="text-slate-500">Created:</span>{' '}
            <span className="font-medium text-slate-900">{formatDate(playbook.created_at)}</span>
          </div>
          <div>
            <span className="text-slate-500">Last updated:</span>{' '}
            <span className="font-medium text-slate-900">{formatDistanceToNow(playbook.updated_at)}</span>
          </div>
          <div>
            <span className="text-slate-500">Steps:</span>{' '}
            <span className="font-medium text-slate-900">{playbook.steps?.length || 0}</span>
          </div>
          <div>
            <span className="text-slate-500">Views:</span>{' '}
            <span className="font-medium text-slate-900">{playbook.view_count || 0}</span>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Steps</h2>
        {playbook.steps && playbook.steps.length > 0 ? (
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
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-2 text-lg font-semibold text-slate-900">{step.title}</h3>
                    {step.description && (
                      <p className="text-slate-600">{step.description}</p>
                    )}
                    {step.tools && step.tools.length > 0 && (
                      <div className="mt-4">
                        <p className="mb-2 text-sm font-medium text-slate-500">Tools:</p>
                        <div className="flex flex-wrap gap-2">
                          {step.tools.map((tool) => (
                            <a
                              key={tool.id}
                              href={tool.url || '#'}
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
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="mb-1 font-semibold text-slate-900">No steps yet</h3>
            <p className="mb-4 text-sm text-slate-600">Add steps to this playbook</p>
            <Link
              href={`/playbooks/${id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Add Steps
            </Link>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <DeletePlaybookButton playbookId={id} playbookTitle={playbook.title} />
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
