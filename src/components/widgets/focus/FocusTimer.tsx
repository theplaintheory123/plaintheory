"use client";

import { useTimer } from "@/hooks/useTimer";
import { CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";

export default function FocusTimer({ focusDuration, breakDuration, initialSessionsToday = 0 }: {
  focusDuration: number;
  breakDuration: number;
  initialSessionsToday?: number;
}) {
  const { state, display, progress, start, pause, reset } = useTimer({
    focusDuration,
    breakDuration,
    onFocusComplete: async (dur) => {
      await fetch("/api/focus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ durationMinutes: dur }),
      });
    },
  });

  const isBreak = state.status === "break";
  const isRunning = state.status === "running";
  const totalSessions = state.sessionsToday + initialSessionsToday;

  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - progress);

  return (
    <>
      <CardHeader className="border-b border-stone-100 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer size={14} className="text-stone-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Focus</span>
          </div>
          {totalSessions > 0 && (
            <span className="text-[10px] font-medium text-stone-400">
              {totalSessions} session{totalSessions !== 1 ? "s" : ""} today
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center gap-5 py-6 px-4">
        {/* Ring */}
        <div className="relative">
          <svg width="130" height="130" className="-rotate-90">
            <circle cx="65" cy="65" r={r} fill="none" stroke={isBreak ? "#e7e5e4" : "#f5f5f4"} strokeWidth="5" />
            <circle
              cx="65" cy="65" r={r}
              fill="none"
              stroke={isBreak ? "#a8a29e" : "#C2786B"}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={dash}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-2xl font-light tracking-tighter text-stone-800">{display}</span>
            <span className={`text-[10px] font-semibold uppercase tracking-wider mt-0.5 ${isBreak ? "text-stone-400" : "text-[#C2786B]"}`}>
              {isBreak ? "break" : "focus"}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={reset}
            className="h-9 w-9 rounded-xl text-stone-400 hover:text-stone-600"
          >
            <RotateCcw size={15} />
          </Button>
          <Button
            onClick={isRunning ? pause : start}
            className="h-11 w-11 rounded-full bg-[#C2786B] text-white shadow-sm hover:bg-[#C2786B]/85"
            size="icon"
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
          </Button>
          <div className="w-9" />
        </div>

        {/* Session dots */}
        {totalSessions > 0 && (
          <div className="flex gap-1.5">
            {Array.from({ length: Math.min(totalSessions, 8) }).map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-[#C2786B]/40" />
            ))}
          </div>
        )}
      </CardContent>
    </>
  );
}
