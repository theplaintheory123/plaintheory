'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signout } from '@/app/auth/actions'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  ChevronRight,
  HelpCircle,
  Bell,
  ChevronDown,
  User,
  Shield,
  ExternalLink,
} from 'lucide-react'

type User = {
  email?: string
  user_metadata?: {
    name?: string
    avatar_url?: string
  }
}

type DashboardLayoutProps = {
  children: React.ReactNode
  user: User
}

const mainNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Playbooks', href: '/playbooks', icon: BookOpen },
  { name: 'Templates', href: '/templates', icon: Layers },
  { name: 'Search', href: '/search', icon: Search },
]

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const userInitial = user.user_metadata?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'
  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User'
  const userEmail = user.email || ''

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-slate-100 px-6">
          <Link href="/dashboard" className="flex items-center">
            <Image src="/logo-text.svg" width={120} height={28} alt="plaintheory" priority />
          </Link>
        </div>

        {/* Create Button */}
        <div className="p-4">
          <Link
            href="/playbooks/new"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/25 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            New Playbook
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <div className="space-y-1">
            {mainNavigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                    strokeWidth={active ? 2 : 1.75}
                  />
                  {item.name}
                  {active && (
                    <ChevronRight className="ml-auto h-4 w-4 text-indigo-400" />
                  )}
                </Link>
              )
            })}
          </div>

          <div className="my-4 border-t border-slate-100" />

          <div className="space-y-1">
            {bottomNavigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                    strokeWidth={active ? 2 : 1.75}
                  />
                  {item.name}
                </Link>
              )
            })}
            <a
              href="mailto:support@plaintheory.com"
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900"
            >
              <HelpCircle className="h-5 w-5 text-slate-400 transition-colors group-hover:text-slate-600" strokeWidth={1.75} />
              Help & Support
            </a>
          </div>
        </nav>

        {/* User Section */}
        <div className="border-t border-slate-100 p-4" ref={userMenuRef}>
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex w-full items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50"
            >
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-md">
                  {userInitial}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="truncate text-sm font-medium text-slate-900">{userName}</p>
                <p className="truncate text-xs text-slate-500">{userEmail}</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                <Link
                  href="/settings?tab=profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <User className="h-4 w-4 text-slate-400" strokeWidth={2} />
                  Your Profile
                </Link>
                <Link
                  href="/settings?tab=workspace"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <Shield className="h-4 w-4 text-slate-400" strokeWidth={2} />
                  Workspace Settings
                </Link>
                <a
                  href="mailto:support@plaintheory.com"
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <HelpCircle className="h-4 w-4 text-slate-400" strokeWidth={2} />
                  Help & Support
                </a>
                <div className="my-2 border-t border-slate-100" />
                <form action={signout}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={2} />
                    Sign out
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl lg:hidden">
        <Link href="/dashboard">
          <Image src="/logo-text.svg" width={110} height={26} alt="plaintheory" priority />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/playbooks/new"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100"
          >
            <Menu className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl">
            {/* Menu Header */}
            <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
              <span className="text-base font-semibold text-slate-900">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            {/* Menu Navigation */}
            <nav className="p-4">
              <div className="space-y-1">
                {mainNavigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all ${
                        active
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${active ? 'text-indigo-600' : 'text-slate-400'}`}
                        strokeWidth={active ? 2 : 1.75}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </div>

              <div className="my-4 border-t border-slate-100" />

              <div className="space-y-1">
                {bottomNavigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all ${
                        active
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${active ? 'text-indigo-600' : 'text-slate-400'}`}
                        strokeWidth={active ? 2 : 1.75}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </nav>

            {/* User Section */}
            <div className="absolute inset-x-0 bottom-0 border-t border-slate-100 p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-base font-semibold text-white shadow-md">
                  {userInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-base font-medium text-slate-900">{userName}</p>
                  <p className="truncate text-sm text-slate-500">{userEmail}</p>
                </div>
              </div>
              <form action={signout}>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-200"
                >
                  <LogOut className="h-5 w-5" strokeWidth={1.75} />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden">
        <div className="flex h-16 items-center justify-around px-2">
          {mainNavigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-1 py-2 transition-colors ${
                  active ? 'text-indigo-600' : 'text-slate-400'
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-semibold">{item.name}</span>
              </Link>
            )
          })}
          <Link
            href="/settings"
            className={`flex flex-1 flex-col items-center gap-1 py-2 transition-colors ${
              isActive('/settings') ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <Settings className="h-5 w-5" strokeWidth={isActive('/settings') ? 2.5 : 2} />
            <span className="text-[10px] font-semibold">Settings</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
