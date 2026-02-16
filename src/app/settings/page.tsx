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
