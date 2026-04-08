"use client";

import { useEffect, useState } from "react";
import { CalendarEvent } from "@/types";
import { CardContent, CardHeader } from "@/components/ui/Card";
import { Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarDisplay() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/calendar")
      .then((r) => r.json())
      .then((d) => { setEvents(d.events || []); setNeedsSetup(!!d.needsSetup); })
      .finally(() => setLoading(false));
  }, []);

  function formatTime(iso: string, allDay: boolean) {
    if (allDay) return "All day";
    return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }

  function dayLabel(iso: string, allDay: boolean) {
    const d = allDay ? new Date(iso + "T00:00:00") : new Date(iso);
    const today = new Date();
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }

  const grouped = events.reduce<Record<string, CalendarEvent[]>>((acc, ev) => {
    const k = dayLabel(ev.start, ev.allDay);
    (acc[k] ??= []).push(ev);
    return acc;
  }, {});

  return (
    <>
      <CardHeader className="border-b border-stone-100 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-stone-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Calendar</span>
          </div>
          {needsSetup && (
            <a href="/app/settings" className="text-[10px] font-medium text-[#C2786B] hover:underline">Connect →</a>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {loading && (
          <div className="space-y-3 py-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        )}

        {!loading && needsSetup && (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <Calendar size={28} className="text-stone-200" />
            <p className="text-sm text-stone-400">Connect Google Calendar</p>
            <a href="/app/settings" className="text-xs text-[#C2786B] hover:underline">Settings →</a>
          </div>
        )}

        {!loading && !needsSetup && events.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <Calendar size={28} className="text-stone-200" />
            <p className="text-sm text-stone-400">No upcoming events</p>
          </div>
        )}

        {!loading && Object.keys(grouped).length > 0 && (
          <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
            {Object.entries(grouped).map(([day, dayEvents]) => (
              <div key={day}>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-400">{day}</p>
                <div className="space-y-1">
                  {dayEvents.map((ev) => (
                    <div key={ev.id} className="flex items-center gap-3 rounded-xl bg-stone-50 px-3 py-2.5 hover:bg-stone-100 transition">
                      <div className="h-2 w-2 shrink-0 rounded-full bg-[#C2786B]" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-stone-700">{ev.title}</p>
                        <p className="text-[10px] text-stone-400">{formatTime(ev.start, ev.allDay)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </>
  );
}
