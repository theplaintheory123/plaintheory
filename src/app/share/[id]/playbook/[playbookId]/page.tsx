import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getWorkspaceByShareLink, getSharedPlaybook } from '@/lib/supabase/queries'
import { formatDate } from '@/lib/utils/date'

type Props = {
  params: Promise<{ id: string; playbookId: string }>
}

export default async function SharedPlaybookPage({ params }: Props) {
  const { id: shareLink, playbookId } = await params

  const workspace = await getWorkspaceByShareLink(shareLink)

  if (!workspace) {
    notFound()
  }

  const playbook = await getSharedPlaybook(shareLink, playbookId)

  if (!playbook) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 shadow-lg">
              <span className="text-xl font-bold text-white">P</span>
            </div>
            <span className="text-xl font-bold text-slate-900">Plantheory</span>
          </div>
          <Link
            href="/auth/login"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <Link href={`/share/${shareLink}`} className="text-slate-500 hover:text-slate-700">
            {workspace.name}
          </Link>
          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-medium text-slate-900 truncate max-w-xs">{playbook.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  Read Only
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{playbook.title}</h1>
              {playbook.description && (
                <p className="mt-1 text-slate-600">{playbook.description}</p>
              )}
            </div>
          </div>

          {/* Meta Info */}
          <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-slate-100 pt-4 text-sm">
            <div>
              <span className="text-slate-500">Created:</span>{' '}
              <span className="font-medium text-slate-900">{formatDate(playbook.created_at)}</span>
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
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
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
              <p className="text-slate-600">This playbook has no steps yet.</p>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="flex justify-center">
          <Link
            href={`/share/${shareLink}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to all playbooks
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 border-t border-slate-200 pt-8 text-center">
          <p className="text-sm text-slate-500">
            Powered by{' '}
            <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              Plantheory
            </Link>
          </p>
        </div>
      </main>
    </div>
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
