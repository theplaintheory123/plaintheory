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
  Layers,
  ArrowUpRight,
  Clock,
  FileText,
  Sparkles,
  TrendingUp,
  UserPlus,
  ArrowRight,
  CheckCircle,
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

  const workspace = await getUserWorkspace(user.id)
  if (!workspace) {
    redirect('/onboarding')
  }

  const [recentPlaybooks, stats] = await Promise.all([
    getRecentPlaybooks(workspace.id, 5),
    getDashboardStats(workspace.id),
  ])

  const firstName = user.user_metadata?.name?.split(' ')[0] || 'there'
  const greeting = getGreeting()

  return (
    <DashboardLayout user={user}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tight text-neutral-900">
              {greeting}, {firstName}
            </h1>
            <p className="mt-1 text-[15px] text-neutral-500">
              Welcome back to <span className="font-medium text-neutral-700">{workspace.name}</span>
            </p>
          </div>
          <Link
            href="/playbooks/new"
            className="hidden items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-neutral-800 active:scale-[0.98] sm:inline-flex"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            New Playbook
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Playbooks */}
        <div className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] font-medium text-neutral-500">Total Playbooks</p>
              <p className="mt-2 text-[32px] font-semibold tracking-tight text-neutral-900">{stats.totalPlaybooks}</p>
              <p className="mt-1 flex items-center gap-1 text-[12px] text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                Active
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3">
              <BookOpen className="h-6 w-6 text-blue-600" strokeWidth={1.5} />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {/* Team Members */}
        <div className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] font-medium text-neutral-500">Team Members</p>
              <p className="mt-2 text-[32px] font-semibold tracking-tight text-neutral-900">{stats.totalMembers}</p>
              <p className="mt-1 flex items-center gap-1 text-[12px] text-violet-600">
                <Users className="h-3 w-3" />
                Collaborating
              </p>
            </div>
            <div className="rounded-xl bg-violet-50 p-3">
              <Users className="h-6 w-6 text-violet-600" strokeWidth={1.5} />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-violet-500 to-violet-600 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {/* Total Views */}
        <div className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 hover:shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] font-medium text-neutral-500">Total Views</p>
              <p className="mt-2 text-[32px] font-semibold tracking-tight text-neutral-900">{stats.totalViews}</p>
              <p className="mt-1 flex items-center gap-1 text-[12px] text-amber-600">
                <Eye className="h-3 w-3" />
                All time
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3">
              <Eye className="h-6 w-6 text-amber-600" strokeWidth={1.5} />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-neutral-400">
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/playbooks/new"
            className="group flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-neutral-300 hover:shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-neutral-900 text-white transition-transform group-hover:scale-105">
              <Plus className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-medium text-neutral-900">Create Playbook</p>
              <p className="text-[12px] text-neutral-500">Document a new process</p>
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-300 transition-all group-hover:translate-x-0.5 group-hover:text-neutral-500" />
          </Link>

          <Link
            href="/templates"
            className="group flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-neutral-300 hover:shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white transition-transform group-hover:scale-105">
              <Layers className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-medium text-neutral-900">Use Template</p>
              <p className="text-[12px] text-neutral-500">Start with a template</p>
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-300 transition-all group-hover:translate-x-0.5 group-hover:text-neutral-500" />
          </Link>

          <Link
            href="/settings?tab=team"
            className="group flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-neutral-300 hover:shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white transition-transform group-hover:scale-105">
              <UserPlus className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-medium text-neutral-900">Invite Team</p>
              <p className="text-[12px] text-neutral-500">Add collaborators</p>
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-300 transition-all group-hover:translate-x-0.5 group-hover:text-neutral-500" />
          </Link>
        </div>
      </div>

      {/* Recent Playbooks */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-neutral-400">
            Recent Playbooks
          </h2>
          <Link
            href="/playbooks"
            className="flex items-center gap-1 text-[13px] font-medium text-neutral-600 transition-colors hover:text-neutral-900"
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentPlaybooks.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            {recentPlaybooks.map((playbook, index) => (
              <Link
                key={playbook.id}
                href={`/playbooks/${playbook.id}`}
                className={`group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-neutral-50 ${
                  index !== recentPlaybooks.length - 1 ? 'border-b border-neutral-100' : ''
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 transition-colors group-hover:bg-neutral-200">
                  <FileText className="h-5 w-5 text-neutral-600" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[14px] font-medium text-neutral-900">{playbook.title}</p>
                  <p className="flex items-center gap-1.5 text-[12px] text-neutral-500">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(playbook.updated_at)}
                  </p>
                </div>
                <span className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${getCategoryStyle(playbook.category)}`}>
                  {playbook.category}
                </span>
                <ArrowUpRight className="h-4 w-4 text-neutral-300 opacity-0 transition-all group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-neutral-200 bg-white px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-100">
              <BookOpen className="h-7 w-7 text-neutral-400" strokeWidth={1.5} />
            </div>
            <h3 className="mb-1 text-[15px] font-medium text-neutral-900">No playbooks yet</h3>
            <p className="mb-5 text-[13px] text-neutral-500">Create your first playbook to get started</p>
            <Link
              href="/playbooks/new"
              className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-neutral-800"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Create Playbook
            </Link>
          </div>
        )}
      </div>

      {/* Getting Started Card */}
      {stats.totalPlaybooks === 0 && (
        <div className="overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-violet-50">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/20">
                <Sparkles className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] font-semibold text-neutral-900">Getting Started with Plaintheory</h3>
                <p className="mt-1 text-[13px] text-neutral-600">
                  Follow these steps to set up your workspace and start documenting your processes.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-[12px] font-semibold text-white">
                  1
                </div>
                <div>
                  <p className="text-[13px] font-medium text-neutral-900">Create your first playbook</p>
                  <p className="mt-0.5 text-[12px] text-neutral-500">Document an operational process</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-violet-600 text-[12px] font-semibold text-white">
                  2
                </div>
                <div>
                  <p className="text-[13px] font-medium text-neutral-900">Invite your team</p>
                  <p className="mt-0.5 text-[12px] text-neutral-500">Collaborate with colleagues</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[12px] font-semibold text-white">
                  3
                </div>
                <div>
                  <p className="text-[13px] font-medium text-neutral-900">Share & execute</p>
                  <p className="mt-0.5 text-[12px] text-neutral-500">Use playbooks in operations</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-100 bg-blue-50/50 px-6 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/playbooks/new"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Create First Playbook
              </Link>
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-[13px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
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
    Other: 'bg-neutral-100 text-neutral-700',
  }
  return styles[category] || styles.Other
}
