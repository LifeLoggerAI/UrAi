"use client";

import { ReactNode, useCallback, useEffect, useRef } from "react";
import { captureRouteError, trackInteraction, TelemetryMetadata } from "@/lib/telemetry";
import {
  GenesisCtaLink,
  GenesisEyebrow,
  GenesisPanel,
  GenesisShell,
  GenesisStatusChip,
  GenesisTrustCallout,
} from "@/components/urai/GenesisVisualSystem";

type SecondaryAction = {
  label: string;
  href: string;
  beforeNavigate?: () => void;
};

type RouteErrorFallbackProps = {
  route: string;
  error: Error;
  reset: () => void;
  title?: ReactNode;
  description?: ReactNode;
  retryLabel?: string;
  metadata?: TelemetryMetadata;
  secondaryAction?: SecondaryAction;
};

export default function RouteErrorFallback({
  route,
  error,
  reset,
  title = "This route needs a moment",
  description = "The Genesis shell is still here. Try again, or move to a safe public route while this surface recovers.",
  retryLabel = "Try again",
  metadata,
  secondaryAction,
}: RouteErrorFallbackProps) {
  const loggedRef = useRef(false);

  useEffect(() => {
    if (loggedRef.current) {
      return;
    }
    captureRouteError(route, error, metadata);
    loggedRef.current = true;
  }, [error, metadata, route]);

  const handleRetry = useCallback(() => {
    trackInteraction("route_error_retry", { route, ...metadata });
    reset();
  }, [metadata, reset, route]);

  const handleNavigate = useCallback(() => {
    trackInteraction("route_error_navigation", { route, href: secondaryAction?.href, ...metadata });
    secondaryAction?.beforeNavigate?.();
  }, [metadata, route, secondaryAction]);

  return (
    <GenesisShell activeHref="/status" footerNote="URAI fallback state - polished, private-safe, and free of raw provider or Firebase details.">
      <GenesisPanel className="relative grid min-h-[70vh] place-items-center overflow-hidden rounded-[2.75rem] text-center">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(125,211,252,0.2),transparent_16rem),radial-gradient(circle_at_50%_70%,rgba(245,158,11,0.1),transparent_20rem)]" />
        <div className="relative z-10 max-w-2xl">
          <GenesisEyebrow>Route unavailable</GenesisEyebrow>
          <h2 className="mt-6 text-[clamp(2.85rem,7vw,5.75rem)] font-semibold leading-[0.9] tracking-[-0.075em] text-white">{title}</h2>
          <p className="mt-6 text-[clamp(1.05rem,2vw,1.35rem)] leading-[1.35] tracking-[-0.03em] text-cyan-50/78">{description}</p>
          <div className="mx-auto mt-5 max-w-xl">
            <GenesisTrustCallout tone="warning">
              We do not expose stack traces, secrets, provider payloads, private user data, or Firebase internals in public fallback states.
            </GenesisTrustCallout>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <GenesisStatusChip tone="gated">Recovered safely</GenesisStatusChip>
            <GenesisStatusChip tone="preview">No private data shown</GenesisStatusChip>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex min-h-12 min-w-[170px] items-center justify-center rounded-full border border-cyan-100/50 bg-gradient-to-br from-cyan-100 via-teal-200 to-emerald-200 px-6 text-sm font-black text-slate-950 shadow-[0_20px_54px_rgba(45,212,191,0.24)] transition hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
            >
              {retryLabel}
            </button>
            {secondaryAction ? (
              <a
                href={secondaryAction.href}
                onClick={handleNavigate}
                className="inline-flex min-h-12 min-w-[170px] items-center justify-center rounded-full border border-white/12 bg-white/[0.075] px-6 text-sm font-black text-white/82 transition hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-white/12 hover:text-white active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
              >
                {secondaryAction.label}
              </a>
            ) : (
              <GenesisCtaLink href="/status">Open Status</GenesisCtaLink>
            )}
          </div>
        </div>
      </GenesisPanel>
    </GenesisShell>
  );
}