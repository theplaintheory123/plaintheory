"use client";

import { useState, useMemo } from "react";
import { Task } from "@/types";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  CheckSquare, Square, Trash2, Plus, X, Clock, AlertCircle,
} from "lucide-react";
import { formatShortDate } from "@/lib/utils";

type Filter = "all" | "pending" | "completed" | "overdue";

function isOverdue(t: Task) {
  return !t.completed && !!t.dueDate && t.dueDate < new Date().toISOString().split("T")[0];
}

export default function TasksPageClient({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<Filter>("pending");
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const counts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
    overdue: tasks.filter(isOverdue).length,
  }), [tasks]);

  const visible = useMemo(() => {
    switch (filter) {
      case "pending": return tasks.filter((t) => !t.completed);
      case "completed": return tasks.filter((t) => t.completed);
      case "overdue": return tasks.filter(isOverdue);
      default: return tasks;
    }
  }, [tasks, filter]);

  async function toggle(task: Task) {
    const updated = { ...task, completed: !task.completed };
    setTasks((t) => t.map((x) => (x.id === task.id ? updated : x)));
    await fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id, completed: updated.completed }),
    });
  }

  async function remove(id: string) {
    setTasks((t) => t.filter((x) => x.id !== id));
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle.trim(), dueDate: newDate || undefined }),
    });
    const data = await res.json();
    if (data.task) setTasks((t) => [data.task, ...t]);
    setNewTitle(""); setNewDate(""); setShowAdd(false);
  }

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "pending", label: "Pending" },
    { key: "all", label: "All" },
    { key: "completed", label: "Completed" },
    { key: "overdue", label: "Overdue" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description={`${counts.pending} pending · ${counts.completed} completed`}
        action={
          <Button
            onClick={() => setShowAdd(!showAdd)}
            className="h-8 gap-1.5 rounded-lg bg-zinc-900 px-3 text-xs text-white hover:bg-zinc-800"
          >
            <Plus size={13} /> New task
          </Button>
        }
      />

      {/* Add form */}
      {showAdd && (
        <form
          onSubmit={add}
          className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3"
        >
          <Input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task title…"
            className="h-8 flex-1 border-0 bg-transparent text-sm shadow-none focus-visible:ring-0 px-0"
          />
          <input
            type="date"
            min={today}
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="h-8 rounded-lg border border-zinc-200 bg-zinc-50 px-2 text-xs text-zinc-600 outline-none"
          />
          <Button
            type="submit"
            className="h-8 rounded-lg bg-zinc-900 px-3 text-xs text-white hover:bg-zinc-800"
          >
            Add
          </Button>
          <button type="button" onClick={() => setShowAdd(false)} className="text-zinc-400 hover:text-zinc-700">
            <X size={14} />
          </button>
        </form>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-1 border-b border-zinc-200">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`relative px-3 pb-2.5 pt-0.5 text-xs font-medium transition-colors ${
              filter === key
                ? "text-zinc-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-zinc-900"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {label}
            {counts[key] > 0 && (
              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                filter === key ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500"
              }`}>
                {counts[key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-1">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16 text-center">
            <CheckSquare size={28} className="mb-2 text-zinc-200" />
            <p className="text-sm text-zinc-400">No {filter !== "all" ? filter : ""} tasks</p>
            {filter === "pending" && (
              <button onClick={() => setShowAdd(true)} className="mt-2 text-xs text-[#C2786B] hover:underline">
                Add a task
              </button>
            )}
          </div>
        ) : (
          visible.map((task) => {
            const overdue = isOverdue(task);
            return (
              <div
                key={task.id}
                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white hover:border hover:border-zinc-200 transition-all border border-transparent"
              >
                <button
                  onClick={() => toggle(task)}
                  className={`shrink-0 transition-colors ${
                    task.completed ? "text-[#C2786B]" : "text-zinc-300 hover:text-zinc-500"
                  }`}
                >
                  {task.completed ? <CheckSquare size={16} /> : <Square size={16} />}
                </button>
                <span className={`flex-1 min-w-0 truncate text-sm ${
                  task.completed ? "text-zinc-400 line-through" : "text-zinc-800"
                }`}>
                  {task.title}
                </span>
                {task.dueDate && (
                  <div className={`shrink-0 flex items-center gap-1 text-xs ${
                    overdue ? "text-red-500" : "text-zinc-400"
                  }`}>
                    {overdue && <AlertCircle size={11} />}
                    <Clock size={11} />
                    {formatShortDate(task.dueDate)}
                  </div>
                )}
                <button
                  onClick={() => remove(task.id)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-400 transition"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
