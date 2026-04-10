"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, Edit3 } from "lucide-react";

function renderMd(md: string) {
  return md
    .replace(/^# (.+)$/gm, "<h1 class='text-xl font-semibold text-zinc-900 mt-6 mb-2'>$1</h1>")
    .replace(/^## (.+)$/gm, "<h2 class='text-base font-semibold text-zinc-800 mt-5 mb-1'>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3 class='text-sm font-semibold text-zinc-700 mt-4 mb-1'>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong class='font-semibold text-zinc-900'>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code class='rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs text-zinc-700'>$1</code>")
    .replace(/^- (.+)$/gm, "<li class='ml-4 list-disc text-zinc-700'>$1</li>")
    .replace(/\n\n/g, "<br/><br/>");
}

export default function NotesPageClient({ initialContent }: { initialContent: string }) {
  const [content, setContent] = useState(initialContent);
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;

  useEffect(() => {
    if (content === initialContent) return;
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await fetch("/api/notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    }, 1200);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [content]);

  return (
    <div className="flex h-[calc(100vh-96px)] flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">Notes</h1>
          <p className="mt-0.5 text-sm text-zinc-500">{words} words</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs transition-opacity ${status === "idle" ? "opacity-0" : "opacity-100"} ${
            status === "saved" ? "text-[#C2786B]" : "text-zinc-400"
          }`}>
            {status === "saving" ? "Saving…" : "Saved"}
          </span>
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            {preview ? <><Edit3 size={12} /> Edit</> : <><Eye size={12} /> Preview</>}
          </button>
        </div>
      </div>

      {/* Hint bar */}
      {!preview && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-zinc-400">
          <span><code className="rounded bg-zinc-100 px-1 text-zinc-500"># h1</code></span>
          <span><code className="rounded bg-zinc-100 px-1 text-zinc-500">**bold**</code></span>
          <span><code className="rounded bg-zinc-100 px-1 text-zinc-500">*italic*</code></span>
          <span><code className="rounded bg-zinc-100 px-1 text-zinc-500">`code`</code></span>
          <span><code className="rounded bg-zinc-100 px-1 text-zinc-500">- list</code></span>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        {preview ? (
          <div className="h-full overflow-y-auto p-6">
            <div
              className="prose prose-sm max-w-none text-zinc-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: content
                  ? renderMd(content)
                  : "<span class='text-zinc-300 text-sm'>Nothing here yet…</span>",
              }}
            />
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"Start writing…\n\n# Heading\n**bold** *italic* `code`\n- bullet list"}
            className="h-full w-full resize-none bg-transparent p-6 font-mono text-sm leading-7 text-zinc-800 placeholder:text-zinc-300 outline-none"
          />
        )}
      </div>
    </div>
  );
}
