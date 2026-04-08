"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/Button";
import { Menu, LayoutDashboard, CheckSquare, FileText, Timer, Activity, Bookmark, BarChart3, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

function NavLinks({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearSession } = useAuth();

  async function handleSignOut() {
    await clearSession();
    router.push("/sign-in");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-0.5 py-2">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === "/app" ? href === "/app" : pathname.startsWith(href) && href !== "/app";
          return (
            <Link
              key={label}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-[#C2786B]/12 text-[#C2786B]"
                  : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
              }`}
            >
              <Icon size={16} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-stone-100 pt-3 space-y-0.5">
        <Link
          href="/app/settings"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-all"
        >
          <Settings size={16} className="shrink-0" />
          Settings
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={16} className="shrink-0" />
          Sign out
        </button>

        {user && (
          <div className="mt-2 flex items-center gap-3 rounded-xl bg-stone-50 px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C2786B]/15 text-sm font-semibold text-[#C2786B]">
              {(user.name || user.email)[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-stone-700">{user.name || "You"}</p>
              <p className="truncate text-[10px] text-stone-400">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function MobileMenuTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="icon" className="md:hidden h-9 w-9" onClick={onClick}>
      <Menu size={18} />
    </Button>
  );
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Sheet Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-4 bg-white">
          <SheetHeader className="mb-4 text-left">
            <SheetTitle className="flex items-center gap-2">
              <span className="font-mono text-base font-light tracking-tight text-stone-900">plaintheory</span>
              <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-stone-400">LifeOS</span>
            </SheetTitle>
          </SheetHeader>
          <NavLinks onClose={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Mobile topbar hamburger — passed via context via data attribute */}
      <div id="mobile-menu-trigger" data-open={open} className="hidden" />

      {/* Pass the open setter to topbar via a global custom event */}
      <button
        id="mobile-menu-btn"
        className="hidden"
        onClick={() => setOpen(true)}
      />

      {children}
    </>
  );
}

export { NavLinks };
