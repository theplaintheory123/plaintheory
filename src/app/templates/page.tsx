import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/ui/DashboardLayout'
import Link from 'next/link'

export default async function TemplatesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const templates = [
    {
      id: 'restaurant-opening',
      title: 'Restaurant Opening Checklist',
      description: 'Daily tasks for opening a restaurant including kitchen prep, front-of-house setup, and safety checks.',
      category: 'Restaurant',
      steps: 15,
      uses: 234,
    },
    {
      id: 'restaurant-closing',
      title: 'Restaurant Closing Procedures',
      description: 'End of day tasks including cleaning, cash reconciliation, and security protocols.',
      category: 'Restaurant',
      steps: 12,
      uses: 189,
    },
    {
      id: 'employee-onboarding',
      title: 'Employee Onboarding',
      description: 'Comprehensive checklist for bringing new team members up to speed.',
      category: 'HR',
      steps: 18,
      uses: 567,
    },
    {
      id: 'customer-complaint',
      title: 'Customer Complaint Resolution',
      description: 'Step-by-step guide for handling and resolving customer complaints professionally.',
      category: 'Support',
      steps: 8,
      uses: 423,
    },
    {
      id: 'inventory-management',
      title: 'Weekly Inventory Check',
      description: 'Process for conducting weekly inventory counts and reorder management.',
      category: 'Operations',
      steps: 10,
      uses: 312,
    },
    {
      id: 'social-media-post',
      title: 'Social Media Content Publishing',
      description: 'Workflow for creating, reviewing, and publishing social media content.',
      category: 'Marketing',
      steps: 7,
      uses: 156,
    },
    {
      id: 'client-onboarding',
      title: 'Client Onboarding Process',
      description: 'Guide for onboarding new clients including contracts, kickoff, and setup.',
      category: 'Sales',
      steps: 14,
      uses: 278,
    },
    {
      id: 'monthly-reporting',
      title: 'Monthly Financial Reporting',
      description: 'Checklist for preparing and distributing monthly financial reports.',
      category: 'Finance',
      steps: 11,
      uses: 198,
    },
  ]

  const categories = ['All', 'Restaurant', 'HR', 'Support', 'Operations', 'Marketing', 'Sales', 'Finance']

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Restaurant: 'bg-orange-100 text-orange-700',
      HR: 'bg-blue-100 text-blue-700',
      Support: 'bg-green-100 text-green-700',
      Operations: 'bg-purple-100 text-purple-700',
      Marketing: 'bg-pink-100 text-pink-700',
      Sales: 'bg-cyan-100 text-cyan-700',
      Finance: 'bg-yellow-100 text-yellow-700',
    }
    return colors[category] || 'bg-slate-100 text-slate-700'
  }

  return (
    <DashboardLayout user={user}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Templates</h1>
        <p className="mt-1 text-slate-600">
          Start with pre-built playbook templates for common business processes
        </p>
      </div>

      {/* Category Filters */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
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

      {/* Featured Template */}
      <div className="mb-8 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Most Popular
            </div>
            <h2 className="mb-2 text-2xl font-bold text-slate-900">Employee Onboarding</h2>
            <p className="mb-4 text-slate-600">
              The most comprehensive onboarding template used by 500+ companies. Covers everything from paperwork to first week activities.
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                18 steps
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                567 uses
              </span>
            </div>
          </div>
          <Link
            href="/playbooks/new?template=employee-onboarding"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 hover:shadow-xl"
          >
            Use Template
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-lg"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-600 transition-transform group-hover:scale-110">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(template.category)}`}>
                {template.category}
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 group-hover:text-indigo-600">
              {template.title}
            </h3>
            <p className="mb-4 text-sm text-slate-600 line-clamp-2">{template.description}</p>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {template.steps} steps
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {template.uses} uses
                </span>
              </div>
              <Link
                href={`/playbooks/new?template=${template.id}`}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Use
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Request Template */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-900">Need a specific template?</h3>
        <p className="mb-4 text-slate-600">
          Can't find what you're looking for? Request a template and we'll create it for you.
        </p>
        <button className="rounded-xl border-2 border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
          Request Template
        </button>
      </div>
    </DashboardLayout>
  )
}
