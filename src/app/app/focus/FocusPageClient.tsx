"use client";

import { useState, useMemo } from "react";
import { FocusSession } from "@/types";
import { useTimer } from "@/hooks/useTimer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Play, Pause, RotateCcw, Flame } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

const PRESETS = [
  { label: "1 min", focus: 1, break: 1 },
  { label: "5 min", focus: 5, break: 2 },
  { label: "20 min", focus: 20, break: 5 },
  { label: "25 min", focus: 25, break: 5 },
  { label: "1 hr", focus: 60, break: 15 },
];

export default function FocusPageClient({
  initialSessions, today, savedFocusDuration, savedBreakDuration,
}: {
  initialSessions: FocusSession[];
  today: string;
  savedFocusDuration: number;
  savedBreakDuration: number;
}) {
  const [sessions, setSessions] = useState<FocusSession[]>(initialSessions);
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customFocus, setCustomFocus] = useState("");
  const [customBreak, setCustomBreak] = useState("");

  const todaySessions = sessions.filter((s) => s.completedAt.startsWith(today));
  const totalMins = todaySessions.reduce((s, x) => s + x.durationMinutes, 0);

  const { state, display, progress, start, pause, reset, setDuration } = useTimer({
    focusDuration: savedFocusDuration,
    breakDuration: savedBreakDuration,
    onFocusComplete: async (dur) => {
      const res = await fetch("/api/focus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ durationMinutes: dur }),
      });
      const data = await res.json();
      if (data.session) setSessions((s) => [...s, data.session]);
    },
  });

  function applyPreset(i: number) {
    const p = PRESETS[i];
    setActivePreset(i); setShowCustom(false); reset(); setDuration(p.focus, p.break);
  }

  function applyCustom() {
    const f = parseInt(customFocus); const b = parseInt(customBreak) || 5;
    if (!f || f < 1) return;
    setActivePreset(null); reset(); setDuration(f, b); setShowCustom(false);
  }

  const isBreak = state.status === "break";
  const isRunning = state.status === "running";
  const r = 72, circ = 2 * Math.PI * r, dash = circ * (1 - progress);

  const streak = useMemo(() => {
    let count = 0, d = new Date(today);
    while (sessions.some((s) => s.completedAt.startsWith(d.toISOString().split("T")[0]))) {
      count++; d.setDate(d.getDate() - 1);
    }
    return count;
  }, [sessions, today]);

  const days7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() - (6 - i));
    const dt = d.toISOString().split("T")[0];
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      minutes: sessions.filter((s) => s.completedAt.startsWith(dt)).reduce((a, x) => a + x.durationMinutes, 0),
      isToday: dt === today,
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Focus"
        description={`${todaySessions.length} sessions today · ${totalMins} min`}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Timer */}
        <div className="flex flex-col items-center gap-6 rounded-xl border border-zinc-200 bg-white p-8 lg:col-span-3">
          {/* Presets */}
          <div className="flex flex-wrap justify-center gap-2">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => applyPreset(i)}
                disabled={isRunning}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 ${
                  activePreset === i
                    ? "bg-zinc-900 text-white"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                }`}
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={() => { setShowCustom(!showCustom); setActivePreset(null); }}
              disabled={isRunning}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 ${
                showCustom ? "bg-zinc-900 text-white" : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
              }`}
            >
              Custom
            </button>
          </div>

          {/* Custom inputs */}
          {showCustom && (
            <div className="flex items-end gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">Focus min</span>
                <Input type="number" min={1} max={240} value={customFocus} onChange={(e) => setCustomFocus(e.target.value)} placeholder="25" className="w-20 h-8 text-center text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">Break min</span>
                <Input type="number" min={1} max={60} value={customBreak} onChange={(e) => setCustomBreak(e.target.value)} placeholder="5" className="w-20 h-8 text-center text-sm" />
              </div>
              <Button onClick={applyCustom} className="h-8 rounded-lg bg-zinc-900 px-4 text-xs text-white hover:bg-zinc-800">Set</Button>
            </div>
          )}

          {/* Ring */}
          <div className="relative">
            <svg width="180" height="180" className="-rotate-90">
              <circle cx="90" cy="90" r={r} fill="none" stroke={isBreak ? "#f4f4f5" : "#f4f4f5"} strokeWidth="6" />
              <circle
                cx="90" cy="90" r={r} fill="none"
                stroke={isBreak ? "#a1a1aa" : "#C2786B"}
                strokeWidth="6" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={dash}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-4xl font-light tracking-tight text-zinc-900">{display}</span>
              <span className={`mt-1 text-[10px] font-semibold uppercase tracking-widest ${isBreak ? "text-zinc-400" : "text-[#C2786B]"}`}>
                {isBreak ? "break" : state.status === "idle" ? "ready" : state.status === "paused" ? "paused" : "focus"}
              </span>
              <span className="text-[10px] text-zinc-400 mt-1">{state.focusDuration}m / {state.breakDuration}m</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button onClick={reset} className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors">
              <RotateCcw size={16} />
            </button>
            <button
              onClick={isRunning ? pause : start}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white shadow-sm hover:bg-zinc-700 transition-colors"
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            <div className="w-9" />
          </div>

          {/* Session dots */}
          {todaySessions.length > 0 && (
            <div className="flex gap-1.5">
              {Array.from({ length: Math.min(todaySessions.length + state.sessionsToday, 10) }).map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-[#C2786B]/50" />
              ))}
            </div>
          )}
        </div>

        {/* Stats + chart */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {[
              { label: "Sessions today", value: todaySessions.length },
              { label: "Minutes today", value: totalMins },
              { label: "Day streak", value: streak, icon: streak > 0 ? Flame : undefined },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-zinc-200 bg-white p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">{label}</p>
                <p className="mt-1 flex items-center gap-1.5 text-2xl font-semibold text-zinc-900">
                  {value}
                  {Icon && <Icon size={16} className="text-[#C2786B]" />}
                </p>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div className="flex-1 rounded-xl border border-zinc-200 bg-white p-4">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-zinc-400">7-day history</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={days7} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 11 }}
                  formatter={(v) => [`${v} min`, "Focus"]}
                />
                <Bar dataKey="minutes" radius={[4, 4, 0, 0]} maxBarSize={32}>
                  {days7.map((e, i) => (
                    <Cell key={i} fill={e.isToday ? "#C2786B" : "#e4e4e7"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
