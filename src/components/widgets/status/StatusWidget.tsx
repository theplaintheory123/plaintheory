"use client";

import { useEffect, useState } from "react";

export default function StatusWidget() {
  const [time, setTime] = useState(new Date());
  const [tasksDone, setTasksDone] = useState<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then((d) => {
        const done = (d.tasks || []).filter((t: any) => t.completed).length;
        setTasksDone(done);
      })
      .catch(() => {});
  }, []);

  const dayOfWeek = time.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = time.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const timeStr = time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const dayOfYear = Math.floor(
    (time.getTime() - new Date(time.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const daysInYear = time.getFullYear() % 4 === 0 ? 366 : 365;
  const yearProgress = Math.round((dayOfYear / daysInYear) * 100);

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-[#1A1817]/40">Status</h3>

      <div className="flex-1 flex flex-col justify-between">
        {/* Clock */}
        <div>
          <p className="font-mono text-4xl font-light text-[#1A1817] tracking-tight">{timeStr}</p>
          <p className="mt-1 text-sm text-[#1A1817]/50">{dayOfWeek}, {dateStr}</p>
        </div>

        {/* Year progress */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs text-[#1A1817]/40">
            <span>Year {time.getFullYear()}</span>
            <span>{yearProgress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#1A1817]/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#C2786B] transition-all"
              style={{ width: `${yearProgress}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] text-[#1A1817]/30">{daysInYear - dayOfYear} days left this year</p>
        </div>

        {/* Quick stats */}
        {tasksDone !== null && (
          <div className="rounded-xl bg-[#FAF8F5] px-3 py-2.5">
            <p className="text-xs text-[#1A1817]/40">Tasks completed</p>
            <p className="text-2xl font-light text-[#C2786B]">{tasksDone}</p>
          </div>
        )}
      </div>
    </div>
  );
}
