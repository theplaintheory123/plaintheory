"use client";

import { useState } from "react";
import { Task } from "@/types";
import { CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckSquare, Square, Trash2, Plus, X } from "lucide-react";
import { formatShortDate } from "@/lib/utils";

export default function TaskList({ initialTasks }: { initialTasks: Task[] }) {
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
    <>
      <CardHeader className="border-b border-stone-100 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare size={14} className="text-stone-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Tasks
            </span>
            {pending.length > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C2786B]/15 px-1 text-[10px] font-semibold text-[#C2786B]">
                {pending.length}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg"
            onClick={() => setShowAdd(!showAdd)}
          >
            {showAdd ? <X size={14} /> : <Plus size={14} />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex flex-col gap-3 h-72">
        {/* Add form */}
        {showAdd && (
          <form onSubmit={addTask} className="flex flex-col gap-2 rounded-xl border border-[#C2786B]/25 bg-[#C2786B]/4 p-3">
            <Input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task title…"
              className="h-8 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="flex-1 bg-transparent text-xs text-stone-500 outline-none"
              />
              <Button type="submit" size="sm" disabled={adding} className="h-7 rounded-lg bg-[#C2786B] text-white hover:bg-[#C2786B]/80 text-xs px-3">
                Add
              </Button>
            </div>
          </form>
        )}

        <ScrollArea className="flex-1">
          <div className="space-y-0.5 pr-3">
            {pending.map((task) => (
              <div key={task.id} className="group flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-stone-50 transition">
                <button onClick={() => toggleTask(task)} className="shrink-0 text-stone-300 hover:text-[#C2786B] transition">
                  <Square size={15} />
                </button>
                <span className="flex-1 min-w-0 truncate text-sm text-stone-700">{task.title}</span>
                {task.dueDate && (
                  <span className="shrink-0 text-[10px] text-stone-400">{formatShortDate(task.dueDate)}</span>
                )}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}

            {done.length > 0 && (
              <>
                <div className="py-2 text-[10px] font-semibold uppercase tracking-wider text-stone-300 px-2">
                  Completed
                </div>
                {done.slice(0, 5).map((task) => (
                  <div key={task.id} className="group flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-stone-50 transition">
                    <button onClick={() => toggleTask(task)} className="shrink-0 text-[#C2786B]/50">
                      <CheckSquare size={15} />
                    </button>
                    <span className="flex-1 min-w-0 truncate text-sm text-stone-400 line-through">{task.title}</span>
                    <button onClick={() => deleteTask(task.id)} className="shrink-0 opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </>
            )}

            {tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckSquare size={28} className="mb-2 text-stone-200" />
                <p className="text-sm text-stone-400">No tasks yet</p>
                <button onClick={() => setShowAdd(true)} className="mt-2 text-xs text-[#C2786B] hover:underline">
                  Add your first task
                </button>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </>
  );
}
