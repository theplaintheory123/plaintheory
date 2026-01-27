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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Templates</h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Start with pre-built playbook templates for common business processes
            </p>
          </div>
        </div>
      </div>

      <TemplatesClient
        templates={templates}
        featuredTemplate={featuredTemplate}
        workspaceId={workspace.id}
      />
    </DashboardLayout>
  )
}
