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
      setErrorMessage("Enter a valid email address before joining.");
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
        setErrorMessage("We could not join the waitlist. Check the email and try again.");
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
    <section className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-md">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Early Access</p>
      <h2 className="mt-1 text-xl font-semibold">Join the URAI waitlist</h2>
      <p className="mt-2 text-sm leading-6 text-white/70">
        Get the first public build when the demo spine moves into launch testing.
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
          className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/40 focus:ring-2 focus:ring-white/20"
          aria-describedby={status === "idle" ? undefined : statusId}
          aria-invalid={status === "error"}
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "sending" ? "Joining..." : "Join"}
        </button>
      </form>
      <div id={statusId} aria-live="polite">
        {status === "joined" && <p className="mt-3 text-sm text-emerald-200">You are on the list.</p>}
        {status === "error" && <p className="mt-3 text-sm text-red-200">{errorMessage}</p>}
      </div>
    </section>
  );
}
