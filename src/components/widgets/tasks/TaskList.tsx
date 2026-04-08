"use client";

import { useState } from "react";
import { Task } from "@/types";
import { CheckSquare, Square, Trash2, Plus, Calendar } from "lucide-react";
import { formatShortDate } from "@/lib/utils";

interface Props {
  initialTasks: Task[];
}

export default function TaskList({ initialTasks }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [adding, setAdding] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  async function toggleTask(task: Task) {
    const updated = { ...task, completed: !task.completed };
    setTasks((t) => t.map((x) => (x.id === task.id ? updated : x)));
    await fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id, completed: updated.completed }),
    });
  }

  async function deleteTask(id: string) {
    setTasks((t) => t.filter((x) => x.id !== id));
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle.trim(), dueDate: newDate || undefined }),
    });
    const data = await res.json();
    if (data.task) setTasks((t) => [data.task, ...t]);
    setNewTitle("");
    setNewDate("");
    setShowAdd(false);
    setAdding(false);
  }

  const pending = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-[#1A1817]/40">Tasks <span className="text-[#C2786B]">{pending.length}</span></h3>
        <button onClick={() => setShowAdd(!showAdd)} className="rounded-lg p-1 text-[#1A1817]/30 hover:bg-[#C2786B]/10 hover:text-[#C2786B] transition">
          <Plus size={16} />
        </button>
      </div>

      {showAdd && (
        <form onSubmit={addTask} className="mb-3 flex flex-col gap-2 rounded-xl border border-[#C2786B]/20 bg-[#FAF8F5] p-3">
          <input
            autoFocus
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task title…"
            className="w-full bg-transparent text-sm text-[#1A1817] outline-none placeholder:text-[#1A1817]/30"
          />
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="flex-1 bg-transparent text-xs text-[#1A1817]/60 outline-none"
            />
            <button type="submit" disabled={adding} className="rounded-lg bg-[#C2786B] px-3 py-1 text-xs text-white disabled:opacity-50">
              Add
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto space-y-1">
        {pending.map((task) => (
          <div key={task.id} className="group flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-white transition">
            <button onClick={() => toggleTask(task)} className="shrink-0 text-[#1A1817]/30 hover:text-[#C2786B] transition">
              <Square size={15} />
            </button>
            <span className="flex-1 min-w-0 truncate text-sm text-[#1A1817]">{task.title}</span>
            {task.dueDate && (
              <span className="flex items-center gap-1 text-[10px] text-[#1A1817]/40 shrink-0">
                <Calendar size={10} />
                {formatShortDate(task.dueDate)}
              </span>
            )}
            <button
              onClick={() => deleteTask(task.id)}
              className="shrink-0 opacity-0 group-hover:opacity-100 text-[#1A1817]/20 hover:text-red-400 transition"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}

        {done.length > 0 && (
          <>
            <div className="pt-2 pb-1 text-[10px] uppercase tracking-wider text-[#1A1817]/20">Done</div>
            {done.slice(0, 5).map((task) => (
              <div key={task.id} className="group flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-white transition">
                <button onClick={() => toggleTask(task)} className="shrink-0 text-[#C2786B]/60">
                  <CheckSquare size={15} />
                </button>
                <span className="flex-1 min-w-0 truncate text-sm text-[#1A1817]/40 line-through">{task.title}</span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 text-[#1A1817]/20 hover:text-red-400 transition"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </>
        )}

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckSquare size={24} className="mb-2 text-[#1A1817]/10" />
            <p className="text-sm text-[#1A1817]/30">No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
