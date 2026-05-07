"use client";

import { useState } from "react";
import type { CompanionChatOutput } from "@/lib/urai-v1-schemas";

export default function CompanionChat() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<CompanionChatOutput | null>(null);
  const [isSending, setIsSending] = useState(false);

  async function sendMessage() {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;
    setIsSending(true);
    const response = await fetch("/api/companion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: [], message: trimmed })
    });
    if (response.ok) {
      const data = (await response.json()) as CompanionChatOutput;
      setReply(data);
      setMessage("");
    }
    setIsSending(false);
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-black/35 p-4 text-white shadow-2xl backdrop-blur-md">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Companion</p>
      <h2 className="mb-3 text-lg font-semibold">Ask URAI what the pattern means</h2>
      <div className="flex gap-2">
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") void sendMessage();
          }}
          placeholder="What should I build next?"
          className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/45 outline-none"
          aria-label="Message URAI Companion"
        />
        <button
          type="button"
          onClick={() => void sendMessage()}
          disabled={isSending || !message.trim()}
          className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-40"
        >
          {isSending ? "..." : "Send"}
        </button>
      </div>
      {reply && (
        <div className="mt-4 rounded-2xl bg-white/10 p-3">
          <p className="text-sm leading-6 text-white/90">{reply.reply}</p>
          <p className="mt-2 text-xs text-white/60">Mood: {reply.moodTag}</p>
        </div>
      )}
    </section>
  );
}
