type ConsoleMethod = "log" | "info" | "debug" | "warn";

let installed = false;

const EXPECTED_FALLBACK_PATTERNS = [
  "missing asset",
  "asset fallback",
  "audio play",
  "cloud sync is unavailable",
  "firebase config",
  "companion response failed",
];

function shouldSuppress(args: unknown[]): boolean {
  const text = args.map((arg) => (typeof arg === "string" ? arg : "")).join(" ").toLowerCase();
  return EXPECTED_FALLBACK_PATTERNS.some((pattern) => text.includes(pattern));
}

export function installProductionConsoleGuard(): void {
  if (installed || typeof window === "undefined" || process.env.NODE_ENV !== "production") return;
  installed = true;

  const original: Partial<Record<ConsoleMethod, (...args: unknown[]) => void>> = {
    log: console.log.bind(console),
    info: console.info.bind(console),
    debug: console.debug.bind(console),
    warn: console.warn.bind(console),
  };

  (["log", "info", "debug", "warn"] as ConsoleMethod[]).forEach((method) => {
    console[method] = (...args: unknown[]) => {
      if (method === "warn" && !shouldSuppress(args)) return original.warn?.(...args);
      return;
    };
  });
}
