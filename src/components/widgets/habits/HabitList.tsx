"use client";

import { useState } from "react";
import { Habit, HabitCheck } from "@/types";
import { Flame, Plus, X } from "lucide-react";

interface Props {
  initialHabits: Habit[];
  initialChecks: HabitCheck[];
  today: string;
}

export default function HabitList({ initialHabits, initialChecks, today }: Props) {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [checks, setChecks] = useState<HabitCheck[]>(initialChecks);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("✓");

  function isChecked(habitId: string) {
    return checks.some((c) => c.habitId === habitId && c.completed);
  }

  async function toggleCheck(habit: Habit) {
    const current = isChecked(habit.id);
    const newCompleted = !current;

    // Optimistic update
    setChecks((prev) => {
      const without = prev.filter((c) => c.habitId !== habit.id);
      return [...without, { habitId: habit.id, date: today, completed: newCompleted }];
    });
    if (newCompleted) {
      setHabits((prev) =>
        prev.map((h) => h.id === habit.id ? { ...h, currentStreak: h.currentStreak + 1 } : h)
      );
    }

    await fetch("/api/habits", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: habit.id, action: "check", completed: newCompleted }),
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

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-[#1A1817]/40">Habits</h3>
        <button onClick={() => setShowAdd(!showAdd)} className="rounded-lg p-1 text-[#1A1817]/30 hover:bg-[#C2786B]/10 hover:text-[#C2786B] transition">
          <Plus size={16} />
        </button>
      </div>

      {showAdd && (
        <form onSubmit={addHabit} className="mb-3 flex gap-2 items-center rounded-xl border border-[#C2786B]/20 bg-[#FAF8F5] p-3">
          <input
            type="text"
            value={newEmoji}
            onChange={(e) => setNewEmoji(e.target.value)}
            maxLength={2}
            className="w-8 bg-transparent text-center text-lg outline-none"
          />
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Habit name…"
            className="flex-1 bg-transparent text-sm text-[#1A1817] outline-none placeholder:text-[#1A1817]/30"
          />
          <button type="submit" className="rounded-lg bg-[#C2786B] px-3 py-1 text-xs text-white">Add</button>
        </form>
      )}

      <div className="flex-1 overflow-y-auto space-y-1">
        {habits.map((habit) => {
          const checked = isChecked(habit.id);
          return (
            <div key={habit.id} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${checked ? "bg-[#C2786B]/6" : "hover:bg-white"}`}>
              <button
                onClick={() => toggleCheck(habit)}
                className={`h-5 w-5 shrink-0 rounded-md border-2 flex items-center justify-center transition ${
                  checked
                    ? "border-[#C2786B] bg-[#C2786B] text-white"
                    : "border-[#1A1817]/20 hover:border-[#C2786B]"
                }`}
              >
                {checked && <span className="text-[10px]">✓</span>}
              </button>
              <span className="text-base">{habit.emoji}</span>
              <span className={`flex-1 text-sm ${checked ? "text-[#1A1817]/50 line-through" : "text-[#1A1817]"}`}>{habit.name}</span>
              {habit.currentStreak > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] text-[#C2786B]">
                  <Flame size={10} />
                  {habit.currentStreak}
                </span>
              )}
              <button
                onClick={() => archiveHabit(habit.id)}
                className="shrink-0 opacity-0 group-hover:opacity-100 text-[#1A1817]/20 hover:text-[#1A1817]/50 transition"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}

        {habits.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="mb-2 text-3xl opacity-20">✓</span>
            <p className="text-sm text-[#1A1817]/30">No habits yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
