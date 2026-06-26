"use client";

import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffect, useMemo } from 'react';

// Basic camera state, can be expanded with more cinematic properties
export interface CameraState {
  target: THREE.Vector3;
  position: THREE.Vector3;
  zoom: number;
  rotation: THREE.Euler;
}

interface R3FCameraProps {
  cameraState: CameraState;
  reducedMotion?: boolean;
  enableDamping?: boolean;
  dampingFactor?: number;
}

export default function R3FCamera({
  cameraState,
  reducedMotion = false,
  enableDamping = true,
  dampingFactor = 4.8,
}: R3FCameraProps) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const desiredPosition = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    // Initialize camera position and target
    camera.position.copy(cameraState.position);
    camera.lookAt(cameraState.target);
  }, [camera, cameraState.position, cameraState.target]);

  useFrame((_, delta) => {
    target.copy(cameraState.target);
    desiredPosition.copy(cameraState.position);

    const ease = reducedMotion ? 1 : Math.min(1, delta * dampingFactor);

    if (enableDamping) {
      camera.position.lerp(desiredPosition, ease);
      // Implement a smoother lookAt with quaternion slerp
      const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().lookAt(camera.position, target, camera.up)
      );
      camera.quaternion.slerp(targetQuaternion, ease);
    } else {
      camera.position.copy(desiredPosition);
      camera.lookAt(target);
    }

    camera.updateProjectionMatrix();
  });

  return null;
}
