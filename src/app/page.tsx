'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Hook for scroll animations
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

// Animated section component
function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl'
          : 'bg-transparent'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image src="logo-text.svg" width={140} height={140} alt='plaintheory' priority />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-8 lg:flex">
              <a href="#features" onClick={(e) => scrollToSection(e, '#features')} className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">Features</a>
              <a href="#solutions" onClick={(e) => scrollToSection(e, '#solutions')} className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">Solutions</a>
              <a href="#pricing" onClick={(e) => scrollToSection(e, '#pricing')} className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">Pricing</a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden items-center gap-4 lg:flex">
              <Link href="/auth/login" className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">
                Sign In
              </Link>
              <Link href="/auth/signup" className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98]">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 lg:hidden">
              <Link href="/auth/login" className="text-sm font-medium text-slate-600">
                Sign In
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100"
              >
                {mobileMenuOpen ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`} onClick={() => setMobileMenuOpen(false)} />

        <div className={`fixed left-0 right-0 top-16 z-50 transform bg-white shadow-xl transition-all duration-300 lg:hidden ${
          mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}>
          <div className="px-4 py-4">
            <div className="space-y-1">
              {['Features', 'Solutions', 'Pricing'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => scrollToSection(e, `#${item.toLowerCase()}`)}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50"
                >
                  {item}
                </a>
              ))}
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4">
              <Link
                href="/auth/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full rounded-full bg-indigo-600 py-3 text-center text-base font-semibold text-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8 lg:pb-32 lg:pt-44">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 gradient-mesh" />
        <div className="absolute -top-40 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute -bottom-40 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-purple-100/50 blur-3xl" />

        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="animate-fade-in-down mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              Trusted by 500+ growing businesses
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl xl:text-7xl">
              Transform Operational{' '}
              <span className="text-gradient">Chaos into Clarity</span>
            </h1>

            {/* Subheadline */}
            <p className="animate-fade-in-up delay-100 mx-auto mb-8 max-w-2xl text-lg text-slate-600 sm:text-xl">
              The platform that centralizes your operational knowledge, streamlines processes, and empowers your team to execute with confidence.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up delay-200 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98]"
              >
                Start Free Trial
                <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/demo/dashboard"
                className="inline-flex items-center justify-center rounded-full border-2 border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
              >
                View Demo
              </Link>
            </div>

            <p className="animate-fade-in delay-300 mt-6 text-sm text-slate-500">
              No credit card required &bull; Free 30-day trial &bull; Cancel anytime
            </p>
          </div>

          {/* Hero Visual */}
          <div className="animate-scale-in delay-400 mx-auto mt-16 max-w-5xl">
            <div className="relative rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10 sm:rounded-3xl sm:p-3">
              <div className="absolute -left-8 -top-8 hidden h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl sm:block" />
              <div className="absolute -bottom-8 -right-8 hidden h-80 w-80 rounded-full bg-purple-200/30 blur-3xl sm:block" />

              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:rounded-2xl sm:p-6 lg:p-8">
                {/* Browser chrome */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="ml-4 h-7 flex-1 rounded-lg bg-slate-700/50" />
                </div>

                {/* App mockup */}
                <div className="flex gap-4">
                  {/* Sidebar */}
                  <div className="hidden w-48 space-y-3 sm:block">
                    <div className="h-10 rounded-lg bg-indigo-500/20" />
                    <div className="h-8 rounded-lg bg-slate-700/30" />
                    <div className="h-8 rounded-lg bg-slate-700/30" />
                    <div className="h-8 rounded-lg bg-slate-700/30" />
                  </div>

                  {/* Main content */}
                  <div className="flex-1 space-y-4 rounded-xl bg-slate-800/50 p-4 sm:p-6">
                    <div className="h-8 w-48 rounded-lg bg-white/10" />
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                      <div className="h-24 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 sm:h-32" />
                      <div className="h-24 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 sm:h-32" />
                      <div className="hidden h-32 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 sm:block" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded bg-slate-700/30" />
                      <div className="h-4 w-4/5 rounded bg-slate-700/30" />
                      <div className="h-4 w-3/5 rounded bg-slate-700/30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-slate-100 bg-slate-50/50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {[
              { value: '98%', label: 'Time Saved on Onboarding' },
              { value: '500+', label: 'Active Companies' },
              { value: '50K+', label: 'Playbooks Created' },
              { value: '24/7', label: 'Enterprise Support' },
            ].map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 100}>
                <div className="text-center">
                  <div className="mb-1 text-3xl font-bold text-indigo-600 sm:text-4xl lg:text-5xl">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-600">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="mb-12 text-center lg:mb-16">
              <span className="mb-4 inline-block rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                The Challenge
              </span>
              <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                Operational Inefficiencies Cost Your Business
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600">
                Without a centralized system, your organization faces challenges that impact productivity and growth.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '🔄',
                title: 'Repetitive Training',
                description: 'Hours wasted explaining the same processes to every new hire.',
                impact: '40% manager time wasted'
              },
              {
                icon: '🔒',
                title: 'Knowledge Silos',
                description: 'Critical intelligence locked in key employees\' minds.',
                impact: 'High continuity risk'
              },
              {
                icon: '📄',
                title: 'Fragmented Docs',
                description: 'SOPs scattered across platforms make retrieval difficult.',
                impact: '20 min lost per lookup'
              },
              {
                icon: '🔧',
                title: 'Tool Confusion',
                description: 'Employees struggle to identify correct tools for tasks.',
                impact: '15% unnecessary spending'
              },
              {
                icon: '⏰',
                title: 'Vendor Gaps',
                description: 'Missed renewals and unclear ownership create leakage.',
                impact: '$10K+ in overruns'
              },
              {
                icon: '📉',
                title: 'Revenue Leakage',
                description: 'Inefficiencies compound into significant revenue loss.',
                impact: '5-10% revenue impact'
              }
            ].map((problem, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="group h-full rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-red-200 hover:shadow-lg card-hover">
                  <div className="mb-4 text-3xl">{problem.icon}</div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">{problem.title}</h3>
                  <p className="mb-4 text-sm text-slate-600">{problem.description}</p>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {problem.impact}
                  </span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="scroll-mt-20 bg-slate-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="mb-12 text-center lg:mb-16">
              <span className="mb-4 inline-block rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
                The Solution
              </span>
              <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                Your Operational Command Center
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600">
                A unified platform that transforms how your organization documents and executes operational knowledge.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              {[
                {
                  icon: '📚',
                  color: 'bg-indigo-500',
                  title: 'Operational Playbooks',
                  description: 'Create comprehensive, step-by-step playbooks for every critical process.',
                  features: ['Rich text editor with multimedia', 'Version control & tracking', 'Role-based ownership']
                },
                {
                  icon: '🔧',
                  color: 'bg-blue-500',
                  title: 'Unified Tool Directory',
                  description: 'Centralize all tools and services in one searchable directory.',
                  features: ['Categorized tool catalog', 'Usage guidelines', 'Direct integration']
                },
                {
                  icon: '📊',
                  color: 'bg-purple-500',
                  title: 'Vendor Management',
                  description: 'Track all vendor relationships, contracts, and renewals.',
                  features: ['Contract tracking', 'Renewal notifications', 'Cost monitoring']
                },
                {
                  icon: '🔍',
                  color: 'bg-emerald-500',
                  title: 'Intelligent Search',
                  description: 'Find any process, tool, or vendor instantly.',
                  features: ['Full-text search', 'Smart filters', 'Recent shortcuts']
                }
              ].map((feature, index) => (
                <AnimatedSection key={index} delay={index * 150}>
                  <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg card-hover">
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${feature.color} text-xl shadow-lg`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-slate-900">{feature.title}</h3>
                      <p className="mb-3 text-sm text-slate-600">{feature.description}</p>
                      <ul className="space-y-1">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                            <svg className="h-4 w-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Visual mockup */}
            <AnimatedSection delay={200}>
              <div className="sticky top-24 hidden lg:block">
                <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-8 shadow-2xl">
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <div className="mb-4 flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${i === 1 ? 'bg-green-400 animate-pulse' : i === 2 ? 'bg-blue-400' : 'bg-purple-400'}`} />
                          <div className="h-4 w-32 rounded bg-white/20" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 w-full rounded bg-white/10" />
                          <div className="h-3 w-4/5 rounded bg-white/10" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="solutions" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="mb-12 text-center lg:mb-16">
              <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                Built for Your Industry
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600">
                Tailored solutions for businesses that demand operational excellence
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                icon: '🍽️',
                title: 'Restaurants & Hospitality',
                description: 'Standardize service protocols, kitchen procedures, and training.',
                features: ['Opening/closing procedures', 'Recipe standardization', 'Compliance tracking', 'Staff training']
              },
              {
                icon: '🏥',
                title: 'Healthcare & Clinics',
                description: 'Ensure consistent patient care with documented workflows.',
                features: ['Patient intake workflows', 'Treatment protocols', 'Equipment maintenance', 'Regulatory compliance']
              },
              {
                icon: '🎨',
                title: 'Agencies & Services',
                description: 'Streamline client onboarding and project delivery.',
                features: ['Client onboarding', 'Project templates', 'Quality assurance', 'Resource allocation']
              },
              {
                icon: '🚀',
                title: 'Technology & Startups',
                description: 'Scale operations with documented playbooks.',
                features: ['Engineering workflows', 'Customer success', 'Sales processes', 'Incident response']
              }
            ].map((useCase, index) => (
              <AnimatedSection key={index} delay={index * 150}>
                <div className="group h-full rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-indigo-200 hover:shadow-xl card-hover">
                  <div className="mb-4 text-4xl">{useCase.icon}</div>
                  <h3 className="mb-2 text-xl font-semibold text-slate-900">{useCase.title}</h3>
                  <p className="mb-6 text-slate-600">{useCase.description}</p>
                  <ul className="space-y-2">
                    {useCase.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <svg className="h-4 w-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="mb-12 text-center lg:mb-16">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                Trusted by Operations Leaders
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote: "Plantheory reduced our onboarding time from 3 weeks to 5 days. It's transformed how we scale.",
                author: 'Sarah Chen',
                role: 'COO, TechScale Solutions',
                company: '150 employees'
              },
              {
                quote: "We finally have one source of truth for all our operations. No more hunting through Slack or Google Docs.",
                author: 'Michael Rodriguez',
                role: 'Operations Director, HealthFirst',
                company: '8 locations'
              },
              {
                quote: "The ROI was immediate. We eliminated duplicate tool subscriptions worth $15K annually in the first month.",
                author: 'Emma Thompson',
                role: 'Head of Operations',
                company: '45 employees'
              }
            ].map((testimonial, index) => (
              <AnimatedSection key={index} delay={index * 150}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-8 card-hover">
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mb-6 text-slate-700 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                    <p className="text-sm text-slate-500">{testimonial.company}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-slate-900 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="mb-12 text-center lg:mb-16">
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Enterprise-Grade Security
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-300">
                Built with security, privacy, and compliance at the core
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {[
              { icon: '🔐', title: 'SOC 2 Type II', description: 'Enterprise security' },
              { icon: '🛡️', title: 'GDPR & CCPA', description: 'Data privacy' },
              { icon: '🔑', title: 'SSO & 2FA', description: 'Identity integration' },
              { icon: '📋', title: 'Audit Logs', description: 'Activity tracking' }
            ].map((feature, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                    {feature.icon}
                  </div>
                  <h3 className="mb-1 font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="mb-12 text-center lg:mb-16">
              <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600">
                Choose the plan that fits your organization
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            {[
              {
                name: 'Starter',
                price: 'Free',
                description: 'Perfect for small teams',
                features: ['Up to 10 playbooks', '5 team members', 'Basic tool directory', 'Email support'],
                cta: 'Get Started',
                highlighted: false,
                href: '/auth/signup'
              },
              {
                name: 'Professional',
                price: '$49',
                period: '/month',
                description: 'For growing businesses',
                features: ['Unlimited playbooks', '50 team members', 'Advanced tracking', 'Priority support', 'Analytics dashboard', 'Role permissions'],
                cta: 'Start Free Trial',
                highlighted: true,
                href: '/auth/signup'
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                description: 'For large organizations',
                features: ['Everything in Pro', 'Unlimited members', 'Multi-location', 'SSO & security', 'Dedicated manager', 'Custom integrations'],
                cta: 'Contact Sales',
                highlighted: false,
                href: '#contact'
              }
            ].map((plan, index) => (
              <AnimatedSection key={index} delay={index * 150}>
                <div className={`relative h-full rounded-2xl border-2 p-8 ${
                  plan.highlighted
                    ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-500/10'
                    : 'border-slate-200 bg-white'
                }`}>
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold text-white">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="mb-1 text-xl font-semibold text-slate-900">{plan.name}</h3>
                    <div className="mb-2 flex items-baseline">
                      <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                      {plan.period && <span className="ml-1 text-slate-600">{plan.period}</span>}
                    </div>
                    <p className="text-sm text-slate-600">{plan.description}</p>
                  </div>
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <svg className="h-5 w-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className={`block w-full rounded-full py-3 text-center font-semibold transition-all ${
                      plan.highlighted
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700'
                        : 'border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 px-8 py-16 text-center shadow-2xl sm:px-16 sm:py-20">
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

              <div className="relative">
                <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                  Ready to Transform Your Operations?
                </h2>
                <p className="mb-8 text-lg text-indigo-100">
                  Join hundreds of companies that have eliminated operational chaos
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link
                    href="/auth/signup"
                    className="group inline-flex items-center justify-center rounded-full bg-white px-8 py-4 font-semibold text-indigo-600 shadow-xl transition-all hover:bg-indigo-50"
                  >
                    Start Free Trial
                    <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    href="/demo/dashboard"
                    className="inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                  >
                    Watch Demo
                  </Link>
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-indigo-100">
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    No credit card
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Setup in minutes
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Cancel anytime
                  </span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12">
            <div className="sm:col-span-2">
              <Link href="/" className="mb-4 inline-block">
                <Image src="logo-text.svg" width={140} height={140} alt='plaintheory' />
              </Link>
              <p className="mb-6 max-w-sm text-sm text-slate-600">
                Transform operational chaos into clarity. The enterprise platform for operational excellence.
              </p>
              <div className="flex gap-4">
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-indigo-100 hover:text-indigo-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-indigo-100 hover:text-indigo-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">Product</h3>
              <ul className="space-y-3">
                <li><a href="#features" onClick={(e) => scrollToSection(e, '#features')} className="text-sm text-slate-600 hover:text-indigo-600">Features</a></li>
                <li><a href="#solutions" onClick={(e) => scrollToSection(e, '#solutions')} className="text-sm text-slate-600 hover:text-indigo-600">Solutions</a></li>
                <li><a href="#pricing" onClick={(e) => scrollToSection(e, '#pricing')} className="text-sm text-slate-600 hover:text-indigo-600">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600">About</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600">Blog</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600">Careers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600">Documentation</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600">Help Center</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-100 pt-8">
            <p className="text-center text-sm text-slate-500">
              &copy; 2026 Plantheory. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile sticky CTA */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xl transition-transform duration-300 lg:hidden ${
        scrolled ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <Link
          href="/auth/signup"
          className="block w-full rounded-full bg-indigo-600 py-3.5 text-center text-sm font-semibold text-white shadow-lg"
        >
          Get Started Free
        </Link>
      </div>
    </div>
  )
}
