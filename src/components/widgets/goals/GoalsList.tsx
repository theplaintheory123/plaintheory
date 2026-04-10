"use client";

import { useState } from "react";
import { Goal } from "@/types";
import { CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Target, Plus, X, ChevronRight } from "lucide-react";
import Link from "next/link";

const COLORS = ["#C2786B", "#6B8EC2", "#6BC27A", "#C2B46B", "#8E6BC2", "#6BC2B4"];
const CATEGORIES = ["health", "learning", "finance", "fitness", "personal", "career"];

export default function GoalsList({ initialGoals }: { initialGoals: Goal[] }) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "personal",
    targetValue: "100",
    unit: "%",
    color: COLORS[0],
    deadline: "",
    description: "",
  });

  async function addGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title.trim(),
        description: form.description,
        category: form.category,
        targetValue: Number(form.targetValue),
        unit: form.unit,
        color: form.color,
        deadline: form.deadline || null,
      }),
    });
    const data = await res.json();
    if (data.goal) {
      setGoals((g) => [...g, data.goal]);
      setForm({ title: "", category: "personal", targetValue: "100", unit: "%", color: COLORS[0], deadline: "", description: "" });
      setShowAdd(false);
    }
  }

  async function archiveGoal(id: string) {
    setGoals((g) => g.filter((x) => x.id !== id));
    await fetch("/api/goals", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "archive" }),
    });
  }

  const active = goals.filter((g) => !g.archived);
  const completed = active.filter((g) => g.currentValue >= g.targetValue).length;

  return (
    <>
      <CardHeader className="border-b border-stone-100 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-stone-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Goals</span>
            {active.length > 0 && (
              <span className="text-[10px] font-medium text-stone-400">
                {completed}/{active.length} done
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Link href="/app/goals">
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
                <ChevronRight size={14} />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setShowAdd(!showAdd)}>
              {showAdd ? <X size={14} /> : <Plus size={14} />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex flex-col gap-3 h-72">
        {showAdd && (
          <form onSubmit={addGoal} className="rounded-xl border border-[#C2786B]/25 bg-[#C2786B]/4 p-3 space-y-2">
            <Input
              autoFocus
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Goal title…"
              className="h-8 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
            />
            <div className="flex gap-2">
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="flex-1 h-7 rounded-lg border border-stone-200 bg-white px-2 text-xs text-stone-700"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <Input
                type="number"
                value={form.targetValue}
                onChange={(e) => setForm((f) => ({ ...f, targetValue: e.target.value }))}
                placeholder="Target"
                className="w-20 h-7 text-xs"
              />
              <Input
                value={form.unit}
                onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                placeholder="unit"
                className="w-16 h-7 text-xs"
              />
            </div>
            <div className="flex gap-2">
              <Input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                className="flex-1 h-7 text-xs"
              />
              <div className="flex gap-1">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, color: c }))}
                    className={`h-5 w-5 rounded-full border-2 transition ${form.color === c ? "border-stone-500 scale-110" : "border-transparent"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <Button type="submit" size="sm" className="h-7 w-full rounded-lg bg-[#C2786B] text-xs text-white hover:bg-[#C2786B]/80">
              Add Goal
            </Button>
          </form>
        )}

        <ScrollArea className="flex-1">
          <div className="space-y-2 pr-3">
            {active.map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
              const done = pct >= 100;
              return (
                <div key={goal.id} className="group space-y-1.5 rounded-xl px-3 py-2.5 hover:bg-stone-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: goal.color }}
                      />
                      <span className={`text-sm truncate ${done ? "text-stone-400 line-through" : "text-stone-700"}`}>
                        {goal.title}
                      </span>
                      <span className="text-[10px] text-stone-400 shrink-0">{goal.category}</span>
                    </div>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <span className="text-xs font-medium" style={{ color: goal.color }}>
                        {goal.currentValue}/{goal.targetValue} {goal.unit}
                      </span>
                      <button
                        onClick={() => archiveGoal(goal.id)}
                        className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-stone-500 transition ml-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: goal.color }}
                    />
                  </div>
                  {goal.deadline && (
                    <p className="text-[10px] text-stone-300">
                      Due {new Date(goal.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  )}
                </div>
              );
            })}

            {active.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Target size={28} className="mb-2 text-stone-200" />
                <p className="text-sm text-stone-400">No goals yet</p>
                <button onClick={() => setShowAdd(true)} className="mt-2 text-xs text-[#C2786B] hover:underline">
                  Add a goal
                </button>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </>
  );
}
