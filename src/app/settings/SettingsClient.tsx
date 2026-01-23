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
} from '@/lib/actions/workspace'
import type { Profile, Workspace, WorkspaceMember, TeamRole } from '@/lib/types/database'
import {
  Building2,
  User,
  Users,
  Share2,
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
  ChevronRight,
  Lock,
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
  { id: 'workspace', label: 'Workspace', icon: Building2, description: 'General settings' },
  { id: 'profile', label: 'Profile', icon: User, description: 'Your account' },
  { id: 'team', label: 'Team', icon: Users, description: 'Manage members' },
  { id: 'sharing', label: 'Sharing', icon: Share2, description: 'Public access' },
]

export function SettingsClient({ user, profile, workspace, members, isOwner, initialTab }: Props) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(initialTab)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [copied, setCopied] = useState(false)

  // Workspace settings
  const [workspaceName, setWorkspaceName] = useState(workspace.name)

  // Profile settings
  const [fullName, setFullName] = useState(profile?.full_name || user.user_metadata?.name || '')

  // Team settings
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<TeamRole>('viewer')

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    showMessage('success', 'Copied to clipboard')
  }

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const fullShareLink = shareLink ? `${siteUrl}/share/${shareLink}` : ''

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Sidebar Navigation */}
      <nav className="lg:w-56 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
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
                className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-4 py-3 text-left text-sm transition-colors lg:w-full ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div className="hidden lg:block">
                  <span className="font-medium">{tab.label}</span>
                  <p className="text-xs text-slate-400">{tab.description}</p>
                </div>
                <span className="lg:hidden font-medium">{tab.label}</span>
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
            className={`mb-6 flex items-center gap-3 rounded-lg p-4 text-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-700'
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
            <div className="rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="font-semibold text-slate-900">Workspace Settings</h2>
                <p className="text-sm text-slate-500">Manage your workspace details</p>
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
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>

                {isOwner && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveWorkspace}
                      disabled={isPending}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
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
              <div className="rounded-xl border border-red-200 bg-red-50">
                <div className="border-b border-red-200 px-6 py-4">
                  <h2 className="flex items-center gap-2 font-semibold text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                  </h2>
                </div>
                <div className="p-6">
                  <p className="mb-4 text-sm text-red-600">
                    Once you delete a workspace, there is no going back. All playbooks and data will be permanently deleted.
                  </p>
                  <button
                    onClick={handleDeleteWorkspace}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
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
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="font-semibold text-slate-900">Profile Settings</h2>
              <p className="text-sm text-slate-500">Manage your account information</p>
            </div>
            <div className="p-6 space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
                  {fullName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{fullName || 'Your Name'}</p>
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
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500"
                />
                <p className="mt-1.5 text-xs text-slate-400">Email address cannot be changed</p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
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
            {/* Team Members */}
            <div className="rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="font-semibold text-slate-900">Team Members</h2>
                <p className="text-sm text-slate-500">{members.length + 1} members in this workspace</p>
              </div>
              <div className="divide-y divide-slate-100">
                {/* Owner */}
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                      {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">{profile?.full_name || 'You'}</p>
                        <span className="text-xs text-slate-400">(You)</span>
                      </div>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                    <Crown className="h-3 w-3" />
                    Owner
                  </span>
                </div>

                {/* Members */}
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
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
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                          {member.role}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {members.length === 0 && (
                  <div className="px-6 py-8 text-center">
                    <Users className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-2 text-sm text-slate-500">No team members yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Invite Form */}
            {isOwner && (
              <div className="rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h2 className="flex items-center gap-2 font-semibold text-slate-900">
                    <UserPlus className="h-5 w-5 text-slate-400" />
                    Invite New Member
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@example.com"
                        className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as TeamRole)}
                      className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={handleInvite}
                      disabled={isPending || !inviteEmail}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                      Send Invite
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sharing Tab */}
        {activeTab === 'sharing' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="font-semibold text-slate-900">Public Sharing</h2>
                <p className="text-sm text-slate-500">Allow anyone with the link to view your playbooks</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${shareEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      <Share2 className="h-5 w-5" />
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
                    className={`relative h-6 w-11 rounded-full transition-colors disabled:opacity-50 ${
                      shareEnabled ? 'bg-emerald-500' : 'bg-slate-200'
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
                    <div className="rounded-lg bg-slate-50 p-4">
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Link2 className="h-4 w-4" />
                        Share Link
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={fullShareLink}
                          readOnly
                          className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700"
                        />
                        <button
                          onClick={() => copyToClipboard(fullShareLink)}
                          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                            copied
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-900 text-white hover:bg-slate-800'
                          }`}
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    {/* PIN Protection */}
                    <div className="border-t border-slate-100 pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${pinEnabled ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                            <Lock className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">PIN Protection</p>
                            <p className="text-sm text-slate-500">Require a PIN to access shared playbooks</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setPinEnabled(!pinEnabled)}
                          disabled={!isOwner}
                          className={`relative h-6 w-11 rounded-full transition-colors disabled:opacity-50 ${
                            pinEnabled ? 'bg-amber-500' : 'bg-slate-200'
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
                              placeholder="••••"
                              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                          </div>
                          <button
                            onClick={handleSavePin}
                            disabled={isPending || pin.length < 4}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                          >
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
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
                          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                        >
                          <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
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
