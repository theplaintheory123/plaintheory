"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useMobileNav } from "@/context/MobileNavContext";

const TITLES: Record<string, string> = {
  "/app": "Dashboard",
  "/app/tasks": "Tasks",
  "/app/notes": "Notes",
  "/app/focus": "Focus",
  "/app/habits": "Habits",
  "/app/goals": "Goals",
  "/app/bookmarks": "Bookmarks",
  "/app/expenses": "Expenses",
  "/app/reports": "Reports",
  "/app/settings": "Settings",
};

export default function Topbar() {
  const pathname = usePathname();
  const { setOpen } = useMobileNav();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/user")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {});
  }, []);

  const title = TITLES[pathname] ?? "plaintheory";
  const initial = user ? (user.name || user.email || "U")[0].toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors md:hidden"
        >
          <Menu size={16} />
        </button>
        <span className="text-sm font-semibold text-zinc-900">{title}</span>
      </div>

      {user && (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-semibold text-white">
          {initial}
        </div>
      )}
    </header>
  );
}
