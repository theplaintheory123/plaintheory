import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/ui/DashboardLayout'
import { getUserWorkspace, getWorkspaceMembers, getProfile } from '@/lib/supabase/queries'
import { SettingsClient } from './SettingsClient'

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
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-slate-600">
          Manage your workspace and account settings
        </p>
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
