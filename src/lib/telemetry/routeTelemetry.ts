import { getConsoleHistory } from "@/lib/consoleLogger";

export type RouteEventType = "loading" | "error" | "not-found" | "reset";

type RouteEventPayload = {
  routeId?: string;
  pathname?: string;
  error?: Error;
  details?: Record<string, unknown>;
};

function safeSerialize(error?: Error) {
  if (!error) {
    return undefined;
  }
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };
}

export function recordRouteEvent(type: RouteEventType, payload: RouteEventPayload = {}) {
  const entry = {
    type,
    at: new Date().toISOString(),
    routeId: payload.routeId,
    pathname: payload.pathname,
    error: safeSerialize(payload.error),
    details: payload.details,
  };

  if (process.env.NODE_ENV !== "production") {
    console.info("[route-event]", entry);
  }

  return entry;
}

export function recordRouteLoading(routeId?: string, pathname?: string) {
  return recordRouteEvent("loading", { routeId, pathname });
}

export function recordRouteNotFound(pathname?: string, details?: Record<string, unknown>) {
  return recordRouteEvent("not-found", { pathname, details });
}

export function recordRouteError(error: Error, routeId?: string, pathname?: string) {
  return recordRouteEvent("error", { error, routeId, pathname, details: { consoleHistory: getConsoleHistory() } });
}

export function recordRouteReset(routeId?: string, pathname?: string) {
  return recordRouteEvent("reset", { routeId, pathname });
}
