"use client";

import { useState } from "react";

type Props = {
  source: string;
  handle?: string;
};

export default function WaitlistForm({ source, handle }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "joined" | "error">("idle");

  async function joinWaitlist() {
    if (!email.trim() || status === "sending") return;
    setStatus("sending");

    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        source,
        handle,
        intent: "early-access"
      })
    });

    setStatus(response.ok ? "joined" : "error");
    if (response.ok) setEmail("");
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-md">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Early Access</p>
      <h2 className="mt-1 text-xl font-semibold">Join the URAI waitlist</h2>
      <p className="mt-2 text-sm leading-6 text-white/70">
        Get the first public build when the demo spine moves into launch testing.
      </p>
      <div className="mt-4 flex gap-2">
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") void joinWaitlist();
          }}
          type="email"
          placeholder="you@example.com"
          className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none"
          aria-label="Email address"
        />
        <button
          type="button"
          onClick={() => void joinWaitlist()}
          disabled={status === "sending" || !email.trim()}
          className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-40"
        >
          {status === "sending" ? "..." : "Join"}
        </button>
      </div>
      {status === "joined" && <p className="mt-3 text-sm text-emerald-200">You are on the list.</p>}
      {status === "error" && <p className="mt-3 text-sm text-red-200">Enter a valid email and try again.</p>}
    </section>
  );
}
