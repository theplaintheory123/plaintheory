import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import WeatherWidget from "@/components/widgets/weather/WeatherWidget";
import CalendarWidget from "@/components/widgets/calendar/CalendarWidget";
import TasksWidget from "@/components/widgets/tasks/TasksWidget";
import NotesWidget from "@/components/widgets/notes/NotesWidget";
import FocusWidget from "@/components/widgets/focus/FocusWidget";
import HabitsWidget from "@/components/widgets/habits/HabitsWidget";
import BookmarksWidget from "@/components/widgets/bookmarks/BookmarksWidget";
import StatusWidget from "@/components/widgets/status/StatusWidget";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/Card";

function WidgetCard({
  children,
  className = "",
  fallback,
}: {
  children: React.ReactNode;
  className?: string;
  fallback?: React.ReactNode;
}) {
  return (
    <Card className={`overflow-hidden border border-stone-200 bg-white shadow-none rounded-2xl ${className}`}>
      <Suspense
        fallback={
          fallback ?? (
            <div className="p-5 space-y-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          )
        }
      >
        {children}
      </Suspense>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-4">

      {/* Row 1 — 3 equal columns on lg, 2 on md, 1 on sm */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <WidgetCard>
          <StatusWidget />
        </WidgetCard>

        <WidgetCard>
          <WeatherWidget />
        </WidgetCard>

        <WidgetCard className="md:col-span-2 lg:col-span-1">
          <CalendarWidget />
        </WidgetCard>
      </div>

      {/* Row 2 — Tasks wide, Focus, Habits */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <WidgetCard className="md:row-span-1 lg:col-span-1">
          <TasksWidget />
        </WidgetCard>

        <WidgetCard>
          <FocusWidget />
        </WidgetCard>

        <WidgetCard>
          <HabitsWidget />
        </WidgetCard>
      </div>

      {/* Row 3 — Notes wide + Bookmarks */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <WidgetCard className="md:col-span-2">
          <NotesWidget />
        </WidgetCard>

        <WidgetCard>
          <BookmarksWidget />
        </WidgetCard>
      </div>

    </div>
  );
}
