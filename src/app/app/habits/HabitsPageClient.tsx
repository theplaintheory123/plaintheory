"use client";

import { useState, useEffect } from "react";
import { Habit, HabitCheck } from "@/types";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, X, Flame, Check } from "lucide-react";
import {
  ContributionGraph, ContributionGraphBlock, ContributionGraphCalendar,
  ContributionGraphFooter, ContributionGraphLegend, ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";
import type { Activity as GraphActivity } from "@/components/kibo-ui/contribution-graph";

export default function HabitsPageClient({
  initialHabits, initialChecks, today,
}: { initialHabits: Habit[]; initialChecks: HabitCheck[]; today: string }) {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [checks, setChecks] = useState<HabitCheck[]>(initialChecks);
  const [activity, setActivity] = useState<GraphActivity[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✓");

  useEffect(() => {
    fetch("/api/habits/activity").then((r) => r.json()).then((d) => {
      const counts: Record<string, number> = {};
      for (const c of d.checks || []) counts[c.date] = (counts[c.date] || 0) + 1;
      const total = habits.length || 1;
      const start = new Date(); start.setFullYear(start.getFullYear() - 1);
      const result: GraphActivity[] = [];
      const cur = new Date(start);
      while (cur <= new Date()) {
        const ds = cur.toISOString().split("T")[0];
        const n = counts[ds] || 0;
        const ratio = n / total;
        result.push({ date: ds, count: n, level: n === 0 ? 0 : ratio < 0.25 ? 1 : ratio < 0.5 ? 2 : ratio < 0.75 ? 3 : 4 });
        cur.setDate(cur.getDate() + 1);
      }
      setActivity(result);
    }).catch(() => {});
  }, [habits.length]);

  const checked = (id: string) => checks.some((c) => c.habitId === id && c.completed);
  const doneCount = habits.filter((h) => checked(h.id)).length;

  async function toggle(h: Habit) {
    const c = !checked(h.id);
    setChecks((p) => [...p.filter((x) => x.habitId !== h.id), { habitId: h.id, date: today, completed: c }]);
    if (c) setHabits((p) => p.map((x) => x.id === h.id ? { ...x, currentStreak: x.currentStreak + 1 } : x));
    await fetch("/api/habits", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: h.id, action: "check", completed: c }) });
  }

  async function addHabit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await fetch("/api/habits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), emoji }) });
    const data = await res.json();
    if (data.habit) setHabits((p) => [...p, data.habit]);
    setName(""); setShowAdd(false);
  }

  async function archive(id: string) {
    setHabits((p) => p.filter((x) => x.id !== id));
    await fetch("/api/habits", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "archive" }) });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Habits"
        description={`${doneCount} of ${habits.length} done today`}
        action={
          <Button onClick={() => setShowAdd(!showAdd)} className="h-8 gap-1.5 rounded-lg bg-zinc-900 px-3 text-xs text-white hover:bg-zinc-800">
            <Plus size={13} /> New habit
          </Button>
        }
      />

      {/* Add form */}
      {showAdd && (
        <form onSubmit={addHabit} className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3">
          <input
            value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={2}
            className="w-9 h-8 rounded-lg border border-zinc-200 bg-zinc-50 text-center text-base outline-none"
          />
          <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Habit name…" className="h-8 flex-1 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0" />
          <Button type="submit" className="h-8 rounded-lg bg-zinc-900 px-3 text-xs text-white hover:bg-zinc-800">Add</Button>
          <button type="button" onClick={() => setShowAdd(false)} className="text-zinc-400 hover:text-zinc-700"><X size={14} /></button>
        </form>
      )}

      {/* Today's progress bar */}
      {habits.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Today's progress</span>
            <span className="font-medium">{Math.round((doneCount / habits.length) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-[#C2786B] transition-all duration-500"
              style={{ width: `${(doneCount / habits.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Habits list */}
      {habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16 text-center">
          <p className="text-sm text-zinc-400">No habits yet</p>
          <button onClick={() => setShowAdd(true)} className="mt-2 text-xs text-[#C2786B] hover:underline">Add your first habit</button>
        </div>
      ) : (
        <div className="space-y-1.5">
          {habits.map((h) => {
            const done = checked(h.id);
            return (
              <div
                key={h.id}
                className={`group flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-all ${
                  done ? "border-zinc-100 bg-white" : "border-zinc-200 bg-white hover:border-zinc-300"
                }`}
                onClick={() => toggle(h)}
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${
                  done ? "border-[#C2786B] bg-[#C2786B]" : "border-zinc-200 group-hover:border-zinc-400"
                }`}>
                  {done ? <Check size={13} className="text-white" strokeWidth={3} /> : <span className="text-sm">{h.emoji}</span>}
                </div>
                <span className={`flex-1 text-sm font-medium ${done ? "text-zinc-400 line-through" : "text-zinc-800"}`}>{h.name}</span>
                {h.currentStreak > 1 && (
                  <div className="flex items-center gap-1 text-xs text-[#C2786B]">
                    <Flame size={12} />
                    <span className="font-medium">{h.currentStreak}</span>
                  </div>
                )}
                <button onClick={(e) => { e.stopPropagation(); archive(h.id); }} className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-400 transition">
                  <X size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Contribution graph */}
      {activity.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-wider text-zinc-400">Activity this year</p>
          <ContributionGraph data={activity} blockSize={11} blockMargin={3} blockRadius={2} fontSize={11} className="w-full">
            <ContributionGraphCalendar className="[&_rect[data-level='0']]:fill-zinc-100 [&_rect[data-level='1']]:fill-[#C2786B]/25 [&_rect[data-level='2']]:fill-[#C2786B]/50 [&_rect[data-level='3']]:fill-[#C2786B]/75 [&_rect[data-level='4']]:fill-[#C2786B] [&_text]:fill-zinc-400">
              {({ activity, dayIndex, weekIndex }) => (
                <ContributionGraphBlock activity={activity} dayIndex={dayIndex} weekIndex={weekIndex} />
              )}
            </ContributionGraphCalendar>
            <ContributionGraphFooter className="mt-3">
              <ContributionGraphTotalCount>
                {({ totalCount }) => <span className="text-xs text-zinc-400">{totalCount} check-ins</span>}
              </ContributionGraphTotalCount>
              <ContributionGraphLegend className="text-xs" />
            </ContributionGraphFooter>
          </ContributionGraph>
        </div>
      )}
    </div>
  );
}
