"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, Edit3, Save } from "lucide-react";

interface Props {
  initialContent: string;
}

export default function NotesEditor({ initialContent }: Props) {
  const [content, setContent] = useState(initialContent);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (content === initialContent) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, 1500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [content]);

  async function save() {
    setSaving(true);
    await fetch("/api/notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  // Basic markdown to HTML (bold, italic, headings, lists)
  function renderMarkdown(md: string): string {
    return md
      .replace(/^### (.+)$/gm, "<h3 style='font-size:14px;font-weight:500;margin:8px 0 4px'>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2 style='font-size:16px;font-weight:500;margin:10px 0 4px'>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1 style='font-size:18px;font-weight:500;margin:12px 0 4px'>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/^- (.+)$/gm, "<li style='margin:2px 0'>$1</li>")
      .replace(/\n/g, "<br>");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-[#1A1817]/40">Notes</h3>
        <div className="flex items-center gap-2">
          {saving && <span className="text-[10px] text-[#1A1817]/30">Saving…</span>}
          {saved && <span className="text-[10px] text-[#C2786B]">Saved</span>}
          <button
            onClick={() => setPreview(!preview)}
            className="rounded-lg p-1 text-[#1A1817]/30 hover:bg-[#1A1817]/5 hover:text-[#1A1817] transition"
          >
            {preview ? <Edit3 size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      {preview ? (
        <div
          className="flex-1 overflow-y-auto text-sm text-[#1A1817]/80 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) || '<span style="opacity:0.3">Nothing here yet…</span>' }}
        />
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing… supports **bold**, *italic*, # headings, - lists"
          className="flex-1 resize-none bg-transparent text-sm text-[#1A1817] placeholder:text-[#1A1817]/25 outline-none leading-relaxed font-mono"
        />
      )}
    </div>
  );
}
