"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, CheckSquare, FileText, Timer, Activity,
  Bookmark, Target, DollarSign, BarChart3, Settings, LogOut,
} from "lucide-react";

const GROUPS = [
  {
    label: null,
    items: [{ href: "/app", icon: LayoutDashboard, label: "Dashboard" }],
  },
  {
    label: "Workspace",
    items: [
      { href: "/app/tasks", icon: CheckSquare, label: "Tasks" },
      { href: "/app/notes", icon: FileText, label: "Notes" },
      { href: "/app/focus", icon: Timer, label: "Focus" },
      { href: "/app/habits", icon: Activity, label: "Habits" },
    ],
  },
  {
    label: "Manage",
    items: [
      { href: "/app/goals", icon: Target, label: "Goals" },
      { href: "/app/bookmarks", icon: Bookmark, label: "Bookmarks" },
      { href: "/app/expenses", icon: DollarSign, label: "Expenses" },
    ],
  },
];

const BOTTOM = [
  { href: "/app/reports", icon: BarChart3, label: "Reports" },
  { href: "/app/settings", icon: Settings, label: "Settings" },
];

export function NavContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearSession } = useAuth();

  function isActive(href: string) {
    if (href === "/app") return pathname === "/app";
    return pathname.startsWith(href);
  }

  async function signOut() {
    await clearSession();
    router.push("/sign-in");
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center border-b border-zinc-100 px-5">
        <Link href="/app" onClick={onClose} className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-zinc-900">plaintheory</span>
          <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">OS</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {GROUPS.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-4" : ""}>
            {group.label && (
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                {group.label}
              </p>
            )}
            {group.items.map(({ href, icon: Icon, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={`mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <Icon size={15} className="shrink-0" />
                  {label}
                </Link>
              );
            })}
          </div>
        ))}

        <div className="mt-4 border-t border-zinc-100 pt-4">
          {BOTTOM.map(({ href, icon: Icon, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <Icon size={15} className="shrink-0" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User */}
      {user && (
        <div className="shrink-0 border-t border-zinc-100 p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-semibold text-white">
              {(user.name || user.email)[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-zinc-900">{user.name || "You"}</p>
              <p className="truncate text-[10px] text-zinc-400">{user.email}</p>
            </div>
            <button
              onClick={signOut}
              className="text-zinc-400 hover:text-zinc-700 transition-colors"
              title="Sign out"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
