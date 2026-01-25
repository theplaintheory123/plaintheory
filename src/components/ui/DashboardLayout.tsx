'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signout } from '@/app/auth/actions'
import Image from 'next/image'
import { useState } from 'react'
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

  const userInitial = user.user_metadata?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'
  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User'
  const userEmail = user.email || ''

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <div className="flex h-screen bg-[#fafafa]">
      {/* Desktop Sidebar */}
      <aside className="hidden w-[280px] flex-col border-r border-neutral-200 bg-white lg:flex">
        {/* Logo Section */}
        <div className="flex h-[60px] items-center justify-between border-b border-neutral-100 px-5">
          <Link href="/dashboard" className="flex items-center">
            <Image src="/logo-text.svg" width={130} height={30} alt="plaintheory" priority />
          </Link>
        </div>

        {/* Create Button */}
        <div className="p-4">
          <Link
            href="/playbooks/new"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-neutral-800 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            New Playbook
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto px-3">
          <div className="space-y-0.5">
            {mainNavigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${
                    active
                      ? 'bg-neutral-100 text-neutral-900'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] transition-colors ${
                      active ? 'text-neutral-900' : 'text-neutral-400 group-hover:text-neutral-600'
                    }`}
                    strokeWidth={2}
                  />
                  {item.name}
                  {active && (
                    <ChevronRight className="ml-auto h-4 w-4 text-neutral-400" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-neutral-100" />

          {/* Bottom Navigation */}
          <div className="space-y-0.5">
            {bottomNavigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${
                    active
                      ? 'bg-neutral-100 text-neutral-900'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] transition-colors ${
                      active ? 'text-neutral-900' : 'text-neutral-400 group-hover:text-neutral-600'
                    }`}
                    strokeWidth={2}
                  />
                  {item.name}
                </Link>
              )
            })}
            <a
              href="mailto:support@plaintheory.com"
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-neutral-600 transition-all hover:bg-neutral-50 hover:text-neutral-900"
            >
              <HelpCircle className="h-[18px] w-[18px] text-neutral-400 transition-colors group-hover:text-neutral-600" strokeWidth={2} />
              Help & Support
            </a>
          </div>
        </nav>

        {/* User Section */}
        <div className="border-t border-neutral-100 p-3">
          <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-neutral-50">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-[13px] font-semibold text-white shadow-sm">
                {userInitial}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-[13px] font-medium text-neutral-900">{userName}</p>
              <p className="truncate text-[11px] text-neutral-500">{userEmail}</p>
            </div>
          </div>
          <form action={signout} className="mt-1">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-neutral-500 transition-all hover:bg-neutral-50 hover:text-neutral-700"
            >
              <LogOut className="h-[18px] w-[18px]" strokeWidth={2} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4 lg:hidden">
        <Link href="/dashboard">
          <Image src="/logo-text.svg" width={110} height={26} alt="plaintheory" priority />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/playbooks/new"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-[300px] bg-white shadow-2xl">
            <div className="flex h-14 items-center justify-between border-b border-neutral-100 px-4">
              <span className="text-[15px] font-semibold text-neutral-900">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="p-3">
              {mainNavigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-[14px] font-medium transition-all ${
                      active
                        ? 'bg-neutral-100 text-neutral-900'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? 'text-neutral-900' : 'text-neutral-400'}`} strokeWidth={2} />
                    {item.name}
                  </Link>
                )
              })}
              <div className="my-3 border-t border-neutral-100" />
              {bottomNavigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-[14px] font-medium transition-all ${
                      active
                        ? 'bg-neutral-100 text-neutral-900'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? 'text-neutral-900' : 'text-neutral-400'}`} strokeWidth={2} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            <div className="absolute inset-x-0 bottom-0 border-t border-neutral-100 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-[14px] font-semibold text-white">
                  {userInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[14px] font-medium text-neutral-900">{userName}</p>
                  <p className="truncate text-[12px] text-neutral-500">{userEmail}</p>
                </div>
              </div>
              <form action={signout}>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-100 px-4 py-2.5 text-[14px] font-medium text-neutral-700 transition-colors hover:bg-neutral-200"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white lg:hidden">
        <div className="flex h-16 items-center justify-around px-2">
          {mainNavigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-1 py-2 ${
                  active ? 'text-neutral-900' : 'text-neutral-400'
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            )
          })}
          <Link
            href="/settings"
            className={`flex flex-1 flex-col items-center gap-1 py-2 ${
              isActive('/settings') ? 'text-neutral-900' : 'text-neutral-400'
            }`}
          >
            <Settings className="h-5 w-5" strokeWidth={isActive('/settings') ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Settings</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1200px] px-6 pb-24 pt-20 lg:px-8 lg:pb-8 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
