"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function spiralPoint(index: number, total: number) {
  const arm = index % 5;
  const t = index / total;
  const radius = 1.8 + Math.pow(t, 0.72) * 18.5 + ((index * 17) % 100) / 150;
  const swirl = radius * 0.34;
  const angle = arm * ((Math.PI * 2) / 5) + index * 0.112 + swirl;
  const armScatter = (((index * 37) % 100) / 100 - 0.5) * (0.48 + t * 2.3);
  const verticalScatter = (((index * 53) % 100) / 100 - 0.5) * (0.4 + t * 1.25);
  return new THREE.Vector3(
    Math.cos(angle) * radius + Math.cos(angle + Math.PI / 2) * armScatter,
    verticalScatter + Math.sin(angle * 0.7) * 0.18,
    Math.sin(angle) * radius * 0.62 - 7 - t * 10 + Math.sin(index * 0.27) * 1.2,
  );
}

export default function StarField({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const nearRef = useRef<THREE.Points>(null);
  const farRef = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);

  const fields = useMemo(() => {
    const nearCount = 1400;
    const farCount = 1800;
    const dustCount = 2200;

    const nearPositions = new Float32Array(nearCount * 3);
    const nearColors = new Float32Array(nearCount * 3);
    const farPositions = new Float32Array(farCount * 3);
    const farColors = new Float32Array(farCount * 3);
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);

    const colorChoices = [new THREE.Color("#e9fbff"), new THREE.Color("#9be7ff"), new THREE.Color("#c7a0ff"), new THREE.Color("#ffe58a"), new THREE.Color("#b8ffd8")];

    for (let index = 0; index < nearCount; index += 1) {
      const point = spiralPoint(index, nearCount);
      nearPositions[index * 3] = point.x;
      nearPositions[index * 3 + 1] = point.y;
      nearPositions[index * 3 + 2] = point.z;
      const color = colorChoices[index % colorChoices.length].clone().lerp(new THREE.Color("#ffffff"), ((index * 13) % 100) / 240);
      nearColors[index * 3] = color.r;
      nearColors[index * 3 + 1] = color.g;
      nearColors[index * 3 + 2] = color.b;
    }

    for (let index = 0; index < farCount; index += 1) {
      const angle = index * 2.39996323;
      const radius = 10 + Math.sqrt(index) * 1.05;
      const depth = -14 - (index % 71) * 0.34;
      farPositions[index * 3] = Math.cos(angle) * radius + Math.sin(index * 0.11) * 2.5;
      farPositions[index * 3 + 1] = Math.sin(angle * 0.53) * 7.5 + (((index * 19) % 100) / 100 - 0.5) * 3.2;
      farPositions[index * 3 + 2] = Math.sin(angle) * radius * 0.8 + depth;
      const color = colorChoices[(index + 2) % colorChoices.length].clone().lerp(new THREE.Color("#8fb8ff"), 0.28);
      farColors[index * 3] = color.r;
      farColors[index * 3 + 1] = color.g;
      farColors[index * 3 + 2] = color.b;
    }

    for (let index = 0; index < dustCount; index += 1) {
      const point = spiralPoint(index, dustCount);
      dustPositions[index * 3] = point.x * 0.86 + Math.sin(index) * 0.7;
      dustPositions[index * 3 + 1] = point.y * 0.46 + (((index * 31) % 100) / 100 - 0.5) * 0.7;
      dustPositions[index * 3 + 2] = point.z + Math.cos(index * 0.17) * 0.8;
      const color = new THREE.Color(index % 3 === 0 ? "#7dd3fc" : index % 3 === 1 ? "#c4b5fd" : "#fde68a");
      dustColors[index * 3] = color.r;
      dustColors[index * 3 + 1] = color.g;
      dustColors[index * 3 + 2] = color.b;
    }

    return { nearPositions, nearColors, farPositions, farColors, dustPositions, dustColors };
  }, []);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.028) * 0.08;
      groupRef.current.rotation.x = Math.cos(t * 0.02) * 0.025;
      groupRef.current.rotation.z = Math.sin(t * 0.018) * 0.018;
    }
    if (nearRef.current) nearRef.current.rotation.z = t * 0.0028;
    if (farRef.current) farRef.current.rotation.y = -t * 0.0045;
    if (dustRef.current) dustRef.current.rotation.z = -t * 0.006;
  });

  return (
    <group ref={groupRef} rotation={[0.18, -0.18, -0.08]}>
      <points ref={farRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[fields.farPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[fields.farColors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.026} vertexColors transparent opacity={0.54} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
      <points ref={dustRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[fields.dustPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[fields.dustColors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.055} vertexColors transparent opacity={0.16} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
      <points ref={nearRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[fields.nearPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[fields.nearColors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.044} vertexColors transparent opacity={0.88} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
    </group>
  );
}
