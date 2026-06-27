"use client";

import { useId, useState } from "react";

const INTEREST_TYPES = [
  "Early user",
  "Investor/supporter",
  "Accessibility partner",
  "Creator",
  "Research/clinical interest",
  "Other",
];

type WaitlistStatus = "idle" | "saving" | "success" | "error" | "validation";

function hasValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function WaitlistCapture({ source = "launch" }: { source?: string }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interestType, setInterestType] = useState(INTEREST_TYPES[0]);
  const [status, setStatus] = useState<WaitlistStatus>("idle");

  const statusId = `${id}-status`;
  const isValid = hasValidEmail(email);

  async function submit() {
    if (status === "saving") return;
    if (!isValid) {
      setStatus("validation");
      return;
    }

    setStatus("saving");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined, interestType, source }),
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section className="rounded-[1.8rem] border border-white/12 bg-[radial-gradient(circle_at_0_0,rgba(153,246,228,0.18),transparent_16rem)] bg-slate-950/70 p-5 text-white shadow-2xl shadow-black/30" aria-live="polite">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Request received</p>
        <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-none tracking-[-0.05em]">You are on the list.</h2>
        <p className="mt-3 text-sm leading-6 text-white/70">
          URAI will only send launch updates and evidence-backed access news. This does not enable
          private accounts, passive sensing, or provider-backed media generation.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[1.8rem] border border-white/12 bg-[radial-gradient(circle_at_0_0,rgba(45,212,191,0.16),transparent_17rem)] bg-slate-950/60 p-5 text-white shadow-2xl shadow-black/30" aria-labelledby={`${id}-title`}>
      <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Invite panel</p>
      <h2 id={`${id}-title`} className="mt-3 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-none tracking-[-0.05em]">Join the URAI waitlist.</h2>
      <p className="mt-3 text-sm leading-6 text-white/70">
        Get public demo updates and early-access news as private Life Map features move through
        consent, privacy, and launch evidence gates.
      </p>      <form
        className="mt-5 grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <label className="text-xs font-extrabold uppercase tracking-[0.1em] text-white/76" htmlFor={`${id}-email`}>Email</label>
        <input
          id={`${id}-email`}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "validation") setStatus("idle");
          }}
          placeholder="you@example.com"
          type="email"
          autoComplete="email"
          aria-describedby={statusId}
          className="min-h-12 rounded-2xl border border-white/12 bg-white/[0.075] px-4 text-sm text-white outline-none placeholder:text-white/36 focus:border-cyan-200/60 focus:ring-4 focus:ring-cyan-200/15"
        />

        <label className="text-xs font-extrabold uppercase tracking-[0.1em] text-white/76" htmlFor={`${id}-name`}>Name optional</label>
        <input
          id={`${id}-name`}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          autoComplete="name"
          className="min-h-12 rounded-2xl border border-white/12 bg-white/[0.075] px-4 text-sm text-white outline-none placeholder:text-white/36 focus:border-cyan-200/60 focus:ring-4 focus:ring-cyan-200/15"
        />

        <label className="text-xs font-extrabold uppercase tracking-[0.1em] text-white/76" htmlFor={`${id}-interest`}>Role / intent</label>
        <select
          id={`${id}-interest`}
          value={interestType}
          onChange={(event) => setInterestType(event.target.value)}
          className="min-h-12 rounded-2xl border border-white/12 bg-white/[0.075] px-4 text-sm text-white [color-scheme:dark] outline-none focus:border-cyan-200/60 focus:ring-4 focus:ring-cyan-200/15"
        >
          {INTEREST_TYPES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button type="submit" disabled={status === "saving"} aria-describedby={statusId} className="min-h-12 rounded-full border border-teal-100/40 bg-gradient-to-br from-teal-300 to-cyan-200 px-5 text-sm font-extrabold text-teal-950 shadow-[0_18px_44px_rgba(20,184,166,0.2)] disabled:cursor-wait disabled:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
          {status === "saving" ? "Joining..." : "Join waitlist"}
        </button>

        <p className="text-xs leading-5 text-white/58">
          We will not sell your waitlist information. We only use this to contact you about URAI
          access.
        </p>

        <p id={statusId} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3 text-xs leading-5 text-white/66" role="status" aria-live="polite">
          {status === "validation"
            ? "Enter a valid email address to join the waitlist."
            : status === "error"
              ? "Waitlist capture is unavailable in this environment. Email support@urai.app if urgent."
              : "Public demo access stays sample-only until private gates are verified."}
        </p>
      </form>
    </section>
  );
}