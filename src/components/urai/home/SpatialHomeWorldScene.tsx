"use client";

import Link from "next/link";
import ImmersiveWorld3D from "@/components/urai/world/ImmersiveWorld3D";

const portals = [
  { href: "/life-map", label: "Life Map", className: "left-[18%] top-[20%] h-28 w-28" },
  { href: "/focus", label: "Focus", className: "right-[18%] top-[28%] h-24 w-24" },
  { href: "/replay", label: "Replay", className: "left-[26%] bottom-[21%] h-24 w-24" },
  { href: "/spatial", label: "Spatial", className: "right-[26%] bottom-[19%] h-28 w-28" },
  { href: "/xr", label: "XR", className: "left-1/2 top-[49%] h-32 w-32 -translate-x-1/2 -translate-y-1/2" },
];

export function SpatialHomeWorldScene() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <ImmersiveWorld3D mode="home" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0%,rgba(0,0,0,0.04)_36%,rgba(0,0,0,0.76)_100%)]" />

      <Link
        href="/launch"
        aria-label="Open launch information"
        className="fixed left-5 top-5 z-30 h-9 w-9 rounded-full border border-white/10 bg-white/[0.035] backdrop-blur-xl transition hover:border-white/30 hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-white"
      >
        <span className="sr-only">URAI launch information</span>
      </Link>

      {portals.map((portal) => (
        <Link
          key={portal.href}
          href={portal.href}
          aria-label={`Enter ${portal.label}`}
          title={portal.label}
          className={`absolute z-20 rounded-full border border-cyan-100/0 bg-cyan-100/0 outline-none transition hover:border-cyan-100/35 hover:bg-cyan-100/10 focus-visible:border-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-100 ${portal.className}`}
        >
          <span className="sr-only">{portal.label}</span>
        </Link>
      ))}

      <nav
        aria-label="Spatial routes"
        className="fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 gap-3 rounded-full border border-white/10 bg-black/20 p-3 backdrop-blur-xl"
      >
        {portals.map((portal) => (
          <Link
            key={`dock-${portal.href}`}
            href={portal.href}
            aria-label={`Open ${portal.label}`}
            className="h-3 w-3 rounded-full border border-white/20 bg-white/20 transition hover:border-cyan-100/80 hover:bg-cyan-100/70 focus-visible:ring-2 focus-visible:ring-cyan-100"
          />
        ))}
      </nav>

      <style jsx global>{`
        .urai-world-node-label,
        .urai-world-status {
          display: none !important;
        }
      `}</style>
    </main>
  );
}

export default SpatialHomeWorldScene;
