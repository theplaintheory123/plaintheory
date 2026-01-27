'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// ==========================================
// HOOKS
// ==========================================

function useScrollAnimation(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold, rootMargin: '0px 0px -100px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

function useCounter(end: number, duration: number = 2000, isVisible: boolean) {
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return
    hasAnimated.current = true

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOut * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return count
}

function useMouseParallax() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setPosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return position
}

// ==========================================
// COMPONENTS
// ==========================================

function AnimatedSection({
  children,
  className = '',
  delay = 0,
  animation = 'fade-up'
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'flip'
}) {
  const { ref, isVisible } = useScrollAnimation()

  const animations = {
    'fade-up': 'translate-y-[40px] opacity-0',
    'fade-down': '-translate-y-[40px] opacity-0',
    'fade-left': 'translate-x-[40px] opacity-0',
    'fade-right': '-translate-x-[40px] opacity-0',
    'scale': 'scale-95 opacity-0',
    'flip': 'rotateY-90 opacity-0'
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) translateX(0) scale(1)' : undefined,
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className={`transition-all duration-700 ease-out ${!isVisible ? animations[animation] : ''}`}
        style={{ transitionDelay: `${delay}ms` }}>
        {children}
      </div>
    </div>
  )
}

function FloatingOrb({
  className,
  size = 'md',
  color = 'indigo',
  delay = 0
}: {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'indigo' | 'purple' | 'blue' | 'cyan' | 'pink'
  delay?: number
}) {
  const sizes = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-96 h-96',
    xl: 'w-[500px] h-[500px]'
  }

  const colors = {
    indigo: 'from-indigo-400/30 to-indigo-600/20',
    purple: 'from-purple-400/30 to-purple-600/20',
    blue: 'from-blue-400/30 to-blue-600/20',
    cyan: 'from-cyan-400/30 to-cyan-600/20',
    pink: 'from-pink-400/30 to-pink-600/20'
  }

  return (
    <div
      className={`absolute rounded-full bg-gradient-to-br ${colors[color]} ${sizes[size]} blur-3xl animate-float-slow ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  )
}

function Particle({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div
      className={`absolute w-2 h-2 rounded-full bg-indigo-400/40 animate-particle ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  )
}

function GlowingCard({
  children,
  className = '',
  glowColor = 'indigo'
}: {
  children: React.ReactNode
  className?: string
  glowColor?: string
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative group ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15), transparent 40%)`
        }}
      />
      {children}
    </div>
  )
}

function AnimatedCounter({ value, suffix = '', isVisible }: { value: number; suffix?: string; isVisible: boolean }) {
  const count = useCounter(value, 2000, isVisible)
  return <span>{count.toLocaleString()}{suffix}</span>
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const mousePosition = useMouseParallax()
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true)
      },
      { threshold: 0.3 }
    )

    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const element = document.querySelector(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ==================== NAVIGATION ==================== */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? 'border-b border-slate-200/80 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur-xl'
          : 'bg-transparent'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            <Link href="/" className="flex items-center group">
              <Image src="logo-text.svg" width={140} height={140} alt='plaintheory' priority className="transition-transform duration-300 group-hover:scale-105" />
            </Link>

            <div className="hidden items-center gap-8 lg:flex">
              {['Features', 'Solutions', 'Pricing'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => scrollToSection(e, `#${item.toLowerCase()}`)}
                  className="relative text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 underline-animated"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden items-center gap-4 lg:flex">
              <Link href="/auth/login" className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="group relative rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 active:scale-[0.98] overflow-hidden"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>

            <div className="flex items-center gap-3 lg:hidden">
              <Link href="/auth/login" className="text-sm font-medium text-slate-600">Sign In</Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-all hover:bg-slate-100"
              >
                <div className="relative w-5 h-5">
                  <span className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'top-2 rotate-45' : 'top-0.5'}`} />
                  <span className={`absolute left-0 top-2 block h-0.5 w-5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                  <span className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'top-2 -rotate-45' : 'top-3.5'}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`} onClick={() => setMobileMenuOpen(false)} />

        <div className={`fixed left-0 right-0 top-16 z-50 transform bg-white/95 backdrop-blur-xl shadow-2xl transition-all duration-300 lg:hidden ${
          mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}>
          <div className="px-4 py-6">
            <div className="space-y-1">
              {['Features', 'Solutions', 'Pricing'].map((item, index) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => scrollToSection(e, `#${item.toLowerCase()}`)}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item}
                </a>
              ))}
            </div>
            <div className="mt-6 border-t border-slate-100 pt-6">
              <Link
                href="/auth/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 py-3.5 text-center text-base font-semibold text-white shadow-lg"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen overflow-hidden px-4 pb-20 pt-28 sm:px-6 sm:pb-32 sm:pt-36 lg:px-8 lg:pt-44">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 gradient-mesh-animated" />
          <FloatingOrb className="-top-20 -right-20" size="xl" color="indigo" delay={0} />
          <FloatingOrb className="-bottom-32 -left-32" size="lg" color="purple" delay={2} />
          <FloatingOrb className="top-1/3 right-1/4" size="md" color="blue" delay={4} />
          <FloatingOrb className="bottom-1/4 left-1/3 hidden lg:block" size="sm" color="cyan" delay={1} />

          {/* Particles */}
          <Particle className="top-1/4 left-1/4" delay={0} />
          <Particle className="top-1/3 right-1/3" delay={1.5} />
          <Particle className="bottom-1/3 left-1/2" delay={3} />
          <Particle className="top-1/2 right-1/4" delay={2} />
          <Particle className="bottom-1/4 right-1/3 hidden sm:block" delay={4} />

          {/* Grid pattern */}
          <div className="absolute inset-0 grid-pattern opacity-50" />
        </div>

        <div className="mx-auto max-w-7xl relative">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="animate-fade-in-down mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-white/80 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-indigo-700 shadow-lg shadow-indigo-500/10">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500" />
              </span>
              Trusted by 500+ growing businesses
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up mb-8 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl xl:text-7xl">
              <span className="block">Transform Operational</span>
              <span className="text-gradient-animated block mt-2">Chaos into Clarity</span>
            </h1>

            {/* Subheadline */}
            <p className="animate-fade-in-up delay-150 mx-auto mb-10 max-w-2xl text-lg text-slate-600 sm:text-xl leading-relaxed">
              The platform that centralizes your operational knowledge, streamlines processes, and empowers your team to execute with confidence.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up delay-300 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/auth/signup"
                className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/30 transition-all hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-[0.98] overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Free Trial
                  <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
              <Link
                href="/demo/dashboard"
                className="group inline-flex items-center justify-center rounded-full border-2 border-slate-200 bg-white/80 backdrop-blur-sm px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 active:scale-[0.98]"
              >
                <svg className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                View Demo
              </Link>
            </div>

            <p className="animate-fade-in delay-500 mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free 30-day trial
              </span>
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Cancel anytime
              </span>
            </p>
          </div>

          {/* Hero Visual */}
          <div className="animate-scale-in delay-400 mx-auto mt-16 max-w-5xl lg:mt-20">
            <div
              className="relative rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-2 shadow-2xl shadow-slate-900/10 sm:rounded-3xl sm:p-3"
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y * 0.02}deg) rotateY(${mousePosition.x * 0.02}deg)`
              }}
            >
              {/* Glow effects */}
              <div className="absolute -left-12 -top-12 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl animate-pulse-soft" />
              <div className="absolute -bottom-12 -right-12 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl animate-pulse-soft delay-1000" />

              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:rounded-2xl sm:p-6 lg:p-8">
                {/* Browser chrome */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors cursor-pointer" />
                    <div className="h-3 w-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors cursor-pointer" />
                  </div>
                  <div className="ml-4 flex-1 h-8 rounded-lg bg-slate-700/50 flex items-center px-4">
                    <div className="h-2 w-32 rounded bg-slate-600/50" />
                  </div>
                </div>

                {/* App mockup */}
                <div className="flex gap-6">
                  {/* Sidebar */}
                  <div className="hidden w-48 space-y-4 sm:block">
                    <div className="h-10 rounded-xl bg-gradient-to-r from-indigo-500/30 to-purple-500/30 animate-pulse-soft" />
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-9 rounded-lg bg-slate-700/40 hover:bg-slate-700/60 transition-colors cursor-pointer" style={{ animationDelay: `${i * 200}ms` }} />
                      ))}
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="flex-1 space-y-5 rounded-xl bg-slate-800/50 p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-40 rounded-lg bg-white/10" />
                      <div className="h-8 w-24 rounded-lg bg-indigo-500/30" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {[
                        { from: 'from-indigo-500/30', to: 'to-purple-500/30' },
                        { from: 'from-blue-500/30', to: 'to-cyan-500/30' },
                        { from: 'from-emerald-500/30', to: 'to-teal-500/30' }
                      ].map((colors, i) => (
                        <div
                          key={i}
                          className={`h-28 rounded-xl bg-gradient-to-br ${colors.from} ${colors.to} animate-pulse-soft sm:h-36 ${i === 2 ? 'hidden sm:block' : ''}`}
                          style={{ animationDelay: `${i * 300}ms` }}
                        />
                      ))}
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 w-full rounded bg-slate-700/50" />
                      <div className="h-4 w-4/5 rounded bg-slate-700/50" />
                      <div className="h-4 w-3/5 rounded bg-slate-700/50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-gentle hidden lg:block">
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <span className="text-xs font-medium">Scroll to explore</span>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section ref={statsRef} className="relative border-y border-slate-100 bg-gradient-to-b from-slate-50 to-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="mx-auto max-w-7xl relative">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { value: 98, suffix: '%', label: 'Time Saved on Onboarding', icon: '⚡' },
              { value: 500, suffix: '+', label: 'Active Companies', icon: '🏢' },
              { value: 50, suffix: 'K+', label: 'Playbooks Created', icon: '📚' },
              { value: 24, suffix: '/7', label: 'Enterprise Support', icon: '🛡️' },
            ].map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 100} animation="scale">
                <div className="text-center group">
                  <div className="mb-3 text-3xl group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                  <div className="mb-2 text-4xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text sm:text-5xl lg:text-6xl">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} isVisible={statsVisible} />
                  </div>
                  <div className="text-sm font-medium text-slate-600">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PROBLEM SECTION ==================== */}
      <section className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full gradient-radial opacity-50" />

        <div className="mx-auto max-w-7xl relative">
          <AnimatedSection>
            <div className="mb-16 text-center">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                The Challenge
              </span>
              <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                Operational Inefficiencies <span className="text-gradient">Cost Your Business</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600">
                Without a centralized system, your organization faces challenges that impact productivity and growth.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: '🔄', title: 'Repetitive Training', description: 'Hours wasted explaining the same processes to every new hire.', impact: '40% manager time wasted', color: 'from-orange-500 to-red-500' },
              { icon: '🔒', title: 'Knowledge Silos', description: 'Critical intelligence locked in key employees\' minds.', impact: 'High continuity risk', color: 'from-red-500 to-pink-500' },
              { icon: '📄', title: 'Fragmented Docs', description: 'SOPs scattered across platforms make retrieval difficult.', impact: '20 min lost per lookup', color: 'from-pink-500 to-purple-500' },
              { icon: '🔧', title: 'Tool Confusion', description: 'Employees struggle to identify correct tools for tasks.', impact: '15% unnecessary spending', color: 'from-purple-500 to-indigo-500' },
              { icon: '⏰', title: 'Vendor Gaps', description: 'Missed renewals and unclear ownership create leakage.', impact: '$10K+ in overruns', color: 'from-indigo-500 to-blue-500' },
              { icon: '📉', title: 'Revenue Leakage', description: 'Inefficiencies compound into significant revenue loss.', impact: '5-10% revenue impact', color: 'from-blue-500 to-cyan-500' }
            ].map((problem, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <GlowingCard>
                  <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-red-200 hover:shadow-xl card-hover group">
                    <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${problem.color} text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {problem.icon}
                    </div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900">{problem.title}</h3>
                    <p className="mb-4 text-sm text-slate-600 leading-relaxed">{problem.description}</p>
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                      {problem.impact}
                    </span>
                  </div>
                </GlowingCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section id="features" className="scroll-mt-20 relative bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4 py-20 sm:px-6 sm:py-28 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <FloatingOrb className="top-20 -left-32" size="lg" color="indigo" delay={0} />
        <FloatingOrb className="bottom-20 -right-32" size="md" color="purple" delay={3} />

        <div className="mx-auto max-w-7xl relative">
          <AnimatedSection>
            <div className="mb-16 text-center">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                The Solution
              </span>
              <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                Your Operational <span className="text-gradient-animated">Command Center</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600">
                A unified platform that transforms how your organization documents and executes operational knowledge.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              {[
                { icon: '📚', color: 'from-indigo-500 to-indigo-600', title: 'Operational Playbooks', description: 'Create comprehensive, step-by-step playbooks for every critical process.', features: ['Rich text editor with multimedia', 'Version control & tracking', 'Role-based ownership'] },
                { icon: '🔧', color: 'from-blue-500 to-blue-600', title: 'Unified Tool Directory', description: 'Centralize all tools and services in one searchable directory.', features: ['Categorized tool catalog', 'Usage guidelines', 'Direct integration'] },
                { icon: '📊', color: 'from-purple-500 to-purple-600', title: 'Vendor Management', description: 'Track all vendor relationships, contracts, and renewals.', features: ['Contract tracking', 'Renewal notifications', 'Cost monitoring'] },
                { icon: '🔍', color: 'from-emerald-500 to-emerald-600', title: 'Intelligent Search', description: 'Find any process, tool, or vendor instantly.', features: ['Full-text search', 'Smart filters', 'Recent shortcuts'] }
              ].map((feature, index) => (
                <AnimatedSection key={index} delay={index * 150} animation="fade-left">
                  <GlowingCard>
                    <div className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-xl card-hover group">
                      <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 text-lg font-semibold text-slate-900">{feature.title}</h3>
                        <p className="mb-4 text-sm text-slate-600">{feature.description}</p>
                        <ul className="space-y-2">
                          {feature.features.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                              <svg className="h-5 w-5 text-indigo-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </GlowingCard>
                </AnimatedSection>
              ))}
            </div>

            {/* Visual mockup */}
            <AnimatedSection delay={200} animation="fade-right">
              <div className="sticky top-24 hidden lg:block">
                <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-8 shadow-2xl overflow-hidden">
                  {/* Animated glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-purple-500/20 animate-gradient" />

                  <div className="relative space-y-6">
                    {[
                      { title: 'Employee Onboarding', status: 'active', progress: 85 },
                      { title: 'Client Handoff Process', status: 'pending', progress: 60 },
                      { title: 'Emergency Protocols', status: 'review', progress: 100 }
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-3 w-3 rounded-full ${
                              item.status === 'active' ? 'bg-green-400 animate-pulse' :
                              item.status === 'pending' ? 'bg-yellow-400' : 'bg-blue-400'
                            }`} />
                            <span className="text-white font-medium">{item.title}</span>
                          </div>
                          <span className="text-white/60 text-sm">{item.progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 group-hover:from-purple-500 group-hover:to-indigo-500"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-indigo-500/30 blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-purple-500/30 blur-3xl" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ==================== USE CASES SECTION ==================== */}
      <section id="solutions" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                Built for <span className="text-gradient">Your Industry</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600">
                Tailored solutions for businesses that demand operational excellence
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              { icon: '🍽️', title: 'Restaurants & Hospitality', description: 'Standardize service protocols, kitchen procedures, and training.', features: ['Opening/closing procedures', 'Recipe standardization', 'Compliance tracking', 'Staff training'], gradient: 'from-orange-500 to-red-500' },
              { icon: '🏥', title: 'Healthcare & Clinics', description: 'Ensure consistent patient care with documented workflows.', features: ['Patient intake workflows', 'Treatment protocols', 'Equipment maintenance', 'Regulatory compliance'], gradient: 'from-blue-500 to-cyan-500' },
              { icon: '🎨', title: 'Agencies & Services', description: 'Streamline client onboarding and project delivery.', features: ['Client onboarding', 'Project templates', 'Quality assurance', 'Resource allocation'], gradient: 'from-purple-500 to-pink-500' },
              { icon: '🚀', title: 'Technology & Startups', description: 'Scale operations with documented playbooks.', features: ['Engineering workflows', 'Customer success', 'Sales processes', 'Incident response'], gradient: 'from-indigo-500 to-purple-500' }
            ].map((useCase, index) => (
              <AnimatedSection key={index} delay={index * 150}>
                <GlowingCard>
                  <div className="group h-full rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-indigo-200 hover:shadow-2xl card-hover overflow-hidden relative">
                    {/* Background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                    <div className="relative">
                      <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${useCase.gradient} text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        {useCase.icon}
                      </div>
                      <h3 className="mb-3 text-xl font-semibold text-slate-900">{useCase.title}</h3>
                      <p className="mb-6 text-slate-600">{useCase.description}</p>
                      <ul className="space-y-3">
                        {useCase.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-sm text-slate-600">
                            <svg className="h-5 w-5 text-indigo-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </GlowingCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="relative bg-gradient-to-b from-slate-50 to-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <div className="mx-auto max-w-7xl relative">
          <AnimatedSection>
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                Trusted by <span className="text-gradient-animated">Operations Leaders</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { quote: "Plantheory reduced our onboarding time from 3 weeks to 5 days. It's transformed how we scale.", author: 'Sarah Chen', role: 'COO, TechScale Solutions', company: '150 employees', avatar: 'SC' },
              { quote: "We finally have one source of truth for all our operations. No more hunting through Slack or Google Docs.", author: 'Michael Rodriguez', role: 'Operations Director, HealthFirst', company: '8 locations', avatar: 'MR' },
              { quote: "The ROI was immediate. We eliminated duplicate tool subscriptions worth $15K annually in the first month.", author: 'Emma Thompson', role: 'Head of Operations', company: '45 employees', avatar: 'ET' }
            ].map((testimonial, index) => (
              <AnimatedSection key={index} delay={index * 150}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 card-hover relative overflow-hidden group">
                  {/* Quote decoration */}
                  <div className="absolute -top-4 -left-4 text-8xl text-indigo-100 font-serif group-hover:text-indigo-200 transition-colors duration-300">"</div>

                  <div className="relative">
                    <div className="mb-6 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="mb-8 text-slate-700 leading-relaxed">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{testimonial.author}</p>
                        <p className="text-sm text-slate-600">{testimonial.role}</p>
                        <p className="text-sm text-slate-500">{testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECURITY SECTION ==================== */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-20 sm:px-6 sm:py-28 lg:px-8 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-soft delay-1000" />
        </div>

        <div className="mx-auto max-w-7xl relative">
          <AnimatedSection>
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Enterprise-Grade <span className="text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">Security</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-300">
                Built with security, privacy, and compliance at the core
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {[
              { icon: '🔐', title: 'SOC 2 Type II', description: 'Enterprise security certified' },
              { icon: '🛡️', title: 'GDPR & CCPA', description: 'Full data privacy compliance' },
              { icon: '🔑', title: 'SSO & 2FA', description: 'Advanced identity protection' },
              { icon: '📋', title: 'Audit Logs', description: 'Complete activity tracking' }
            ].map((feature, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="text-center group">
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-3xl backdrop-blur-sm border border-white/10 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300 group-hover:border-indigo-400/30">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PRICING SECTION ==================== */}
      <section id="pricing" className="scroll-mt-20 relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-50" />

        <div className="mx-auto max-w-7xl relative">
          <AnimatedSection>
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                Simple, <span className="text-gradient">Transparent Pricing</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600">
                Choose the plan that fits your organization
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              { name: 'Starter', price: 'Free', description: 'Perfect for small teams', features: ['Up to 10 playbooks', '5 team members', 'Basic tool directory', 'Email support'], cta: 'Get Started', highlighted: false, href: '/auth/signup' },
              { name: 'Professional', price: '$49', period: '/month', description: 'For growing businesses', features: ['Unlimited playbooks', '50 team members', 'Advanced tracking', 'Priority support', 'Analytics dashboard', 'Role permissions'], cta: 'Start Free Trial', highlighted: true, href: '/auth/signup' },
              { name: 'Enterprise', price: 'Custom', description: 'For large organizations', features: ['Everything in Pro', 'Unlimited members', 'Multi-location', 'SSO & security', 'Dedicated manager', 'Custom integrations'], cta: 'Contact Sales', highlighted: false, href: '#contact' }
            ].map((plan, index) => (
              <AnimatedSection key={index} delay={index * 150}>
                <div className={`relative h-full rounded-3xl border-2 p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? 'border-indigo-500 bg-white shadow-2xl shadow-indigo-500/20 scale-105 lg:scale-110'
                    : 'border-slate-200 bg-white hover:border-indigo-200 hover:shadow-xl'
                }`}>
                  {plan.highlighted && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                        </svg>
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="mb-8">
                    <h3 className="mb-2 text-xl font-semibold text-slate-900">{plan.name}</h3>
                    <div className="mb-3 flex items-baseline gap-1">
                      <span className={`text-5xl font-bold ${plan.highlighted ? 'text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text' : 'text-slate-900'}`}>{plan.price}</span>
                      {plan.period && <span className="text-slate-600">{plan.period}</span>}
                    </div>
                    <p className="text-sm text-slate-600">{plan.description}</p>
                  </div>
                  <ul className="mb-8 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-slate-600">
                        <svg className={`h-5 w-5 flex-shrink-0 ${plan.highlighted ? 'text-indigo-500' : 'text-emerald-500'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className={`block w-full rounded-full py-4 text-center font-semibold transition-all duration-300 ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105'
                        : 'border-2 border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700'
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

      {/* ==================== CTA SECTION ==================== */}
      <section id="contact" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 px-8 py-20 text-center shadow-2xl sm:px-16 sm:py-24">
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-float-slow" />
                <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-float-reverse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-white/5 blur-3xl animate-pulse-soft" />
              </div>

              {/* Grid overlay */}
              <div className="absolute inset-0 grid-pattern opacity-10" />

              <div className="relative">
                <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                  Ready to Transform Your Operations?
                </h2>
                <p className="mb-10 text-xl text-indigo-100">
                  Join hundreds of companies that have eliminated operational chaos
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link
                    href="/auth/signup"
                    className="group inline-flex items-center justify-center rounded-full bg-white px-8 py-4 font-semibold text-indigo-600 shadow-xl transition-all hover:bg-indigo-50 hover:scale-105 hover:shadow-2xl"
                  >
                    Start Free Trial
                    <svg className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    href="/demo/dashboard"
                    className="group inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/50"
                  >
                    <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Watch Demo
                  </Link>
                </div>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-indigo-100">
                  {['No credit card', 'Setup in minutes', 'Cancel anytime'].map((item, index) => (
                    <span key={index} className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-indigo-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-slate-100 bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
            <div className="sm:col-span-2">
              <Link href="/" className="mb-6 inline-block">
                <Image src="logo-text.svg" width={140} height={140} alt='plaintheory' />
              </Link>
              <p className="mb-6 max-w-sm text-sm text-slate-600 leading-relaxed">
                Transform operational chaos into clarity. The enterprise platform for operational excellence.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z', label: 'Twitter' },
                  { icon: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z', label: 'LinkedIn' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all hover:bg-indigo-100 hover:text-indigo-600 hover:scale-110"
                    aria-label={social.label}
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'Solutions', href: '#solutions' }, { label: 'Pricing', href: '#pricing' }] },
              { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Blog', href: '#' }, { label: 'Careers', href: '#' }] },
              { title: 'Resources', links: [{ label: 'Documentation', href: '#' }, { label: 'Help Center', href: '#' }, { label: 'Privacy', href: '#' }] }
            ].map((column, index) => (
              <div key={index}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        onClick={link.href.startsWith('#') ? (e) => scrollToSection(e, link.href) : undefined}
                        className="text-sm text-slate-600 hover:text-indigo-600 transition-colors underline-animated"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 border-t border-slate-100 pt-8">
            <p className="text-center text-sm text-slate-500">
              © 2026 Plantheory. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ==================== MOBILE STICKY CTA ==================== */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-xl transition-transform duration-500 lg:hidden ${
        scrolled ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <Link
          href="/auth/signup"
          className="block w-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 py-4 text-center text-base font-semibold text-white shadow-lg"
        >
          Get Started Free
        </Link>
      </div>
    </div>
  )
}
