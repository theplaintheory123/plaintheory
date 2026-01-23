import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/ui/DashboardLayout'
import Link from 'next/link'
import { getUserWorkspace, getRecentPlaybooks, getDashboardStats } from '@/lib/supabase/queries'
import { formatDistanceToNow } from '@/lib/utils/date'
import {
  BookOpen,
  Users,
  Eye,
  Plus,
  LayoutTemplate,
  UserPlus,
  Search,
  ArrowUpRight,
  TrendingUp,
  Clock,
  ChevronRight,
  Zap,
  Target,
  Sparkles,
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user's workspace
  const workspace = await getUserWorkspace(user.id)

  // Redirect to onboarding if no workspace
  if (!workspace) {
    redirect('/onboarding')
  }

  // Fetch dashboard data
  const [recentPlaybooks, stats] = await Promise.all([
    getRecentPlaybooks(workspace.id, 5),
    getDashboardStats(workspace.id),
  ])

  const firstName = user.user_metadata?.name?.split(' ')[0] || 'there'
  const greeting = getGreeting()

  return (
    <DashboardLayout user={user}>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {greeting}, {firstName}
            </h1>
            <p className="mt-1 text-slate-600">
              Here's what's happening with <span className="font-semibold text-slate-800">{workspace.name}</span> today.
            </p>
          </div>
          <Link
            href="/playbooks/new"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
          >
            <Plus className="h-4 w-4" />
            New Playbook
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500/10 to-blue-500/10 transition-transform group-hover:scale-150" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/30">
                <BookOpen className="h-6 w-6" />
              </span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                Active
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">Total Playbooks</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{stats.totalPlaybooks}</p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-violet-500/10 to-purple-500/10 transition-transform group-hover:scale-150" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30">
                <Users className="h-6 w-6" />
              </span>
              <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                <Zap className="h-3 w-3" />
                Team
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">Team Members</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{stats.totalMembers}</p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-lg sm:col-span-2 lg:col-span-1">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 transition-transform group-hover:scale-150" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30">
                <Eye className="h-6 w-6" />
              </span>
              <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600">
                <Target className="h-3 w-3" />
                Engaged
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">Total Views</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{stats.totalViews}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Zap className="h-5 w-5 text-amber-500" />
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/playbooks/new"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-110">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-indigo-600">New Playbook</p>
              <p className="text-sm text-slate-500">Create a new process</p>
            </div>
          </Link>

          <Link
            href="/templates"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-purple-200 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25 transition-transform group-hover:scale-110">
              <LayoutTemplate className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-purple-600">Browse Templates</p>
              <p className="text-sm text-slate-500">Start from a template</p>
            </div>
          </Link>

          <Link
            href="/settings?tab=team"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-emerald-200 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 transition-transform group-hover:scale-110">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-emerald-600">Invite Team</p>
              <p className="text-sm text-slate-500">Add team members</p>
            </div>
          </Link>

          <Link
            href="/search"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-orange-200 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25 transition-transform group-hover:scale-110">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-orange-600">Search</p>
              <p className="text-sm text-slate-500">Find any playbook</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Playbooks */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Clock className="h-5 w-5 text-slate-400" />
            Recent Playbooks
          </h2>
          <Link
            href="/playbooks"
            className="group inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View all
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {recentPlaybooks.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {recentPlaybooks.map((playbook, index) => (
                <li key={playbook.id}>
                  <Link
                    href={`/playbooks/${playbook.id}`}
                    className="group flex items-center justify-between px-6 py-4 transition-all hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 text-slate-600 ring-1 ring-slate-200/80 transition-all group-hover:from-indigo-100 group-hover:to-blue-50 group-hover:text-indigo-600 group-hover:ring-indigo-200">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 group-hover:text-indigo-600">
                          {playbook.title}
                        </p>
                        <p className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="h-3.5 w-3.5" />
                          Updated {formatDistanceToNow(playbook.updated_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(playbook.category)}`}>
                        {playbook.category}
                      </span>
                      <ChevronRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 text-slate-400 ring-1 ring-slate-200/80">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">No playbooks yet</h3>
              <p className="mb-6 text-sm text-slate-600">Create your first playbook to get started</p>
              <Link
                href="/playbooks/new"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl"
              >
                <Plus className="h-4 w-4" />
                Create Playbook
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Getting Started Guide */}
      {stats.totalPlaybooks === 0 && (
        <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-semibold text-slate-900">Getting Started</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/30">
                1
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Create a playbook</h3>
                <p className="mt-1 text-sm text-slate-600">Document your first operational process</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/30">
                2
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Add your team</h3>
                <p className="mt-1 text-sm text-slate-600">Invite colleagues to collaborate</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/30">
                3
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Share & execute</h3>
                <p className="mt-1 text-sm text-slate-600">Use playbooks in daily operations</p>
              </div>
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

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    HR: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200/50',
    Operations: 'bg-purple-100 text-purple-700 ring-1 ring-purple-200/50',
    Support: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200/50',
    Finance: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200/50',
    Marketing: 'bg-pink-100 text-pink-700 ring-1 ring-pink-200/50',
    Sales: 'bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200/50',
    Other: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200/50',
  }
  return colors[category] || colors.Other
}
