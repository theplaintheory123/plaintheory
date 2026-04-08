"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Menu } from "lucide-react";
import Link from "next/link";

function getGreeting(name?: string) {
  const hour = new Date().getHours();
  const base = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return name ? `${base}, ${name.split(" ")[0]}` : base;
}

export default function Topbar() {
  const [greeting, setGreeting] = useState("Welcome back");
  const [dateStr, setDateStr] = useState("");
  const [name, setName] = useState<string | undefined>();

  useEffect(() => {
    fetch("/api/auth/user")
      .then((r) => r.json())
      .then((d) => setName(d.user?.name));
  }, []);

  useEffect(() => {
    setGreeting(getGreeting(name));
    setDateStr(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    );
  }, [name]);

  function openMobileSidebar() {
    document.getElementById("mobile-menu-btn")?.click();
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-stone-200 bg-white/90 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={openMobileSidebar}>
          <Menu size={18} />
        </Button>
        <div>
          <h1 className="text-sm font-semibold text-stone-900 leading-tight">{greeting}</h1>
          <p className="hidden text-[11px] text-stone-400 sm:block">{dateStr}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/app/reports">
          <Button variant="outline" size="sm" className="h-8 text-xs rounded-full border-[#C2786B]/30 text-[#C2786B] hover:bg-[#C2786B]/8 hover:text-[#C2786B]">
            Reports
          </Button>
        </Link>
      </div>
    </header>
  );
}
