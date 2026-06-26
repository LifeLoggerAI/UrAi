"use client";

import { Canvas } from '@react-three/fiber';
import R3FCamera, { CameraState } from './R3FCamera';
import { CosmicSky } from './CosmicSky';
import { ReflectiveGround } from './ReflectiveGround';
import { DetailedOrb } from './DetailedOrb';
import { AvatarSilhouette } from './AvatarSilhouette';
import * as THREE from 'three';

export function NewHomeScene() {
  const cameraState: CameraState = {
    position: new THREE.Vector3(0, 2, 10),
    target: new THREE.Vector3(0, 0, 0),
    zoom: 1,
    rotation: new THREE.Euler(0, 0, 0),
  };

  return (
    <Canvas>
      <R3FCamera cameraState={cameraState} />
      <fog attach="fog" args={['#a0a0a0', 10, 50]} />
      <CosmicSky />
      <ReflectiveGround />
      <DetailedOrb />
      <AvatarSilhouette />
      <ambientLight intensity={1} />
      <hemisphereLight intensity={0.6} groundColor="black" />
      <pointLight position={[10, 10, 10]} />
    </Canvas>
  );
}
