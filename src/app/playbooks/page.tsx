import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/ui/DashboardLayout'
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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Playbooks</h1>
        <p className="mt-1 text-slate-500">Manage your operational playbooks</p>
      </div>

      <PlaybooksClient playbooks={playbooks} initialCategory={category || 'All'} />
    </DashboardLayout>
  )
}
