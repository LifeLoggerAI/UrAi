"use client";

import Link from "next/link";
import { useState } from "react";
import type { WebGLRenderer } from "three";

import { HomeWorldCanvas } from "@/components/urai/home/HomeWorldCanvas";
import { XRReadyCanvas, XRSessionButton, XRStatusPanel } from "@/components/xr/XRSessionFoundation";

export default function XRPage() {
  const [renderer, setRenderer] = useState<WebGLRenderer | null>(null);

  return (
    <main className="min-h-screen overflow-hidden bg-[#02050c] text-white selection:bg-cyan-100/25">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(125,211,252,0.22),transparent_28%),radial-gradient(circle_at_20%_70%,rgba(45,212,191,0.12),transparent_34%),linear-gradient(180deg,#02050c_0%,#071525_45%,#010203_100%)]" />

      <header className="relative z-10 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">
        <Link href="/home" className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-bold text-white/72 hover:bg-white/[0.1]">
          ← Home
        </Link>
        <p className="rounded-full border border-cyan-100/15 bg-cyan-100/[0.07] px-4 py-2 text-[0.64rem] font-black uppercase tracking-[0.3em] text-cyan-100/72">
          XR gated · AR roadmap · no fake headset claims
        </p>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-6 px-5 pb-10 md:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="inline-flex rounded-full border border-cyan-100/20 bg-cyan-100/8 px-4 py-2 text-[0.64rem] font-black uppercase tracking-[0.32em] text-cyan-100/75 backdrop-blur-xl">
            Real WebXR gate
          </p>
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.9] tracking-[-0.07em] text-white sm:text-6xl lg:text-7xl">
            3D preview first. VR only when the browser proves it. AR stays gated.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
            This route keeps the public Home 3D scene available on desktop and mobile while checking real WebXR capability. The Enter VR action is not rendered unless immersive-vr is reported by the browser and a real Three.js WebGL renderer is ready. AR is labeled as gated because this repo does not yet include a verified AR session entry or AR-compatible public model asset path.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <XRSessionButton renderer={renderer} />
            <Link href="/life-map" className="rounded-full border border-white/15 bg-white/7 px-5 py-3 text-sm font-bold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/12">
              Open Life Map demo
            </Link>
          </div>
        </div>

        <XRStatusPanel compact />
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-12 md:px-8">
        <div className="rounded-[2.25rem] border border-cyan-100/16 bg-white/[0.045] p-4 shadow-[0_28px_120px_rgba(8,47,73,0.35)] backdrop-blur-2xl">
          <XRReadyCanvas className="h-[34rem] min-h-[28rem]" onRendererReady={setRenderer}>
            <HomeWorldCanvas />
          </XRReadyCanvas>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[1.6rem] border border-amber-100/18 bg-amber-100/[0.06] p-4 text-sm leading-6 text-amber-50/76">
            <strong className="text-amber-50">Launch truth:</strong> This is a WebXR-capable foundation, not a claim of universal VR/AR support. Unsupported browsers keep the safe 3D or non-WebGL fallback instead of seeing a broken headset button.
          </div>
          <div className="rounded-[1.6rem] border border-white/12 bg-white/[0.045] p-4 text-sm leading-6 text-white/68">
            <strong className="text-white">AR status:</strong> AR is gated/roadmap here. No AR button is shown until there is a real supported-device entry path with verified model assets, such as a tested WebXR immersive-ar session, AR Quick Look, Scene Viewer, or model-viewer implementation.
          </div>
        </div>
      </section>
    </main>
  );
}
