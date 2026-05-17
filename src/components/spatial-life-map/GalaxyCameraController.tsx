"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { GalaxyCameraState } from "@/lib/spatial-life-map/lifeMap.types";

interface GalaxyCameraControllerProps {
  cameraState: GalaxyCameraState;
  reducedMotion?: boolean;
}

export default function GalaxyCameraController({ cameraState, reducedMotion = false }: GalaxyCameraControllerProps) {
  const { camera } = useThree();
  const target = new THREE.Vector3();
  const desired = new THREE.Vector3();

  useFrame((_, delta) => {
    target.set(cameraState.target.x, cameraState.target.y, cameraState.target.z);
    desired.set(
      cameraState.target.x + Math.sin(cameraState.rotation.y) * cameraState.zoom,
      cameraState.target.y + 1.2 + Math.sin(cameraState.rotation.x) * cameraState.zoom * 0.55,
      cameraState.target.z + cameraState.zoom,
    );
    const ease = reducedMotion ? 1 : Math.min(1, delta * 4.8);
    camera.position.lerp(desired, ease);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  });

  return null;
}
