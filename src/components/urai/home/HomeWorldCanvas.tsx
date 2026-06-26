"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { CinematicWorld } from "./CinematicWorld";

export function HomeWorldCanvas() {
  const { camera, size } = useThree();
  const isMobile = size.width < 768;

  useFrame(() => {
    if (isMobile) {
      (camera as THREE.PerspectiveCamera).fov = 60;
    } else {
      (camera as THREE.PerspectiveCamera).fov = 50;
    }
    camera.updateProjectionMatrix();
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.5, 8]} fov={50} />
      <CinematicWorld />
    </>
  );
}
