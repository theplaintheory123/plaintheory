"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Task, Habit, HabitCheck, FocusSession, Goal, Expense } from "@/types";
import {
  CheckSquare, Square, Flame, ChevronRight,
  Target, DollarSign, Timer, Activity,
  TrendingDown, Wallet, ArrowUpRight,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, AreaChart, Area,
} from "recharts";

// ─── helpers ────────────────────────────────────────────
function greeting(email: string) {
  const h = new Date().getHours();
  const label = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const name = email.split("@")[0].split(".")[0];
  return `${label}, ${name.charAt(0).toUpperCase() + name.slice(1)}`;
}

function fmt$(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function isoDate(d: Date) {
  return d.toISOString().split("T")[0];
}

function dateRange(days: number): string[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return isoDate(d);
  });
}

const CAT_COLOR: Record<string, string> = {
  Food: "#C2786B", Transport: "#6B8EC2", Housing: "#6BC27A",
  Health: "#C2B46B", Entertainment: "#8E6BC2", Shopping: "#6BC2B4",
  Education: "#C26B8E", Other: "#a1a1aa",
};

const DEFAULT_BUDGETS: Record<string, number> = {
  Food: 500, Transport: 200, Housing: 1500, Health: 200,
  Entertainment: 150, Shopping: 300, Education: 100, Other: 200,
};

// ─── mini calendar ────────────────────────────────────────
function MiniCalendar({ taskDates, today }: { taskDates: Set<string>; today: string }) {
  const now = new Date(today + "T12:00:00");
  const year = now.getFullYear(), month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const todayNum = now.getDate();

  return (
    <div>
      <p className="mb-2 text-xs font-medium text-zinc-500">
        {now.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </p>
      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((d) => (
          <span key={d} className="py-0.5 text-center text-[10px] font-medium text-zinc-400">{d}</span>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => <span key={`g${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday = day === todayNum;
          const hasTask = taskDates.has(ds);
          return (
            <div key={day} className="flex flex-col items-center">
              <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] transition-colors ${
                isToday ? "bg-zinc-900 font-semibold text-white" : "text-zinc-700 hover:bg-zinc-100"
              }`}>
                {day}
              </div>
              {hasTask && (
                <div className={`h-1 w-1 rounded-full ${isToday ? "bg-white" : "bg-[#C2786B]"} -mt-1.5`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── chart data builders ────────────────────────────────
type Range = "7d" | "1m" | "1y";

function buildChartData(
  range: Range,
  sessions: FocusSession[],
  expenses: Expense[],
  checks: HabitCheck[],
  habitCount: number,
) {
  if (range === "7d") {
    return dateRange(7).map((date) => ({
      label: new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" }),
      focus: sessions.filter((s) => s.completedAt.startsWith(date)).reduce((a, s) => a + s.durationMinutes, 0),
      expense: expenses.filter((e) => e.date === date).reduce((a, e) => a + e.amount, 0),
      habits: habitCount > 0
        ? Math.round((checks.filter((c) => c.date === date && c.completed).length / habitCount) * 100)
        : 0,
      date,
    }));
  }

  if (range === "1m") {
    return Array.from({ length: 4 }, (_, i) => {
      const weekEnd = new Date(); weekEnd.setDate(weekEnd.getDate() - i * 7);
      const weekStart = new Date(weekEnd); weekStart.setDate(weekEnd.getDate() - 6);
      const datesInWeek = dateRange(7).map((_, j) => {
        const d = new Date(weekStart); d.setDate(d.getDate() + j); return isoDate(d);
      });
      return {
        label: `W${4 - i}`,
        focus: sessions.filter((s) => datesInWeek.some((d) => s.completedAt.startsWith(d))).reduce((a, s) => a + s.durationMinutes, 0),
        expense: expenses.filter((e) => datesInWeek.includes(e.date)).reduce((a, e) => a + e.amount, 0),
        habits: habitCount > 0
          ? Math.round((checks.filter((c) => datesInWeek.includes(c.date) && c.completed).length / (habitCount * 7)) * 100)
          : 0,
      };
    }).reverse();
  }

  // 1y — last 12 months
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return {
      label: d.toLocaleDateString("en-US", { month: "short" }),
      focus: sessions.filter((s) => s.completedAt.startsWith(key)).reduce((a, s) => a + s.durationMinutes, 0),
      expense: expenses.filter((e) => e.date.startsWith(key)).reduce((a, e) => a + e.amount, 0),
      habits: habitCount > 0
        ? Math.round((checks.filter((c) => c.date.startsWith(key) && c.completed).length / (habitCount * daysInMonth)) * 100)
        : 0,
    };
  });
}

// ─── main ─────────────────────────────────────────────────
export default function DashboardOverview({
  userName, today,
  tasks, habits, todayChecks, allChecks,
  focusSessions, goals, expenses,
}: {
  userName: string; today: string;
  tasks: Task[]; habits: Habit[];
  todayChecks: HabitCheck[]; allChecks: HabitCheck[];
  focusSessions: FocusSession[]; goals: Goal[]; expenses: Expense[];
}) {
  const [checks, setChecks] = useState<HabitCheck[]>(todayChecks);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [chartRange, setChartRange] = useState<Range>("7d");
  const [budgets, setBudgets] = useState<Record<string, number>>(DEFAULT_BUDGETS);
  const [editingBudget, setEditingBudget] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pt_budgets");
      if (saved) setBudgets({ ...DEFAULT_BUDGETS, ...JSON.parse(saved) });
    } catch {}
  }, []);

  function saveBudget(cat: string, val: number) {
    const updated = { ...budgets, [cat]: val };
    setBudgets(updated);
    localStorage.setItem("pt_budgets", JSON.stringify(updated));
    setEditingBudget(null);
  }

  // ── derived data ──────────────────────────────────────
  const todayTasks = localTasks.filter((t) => t.dueDate === today);
  const pendingTasks = localTasks.filter((t) => !t.completed).length;
  const taskDates = useMemo(() => new Set(localTasks.filter((t) => t.dueDate).map((t) => t.dueDate!)), [localTasks]);

  const isChecked = (id: string) => checks.some((c) => c.habitId === id && c.completed);
  const doneHabits = habits.filter((h) => isChecked(h.id)).length;

  const todaySessions = focusSessions.filter((s) => s.completedAt.startsWith(today));
  const focusMinToday = todaySessions.reduce((a, s) => a + s.durationMinutes, 0);

  const thisMonth = today.slice(0, 7);
  const monthExpenses = expenses.filter((e) => e.date.startsWith(thisMonth));
  const monthTotal = monthExpenses.reduce((a, e) => a + e.amount, 0);

  const activeGoals = goals.filter((g) => g.currentValue < g.targetValue);
  const completedGoals = goals.filter((g) => g.currentValue >= g.targetValue);

  const chartData = useMemo(
    () => buildChartData(chartRange, focusSessions, expenses, allChecks, habits.length),
    [chartRange, focusSessions, expenses, allChecks, habits.length]
  );

  // expenses by category this month
  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of monthExpenses) map[e.category] = (map[e.category] || 0) + e.amount;
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [monthExpenses]);

  // toggle habit
  async function toggleHabit(h: Habit) {
    const completed = !isChecked(h.id);
    setChecks((p) => [...p.filter((c) => c.habitId !== h.id), { habitId: h.id, date: today, completed }]);
    await fetch("/api/habits", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: h.id, action: "check", completed }),
    });
  }

  // toggle task
  async function toggleTask(t: Task) {
    setLocalTasks((p) => p.map((x) => x.id === t.id ? { ...x, completed: !x.completed } : x));
    await fetch("/api/tasks", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: t.id, completed: !t.completed }),
    });
  }

  // ── render ────────────────────────────────────────────
  return (
    <div className="space-y-5 pb-8">

      {/* ── 1. Header ─────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">{greeting(userName)}</h1>
        <p className="mt-0.5 text-sm text-zinc-500">
          {new Date(today + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* ── 2. Quick stats ────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Tasks pending", value: pendingTasks, sub: `${localTasks.filter(t=>t.completed).length} done`, color: "bg-blue-50 text-blue-600" },
          { label: "Habits today", value: `${doneHabits}/${habits.length}`, sub: doneHabits === habits.length && habits.length > 0 ? "All done! 🎉" : `${habits.length - doneHabits} left`, color: "bg-green-50 text-green-600" },
          { label: "Focus today", value: `${focusMinToday}m`, sub: `${todaySessions.length} session${todaySessions.length !== 1 ? "s" : ""}`, color: "bg-purple-50 text-purple-600" },
          { label: "This month", value: fmt$(monthTotal), sub: `${monthExpenses.length} transactions`, color: "bg-orange-50 text-orange-600" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">{label}</p>
            <p className="mt-2 text-xl font-semibold text-zinc-900">{value}</p>
            <p className="mt-0.5 text-xs text-zinc-500">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── 3. Today's agenda + Habits ────────────────── */}
      <div className="grid gap-4 lg:grid-cols-5">

        {/* Calendar + Today tasks */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Today's Agenda</p>
              <Link href="/app/tasks" className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
                View all <ChevronRight size={12} />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Mini calendar */}
              <MiniCalendar taskDates={taskDates} today={today} />

              {/* Tasks due today */}
              <div className="space-y-1">
                <p className="mb-2 text-[11px] font-medium text-zinc-400">Due today</p>
                {todayTasks.length === 0 ? (
                  <p className="text-xs text-zinc-300 italic">Nothing due today</p>
                ) : (
                  todayTasks.slice(0, 6).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => toggleTask(t)}
                      className={`group flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-zinc-50 ${t.completed ? "opacity-50" : ""}`}
                    >
                      <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                        t.completed ? "border-[#C2786B] bg-[#C2786B]" : "border-zinc-300 group-hover:border-zinc-500"
                      }`}>
                        {t.completed && <span className="text-[8px] font-bold text-white">✓</span>}
                      </div>
                      <span className={`flex-1 text-xs ${t.completed ? "line-through text-zinc-400" : "text-zinc-700"}`}>
                        {t.title}
                      </span>
                    </button>
                  ))
                )}
                {todayTasks.length > 6 && (
                  <Link href="/app/tasks" className="text-[11px] text-zinc-400 hover:text-zinc-700 pl-2">
                    +{todayTasks.length - 6} more
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming tasks (next 7 days, not today) */}
          {localTasks.filter((t) => !t.completed && t.dueDate && t.dueDate > today && t.dueDate <= dateRange(7)[6]).length > 0 && (
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">Upcoming</p>
              <div className="space-y-1">
                {localTasks
                  .filter((t) => !t.completed && t.dueDate && t.dueDate > today && t.dueDate <= dateRange(7)[6])
                  .slice(0, 5)
                  .map((t) => (
                    <div key={t.id} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
                      <Square size={14} className="shrink-0 text-zinc-300" />
                      <span className="flex-1 truncate text-xs text-zinc-700">{t.title}</span>
                      <span className="shrink-0 rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500">
                        {new Date(t.dueDate! + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Habits */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Habits</p>
            <Link href="/app/habits" className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
              View all <ChevronRight size={12} />
            </Link>
          </div>

          {/* Progress bar */}
          <div className="mb-4 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">{doneHabits}/{habits.length} done</span>
              <span className="font-medium text-zinc-700">
                {habits.length > 0 ? Math.round((doneHabits / habits.length) * 100) : 0}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-[#C2786B] transition-all duration-500"
                style={{ width: `${habits.length > 0 ? (doneHabits / habits.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            {habits.length === 0 ? (
              <Link href="/app/habits" className="text-xs text-[#C2786B] hover:underline">+ Add habits</Link>
            ) : (
              habits.map((h) => {
                const done = isChecked(h.id);
                return (
                  <button
                    key={h.id}
                    onClick={() => toggleHabit(h)}
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all ${
                      done ? "border-zinc-100 bg-zinc-50" : "border-zinc-200 bg-white hover:border-zinc-300"
                    }`}
                  >
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                      done ? "border-[#C2786B] bg-[#C2786B]" : "border-zinc-200"
                    }`}>
                      {done && <span className="text-[9px] font-bold text-white">✓</span>}
                      {!done && <span className="text-sm">{h.emoji}</span>}
                    </div>
                    <span className={`flex-1 text-sm ${done ? "text-zinc-400 line-through" : "text-zinc-800"}`}>{h.name}</span>
                    {h.currentStreak > 1 && (
                      <div className="flex items-center gap-0.5 text-xs text-[#C2786B]">
                        <Flame size={11} />
                        <span className="font-medium">{h.currentStreak}</span>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── 4. Goals ──────────────────────────────────── */}
      {goals.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Goals</p>
            <Link href="/app/goals" className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
              View all <ChevronRight size={12} />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeGoals.slice(0, 6).map((g) => {
              const pct = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
              return (
                <div key={g.id} className="space-y-2 rounded-lg border border-zinc-100 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: g.color }} />
                      <span className="truncate text-sm font-medium text-zinc-800">{g.title}</span>
                    </div>
                    <span className="shrink-0 text-xs font-semibold" style={{ color: g.color }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: g.color }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>{g.currentValue}/{g.targetValue} {g.unit}</span>
                    {g.deadline && <span>Due {new Date(g.deadline + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>}
                  </div>
                </div>
              );
            })}
            {completedGoals.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 p-3">
                <Target size={14} className="text-green-500 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-green-700">{completedGoals.length} goal{completedGoals.length > 1 ? "s" : ""} reached</p>
                  <p className="text-[10px] text-green-500">{completedGoals.map(g => g.title).slice(0, 2).join(", ")}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 5. Overview charts ────────────────────────── */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Overview</p>
          <div className="flex gap-1 rounded-lg border border-zinc-200 p-0.5">
            {(["7d", "1m", "1y"] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setChartRange(r)}
                className={`rounded-md px-3 py-1 text-[11px] font-medium transition-colors ${
                  chartRange === r ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {r === "7d" ? "7 days" : r === "1m" ? "1 month" : "1 year"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Focus */}
          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <Timer size={12} className="text-purple-500" />
              <p className="text-[11px] font-medium text-zinc-500">Focus (min)</p>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 8, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid #e4e4e7", fontSize: 10 }} formatter={(v) => [`${v} min`, "Focus"]} />
                <Bar dataKey="focus" fill="#8b5cf6" radius={[3, 3, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Habits % */}
          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <Activity size={12} className="text-green-500" />
              <p className="text-[11px] font-medium text-zinc-500">Habits (%)</p>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 8, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid #e4e4e7", fontSize: 10 }} formatter={(v) => [`${v}%`, "Completion"]} />
                <defs>
                  <linearGradient id="habG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="habits" stroke="#22c55e" strokeWidth={2} fill="url(#habG)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Expenses */}
          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <DollarSign size={12} className="text-orange-500" />
              <p className="text-[11px] font-medium text-zinc-500">Spending ($)</p>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 8, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid #e4e4e7", fontSize: 10 }} formatter={(v) => [fmt$(Number(v)), "Spent"]} />
                <Bar dataKey="expense" radius={[3, 3, 0, 0]} maxBarSize={28}>
                  {chartData.map((_, i) => <Cell key={i} fill="#f97316" />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── 6. Expenses & Budget ──────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-5">

        {/* Budget vs actual */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet size={14} className="text-zinc-400" />
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Monthly Budget</p>
            </div>
            <Link href="/app/expenses" className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
              Details <ChevronRight size={12} />
            </Link>
          </div>

          {/* Total spent vs total budget */}
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{fmt$(monthTotal)}</p>
              <p className="text-xs text-zinc-500">of {fmt$(Object.values(budgets).reduce((a, b) => a + b, 0))} budget</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${
                monthTotal > Object.values(budgets).reduce((a, b) => a + b, 0) ? "text-red-500" : "text-green-500"
              }`}>
                {fmt$(Math.abs(Object.values(budgets).reduce((a, b) => a + b, 0) - monthTotal))}
                {monthTotal > Object.values(budgets).reduce((a, b) => a + b, 0) ? " over" : " left"}
              </p>
            </div>
          </div>

          {/* Category budget bars */}
          <div className="space-y-3">
            {CATEGORIES_LIST.map((cat) => {
              const spent = monthExpenses.filter((e) => e.category === cat).reduce((a, e) => a + e.amount, 0);
              const budget = budgets[cat] || DEFAULT_BUDGETS[cat] || 0;
              const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
              const over = spent > budget;
              if (spent === 0 && !byCategory.find(([c]) => c === cat)) return null;
              return (
                <div key={cat} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CAT_COLOR[cat] || "#a1a1aa" }} />
                      <span className="text-xs font-medium text-zinc-700">{cat}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${over ? "text-red-500" : "text-zinc-600"}`}>
                        {fmt$(spent)}
                      </span>
                      <span className="text-xs text-zinc-400">/ </span>
                      {editingBudget === cat ? (
                        <input
                          type="number"
                          defaultValue={budget}
                          autoFocus
                          onBlur={(e) => saveBudget(cat, Number(e.target.value) || budget)}
                          onKeyDown={(e) => { if (e.key === "Enter") saveBudget(cat, Number((e.target as HTMLInputElement).value) || budget); }}
                          className="w-16 rounded border border-zinc-300 px-1 py-0.5 text-right text-xs outline-none focus:border-zinc-500"
                        />
                      ) : (
                        <button onClick={() => setEditingBudget(cat)} className="text-xs text-zinc-400 hover:text-zinc-700">
                          {fmt$(budget)}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: over ? "#ef4444" : (CAT_COLOR[cat] || "#a1a1aa") }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[10px] text-zinc-400">Click any budget amount to edit</p>
        </div>

        {/* Recent transactions */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingDown size={14} className="text-zinc-400" />
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Recent</p>
            </div>
          </div>
          <div className="space-y-1">
            {expenses.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-zinc-400">No expenses yet</p>
                <Link href="/app/expenses" className="mt-1 block text-xs text-[#C2786B] hover:underline">Start tracking</Link>
              </div>
            ) : (
              [...expenses]
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 8)
                .map((e) => (
                  <div key={e.id} className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-zinc-50 transition-colors">
                    <div
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
                      style={{ backgroundColor: CAT_COLOR[e.category] || "#a1a1aa" }}
                    >
                      {e.category[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs text-zinc-700">{e.description || e.category}</p>
                      <p className="text-[10px] text-zinc-400">{e.category}</p>
                    </div>
                    <span className="text-xs font-semibold text-zinc-900">{fmt$(e.amount)}</span>
                  </div>
                ))
            )}
          </div>
          {expenses.length > 0 && (
            <Link href="/app/expenses" className="mt-3 flex items-center justify-center gap-1 text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
              View all expenses <ArrowUpRight size={11} />
            </Link>
          )}
        </div>
      </div>

    </div>
  );
}

const CATEGORIES_LIST = ["Food", "Transport", "Housing", "Health", "Entertainment", "Shopping", "Education", "Other"];
