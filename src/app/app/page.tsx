import { Suspense } from "react";
import WeatherWidget from "@/components/widgets/weather/WeatherWidget";
import CalendarWidget from "@/components/widgets/calendar/CalendarWidget";
import TasksWidget from "@/components/widgets/tasks/TasksWidget";
import NotesWidget from "@/components/widgets/notes/NotesWidget";
import FocusWidget from "@/components/widgets/focus/FocusWidget";
import HabitsWidget from "@/components/widgets/habits/HabitsWidget";
import BookmarksWidget from "@/components/widgets/bookmarks/BookmarksWidget";
import StatusWidget from "@/components/widgets/status/StatusWidget";

function WidgetShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[#1A1817]/6 bg-white p-5 ${className}`}>
      {children}
    </div>
  );
}

function WidgetSkeleton({ height = "h-48" }: { height?: string }) {
  return (
    <div className={`rounded-2xl border border-[#1A1817]/6 bg-white p-5 ${height} animate-pulse`}>
      <div className="mb-4 h-2 w-16 rounded-full bg-[#1A1817]/5" />
      <div className="space-y-2">
        <div className="h-3 w-3/4 rounded-full bg-[#1A1817]/5" />
        <div className="h-3 w-1/2 rounded-full bg-[#1A1817]/5" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-auto">

      {/* Row 1: Status (narrow), Weather (medium), Calendar (medium) */}
      <WidgetShell className="h-56 id-status">
        <StatusWidget />
      </WidgetShell>

      <WidgetShell className="h-56">
        <Suspense fallback={<div className="h-full animate-pulse bg-[#1A1817]/3 rounded-xl" />}>
          <WeatherWidget />
        </Suspense>
      </WidgetShell>

      <WidgetShell className="h-56">
        <CalendarWidget />
      </WidgetShell>

      {/* Row 2: Tasks (large), Focus (small), Habits (medium) */}
      <WidgetShell className="h-80 sm:col-span-2 lg:col-span-1 id-tasks">
        <Suspense fallback={<div className="h-full animate-pulse bg-[#1A1817]/3 rounded-xl" />}>
          <TasksWidget />
        </Suspense>
      </WidgetShell>

      <WidgetShell className="h-80 id-focus">
        <Suspense fallback={<div className="h-full animate-pulse bg-[#1A1817]/3 rounded-xl" />}>
          <FocusWidget />
        </Suspense>
      </WidgetShell>

      <WidgetShell className="h-80 id-habits">
        <Suspense fallback={<div className="h-full animate-pulse bg-[#1A1817]/3 rounded-xl" />}>
          <HabitsWidget />
        </Suspense>
      </WidgetShell>

      {/* Row 3: Notes (large), Bookmarks (medium) */}
      <WidgetShell className="h-72 sm:col-span-2 id-notes">
        <Suspense fallback={<div className="h-full animate-pulse bg-[#1A1817]/3 rounded-xl" />}>
          <NotesWidget />
        </Suspense>
      </WidgetShell>

      <WidgetShell className="h-72 id-bookmarks">
        <Suspense fallback={<div className="h-full animate-pulse bg-[#1A1817]/3 rounded-xl" />}>
          <BookmarksWidget />
        </Suspense>
      </WidgetShell>

    </div>
  );
}
