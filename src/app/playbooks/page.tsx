import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/ui/DashboardLayout'
import Link from 'next/link'
import { getUserWorkspace, getPlaybooks } from '@/lib/supabase/queries'
import { PlaybooksClient } from './PlaybooksClient'
import type { PlaybookCategory } from '@/lib/types/database'

type Props = {
  searchParams: Promise<{ category?: string; q?: string }>
}

export default async function PlaybooksPage({ searchParams }: Props) {
  const supabase = await createClient()
  const params = await searchParams

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

  const categoryParam = params.category
  const category = categoryParam && categoryParam !== 'All' ? categoryParam as PlaybookCategory : undefined
  const playbooks = await getPlaybooks(workspace.id, category)

  return (
    <DashboardLayout user={user}>
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Playbooks</h1>
          <p className="mt-1 text-slate-600">
            Manage and organize your operational playbooks
          </p>
        </div>
        <Link
          href="/playbooks/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Playbook
        </Link>
      </div>

      <PlaybooksClient playbooks={playbooks} initialCategory={category || 'All'} />
    </DashboardLayout>
  )
}
