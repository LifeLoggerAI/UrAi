export type AscentPhase = "idle" | "ignition" | "lift" | "portal" | "emergence" | "settle";

export const cinematicEase: number[] = [0.16, 1, 0.3, 1];
export const softEase: number[] = [0.22, 0.86, 0.18, 1];
export const gravityEase: number[] = [0.12, 0.72, 0.18, 1];

export const ASCENT_TIMING_MS = {
  ignition: 220,
  lift: 620,
  portal: 1120,
  emergence: 1650,
  settle: 2100,
};

export const ASCENT_PHASES = [
  { phase: "ignition", at: 0 },
  { phase: "lift", at: ASCENT_TIMING_MS.ignition },
  { phase: "portal", at: ASCENT_TIMING_MS.lift },
  { phase: "emergence", at: ASCENT_TIMING_MS.portal },
  { phase: "settle", at: ASCENT_TIMING_MS.emergence },
] as const;
