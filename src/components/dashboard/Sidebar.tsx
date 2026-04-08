"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CheckSquare, FileText, Timer, Activity, Bookmark, BarChart3, Settings, LogOut, Sun } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/app", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/app#tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/app#notes", icon: FileText, label: "Notes" },
  { href: "/app#focus", icon: Timer, label: "Focus" },
  { href: "/app#habits", icon: Activity, label: "Habits" },
  { href: "/app#bookmarks", icon: Bookmark, label: "Bookmarks" },
  { href: "/app/reports", icon: BarChart3, label: "Reports" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearSession } = useAuth();

  async function handleSignOut() {
    await clearSession();
    router.push("/sign-in");
  }

  return (
    <aside className="hidden md:flex flex-col w-[220px] min-h-screen bg-white border-r border-[#1A1817]/6 px-4 py-6 shrink-0">
      {/* Logo */}
      <div className="mb-8 px-2">
        <span className="font-mono text-base font-light tracking-tight text-[#1A1817]">plaintheory</span>
        <span className="ml-1.5 rounded-full bg-[#1A1817]/5 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-[#1A1817]/40">LifeOS</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/app" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                active
                  ? "bg-[#C2786B]/10 text-[#C2786B] font-medium"
                  : "text-[#1A1817]/60 hover:bg-[#1A1817]/4 hover:text-[#1A1817]"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-4 flex flex-col gap-0.5 border-t border-[#1A1817]/6 pt-4">
        <Link href="/app/settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#1A1817]/60 hover:bg-[#1A1817]/4 hover:text-[#1A1817] transition-all">
          <Settings size={16} />
          Settings
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#1A1817]/60 hover:bg-red-50 hover:text-red-500 transition-all text-left"
        >
          <LogOut size={16} />
          Sign out
        </button>

        {user && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#FAF8F5] px-3 py-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C2786B]/20 text-xs font-medium text-[#C2786B]">
              {(user.name || user.email)[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-[#1A1817]">{user.name || "You"}</p>
              <p className="truncate text-[10px] text-[#1A1817]/40">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
