'use client';

import { Plane } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform vec3 color;
uniform float time;

void main() {
  float grid = max(step(0.95, fract(vUv.x * 10.0)), step(0.95, fract(vUv.y * 10.0)));
  gl_FragColor = vec4(color * grid, 1.0);
}
`;

export function ReflectiveGround() {
  const uniforms = useMemo(
    () => ({
      time: { value: 0.0 },
      color: { value: new THREE.Color('#333') },
    }),
    []
  );

  return (
    <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </Plane>
  );
}
