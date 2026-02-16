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
  CheckCircle2,
  Target,
  AlertCircle,
  Shield,
  Zap,
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
  const playbooksWithDescription = allPlaybooks.filter(pb => pb.description && pb.description.length > 0).length
  const completionRate = allPlaybooks.length > 0
    ? Math.round((playbooksWithDescription / allPlaybooks.length) * 100)
    : 0

  // Get top categories for chart
  const topCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)

  // Calculate health score
  const healthScore = Math.round(
    ((stats.totalPlaybooks > 0 ? 1 : 0) +
    (stats.totalMembers > 1 ? 1 : 0) +
    (workspace.share_enabled ? 1 : 0)) / 3 * 100
  )

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {greeting}, {firstName}
            </h1>
            <p className="text-slate-500 mt-1">
              Here&apos;s what&apos;s happening with your workspace
            </p>
          </div>
          <Link
            href="/playbooks/new"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/25"
          >
            <Plus className="w-4 h-4" />
            New Playbook
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 hover:shadow-lg hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
              </div>
              {stats.totalPlaybooks > 0 && (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full hidden sm:inline-flex">
                  Active
                </span>
              )}
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.totalPlaybooks}</p>
            <p className="text-sm text-slate-500 mt-1">Playbooks</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 hover:shadow-lg hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.totalMembers}</p>
            <p className="text-sm text-slate-500 mt-1">Team Members</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 hover:shadow-lg hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.totalViews}</p>
            <p className="text-sm text-slate-500 mt-1">Total Views</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 hover:shadow-lg hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">{completionRate}%</p>
            <p className="text-sm text-slate-500 mt-1">Documented</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Recent Playbooks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
              <h2 className="text-sm font-semibold text-slate-700 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <Link
                  href="/playbooks/new"
                  className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-700 text-center">Create</span>
                </Link>

                <Link
                  href="/templates"
                  className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                    <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-700 text-center">Templates</span>
                </Link>

                <Link
                  href="/settings?tab=team"
                  className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                    <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-700 text-center">Invite</span>
                </Link>
              </div>
            </div>

            {/* Recent Playbooks */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                  <h2 className="text-sm font-semibold text-slate-700">Recent Playbooks</h2>
                </div>
                <Link
                  href="/playbooks"
                  className="flex items-center gap-1 text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  View all
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </div>

              {recentPlaybooks.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {recentPlaybooks.map((playbook) => (
                    <Link
                      key={playbook.id}
                      href={`/playbooks/${playbook.id}`}
                      className="flex items-center gap-3 sm:gap-4 px-5 sm:px-6 py-4 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-50 transition-colors">
                        <FileText className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-medium text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                            {playbook.title}
                          </p>
                          <span className={`hidden sm:inline-flex text-xs px-2 py-0.5 rounded-full ${getCategoryStyle(playbook.category)}`}>
                            {playbook.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>Updated {formatDistanceToNow(playbook.updated_at)}</span>
                          {playbook.view_count > 0 && (
                            <span className="hidden sm:flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {playbook.view_count}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 sm:p-12 text-center">
                  <div className="inline-flex p-3 bg-slate-100 rounded-xl mb-4">
                    <BookOpen className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="text-sm font-medium text-slate-700 mb-1">No playbooks yet</h3>
                  <p className="text-xs text-slate-500 mb-4">Create your first playbook to get started</p>
                  <Link
                    href="/playbooks/new"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 text-xs sm:text-sm rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Playbook
                  </Link>
                </div>
              )}
            </div>

            {/* Activity Timeline */}
            {recentPlaybooks.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                  <h2 className="text-sm font-semibold text-slate-700">Recent Activity</h2>
                </div>
                <div className="space-y-4">
                  {recentPlaybooks.slice(0, 3).map((playbook, index) => (
                    <div key={playbook.id} className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500"></div>
                        {index < 2 && (
                          <div className="absolute top-4 left-1 w-px h-10 sm:h-12 bg-slate-200"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm text-slate-900">
                          <span className="font-medium">{playbook.title}</span> was updated
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatDistanceToNow(playbook.updated_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Analytics & Insights */}
          <div className="space-y-6">
            {/* Category Distribution */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                  <h2 className="text-sm font-semibold text-slate-700">Categories</h2>
                </div>
                <span className="text-xs text-slate-400">{Object.keys(categoryStats).length} total</span>
              </div>

              {topCategories.length > 0 ? (
                <div className="space-y-4">
                  {topCategories.map(([category, count]) => (
                    <div key={category}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-medium text-slate-700">{category}</span>
                        <span className="text-slate-500">{count} playbook{count !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getCategoryBarColor(category)}`}
                          style={{ width: `${Math.max((count / stats.totalPlaybooks) * 100, 5)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">No categories yet</p>
              )}
            </div>

            {/* Workspace Health */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <h2 className="text-sm font-semibold text-slate-700">Workspace Health</h2>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stats.totalPlaybooks > 0 ? 'bg-emerald-100' : 'bg-slate-200'}`}>
                      <BookOpen className={`w-4 h-4 ${stats.totalPlaybooks > 0 ? 'text-emerald-600' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-700">Documentation</p>
                      <p className="text-xs text-slate-500">{stats.totalPlaybooks} playbooks</p>
                    </div>
                  </div>
                  {stats.totalPlaybooks > 0 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-slate-300" />
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stats.totalMembers > 1 ? 'bg-emerald-100' : 'bg-slate-200'}`}>
                      <Users className={`w-4 h-4 ${stats.totalMembers > 1 ? 'text-emerald-600' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-700">Team</p>
                      <p className="text-xs text-slate-500">{stats.totalMembers} member{stats.totalMembers !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  {stats.totalMembers > 1 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-slate-300" />
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${workspace.share_enabled ? 'bg-emerald-100' : 'bg-slate-200'}`}>
                      <Shield className={`w-4 h-4 ${workspace.share_enabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-700">Sharing</p>
                      <p className="text-xs text-slate-500">{workspace.share_enabled ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                  {workspace.share_enabled ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-slate-300" />
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-600">Overall health</span>
                  <span className="font-semibold text-slate-700">{healthScore}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                    style={{ width: `${healthScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">Pro Tip</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Use templates to create consistent playbooks quickly. Your team will thank you.
                  </p>
                  <Link
                    href="/templates"
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                  >
                    Browse templates
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started Card - Only show when empty */}
        {stats.totalPlaybooks === 0 && (
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
            <div className="px-6 sm:px-8 py-8 sm:py-12 text-center text-white">
              <div className="inline-flex p-3 bg-white/10 rounded-xl backdrop-blur-sm mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Welcome to {workspace.name}</h2>
              <p className="text-indigo-100 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
                Get started by creating your first playbook. We&apos;ll guide you through the process.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link
                  href="/playbooks/new"
                  className="w-full sm:w-auto bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors shadow-lg text-sm sm:text-base"
                >
                  Create your first playbook
                </Link>
                <Link
                  href="/templates"
                  className="w-full sm:w-auto bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm text-sm sm:text-base"
                >
                  Browse templates
                </Link>
              </div>
            </div>

            {/* Step indicators */}
            <div className="bg-black/10 backdrop-blur-sm px-6 sm:px-8 py-4">
              <div className="flex items-center justify-center gap-4 sm:gap-8 overflow-x-auto">
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-medium text-white">
                    1
                  </div>
                  <span className="text-xs sm:text-sm text-white/80">Create playbook</span>
                </div>
                <div className="w-8 sm:w-12 h-px bg-white/20 flex-shrink-0"></div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-medium text-white">
                    2
                  </div>
                  <span className="text-xs sm:text-sm text-white/80">Invite team</span>
                </div>
                <div className="w-8 sm:w-12 h-px bg-white/20 flex-shrink-0"></div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-medium text-white">
                    3
                  </div>
                  <span className="text-xs sm:text-sm text-white/80">Start using</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
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
