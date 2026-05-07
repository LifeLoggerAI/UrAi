"use client";

import { useState } from "react";
import type { CompanionChatOutput } from "@/lib/urai-v1-schemas";

export default function CompanionChat() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<CompanionChatOutput | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const trimmedMessage = message.trim();
  const canSubmit = Boolean(trimmedMessage) && !isSending;

  async function sendMessage() {
    if (isSending) return;

    if (!trimmedMessage) {
      setErrorMessage("Write a question for the companion first.");
      return;
    }

    setIsSending(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: [], message: trimmedMessage })
      });

      if (!response.ok) {
        setErrorMessage("URAI could not read that pattern yet. Try a shorter question.");
        return;
      }

      const data = (await response.json()) as CompanionChatOutput;
      setReply(data);
      setMessage("");
    } catch {
      setErrorMessage("Connection issue. Try again when your network is stable.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-black/35 p-4 text-white shadow-2xl backdrop-blur-md">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Companion</p>
      <h2 className="mb-3 text-lg font-semibold">Ask URAI what the pattern means</h2>
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          void sendMessage();
        }}
      >
        <label className="sr-only" htmlFor="companion-message">
          Message URAI Companion
        </label>
        <input
          id="companion-message"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            if (errorMessage) setErrorMessage("");
          }}
          placeholder="What should I build next?"
          className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-white/40 focus:ring-2 focus:ring-white/20"
          aria-describedby={errorMessage ? "companion-error" : reply ? "companion-reply" : undefined}
          aria-invalid={Boolean(errorMessage)}
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSending ? "Reading..." : "Send"}
        </button>
      </form>
      {errorMessage && (
        <p id="companion-error" className="mt-3 text-sm text-red-200" aria-live="polite">
          {errorMessage}
        </p>
      )}
      {reply && (
        <div id="companion-reply" className="mt-4 rounded-2xl bg-white/10 p-3" aria-live="polite">
          <p className="text-sm leading-6 text-white/90">{reply.reply}</p>
          <p className="mt-2 text-xs text-white/60">Mood: {reply.moodTag}</p>
        </div>
      )}
    </section>
  );
}
