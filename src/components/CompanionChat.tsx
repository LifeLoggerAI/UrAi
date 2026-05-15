"use client";

import { useState } from "react";
import type { CompanionChatOutput } from "@/lib/urai-v1-schemas";

const suggestedPrompts = [
  "Explain this mood",
  "What should I protect?",
  "What pattern is repeating?"
];

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
      setErrorMessage("Ask a short question first so the demo can respond clearly.");
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
        setErrorMessage("The companion could not read that prompt yet. Try a shorter question.");
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
    <section className="rounded-3xl border border-white/15 bg-black/45 p-5 text-white shadow-2xl backdrop-blur-md transition hover:border-white/25 hover:bg-black/50">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-cyan-100/65">Ask URAI</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">Ask what the pattern means</h2>
      <p className="mt-3 text-sm leading-6 text-white/70">
        Ask the companion to explain the visible pattern in plain language.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => {
              setMessage(prompt);
              setErrorMessage("");
            }}
            className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-medium text-white/78 transition hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
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
          placeholder="Why do I keep crashing after focused days?"
          className="min-h-11 min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-white/40 focus:ring-2 focus:ring-white/20"
          aria-describedby={errorMessage ? "companion-error" : reply ? "companion-reply" : undefined}
          aria-invalid={Boolean(errorMessage)}
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className="min-h-11 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSending ? "Reading..." : "Ask URAI"}
        </button>
      </form>
      {errorMessage && (
        <p id="companion-error" className="mt-3 text-sm text-red-200" aria-live="polite">
          {errorMessage}
        </p>
      )}
      {reply && (
        <div id="companion-reply" className="mt-4 rounded-2xl border border-white/10 bg-white/[0.07] p-3" aria-live="polite">
          <p className="text-sm leading-6 text-white/90">{reply.reply}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/50">Mood tag · {reply.moodTag}</p>
        </div>
      )}
    </section>
  );
}
