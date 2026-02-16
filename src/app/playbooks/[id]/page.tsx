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
  Calendar,
  Users,
  Sparkles,
  Zap,
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
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href="/playbooks"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Playbooks
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              {/* Category and Template Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryStyle(playbook.category)}`}>
                  {playbook.category}
                </span>
                {playbook.is_template && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                    <Sparkles className="w-3 h-3" />
                    Template
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-3">
                {playbook.title}
              </h1>

              {/* Description */}
              {playbook.description && (
                <p className="text-sm sm:text-base text-gray-500 mb-4 max-w-3xl leading-relaxed">
                  {playbook.description}
                </p>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Updated {formatDistanceToNow(playbook.updated_at)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {playbook.view_count || 0} view{playbook.view_count !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  {playbook.steps?.length || 0} step{playbook.steps?.length !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Created {formatDate(playbook.created_at)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <ShareButton playbookId={id} workspaceId={workspace.id} />
              <Link
                href={`/playbooks/${id}/edit`}
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
              >
                <Pencil className="w-4 h-4" />
                Edit Playbook
              </Link>
            </div>
          </div>
        </div>

        {/* Steps Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wider">
              Steps
            </h2>
            {playbook.steps && playbook.steps.length > 0 && (
              <span className="text-xs text-gray-400">
                {playbook.steps.length} total
              </span>
            )}
          </div>

          {playbook.steps && playbook.steps.length > 0 ? (
            <div className="space-y-3">
              {playbook.steps.map((step, index) => (
                <div
                  key={step.id}
                  className="group relative bg-white rounded-xl border border-gray-200 p-5 sm:p-6 hover:border-emerald-200 hover:shadow-md transition-all"
                >
                  {/* Progress Indicator */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-start gap-4">
                    {/* Step Number */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Step Title */}
                      <h3 className="text-base font-medium text-gray-900 mb-1">
                        {step.title}
                      </h3>

                      {/* Step Description */}
                      {step.description && (
                        <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                          {step.description}
                        </p>
                      )}

                      {/* Tools */}
                      {step.tools && step.tools.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {step.tools.map((tool) => (
                            <a
                              key={tool.id}
                              href={tool.url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors group/tool"
                            >
                              <Link2 className="w-3 h-3 text-gray-400" />
                              {tool.name}
                              <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover/tool:opacity-100 transition-opacity" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Completion Indicator */}
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="bg-white rounded-xl border border-gray-200 py-12 sm:py-16 text-center">
              <div className="inline-flex p-3 bg-gray-100 rounded-xl mb-4">
                <Layers className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">No steps yet</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                Add steps to make this playbook actionable and useful for your team.
              </p>
              <Link
                href={`/playbooks/${id}/edit`}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Add Steps
              </Link>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <FileText className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Created by</p>
                <p className="text-sm font-medium text-gray-700">
                  {user.user_metadata?.name || user.email?.split('@')[0] || 'You'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <DeletePlaybookButton playbookId={id} playbookTitle={playbook.title} />
              <Link
                href={`/playbooks/${id}/edit`}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Tip */}
        <div className="mt-6 bg-emerald-50 rounded-xl border border-emerald-200 p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Pro Tip</h4>
              <p className="text-xs text-gray-600">
                You can duplicate this playbook to use as a template for similar processes.
              </p>
            </div>
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
    Other: 'bg-gray-100 text-gray-700',
  }
  return styles[category] || styles.Other
}