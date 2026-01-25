import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/ui/DashboardLayout'
import { getUserWorkspace, getWorkspaceMembers, getProfile } from '@/lib/supabase/queries'
import { SettingsClient } from './SettingsClient'
import { Settings } from 'lucide-react'

type Props = {
  searchParams: Promise<{ tab?: string }>
}

export default async function SettingsPage({ searchParams }: Props) {
  const params = await searchParams
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

  const [profile, members] = await Promise.all([
    getProfile(user.id),
    getWorkspaceMembers(workspace.id),
  ])

  const isOwner = workspace.owner_id === user.id

  return (
    <DashboardLayout user={user}>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <Settings className="h-6 w-6 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
            <p className="text-sm text-slate-500">Manage your workspace and account preferences</p>
          </div>
        </div>
      </div>

      <SettingsClient
        user={user}
        profile={profile}
        workspace={workspace}
        members={members}
        isOwner={isOwner}
        initialTab={params.tab || 'workspace'}
      />
    </DashboardLayout>
  )
}
