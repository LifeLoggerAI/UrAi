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
        body: JSON.stringify({ email: trimmedEmail, source, handle, intent: "early-access" })
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
    <section className="urai-sacred-card urai-sacred-card--gold p-5 text-white transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-amber-100/65">Early Access</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Join Early Access</h2>
        </div>
        <span className="urai-orb-artifact urai-orb-artifact--gold urai-orb-artifact--small" aria-hidden="true" />
      </div>
      <p className="mt-4 text-sm leading-6 text-white/70">
        Get launch updates for the URAI public demo and the evidence-gated path toward private Life Map features.
      </p>
      <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={(event) => { event.preventDefault(); void joinWaitlist(); }}>
        <label className="sr-only" htmlFor={`waitlist-email-${source}`}>Email address</label>
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
          className="urai-field-input min-h-11 min-w-0 flex-1 rounded-2xl px-3 py-2 text-sm outline-none transition focus:border-white/40 focus:ring-2 focus:ring-white/20"
          aria-describedby={status === "idle" ? undefined : statusId}
          aria-invalid={status === "error"}
        />
        <button type="submit" disabled={!canSubmit} className="urai-premium-cta min-h-11 disabled:cursor-not-allowed disabled:opacity-40">
          {status === "sending" ? "Submitting" : status === "joined" ? "Joined" : "Request Access"}
        </button>
      </form>
      <p className="mt-3 text-xs leading-5 text-white/45">No spam. Launch updates only. You control your data.</p>
      <div id={statusId} aria-live="polite">
        {status === "sending" && <p className="urai-loading-signal mt-3 text-sm">Submitting your request...</p>}
        {status === "joined" && <p className="urai-success-signal mt-3 text-sm">You are on the list. Launch access updates will arrive here.</p>}
        {status === "error" && <p className="urai-error-signal mt-3 text-sm">{errorMessage}</p>}
      </div>
    </section>
  );
}