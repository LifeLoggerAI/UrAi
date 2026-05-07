export type ConsoleLevel = "log" | "warn" | "error";

export type ConsoleEntry = {
  level: ConsoleLevel;
  timestamp: number;
  args: unknown[];
};

const MAX_LOGS = 50;
const buffer: ConsoleEntry[] = [];
let installed = false;

function record(level: ConsoleLevel, args: unknown[]) {
  buffer.push({ level, timestamp: Date.now(), args });
  if (buffer.length > MAX_LOGS) {
    buffer.splice(0, buffer.length - MAX_LOGS);
  }
}

export function installConsoleRecorder() {
  if (installed || typeof window === "undefined") {
    return;
  }

  const originalConsole = {
    log: window.console.log,
    warn: window.console.warn,
    error: window.console.error,
  };

  (Object.keys(originalConsole) as ConsoleLevel[]).forEach((level) => {
    window.console[level] = (...args: unknown[]) => {
      try {
        record(level, args);
      } catch (err) {
        originalConsole.warn("Failed to buffer console entry", err);
      }
      originalConsole[level](...args);
    };
  });

  installed = true;
}

export function getConsoleHistory() {
  return [...buffer];
}

export function resetConsoleHistory() {
  buffer.length = 0;
}
