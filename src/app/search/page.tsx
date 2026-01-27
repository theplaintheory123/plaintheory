import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserWorkspace, getPlaybooks } from '@/lib/supabase/queries'
import { SearchClient } from './SearchClient'
import DashboardLayout from '@/components/ui/DashboardLayout'

export default async function SearchPage() {
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

  const playbooks = await getPlaybooks(workspace.id)

  return (
    <DashboardLayout user={user}>
      <SearchClient workspaceId={workspace.id} playbooksCount={playbooks.length} />
    </DashboardLayout>
  )
}
