'use client'

import Link from 'next/link'

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          {/* Content */}
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold text-slate-900">Authentication Error</h1>
            <p className="mb-6 text-slate-600">
              Something went wrong during authentication. This could happen if the link expired or was already used.
            </p>

            {/* Possible causes */}
            <div className="mb-6 rounded-xl bg-slate-50 p-4 text-left">
              <p className="mb-2 text-sm font-medium text-slate-700">This might have happened because:</p>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>The confirmation link has expired</li>
                <li>The link was already used</li>
                <li>There was a network error</li>
                <li>The link was modified or incomplete</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/auth/signup"
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Create a new account
              </Link>
              <Link
                href="/auth/login"
                className="block w-full rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Try signing in again
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Still having trouble?{' '}
          <a href="mailto:support@plantheory.com" className="font-medium text-indigo-600 hover:text-indigo-500">
            Contact support
          </a>
        </p>
      </div>
    </div>
  )
}
