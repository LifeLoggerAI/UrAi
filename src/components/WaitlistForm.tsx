"use client";

import { useState } from "react";

type Props = {
  source: string;
  handle?: string;
};

type WaitlistStatus = "idle" | "sending" | "joined" | "error";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WaitlistForm({ source, handle }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<WaitlistStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const trimmedEmail = email.trim();
  const canSubmit = emailPattern.test(trimmedEmail) && status !== "sending";
  const statusId = `waitlist-status-${source}`;

  async function joinWaitlist() {
    if (status === "sending") return;

    if (!emailPattern.test(trimmedEmail)) {
      setStatus("error");
      setErrorMessage("Enter a valid email address to join early access.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          source,
          handle,
          intent: "early-access"
        })
      });

      if (!response.ok) {
        setStatus("error");
        setErrorMessage("We could not save that email. Check it and try again.");
        return;
      }

      setStatus("joined");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage("Network issue. Try again when your connection is stable.");
    }
  }

  return (
    <section className="rounded-3xl border border-white/15 bg-black/40 p-5 text-white shadow-2xl backdrop-blur-md transition hover:border-white/25 hover:bg-black/45">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-emerald-100/65">Early Access</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">Join Early Access</h2>
      <p className="mt-3 text-sm leading-6 text-white/70">
        Be first to explore URAI&apos;s private Life Map, companion reflections, and emotional constellation preview.
      </p>
      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          void joinWaitlist();
        }}
      >
        <label className="sr-only" htmlFor={`waitlist-email-${source}`}>
          Email address
        </label>
        <input
          id={`waitlist-email-${source}`}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "error") {
              setStatus("idle");
              setErrorMessage("");
            }
          }}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="min-h-11 min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/40 focus:ring-2 focus:ring-white/20"
          aria-describedby={status === "idle" ? undefined : statusId}
          aria-invalid={status === "error"}
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className="min-h-11 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "sending" ? "Joining..." : status === "joined" ? "Joined" : "Request Access"}
        </button>
      </form>
      <p className="mt-3 text-xs leading-5 text-white/45">No spam. Launch updates only. You control your data.</p>
      <div id={statusId} aria-live="polite">
        {status === "sending" && <p className="mt-3 text-sm text-white/55">Saving your spot...</p>}
        {status === "joined" && <p className="mt-3 text-sm text-emerald-200">You are on the list. We will send launch access here.</p>}
        {status === "error" && <p className="mt-3 text-sm text-red-200">{errorMessage}</p>}
      </div>
    </section>
  );
}
