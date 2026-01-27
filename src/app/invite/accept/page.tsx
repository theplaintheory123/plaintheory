import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { joinWorkspaceViaLink } from '@/lib/supabase/queries'
import Link from 'next/link'
import { XCircle, Loader2 } from 'lucide-react'

type Props = {
  searchParams: Promise<{ workspace?: string; role?: string }>
}

export default async function InviteAcceptPage({ searchParams }: Props) {
  const { workspace: workspaceId, role } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Must be authenticated (redirected from Supabase Auth invite link)
  if (!user) {
    redirect('/auth/login')
  }

  // Must have workspace ID from the invite email redirect
  if (!workspaceId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-100">
            <XCircle className="h-10 w-10 text-red-500" strokeWidth={1.5} />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-900">Invalid Invitation</h1>
          <p className="mb-8 text-slate-600">
            This invitation link is invalid or has expired. Please request a new invitation from the workspace admin.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Validate the role
  const memberRole = (role === 'admin' || role === 'editor' || role === 'viewer') ? role : 'viewer'

  // Join the workspace
  const success = await joinWorkspaceViaLink(workspaceId, user.id, memberRole)

  if (success) {
    redirect('/dashboard')
  }

  // If join failed
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-100">
          <XCircle className="h-10 w-10 text-red-500" strokeWidth={1.5} />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Could Not Join Workspace</h1>
        <p className="mb-8 text-slate-600">
          There was an error joining the workspace. Please try again or contact the workspace admin.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
