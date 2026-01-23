import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/ui/DashboardLayout'
import { getUserWorkspace, getTemplates, getFeaturedTemplate } from '@/lib/supabase/queries'
import { TemplatesClient } from './TemplatesClient'

export default async function TemplatesPage() {
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

  const [templates, featuredTemplate] = await Promise.all([
    getTemplates(),
    getFeaturedTemplate(),
  ])

  return (
    <DashboardLayout user={user}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Templates</h1>
        <p className="mt-1 text-slate-600">
          Start with pre-built playbook templates for common business processes
        </p>
      </div>

      <TemplatesClient
        templates={templates}
        featuredTemplate={featuredTemplate}
        workspaceId={workspace.id}
      />
    </DashboardLayout>
  )
}
