import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getPlaybook, getUserWorkspace } from '@/lib/supabase/queries'
import { PlaybookForm } from '../../PlaybookForm'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditPlaybookPage({ params }: Props) {
  const { id } = await params
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

  const playbook = await getPlaybook(id)

  if (!playbook || playbook.workspace_id !== workspace.id) {
    notFound()
  }

  // Transform playbook data for the form
  const initialData = {
    id: playbook.id,
    title: playbook.title,
    description: playbook.description || '',
    category: playbook.category,
    steps: (playbook.steps || []).map(step => ({
      id: step.id,
      title: step.title,
      description: step.description || '',
      tools: (step.tools || []).map(tool => ({
        id: tool.id,
        name: tool.name,
        url: tool.url || '',
      })),
    })),
  }

  return (
    <PlaybookForm
      workspaceId={workspace.id}
      mode="edit"
      initialData={initialData}
    />
  )
}
