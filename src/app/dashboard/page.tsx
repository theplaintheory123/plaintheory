import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/ui/DashboardLayout'
import Link from 'next/link'
import { getUserWorkspace, getRecentPlaybooks, getDashboardStats, getPlaybooks, autoJoinFromPendingInvitation } from '@/lib/supabase/queries'
import { formatDistanceToNow } from '@/lib/utils/date'
import {
  BookOpen,
  Users,
  Eye,
  Plus,
  Layers,
  ArrowUpRight,
  Clock,
  FileText,
  Sparkles,
  TrendingUp,
  UserPlus,
  ArrowRight,
  BarChart3,
  Activity,
  Zap,
  Shield,
  CheckCircle2,
  Target,
  Calendar,
  AlertCircle,
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // First check if user already has a workspace
  let workspace = await getUserWorkspace(user.id)

  // If no workspace, try to auto-join from pending invitation
  if (!workspace && user.email) {
    const { joined } = await autoJoinFromPendingInvitation(user.id, user.email)
    if (joined) {
      // Re-fetch workspace after joining
      workspace = await getUserWorkspace(user.id)
    }
  }

  // Only redirect to onboarding if still no workspace
  // (onboarding is only for creating new workspaces, not for invited members)
  if (!workspace) {
    redirect('/onboarding')
  }

  const [recentPlaybooks, stats, allPlaybooks] = await Promise.all([
    getRecentPlaybooks(workspace.id, 5),
    getDashboardStats(workspace.id),
    getPlaybooks(workspace.id),
  ])

  const firstName = user.user_metadata?.name?.split(' ')[0] || 'there'
  const greeting = getGreeting()

  // Calculate category distribution
  const categoryStats = allPlaybooks.reduce((acc, pb) => {
    acc[pb.category] = (acc[pb.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Calculate completion rate (playbooks with descriptions)
  const completionRate = allPlaybooks.length > 0
    ? Math.round((allPlaybooks.filter(pb => pb.description && pb.description.length > 0).length / allPlaybooks.length) * 100)
    : 0

  return (
    <DashboardLayout user={user}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {greeting}, {firstName}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Welcome back to <span className="font-medium text-slate-700">{workspace.name}</span>
              <span className="hidden sm:inline text-slate-400"> • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/playbooks"
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 sm:inline-flex"
            >
              <BookOpen className="h-4 w-4" strokeWidth={2} />
              View All
            </Link>
            <Link
              href="/playbooks/new"
              className="hidden items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/25 active:scale-[0.98] sm:inline-flex"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              New Playbook
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid - Enhanced */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Playbooks */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-indigo-200 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Playbooks</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{stats.totalPlaybooks}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                Active
              </p>
            </div>
            <div className="rounded-xl bg-indigo-50 p-3">
              <BookOpen className="h-6 w-6 text-indigo-600" strokeWidth={1.5} />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {/* Team Members */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-purple-200 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Team Members</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{stats.totalMembers}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-purple-600">
                <Users className="h-3.5 w-3.5" />
                Collaborating
              </p>
            </div>
            <div className="rounded-xl bg-purple-50 p-3">
              <Users className="h-6 w-6 text-purple-600" strokeWidth={1.5} />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {/* Total Views */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-amber-200 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Views</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{stats.totalViews}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-amber-600">
                <Eye className="h-3.5 w-3.5" />
                All time
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3">
              <Eye className="h-6 w-6 text-amber-600" strokeWidth={1.5} />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {/* Completion Rate */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-emerald-200 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Completion Rate</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{completionRate}%</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Documented
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3">
              <Target className="h-6 w-6 text-emerald-600" strokeWidth={1.5} />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Recent Activity & Playbooks */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions - Redesigned */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Zap className="h-4 w-4 text-amber-500" />
                Quick Actions
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Link
                href="/playbooks/new"
                className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center transition-all hover:border-indigo-200 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-110">
                  <Plus className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Create Playbook</p>
                  <p className="text-xs text-slate-500">Start from scratch</p>
                </div>
              </Link>

              <Link
                href="/templates"
                className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center transition-all hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-110">
                  <Layers className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Use Template</p>
                  <p className="text-xs text-slate-500">Pre-built processes</p>
                </div>
              </Link>

              <Link
                href="/settings?tab=team"
                className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center transition-all hover:border-purple-200 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20 transition-transform group-hover:scale-110">
                  <UserPlus className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Invite Team</p>
                  <p className="text-xs text-slate-500">Add collaborators</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Playbooks */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Clock className="h-4 w-4 text-slate-400" />
                Recent Playbooks
              </h2>
              <Link
                href="/playbooks"
                className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
              >
                View all
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {recentPlaybooks.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {recentPlaybooks.map((playbook, index) => (
                  <Link
                    key={playbook.id}
                    href={`/playbooks/${playbook.id}`}
                    className={`group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50 ${
                      index !== recentPlaybooks.length - 1 ? 'border-b border-slate-100' : ''
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-indigo-50">
                      <FileText className="h-5 w-5 text-slate-500 transition-colors group-hover:text-indigo-600" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-slate-900">{playbook.title}</p>
                      <div className="mt-0.5 flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDistanceToNow(playbook.updated_at)}
                        </span>
                        {playbook.view_count > 0 && (
                          <span className="flex items-center gap-1.5">
                            <Eye className="h-3.5 w-3.5" />
                            {playbook.view_count}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`rounded-lg px-3 py-1 text-xs font-semibold ${getCategoryStyle(playbook.category)}`}>
                      {playbook.category}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-slate-300 opacity-0 transition-all group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                  <BookOpen className="h-8 w-8 text-slate-400" strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">No playbooks yet</h3>
                <p className="mb-6 text-sm text-slate-500">Create your first playbook to get started</p>
                <Link
                  href="/playbooks/new"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-xl"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                  Create Playbook
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar Widgets */}
        <div className="space-y-6">
          {/* Category Distribution */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <BarChart3 className="h-4 w-4 text-slate-400" />
                Categories
              </h3>
            </div>
            {Object.keys(categoryStats).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(categoryStats)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([category, count]) => (
                    <div key={category} className="group">
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{category}</span>
                        <span className="text-slate-500">{count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all ${getCategoryBarColor(category)}`}
                          style={{ width: `${(count / stats.totalPlaybooks) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-500">No playbooks to analyze</p>
              </div>
            )}
          </div>

          {/* Workspace Health */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Activity className="h-4 w-4 text-slate-400" />
                Workspace Health
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stats.totalPlaybooks > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  <BookOpen className="h-4 w-4" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Documentation</p>
                  <p className="text-xs text-slate-500">{stats.totalPlaybooks > 0 ? `${stats.totalPlaybooks} playbooks created` : 'No playbooks yet'}</p>
                </div>
                {stats.totalPlaybooks > 0 ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" strokeWidth={2} />
                ) : (
                  <AlertCircle className="h-5 w-5 text-slate-300" strokeWidth={2} />
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stats.totalMembers > 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Users className="h-4 w-4" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Team Setup</p>
                  <p className="text-xs text-slate-500">{stats.totalMembers > 1 ? `${stats.totalMembers} team members` : 'Invite your team'}</p>
                </div>
                {stats.totalMembers > 1 ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" strokeWidth={2} />
                ) : (
                  <AlertCircle className="h-5 w-5 text-slate-300" strokeWidth={2} />
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${workspace.share_enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Shield className="h-4 w-4" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Sharing</p>
                  <p className="text-xs text-slate-500">{workspace.share_enabled ? 'Public sharing enabled' : 'Sharing disabled'}</p>
                </div>
                {workspace.share_enabled ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" strokeWidth={2} />
                ) : (
                  <AlertCircle className="h-5 w-5 text-slate-300" strokeWidth={2} />
                )}
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" strokeWidth={2} />
              <h3 className="text-sm font-semibold text-slate-900">Pro Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
                Use templates to quickly create standard processes
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
                Invite team members to collaborate on playbooks
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
                Enable sharing to give external access
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Getting Started Card - Only show when empty */}
      {stats.totalPlaybooks === 0 && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
                <Sparkles className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900">Getting Started with Plaintheory</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Follow these steps to set up your workspace and start documenting your processes.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Create your first playbook</p>
                  <p className="mt-1 text-sm text-slate-500">Document an operational process</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Invite your team</p>
                  <p className="mt-1 text-sm text-slate-500">Collaborate with colleagues</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Share & execute</p>
                  <p className="mt-1 text-sm text-slate-500">Use playbooks in operations</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-indigo-100 bg-indigo-50/50 px-6 py-4 sm:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/playbooks/new"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Create First Playbook
              </Link>
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                <Layers className="h-4 w-4" strokeWidth={2} />
                Browse Templates
              </Link>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getCategoryStyle(category: string) {
  const styles: Record<string, string> = {
    HR: 'bg-blue-50 text-blue-700',
    Operations: 'bg-purple-50 text-purple-700',
    Support: 'bg-emerald-50 text-emerald-700',
    Finance: 'bg-amber-50 text-amber-700',
    Marketing: 'bg-pink-50 text-pink-700',
    Sales: 'bg-cyan-50 text-cyan-700',
    Other: 'bg-slate-100 text-slate-700',
  }
  return styles[category] || styles.Other
}

function getCategoryBarColor(category: string) {
  const colors: Record<string, string> = {
    HR: 'bg-blue-500',
    Operations: 'bg-purple-500',
    Support: 'bg-emerald-500',
    Finance: 'bg-amber-500',
    Marketing: 'bg-pink-500',
    Sales: 'bg-cyan-500',
    Other: 'bg-slate-400',
  }
  return colors[category] || colors.Other
}
