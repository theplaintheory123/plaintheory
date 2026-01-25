import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import DashboardLayout from '@/components/ui/DashboardLayout'
import Link from 'next/link'
import { getPlaybook, getUserWorkspace } from '@/lib/supabase/queries'
import { formatDate, formatDistanceToNow } from '@/lib/utils/date'
import { DeletePlaybookButton } from './DeletePlaybookButton'
import { ShareButton } from './ShareButton'
import {
  ChevronLeft,
  Pencil,
  Clock,
  Eye,
  ExternalLink,
  Link2,
  Check,
  FileText,
  ArrowRight,
  Layers,
  MoreHorizontal,
  Copy,
  Trash2,
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

  if (playbook.workspace_id !== workspace.id) {
    notFound()
  }

  return (
    <DashboardLayout user={user}>
      {/* Back link */}
      <Link
        href="/playbooks"
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        Back to Playbooks
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${getCategoryStyle(playbook.category)}`}>
                {playbook.category}
              </span>
              {playbook.is_template && (
                <span className="rounded-md bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700">
                  Template
                </span>
              )}
            </div>
            <h1 className="text-[24px] font-semibold tracking-tight text-neutral-900">{playbook.title}</h1>
            {playbook.description && (
              <p className="mt-2 text-[15px] text-neutral-500 leading-relaxed">{playbook.description}</p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] text-neutral-500">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" strokeWidth={2} />
                Updated {formatDistanceToNow(playbook.updated_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" strokeWidth={2} />
                {playbook.view_count || 0} views
              </span>
              <span className="flex items-center gap-1.5">
                <Layers className="h-4 w-4" strokeWidth={2} />
                {playbook.steps?.length || 0} steps
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShareButton playbookId={id} workspaceId={workspace.id} />
            <Link
              href={`/playbooks/${id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-neutral-800 active:scale-[0.98]"
            >
              <Pencil className="h-4 w-4" strokeWidth={2} />
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="mb-8">
        <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-neutral-400">
          Steps
        </h2>

        {playbook.steps && playbook.steps.length > 0 ? (
          <div className="space-y-3">
            {playbook.steps.map((step, index) => (
              <div
                key={step.id}
                className="group rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:border-neutral-300 hover:shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-[13px] font-semibold text-white">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-medium text-neutral-900">{step.title}</h3>
                    {step.description && (
                      <p className="mt-1.5 text-[14px] text-neutral-500 leading-relaxed">{step.description}</p>
                    )}

                    {step.tools && step.tools.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {step.tools.map((tool) => (
                          <a
                            key={tool.id}
                            href={tool.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/tool inline-flex items-center gap-1.5 rounded-lg bg-neutral-50 px-3 py-2 text-[13px] font-medium text-neutral-700 ring-1 ring-neutral-200 transition-all hover:bg-neutral-100 hover:ring-neutral-300"
                          >
                            <Link2 className="h-3.5 w-3.5 text-neutral-400" strokeWidth={2} />
                            {tool.name}
                            <ExternalLink className="h-3 w-3 text-neutral-400 transition-colors group-hover/tool:text-neutral-600" strokeWidth={2} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-neutral-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-100">
              <Layers className="h-7 w-7 text-neutral-400" strokeWidth={1.5} />
            </div>
            <h3 className="mb-1 text-[15px] font-medium text-neutral-900">No steps yet</h3>
            <p className="mb-5 text-[13px] text-neutral-500">Add steps to make this playbook actionable</p>
            <Link
              href={`/playbooks/${id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-neutral-800"
            >
              <Pencil className="h-4 w-4" strokeWidth={2} />
              Add Steps
            </Link>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-neutral-500">
            Created {formatDate(playbook.created_at)}
          </p>
          <div className="flex items-center gap-2">
            <DeletePlaybookButton playbookId={id} playbookTitle={playbook.title} />
            <Link
              href={`/playbooks/${id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-neutral-800 active:scale-[0.98]"
            >
              <Pencil className="h-4 w-4" strokeWidth={2} />
              Edit Playbook
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
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
