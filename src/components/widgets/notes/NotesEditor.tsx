"use client";

import { useState, useEffect, useRef } from "react";
import { CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Eye, Edit3 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NotesEditor({ initialContent }: { initialContent: string }) {
  const [content, setContent] = useState(initialContent);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (content === initialContent) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(save, 1500);
    return () => { if (timer.current) clearTimeout(timer.current); };
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

  function renderMarkdown(md: string) {
    return md
      .replace(/^### (.+)$/gm, "<h3 class='text-sm font-semibold mt-3 mb-1'>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2 class='text-base font-semibold mt-4 mb-1'>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1 class='text-lg font-semibold mt-4 mb-2'>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/^- (.+)$/gm, "<li class='ml-4 list-disc text-sm'>$1</li>")
      .replace(/\n/g, "<br/>");
  }

  return (
    <>
      <CardHeader className="border-b border-stone-100 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 size={14} className="text-stone-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Notes</span>
          </div>
          <div className="flex items-center gap-2">
            {saving && <span className="text-[10px] text-stone-400">Saving…</span>}
            {saved && <span className="text-[10px] text-[#C2786B] font-medium">Saved ✓</span>}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg"
              onClick={() => setPreview(!preview)}
              title={preview ? "Edit" : "Preview"}
            >
              {preview ? <Edit3 size={13} /> : <Eye size={13} />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 h-64">
        {preview ? (
          <ScrollArea className="h-full">
            <div
              className="prose prose-sm max-w-none text-stone-700 pr-3"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(content) || "<span class='text-stone-300'>Nothing here yet…</span>",
              }}
            />
          </ScrollArea>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"Start writing…\n\nSupports **bold**, *italic*\n# headings, - lists"}
            className="h-full w-full resize-none bg-transparent font-mono text-sm leading-relaxed text-stone-700 placeholder:text-stone-300 outline-none"
          />
        )}
      </CardContent>
    </>
  );
}
