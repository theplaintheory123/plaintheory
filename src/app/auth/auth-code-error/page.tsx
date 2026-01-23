import Link from 'next/link'

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-orange-100">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-slate-900">Verification Failed</h1>
            <p className="text-slate-600">
              We couldn't verify your email address. The link may have expired or already been used.
            </p>
          </div>

          {/* Possible Issues */}
          <div className="mb-8 space-y-3 rounded-xl bg-slate-50 p-6">
            <h3 className="font-semibold text-slate-900">Possible reasons:</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-slate-400">•</span>
                <span>The verification link has expired</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400">•</span>
                <span>The link has already been used</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400">•</span>
                <span>The link was copied incorrectly</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/auth/signup"
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/40"
            >
              Try Signing Up Again
            </Link>
            <Link
              href="/auth/login"
              className="flex w-full items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-900 transition-all hover:border-slate-300 hover:bg-slate-50"
            >
              Go to Sign In
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            Still having issues?{' '}
            <a href="mailto:support@plantheory.com" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
