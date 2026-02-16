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
  UserPlus,
  ArrowRight,
  BarChart3,
  Activity,
  CheckCircle2,
  Target,
  AlertCircle,
  Shield,
  Zap,
  ChevronRight,
  TrendingUp,
  Award,
  Star,
  Grid,
  Layout,
  Settings,
  HelpCircle,
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

  // Calculate engagement score
  const engagementScore = allPlaybooks.length > 0
    ? Math.round((allPlaybooks.filter(pb => pb.view_count > 0).length / allPlaybooks.length) * 100)
    : 0

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-900">
              {greeting}, <span className="font-medium text-gray-900">{firstName}</span>
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {workspace.name} · {stats.totalMembers} member{stats.totalMembers !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/help"
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Help
            </Link>
            <Link
              href="/playbooks/new"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/25"
            >
              <Plus className="w-4 h-4" />
              New Playbook
            </Link>
          </div>
        </div>

        {/* Welcome Card - Only show when empty */}
        {stats.totalPlaybooks === 0 && (
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-800">
            <div className="px-6 py-8 sm:px-8 sm:py-10 text-center text-white">
              <div className="inline-flex p-3 bg-emerald-500/10 rounded-xl mb-4">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium mb-2">Welcome to {workspace.name}</h2>
              <p className="text-gray-400 mb-6 max-w-md mx-auto text-sm">
                Get started by creating your first playbook. We'll guide you through the process.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/playbooks/new"
                  className="w-full sm:w-auto bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-lg text-sm"
                >
                  Create your first playbook
                </Link>
                <Link
                  href="/templates"
                  className="w-full sm:w-auto bg-gray-800 text-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors text-sm border border-gray-700"
                >
                  Browse templates
                </Link>
              </div>
            </div>

            {/* Step indicators */}
            <div className="bg-gray-900/50 border-t border-gray-800 px-6 py-4">
              <div className="flex items-center justify-center gap-4 sm:gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-medium text-emerald-400">
                    1
                  </div>
                  <span className="text-xs text-gray-400">Create</span>
                </div>
                <div className="w-8 h-px bg-gray-700"></div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-xs font-medium text-gray-500">
                    2
                  </div>
                  <span className="text-xs text-gray-500">Invite</span>
                </div>
                <div className="w-8 h-px bg-gray-700"></div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-xs font-medium text-gray-500">
                    3
                  </div>
                  <span className="text-xs text-gray-500">Run</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Playbooks"
            value={stats.totalPlaybooks}
            icon={BookOpen}
            color="emerald"
            trend={stats.totalPlaybooks > 0 ? `${stats.totalPlaybooks} created` : undefined}
          />
          <StatCard
            title="Team Members"
            value={stats.totalMembers}
            icon={Users}
            color="blue"
            trend={stats.totalMembers > 1 ? 'Active team' : undefined}
          />
          <StatCard
            title="Total Views"
            value={stats.totalViews}
            icon={Eye}
            color="amber"
            trend={stats.totalViews > 0 ? `${Math.round(stats.totalViews / Math.max(stats.totalPlaybooks, 1))} avg/playbook` : undefined}
          />
          <StatCard
            title="Documentation"
            value={`${completionRate}%`}
            icon={Target}
            color="purple"
            trend={completionRate > 0 ? `${playbooksWithDescription} completed` : undefined}
          />
          <StatCard
            title="Engagement"
            value={`${engagementScore}%`}
            icon={TrendingUp}
            color="rose"
            trend={engagementScore > 0 ? 'Active playbooks' : undefined}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Recent & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Playbooks */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <h2 className="text-sm font-medium text-gray-700">Recent Playbooks</h2>
                </div>
                <Link
                  href="/playbooks"
                  className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View all
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {recentPlaybooks.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {recentPlaybooks.map((playbook) => (
                    <Link
                      key={playbook.id}
                      href={`/playbooks/${playbook.id}`}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-50 transition-colors">
                        <FileText className="w-4 h-4 text-gray-500 group-hover:text-emerald-600 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {playbook.title}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryStyle(playbook.category)}`}>
                            {playbook.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                          <span>Updated {formatDistanceToNow(playbook.updated_at)}</span>
                          {playbook.view_count > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {playbook.view_count}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="inline-flex p-2 bg-gray-100 rounded-lg mb-3">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">No playbooks yet</p>
                  <Link
                    href="/playbooks/new"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create your first
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3">
              <QuickAction
                href="/playbooks/new"
                icon={Plus}
                label="Create"
                color="emerald"
              />
              <QuickAction
                href="/templates"
                icon={Layout}
                label="Templates"
                color="blue"
              />
              <QuickAction
                href={`/settings?tab=team`}
                icon={UserPlus}
                label="Invite"
                color="purple"
              />
            </div>

            {/* Activity Timeline - Only show if there's activity */}
            {recentPlaybooks.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <h2 className="text-sm font-medium text-gray-700">Recent Activity</h2>
                </div>
                <div className="space-y-4">
                  {recentPlaybooks.slice(0, 3).map((playbook, index) => (
                    <div key={playbook.id} className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-1.5 h-1.5 mt-2 rounded-full bg-emerald-500"></div>
                        {index < 2 && (
                          <div className="absolute top-3 left-0.5 w-px h-8 bg-gray-200"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{playbook.title}</span> was updated
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDistanceToNow(playbook.updated_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Insights & Health */}
          <div className="space-y-6">
            {/* Workspace Health */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-medium text-gray-700">Workspace Health</h2>
              </div>

              <div className="space-y-3 mb-4">
                <HealthCheck
                  label="Documentation"
                  value={stats.totalPlaybooks}
                  threshold={1}
                  icon={BookOpen}
                  color="emerald"
                />
                <HealthCheck
                  label="Team Size"
                  value={stats.totalMembers}
                  threshold={2}
                  icon={Users}
                  color="blue"
                />
                <HealthCheck
                  label="Sharing"
                  value={workspace.share_enabled ? 1 : 0}
                  threshold={1}
                  icon={Shield}
                  color="purple"
                />
              </div>

              {/* Progress bar */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-500">Overall health</span>
                  <span className="font-medium text-gray-700">{healthScore}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                    style={{ width: `${healthScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            {topCategories.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Grid className="w-4 h-4 text-gray-400" />
                  <h2 className="text-sm font-medium text-gray-700">Categories</h2>
                </div>

                <div className="space-y-3">
                  {topCategories.map(([category, count]) => (
                    <div key={category}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700">{category}</span>
                        <span className="text-gray-500">{count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getCategoryBarColor(category)}`}
                          style={{ width: `${(count / stats.totalPlaybooks) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Tip */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200 p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Pro Tip</h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    Use templates to create consistent playbooks faster. Save time and maintain quality.
                  </p>
                  <Link
                    href="/templates"
                    className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Browse templates
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Helper Components
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color,
  trend 
}: { 
  title: string
  value: string | number
  icon: any
  color: string
  trend?: string
}) => {
  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
    rose: 'bg-rose-50 text-rose-600',
  }[color]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg ${colorClasses} flex items-center justify-center`}>
          <Icon className="w-4 h-4" />
        </div>
        {trend && (
          <span className="text-xs text-gray-500 hidden sm:block">{trend}</span>
        )}
      </div>
      <p className="text-xl font-semibold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{title}</p>
    </div>
  )
}

const QuickAction = ({ 
  href, 
  icon: Icon, 
  label, 
  color 
}: { 
  href: string
  icon: any
  label: string
  color: string
}) => {
  const colorClasses = {
    emerald: 'hover:bg-emerald-50 hover:text-emerald-600 group-hover:bg-emerald-500',
    blue: 'hover:bg-blue-50 hover:text-blue-600',
    purple: 'hover:bg-purple-50 hover:text-purple-600',
  }[color]

  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-${color}-200 transition-all group bg-white`}
    >
      <div className={`w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-${color}-50 transition-colors`}>
        <Icon className={`w-4 h-4 text-gray-500 group-hover:text-${color}-600 transition-colors`} />
      </div>
      <span className={`text-xs font-medium text-gray-600 group-hover:text-${color}-600 transition-colors`}>
        {label}
      </span>
    </Link>
  )
}

const HealthCheck = ({ 
  label, 
  value, 
  threshold, 
  icon: Icon, 
  color 
}: { 
  label: string
  value: number
  threshold: number
  icon: any
  color: string
}) => {
  const isHealthy = value >= threshold
  const colorClasses = {
    emerald: isHealthy ? 'text-emerald-600' : 'text-gray-400',
    blue: isHealthy ? 'text-blue-600' : 'text-gray-400',
    purple: isHealthy ? 'text-purple-600' : 'text-gray-400',
  }[color]

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center ${isHealthy ? `bg-${color}-50` : ''}`}>
          <Icon className={`w-3 h-3 ${colorClasses}`} />
        </div>
        <span className="text-xs text-gray-600">{label}</span>
      </div>
      {isHealthy ? (
        <CheckCircle2 className={`w-4 h-4 text-${color}-500`} />
      ) : (
        <AlertCircle className="w-4 h-4 text-gray-300" />
      )}
    </div>
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
    Other: 'bg-gray-100 text-gray-700',
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
    Other: 'bg-gray-400',
  }
  return colors[category] || colors.Other
}