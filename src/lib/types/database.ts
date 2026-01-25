// Database types for Plantheory

export type PlaybookCategory = 'HR' | 'Operations' | 'Support' | 'Finance' | 'Marketing' | 'Sales' | 'Other'
export type TeamRole = 'admin' | 'editor' | 'viewer'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Workspace {
  id: string
  name: string
  slug: string
  description: string | null
  industry: string | null
  team_size: string | null
  owner_id: string
  share_link: string | null
  share_pin: string | null
  share_enabled: boolean
  invite_link: string | null
  invite_link_enabled: boolean
  created_at: string
  updated_at: string
  // Relations
  owner?: Profile
}

export interface Playbook {
  id: string
  workspace_id: string
  title: string
  description: string | null
  category: PlaybookCategory
  owner_id: string | null
  is_template: boolean
  template_id: string | null
  view_count: number
  created_at: string
  updated_at: string
  // Relations
  owner?: Profile
  steps?: Step[]
  workspace?: Workspace
  _count?: {
    steps: number
  }
}

export interface Step {
  id: string
  playbook_id: string
  title: string
  description: string | null
  order_index: number
  created_at: string
  updated_at: string
  // Relations
  tools?: Tool[]
  playbook?: Playbook
}

export interface Tool {
  id: string
  step_id: string
  name: string
  url: string | null
  description: string | null
  created_at: string
}

export interface Template {
  id: string
  title: string
  description: string | null
  category: PlaybookCategory
  industry: string | null
  steps_count: number
  uses_count: number
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  // Relations
  steps?: TemplateStep[]
}

export interface TemplateStep {
  id: string
  template_id: string
  title: string
  description: string | null
  order_index: number
  tools: { name: string; url: string }[]
}

export interface WorkspaceMember {
  id: string
  workspace_id: string
  user_id: string
  role: TeamRole
  invited_by: string | null
  invited_at: string
  joined_at: string | null
  // Relations
  user?: Profile
  workspace?: Workspace
}

export interface WorkspaceInvitation {
  id: string
  workspace_id: string
  email: string
  role: TeamRole
  invited_by: string | null
  token: string
  expires_at: string
  created_at: string
}

export interface WorkspaceTool {
  id: string
  workspace_id: string
  name: string
  url: string | null
  description: string | null
  category: string | null
  owner_id: string | null
  created_at: string
  updated_at: string
}

// API Response types
export interface SearchResult {
  result_type: 'playbook' | 'step' | 'tool'
  result_id: string
  title: string
  description: string | null
  playbook_id: string | null
  playbook_title: string | null
}

// Dashboard stats
export interface DashboardStats {
  totalPlaybooks: number
  totalMembers: number
  totalViews: number
}

// Form input types
export interface CreatePlaybookInput {
  title: string
  description?: string
  category: PlaybookCategory
  steps: {
    title: string
    description?: string
    order_index: number
    tools: { name: string; url: string }[]
  }[]
}

export interface UpdatePlaybookInput extends Partial<CreatePlaybookInput> {
  id: string
}

export interface CreateWorkspaceInput {
  name: string
  description?: string
  industry?: string
  team_size?: string
}

export interface UpdateProfileInput {
  full_name?: string
  avatar_url?: string
}

export interface InviteMemberInput {
  email: string
  role: TeamRole
}
