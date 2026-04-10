"use client";

import { useState, useMemo } from "react";
import { Expense } from "@/types";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, X, Trash2, TrendingDown } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const CATEGORIES = ["Food", "Transport", "Housing", "Health", "Entertainment", "Shopping", "Education", "Other"];

const CAT_COLORS: Record<string, string> = {
  Food: "#C2786B", Transport: "#6B8EC2", Housing: "#6BC27A",
  Health: "#C2B46B", Entertainment: "#8E6BC2", Shopping: "#6BC2B4",
  Education: "#C26B8E", Other: "#a1a1aa",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

export default function ExpensesPageClient({ initialExpenses }: { initialExpenses: Expense[] }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ amount: "", category: "Food", description: "", date: new Date().toISOString().split("T")[0] });

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const monthExpenses = expenses.filter((e) => e.date.startsWith(thisMonth));
  const total = monthExpenses.reduce((s, e) => s + e.amount, 0);

  // Category breakdown
  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of monthExpenses) map[e.category] = (map[e.category] || 0) + e.amount;
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [monthExpenses]);

  // Last 6 months
  const last6 = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const total = expenses.filter((e) => e.date.startsWith(key)).reduce((s, e) => s + e.amount, 0);
      return { month: d.toLocaleDateString("en-US", { month: "short" }), total, isThis: key === thisMonth };
    });
  }, [expenses]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.amount || isNaN(Number(form.amount))) return;
    const res = await fetch("/api/expenses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, amount: Number(form.amount) }) });
    const data = await res.json();
    if (data.expense) { setExpenses((p) => [data.expense, ...p]); setForm({ amount: "", category: "Food", description: "", date: new Date().toISOString().split("T")[0] }); setShowAdd(false); }
  }

  async function remove(id: string) {
    setExpenses((p) => p.filter((x) => x.id !== id));
    await fetch("/api/expenses", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
  }

  const recent = [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 50);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses"
        description={`${fmt(total)} this month`}
        action={
          <Button onClick={() => setShowAdd(!showAdd)} className="h-8 gap-1.5 rounded-lg bg-zinc-900 px-3 text-xs text-white hover:bg-zinc-800">
            <Plus size={13} /> Add expense
          </Button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "This month", value: fmt(total) },
          { label: "Transactions", value: monthExpenses.length },
          { label: "Daily avg", value: monthExpenses.length ? fmt(total / now.getDate()) : "$0" },
          { label: "Categories", value: byCategory.length },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">{label}</p>
            <p className="mt-1.5 text-xl font-semibold text-zinc-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <form onSubmit={add} className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">Amount</label>
              <Input type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder="0.00" className="h-9 w-28 text-sm" autoFocus />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">Category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
              <label className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">Description</label>
              <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="What was it for?" className="h-9 text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">Date</label>
              <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="h-9 text-sm" />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="h-9 rounded-lg bg-zinc-900 px-4 text-xs text-white hover:bg-zinc-800">Add</Button>
              <button type="button" onClick={() => setShowAdd(false)} className="text-zinc-400 hover:text-zinc-700"><X size={14} /></button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Expense list */}
        <div className="lg:col-span-2 space-y-1">
          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16 text-center">
              <TrendingDown size={28} className="mb-2 text-zinc-200" />
              <p className="text-sm text-zinc-400">No expenses yet</p>
              <button onClick={() => setShowAdd(true)} className="mt-2 text-xs text-[#C2786B] hover:underline">Add your first expense</button>
            </div>
          ) : (
            <>
              {/* Group by date */}
              {Object.entries(
                recent.reduce<Record<string, Expense[]>>((acc, e) => {
                  (acc[e.date] ||= []).push(e); return acc;
                }, {})
              ).map(([date, items]) => (
                <div key={date}>
                  <p className="px-1 py-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    {new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                  </p>
                  {items.map((exp) => (
                    <div key={exp.id} className="group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 hover:border-zinc-200 hover:bg-white transition-all">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white" style={{ backgroundColor: CAT_COLORS[exp.category] || "#a1a1aa" }}>
                        {exp.category[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm text-zinc-800">{exp.description || exp.category}</p>
                        <p className="text-xs text-zinc-400">{exp.category}</p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-zinc-900">{fmt(exp.amount)}</span>
                      <button onClick={() => remove(exp.id)} className="shrink-0 opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-400 transition">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Charts */}
        <div className="space-y-4">
          {/* Monthly trend */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-zinc-400">6-month trend</p>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={last6} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 11 }} formatter={(v) => [fmt(Number(v)), "Spent"]} />
                <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={32}>
                  {last6.map((e, i) => <Cell key={i} fill={e.isThis ? "#C2786B" : "#e4e4e7"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category breakdown */}
          {byCategory.length > 0 && (
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-zinc-400">By category</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={byCategory} dataKey="value" cx="50%" cy="50%" outerRadius={60} strokeWidth={2} stroke="#fff">
                    {byCategory.map((e, i) => <Cell key={i} fill={CAT_COLORS[e.name] || "#a1a1aa"} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 11 }} formatter={(v) => [fmt(Number(v))]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1">
                {byCategory.slice(0, 5).map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CAT_COLORS[c.name] || "#a1a1aa" }} />
                      <span className="text-zinc-600">{c.name}</span>
                    </div>
                    <span className="font-medium text-zinc-900">{fmt(c.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
