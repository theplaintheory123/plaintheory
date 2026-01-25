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

  const handleInvite = () => {
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
    console.log('Client: handleToggleInviteLink called', { enable, workspaceId: workspace.id })
    setInviteLinkEnabled(enable)
    startTransition(async () => {
      console.log('Client: Calling toggleInviteLink action...')
      const result = await toggleInviteLink(workspace.id, enable)
      console.log('Client: toggleInviteLink result:', result)
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
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Sidebar Navigation */}
      <nav className="lg:w-56 flex-shrink-0">
        <div className="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
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
                className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm font-medium transition-all lg:w-full ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} strokeWidth={isActive ? 2 : 1.75} />
                {tab.label}
                {isActive && <ChevronRight className="ml-auto h-4 w-4 text-indigo-400 hidden lg:block" />}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Message Toast */}
        {message && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl p-4 text-sm font-medium ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <Check className="h-5 w-5 flex-shrink-0" strokeWidth={2.5} />
            ) : (
              <AlertTriangle className="h-5 w-5 flex-shrink-0" strokeWidth={2} />
            )}
            {message.text}
          </div>
        )}

        {/* Workspace Tab */}
        {activeTab === 'workspace' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-900">Workspace Settings</h2>
                <p className="mt-1 text-sm text-slate-500">Manage your workspace details</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="workspaceName" className="mb-2 block text-sm font-medium text-slate-700">
                    Workspace Name
                  </label>
                  <input
                    id="workspaceName"
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    disabled={!isOwner}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 transition-all focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>

                {isOwner && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveWorkspace}
                      disabled={isPending}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50"
                    >
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" strokeWidth={2} />}
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            {isOwner && (
              <div className="rounded-2xl border border-red-200 bg-red-50/50">
                <div className="border-b border-red-200 px-6 py-5">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-red-700">
                    <AlertTriangle className="h-5 w-5" strokeWidth={2} />
                    Danger Zone
                  </h2>
                </div>
                <div className="p-6">
                  <p className="mb-4 text-sm text-red-600 leading-relaxed">
                    Once you delete a workspace, there is no going back. All playbooks and data will be permanently deleted.
                  </p>
                  <button
                    onClick={handleDeleteWorkspace}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 active:scale-[0.98] disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                    Delete Workspace
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-semibold text-slate-900">Profile Settings</h2>
              <p className="mt-1 text-sm text-slate-500">Manage your account information</p>
            </div>
            <div className="p-6 space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-semibold text-white shadow-lg shadow-indigo-500/25">
                    {fullName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900">{fullName || 'Your Name'}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 transition-all focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                />
                <p className="mt-2 text-xs text-slate-400">Email address cannot be changed</p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" strokeWidth={2} />}
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
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Link2 className="h-5 w-5 text-indigo-500" strokeWidth={2} />
                    Invite Link
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">Share a link to invite anyone to join your workspace</p>
                </div>
                <div className="p-6 space-y-4">
                  {/* Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${inviteLinkEnabled ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Link2 className="h-6 w-6" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Enable Invite Link</p>
                        <p className="text-sm text-slate-500">
                          {inviteLinkEnabled ? 'Anyone with the link can join' : 'Link sharing is disabled'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleInviteLink(!inviteLinkEnabled)}
                      disabled={isPending}
                      className={`relative h-7 w-12 rounded-full transition-colors disabled:opacity-50 ${
                        inviteLinkEnabled ? 'bg-indigo-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                          inviteLinkEnabled ? 'left-[22px]' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Invite Link Display */}
                  {inviteLinkEnabled && (
                    <>
                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={fullInviteLink}
                            readOnly
                            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 font-mono"
                          />
                          <button
                            onClick={() => copyToClipboard(fullInviteLink, 'invite')}
                            className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all active:scale-[0.98] ${
                              copied === 'invite'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700'
                            }`}
                          >
                            {copied === 'invite' ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Copy className="h-4 w-4" strokeWidth={2} />}
                            {copied === 'invite' ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleRegenerateInviteLink}
                        disabled={isPending}
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
                      >
                        <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} strokeWidth={2} />
                        Regenerate Link
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Invite by Email Form */}
            {isOwner && (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Mail className="h-5 w-5 text-purple-500" strokeWidth={2} />
                    Invite by Email
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">Send an invitation to a specific email address</p>
                </div>
                <div className="p-6">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" strokeWidth={1.5} />
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@example.com"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 text-sm text-slate-900 transition-all focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as TeamRole)}
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-all focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={handleInvite}
                      disabled={isPending || !inviteEmail}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50"
                    >
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" strokeWidth={2} />}
                      Invite
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Team Members */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-900">Team Members</h2>
                <p className="mt-1 text-sm text-slate-500">{members.length + 1} members in this workspace</p>
              </div>
              <div className="divide-y divide-slate-100">
                {/* Owner */}
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-md">
                        {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">{profile?.full_name || 'You'}</p>
                        <span className="text-xs text-slate-400">(You)</span>
                      </div>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                    <Crown className="h-3.5 w-3.5" strokeWidth={2} />
                    Owner
                  </span>
                </div>

                {/* Members */}
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
                        {member.user?.full_name?.[0]?.toUpperCase() || member.user?.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{member.user?.full_name || 'User'}</p>
                        <p className="text-sm text-slate-500">{member.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {isOwner ? (
                        <>
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleChange(member.user_id, e.target.value as TeamRole)}
                            disabled={isPending}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-all focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                          >
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                          </select>
                          <button
                            onClick={() => handleRemoveMember(member.user_id, member.user?.full_name || 'User')}
                            disabled={isPending}
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={2} />
                          </button>
                        </>
                      ) : (
                        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold capitalize text-slate-600">
                          {member.role}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {members.length === 0 && (
                  <div className="px-6 py-16 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                      <Users className="h-7 w-7 text-slate-400" strokeWidth={1.5} />
                    </div>
                    <p className="mb-1 font-medium text-slate-900">No other team members yet</p>
                    <p className="text-sm text-slate-500">Invite colleagues using the link or email above</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sharing Tab */}
        {activeTab === 'sharing' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <Globe className="h-5 w-5 text-emerald-500" strokeWidth={2} />
                  Public Sharing
                </h2>
                <p className="mt-1 text-sm text-slate-500">Allow anyone with the link to view your playbooks (read-only)</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${shareEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      <Globe className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Enable Public Access</p>
                      <p className="text-sm text-slate-500">
                        {shareEnabled ? 'Anyone with the link can view' : 'Sharing is currently disabled'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleSharing(!shareEnabled)}
                    disabled={isPending || !isOwner}
                    className={`relative h-7 w-12 rounded-full transition-colors disabled:opacity-50 ${
                      shareEnabled ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                        shareEnabled ? 'left-[22px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Share Link */}
                {shareEnabled && (
                  <>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <label className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Eye className="h-4 w-4" strokeWidth={2} />
                        Public Share Link (Read-Only)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={fullShareLink}
                          readOnly
                          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 font-mono"
                        />
                        <button
                          onClick={() => copyToClipboard(fullShareLink, 'share')}
                          className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all active:scale-[0.98] ${
                            copied === 'share'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700'
                          }`}
                        >
                          {copied === 'share' ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Copy className="h-4 w-4" strokeWidth={2} />}
                          {copied === 'share' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <a
                        href={fullShareLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Preview public page
                      </a>
                    </div>

                    {/* PIN Protection */}
                    <div className="border-t border-slate-100 pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${pinEnabled ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                            <Lock className="h-6 w-6" strokeWidth={1.5} />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">PIN Protection</p>
                            <p className="text-sm text-slate-500">Require a PIN to access shared playbooks</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setPinEnabled(!pinEnabled)}
                          disabled={!isOwner}
                          className={`relative h-7 w-12 rounded-full transition-colors disabled:opacity-50 ${
                            pinEnabled ? 'bg-amber-500' : 'bg-slate-200'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                              pinEnabled ? 'left-[22px]' : 'left-0.5'
                            }`}
                          />
                        </button>
                      </div>

                      {pinEnabled && (
                        <div className="mt-4 flex items-end gap-3">
                          <div className="flex-1 max-w-xs">
                            <label htmlFor="pin" className="mb-2 block text-sm font-medium text-slate-700">
                              Set PIN (4-6 digits)
                            </label>
                            <input
                              id="pin"
                              type="password"
                              value={pin}
                              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              maxLength={6}
                              placeholder="Enter PIN"
                              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 transition-all focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                            />
                          </div>
                          <button
                            onClick={handleSavePin}
                            disabled={isPending || pin.length < 4}
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50"
                          >
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" strokeWidth={2} />}
                            Save PIN
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Regenerate Link */}
                    {isOwner && (
                      <div className="border-t border-slate-100 pt-6">
                        <button
                          onClick={handleRegenerateLink}
                          disabled={isPending}
                          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
                        >
                          <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} strokeWidth={2} />
                          Regenerate Share Link
                        </button>
                        <p className="mt-1 text-xs text-slate-400">
                          This will invalidate the current link
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
