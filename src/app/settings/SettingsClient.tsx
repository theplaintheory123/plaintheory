'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  updateWorkspaceSettings,
  updateProfileSettings,
  inviteTeamMember,
  updateTeamMemberRole,
  removeTeamMember,
  toggleSharing,
  updateSharingPin,
  regenerateShareLink,
  deleteWorkspaceAction,
  toggleInviteLink,
  regenerateInviteLink,
} from '@/lib/actions/workspace'
import type { Profile, Workspace, WorkspaceMember, TeamRole } from '@/lib/types/database'
import {
  Building2,
  User,
  Users,
  Save,
  Trash2,
  Mail,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  Shield,
  Link2,
  UserPlus,
  Crown,
  Loader2,
  Lock,
  Globe,
  Eye,
  ChevronRight,
  ExternalLink,
  HelpCircle,
} from 'lucide-react'

type User = {
  id?: string
  email?: string
  user_metadata?: {
    name?: string
  }
}

type Props = {
  user: User
  profile: Profile | null
  workspace: Workspace
  members: WorkspaceMember[]
  isOwner: boolean
  initialTab: string
}

const tabs = [
  { id: 'workspace', label: 'Workspace', icon: Building2 },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'sharing', label: 'Sharing', icon: Globe },
]

export function SettingsClient({ user, profile, workspace, members, isOwner, initialTab }: Props) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(initialTab)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  // Workspace settings
  const [workspaceName, setWorkspaceName] = useState(workspace.name)

  // Profile settings
  const [fullName, setFullName] = useState(profile?.full_name || user.user_metadata?.name || '')

  // Team settings
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<TeamRole>('viewer')

  // Invite link settings
  const [inviteLinkEnabled, setInviteLinkEnabled] = useState(workspace.invite_link_enabled || false)
  const [inviteLink, setInviteLink] = useState(workspace.invite_link || '')

  // Sharing settings
  const [shareEnabled, setShareEnabled] = useState(workspace.share_enabled)
  const [shareLink, setShareLink] = useState(workspace.share_link || '')
  const [pinEnabled, setPinEnabled] = useState(!!workspace.share_pin)
  const [pin, setPin] = useState(workspace.share_pin || '')

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSaveWorkspace = () => {
    const formData = new FormData()
    formData.set('name', workspaceName)

    startTransition(async () => {
      const result = await updateWorkspaceSettings(workspace.id, { error: undefined, success: false }, formData)
      if (result.error) {
        showMessage('error', result.error)
      } else {
        showMessage('success', 'Workspace settings saved')
        router.refresh()
      }
    })
  }

  const handleSaveProfile = () => {
    const formData = new FormData()
    formData.set('fullName', fullName)

    startTransition(async () => {
      const result = await updateProfileSettings({ error: undefined, success: false }, formData)
      if (result.error) {
        showMessage('error', result.error)
      } else {
        showMessage('success', 'Profile updated')
        router.refresh()
      }
    })
  }

  const handleInvite = async () => {
    if (!inviteEmail) return

    const formData = new FormData()
    formData.set('email', inviteEmail)
    formData.set('role', inviteRole)

    startTransition(async () => {
      const result = await inviteTeamMember(workspace.id, { error: undefined, success: false }, formData)
      if (result.error) {
        showMessage('error', result.error)
      } else {
        showMessage('success', `Invitation sent to ${inviteEmail}`)
        setInviteEmail('')
        router.refresh()
      }
    })
  }

  const handleRoleChange = (userId: string, role: TeamRole) => {
    startTransition(async () => {
      const result = await updateTeamMemberRole(workspace.id, userId, role)
      if (result.error) {
        showMessage('error', result.error)
      } else {
        router.refresh()
      }
    })
  }

  const handleRemoveMember = (userId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from the workspace?`)) return

    startTransition(async () => {
      const result = await removeTeamMember(workspace.id, userId)
      if (result.error) {
        showMessage('error', result.error)
      } else {
        showMessage('success', 'Member removed')
        router.refresh()
      }
    })
  }

  const handleToggleInviteLink = async (enable: boolean) => {
    setInviteLinkEnabled(enable)
    startTransition(async () => {
      const result = await toggleInviteLink(workspace.id, enable)
      if (result.error) {
        showMessage('error', result.error)
        setInviteLinkEnabled(!enable)
      } else if (result.inviteLink) {
        setInviteLink(result.inviteLink)
        router.refresh()
      }
    })
  }

  const handleRegenerateInviteLink = () => {
    if (!confirm('This will invalidate the current invite link. Continue?')) return

    startTransition(async () => {
      const result = await regenerateInviteLink(workspace.id)
      if (result.error) {
        showMessage('error', result.error)
      } else if (result.inviteLink) {
        setInviteLink(result.inviteLink)
        showMessage('success', 'Invite link regenerated')
        router.refresh()
      }
    })
  }

  const handleToggleSharing = async (enable: boolean) => {
    setShareEnabled(enable)
    startTransition(async () => {
      const result = await toggleSharing(workspace.id, enable)
      if (result.error) {
        showMessage('error', result.error)
        setShareEnabled(!enable)
      } else if (result.shareLink) {
        setShareLink(result.shareLink)
        router.refresh()
      }
    })
  }

  const handleRegenerateLink = () => {
    if (!confirm('This will invalidate the current share link. Continue?')) return

    startTransition(async () => {
      const result = await regenerateShareLink(workspace.id)
      if (result.error) {
        showMessage('error', result.error)
      } else if (result.shareLink) {
        setShareLink(result.shareLink)
        showMessage('success', 'Share link regenerated')
        router.refresh()
      }
    })
  }

  const handleSavePin = () => {
    startTransition(async () => {
      const result = await updateSharingPin(workspace.id, pinEnabled ? pin : null)
      if (result.error) {
        showMessage('error', result.error)
      } else {
        showMessage('success', 'PIN settings saved')
        router.refresh()
      }
    })
  }

  const handleDeleteWorkspace = () => {
    if (!confirm(`Are you sure you want to delete "${workspace.name}"? This action cannot be undone.`)) return
    if (!confirm('This will permanently delete all playbooks and data. Are you absolutely sure?')) return

    startTransition(async () => {
      await deleteWorkspaceAction(workspace.id)
    })
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
    showMessage('success', 'Copied to clipboard')
  }

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const fullShareLink = shareLink ? `${siteUrl}/share/${shareLink}` : ''
  const fullInviteLink = inviteLink ? `${siteUrl}/invite/${inviteLink}` : ''

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-light text-gray-900">
          <span className="font-medium text-gray-900">Settings</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your workspace, profile, team, and sharing preferences
        </p>
      </div>

      {/* Tabs - Horizontal on top */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1 overflow-x-auto pb-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  router.push(`/settings?tab=${tab.id}`)
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Message Toast */}
      {message && (
        <div
          className={`flex items-center gap-3 rounded-xl p-4 text-sm font-medium border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <Check className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          )}
          {message.text}
        </div>
      )}

      {/* Workspace Tab */}
      {activeTab === 'workspace' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-base font-medium text-gray-900">Workspace Settings</h2>
              <p className="text-sm text-gray-500 mt-1">Manage your workspace details</p>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label htmlFor="workspaceName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Workspace Name
                </label>
                <input
                  id="workspaceName"
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  disabled={!isOwner}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {isOwner && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveWorkspace}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-600/20"
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          {isOwner && (
            <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
              <div className="border-b border-red-100 px-6 py-5">
                <h2 className="flex items-center gap-2 text-base font-medium text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-red-600 mb-4">
                  Once you delete a workspace, all playbooks and data will be permanently deleted.
                </p>
                <button
                  onClick={handleDeleteWorkspace}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 bg-white border border-red-200 text-red-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Workspace
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-5">
            <h2 className="text-base font-medium text-gray-900">Profile Settings</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your account information</p>
          </div>
          <div className="p-6 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-xl font-medium text-white shadow-md">
                  {fullName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
              </div>
              <div>
                <p className="text-base font-medium text-gray-900">{fullName || 'Your Name'}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={user.email || ''}
                disabled
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-500"
              />
              <p className="text-xs text-gray-400 mt-1">Email address cannot be changed</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveProfile}
                disabled={isPending}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-600/20"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          {/* Invite Link Section */}
          {isOwner && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="flex items-center gap-2 text-base font-medium text-gray-900">
                  <Link2 className="h-5 w-5 text-emerald-500" />
                  Invite Link
                </h2>
                <p className="text-sm text-gray-500 mt-1">Share a link to invite anyone to join your workspace</p>
              </div>
              <div className="p-6 space-y-4">
                {/* Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${inviteLinkEnabled ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                      <Link2 className={`h-5 w-5 ${inviteLinkEnabled ? 'text-emerald-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Enable Invite Link</p>
                      <p className="text-xs text-gray-500">
                        {inviteLinkEnabled ? 'Anyone with the link can join' : 'Link sharing is disabled'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleInviteLink(!inviteLinkEnabled)}
                    disabled={isPending}
                    className={`relative h-6 w-11 rounded-full transition-colors disabled:opacity-50 ${
                      inviteLinkEnabled ? 'bg-emerald-500' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                        inviteLinkEnabled ? 'left-[22px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Invite Link Display */}
                {inviteLinkEnabled && (
                  <>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={fullInviteLink}
                          readOnly
                          className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg font-mono"
                        />
                        <button
                          onClick={() => copyToClipboard(fullInviteLink, 'invite')}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            copied === 'invite'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {copied === 'invite' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {copied === 'invite' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleRegenerateInviteLink}
                      disabled={isPending}
                      className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                      Regenerate Link
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Invite by Email Form */}
          {isOwner && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="flex items-center gap-2 text-base font-medium text-gray-900">
                  <Mail className="h-5 w-5 text-emerald-500" />
                  Invite by Email
                </h2>
                <p className="text-sm text-gray-500 mt-1">Send an invitation to a specific email address</p>
              </div>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@example.com"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as TeamRole)}
                    className="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={handleInvite}
                    disabled={isPending || !inviteEmail}
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                    Invite
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Team Members */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-base font-medium text-gray-900">Team Members</h2>
              <p className="text-sm text-gray-500 mt-1">{members.length + 1} members in this workspace</p>
            </div>
            <div className="divide-y divide-gray-100">
              {/* Owner */}
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-700">
                      {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{profile?.full_name || 'You'}</p>
                      <span className="text-xs text-gray-400">(You)</span>
                    </div>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                  <Crown className="h-3 w-3" />
                  Owner
                </span>
              </div>

              {/* Members */}
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                      {member.user?.full_name?.[0]?.toUpperCase() || member.user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.user?.full_name || 'User'}</p>
                      <p className="text-xs text-gray-500">{member.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOwner ? (
                      <>
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.user_id, e.target.value as TeamRole)}
                          disabled={isPending}
                          className="px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                        </select>
                        <button
                          onClick={() => handleRemoveMember(member.user_id, member.user?.full_name || 'User')}
                          disabled={isPending}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600 capitalize">
                        {member.role}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {members.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <div className="inline-flex p-2 bg-gray-100 rounded-lg mb-3">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">No other team members yet</p>
                  <p className="text-xs text-gray-500">Invite colleagues using the link or email above</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sharing Tab */}
      {activeTab === 'sharing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="flex items-center gap-2 text-base font-medium text-gray-900">
                <Globe className="h-5 w-5 text-emerald-500" />
                Public Sharing
              </h2>
              <p className="text-sm text-gray-500 mt-1">Allow anyone with the link to view your playbooks (read-only)</p>
            </div>
            <div className="p-6 space-y-6">
              {/* Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${shareEnabled ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                    <Globe className={`h-5 w-5 ${shareEnabled ? 'text-emerald-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Enable Public Access</p>
                    <p className="text-xs text-gray-500">
                      {shareEnabled ? 'Anyone with the link can view' : 'Sharing is currently disabled'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleSharing(!shareEnabled)}
                  disabled={isPending || !isOwner}
                  className={`relative h-6 w-11 rounded-full transition-colors disabled:opacity-50 ${
                    shareEnabled ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      shareEnabled ? 'left-[22px]' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Share Link */}
              {shareEnabled && (
                <>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      <Eye className="h-3.5 w-3.5" />
                      Public Share Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={fullShareLink}
                        readOnly
                        className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(fullShareLink, 'share')}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          copied === 'share'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {copied === 'share' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied === 'share' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <a
                      href={fullShareLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 mt-2"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Preview public page
                    </a>
                  </div>

                  {/* PIN Protection */}
                  <div className="border-t border-gray-100 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${pinEnabled ? 'bg-amber-100' : 'bg-gray-100'}`}>
                          <Lock className={`h-5 w-5 ${pinEnabled ? 'text-amber-600' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">PIN Protection</p>
                          <p className="text-xs text-gray-500">Require a PIN to access shared playbooks</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPinEnabled(!pinEnabled)}
                        disabled={!isOwner}
                        className={`relative h-6 w-11 rounded-full transition-colors disabled:opacity-50 ${
                          pinEnabled ? 'bg-amber-500' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                            pinEnabled ? 'left-[22px]' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {pinEnabled && (
                      <div className="flex items-end gap-3">
                        <div className="flex-1 max-w-xs">
                          <label htmlFor="pin" className="block text-xs font-medium text-gray-500 mb-1">
                            PIN (4-6 digits)
                          </label>
                          <input
                            id="pin"
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength={6}
                            placeholder="Enter PIN"
                            className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <button
                          onClick={handleSavePin}
                          disabled={isPending || pin.length < 4}
                          className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                          Save
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Regenerate Link */}
                  {isOwner && (
                    <div className="border-t border-gray-100 pt-6">
                      <button
                        onClick={handleRegenerateLink}
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700"
                      >
                        <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                        Regenerate Share Link
                      </button>
                      <p className="text-xs text-gray-400 mt-1">
                        This will invalidate the current link
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Quick Tip */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">About Sharing</h4>
                <p className="text-xs text-gray-600">
                  Public sharing gives read-only access to anyone with the link. 
                  Team members always have full access based on their role.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}