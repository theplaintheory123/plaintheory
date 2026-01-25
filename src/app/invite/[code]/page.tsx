import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getWorkspaceByInviteLink, joinWorkspaceViaLink } from '@/lib/supabase/queries'
import Link from 'next/link'
import Image from 'next/image'
import { Users, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'

type Props = {
  params: Promise<{ code: string }>
}

export default async function InvitePage({ params }: Props) {
  const { code } = await params
  const supabase = await createClient()

  console.log('Invite code received:', code)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get workspace by invite link
  const workspace = await getWorkspaceByInviteLink(code)

  console.log('Workspace found:', workspace ? workspace.name : 'null')

  // If no valid workspace found
  if (!workspace) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-100">
            <XCircle className="h-10 w-10 text-red-500" strokeWidth={1.5} />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-900">Invalid Invite Link</h1>
          <p className="mb-8 text-slate-600">
            This invite link is invalid or has been disabled. Please contact the workspace owner for a new invite.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    )
  }

  // If user is logged in, join the workspace
  if (user) {
    const success = await joinWorkspaceViaLink(workspace.id, user.id, 'viewer')
    if (success) {
      redirect('/dashboard')
    }
  }

  // If not logged in, show invitation page with login/signup options
  const ownerName = (workspace.owner as any)?.full_name || 'Someone'

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-5xl">
          <Link href="/">
            <Image src="/logo-text.svg" width={130} height={30} alt="plaintheory" priority />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
              <Users className="h-8 w-8 text-white" strokeWidth={1.5} />
            </div>

            {/* Heading */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-slate-900">You've Been Invited</h1>
              <p className="text-slate-600">
                <span className="font-medium text-slate-900">{ownerName}</span> has invited you to join
              </p>
              <p className="mt-1 text-lg font-semibold text-indigo-600">{workspace.name}</p>
            </div>

            {/* What you'll get */}
            <div className="mb-8 rounded-xl bg-slate-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                What you'll get access to
              </p>
              <ul className="space-y-2">
                {['Operational playbooks', 'Team collaboration', 'Templates & tools'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href={`/auth/signup?redirect=/invite/${code}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-[0.98]"
              >
                Create Account to Join
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href={`/auth/login?redirect=/invite/${code}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
              >
                Sign In to Join
              </Link>
            </div>

            <p className="mt-6 text-center text-xs text-slate-500">
              By joining, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
