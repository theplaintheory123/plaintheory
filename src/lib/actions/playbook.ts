'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createPlaybook, updatePlaybook, deletePlaybook, useTemplate } from '@/lib/supabase/queries'
import type { PlaybookCategory } from '@/lib/types/database'

export type PlaybookFormState = {
  error?: string
  success?: boolean
}

export async function createPlaybookAction(
  workspaceId: string,
  prevState: PlaybookFormState,
  formData: FormData
): Promise<PlaybookFormState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string | null
  const category = (formData.get('category') as PlaybookCategory) || 'Other'
  const stepsJson = formData.get('steps') as string

  if (!title) {
    return { error: 'Title is required' }
  }

  let steps: { title: string; description?: string; tools: { name: string; url: string }[] }[] = []
  try {
    steps = JSON.parse(stepsJson || '[]')
  } catch {
    return { error: 'Invalid steps data' }
  }

  const playbook = await createPlaybook(
    workspaceId,
    user.id,
    title,
    description,
    category,
    steps
  )

  if (!playbook) {
    return { error: 'Failed to create playbook' }
  }

  revalidatePath('/playbooks')
  redirect(`/playbooks/${playbook.id}`)
}

export async function updatePlaybookAction(
  playbookId: string,
  prevState: PlaybookFormState,
  formData: FormData
): Promise<PlaybookFormState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string | null
  const category = (formData.get('category') as PlaybookCategory) || 'Other'
  const stepsJson = formData.get('steps') as string

  if (!title) {
    return { error: 'Title is required' }
  }

  let steps: { title: string; description?: string; tools: { name: string; url: string }[] }[] = []
  try {
    steps = JSON.parse(stepsJson || '[]')
  } catch {
    return { error: 'Invalid steps data' }
  }

  const success = await updatePlaybook(playbookId, title, description, category, steps)

  if (!success) {
    return { error: 'Failed to update playbook' }
  }

  revalidatePath('/playbooks')
  revalidatePath(`/playbooks/${playbookId}`)
  redirect(`/playbooks/${playbookId}`)
}

export async function deletePlaybookAction(playbookId: string): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const success = await deletePlaybook(playbookId)

  if (!success) {
    return { error: 'Failed to delete playbook' }
  }

  revalidatePath('/playbooks')
  redirect('/playbooks')
}

export async function useTemplateAction(
  templateId: string,
  workspaceId: string
): Promise<{ error?: string; playbookId?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const playbook = await useTemplate(templateId, workspaceId, user.id)

  if (!playbook) {
    return { error: 'Failed to create playbook from template' }
  }

  revalidatePath('/playbooks')
  return { playbookId: playbook.id }
}
