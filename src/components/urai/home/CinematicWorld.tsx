"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Component for drifting mist planes
function MistPlanes() {
  const { viewport } = useThree();
  const mistRef = useRef<THREE.Group>(null);

  const mistPlanes = useMemo(() => {
    const planes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] =
      [];

    for (let i = 0; i < 15; i += 1) {
      const geometry = new THREE.PlaneGeometry(8, 2);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0x0a0a1a),
        transparent: true,
        opacity: Math.random() * 0.1 + 0.05,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.set(
        (Math.random() - 0.5) * viewport.width,
        Math.random() * 1.5,
        (Math.random() - 0.5) * 10,
      );

      mesh.rotation.y = Math.random() * Math.PI;
      planes.push(mesh);
    }

    return planes;
  }, [viewport.width]);

  useFrame(() => {
    if (!mistRef.current) return;

    mistRef.current.children.forEach((plane) => {
      plane.position.x += 0.005;

      if (plane.position.x > viewport.width / 2) {
        plane.position.x = -viewport.width / 2;
      }
    });
  });

  return (
    <group ref={mistRef}>
      {mistPlanes.map((plane, index) => (
        <primitive key={index} object={plane} />
      ))}
    </group>
  );
}

export function CinematicWorld() {
  const skyRef = useRef<THREE.Mesh>(null);

  const skyShader = {
    uniforms: {
      topColor: { value: new THREE.Color(0x1a1a2a) },
      bottomColor: { value: new THREE.Color(0x0a0a1a) },
      offset: { value: 33 },
      exponent: { value: 0.6 },
    },
    vertexShader: `
      varying vec3 vWorldPosition;

      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;

      void main() {
        float h = normalize(vWorldPosition + offset).y;
        gl_FragColor = vec4(
          mix(
            bottomColor,
            topColor,
            max(pow(max(h, 0.0), exponent), 0.0)
          ),
          1.0
        );
      }
    `,
  };

  return (
    <>
      <fog attach="fog" args={["#0a0a1a", 10, 40]} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 7.5]} intensity={0.5} color="#d0e0ff" />

      <mesh ref={skyRef} scale={[100, 100, 100]}>
        <sphereGeometry args={[1, 32, 32]} />
        <shaderMaterial
          uniforms={skyShader.uniforms}
          vertexShader={skyShader.vertexShader}
          fragmentShader={skyShader.fragmentShader}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[0, -0.5, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color="#0a0a1a"
          roughness={0.7}
          metalness={0.1}
          envMapIntensity={0.5}
        />
      </mesh>

      <MistPlanes />
    </>
  );
}