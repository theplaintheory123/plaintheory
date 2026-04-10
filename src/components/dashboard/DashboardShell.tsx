"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { NavContent } from "./NavContent";
import { MobileNavProvider, useMobileNav } from "@/context/MobileNavContext";

function MobileDrawer() {
  const { open, setOpen } = useMobileNav();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-60 p-0 bg-white border-r border-zinc-200">
        <NavContent onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <MobileNavProvider>
      <MobileDrawer />
      {children}
    </MobileNavProvider>
  );
}
