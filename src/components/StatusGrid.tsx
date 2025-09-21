"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ServiceState = "operational" | "degraded" | "outage";

type ServiceStatus = {
  id: string;
  label: string;
  status: ServiceState;
  message?: string;
  updatedAt: string;
  docsUrl?: string;
};

type StatusResponse = {
  services: ServiceStatus[];
  generatedAt: string;
};

const STATUS_LABELS: Record<ServiceState, { bg: string; text: string; label: string }> = {
  operational: {
    bg: "bg-emerald-500/10 border-emerald-400/40",
    text: "text-emerald-300",
    label: "Operational",
  },
  degraded: {
    bg: "bg-amber-500/10 border-amber-400/40",
    text: "text-amber-300",
    label: "Degraded",
  },
  outage: {
    bg: "bg-rose-500/10 border-rose-400/40",
    text: "text-rose-300",
    label: "Outage",
  },
};

const REFRESH_INTERVAL = 60_000;

export default function StatusGrid() {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isMountedRef = useRef(true);
  const hasLoadedRef = useRef(false);

  const fetchStatus = useCallback(async () => {
    if (!isMountedRef.current) return;
    try {
      if (!hasLoadedRef.current) {
        setIsLoading(true);
      }
      setError(null);
      const response = await fetch("/api/status", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Status check failed (${response.status})`);
      }
      const payload = (await response.json()) as StatusResponse;
      if (isMountedRef.current) {
        setData(payload);
        hasLoadedRef.current = true;
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchStatus();
    const timer = setInterval(fetchStatus, REFRESH_INTERVAL);
    return () => {
      isMountedRef.current = false;
      clearInterval(timer);
    };
  }, [fetchStatus]);

  const services = useMemo(() => data?.services ?? [], [data]);
  const generatedAt = useMemo(() => data?.generatedAt ?? null, [data]);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Live service map</h2>
          <p className="text-sm text-white/50">
            Auto-refreshes every minute. Tap a tile for docs or playbooks.
          </p>
        </div>
        <div className="text-xs text-white/40">
          {generatedAt ? `Updated ${new Date(generatedAt).toLocaleTimeString()}` : "Updating…"}
        </div>
      </header>

      {isLoading && !data ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl border border-white/5 bg-white/5"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
          <p className="font-semibold">We couldn’t load the status feed.</p>
          <p className="mt-1 text-rose-100/80">{error}</p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setIsLoading(true);
              void fetchStatus();
            }}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => {
            const tone = STATUS_LABELS[service.status];
            return (
              <article
                key={service.id}
                className={`group flex h-full flex-col justify-between rounded-2xl border px-5 py-4 transition hover:border-white/40 hover:bg-white/[0.08] ${tone.bg}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white">{service.label}</h3>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${tone.text}`}
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {tone.label}
                  </span>
                </div>
                {service.message ? (
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {service.message}
                  </p>
                ) : null}
                <footer className="mt-4 flex items-center justify-between text-xs text-white/40">
                  <span>{new Date(service.updatedAt).toLocaleTimeString()}</span>
                  {service.docsUrl ? (
                    <a
                      href={service.docsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white/60 underline-offset-4 hover:text-white hover:underline"
                    >
                      Runbook ↗
                    </a>
                  ) : null}
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
