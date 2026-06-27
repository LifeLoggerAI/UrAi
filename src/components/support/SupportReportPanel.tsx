"use client";

import { FormEvent, useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";

type SubmitState = "idle" | "submitting" | "success" | "error";

const issueTypes = ["Visual bug", "Broken link", "Privacy question", "Status concern", "Access issue", "Other"] as const;
const severityLevels = ["Low", "Medium", "High"] as const;

export default function SupportReportPanel({ supportEmail }: { supportEmail: string }) {
  const [issueType, setIssueType] = useState<(typeof issueTypes)[number]>("Visual bug");
  const [severity, setSeverity] = useState<(typeof severityLevels)[number]>("Medium");
  const [route, setRoute] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SubmitState>("idle");
  const [notice, setNotice] = useState<string | null>(null);

  const configured = useMemo(() => isFirebaseConfigured(), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!message.trim()) {
      setStatus("error");
      setNotice("Add a short description so the report can be reviewed safely.");
      return;
    }

    if (!configured) {
      setStatus("error");
      setNotice("Support capture is unavailable in this environment. Use the configured support email for time-sensitive public demo issues.");
      return;
    }

    try {
      setStatus("submitting");
      setNotice(null);
      await addDoc(collection(db(), "bug_reports"), {
        issue_type: issueType,
        severity,
        route: route.trim() || (typeof window !== "undefined" ? window.location.pathname : "/support"),
        message: message.trim(),
        email: email.trim() || null,
        source: "support_center",
        created_at: serverTimestamp(),
        user_agent: typeof window !== "undefined" ? window.navigator.userAgent : null,
      });
      setStatus("success");
      setIssueType("Visual bug");
      setSeverity("Medium");
      setRoute("");
      setEmail("");
      setMessage("");
      setNotice("Report received. The team can review it without accessing private public-demo life data.");
    } catch {
      setStatus("error");
      setNotice("Support capture could not save this report. Use the configured support email instead.");
    }
  }

  return (
    <section id="report" className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-slate-950/68 p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-8" aria-labelledby="report-title">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(45,212,191,0.13),transparent_18rem),linear-gradient(120deg,rgba(125,211,252,0.08),transparent_56%)]" />
      <div className="relative grid gap-8 lg:grid-cols-[0.86fr_1.14fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Report panel</p>
          <h2 id="report-title" className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.06em] text-white">Tell us what broke, safely.</h2>
          <p className="mt-4 text-sm leading-6 text-white/66">
            Public demo reports should include the route, what happened, browser or device context, and whether an error was visible. Do not include passwords, private keys, medical details, or sensitive private memories.
          </p>
          <div className="mt-5 rounded-2xl border border-amber-200/18 bg-amber-200/[0.075] p-4 text-sm leading-6 text-amber-50/78">
            {configured ? "Feedback capture appears configured for this build. Submissions still stay limited to product feedback and public demo issues." : "Feedback capture is unavailable in this environment. You can still check Status, open the System registry, or email the configured support contact."}
          </div>
          <a href={`mailto:${supportEmail}`} className="mt-5 inline-flex min-h-11 items-center rounded-full border border-cyan-200/30 bg-cyan-200/[0.08] px-5 text-sm font-bold text-cyan-50 transition hover:border-cyan-100/55 hover:bg-cyan-200/[0.14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
            Email {supportEmail}
          </a>
        </div>

        {configured ? (
          <form onSubmit={handleSubmit} className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-black/24 p-4 sm:p-5" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-white/76">
                <span>Issue type</span>
                <select value={issueType} onChange={(event) => setIssueType(event.target.value as (typeof issueTypes)[number])} className="min-h-12 rounded-2xl border border-white/12 bg-white/[0.075] px-4 text-sm text-white [color-scheme:dark] outline-none focus:border-cyan-200/70 focus:ring-4 focus:ring-cyan-200/18">
                  {issueTypes.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-white/76">
                <span>Severity</span>
                <select value={severity} onChange={(event) => setSeverity(event.target.value as (typeof severityLevels)[number])} className="min-h-12 rounded-2xl border border-white/12 bg-white/[0.075] px-4 text-sm text-white [color-scheme:dark] outline-none focus:border-cyan-200/70 focus:ring-4 focus:ring-cyan-200/18">
                  {severityLevels.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>
            <label className="grid gap-2 text-sm font-bold text-white/76">
              <span>Route or page</span>
              <input value={route} onChange={(event) => setRoute(event.target.value)} placeholder="/support, /life-map, /passport..." className="min-h-12 rounded-2xl border border-white/12 bg-white/[0.075] px-4 text-base text-white outline-none placeholder:text-white/34 focus:border-cyan-200/70 focus:ring-4 focus:ring-cyan-200/18" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-white/76">
              <span>Email optional</span>
              <input type="email" inputMode="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="min-h-12 rounded-2xl border border-white/12 bg-white/[0.075] px-4 text-base text-white outline-none placeholder:text-white/34 focus:border-cyan-200/70 focus:ring-4 focus:ring-cyan-200/18" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-white/76">
              <span>What happened?</span>
              <textarea value={message} onChange={(event) => { setMessage(event.target.value); if (status === "error") { setStatus("idle"); setNotice(null); } }} placeholder="Describe the issue without secrets or sensitive private memories." className="min-h-[150px] rounded-2xl border border-white/12 bg-white/[0.075] px-4 py-3 text-base text-white outline-none placeholder:text-white/34 focus:border-cyan-200/70 focus:ring-4 focus:ring-cyan-200/18" />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" disabled={status === "submitting"} className="inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-100/40 bg-gradient-to-br from-cyan-100 via-teal-200 to-emerald-200 px-6 text-sm font-black text-slate-950 shadow-[0_20px_54px_rgba(45,212,191,0.2)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
                {status === "submitting" ? "Submitting..." : "Send report"}
              </button>
              <p className="text-xs leading-5 text-white/46">Public demo feedback is used to improve the product.</p>
            </div>
            {notice ? <p className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${status === "success" ? "border-emerald-200/20 bg-emerald-200/[0.08] text-emerald-50" : "border-amber-200/20 bg-amber-200/[0.08] text-amber-50"}`} role={status === "error" ? "alert" : "status"}>{notice}</p> : null}
          </form>
        ) : (
          <div className="rounded-[1.75rem] border border-white/10 bg-black/24 p-5">
            <p className="text-xs font-black uppercase tracking-[0.26em] text-amber-200">Capture unavailable</p>
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">Support tools are unavailable in this environment.</h3>
            <p className="mt-3 text-sm leading-6 text-white/62">
              No report was sent. Check Status, open the System registry, or email the configured support contact for time-sensitive public demo issues.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={`mailto:${supportEmail}`} className="inline-flex min-h-11 items-center rounded-full border border-amber-200/30 bg-amber-200/[0.08] px-5 text-sm font-bold text-amber-50 transition hover:bg-amber-200/[0.14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Email support</a>
              <a href="#before-reporting" className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/[0.055] px-5 text-sm font-bold text-white/74 transition hover:border-cyan-200/36 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Review first steps</a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
