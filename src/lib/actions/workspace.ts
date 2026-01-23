'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  createWorkspace,
  updateWorkspace,
  updateProfile,
  inviteMember,
  updateMemberRole,
  removeMember,
  enableSharing,
  disableSharing,
  updateSharePin,
  getUserWorkspace,
} from '@/lib/supabase/queries'
import type { TeamRole } from '@/lib/types/database'

export type FormState = {
  error?: string
  success?: boolean
  message?: string
}

// ============ Onboarding Actions ============

export async function completeOnboarding(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const workspaceName = formData.get('workspaceName') as string
  const industry = formData.get('industry') as string
  const teamSize = formData.get('teamSize') as string
  const selectedTemplates = formData.get('selectedTemplates') as string

  if (!workspaceName) {
    return { error: 'Workspace name is required' }
  }

  // Check if user already has a workspace
  const existing = await getUserWorkspace(user.id)
  if (existing) {
    redirect('/dashboard')
  }

  const workspace = await createWorkspace(
    user.id,
    workspaceName,
    undefined,
    industry,
    teamSize
  )

  if (!workspace) {
    return { error: 'Failed to create workspace' }
  }

  // TODO: Create playbooks from selected templates
  // const templates = JSON.parse(selectedTemplates || '[]')
  // for (const templateId of templates) {
  //   await useTemplate(templateId, workspace.id, user.id)
  // }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

// ============ Workspace Settings Actions ============

export async function updateWorkspaceSettings(
  workspaceId: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const name = formData.get('name') as string

  if (!name) {
    return { error: 'Workspace name is required' }
  }

  const workspace = await updateWorkspace(workspaceId, { name })

  if (!workspace) {
    return { error: 'Failed to update workspace' }
  }

  revalidatePath('/settings')
  return { success: true, message: 'Workspace updated successfully' }
}

export async function deleteWorkspaceAction(workspaceId: string): Promise<FormState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('workspaces')
    .delete()
    .eq('id', workspaceId)
    .eq('owner_id', user.id)

  if (error) {
    return { error: 'Failed to delete workspace' }
  }

  redirect('/onboarding')
}

// ============ Profile Actions ============

export async function updateProfileSettings(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const fullName = formData.get('fullName') as string

  const profile = await updateProfile(user.id, {
    full_name: fullName,
  })

  if (!profile) {
    return { error: 'Failed to update profile' }
  }

  // Also update user metadata
  await supabase.auth.updateUser({
    data: { name: fullName }
  })

  revalidatePath('/settings')
  return { success: true, message: 'Profile updated successfully' }
}

// ============ Team Actions ============

export async function inviteTeamMember(
  workspaceId: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const email = formData.get('email') as string
  const role = (formData.get('role') as TeamRole) || 'viewer'

  if (!email) {
    return { error: 'Email is required' }
  }

  // Basic email validation
  if (!email.includes('@')) {
    return { error: 'Invalid email address' }
  }

  const success = await inviteMember(workspaceId, email, role, user.id)

  if (!success) {
    return { error: 'Failed to send invitation. The user may already be invited.' }
  }

  revalidatePath('/settings')
  return { success: true, message: `Invitation sent to ${email}` }
}

export async function updateTeamMemberRole(
  workspaceId: string,
  userId: string,
  role: TeamRole
): Promise<FormState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const success = await updateMemberRole(workspaceId, userId, role)

  if (!success) {
    return { error: 'Failed to update member role' }
  }

  revalidatePath('/settings')
  return { success: true }
}

export async function removeTeamMember(
  workspaceId: string,
  userId: string
): Promise<FormState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const success = await removeMember(workspaceId, userId)

  if (!success) {
    return { error: 'Failed to remove member' }
  }

  revalidatePath('/settings')
  return { success: true }
}

// ============ Sharing Actions ============

export async function toggleSharing(
  workspaceId: string,
  enable: boolean
): Promise<{ shareLink?: string; error?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  if (enable) {
    const shareLink = await enableSharing(workspaceId)
    if (!shareLink) {
      return { error: 'Failed to enable sharing' }
    }
    revalidatePath('/settings')
    return { shareLink }
  } else {
    const success = await disableSharing(workspaceId)
    if (!success) {
      return { error: 'Failed to disable sharing' }
    }
    revalidatePath('/settings')
    return {}
  }
}

export async function updateSharingPin(
  workspaceId: string,
  pin: string | null
): Promise<FormState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const success = await updateSharePin(workspaceId, pin)

  if (!success) {
    return { error: 'Failed to update PIN' }
  }

  revalidatePath('/settings')
  return { success: true }
}

export async function regenerateShareLink(workspaceId: string): Promise<{ shareLink?: string; error?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Disable and re-enable to regenerate
  await disableSharing(workspaceId)
  const shareLink = await enableSharing(workspaceId)

  if (!shareLink) {
    return { error: 'Failed to regenerate share link' }
  }

  revalidatePath('/settings')
  return { shareLink }
}
