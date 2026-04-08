"use client";

import { useTimer } from "@/hooks/useTimer";
import { Play, Pause, RotateCcw } from "lucide-react";

interface Props {
  focusDuration: number;
  breakDuration: number;
  initialSessionsToday?: number;
}

export default function FocusTimer({ focusDuration, breakDuration, initialSessionsToday = 0 }: Props) {
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
  const isPaused = state.status === "paused";

  const r = 54;
  const circumference = 2 * Math.PI * r;
  const dash = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      {/* Ring */}
      <div className="relative">
        <svg width="140" height="140" className="-rotate-90">
          <circle cx="70" cy="70" r={r} fill="none" stroke="#1A1817" strokeOpacity="0.05" strokeWidth="6" />
          <circle
            cx="70" cy="70" r={r}
            fill="none"
            stroke={isBreak ? "#A88B7D" : "#C2786B"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dash}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl font-light text-[#1A1817] tracking-tight">{display}</span>
          <span className="mt-1 text-[10px] uppercase tracking-wider text-[#1A1817]/30">
            {isBreak ? "break" : "focus"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="rounded-xl p-2 text-[#1A1817]/30 hover:bg-[#1A1817]/5 hover:text-[#1A1817] transition"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={isRunning ? pause : start}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C2786B] text-white shadow-sm hover:bg-[#C2786B]/80 transition"
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>

      {/* Sessions today */}
      <div className="text-center">
        <p className="text-xs text-[#1A1817]/40">
          {state.sessionsToday + initialSessionsToday} session{state.sessionsToday + initialSessionsToday !== 1 ? "s" : ""} today
        </p>
      </div>
    </div>
  );
}
