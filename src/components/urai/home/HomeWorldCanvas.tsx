"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Component, Suspense, useEffect, useState, type ErrorInfo, type ReactNode } from "react";
import * as THREE from "three";
import { CinematicWorld } from "./CinematicWorld";
import { LivingUraiPresence } from "./LivingUraiPresence";

type HomeWorldCanvasBoundaryState = {
  hasError: boolean;
};

class HomeWorldCanvasBoundary extends Component<{ children: ReactNode }, HomeWorldCanvasBoundaryState> {
  state: HomeWorldCanvasBoundaryState = { hasError: false };

  static getDerivedStateFromError(): HomeWorldCanvasBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      console.error("URAI home world canvas fell back", error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) return <HomeWorldFallback reason="3D renderer fallback" />;
    return this.props.children;
  }
}

function canCreateWebGLContext() {
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

function HomeWorldFallback({ reason = "Home world preview" }: { reason?: string }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050714] text-white" role="img" aria-label="URAI Genesis home preview fallback">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(125,211,252,0.28),transparent_28rem),radial-gradient(circle_at_50%_72%,rgba(45,212,191,0.16),transparent_24rem),linear-gradient(180deg,#07101f_0%,#050714_56%,#02030a_100%)]" />
      <div className="absolute left-1/2 top-[48%] h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/20 bg-cyan-200/10 shadow-[0_0_120px_rgba(34,211,238,0.22)]" />
      <div className="absolute left-1/2 top-[48%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-[0_0_80px_rgba(255,255,255,0.38)]" />
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-end px-6 pb-28 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-100/72">{reason}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Genesis Home is ready.</h2>
        <p className="mt-4 max-w-xl text-sm leading-6 text-white/62 sm:text-base">
          The cinematic WebGL layer is optional. Navigation, preview copy, and launch-safe Home access stay available without presenting demo media as private user data.
        </p>
      </section>
    </div>
  );
}

function CameraBreathing() {
  useFrame(({ clock, camera }) => {
    const elapsedTime = clock.getElapsedTime();
    camera.position.x = Math.sin(elapsedTime * 0.2) * 0.1;
    camera.position.z = 5 + Math.cos(elapsedTime * 0.2) * 0.1;
    camera.rotation.y = Math.sin(elapsedTime * 0.1) * 0.01;
  });
  return null;
}

export function HomeWorldCanvas() {
  const [webglReady, setWebglReady] = useState(false);
  const [checkedWebgl, setCheckedWebgl] = useState(false);

  useEffect(() => {
    setWebglReady(canCreateWebGLContext());
    setCheckedWebgl(true);
  }, []);

  if (!checkedWebgl) {
    return <HomeWorldFallback reason="Preparing home world" />;
  }

  if (!webglReady) {
    return <HomeWorldFallback reason="WebGL-safe home preview" />;
  }

  return (
    <HomeWorldCanvasBoundary>
      <Canvas
        camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 1.5, 5] }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color("#000000"));
        }}
      >
        <Suspense fallback={null}>
          <CinematicWorld />
          <LivingUraiPresence />
          <CameraBreathing />
        </Suspense>
      </Canvas>
    </HomeWorldCanvasBoundary>
  );
}
