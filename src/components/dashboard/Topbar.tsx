import { getGreeting } from "@/lib/utils";
import { getSessionUser } from "@/lib/auth/session";
import Link from "next/link";
import { Bell, Search } from "lucide-react";

export default async function Topbar() {
  const user = await getSessionUser();
  const greeting = getGreeting(user?.name);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="flex items-center justify-between border-b border-[#1A1817]/6 bg-white/80 px-6 py-4 backdrop-blur-sm">
      <div>
        <p className="text-xs text-[#1A1817]/40 uppercase tracking-wider">{today}</p>
        <h2 className="text-xl font-light text-[#1A1817] tracking-tight">{greeting}</h2>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/app/reports"
          className="rounded-xl border border-[#C2786B]/30 bg-[#C2786B]/8 px-3 py-1.5 text-xs font-medium text-[#C2786B] transition hover:bg-[#C2786B]/15"
        >
          Reports
        </Link>
      </div>
    </header>
  );
}
