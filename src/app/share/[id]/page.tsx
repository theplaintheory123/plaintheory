import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getWorkspaceByShareLink, getSharedPlaybooks } from '@/lib/supabase/queries'

type Props = {
  params: Promise<{ id: string }>
}

export default async function SharedWorkspacePage({ params }: Props) {
  const { id: shareLink } = await params

  const workspace = await getWorkspaceByShareLink(shareLink)

  if (!workspace) {
    notFound()
  }

  const playbooks = await getSharedPlaybooks(shareLink)

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
        {/* Workspace Header */}
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Shared Workspace
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{workspace.name}</h1>
          {workspace.description && (
            <p className="mt-2 text-lg text-slate-600">{workspace.description}</p>
          )}
        </div>

        {/* Playbooks Grid */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Playbooks</h2>
        </div>

        {playbooks.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {playbooks.map((playbook) => (
              <Link
                key={playbook.id}
                href={`/share/${shareLink}/playbook/${playbook.id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-600 transition-transform group-hover:scale-110">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(playbook.category)}`}>
                    {playbook.category}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 group-hover:text-indigo-600">
                  {playbook.title}
                </h3>
                <p className="mb-4 text-sm text-slate-600 line-clamp-2">
                  {playbook.description || 'No description'}
                </p>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {playbook._count?.steps || 0} steps
                  </span>
                  <span className="text-indigo-600 font-medium group-hover:underline">View</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="mb-1 font-semibold text-slate-900">No playbooks yet</h3>
            <p className="text-sm text-slate-600">This workspace doesn't have any playbooks yet.</p>
          </div>
        )}

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
