"use client";

import { useEffect, useState } from "react";
import { CardContent, CardHeader } from "@/components/ui/Card";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

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
      .then((d) => setTasksDone((d.tasks || []).filter((t: any) => t.completed).length))
      .catch(() => {});
  }, []);

  const timeStr = time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
  const dayOfYear = Math.floor((time.getTime() - new Date(time.getFullYear(), 0, 0).getTime()) / 86400000);
  const daysInYear = time.getFullYear() % 4 === 0 ? 366 : 365;
  const yearProgress = Math.round((dayOfYear / daysInYear) * 100);
  const daysLeft = daysInYear - dayOfYear;

  return (
    <>
      <CardHeader className="border-b border-stone-100 pb-3 pt-4">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-stone-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Status</span>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        {/* Clock */}
        <div>
          <p className="font-mono text-3xl font-light tracking-tight text-stone-900">{timeStr}</p>
          <p className="mt-0.5 text-xs text-stone-400">
            {time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Year Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>{time.getFullYear()} progress</span>
            <span className="font-medium text-stone-600">{yearProgress}%</span>
          </div>
          <Progress value={yearProgress} className="h-1.5 bg-stone-100 [&>div]:bg-[#C2786B]" />
          <p className="text-[10px] text-stone-300">{daysLeft} days remaining</p>
        </div>

        {/* Tasks done */}
        {tasksDone !== null && (
          <div className="flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3">
            <span className="text-xs text-stone-500">Tasks completed</span>
            <span className="text-xl font-light text-[#C2786B]">{tasksDone}</span>
          </div>
        )}
      </CardContent>
    </>
  );
}
