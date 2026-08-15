"use client";

import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { URAI_SPATIAL_AUTHORITY } from "@/components/urai/real3d/RuntimeGLB";

function terrainHeight(x: number, z: number) {
  const broad = Math.sin(x * 0.09) * 0.18 + Math.cos(z * 0.075) * 0.14 + Math.sin((x + z) * 0.045) * 0.09;
  const detail = Math.sin(x * 0.4 + z * 0.18) * 0.025 + Math.cos(z * 0.31 - x * 0.16) * 0.022;
  const clearing = -Math.exp(-((x / 8.7) ** 2 + ((z + 1.8) / 10.4) ** 2)) * 0.24;
  return broad + detail + clearing - 0.13;
}

function makeTerrainGeometry() {
  const geometry = new THREE.PlaneGeometry(82, 82, 180, 180);
  geometry.rotateX(-Math.PI / 2);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < position.count; i += 1) {
    position.setY(i, terrainHeight(position.getX(i), position.getZ(i)));
  }
  geometry.computeVertexNormals();
  return geometry;
}

const TERRAIN_GEOMETRY = makeTerrainGeometry();

function PromotedSanctuary() {
  const sanctuary = useGLTF(URAI_SPATIAL_AUTHORITY.home);
  const world = useMemo(() => {
    const clone = sanctuary.scene.clone(true);
    const rejected = /portal|ring|threshold|village|mannequin|avatar|debug|marker|label|embodied|presence|memory-place-anchor|living-growth/i;
    const rejectedForgeForms = /vault|monolith|bridge|grove|firefly|alcove|veil|waterfall|mountain|vegetation|tree|sculpture/i;

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.visible = !rejected.test(object.name) && !rejectedForgeForms.test(object.name);
      if (!object.visible) return;
      const name = object.name.toLowerCase();
      const stone = /basin|pedestal|path|ground|terrain|stone/.test(name);
      object.material = new THREE.MeshStandardMaterial({
        color: stone ? "#526158" : "#3f5148",
        roughness: stone ? 0.92 : 0.98,
        metalness: 0.01,
      });
      object.castShadow = true;
      object.receiveShadow = true;
    });

    clone.name = "home-promoted-sanctuary-authority";
    clone.userData = {
      ...clone.userData,
      authority: "home-entry-chamber-v1",
      physicalBase: "reviewed-promoted-owned-geometry",
      suppressedForgeScenery: true,
      suppressedPortalProps: true,
    };
    return clone;
  }, [sanctuary.scene]);

  return <primitive object={world} />;
}

const FERN_PLACEMENTS = [
  [-7.4, -4.9, 0.82, -0.3], [-6.3, -7.4, 1.08, 0.7], [-5.1, -10.2, 0.9, 1.8], [-3.8, -3.7, 0.72, -1.4],
  [-3.1, -8.8, 1.16, 2.3], [-2.2, -11.6, 0.86, 0.2], [2.3, -4.1, 0.8, 0.9], [3.2, -9.4, 1.12, -0.6],
  [4.1, -11.1, 0.88, 1.4], [5.6, -4.8, 0.76, 2.6], [6.5, -8.2, 1.04, -1.8], [7.2, -10.7, 0.9, 0.4],
  [-8.0, 0.8, 0.8, 1.1], [-5.8, 2.6, 0.72, -2.2], [5.9, 2.1, 0.78, 2.0], [7.8, 0.2, 0.86, -0.8],
] as const;

function ScannedFernField() {
  const fern = useGLTF(URAI_SPATIAL_AUTHORITY.fern);
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#6f9a70",
    roughness: 0.92,
    metalness: 0,
    side: THREE.DoubleSide,
  }), []);

  useEffect(() => () => material.dispose(), [material]);

  const instances = useMemo(() => FERN_PLACEMENTS.map(([x, z, scale, rotation], index) => {
    const object = fern.scene.clone(true);
    object.name = `home-scanned-fern-${index + 1}`;
    object.position.set(x, terrainHeight(x, z) + 0.02, z);
    object.rotation.y = rotation;
    object.scale.setScalar(scale);
    object.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.material = material;
      child.castShadow = true;
      child.receiveShadow = true;
    });
    return object;
  }), [fern.scene, material]);

  return (
    <group name="home-scanned-natural-vegetation" userData={{ source: "Poly Haven fern_02 CC0 geometry; local vendored; no runtime external requests" }}>
      {instances.map((object) => <primitive key={object.name} object={object} />)}
    </group>
  );
}

function NaturalTerrain() {
  return (
    <group name="home-physical-natural-ground">
      <mesh geometry={TERRAIN_GEOMETRY} receiveShadow>
        <meshStandardMaterial color="#29483a" roughness={0.98} metalness={0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4.9, terrainHeight(4.9, -7.2) + 0.015, -7.2]}>
        <planeGeometry args={[5.6, 4.2, 1, 1]} />
        <meshPhysicalMaterial color="#123f48" roughness={0.08} clearcoat={1} clearcoatRoughness={0.1} transparent opacity={0.62} />
      </mesh>
    </group>
  );
}

function AtmosphericMist() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.position.x = Math.sin(clock.elapsedTime * 0.05) * 0.35;
  });

  return (
    <group ref={group} position={[0, 0.35, -8]}>
      {[-5.5, -1.8, 2.4, 5.9].map((x, index) => (
        <mesh key={x} position={[x, index % 2 ? 0.25 : 0.05, -index * 1.4]} rotation={[0, index * 0.42, 0]}>
          <planeGeometry args={[7.5, 1.7]} />
          <meshBasicMaterial color="#d5dcd8" transparent opacity={0.026} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

export function CinematicWorld() {
  const skyShader = useMemo(() => ({
    uniforms: {
      topColor: { value: new THREE.Color("#617d91") },
      horizonColor: { value: new THREE.Color("#c5c7bb") },
      groundColor: { value: new THREE.Color("#8b8b7d") },
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
      uniform vec3 horizonColor;
      uniform vec3 groundColor;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition).y;
        float skyMix = smoothstep(0.0, 0.72, max(h, 0.0));
        float groundMix = smoothstep(-0.3, 0.0, h);
        vec3 below = mix(groundColor, horizonColor, groundMix);
        vec3 color = h >= 0.0 ? mix(horizonColor, topColor, skyMix) : below;
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  }), []);

  return (
    <>
      <fog attach="fog" args={["#a1aaa5", 14, 46]} />
      <hemisphereLight intensity={0.68} color="#d9e5e7" groundColor="#626253" />
      <ambientLight intensity={0.24} color="#dce1dc" />
      <directionalLight
        position={[-6, 10, 5]}
        intensity={2.2}
        color="#f3eee1"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />
      <directionalLight position={[7, 4, -8]} intensity={0.45} color="#a9c6d4" />

      <mesh scale={[100, 100, 100]}>
        <sphereGeometry args={[1, 48, 32]} />
        <shaderMaterial uniforms={skyShader.uniforms} vertexShader={skyShader.vertexShader} fragmentShader={skyShader.fragmentShader} side={THREE.BackSide} />
      </mesh>

      <NaturalTerrain />
      <PromotedSanctuary />
      <ScannedFernField />
      <AtmosphericMist />
      <ContactShadows position={[0, 0.01, -1.5]} scale={24} far={11} blur={3.4} opacity={0.34} />
      <Environment preset="forest" environmentIntensity={0.32} />
    </>
  );
}
