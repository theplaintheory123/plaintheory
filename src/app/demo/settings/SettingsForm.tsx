'use client'

import { useState } from 'react'

type User = {
  id?: string
  email?: string
  user_metadata?: {
    name?: string
  }
}

type SettingsFormProps = {
  user: User
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const [activeTab, setActiveTab] = useState('workspace')
  const [saving, setSaving] = useState(false)

  // Workspace settings
  const [workspaceName, setWorkspaceName] = useState('My Workspace')
  const [shareLink, setShareLink] = useState('https://plantheory.app/share/abc123')
  const [pinEnabled, setPinEnabled] = useState(false)
  const [pin, setPin] = useState('')

  // Profile settings
  const [name, setName] = useState(user.user_metadata?.name || '')
  const [email] = useState(user.email || '')

  // Team members (mock)
  const teamMembers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Viewer' },
  ]

  const tabs = [
    { id: 'workspace', label: 'Workspace', icon: WorkspaceIcon },
    { id: 'profile', label: 'Profile', icon: ProfileIcon },
    { id: 'team', label: 'Team', icon: TeamIcon },
    { id: 'sharing', label: 'Sharing', icon: SharingIcon },
  ]

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Sidebar */}
      <nav className="lg:w-64">
        <ul className="space-y-1">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'workspace' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-slate-900">Workspace Settings</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="workspaceName" className="mb-2 block text-sm font-semibold text-slate-900">
                  Workspace Name
                </label>
                <input
                  id="workspaceName"
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                />
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="mb-4 font-semibold text-slate-900">Danger Zone</h3>
                <button className="rounded-xl border-2 border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50">
                  Delete Workspace
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-slate-100 pt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-slate-900">Profile Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-2xl font-bold text-white">
                  {name?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || 'U'}
                </div>
                <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Change Avatar
                </button>
              </div>

              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-900">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-900">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
                />
                <p className="mt-1 text-xs text-slate-500">Email cannot be changed</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900">
                  Change Password
                </label>
                <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Send Password Reset Email
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-slate-100 pt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Team Members</h2>
                <button className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl">
                  Invite Member
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-semibold text-white">
                        {member.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{member.name}</p>
                        <p className="text-sm text-slate-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        defaultValue={member.role}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                      <button className="text-slate-400 hover:text-red-600">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invite Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-slate-900">Invite New Member</h3>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                />
                <button className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sharing' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-slate-900">Sharing Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900">
                  Shareable Link
                </label>
                <p className="mb-3 text-sm text-slate-600">
                  Anyone with this link can view your playbooks (read-only access)
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-700"
                  />
                  <button
                    onClick={() => copyToClipboard(shareLink)}
                    className="rounded-xl border-2 border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">PIN Protection</h3>
                    <p className="text-sm text-slate-600">Require a PIN to access shared playbooks</p>
                  </div>
                  <button
                    onClick={() => setPinEnabled(!pinEnabled)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      pinEnabled ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        pinEnabled ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {pinEnabled && (
                  <div className="mt-4">
                    <label htmlFor="pin" className="mb-2 block text-sm font-semibold text-slate-900">
                      Set PIN
                    </label>
                    <input
                      id="pin"
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      maxLength={6}
                      placeholder="Enter 4-6 digit PIN"
                      className="w-48 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-6">
                <button
                  onClick={() => setShareLink(`https://plantheory.app/share/${Math.random().toString(36).substring(7)}`)}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Regenerate Share Link
                </button>
                <p className="mt-1 text-xs text-slate-500">
                  This will invalidate the current link
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-slate-100 pt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function WorkspaceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )
}

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function TeamIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )
}

function SharingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  )
}
