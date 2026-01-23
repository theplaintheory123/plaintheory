import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserWorkspace } from '@/lib/supabase/queries'
import { OnboardingClient } from './OnboardingClient'

export default async function OnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if user already has a workspace
  const workspace = await getUserWorkspace(user.id)
  if (workspace) {
    redirect('/dashboard')
  }

  return <OnboardingClient />
}
