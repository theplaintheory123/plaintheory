import { createClient } from './server'
import type {
  Profile,
  Workspace,
  Playbook,
  Step,
  Tool,
  Template,
  TemplateStep,
  WorkspaceMember,
  DashboardStats,
  SearchResult,
  PlaybookCategory,
} from '@/lib/types/database'

// ============ Profile Queries ============

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }
  return data
}

// ============ Workspace Queries ============

export async function getUserWorkspace(userId: string): Promise<Workspace | null> {
  const supabase = await createClient()

  // First check if user owns a workspace
  const { data: ownedWorkspace, error: ownedError } = await supabase
    .from('workspaces')
    .select('*')
    .eq('owner_id', userId)
    .single()

  if (ownedWorkspace) {
    return ownedWorkspace
  }

  // Check if user is a member of any workspace
  const { data: membership, error: memberError } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', userId)
    .limit(1)
    .single()

  if (membership) {
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', membership.workspace_id)
      .single()
    return workspace
  }

  return null
}

export async function createWorkspace(
  ownerId: string,
  name: string,
  description?: string,
  industry?: string,
  teamSize?: string
): Promise<Workspace | null> {
  const supabase = await createClient()

  // Generate slug
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const { data, error } = await supabase
    .from('workspaces')
    .insert({
      name,
      slug: `${slug}-${Date.now().toString(36)}`,
      description,
      industry,
      team_size: teamSize,
      owner_id: ownerId,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating workspace:', error)
    return null
  }
  return data
}

export async function updateWorkspace(workspaceId: string, updates: Partial<Workspace>): Promise<Workspace | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workspaces')
    .update(updates)
    .eq('id', workspaceId)
    .select()
    .single()

  if (error) {
    console.error('Error updating workspace:', error)
    return null
  }
  return data
}

export async function getWorkspaceByShareLink(shareLink: string): Promise<Workspace | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('share_link', shareLink)
    .eq('share_enabled', true)
    .single()

  if (error) return null
  return data
}

// ============ Playbook Queries ============

export async function getPlaybooks(workspaceId: string, category?: PlaybookCategory): Promise<Playbook[]> {
  const supabase = await createClient()

  let query = supabase
    .from('playbooks')
    .select(`
      *,
      owner:profiles!owner_id(id, full_name, email, avatar_url),
      steps(id)
    `)
    .eq('workspace_id', workspaceId)
    .order('updated_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching playbooks:', error)
    return []
  }

  // Transform to include step count
  return (data || []).map(playbook => ({
    ...playbook,
    _count: { steps: playbook.steps?.length || 0 },
    steps: undefined
  }))
}

export async function getPlaybook(playbookId: string): Promise<Playbook | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('playbooks')
    .select(`
      *,
      owner:profiles!owner_id(id, full_name, email, avatar_url),
      steps(
        *,
        tools(*)
      )
    `)
    .eq('id', playbookId)
    .single()

  if (error) {
    console.error('Error fetching playbook:', error)
    return null
  }

  // Sort steps by order_index
  if (data?.steps) {
    data.steps.sort((a: Step, b: Step) => a.order_index - b.order_index)
  }

  return data
}

export async function getRecentPlaybooks(workspaceId: string, limit = 5): Promise<Playbook[]> {
  const supabase = await createClient()

  if (!workspaceId) {
    console.error('Error fetching recent playbooks: workspaceId is required')
    return []
  }

  const { data, error } = await supabase
    .from('playbooks')
    .select(`
      *,
      owner:profiles!owner_id(id, full_name, email)
    `)
    .eq('workspace_id', workspaceId)
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent playbooks:', error.message || error.code || 'Unknown error')
    return []
  }
  return data || []
}

export async function createPlaybook(
  workspaceId: string,
  ownerId: string,
  title: string,
  description: string | null,
  category: PlaybookCategory,
  steps: { title: string; description?: string; tools: { name: string; url: string }[] }[]
): Promise<Playbook | null> {
  const supabase = await createClient()

  // Create playbook
  const { data: playbook, error: playbookError } = await supabase
    .from('playbooks')
    .insert({
      workspace_id: workspaceId,
      owner_id: ownerId,
      title,
      description,
      category,
    })
    .select()
    .single()

  if (playbookError || !playbook) {
    console.error('Error creating playbook:', playbookError)
    return null
  }

  // Create steps
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    const { data: createdStep, error: stepError } = await supabase
      .from('steps')
      .insert({
        playbook_id: playbook.id,
        title: step.title,
        description: step.description || null,
        order_index: i,
      })
      .select()
      .single()

    if (stepError || !createdStep) {
      console.error('Error creating step:', stepError)
      continue
    }

    // Create tools for this step
    if (step.tools && step.tools.length > 0) {
      const toolsToInsert = step.tools
        .filter(t => t.name.trim())
        .map(tool => ({
          step_id: createdStep.id,
          name: tool.name,
          url: tool.url || null,
        }))

      if (toolsToInsert.length > 0) {
        await supabase.from('tools').insert(toolsToInsert)
      }
    }
  }

  return playbook
}

export async function updatePlaybook(
  playbookId: string,
  title: string,
  description: string | null,
  category: PlaybookCategory,
  steps: { id?: string; title: string; description?: string; tools: { id?: string; name: string; url: string }[] }[]
): Promise<boolean> {
  const supabase = await createClient()

  // Update playbook
  const { error: playbookError } = await supabase
    .from('playbooks')
    .update({ title, description, category })
    .eq('id', playbookId)

  if (playbookError) {
    console.error('Error updating playbook:', playbookError)
    return false
  }

  // Delete existing steps and tools (cascade)
  await supabase.from('steps').delete().eq('playbook_id', playbookId)

  // Create new steps
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    const { data: createdStep, error: stepError } = await supabase
      .from('steps')
      .insert({
        playbook_id: playbookId,
        title: step.title,
        description: step.description || null,
        order_index: i,
      })
      .select()
      .single()

    if (stepError || !createdStep) continue

    if (step.tools && step.tools.length > 0) {
      const toolsToInsert = step.tools
        .filter(t => t.name.trim())
        .map(tool => ({
          step_id: createdStep.id,
          name: tool.name,
          url: tool.url || null,
        }))

      if (toolsToInsert.length > 0) {
        await supabase.from('tools').insert(toolsToInsert)
      }
    }
  }

  return true
}

export async function deletePlaybook(playbookId: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('playbooks')
    .delete()
    .eq('id', playbookId)

  if (error) {
    console.error('Error deleting playbook:', error)
    return false
  }
  return true
}

export async function incrementPlaybookViews(playbookId: string): Promise<void> {
  const supabase = await createClient()
  await supabase.rpc('increment_view_count', { playbook_uuid: playbookId })
}

// ============ Template Queries ============

export async function getTemplates(category?: string): Promise<Template[]> {
  const supabase = await createClient()

  let query = supabase
    .from('templates')
    .select('*')
    .eq('is_active', true)
    .order('uses_count', { ascending: false })

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching templates:', error)
    return []
  }
  return data || []
}

export async function getFeaturedTemplate(): Promise<Template | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .single()

  if (error) return null
  return data
}

export async function getTemplate(templateId: string): Promise<Template | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('templates')
    .select(`
      *,
      steps:template_steps(*)
    `)
    .eq('id', templateId)
    .single()

  if (error) return null

  // Sort steps
  if (data?.steps) {
    data.steps.sort((a: TemplateStep, b: TemplateStep) => a.order_index - b.order_index)
  }

  return data
}

export async function useTemplate(
  templateId: string,
  workspaceId: string,
  ownerId: string
): Promise<Playbook | null> {
  const supabase = await createClient()

  // Get template with steps
  const template = await getTemplate(templateId)
  if (!template) return null

  // Create playbook from template
  const steps = (template.steps || []).map((step, index) => ({
    title: step.title,
    description: step.description || undefined,
    tools: step.tools || [],
  }))

  const playbook = await createPlaybook(
    workspaceId,
    ownerId,
    template.title,
    template.description,
    template.category,
    steps
  )

  // Increment usage count
  if (playbook) {
    await supabase
      .from('templates')
      .update({ uses_count: template.uses_count + 1 })
      .eq('id', templateId)
  }

  return playbook
}

// ============ Search Queries ============

export async function searchWorkspace(workspaceId: string, query: string): Promise<SearchResult[]> {
  const supabase = await createClient()

  const searchTerm = `%${query}%`

  // Search playbooks
  const { data: playbooks } = await supabase
    .from('playbooks')
    .select('id, title, description, category')
    .eq('workspace_id', workspaceId)
    .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)

  // Search steps
  const { data: steps } = await supabase
    .from('steps')
    .select(`
      id, title, description,
      playbook:playbooks!inner(id, title, workspace_id)
    `)
    .eq('playbook.workspace_id', workspaceId)
    .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)

  // Search tools
  const { data: tools } = await supabase
    .from('tools')
    .select(`
      id, name, url,
      step:steps!inner(
        playbook:playbooks!inner(id, title, workspace_id)
      )
    `)
    .eq('step.playbook.workspace_id', workspaceId)
    .ilike('name', searchTerm)

  const results: SearchResult[] = []

  // Map playbooks
  playbooks?.forEach(p => {
    results.push({
      result_type: 'playbook',
      result_id: p.id,
      title: p.title,
      description: p.description,
      playbook_id: p.id,
      playbook_title: p.title,
    })
  })

  // Map steps
  steps?.forEach((s: any) => {
    results.push({
      result_type: 'step',
      result_id: s.id,
      title: s.title,
      description: s.description,
      playbook_id: s.playbook?.id,
      playbook_title: s.playbook?.title,
    })
  })

  // Map tools
  tools?.forEach((t: any) => {
    results.push({
      result_type: 'tool',
      result_id: t.id,
      title: t.name,
      description: t.url,
      playbook_id: t.step?.playbook?.id,
      playbook_title: t.step?.playbook?.title,
    })
  })

  return results
}

// ============ Team Queries ============

export async function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('workspace_members')
    .select(`
      *,
      user:profiles!user_id(id, full_name, email, avatar_url)
    `)
    .eq('workspace_id', workspaceId)

  if (error) {
    console.error('Error fetching members:', error)
    return []
  }
  return data || []
}

export async function inviteMember(
  workspaceId: string,
  email: string,
  role: 'admin' | 'editor' | 'viewer',
  invitedBy: string
): Promise<boolean> {
  const supabase = await createClient()

  // Generate token
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days

  const { error } = await supabase
    .from('workspace_invitations')
    .insert({
      workspace_id: workspaceId,
      email,
      role,
      invited_by: invitedBy,
      token,
      expires_at: expiresAt,
    })

  if (error) {
    console.error('Error creating invitation:', error)
    return false
  }

  // TODO: Send invitation email
  return true
}

export async function updateMemberRole(
  workspaceId: string,
  userId: string,
  role: 'admin' | 'editor' | 'viewer'
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('workspace_members')
    .update({ role })
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error updating member role:', error)
    return false
  }
  return true
}

export async function removeMember(workspaceId: string, userId: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('workspace_members')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error removing member:', error)
    return false
  }
  return true
}

// ============ Dashboard Stats ============

export async function getDashboardStats(workspaceId: string): Promise<DashboardStats> {
  const supabase = await createClient()

  // Get playbook count
  const { count: playbookCount } = await supabase
    .from('playbooks')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)

  // Get member count
  const { count: memberCount } = await supabase
    .from('workspace_members')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)

  // Get total views
  const { data: viewData } = await supabase
    .from('playbooks')
    .select('view_count')
    .eq('workspace_id', workspaceId)

  const totalViews = viewData?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0

  return {
    totalPlaybooks: playbookCount || 0,
    totalMembers: (memberCount || 0) + 1, // +1 for owner
    totalViews,
  }
}

// ============ Share Queries ============

export async function enableSharing(workspaceId: string): Promise<string | null> {
  const supabase = await createClient()

  // Generate share link
  const shareLink = crypto.randomUUID().replace(/-/g, '').substring(0, 12)

  const { data, error } = await supabase
    .from('workspaces')
    .update({
      share_enabled: true,
      share_link: shareLink,
    })
    .eq('id', workspaceId)
    .select('share_link')
    .single()

  if (error) {
    console.error('Error enabling sharing:', error)
    return null
  }
  return data?.share_link
}

export async function disableSharing(workspaceId: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('workspaces')
    .update({
      share_enabled: false,
    })
    .eq('id', workspaceId)

  if (error) {
    console.error('Error disabling sharing:', error)
    return false
  }
  return true
}

export async function updateSharePin(workspaceId: string, pin: string | null): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('workspaces')
    .update({ share_pin: pin })
    .eq('id', workspaceId)

  if (error) {
    console.error('Error updating share PIN:', error)
    return false
  }
  return true
}

export async function getSharedPlaybooks(shareLink: string): Promise<Playbook[]> {
  const supabase = await createClient()

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id')
    .eq('share_link', shareLink)
    .eq('share_enabled', true)
    .single()

  if (!workspace) return []

  const { data } = await supabase
    .from('playbooks')
    .select(`
      *,
      steps(id)
    `)
    .eq('workspace_id', workspace.id)
    .order('title')

  return (data || []).map(p => ({
    ...p,
    _count: { steps: p.steps?.length || 0 },
    steps: undefined
  }))
}

export async function getSharedPlaybook(shareLink: string, playbookId: string): Promise<Playbook | null> {
  const supabase = await createClient()

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id')
    .eq('share_link', shareLink)
    .eq('share_enabled', true)
    .single()

  if (!workspace) return null

  const { data } = await supabase
    .from('playbooks')
    .select(`
      *,
      steps(*, tools(*))
    `)
    .eq('id', playbookId)
    .eq('workspace_id', workspace.id)
    .single()

  if (data?.steps) {
    data.steps.sort((a: Step, b: Step) => a.order_index - b.order_index)
  }

  // Increment view count
  await supabase
    .from('playbooks')
    .update({ view_count: (data?.view_count || 0) + 1 })
    .eq('id', playbookId)

  return data
}
