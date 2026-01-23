'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const element = document.querySelector(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled ? 'border-slate-200 bg-white/95 shadow-sm backdrop-blur-lg' : 'border-transparent bg-white/80 backdrop-blur-lg'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between sm:h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <Image src="logo-text.svg" width={140} height={140} alt='plaintheory'/>
              </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-6 lg:flex lg:gap-8">
              <a href="#features" onClick={(e) => scrollToSection(e, '#features')} className="text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600">Features</a>
              <a href="#solutions" onClick={(e) => scrollToSection(e, '#solutions')} className="text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600">Solutions</a>
              <a href="#pricing" onClick={(e) => scrollToSection(e, '#pricing')} className="text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600">Pricing</a>
              <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600">Contact</a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden items-center gap-3 lg:flex lg:gap-4">
              <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600">
                Sign In
              </Link>
              <Link href="/auth/signup" className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40">
                Get Started Free
              </Link>
            </div>

            {/* Mobile CTA + Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link href="/auth/login" className="px-3 py-2 text-sm font-medium text-slate-700">
                Sign In
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu overlay */}
        <div
          className={`fixed inset-0 top-14 z-40 bg-black/50 transition-opacity duration-300 lg:hidden sm:top-16 ${
            mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Mobile menu panel */}
        <div className={`fixed left-0 right-0 top-14 z-50 transform bg-white shadow-xl transition-all duration-300 ease-out lg:hidden sm:top-16 ${
          mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}>
          <div className="max-h-[calc(100vh-3.5rem)] overflow-y-auto px-4 py-4 sm:max-h-[calc(100vh-4rem)]">
            <div className="space-y-1">
              <a
                href="#features"
                onClick={(e) => scrollToSection(e, '#features')}
                className="block rounded-xl px-4 py-3.5 text-base font-medium text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200"
              >
                Features
              </a>
              <a
                href="#solutions"
                onClick={(e) => scrollToSection(e, '#solutions')}
                className="block rounded-xl px-4 py-3.5 text-base font-medium text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200"
              >
                Solutions
              </a>
              <a
                href="#pricing"
                onClick={(e) => scrollToSection(e, '#pricing')}
                className="block rounded-xl px-4 py-3.5 text-base font-medium text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200"
              >
                Pricing
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, '#contact')}
                className="block rounded-xl px-4 py-3.5 text-base font-medium text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200"
              >
                Contact
              </a>
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4">
              <Link
                href="/auth/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3.5 text-center text-base font-semibold text-white shadow-lg transition-all active:scale-[0.98]"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 pb-12 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-36">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm sm:mb-6 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
              <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Trusted by 500+ growing businesses
            </div>
            <h1 className="mb-4 text-[1.75rem] font-extrabold leading-tight tracking-tight text-slate-900 sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Transform Operational{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Chaos into Clarity
              </span>
            </h1>
            <p className="mb-6 text-base leading-relaxed text-slate-600 sm:mb-8 sm:text-lg md:text-xl lg:text-2xl">
              The enterprise-grade platform that centralizes your operational knowledge, streamlines processes, and empowers your team.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-[0.98] sm:px-8 sm:py-4"
              >
                Start Free 30-Day Trial
                <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, '#contact')}
                className="inline-flex items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-900 shadow-lg transition-all hover:border-indigo-600 hover:bg-slate-50 active:scale-[0.98] sm:px-8 sm:py-4"
              >
                Schedule Demo
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-500 sm:mt-6 sm:text-sm">
              No credit card required • Full access • Cancel anytime
            </p>
          </div>

          {/* Hero Visual */}
          <div className="mx-auto mt-10 max-w-6xl sm:mt-16 lg:mt-20">
            <div className="relative rounded-xl border border-slate-300 bg-gradient-to-b from-slate-100 to-white p-2 shadow-2xl sm:rounded-2xl sm:p-4">
              <div className="absolute -left-4 -top-4 hidden h-72 w-72 rounded-full bg-indigo-200 opacity-20 blur-3xl sm:block"></div>
              <div className="absolute -bottom-4 -right-4 hidden h-72 w-72 rounded-full bg-blue-200 opacity-20 blur-3xl sm:block"></div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 p-3 shadow-inner sm:aspect-video sm:rounded-xl sm:p-6 lg:p-8">
                <div className="flex h-full flex-col gap-2 sm:gap-4 lg:gap-6">
                  {/* Browser dots */}
                  <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                    <div className="h-2 w-2 rounded-full bg-red-400 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3"></div>
                    <div className="h-2 w-2 rounded-full bg-yellow-400 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3"></div>
                    <div className="h-2 w-2 rounded-full bg-green-400 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3"></div>
                    <div className="ml-2 h-5 flex-1 rounded bg-slate-700/50 sm:ml-3 sm:h-6 lg:ml-4 lg:h-8 lg:rounded-md"></div>
                  </div>
                  {/* Content area */}
                  <div className="flex flex-1 gap-2 sm:gap-3 lg:gap-4">
                    {/* Sidebar - hidden on very small screens */}
                    <div className="hidden w-1/4 space-y-2 sm:block lg:space-y-3">
                      <div className="h-7 rounded-lg bg-indigo-500/30 sm:h-8 lg:h-10"></div>
                      <div className="h-5 rounded-lg bg-slate-700/50 sm:h-6 lg:h-8"></div>
                      <div className="h-5 rounded-lg bg-slate-700/50 sm:h-6 lg:h-8"></div>
                      <div className="h-5 rounded-lg bg-slate-700/50 sm:h-6 lg:h-8"></div>
                    </div>
                    {/* Main content */}
                    <div className="flex-1 space-y-2 rounded-lg bg-slate-800/50 p-2 sm:space-y-3 sm:rounded-xl sm:p-4 lg:space-y-4 lg:p-6">
                      <div className="h-5 w-3/4 rounded bg-indigo-500/40 sm:h-7 lg:h-10 lg:rounded-lg"></div>
                      <div className="space-y-1 sm:space-y-1.5 lg:space-y-2">
                        <div className="h-2.5 w-full rounded bg-slate-700/50 sm:h-3 lg:h-4"></div>
                        <div className="h-2.5 w-full rounded bg-slate-700/50 sm:h-3 lg:h-4"></div>
                        <div className="h-2.5 w-5/6 rounded bg-slate-700/50 sm:h-3 lg:h-4"></div>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-4 lg:mt-6 lg:gap-3">
                        <div className="h-10 rounded-lg bg-slate-700/30 sm:h-14 lg:h-20"></div>
                        <div className="h-10 rounded-lg bg-slate-700/30 sm:h-14 lg:h-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mx-auto mt-10 max-w-5xl sm:mt-16 lg:mt-20">
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 sm:mb-6 sm:text-sm">
              Trusted by Industry Leaders
            </p>
            <div className="grid grid-cols-2 gap-4 opacity-50 grayscale sm:gap-6 md:grid-cols-4 md:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-center">
                  <div className="h-5 w-20 rounded bg-slate-300 sm:h-6 sm:w-24 lg:h-8 lg:w-32"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-slate-200 bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
            {[
              { value: '98%', label: 'Time Saved on Onboarding' },
              { value: '500+', label: 'Active Companies' },
              { value: '50K+', label: 'Playbooks Created' },
              { value: '24/7', label: 'Enterprise Support' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mb-1 text-2xl font-bold text-indigo-600 sm:mb-2 sm:text-3xl lg:text-4xl">{stat.value}</div>
                <div className="text-xs font-medium text-slate-600 sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-slate-50 px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center sm:mb-12 lg:mb-16">
            <div className="mb-3 inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 sm:mb-4 sm:px-4 sm:text-sm">
              The Challenge
            </div>
            <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:mb-4 sm:text-3xl lg:mb-6 lg:text-4xl xl:text-5xl">
              Operational Inefficiencies Cost Your Business
            </h2>
            <p className="mx-auto max-w-3xl text-sm text-slate-600 sm:text-base lg:text-xl">
              Without a centralized operational system, your organization faces critical challenges that impact productivity, revenue, and growth potential.
            </p>
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {[
              {
                icon: (
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ),
                title: "Repetitive Training Cycles",
                description: "Your team wastes hours explaining the same processes to every new hire.",
                impact: "40% of manager time wasted"
              },
              {
                icon: (
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Knowledge Silos",
                description: "Critical operational intelligence locked in key employees' minds.",
                impact: "High business continuity risk"
              },
              {
                icon: (
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: "Fragmented Documentation",
                description: "SOPs scattered across multiple platforms make retrieval time-consuming.",
                impact: "20 minutes lost per lookup"
              },
              {
                icon: (
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Tool Stack Confusion",
                description: "Employees struggle to identify correct tools for specific tasks.",
                impact: "15% unnecessary tool spending"
              },
              {
                icon: (
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Vendor Management Gaps",
                description: "Missed renewals and unclear ownership create financial leakage.",
                impact: "$10K+ in renewal overruns"
              },
              {
                icon: (
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                ),
                title: "Revenue Leakage",
                description: "Operational inefficiencies compound into significant revenue loss.",
                impact: "5-10% revenue impact"
              }
            ].map((problem, index) => (
              <div key={index} className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-200 hover:shadow-lg sm:rounded-2xl sm:p-6 lg:p-8">
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-50 to-orange-50 text-red-600 transition-transform group-hover:scale-110 sm:mb-3 sm:h-12 sm:w-12 lg:mb-4 lg:h-14 lg:w-14 lg:rounded-xl">
                  {problem.icon}
                </div>
                <h3 className="mb-1.5 text-base font-bold text-slate-900 sm:mb-2 sm:text-lg lg:mb-3 lg:text-xl">{problem.title}</h3>
                <p className="mb-2 text-sm leading-relaxed text-slate-600 sm:mb-3 lg:mb-4">{problem.description}</p>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                  <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {problem.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="features" className="scroll-mt-16 px-4 py-12 sm:px-6 sm:py-20 lg:scroll-mt-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center sm:mb-12 lg:mb-16">
            <div className="mb-3 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 sm:mb-4 sm:px-4 sm:text-sm">
              The Solution
            </div>
            <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:mb-4 sm:text-3xl lg:mb-6 lg:text-4xl xl:text-5xl">
              Your Enterprise Operational Command Center
            </h2>
            <p className="mx-auto max-w-3xl text-sm text-slate-600 sm:text-base lg:text-xl">
              Plantheory provides a unified platform that transforms how your organization documents, accesses, and executes operational knowledge.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {[
                {
                  emoji: '📚',
                  gradient: 'from-indigo-500 to-blue-600',
                  shadow: 'shadow-indigo-500/30',
                  color: 'text-indigo-600',
                  title: 'Operational Playbooks',
                  description: 'Create comprehensive, step-by-step playbooks for every critical process.',
                  features: ['Rich text editor with multimedia support', 'Version control and change tracking', 'Role-based ownership and accountability']
                },
                {
                  emoji: '🔧',
                  gradient: 'from-blue-500 to-cyan-600',
                  shadow: 'shadow-blue-500/30',
                  color: 'text-blue-600',
                  title: 'Unified Tool Directory',
                  description: 'Centralize all tools, software, and services in one searchable directory.',
                  features: ['Categorized tool catalog with access links', 'Usage guidelines and best practices', 'Direct integration with playbooks']
                },
                {
                  emoji: '📊',
                  gradient: 'from-purple-500 to-pink-600',
                  shadow: 'shadow-purple-500/30',
                  color: 'text-purple-600',
                  title: 'Vendor Management System',
                  description: 'Track all vendor relationships, contracts, and renewals in one place.',
                  features: ['Contract timeline tracking', 'Automated renewal notifications', 'Cost tracking and budget alerts']
                },
                {
                  emoji: '🔍',
                  gradient: 'from-green-500 to-emerald-600',
                  shadow: 'shadow-green-500/30',
                  color: 'text-green-600',
                  title: 'Intelligent Search',
                  description: 'Find any process, tool, or vendor instantly with powerful search.',
                  features: ['Full-text search across all content', 'Smart filters and faceted search', 'Recently accessed shortcuts']
                }
              ].map((feature, index) => (
                <div key={index} className="group">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-xl shadow-lg ${feature.shadow} transition-transform group-hover:scale-110 sm:h-14 sm:w-14 sm:text-2xl lg:h-16 lg:w-16 lg:rounded-2xl lg:text-3xl`}>
                      {feature.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1.5 text-lg font-bold text-slate-900 sm:mb-2 sm:text-xl lg:mb-3 lg:text-2xl">{feature.title}</h3>
                      <p className="mb-2 text-sm leading-relaxed text-slate-600 sm:mb-3 sm:text-base lg:mb-4 lg:text-lg">{feature.description}</p>
                      <ul className="space-y-1 sm:space-y-1.5 lg:space-y-2">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 sm:text-sm lg:text-base">
                            <svg className={`h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5 ${feature.color}`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual mockup - hidden on mobile, shown on lg+ */}
            <div className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
              <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 p-8 shadow-2xl xl:p-12">
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
                      <div className="h-6 w-16 rounded-full bg-purple-500/30"></div>
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
      <section id="solutions" className="scroll-mt-16 bg-slate-50 px-4 py-12 sm:px-6 sm:py-20 lg:scroll-mt-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center sm:mb-12 lg:mb-16">
            <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:mb-4 sm:text-3xl lg:mb-6 lg:text-4xl xl:text-5xl">
              Built for Your Industry
            </h2>
            <p className="mx-auto max-w-3xl text-sm text-slate-600 sm:text-base lg:text-xl">
              Tailored solutions for businesses that demand operational excellence
            </p>
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:gap-8">
            {[
              {
                icon: "🍽️",
                title: "Restaurants & Hospitality",
                description: "Standardize service protocols, kitchen procedures, and training materials.",
                features: ["Opening/closing procedures", "Recipe standardization", "Health & safety compliance", "Staff training programs"]
              },
              {
                icon: "🏥",
                title: "Healthcare & Clinics",
                description: "Ensure consistent patient care with documented clinical workflows.",
                features: ["Patient intake workflows", "Treatment protocols", "Equipment maintenance", "Regulatory compliance"]
              },
              {
                icon: "🎨",
                title: "Agencies & Professional Services",
                description: "Streamline client onboarding, project delivery, and knowledge transfer.",
                features: ["Client onboarding process", "Project templates", "Quality assurance", "Resource allocation"]
              },
              {
                icon: "🚀",
                title: "Technology & Startups",
                description: "Scale your operations with documented engineering and go-to-market playbooks.",
                features: ["Engineering workflows", "Customer success playbooks", "Sales processes", "Incident response"]
              }
            ].map((useCase, index) => (
              <div key={index} className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-300 hover:shadow-lg sm:rounded-2xl sm:p-6 lg:p-8">
                <div className="mb-2 text-3xl sm:mb-3 sm:text-4xl lg:mb-4 lg:text-5xl">{useCase.icon}</div>
                <h3 className="mb-1.5 text-lg font-bold text-slate-900 sm:mb-2 sm:text-xl lg:mb-3 lg:text-2xl">{useCase.title}</h3>
                <p className="mb-3 text-sm text-slate-600 sm:mb-4 sm:text-base lg:mb-6 lg:text-lg">{useCase.description}</p>
                <ul className="space-y-1 sm:space-y-1.5 lg:space-y-2">
                  {useCase.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 sm:text-sm lg:text-base">
                      <svg className="h-4 w-4 flex-shrink-0 text-indigo-600 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
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
      <section className="px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center sm:mb-12 lg:mb-16">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl xl:text-5xl">
              Trusted by Operations Leaders
            </h2>
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-3 lg:gap-8">
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
              <div key={index} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6 lg:p-8">
                <div className="mb-3 flex gap-0.5 sm:mb-4 lg:mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-yellow-400 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-3 text-sm italic leading-relaxed text-slate-700 sm:mb-4 sm:text-base lg:mb-6 lg:text-lg">"{testimonial.quote}"</p>
                <div>
                  <div className="text-sm font-semibold text-slate-900 sm:text-base">{testimonial.author}</div>
                  <div className="text-xs text-slate-600 sm:text-sm">{testimonial.role}</div>
                  <div className="text-xs text-slate-500">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="bg-slate-900 px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center sm:mb-12 lg:mb-16">
            <h2 className="mb-3 text-2xl font-bold text-white sm:mb-4 sm:text-3xl lg:mb-6 lg:text-4xl xl:text-5xl">
              Enterprise-Grade Security & Compliance
            </h2>
            <p className="mx-auto max-w-3xl text-sm text-slate-300 sm:text-base lg:text-xl">
              Built with security, privacy, and compliance at the core
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
            {[
              {
                icon: (
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "SOC 2 Type II",
                description: "Enterprise-grade security"
              },
              {
                icon: (
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "GDPR & CCPA",
                description: "Full data privacy protection"
              },
              {
                icon: (
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                ),
                title: "SSO & 2FA",
                description: "Identity provider integration"
              },
              {
                icon: (
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                ),
                title: "Audit Logs",
                description: "Complete activity tracking"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-indigo-400 sm:mb-3 sm:h-14 sm:w-14 lg:mb-4 lg:h-16 lg:w-16 lg:rounded-2xl">
                  {feature.icon}
                </div>
                <h3 className="mb-1 text-sm font-bold text-white sm:text-base lg:mb-2 lg:text-lg">{feature.title}</h3>
                <p className="text-xs text-slate-400 sm:text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="scroll-mt-16 bg-slate-50 px-4 py-12 sm:px-6 sm:py-20 lg:scroll-mt-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center sm:mb-12 lg:mb-16">
            <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:mb-4 sm:text-3xl lg:mb-6 lg:text-4xl xl:text-5xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto max-w-3xl text-sm text-slate-600 sm:text-base lg:text-xl">
              Choose the plan that fits your organization's size and needs
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {[
              {
                name: "Starter",
                price: "Free",
                description: "Perfect for small teams getting started",
                features: ["Up to 10 playbooks", "5 team members", "Basic tool directory", "Mobile access", "Email support"],
                cta: "Start Free",
                highlighted: false,
                href: "/auth/signup"
              },
              {
                name: "Professional",
                price: "$49",
                period: "/month",
                description: "For growing businesses that need more",
                features: ["Unlimited playbooks", "Up to 50 team members", "Advanced tool & vendor tracking", "Priority support", "Custom templates", "Analytics dashboard", "Role-based permissions"],
                cta: "Start 30-Day Trial",
                highlighted: true,
                href: "/auth/signup"
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations with complex needs",
                features: ["Everything in Professional", "Unlimited team members", "Multi-location support", "SSO & advanced security", "Dedicated account manager", "Custom integrations", "SLA guarantees"],
                cta: "Contact Sales",
                highlighted: false,
                href: "#contact"
              }
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border-2 p-4 shadow-sm sm:rounded-3xl sm:p-6 lg:p-8 ${
                  plan.highlighted
                    ? "border-indigo-600 bg-white shadow-2xl shadow-indigo-500/20 ring-2 ring-indigo-600"
                    : "border-slate-200 bg-white"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-lg sm:px-4 sm:text-sm">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-4 sm:mb-6">
                  <h3 className="mb-1 text-lg font-bold text-slate-900 sm:text-xl lg:mb-2 lg:text-2xl">{plan.name}</h3>
                  <div className="mb-2 flex items-baseline">
                    <span className="text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">{plan.price}</span>
                    {plan.period && <span className="ml-1 text-sm text-slate-600">{plan.period}</span>}
                  </div>
                  <p className="text-sm text-slate-600">{plan.description}</p>
                </div>
                <ul className="mb-4 space-y-2 sm:mb-6 lg:mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg className="h-5 w-5 flex-shrink-0 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all active:scale-[0.98] sm:py-3.5 sm:text-base ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
                      : "border-2 border-slate-300 bg-white text-slate-900 hover:border-indigo-600 hover:bg-slate-50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="scroll-mt-16 px-4 py-12 sm:px-6 sm:py-20 lg:scroll-mt-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-800 px-5 py-10 text-center shadow-2xl shadow-indigo-500/40 sm:rounded-3xl sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            <div className="absolute -left-20 -top-20 hidden h-64 w-64 rounded-full bg-white/10 blur-3xl sm:block"></div>
            <div className="absolute -bottom-20 -right-20 hidden h-64 w-64 rounded-full bg-white/10 blur-3xl sm:block"></div>
            <div className="relative">
              <h2 className="mb-3 text-xl font-extrabold text-white sm:mb-4 sm:text-3xl lg:text-4xl xl:text-5xl">
                Ready to Transform Your Operations?
              </h2>
              <p className="mb-6 text-sm text-indigo-100 sm:mb-8 sm:text-base lg:mb-10 lg:text-xl">
                Join hundreds of companies that have eliminated operational chaos with Plantheory
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
                <Link
                  href="/auth/signup"
                  className="group inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-600 shadow-xl transition-all hover:bg-indigo-50 active:scale-[0.98] sm:px-6 sm:py-3.5 sm:text-base lg:px-8 lg:py-4"
                >
                  Start Free 30-Day Trial
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                 href="/demo/dashboard"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.98] sm:px-6 sm:py-3.5 sm:text-base lg:px-8 lg:py-4"
                >
                  Watch a Demo
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs text-indigo-100 sm:mt-6 sm:gap-4 sm:text-sm lg:mt-8 lg:gap-6">
                <div className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No credit card required
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Setup in minutes
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
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
      <footer className="border-t border-slate-200 bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12">
            <div className="sm:col-span-2">
              <Link href="/" className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
                <Image src="logo-text.svg" width={140} height={140} alt='plaintheory'/>
              </Link>
              <p className="mb-4 max-w-md text-sm text-slate-600">
                Transform operational chaos into clarity. The enterprise platform for operational excellence.
              </p>
              <div className="flex gap-3">
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-indigo-100 hover:text-indigo-600 sm:h-10 sm:w-10">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-indigo-100 hover:text-indigo-600 sm:h-10 sm:w-10">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-900 sm:mb-4">Product</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li><a href="#features" onClick={(e) => scrollToSection(e, '#features')} className="text-sm text-slate-600 transition-colors hover:text-indigo-600">Features</a></li>
                <li><a href="#solutions" onClick={(e) => scrollToSection(e, '#solutions')} className="text-sm text-slate-600 transition-colors hover:text-indigo-600">Solutions</a></li>
                <li><a href="#pricing" onClick={(e) => scrollToSection(e, '#pricing')} className="text-sm text-slate-600 transition-colors hover:text-indigo-600">Pricing</a></li>
                <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-indigo-600">Updates</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-900 sm:mb-4">Company</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-indigo-600">About</a></li>
                <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-indigo-600">Customers</a></li>
                <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-indigo-600">Blog</a></li>
                <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-indigo-600">Careers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-900 sm:mb-4">Resources</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-indigo-600">Documentation</a></li>
                <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-indigo-600">Help Center</a></li>
                <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-indigo-600">Security</a></li>
                <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-indigo-600">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6 sm:mt-10 sm:pt-8 lg:mt-12">
            <p className="text-center text-xs text-slate-600 sm:text-sm">
              © 2026 Plantheory. All rights reserved. Built for operational excellence.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile sticky CTA - only shows when scrolled */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 transform border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-lg transition-transform duration-300 lg:hidden ${
        scrolled ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <Link
          href="/auth/signup"
          className="block w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 py-3.5 text-center text-sm font-semibold text-white shadow-lg transition-all active:scale-[0.98]"
        >
          Get Started Free
        </Link>
      </div>
    </div>
  )
}
