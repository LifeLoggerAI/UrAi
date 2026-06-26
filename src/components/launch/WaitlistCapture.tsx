"use client";

import { useState } from "react";

const INTEREST_TYPES = ["Early user", "Investor/supporter", "Accessibility partner", "Creator", "Research/clinical interest", "Other"];

export function WaitlistCapture({ source = "launch" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interestType, setInterestType] = useState(INTEREST_TYPES[0]);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  const submit = async () => {
    if (!email.includes("@") || status === "saving") return;
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
  };

  if (status === "success") {
    return <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 text-white/78">You are on the list. URAI will only send launch updates and evidence-backed access news.</div>;
  }

  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-black/28 p-5 text-white shadow-2xl backdrop-blur-xl">
      <h2 className="text-xl font-medium">Join the URAI waitlist.</h2>
      <p className="mt-2 text-sm leading-6 text-white/62">Get public demo updates and early-access news as private Life Map features move through consent, privacy, and launch evidence gates.</p>
      <div className="mt-4 grid gap-3">
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" className="rounded-2xl bg-white/[0.08] px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-white/34" />
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name optional" className="rounded-2xl bg-white/[0.08] px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-white/34" />
        <select value={interestType} onChange={(event) => setInterestType(event.target.value)} className="rounded-2xl bg-white/[0.08] px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10">
          {INTEREST_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <button type="button" onClick={submit} disabled={status === "saving" || !email.includes("@")} className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black disabled:opacity-45">{status === "saving" ? "Joining..." : "Join waitlist"}</button>
        <p className="text-xs leading-5 text-white/42">We will not sell your waitlist information.</p>
        {status === "error" ? <p className="text-sm text-white/58">The waitlist is unavailable right now. Please try again later.</p> : null}
      </div>
    </section>
  );
}