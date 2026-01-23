import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserWorkspace, getTemplate } from '@/lib/supabase/queries'
import { PlaybookForm } from '../PlaybookForm'

type Props = {
  searchParams: Promise<{ template?: string }>
}

export default async function NewPlaybookPage({ searchParams }: Props) {
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

  // Check if creating from template
  let initialData = undefined
  if (params.template) {
    const template = await getTemplate(params.template)
    if (template) {
      initialData = {
        title: template.title,
        description: template.description || '',
        category: template.category,
        steps: (template.steps || []).map(step => ({
          title: step.title,
          description: step.description || '',
          tools: step.tools || [],
        })),
      }
    }
  }

  return (
    <PlaybookForm
      workspaceId={workspace.id}
      mode="create"
      initialData={initialData}
      templateId={params.template}
    />
  )
}
