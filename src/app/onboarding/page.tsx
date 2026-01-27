import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserWorkspace, autoJoinFromPendingInvitation } from '@/lib/supabase/queries'
import { OnboardingClient } from './OnboardingClient'

export default async function OnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if user already has a workspace (either as owner or member)
  let workspace = await getUserWorkspace(user.id)
  if (workspace) {
    redirect('/dashboard')
  }

  // Check if user has a pending invitation and auto-join
  // This handles the case where invited users land on onboarding by mistake
  if (user.email) {
    const { joined } = await autoJoinFromPendingInvitation(user.id, user.email)
    if (joined) {
      redirect('/dashboard')
    }
  }

  // Only show onboarding to users who need to create a new workspace
  // (i.e., they have no workspace and no pending invitations)
  return <OnboardingClient />
}
