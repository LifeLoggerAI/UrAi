"use client";

import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { WebGLRenderer } from "three";

type XRMode = "immersive-vr" | "immersive-ar";
type CapabilityState = "checking" | "supported" | "unsupported" | "unavailable";

type BrowserXR = {
  isSessionSupported?: (mode: XRMode) => Promise<boolean>;
  requestSession?: (mode: XRMode, options?: XRSessionInit) => Promise<XRSession>;
};

type NavigatorWithXR = Navigator & {
  xr?: BrowserXR;
};

export type WebXRCapabilities = {
  webgl: CapabilityState;
  immersiveVr: CapabilityState;
  immersiveAr: CapabilityState;
  secureContext: boolean;
  xrApiAvailable: boolean;
  checked: boolean;
  reason: string;
};

const initialCapabilities: WebXRCapabilities = {
  webgl: "checking",
  immersiveVr: "checking",
  immersiveAr: "checking",
  secureContext: false,
  xrApiAvailable: false,
  checked: false,
  reason: "Checking browser WebXR and WebGL support.",
};

function hasWebGLSupport() {
  if (typeof document === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

async function isSessionSupported(xr: BrowserXR | undefined, mode: XRMode) {
  if (!xr?.isSessionSupported) return false;

  try {
    return await xr.isSessionSupported(mode);
  } catch {
    return false;
  }
}

export function useWebXRCapabilities() {
  const [capabilities, setCapabilities] = useState<WebXRCapabilities>(initialCapabilities);

  useEffect(() => {
    let cancelled = false;

    async function detect() {
      if (typeof window === "undefined" || typeof navigator === "undefined") {
        return;
      }

      const webglSupported = hasWebGLSupport();
      const nav = navigator as NavigatorWithXR;
      const xrApiAvailable = Boolean(nav.xr);
      const secureContext = Boolean(window.isSecureContext || window.location.hostname === "localhost");
      const [vrSupported, arSupported] = await Promise.all([
        isSessionSupported(nav.xr, "immersive-vr"),
        isSessionSupported(nav.xr, "immersive-ar"),
      ]);

      if (cancelled) return;

      let reason = "WebXR foundation checked. Desktop and mobile fallbacks remain active.";
      if (!webglSupported) {
        reason = "WebGL is not available, so the immersive 3D preview is disabled on this browser.";
      } else if (!secureContext) {
        reason = "WebXR requires a secure HTTPS context or localhost.";
      } else if (!xrApiAvailable) {
        reason = "This browser does not expose navigator.xr, so headset entry is not available here.";
      } else if (!vrSupported) {
        reason = "This browser/device does not report immersive-vr support. The 3D preview remains available outside a headset.";
      }

      setCapabilities({
        webgl: webglSupported ? "supported" : "unsupported",
        immersiveVr: vrSupported && secureContext && webglSupported ? "supported" : "unsupported",
        immersiveAr: arSupported && secureContext && webglSupported ? "supported" : "unsupported",
        secureContext,
        xrApiAvailable,
        checked: true,
        reason,
      });
    }

    void detect();

    return () => {
      cancelled = true;
    };
  }, []);

  return capabilities;
}

export function XRStatusPanel({ compact = false }: { compact?: boolean }) {
  const capabilities = useWebXRCapabilities();

  const rows = useMemo(
    () => [
      ["WebGL", capabilities.webgl],
      ["WebXR API", capabilities.xrApiAvailable ? "available" : capabilities.checked ? "unavailable" : "checking"],
      ["immersive-vr", capabilities.immersiveVr],
      ["immersive-ar", capabilities.immersiveAr],
      ["Secure context", capabilities.secureContext ? "yes" : capabilities.checked ? "no" : "checking"],
    ],
    [capabilities],
  );

  return (
    <section
      data-testid="xr-capability-panel"
      className={`rounded-[1.75rem] border border-cyan-100/15 bg-slate-950/58 p-4 text-sm text-white/72 shadow-2xl shadow-black/20 backdrop-blur-2xl ${compact ? "max-w-xl" : ""}`}
      aria-live="polite"
    >
      <p className="text-[0.64rem] font-black uppercase tracking-[0.3em] text-cyan-100/64">
        Real WebXR gate
      </p>
      <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-white">
        Headset entry appears only when the browser proves support.
      </h2>
      <p className="mt-2 leading-6 text-white/64">{capabilities.reason}</p>
      <dl className="mt-4 grid gap-2 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-black/24 p-3">
            <dt className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-white/42">{label}</dt>
            <dd className="mt-1 font-bold text-cyan-50">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function UnsupportedWebGLFallback() {
  return (
    <div
      data-testid="xr-webgl-fallback"
      className="grid min-h-[24rem] place-items-center rounded-[2rem] border border-amber-100/20 bg-amber-100/[0.055] p-6 text-center text-amber-50/78"
    >
      <div>
        <p className="text-[0.66rem] font-black uppercase tracking-[0.3em] text-amber-100/70">WebGL unavailable</p>
        <p className="mt-3 text-sm leading-6">
          This device can still use the normal URAI pages, but the immersive 3D canvas is unavailable in this browser.
        </p>
      </div>
    </div>
  );
}

export function XRReadyCanvas({
  children,
  className = "min-h-[28rem]",
  onRendererReady,
}: {
  children: ReactNode;
  className?: string;
  onRendererReady?: (renderer: WebGLRenderer) => void;
}) {
  const capabilities = useWebXRCapabilities();

  if (capabilities.checked && capabilities.webgl !== "supported") {
    return <UnsupportedWebGLFallback />;
  }

  return (
    <div data-testid="xr-ready-canvas" className={`relative overflow-hidden rounded-[2rem] bg-black/35 ${className}`}>
      <Canvas
        camera={{ position: [0, 1.5, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.xr.enabled = true;
          onRendererReady?.(gl as WebGLRenderer);
        }}
      >
        {children}
      </Canvas>
    </div>
  );
}

export function XRSessionButton({ renderer }: { renderer: WebGLRenderer | null }) {
  const capabilities = useWebXRCapabilities();
  const [sessionState, setSessionState] = useState<"idle" | "starting" | "active" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const canEnterVr = capabilities.immersiveVr === "supported" && Boolean(renderer);

  const enterVr = useCallback(async () => {
    if (!canEnterVr || !renderer) return;

    const xr = (navigator as NavigatorWithXR).xr;
    if (!xr?.requestSession) return;

    setSessionState("starting");
    setMessage(null);

    try {
      const session = await xr.requestSession("immersive-vr", {
        optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"],
      });

      session.addEventListener("end", () => {
        setSessionState("idle");
        setMessage("VR session ended. Desktop and mobile preview remain available.");
      });

      await renderer.xr.setSession(session);
      setSessionState("active");
      setMessage("VR session is active through the browser WebXR API.");
    } catch (error) {
      setSessionState("error");
      setMessage(error instanceof Error ? error.message : "The browser rejected the VR session request.");
    }
  }, [canEnterVr, renderer]);

  if (capabilities.immersiveVr !== "supported") {
    return (
      <p data-testid="xr-vr-fallback" className="rounded-2xl border border-white/10 bg-black/28 p-3 text-sm leading-6 text-white/62">
        Enter VR is hidden because this browser/device does not currently report immersive-vr support.
      </p>
    );
  }

  if (!renderer) {
    return (
      <p className="rounded-2xl border border-cyan-100/15 bg-cyan-100/[0.055] p-3 text-sm leading-6 text-cyan-50/70">
        VR support detected. Waiting for the real WebGL renderer before enabling entry.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        data-testid="xr-enter-vr"
        onClick={() => void enterVr()}
        disabled={sessionState === "starting" || sessionState === "active"}
        className="rounded-full bg-cyan-100 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_18px_60px_rgba(125,211,252,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sessionState === "starting" ? "Starting VR…" : sessionState === "active" ? "VR active" : "Enter VR"}
      </button>
      {message ? <p className="text-xs leading-5 text-white/56">{message}</p> : null}
    </div>
  );
}

export function HomeXREntryCard({ children }: { children: ReactNode }) {
  const [renderer, setRenderer] = useState<WebGLRenderer | null>(null);

  return (
    <section className="rounded-[2rem] border border-cyan-100/16 bg-white/[0.055] p-4 shadow-2xl shadow-black/25 backdrop-blur-2xl">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[0.64rem] font-black uppercase tracking-[0.3em] text-cyan-100/64">WebXR foundation</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">3D Home stays normal until real VR is supported.</h2>
        </div>
        <XRSessionButton renderer={renderer} />
      </div>
      <XRReadyCanvas className="h-[26rem] min-h-[26rem]" onRendererReady={setRenderer}>
        {children}
      </XRReadyCanvas>
    </section>
  );
}
