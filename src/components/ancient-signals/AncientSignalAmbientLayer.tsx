"use client";

import React from "react";
import { AncientSignalResult } from "@/lib/ancientSignals";

type Props = {
  result: AncientSignalResult;
  className?: string;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const percent = (value: number) => `${Math.round(clamp01(value) * 100)}%`;
const label = (value: string) => value.replace(/_/g, " ");

export default function AncientSignalAmbientLayer({ result, className }: Props) {
  const activation = clamp01(result.activationScore);
  const recovery = clamp01(result.recoveryPulseScore);
  const withdrawal = clamp01(result.withdrawalScore);
  const stillness = clamp01(result.numbnessScore);
  const haze = clamp01(result.visualState.skyHaze);
  const staticCharge = clamp01(result.auraAtmosphere.staticCharge);
  const bloom = clamp01(result.visualState.bloomReadiness);

  return (
    <div
      aria-label={`Ancient Signals body-weather: ${label(result.preverbalState)}`}
      className={["absolute inset-0 pointer-events-none", className ?? ""].join(" ")}
      data-preverbal-state={result.preverbalState}
    >
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-screen"
        style={{
          opacity: 0.1 + recovery * 0.22,
          background:
            "radial-gradient(circle at 50% 48%, rgba(180,255,220,0.24), transparent 22%), radial-gradient(circle at 50% 90%, rgba(120,255,170,0.18), transparent 35%)",
        }}
      />

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          opacity: 0.08 + haze * 0.26 + stillness * 0.12,
          background:
            "linear-gradient(to bottom, rgba(10,18,32,0.0) 0%, rgba(120,140,190,0.16) 48%, rgba(0,0,0,0.22) 100%)",
          backdropFilter: haze > 0.55 ? "blur(1.5px)" : undefined,
        }}
      />

      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          opacity: 0.18 + activation * 0.26,
          boxShadow: `0 0 ${32 + activation * 72}px rgba(130, 220, 255, ${0.18 + staticCharge * 0.28})`,
          transform: `translate(-50%, -50%) scale(${0.92 + activation * 0.16 + recovery * 0.08})`,
          border: `1px solid rgba(190, 240, 255, ${0.08 + activation * 0.18})`,
        }}
      />

      <div className="absolute bottom-8 left-1/2 w-[min(92vw,720px)] -translate-x-1/2 rounded-3xl border border-white/10 bg-black/30 p-4 text-white shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-cyan-200/70">
              Ancient Signals
            </p>
            <p className="mt-1 text-lg font-semibold capitalize">
              Body-weather: {label(result.preverbalState)}
            </p>
            <p className="mt-1 max-w-xl text-xs text-white/55">
              {result.narratorHint.messageSeed}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-[0.14em] text-white/45">
            <MiniMetric label="Pulse" value={percent(activation)} />
            <MiniMetric label="Haze" value={percent(withdrawal)} />
            <MiniMetric label="Bloom" value={percent(bloom)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 px-3 py-2">
      <p>{label}</p>
      <p className="mt-1 text-sm font-semibold tracking-normal text-white/80">{value}</p>
    </div>
  );
}
