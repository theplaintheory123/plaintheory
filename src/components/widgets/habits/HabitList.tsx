"use client";

import { useState } from "react";
import { Habit, HabitCheck } from "@/types";
import { CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Plus, X, Flame } from "lucide-react";

export default function HabitList({ initialHabits, initialChecks, today }: {
  initialHabits: Habit[];
  initialChecks: HabitCheck[];
  today: string;
}) {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [checks, setChecks] = useState<HabitCheck[]>(initialChecks);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("✓");

  const isChecked = (id: string) => checks.some((c) => c.habitId === id && c.completed);

  async function toggleCheck(habit: Habit) {
    const completed = !isChecked(habit.id);
    setChecks((prev) => [...prev.filter((c) => c.habitId !== habit.id), { habitId: habit.id, date: today, completed }]);
    if (completed) setHabits((h) => h.map((x) => x.id === habit.id ? { ...x, currentStreak: x.currentStreak + 1 } : x));
    await fetch("/api/habits", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: habit.id, action: "check", completed }),
    });
  }

  async function addHabit(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim(), emoji: newEmoji }),
    });
    const data = await res.json();
    if (data.habit) setHabits((h) => [...h, data.habit]);
    setNewName("");
    setShowAdd(false);
  }

  async function archiveHabit(id: string) {
    setHabits((h) => h.filter((x) => x.id !== id));
    await fetch("/api/habits", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "archive" }),
    });
  }

  const checkedCount = habits.filter((h) => isChecked(h.id)).length;

  return (
    <>
      <CardHeader className="border-b border-stone-100 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-stone-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Habits</span>
            {habits.length > 0 && (
              <span className="text-[10px] font-medium text-stone-400">
                {checkedCount}/{habits.length} today
              </span>
            )}
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? <X size={14} /> : <Plus size={14} />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex flex-col gap-3 h-72">
        {showAdd && (
          <form onSubmit={addHabit} className="flex items-center gap-2 rounded-xl border border-[#C2786B]/25 bg-[#C2786B]/4 p-3">
            <input
              type="text"
              value={newEmoji}
              onChange={(e) => setNewEmoji(e.target.value)}
              maxLength={2}
              className="w-8 bg-transparent text-center text-lg outline-none"
            />
            <Input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Habit name…"
              className="h-8 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
            />
            <Button type="submit" size="sm" className="h-7 shrink-0 rounded-lg bg-[#C2786B] px-3 text-xs text-white hover:bg-[#C2786B]/80">
              Add
            </Button>
          </form>
        )}

        <ScrollArea className="flex-1">
          <div className="space-y-1 pr-3">
            {habits.map((habit) => {
              const checked = isChecked(habit.id);
              return (
                <div
                  key={habit.id}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${checked ? "bg-[#C2786B]/6" : "hover:bg-stone-50"}`}
                >
                  <button
                    onClick={() => toggleCheck(habit)}
                    className={`h-5 w-5 shrink-0 rounded-md border-2 flex items-center justify-center transition ${
                      checked ? "border-[#C2786B] bg-[#C2786B]" : "border-stone-200 hover:border-[#C2786B]"
                    }`}
                  >
                    {checked && <span className="text-[9px] font-bold text-white">✓</span>}
                  </button>
                  <span className="text-base leading-none">{habit.emoji}</span>
                  <span className={`flex-1 text-sm ${checked ? "text-stone-400 line-through" : "text-stone-700"}`}>{habit.name}</span>
                  {habit.currentStreak > 1 && (
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-[#C2786B]">
                      <Flame size={10} />
                      {habit.currentStreak}
                    </span>
                  )}
                  <button
                    onClick={() => archiveHabit(habit.id)}
                    className="shrink-0 opacity-0 group-hover:opacity-100 text-stone-300 hover:text-stone-500 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}

            {habits.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Activity size={28} className="mb-2 text-stone-200" />
                <p className="text-sm text-stone-400">No habits yet</p>
                <button onClick={() => setShowAdd(true)} className="mt-2 text-xs text-[#C2786B] hover:underline">
                  Add a habit
                </button>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </>
  );
}
