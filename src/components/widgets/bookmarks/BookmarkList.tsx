"use client";

import { useState } from "react";
import { Bookmark } from "@/types";
import { CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Bookmark as BookmarkIcon, Plus, Trash2, X, Link2 } from "lucide-react";

export default function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [adding, setAdding] = useState(false);

  async function addBookmark(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;
    setAdding(true);
    const url = newUrl.startsWith("http") ? newUrl : `https://${newUrl}`;
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle.trim(), url }),
    });
    const data = await res.json();
    if (data.bookmark) setBookmarks((b) => [...b, data.bookmark]);
    setNewTitle("");
    setNewUrl("");
    setShowAdd(false);
    setAdding(false);
  }

  async function deleteBookmark(id: string) {
    setBookmarks((b) => b.filter((x) => x.id !== id));
    await fetch("/api/bookmarks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  function getFavicon(url: string) {
    try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`; }
    catch { return null; }
  }

  return (
    <>
      <CardHeader className="border-b border-stone-100 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookmarkIcon size={14} className="text-stone-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Bookmarks</span>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? <X size={14} /> : <Plus size={14} />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex flex-col gap-3 h-64">
        {showAdd && (
          <form onSubmit={addBookmark} className="flex flex-col gap-2 rounded-xl border border-[#C2786B]/25 bg-[#C2786B]/4 p-3">
            <Input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title"
              className="h-8 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
            />
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="URL"
              className="h-8 border-0 bg-transparent px-0 font-mono text-xs shadow-none focus-visible:ring-0"
            />
            <Button type="submit" size="sm" disabled={adding} className="self-end h-7 rounded-lg bg-[#C2786B] px-3 text-xs text-white hover:bg-[#C2786B]/80">
              Save
            </Button>
          </form>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {bookmarks.map((bm) => {
              const favicon = getFavicon(bm.url);
              return (
                <div key={bm.id} className="group relative flex items-center gap-2 rounded-xl border border-stone-100 bg-stone-50 p-3 hover:border-stone-200 hover:bg-white transition">
                  <a href={bm.url} target="_blank" rel="noopener noreferrer" className="flex min-w-0 flex-1 items-center gap-2">
                    {favicon ? (
                      <img src={favicon} alt="" className="h-4 w-4 shrink-0 rounded" />
                    ) : (
                      <Link2 size={13} className="shrink-0 text-stone-300" />
                    )}
                    <span className="truncate text-xs font-medium text-stone-700">{bm.title}</span>
                  </a>
                  <button
                    onClick={() => deleteBookmark(bm.id)}
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              );
            })}
          </div>

          {bookmarks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Link2 size={28} className="mb-2 text-stone-200" />
              <p className="text-sm text-stone-400">No bookmarks yet</p>
              <button onClick={() => setShowAdd(true)} className="mt-2 text-xs text-[#C2786B] hover:underline">
                Add a bookmark
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </>
  );
}
