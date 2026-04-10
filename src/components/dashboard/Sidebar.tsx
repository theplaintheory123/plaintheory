import { NavContent } from "./NavContent";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-zinc-200 bg-white h-screen sticky top-0">
      <NavContent />
    </aside>
  );
}
