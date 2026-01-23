'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Content */}
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold text-slate-900">Check your email</h1>
            <p className="mb-6 text-slate-600">
              We&apos;ve sent a confirmation link to{' '}
              {email ? (
                <span className="font-medium text-slate-900">{email}</span>
              ) : (
                'your email address'
              )}
              . Click the link in the email to verify your account.
            </p>

            {/* Instructions */}
            <div className="mb-6 rounded-xl bg-slate-50 p-4 text-left">
              <p className="mb-2 text-sm font-medium text-slate-700">Didn&apos;t receive the email?</p>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>Check your spam folder</li>
                <li>Make sure your email address is correct</li>
                <li>Wait a few minutes and try again</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/auth/signup"
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Try a different email
              </Link>
              <Link
                href="/auth/login"
                className="block w-full rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Need help?{' '}
          <a href="mailto:support@plantheory.com" className="font-medium text-indigo-600 hover:text-indigo-500">
            Contact support
          </a>
        </p>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailContent />
    </Suspense>
  )
}
