import Link from 'next/link'

export default function ConfirmPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-slate-900">Check your email</h1>
            <p className="text-slate-600">
              We've sent you a confirmation link. Click it to verify your email and access your dashboard.
            </p>
          </div>

          {/* Steps */}
          <div className="mb-8 space-y-4 rounded-xl bg-slate-50 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">Check your inbox</h3>
                <p className="text-sm text-slate-600">Look for an email from Plantheory</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">Click the verification link</h3>
                <p className="text-sm text-slate-600">This will verify your email address</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">You're all set!</h3>
                <p className="text-sm text-slate-600">You'll be redirected to your dashboard automatically</p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 flex-shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900">Didn't receive the email?</h3>
                <p className="mt-1 text-sm text-blue-800">
                  Check your spam/junk folder. The email should arrive within a few minutes.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="flex w-full items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-900 transition-all hover:border-indigo-600 hover:bg-slate-50"
            >
              Back to Sign In
            </Link>
            <Link
              href="/"
              className="flex w-full items-center justify-center text-sm text-slate-600 transition-colors hover:text-indigo-600"
            >
              Go to Home
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            Need help?{' '}
            <a href="mailto:support@plantheory.com" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
