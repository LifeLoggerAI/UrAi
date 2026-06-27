"use client";

import { useState } from "react";

type Props = {
  source: string;
  handle?: string;
};

type WaitlistStatus = "idle" | "sending" | "joined" | "already" | "fallback" | "validation" | "error";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const interestTypes = [
  "Early user",
  "Investor/supporter",
  "Accessibility partner",
  "Creator",
  "Research/clinical interest",
  "Other",
] as const;

function getStatusCopy(status: WaitlistStatus, errorMessage: string) {
  if (status === "sending") return "Submitting your request...";
  if (status === "joined") return "Request received. We will send launch updates and evidence-backed access news only.";
  if (status === "already") return "You are already on the list. We refreshed your access request safely.";
  if (status === "fallback") return "Waitlist capture is unavailable in this environment. Email support@urai.app if this is urgent.";
  if (status === "validation") return "Please enter a valid email address.";
  if (status === "error") return errorMessage || "Access request could not be saved in this environment.";
  return "Private systems stay closed until you are granted access and consent gates are complete.";
}

export default function WaitlistForm({ source, handle }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interestType, setInterestType] = useState<(typeof interestTypes)[number]>("Early user");
  const [status, setStatus] = useState<WaitlistStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const trimmedEmail = email.trim();
  const safeSource = source.replace(/[^a-zA-Z0-9_-]/g, "-");
  const statusId = `waitlist-status-${safeSource}`;
  const emailId = `waitlist-email-${safeSource}`;
  const nameId = `waitlist-name-${safeSource}`;
  const interestId = `waitlist-interest-${safeSource}`;
  const isInvalid = status === "validation" || status === "error";

  async function joinWaitlist() {
    if (status === "sending") return;

    if (!emailPattern.test(trimmedEmail)) {
      setStatus("validation");
      setErrorMessage("");
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
          name: name.trim() || undefined,
          interestType,
          source,
          handle,
          intent: "early-access",
        }),
      });

      if (!response.ok) {
        setStatus("error");
        setErrorMessage("Access request could not be saved in this environment. You can still explore the public demo.");
        return;
      }

      const body = (await response.json().catch(() => ({}))) as { mode?: string; duplicate?: boolean };

      if (body.mode === "dry-run") {
        setStatus("fallback");
        return;
      }

      setStatus(body.duplicate ? "already" : "joined");
      setEmail("");
      setName("");
    } catch {
      setStatus("fallback");
    }
  }

  const statusCopy = getStatusCopy(status, errorMessage);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-cyan-100/20 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.16),transparent_12rem),radial-gradient(circle_at_82%_16%,rgba(45,212,191,0.16),transparent_15rem),linear-gradient(145deg,rgba(15,23,42,0.82),rgba(2,6,23,0.9))] p-5 text-white shadow-[0_30px_90px_rgba(0,0,0,0.46)] backdrop-blur-2xl sm:p-6" aria-labelledby="waitlist-form-title">
      <div aria-hidden="true" className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-200/18 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-teal-200/12 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="inline-flex rounded-full border border-cyan-100/25 bg-cyan-100/10 px-3 py-1 text-[0.64rem] font-black uppercase tracking-[0.22em] text-cyan-100">
            Invite capsule
          </p>
          <h2 id="waitlist-form-title" className="mt-4 text-[clamp(1.9rem,4vw,2.7rem)] font-semibold leading-none tracking-[-0.055em]">
            Request early access
          </h2>
        </div>
        <span className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full border border-cyan-100/30 bg-cyan-100/10 shadow-[0_0_46px_rgba(103,232,249,0.35)]" aria-hidden="true">
          <span className="h-7 w-7 rounded-full bg-[radial-gradient(circle,#fff_0_16%,#67e8f9_38%,rgba(45,212,191,0.18)_72%,transparent_100%)]" />
        </span>
      </div>

      <p className="relative mt-4 text-sm leading-6 text-white/72">
        Join for launch updates and carefully gated private beta invitations. Joining does not enable private sensing, provider access, personal data collection, or account unlocks.
      </p>

      <form
        className="relative mt-6 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void joinWaitlist();
        }}
      >
        <div className="grid gap-2">
          <label className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100/78" htmlFor={emailId}>Email</label>
          <input
            id={emailId}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (isInvalid) {
                setStatus("idle");
                setErrorMessage("");
              }
            }}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="min-h-13 w-full rounded-2xl border border-white/12 bg-white/[0.075] px-4 py-3 text-base text-white outline-none transition placeholder:text-white/36 focus:border-cyan-200/70 focus:ring-4 focus:ring-cyan-200/18"
            aria-describedby={statusId}
            aria-invalid={isInvalid}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100/78" htmlFor={nameId}>Name optional</label>
            <input
              id={nameId}
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              placeholder="Your name"
              className="min-h-12 rounded-2xl border border-white/12 bg-white/[0.075] px-4 text-sm text-white outline-none transition placeholder:text-white/36 focus:border-cyan-200/70 focus:ring-4 focus:ring-cyan-200/18"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100/78" htmlFor={interestId}>Role / intent</label>
            <select
              id={interestId}
              value={interestType}
              onChange={(event) => setInterestType(event.target.value as (typeof interestTypes)[number])}
              className="min-h-12 rounded-2xl border border-white/12 bg-white/[0.075] px-4 text-sm text-white [color-scheme:dark] outline-none transition focus:border-cyan-200/70 focus:ring-4 focus:ring-cyan-200/18"
            >
              {interestTypes.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" disabled={status === "sending"} className="min-h-13 rounded-full border border-cyan-100/50 bg-gradient-to-br from-cyan-100 via-teal-200 to-emerald-200 px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-slate-950 shadow-[0_20px_54px_rgba(45,212,191,0.26)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_70px_rgba(45,212,191,0.34)] active:translate-y-0 disabled:cursor-wait disabled:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
          {status === "sending" ? "Requesting..." : status === "joined" || status === "already" ? "Request received" : "Request Access"}
        </button>

        <div className="grid gap-2 text-xs leading-5 text-white/58 sm:grid-cols-3">
          <p className="rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2">No spam. Launch updates only.</p>
          <p className="rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2">We will not sell your data.</p>
          <p className="rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2">Private systems stay closed until consent gates pass.</p>
        </div>

        <p id={statusId} className="rounded-2xl border border-white/12 bg-slate-950/58 p-3 text-sm leading-6 text-white/72" role="status" aria-live="polite">
          {statusCopy}
        </p>
      </form>
    </section>
  );
}
