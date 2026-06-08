"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import { CinematicWorld } from "./CinematicWorld";
import { LivingUraiPresence } from "./LivingUraiPresence";

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
  return (
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
  );
}
