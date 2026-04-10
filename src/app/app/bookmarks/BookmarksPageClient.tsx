"use client";

import { useState, useMemo } from "react";
import { Bookmark } from "@/types";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, X, Search, ExternalLink, Link2, Trash2 } from "lucide-react";

export default function BookmarksPageClient({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => search ? bookmarks.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()) || b.url.includes(search)) : bookmarks,
    [bookmarks, search]
  );

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    const full = url.startsWith("http") ? url : `https://${url}`;
    const res = await fetch("/api/bookmarks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: title.trim(), url: full }) });
    const data = await res.json();
    if (data.bookmark) setBookmarks((b) => [...b, data.bookmark]);
    setTitle(""); setUrl(""); setShowAdd(false);
  }

  async function remove(id: string) {
    setBookmarks((b) => b.filter((x) => x.id !== id));
    await fetch("/api/bookmarks", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
  }

  const favicon = (u: string) => {
    try { return `https://www.google.com/s2/favicons?domain=${new URL(u).hostname}&sz=32`; } catch { return null; }
  };
  const domain = (u: string) => {
    try { return new URL(u).hostname.replace("www.", ""); } catch { return u; }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookmarks"
        description={`${bookmarks.length} saved`}
        action={
          <Button onClick={() => setShowAdd(!showAdd)} className="h-8 gap-1.5 rounded-lg bg-zinc-900 px-3 text-xs text-white hover:bg-zinc-800">
            <Plus size={13} /> Add bookmark
          </Button>
        }
      />

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bookmarks…" className="h-9 pl-8 rounded-lg text-sm border-zinc-200" />
      </div>

      {/* Add form */}
      {showAdd && (
        <form onSubmit={add} className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center">
          <Input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="h-8 flex-1 text-sm" />
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className="h-8 flex-1 font-mono text-xs" />
          <div className="flex gap-2">
            <Button type="submit" className="h-8 rounded-lg bg-zinc-900 px-3 text-xs text-white hover:bg-zinc-800">Save</Button>
            <button type="button" onClick={() => setShowAdd(false)} className="text-zinc-400 hover:text-zinc-700"><X size={14} /></button>
          </div>
        </form>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16 text-center">
          <Link2 size={28} className="mb-2 text-zinc-200" />
          <p className="text-sm text-zinc-400">{search ? "No results" : "No bookmarks yet"}</p>
          {!search && <button onClick={() => setShowAdd(true)} className="mt-2 text-xs text-[#C2786B] hover:underline">Add your first bookmark</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((bm) => {
            const fav = favicon(bm.url);
            return (
              <div key={bm.id} className="group flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 hover:border-zinc-300 transition-colors">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-50">
                  {fav ? <img src={fav} alt="" className="h-4 w-4 rounded" /> : <Link2 size={14} className="text-zinc-300" />}
                </div>
                <a href={bm.url} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-800 group-hover:text-zinc-900">{bm.title}</p>
                  <p className="truncate text-xs text-zinc-400">{domain(bm.url)}</p>
                </a>
                <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={bm.url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-700" onClick={(e) => e.stopPropagation()}>
                    <ExternalLink size={13} />
                  </a>
                  <button onClick={() => remove(bm.id)} className="text-zinc-400 hover:text-red-400"><Trash2 size={13} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
