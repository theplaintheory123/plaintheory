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
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Playbooks</h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Manage and organize your operational playbooks
            </p>
          </div>
        </div>
      </div>

      <PlaybooksClient playbooks={playbooks} initialCategory={category || 'All'} />
    </DashboardLayout>
  )
}
