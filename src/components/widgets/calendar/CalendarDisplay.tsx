"use client";

import { useEffect, useState } from "react";
import { CalendarEvent } from "@/types";
import { Calendar, ExternalLink } from "lucide-react";

export default function CalendarDisplay() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/calendar")
      .then((r) => r.json())
      .then((d) => {
        setEvents(d.events || []);
        setNeedsSetup(!!d.needsSetup);
      })
      .finally(() => setLoading(false));
  }, []);

  function formatTime(iso: string, allDay: boolean) {
    if (allDay) return "All day";
    return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }

  function formatDay(iso: string, allDay: boolean) {
    const d = allDay ? new Date(iso + "T00:00:00") : new Date(iso);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }

  // Group by day
  const grouped = events.reduce<Record<string, CalendarEvent[]>>((acc, ev) => {
    const key = formatDay(ev.start, ev.allDay);
    if (!acc[key]) acc[key] = [];
    acc[key].push(ev);
    return acc;
  }, {});

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-[#1A1817]/40">Calendar</h3>
        {needsSetup && (
          <a href="/app/settings" className="text-[10px] text-[#C2786B] hover:underline">Connect →</a>
        )}
      </div>

      {loading && (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-5 w-5 rounded-full border-2 border-[#C2786B]/30 border-t-[#C2786B] animate-spin" />
        </div>
      )}

      {!loading && needsSetup && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <Calendar size={24} className="text-[#1A1817]/10" />
          <p className="text-sm text-[#1A1817]/30">Connect Google Calendar</p>
          <a href="/app/settings" className="text-xs text-[#C2786B] hover:underline">Settings →</a>
        </div>
      )}

      {!loading && !needsSetup && events.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <Calendar size={24} className="text-[#1A1817]/10" />
          <p className="text-sm text-[#1A1817]/30">No upcoming events</p>
        </div>
      )}

      {!loading && Object.keys(grouped).length > 0 && (
        <div className="flex-1 overflow-y-auto space-y-4">
          {Object.entries(grouped).map(([day, dayEvents]) => (
            <div key={day}>
              <p className="mb-2 text-[10px] uppercase tracking-wider text-[#1A1817]/30 font-medium">{day}</p>
              <div className="space-y-1.5">
                {dayEvents.map((ev) => (
                  <div key={ev.id} className="flex items-start gap-2.5 rounded-xl bg-white px-3 py-2.5">
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#C2786B]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-[#1A1817]">{ev.title}</p>
                      <p className="text-[10px] text-[#1A1817]/40">{formatTime(ev.start, ev.allDay)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
