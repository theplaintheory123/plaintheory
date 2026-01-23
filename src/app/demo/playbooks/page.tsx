import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/ui/DashboardLayout'
import Link from 'next/link'

export default async function PlaybooksPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Mock data for playbooks
  const playbooks = [
    {
      id: '1',
      title: 'Employee Onboarding Process',
      description: 'Complete guide for onboarding new team members',
      category: 'HR',
      owner: 'John Doe',
      updatedAt: '2 hours ago',
      steps: 12,
    },
    {
      id: '2',
      title: 'Customer Support Workflow',
      description: 'Standard operating procedures for handling customer inquiries',
      category: 'Support',
      owner: 'Jane Smith',
      updatedAt: '1 day ago',
      steps: 8,
    },
    {
      id: '3',
      title: 'Store Opening Checklist',
      description: 'Daily tasks for opening the store',
      category: 'Operations',
      owner: 'Mike Johnson',
      updatedAt: '3 days ago',
      steps: 15,
    },
    {
      id: '4',
      title: 'Monthly Financial Review',
      description: 'Steps for conducting monthly financial review',
      category: 'Finance',
      owner: 'Sarah Williams',
      updatedAt: '1 week ago',
      steps: 10,
    },
    {
      id: '5',
      title: 'Inventory Management',
      description: 'Guidelines for managing and tracking inventory',
      category: 'Operations',
      owner: 'Tom Brown',
      updatedAt: '2 weeks ago',
      steps: 7,
    },
  ]

  const categories = ['All', 'HR', 'Support', 'Operations', 'Finance', 'Marketing']

  return (
    <DashboardLayout user={user}>
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Playbooks</h1>
          <p className="mt-1 text-slate-600">
            Manage and organize your operational playbooks
          </p>
        </div>
        <Link
          href="/playbooks/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Playbook
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search playbooks..."
            className="w-full rounded-xl border-2 border-slate-200 bg-white py-2.5 pl-12 pr-4 text-slate-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((category) => (
            <button
              key={category}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                category === 'All'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Playbooks Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {playbooks.map((playbook) => (
          <Link
            key={playbook.id}
            href={`/playbooks/${playbook.id}`}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-lg"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-600 transition-transform group-hover:scale-110">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {playbook.category}
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 group-hover:text-indigo-600">
              {playbook.title}
            </h3>
            <p className="mb-4 text-sm text-slate-600 line-clamp-2">{playbook.description}</p>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600" />
                <span className="text-xs text-slate-600">{playbook.owner}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {playbook.steps} steps
                </span>
              </div>
            </div>
          </Link>
        ))}

        {/* Create New Card */}
        <Link
          href="/playbooks/new"
          className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition-all hover:border-indigo-400 hover:bg-indigo-50"
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-all group-hover:bg-indigo-100 group-hover:text-indigo-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="font-medium text-slate-600 group-hover:text-indigo-600">Create New Playbook</p>
        </Link>
      </div>
    </DashboardLayout>
  )
}
