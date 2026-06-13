import { useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform float time;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float star(vec2 uv, float flare) {
  float d = length(uv);
  float m = .05/d;

  float rays = max(0., 1. - abs(uv.x * uv.y * 1000.));
  m += rays * flare;
  uv *= 10.;
  float s = max(0., 1. - length(uv));
  m += s*.5;

  return m;
}

void main() {
  vec2 uv = vUv - 0.5;

  vec3 color = mix(color1, color2, uv.y + sin(time * 0.1) * 0.1);
  color = mix(color, color3, uv.x + cos(time * 0.1) * 0.1);

  float horizon = 1.0 - uv.y;
  color *= horizon;

  float rnd = random(uv + time*0.01);
  float starField = star(uv, rnd)*0.1;
  color += starField;

  float mist = sin(uv.y * 10.0 + time) * 0.1;
  color += mist;

  gl_FragColor = vec4(color, 1.0);
}
`;

export function DetailedOrb() {
  const uniforms = useMemo(
    () => ({
      time: { value: 0.0 },
      color1: { value: new THREE.Color('#0f0c29') },
      color2: { value: new THREE.Color('#302b63') },
      color3: { value: new THREE.Color('#24243e') },
    }),
    []
  );

  useFrame(({ clock }) => {
    uniforms.time.value = clock.getElapsedTime();
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} scale={1000}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
