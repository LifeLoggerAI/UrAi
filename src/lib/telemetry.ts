export type TelemetryEventType =
  | "route_load_start"
  | "route_load_complete"
  | "route_error"
  | "interaction";

export type TelemetryMetadata = Record<string, unknown> | undefined;

export type TelemetryEvent = {
  type: TelemetryEventType;
  route?: string;
  action?: string;
  metadata?: TelemetryMetadata;
  error?: Error;
  timestamp: number;
};

type TelemetrySubscriber = (event: TelemetryEvent) => void;

const subscribers: TelemetrySubscriber[] = [];

export function subscribeToTelemetry(subscriber: TelemetrySubscriber) {
  subscribers.push(subscriber);
  return () => {
    const index = subscribers.indexOf(subscriber);
    if (index >= 0) {
      subscribers.splice(index, 1);
    }
  };
}

function emit(event: TelemetryEvent) {
  subscribers.forEach((subscriber) => {
    try {
      subscriber(event);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Telemetry subscriber failed", error);
    }
  });

  if (typeof window !== "undefined") {
    const globalTelemetry = (window as unknown as { uraiTelemetry?: { emit?: (event: TelemetryEvent) => void } }).uraiTelemetry;
    if (globalTelemetry?.emit) {
      try {
        globalTelemetry.emit(event);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("Global telemetry emit failed", error);
      }
    }
  }

  if (process.env.NODE_ENV !== "production") {
    const { type, route, action, metadata } = event;
    const payload = { route, action, metadata };
    // eslint-disable-next-line no-console
    console.debug(`[telemetry] ${type}`, payload);
  }
}

export function trackRouteLoadStart(route: string, metadata?: TelemetryMetadata) {
  emit({ type: "route_load_start", route, metadata, timestamp: Date.now() });
}

export function trackRouteLoadComplete(route: string, metadata?: TelemetryMetadata) {
  emit({ type: "route_load_complete", route, metadata, timestamp: Date.now() });
}

export function captureRouteError(route: string, error: Error, metadata?: TelemetryMetadata) {
  emit({ type: "route_error", route, error, metadata, timestamp: Date.now() });

  if (typeof window !== "undefined") {
    const sentry = (window as unknown as { Sentry?: { captureException?: (error: Error, context?: Record<string, unknown>) => void } }).Sentry;
    if (sentry?.captureException) {
      sentry.captureException(error, {
        tags: { route },
        extra: metadata ?? {},
      });
    }
  }

  // eslint-disable-next-line no-console
  console.error(`Route error in ${route}`, error, metadata);
}

export function trackInteraction(action: string, metadata?: TelemetryMetadata) {
  emit({ type: "interaction", action, metadata, timestamp: Date.now() });
}
