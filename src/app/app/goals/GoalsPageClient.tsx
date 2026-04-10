"use client";

import { useState } from "react";
import { Goal, GoalLog } from "@/types";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, X, Pencil, Save, CheckCircle2, Circle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import {
  ContributionGraph, ContributionGraphBlock, ContributionGraphCalendar,
  ContributionGraphFooter, ContributionGraphLegend, ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";
import type { Activity as GraphActivity } from "@/components/kibo-ui/contribution-graph";

const COLORS = ["#C2786B", "#6B8EC2", "#6BC27A", "#C2B46B", "#8E6BC2", "#6BC2B4"];
const CATEGORIES = ["health", "learning", "finance", "fitness", "personal", "career"];

function buildActivity(logs: GoalLog[]): GraphActivity[] {
  const counts: Record<string, number> = {};
  for (const l of logs) counts[l.date] = (counts[l.date] || 0) + 1;
  const today = new Date(), start = new Date(today);
  start.setFullYear(start.getFullYear() - 1);
  const result: GraphActivity[] = [];
  const cur = new Date(start);
  while (cur <= today) {
    const d = cur.toISOString().split("T")[0];
    const n = counts[d] || 0;
    result.push({ date: d, count: n, level: n === 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 5 ? 3 : 4 });
    cur.setDate(cur.getDate() + 1);
  }
  return result;
}

export default function GoalsPageClient({ initialGoals, initialLogs }: { initialGoals: Goal[]; initialLogs: GoalLog[] }) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [logs, setLogs] = useState<GoalLog[]>(initialLogs);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<{ id: string; value: string; note: string } | null>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "personal", targetValue: "100", unit: "%", color: COLORS[0], deadline: "" });

  const active = goals.filter((g) => !g.archived);
  const done = active.filter((g) => g.currentValue >= g.targetValue).length;
  const activity = buildActivity(logs);

  const chartData = active.map((g) => ({
    name: g.title.length > 10 ? g.title.slice(0, 10) + "…" : g.title,
    current: g.currentValue, target: g.targetValue, color: g.color,
  }));

  async function addGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const res = await fetch("/api/goals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, targetValue: Number(form.targetValue) }) });
    const data = await res.json();
    if (data.goal) { setGoals((g) => [...g, data.goal]); setForm({ title: "", description: "", category: "personal", targetValue: "100", unit: "%", color: COLORS[0], deadline: "" }); setShowAdd(false); }
  }

  async function logProgress(goalId: string) {
    if (!editing || editing.id !== goalId) return;
    const val = Number(editing.value);
    if (isNaN(val)) return;
    const res = await fetch("/api/goals", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: goalId, action: "log", value: val, note: editing.note }) });
    const data = await res.json();
    if (data.log) { setGoals((gs) => gs.map((g) => g.id === goalId ? { ...g, currentValue: val } : g)); setLogs((l) => [...l, data.log]); }
    setEditing(null);
  }

  async function archive(id: string) {
    setGoals((g) => g.filter((x) => x.id !== id));
    await fetch("/api/goals", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "archive" }) });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Goals"
        description={`${done} of ${active.length} completed`}
        action={
          <Button onClick={() => setShowAdd(!showAdd)} className="h-8 gap-1.5 rounded-lg bg-zinc-900 px-3 text-xs text-white hover:bg-zinc-800">
            <Plus size={13} /> New goal
          </Button>
        }
      />

      {/* Add form */}
      {showAdd && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <form onSubmit={addGoal} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input autoFocus value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Goal title…" className="h-9 text-sm" />
              <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description (optional)" className="h-9 text-sm" />
            </div>
            <div className="flex flex-wrap gap-3">
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <Input type="number" value={form.targetValue} onChange={(e) => setForm((f) => ({ ...f, targetValue: e.target.value }))} placeholder="Target" className="h-9 w-24 text-sm" />
              <Input value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} placeholder="Unit" className="h-9 w-20 text-sm" />
              <Input type="date" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} className="h-9 text-sm" />
              <div className="flex items-center gap-1.5">
                {COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => setForm((f) => ({ ...f, color: c }))}
                    className={`h-5 w-5 rounded-full border-2 transition-transform ${form.color === c ? "border-zinc-600 scale-125" : "border-transparent"}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button type="submit" className="h-8 rounded-lg bg-zinc-900 px-4 text-xs text-white hover:bg-zinc-800">Add Goal</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Goals list */}
        <div className="space-y-2 lg:col-span-2">
          {active.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16 text-center">
              <p className="text-sm text-zinc-400">No goals yet</p>
              <button onClick={() => setShowAdd(true)} className="mt-2 text-xs text-[#C2786B] hover:underline">Add your first goal</button>
            </div>
          ) : active.map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
            const done = pct >= 100;
            const isEditing = editing?.id === goal.id;
            return (
              <div key={goal.id} className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {done ? <CheckCircle2 size={16} className="text-[#6BC27A] shrink-0" /> : <Circle size={16} className="shrink-0" style={{ color: goal.color }} />}
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${done ? "text-zinc-400 line-through" : "text-zinc-900"}`}>{goal.title}</p>
                      {goal.description && <p className="text-xs text-zinc-400 truncate">{goal.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: goal.color }}>{goal.category}</span>
                    <button onClick={() => setEditing(isEditing ? null : { id: goal.id, value: String(goal.currentValue), note: "" })} className="text-zinc-400 hover:text-zinc-700 transition"><Pencil size={13} /></button>
                    <button onClick={() => archive(goal.id)} className="text-zinc-400 hover:text-red-400 transition"><X size={13} /></button>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                    <span style={{ color: done ? "#6BC27A" : goal.color }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: done ? "#6BC27A" : goal.color }} />
                  </div>
                </div>
                {isEditing && (
                  <div className="flex gap-2 items-center rounded-lg border border-zinc-200 bg-zinc-50 p-2.5">
                    <Input type="number" value={editing.value} onChange={(e) => setEditing((s) => s ? { ...s, value: e.target.value } : s)} placeholder={`Value (${goal.unit})`} className="h-7 flex-1 text-xs" />
                    <Input value={editing.note} onChange={(e) => setEditing((s) => s ? { ...s, note: e.target.value } : s)} placeholder="Note…" className="h-7 flex-1 text-xs" />
                    <Button size="sm" className="h-7 rounded-lg bg-zinc-900 px-3 text-xs text-white hover:bg-zinc-800 gap-1" onClick={() => logProgress(goal.id)}><Save size={11} />Save</Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-wider text-zinc-400">Progress vs target</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} width={64} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 11 }} formatter={(v, n) => [v, n === "current" ? "Current" : "Target"]} />
                <Bar dataKey="target" fill="#f4f4f5" radius={[0, 4, 4, 0]} name="target" />
                <Bar dataKey="current" radius={[0, 4, 4, 0]} name="current">
                  {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Contribution graph */}
      {activity.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-wider text-zinc-400">Goal activity this year</p>
          <ContributionGraph data={activity} blockSize={11} blockMargin={3} blockRadius={2} fontSize={11} className="w-full">
            <ContributionGraphCalendar className="[&_rect[data-level='0']]:fill-zinc-100 [&_rect[data-level='1']]:fill-[#C2786B]/25 [&_rect[data-level='2']]:fill-[#C2786B]/50 [&_rect[data-level='3']]:fill-[#C2786B]/75 [&_rect[data-level='4']]:fill-[#C2786B] [&_text]:fill-zinc-400">
              {({ activity, dayIndex, weekIndex }) => <ContributionGraphBlock activity={activity} dayIndex={dayIndex} weekIndex={weekIndex} />}
            </ContributionGraphCalendar>
            <ContributionGraphFooter className="mt-3">
              <ContributionGraphTotalCount>{({ totalCount }) => <span className="text-xs text-zinc-400">{totalCount} updates this year</span>}</ContributionGraphTotalCount>
              <ContributionGraphLegend className="text-xs" />
            </ContributionGraphFooter>
          </ContributionGraph>
        </div>
      )}
    </div>
  );
}
