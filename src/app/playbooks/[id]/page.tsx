import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import DashboardLayout from '@/components/ui/DashboardLayout'
import Link from 'next/link'
import { getPlaybook, getUserWorkspace } from '@/lib/supabase/queries'
import { formatDate, formatDistanceToNow } from '@/lib/utils/date'
import { DeletePlaybookButton } from './DeletePlaybookButton'
import { ShareButton } from './ShareButton'
import {
  BookOpen,
  ChevronRight,
  Pencil,
  Clock,
  Calendar,
  Eye,
  ClipboardList,
  ExternalLink,
  Wrench,
  User,
  CheckCircle2,
  ArrowLeft,
  Share2,
  MoreHorizontal,
} from 'lucide-react'

type Props = {
  params: Promise<{ id: string }>
}

export default async function PlaybookViewPage({ params }: Props) {
  const { id } = await params
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

  const playbook = await getPlaybook(id)

  if (!playbook) {
    notFound()
  }

  // Verify playbook belongs to user's workspace
  if (playbook.workspace_id !== workspace.id) {
    notFound()
  }

  return (
    <DashboardLayout user={user}>
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm">
        <Link
          href="/playbooks"
          className="group flex items-center gap-1 text-slate-500 transition-colors hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Playbooks
        </Link>
        <ChevronRight className="h-4 w-4 text-slate-300" />
        <span className="max-w-xs truncate font-medium text-slate-900">{playbook.title}</span>
      </nav>

      {/* Header Card */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600 px-6 py-8">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi0yLTQgMi00IDItNCAyIDIgMiA0LTIgNC0yIDQgMiAyIDIgNC0yIDQtMiA0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
          <div className="relative">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getCategoryColorLight(playbook.category)}`}>
                {playbook.category}
              </span>
              {playbook.is_template && (
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  Template
                </span>
              )}
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">{playbook.title}</h1>
            {playbook.description && (
              <p className="max-w-2xl text-indigo-100">{playbook.description}</p>
            )}
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-[11px] font-bold text-white ring-2 ring-white">
                  {playbook.owner?.full_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Owner</span>
                  <span className="font-medium text-slate-900">
                    {playbook.owner?.full_name || 'Unknown'}
                  </span>
                </div>
              </div>
              <div className="hidden h-8 w-px bg-slate-200 sm:block" />
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(playbook.created_at)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock className="h-4 w-4" />
                <span>{formatDistanceToNow(playbook.updated_at)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <ClipboardList className="h-4 w-4" />
                <span>{playbook.steps?.length || 0} steps</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Eye className="h-4 w-4" />
                <span>{playbook.view_count || 0} views</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ShareButton playbookId={id} workspaceId={workspace.id} />
              <Link
                href={`/playbooks/${id}/edit`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-900">Steps</h2>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600">
            {playbook.steps?.length || 0}
          </span>
        </div>

        {playbook.steps && playbook.steps.length > 0 ? (
          <div className="space-y-4">
            {playbook.steps.map((step, index) => (
              <div
                key={step.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:shadow-md"
              >
                {/* Progress indicator line */}
                {index < (playbook.steps?.length || 0) - 1 && (
                  <div className="absolute bottom-0 left-[43px] top-[72px] w-0.5 bg-gradient-to-b from-indigo-200 to-slate-200" />
                )}

                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-lg font-bold text-white shadow-lg shadow-indigo-500/30">
                      {index + 1}
                      <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-slate-900">{step.title}</h3>
                      {step.description && (
                        <p className="text-slate-600 leading-relaxed">{step.description}</p>
                      )}

                      {/* Tools */}
                      {step.tools && step.tools.length > 0 && (
                        <div className="mt-4 rounded-xl bg-slate-50 p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <Wrench className="h-4 w-4 text-slate-400" />
                            <p className="text-sm font-medium text-slate-600">Tools & Resources</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {step.tools.map((tool) => (
                              <a
                                key={tool.id}
                                href={tool.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/tool inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200/80 transition-all hover:bg-indigo-50 hover:text-indigo-700 hover:ring-indigo-200"
                              >
                                <ExternalLink className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover/tool:text-indigo-500" />
                                {tool.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200/80 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 text-slate-400 ring-1 ring-slate-200/80">
              <ClipboardList className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">No steps yet</h3>
            <p className="mb-6 text-sm text-slate-600">Add steps to document your process</p>
            <Link
              href={`/playbooks/${id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl"
            >
              <Pencil className="h-4 w-4" />
              Add Steps
            </Link>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock className="h-4 w-4" />
          <span>Last updated {formatDistanceToNow(playbook.updated_at)}</span>
        </div>
        <div className="flex items-center gap-3">
          <DeletePlaybookButton playbookId={id} playbookTitle={playbook.title} />
          <Link
            href={`/playbooks/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl"
          >
            <Pencil className="h-4 w-4" />
            Edit Playbook
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
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

function getCategoryColorLight(category: string) {
  const colors: Record<string, string> = {
    HR: 'bg-blue-500/20 text-white',
    Operations: 'bg-purple-500/20 text-white',
    Support: 'bg-emerald-500/20 text-white',
    Finance: 'bg-amber-500/20 text-white',
    Marketing: 'bg-pink-500/20 text-white',
    Sales: 'bg-cyan-500/20 text-white',
    Other: 'bg-white/20 text-white',
  }
  return colors[category] || colors.Other
}
