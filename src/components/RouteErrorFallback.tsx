"use client";

import Link from "next/link";
import { ReactNode, useCallback, useEffect, useRef } from "react";
import { captureRouteError, trackInteraction, TelemetryMetadata } from "@/lib/telemetry";

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
  title = "We hit a snag",
  description = "Give it another go, or head somewhere else while we investigate.",
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 py-16 text-center text-white">
      <div className="max-w-md space-y-4">
        <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
        <p className="text-base leading-relaxed text-white/70">{description}</p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex min-w-[160px] items-center justify-center rounded-full bg-white px-6 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            {retryLabel}
          </button>
          {secondaryAction ? (
            <Link
              href={secondaryAction.href}
              onClick={handleNavigate}
              className="inline-flex min-w-[160px] items-center justify-center rounded-full border border-white/30 px-6 py-2 text-sm font-semibold text-white transition hover:border-white/50"
            >
              {secondaryAction.label}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
