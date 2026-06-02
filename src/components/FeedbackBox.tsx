"use client";

import { FormEvent, useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const PLACEHOLDER_EXAMPLES = [
  "Tell us where the flow felt rough…",
  "Flag a confusing screen or a broken link…",
  "Request a feature for your next daily recap…",
];

export default function FeedbackBox() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const placeholder = useMemo(() => {
    return PLACEHOLDER_EXAMPLES[Math.floor(Math.random() * PLACEHOLDER_EXAMPLES.length)];
  }, []);

  const isFirebaseConfigured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) {
      setErrorMessage("Drop at least a sentence so we can jump on it.");
      setStatus("error");
      return;
    }

    if (!isFirebaseConfigured) {
      setErrorMessage("Feedback inbox is offline — ping press@urai.app while we bring it back.");
      setStatus("error");
      return;
    }

    try {
      setStatus("submitting");
      setErrorMessage(null);

      await addDoc(collection(db(), "feedback"), {
        message: message.trim(),
        email: email.trim() || null,
        created_at: serverTimestamp(),
        source: typeof window !== "undefined" ? window.location.pathname : "server",
        user_agent: typeof window !== "undefined" ? window.navigator.userAgent : null,
      });

      setStatus("success");
      setMessage("");
      setEmail("");
    } catch (error) {
      console.error("Failed to send feedback", error);
      setStatus("error");
      setErrorMessage("Couldn’t save that. Try again or email press@urai.app.");
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
      <div className="mb-4 space-y-1">
        <h3 className="text-lg font-semibold text-white">Have notes for URAI?</h3>
        <p className="text-sm text-white/60">
          We’re shipping daily. Leave a thought, bug, or wish and we’ll reply within 24h.
        </p>
      </div>

      {!isFirebaseConfigured ? (
        <p className="text-sm text-amber-200">
          Feedback capture is paused because Firebase isn’t configured in this environment. Email
          <a
            href="mailto:press@urai.app"
            className="ml-1 underline decoration-dashed underline-offset-4"
          >
            press@urai.app
          </a>
          {" "}with anything urgent.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="sr-only" htmlFor="feedback-message">
              Feedback
            </label>
            <textarea
              id="feedback-message"
              className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none focus:ring-0"
              placeholder={placeholder}
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                if (status === "error") {
                  setStatus("idle");
                  setErrorMessage(null);
                }
              }}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <label className="sr-only" htmlFor="feedback-email">
                Email (optional)
              </label>
              <input
                id="feedback-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Email for a reply (optional)"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none focus:ring-0"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/40 disabled:text-black/60"
            >
              {status === "submitting" ? "Sending…" : "Send feedback"}
            </button>
          </div>

          {status === "success" ? (
            <p className="text-sm text-emerald-300">Got it. We’ll review it today.</p>
          ) : null}
          {status === "error" && errorMessage ? (
            <p className="text-sm text-rose-300">{errorMessage}</p>
          ) : null}
        </form>
      )}
    </div>
  );
}
