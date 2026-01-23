export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 shadow-lg">
                <span className="text-xl font-bold text-white">P</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">Plantheory</span>
            </div>
            <div className="hidden items-center gap-8 md:flex">
              <a href="#features" className="text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600">Features</a>
              <a href="#solutions" className="text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600">Solutions</a>
              <a href="#pricing" className="text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600">Pricing</a>
              <a href="#contact" className="text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600">Contact</a>
            </div>
            <div className="flex items-center gap-4">
              <button className="hidden text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600 md:block">
                Sign In
              </button>
              <button className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-32 lg:pt-40">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Trusted by 500+ growing businesses
            </div>
            <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Transform Operational <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Chaos into Clarity</span>
            </h1>
            <p className="mb-10 text-xl leading-relaxed text-slate-600 sm:text-2xl">
              The enterprise-grade platform that centralizes your operational knowledge, streamlines processes, and empowers your team to execute with precision.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button className="group rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/40">
                Start Free 30-Day Trial
                <svg className="ml-2 inline-block h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button className="rounded-xl border-2 border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-900 shadow-lg transition-all hover:border-indigo-600 hover:bg-slate-50">
                Schedule Demo
              </button>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              No credit card required • Full access to all features • Cancel anytime
            </p>
          </div>

          {/* Hero Visual - Enhanced */}
          <div className="mx-auto mt-20 max-w-6xl">
            <div className="relative rounded-2xl border border-slate-300 bg-gradient-to-b from-slate-100 to-white p-2 shadow-2xl sm:p-4">
              <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-indigo-200 opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-4 -right-4 h-72 w-72 rounded-full bg-blue-200 opacity-20 blur-3xl"></div>
              <div className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 p-8 shadow-inner">
                <div className="flex h-full flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                    <div className="ml-4 h-8 flex-1 rounded-md bg-slate-700/50"></div>
                  </div>
                  <div className="flex flex-1 gap-4">
                    <div className="w-1/4 space-y-3">
                      <div className="h-10 rounded-lg bg-indigo-500/30"></div>
                      <div className="h-8 rounded-lg bg-slate-700/50"></div>
                      <div className="h-8 rounded-lg bg-slate-700/50"></div>
                      <div className="h-8 rounded-lg bg-slate-700/50"></div>
                    </div>
                    <div className="flex-1 space-y-4 rounded-xl bg-slate-800/50 p-6">
                      <div className="h-10 w-3/4 rounded-lg bg-indigo-500/40"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-full rounded bg-slate-700/50"></div>
                        <div className="h-4 w-full rounded bg-slate-700/50"></div>
                        <div className="h-4 w-5/6 rounded bg-slate-700/50"></div>
                      </div>
                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="h-20 rounded-lg bg-slate-700/30"></div>
                        <div className="h-20 rounded-lg bg-slate-700/30"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mx-auto mt-20 max-w-5xl">
            <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-slate-500">
              Trusted by Industry Leaders
            </p>
            <div className="grid grid-cols-2 gap-8 opacity-50 grayscale md:grid-cols-4">
              <div className="flex items-center justify-center">
                <div className="h-8 w-32 rounded bg-slate-300"></div>
              </div>
              <div className="flex items-center justify-center">
                <div className="h-8 w-32 rounded bg-slate-300"></div>
              </div>
              <div className="flex items-center justify-center">
                <div className="h-8 w-32 rounded bg-slate-300"></div>
              </div>
              <div className="flex items-center justify-center">
                <div className="h-8 w-32 rounded bg-slate-300"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-indigo-600">98%</div>
              <div className="text-sm font-medium text-slate-600">Time Saved on Onboarding</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-indigo-600">500+</div>
              <div className="text-sm font-medium text-slate-600">Active Companies</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-indigo-600">50K+</div>
              <div className="text-sm font-medium text-slate-600">Playbooks Created</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-indigo-600">24/7</div>
              <div className="text-sm font-medium text-slate-600">Enterprise Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section - Enhanced */}
      <section className="bg-slate-50 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-block rounded-full bg-red-100 px-4 py-1 text-sm font-semibold text-red-700">
              The Challenge
            </div>
            <h2 className="mb-6 text-4xl font-bold text-slate-900 sm:text-5xl">
              Operational Inefficiencies Cost Your Business
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600">
              Without a centralized operational system, your organization faces critical challenges that impact productivity, revenue, and growth potential.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ),
                title: "Repetitive Training Cycles",
                description: "Your team wastes hours explaining the same processes to every new hire, draining productivity and delaying time-to-value.",
                impact: "40% of manager time wasted"
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Knowledge Silos",
                description: "Critical operational intelligence locked in key employees' minds creates single points of failure and succession risks.",
                impact: "High business continuity risk"
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: "Fragmented Documentation",
                description: "SOPs scattered across multiple platforms make information retrieval time-consuming and inconsistent.",
                impact: "20 minutes lost per lookup"
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Tool Stack Confusion",
                description: "Employees struggle to identify correct tools and vendors for specific tasks, leading to costly mistakes and redundant purchases.",
                impact: "15% unnecessary tool spending"
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Vendor Management Gaps",
                description: "Missed renewals, lost contracts, and unclear ownership create financial leakage and operational disruptions.",
                impact: "$10K+ in renewal overruns"
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                ),
                title: "Revenue Leakage",
                description: "Operational inefficiencies compound into significant revenue loss through errors, delays, and poor customer experiences.",
                impact: "5-10% revenue impact"
              }
            ].map((problem, index) => (
              <div key={index} className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-indigo-200 hover:shadow-xl">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-red-50 to-orange-50 text-red-600 transition-all group-hover:scale-110">
                  {problem.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">{problem.title}</h3>
                <p className="mb-4 leading-relaxed text-slate-600">{problem.description}</p>
                <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {problem.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section - Enhanced */}
      <section id="features" className="scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700">
              The Solution
            </div>
            <h2 className="mb-6 text-4xl font-bold text-slate-900 sm:text-5xl">
              Your Enterprise Operational Command Center
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600">
              Plantheory provides a unified platform that transforms how your organization documents, accesses, and executes operational knowledge.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-8">
              <div className="group">
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-3xl shadow-lg shadow-indigo-500/30 transition-all group-hover:scale-110">
                    📚
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-3 text-2xl font-bold text-slate-900">Operational Playbooks</h3>
                    <p className="mb-4 text-lg leading-relaxed text-slate-600">
                      Create comprehensive, step-by-step playbooks for every critical process. From customer onboarding to incident response, ensure consistent execution across your organization.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-slate-700">
                        <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Rich text editor with multimedia support
                      </li>
                      <li className="flex items-center gap-2 text-slate-700">
                        <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Version control and change tracking
                      </li>
                      <li className="flex items-center gap-2 text-slate-700">
                        <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Role-based ownership and accountability
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-3xl shadow-lg shadow-blue-500/30 transition-all group-hover:scale-110">
                    🔧
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-3 text-2xl font-bold text-slate-900">Unified Tool Directory</h3>
                    <p className="mb-4 text-lg leading-relaxed text-slate-600">
                      Centralize all tools, software, and services in one searchable directory. Eliminate confusion and ensure teams use the right tools for the job.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-slate-700">
                        <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Categorized tool catalog with access links
                      </li>
                      <li className="flex items-center gap-2 text-slate-700">
                        <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Usage guidelines and best practices
                      </li>
                      <li className="flex items-center gap-2 text-slate-700">
                        <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Direct integration with playbooks
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-3xl shadow-lg shadow-purple-500/30 transition-all group-hover:scale-110">
                    📊
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-3 text-2xl font-bold text-slate-900">Vendor Management System</h3>
                    <p className="mb-4 text-lg leading-relaxed text-slate-600">
                      Track all vendor relationships, contracts, and renewals in one place. Automated reminders ensure you never miss critical dates.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-slate-700">
                        <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Contract timeline tracking
                      </li>
                      <li className="flex items-center gap-2 text-slate-700">
                        <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Automated renewal notifications
                      </li>
                      <li className="flex items-center gap-2 text-slate-700">
                        <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Cost tracking and budget alerts
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-3xl shadow-lg shadow-green-500/30 transition-all group-hover:scale-110">
                    🔍
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-3 text-2xl font-bold text-slate-900">Intelligent Search</h3>
                    <p className="mb-4 text-lg leading-relaxed text-slate-600">
                      Find any process, tool, or vendor instantly with powerful search capabilities. AI-powered suggestions surface relevant content as you type.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-slate-700">
                        <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Full-text search across all content
                      </li>
                      <li className="flex items-center gap-2 text-slate-700">
                        <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Smart filters and faceted search
                      </li>
                      <li className="flex items-center gap-2 text-slate-700">
                        <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Recently accessed shortcuts
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 p-8 shadow-2xl lg:p-12">
                <div className="space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-3 w-3 animate-pulse rounded-full bg-green-400"></div>
                      <div className="h-4 w-48 rounded bg-white/20"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 w-full rounded bg-white/10"></div>
                      <div className="h-3 w-full rounded bg-white/10"></div>
                      <div className="h-3 w-4/5 rounded bg-white/10"></div>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <div className="h-8 flex-1 rounded-lg bg-indigo-500/30"></div>
                      <div className="h-8 flex-1 rounded-lg bg-white/10"></div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-blue-400"></div>
                      <div className="h-4 w-40 rounded bg-white/20"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-20 rounded-lg bg-white/10"></div>
                      <div className="h-20 rounded-lg bg-white/10"></div>
                      <div className="h-20 rounded-lg bg-white/10"></div>
                      <div className="h-20 rounded-lg bg-white/10"></div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="h-4 w-32 rounded bg-white/20"></div>
                      <div className="h-6 w-16 rounded-full bg-purple-500/30 px-2 py-1"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-32 rounded bg-white/10"></div>
                        <div className="h-3 w-20 rounded bg-white/10"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-28 rounded bg-white/10"></div>
                        <div className="h-3 w-24 rounded bg-white/10"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="solutions" className="scroll-mt-20 bg-slate-50 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-slate-900 sm:text-5xl">
              Built for Your Industry
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600">
              Tailored solutions for businesses that demand operational excellence
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                icon: "🍽️",
                title: "Restaurants & Hospitality",
                description: "Standardize service protocols, kitchen procedures, and training materials across all locations.",
                features: ["Opening/closing procedures", "Recipe standardization", "Health & safety compliance", "Staff training programs"]
              },
              {
                icon: "🏥",
                title: "Healthcare & Clinics",
                description: "Ensure consistent patient care with documented clinical workflows and administrative procedures.",
                features: ["Patient intake workflows", "Treatment protocols", "Equipment maintenance", "Regulatory compliance"]
              },
              {
                icon: "🎨",
                title: "Agencies & Professional Services",
                description: "Streamline client onboarding, project delivery, and knowledge transfer across your team.",
                features: ["Client onboarding process", "Project templates", "Quality assurance", "Resource allocation"]
              },
              {
                icon: "🚀",
                title: "Technology & Startups",
                description: "Scale your operations with documented engineering, customer success, and go-to-market playbooks.",
                features: ["Engineering workflows", "Customer success playbooks", "Sales processes", "Incident response"]
              }
            ].map((useCase, index) => (
              <div key={index} className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-indigo-300 hover:shadow-xl">
                <div className="mb-4 text-5xl">{useCase.icon}</div>
                <h3 className="mb-3 text-2xl font-bold text-slate-900">{useCase.title}</h3>
                <p className="mb-6 text-lg text-slate-600">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-700">
                      <svg className="h-5 w-5 flex-shrink-0 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-slate-900 sm:text-5xl">
              Trusted by Operations Leaders
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                quote: "Plantheory reduced our onboarding time from 3 weeks to 5 days. It's transformed how we scale.",
                author: "Sarah Chen",
                role: "COO, TechScale Solutions",
                company: "150 employees"
              },
              {
                quote: "We finally have one source of truth for all our operations. No more hunting through Slack or Google Docs.",
                author: "Michael Rodriguez",
                role: "Operations Director, HealthFirst Clinics",
                company: "8 locations"
              },
              {
                quote: "The ROI was immediate. We eliminated duplicate tool subscriptions worth $15K annually in the first month.",
                author: "Emma Thompson",
                role: "Head of Operations, Creative Agency Co",
                company: "45 employees"
              }
            ].map((testimonial, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-6 text-lg italic leading-relaxed text-slate-700">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-slate-900">{testimonial.author}</div>
                  <div className="text-sm text-slate-600">{testimonial.role}</div>
                  <div className="text-sm text-slate-500">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="bg-slate-900 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
              Enterprise-Grade Security & Compliance
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-300">
              Built with security, privacy, and compliance at the core
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "SOC 2 Type II Certified",
                description: "Enterprise-grade security audited by third parties"
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "GDPR & CCPA Compliant",
                description: "Full data privacy protection and user rights"
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                ),
                title: "SSO & 2FA",
                description: "Seamless integration with your identity provider"
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                ),
                title: "Audit Logs",
                description: "Complete activity tracking and compliance reporting"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-indigo-400">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="scroll-mt-20 bg-slate-50 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-slate-900 sm:text-5xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600">
              Choose the plan that fits your organization's size and needs
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "Free",
                description: "Perfect for small teams getting started",
                features: [
                  "Up to 10 playbooks",
                  "5 team members",
                  "Basic tool directory",
                  "Mobile access",
                  "Email support"
                ],
                cta: "Start Free",
                highlighted: false
              },
              {
                name: "Professional",
                price: "$49",
                period: "/month",
                description: "For growing businesses that need more",
                features: [
                  "Unlimited playbooks",
                  "Up to 50 team members",
                  "Advanced tool & vendor tracking",
                  "Priority support",
                  "Custom templates",
                  "Analytics dashboard",
                  "Role-based permissions"
                ],
                cta: "Start 30-Day Trial",
                highlighted: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations with complex needs",
                features: [
                  "Everything in Professional",
                  "Unlimited team members",
                  "Multi-location support",
                  "SSO & advanced security",
                  "Dedicated account manager",
                  "Custom integrations",
                  "SLA guarantees",
                  "On-premise options"
                ],
                cta: "Contact Sales",
                highlighted: false
              }
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-3xl border-2 p-8 shadow-sm ${
                  plan.highlighted
                    ? "border-indigo-600 bg-white shadow-2xl shadow-indigo-500/20 ring-2 ring-indigo-600"
                    : "border-slate-200 bg-white"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-1 text-sm font-semibold text-white shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-bold text-slate-900">{plan.name}</h3>
                  <div className="mb-3 flex items-baseline">
                    <span className="text-5xl font-extrabold text-slate-900">{plan.price}</span>
                    {plan.period && <span className="ml-2 text-slate-600">{plan.period}</span>}
                  </div>
                  <p className="text-slate-600">{plan.description}</p>
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className="h-6 w-6 flex-shrink-0 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full rounded-xl py-3 text-base font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40"
                      : "border-2 border-slate-300 bg-white text-slate-900 hover:border-indigo-600 hover:bg-slate-50"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-800 px-8 py-20 text-center shadow-2xl shadow-indigo-500/40 sm:px-16">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="relative">
              <h2 className="mb-4 text-4xl font-extrabold text-white sm:text-5xl">
                Ready to Transform Your Operations?
              </h2>
              <p className="mb-10 text-xl text-indigo-100">
                Join hundreds of companies that have eliminated operational chaos with Plantheory
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <button className="group rounded-xl bg-white px-8 py-4 text-base font-semibold text-indigo-600 shadow-xl transition-all hover:scale-105 hover:bg-indigo-50">
                  Start Free 30-Day Trial
                  <svg className="ml-2 inline-block h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button className="rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                  Schedule a Demo
                </button>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-indigo-100">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Setup in minutes
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Cancel anytime
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 shadow-lg">
                  <span className="text-xl font-bold text-white">P</span>
                </div>
                <span className="text-2xl font-bold text-slate-900">Plantheory</span>
              </div>
              <p className="mb-6 max-w-md text-slate-600">
                Transform operational chaos into clarity. The enterprise platform for operational excellence.
              </p>
              <div className="flex gap-4">
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-indigo-100 hover:text-indigo-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-indigo-100 hover:text-indigo-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">Product</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-slate-600 transition-colors hover:text-indigo-600">Features</a></li>
                <li><a href="#solutions" className="text-slate-600 transition-colors hover:text-indigo-600">Solutions</a></li>
                <li><a href="#pricing" className="text-slate-600 transition-colors hover:text-indigo-600">Pricing</a></li>
                <li><a href="#" className="text-slate-600 transition-colors hover:text-indigo-600">Updates</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-600 transition-colors hover:text-indigo-600">About</a></li>
                <li><a href="#" className="text-slate-600 transition-colors hover:text-indigo-600">Customers</a></li>
                <li><a href="#" className="text-slate-600 transition-colors hover:text-indigo-600">Blog</a></li>
                <li><a href="#" className="text-slate-600 transition-colors hover:text-indigo-600">Careers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-600 transition-colors hover:text-indigo-600">Documentation</a></li>
                <li><a href="#" className="text-slate-600 transition-colors hover:text-indigo-600">Help Center</a></li>
                <li><a href="#" className="text-slate-600 transition-colors hover:text-indigo-600">Security</a></li>
                <li><a href="#" className="text-slate-600 transition-colors hover:text-indigo-600">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-200 pt-8">
            <p className="text-center text-sm text-slate-600">
              © 2026 Plantheory. All rights reserved. Built for operational excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
