import Link from "next/link";
import { NavLinks } from "./DashboardShell";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-stone-200 bg-white px-4 py-5">
      {/* Logo */}
      <div className="mb-6 flex items-center gap-2 px-2">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-mono text-base font-light tracking-tight text-stone-900">plaintheory</span>
          <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-stone-400">LifeOS</span>
        </Link>
      </div>
      <NavLinks />
    </aside>
  );
}
