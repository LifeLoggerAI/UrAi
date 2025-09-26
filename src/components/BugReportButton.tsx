"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { AlertTriangle } from "lucide-react";
import { db } from "@/lib/firebase";
import { getConsoleHistory, installConsoleRecorder } from "@/lib/consoleLogger";

type SubmitState = "idle" | "open" | "sending" | "success" | "error";

function gatherLocalStorageKeys() {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const keys: string[] = [];
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key) {
        keys.push(key);
      }
    }
    return keys.join(", ");
  } catch (error) {
    console.warn("Unable to read localStorage keys", error);
    return "";
  }
}

function formatConsoleHistory() {
  return getConsoleHistory()
    .map((entry) => {
      const time = new Date(entry.timestamp).toISOString();
      const text = entry.args
        .map((arg) => {
          if (typeof arg === "string") return arg;
          try {
            return JSON.stringify(arg);
          } catch (error) {
            return String(arg);
          }
        })
        .join(" ");
      return `${time} [${entry.level.toUpperCase()}] ${text}`;
    })
    .join("\n");
}

export default function BugReportButton() {
  const [state, setState] = useState<SubmitState>("idle");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFirebaseConfigured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

  useEffect(() => {
    installConsoleRecorder();
  }, []);

  const buttonLabel = useMemo(() => {
    switch (state) {
      case "open":
      case "idle":
        return "Report a bug";
      case "sending":
        return "Sending…";
      case "success":
        return "Thanks for the report";
      case "error":
        return "Try again";
      default:
        return "Report";
    }
  }, [state]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!description.trim()) {
      setErrorMessage("Add a short note so we can reproduce it.");
      setState("error");
      return;
    }

    if (!isFirebaseConfigured) {
      setErrorMessage("Bug inbox offline here — email press@urai.app and we’ll jump in.");
      setState("error");
      return;
    }

    try {
      setState("sending");
      setErrorMessage(null);

      const payload = {
        description: description.trim(),
        email: email.trim() || null,
        created_at: serverTimestamp(),
        route: typeof window !== "undefined" ? window.location.pathname : "server",
        user_agent: typeof window !== "undefined" ? window.navigator.userAgent : null,
        console_log: formatConsoleHistory(),
        local_storage_keys: gatherLocalStorageKeys(),
      };

      await addDoc(collection(db(), "bug_reports"), payload);

      setState("success");
      setDescription("");
      setEmail("");
    } catch (error) {
      console.error("Bug report failed", error);
      setState("error");
      setErrorMessage("Couldn’t capture that. Ping press@urai.app instead.");
    }
  };

  const shouldShowForm = state === "open" || state === "sending" || state === "error";

  return (
    <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-black/60 p-4 text-left text-sm text-white/70 shadow-lg">
      <div className="flex items-center gap-2 text-white">
        <AlertTriangle className="h-5 w-5 text-amber-300" aria-hidden="true" />
        <div className="font-semibold">Something feel off?</div>
      </div>
      <p className="mt-1 text-xs text-white/50">
        The console log and device info attach automatically so we can squash it fast.
      </p>

      {!isFirebaseConfigured ? (
        <p className="mt-4 text-xs text-amber-300">
          Bug intake is paused here. Email
          <a
            href="mailto:press@urai.app"
            className="mx-1 underline decoration-dashed underline-offset-4"
          >
            press@urai.app
          </a>
          if you spot something urgent.
        </p>
      ) : (
        <>
          {shouldShowForm ? (
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="sr-only" htmlFor="bug-description">
                  What went wrong?
                </label>
                <textarea
                  id="bug-description"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none focus:ring-0"
                  placeholder="Quick note so we can recreate it"
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    if (state === "error") {
                      setState("open");
                      setErrorMessage(null);
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <label className="sr-only" htmlFor="bug-email">
                    Email (optional)
                  </label>
                  <input
                    id="bug-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Email for follow-up (optional)"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none focus:ring-0"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/40 disabled:text-black/60"
                >
                  {state === "sending" ? "Uploading…" : "Send bug"}
                </button>
              </div>
              {state === "success" ? (
                <p className="text-xs text-emerald-300">Report landed. Thank you.</p>
              ) : null}
              {state === "error" && errorMessage ? (
                <p className="text-xs text-rose-300">{errorMessage}</p>
              ) : null}
            </form>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/40">
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setState(state === "open" ? "idle" : "open");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:border-white/40 hover:text-white"
            >
              {buttonLabel}
            </button>
            {state === "success" ? (
              <span className="text-emerald-300">We’ll follow up shortly.</span>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
