"use client";

import {AncientSignalResult} from "@/lib/ancientSignals";
import {AncientSignalsSource} from "@/lib/useAncientSignals";

type Props = {
  result: AncientSignalResult;
  source?: AncientSignalsSource;
  loading?: boolean;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const percent = (value: number) => `${Math.round(clamp01(value) * 100)}%`;
const label = (value: string) => value.replace(/_/g, " ");

export default function AncientSignalAmbientLayer({result, source = "demo", loading = false}: Props) {
  const activation = clamp01(result.activationScore);
  const withdrawal = clamp01(result.withdrawalScore);
  const recovery = clamp01(result.recoveryPulseScore);
  const sourceLabel = loading ? "loading" : source === "persisted" ? "live snapshot" : source;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      data-preverbal-state={result.preverbalState}
      data-ancient-signals-source={source}
      aria-label={`Ancient Signals body-weather: ${label(result.preverbalState)}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-screen"
        style={{
          opacity: 0.08 + recovery * 0.18,
          background:
            "radial-gradient(circle at 50% 42%, rgba(180,255,220,0.18), transparent 22%), radial-gradient(circle at 50% 92%, rgba(120,255,170,0.14), transparent 38%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          opacity: 0.08 + result.visualState.skyHaze * 0.18,
          background: "linear-gradient(to bottom, transparent, rgba(90,110,170,0.16), rgba(0,0,0,0.2))",
        }}
      />
      <div className="absolute bottom-5 left-1/2 w-[min(92vw,720px)] -translate-x-1/2 rounded-3xl border border-white/10 bg-black/35 p-4 text-white shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] uppercase tracking-[0.32em] text-cyan-200/70">Ancient Signals</p>
              <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white/45">{sourceLabel}</span>
            </div>
            <p className="mt-1 text-lg font-semibold capitalize">Body-weather: {label(result.preverbalState)}</p>
            <p className="mt-1 max-w-xl text-xs text-white/55">{result.narratorHint.messageSeed}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-[0.14em] text-white/45">
            <MiniMetric label="Pulse" value={percent(activation)} />
            <MiniMetric label="Haze" value={percent(withdrawal)} />
            <MiniMetric label="Bloom" value={percent(recovery)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniMetric({label, value}: {label: string; value: string}) {
  return (
    <div className="rounded-2xl bg-white/10 px-3 py-2">
      <p>{label}</p>
      <p className="mt-1 text-sm font-semibold tracking-normal text-white/80">{value}</p>
    </div>
  );
}
