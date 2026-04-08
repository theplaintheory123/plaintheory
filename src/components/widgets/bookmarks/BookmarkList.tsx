"use client";

import { useState } from "react";
import { Bookmark } from "@/types";
import { ExternalLink, Plus, Trash2, Link2 } from "lucide-react";

interface Props {
  initialBookmarks: Bookmark[];
}

export default function BookmarkList({ initialBookmarks }: Props) {
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
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-[#1A1817]/40">Bookmarks</h3>
        <button onClick={() => setShowAdd(!showAdd)} className="rounded-lg p-1 text-[#1A1817]/30 hover:bg-[#C2786B]/10 hover:text-[#C2786B] transition">
          <Plus size={16} />
        </button>
      </div>

      {showAdd && (
        <form onSubmit={addBookmark} className="mb-3 flex flex-col gap-2 rounded-xl border border-[#C2786B]/20 bg-[#FAF8F5] p-3">
          <input
            autoFocus
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-transparent text-sm text-[#1A1817] outline-none placeholder:text-[#1A1817]/30"
          />
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="URL"
            className="w-full bg-transparent text-sm text-[#1A1817] outline-none placeholder:text-[#1A1817]/30 font-mono"
          />
          <button type="submit" disabled={adding} className="self-end rounded-lg bg-[#C2786B] px-3 py-1 text-xs text-white disabled:opacity-50">
            Add
          </button>
        </form>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          {bookmarks.map((bm) => {
            const favicon = getFavicon(bm.url);
            return (
              <div key={bm.id} className="group relative flex items-center gap-2 rounded-xl border border-[#1A1817]/6 bg-white p-3 hover:border-[#C2786B]/30 transition">
                <a href={bm.url} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center gap-2 min-w-0">
                  {favicon ? (
                    <img src={favicon} alt="" className="h-4 w-4 shrink-0 rounded" />
                  ) : (
                    <Link2 size={14} className="shrink-0 text-[#1A1817]/30" />
                  )}
                  <span className="truncate text-xs text-[#1A1817] font-medium">{bm.title}</span>
                </a>
                <button
                  onClick={() => deleteBookmark(bm.id)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 text-[#1A1817]/20 hover:text-red-400 transition"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}
        </div>

        {bookmarks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Link2 size={24} className="mb-2 text-[#1A1817]/10" />
            <p className="text-sm text-[#1A1817]/30">No bookmarks yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
