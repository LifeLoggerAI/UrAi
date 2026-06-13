import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const vertexShader = `
varying vec3 vNormal;
void main() {
  vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec3 vNormal;
uniform float time;

float fresnel(float angle, float power) {
  return pow(1.0 - angle, power);
}

void main() {
  float f = fresnel(dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
  float noise = 0.5 + 0.5 * sin(time + vNormal.x * 10.0) * sin(time + vNormal.y * 10.0);
  gl_FragColor = vec4(vec3(0.2, 0.3, 0.5) * f * noise, 1.0);
}
`;

export function AvatarSilhouette() {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      time: { value: 0.0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    uniforms.time.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} position={[0, -0.5, -2]}>
      <boxGeometry args={[0.5, 1, 0.5]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}
