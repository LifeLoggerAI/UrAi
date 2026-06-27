"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function spiralPoint(index: number, total: number) {
  const arm = index % 5;
  const t = index / total;
  const radius = 0.9 + Math.pow(t, 0.72) * 11.8 + ((index * 17) % 100) / 210;
  const swirl = radius * 0.48;
  const angle = arm * ((Math.PI * 2) / 5) + index * 0.146 + swirl;
  const armScatter = (((index * 37) % 100) / 100 - 0.5) * (0.34 + t * 1.75);
  const verticalScatter = (((index * 53) % 100) / 100 - 0.5) * (0.34 + t * 1.1);
  return new THREE.Vector3(
    Math.cos(angle) * radius + Math.cos(angle + Math.PI / 2) * armScatter,
    verticalScatter + Math.sin(angle * 0.7) * 0.2,
    Math.sin(angle) * radius * 0.72 - 2.6 - t * 6.6 + Math.sin(index * 0.27) * 0.9,
  );
}

export default function StarField({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const nearRef = useRef<THREE.Points>(null);
  const farRef = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);

  const fields = useMemo(() => {
    const nearCount = 1550;
    const farCount = 1750;
    const dustCount = 1900;

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
      const color = colorChoices[index % colorChoices.length].clone().lerp(new THREE.Color("#ffffff"), ((index * 13) % 100) / 220);
      nearColors[index * 3] = color.r;
      nearColors[index * 3 + 1] = color.g;
      nearColors[index * 3 + 2] = color.b;
    }

    for (let index = 0; index < farCount; index += 1) {
      const angle = index * 2.39996323;
      const radius = 6 + Math.sqrt(index) * 0.72;
      const depth = -8 - (index % 71) * 0.2;
      farPositions[index * 3] = Math.cos(angle) * radius + Math.sin(index * 0.11) * 1.8;
      farPositions[index * 3 + 1] = Math.sin(angle * 0.53) * 5.4 + (((index * 19) % 100) / 100 - 0.5) * 2.8;
      farPositions[index * 3 + 2] = Math.sin(angle) * radius * 0.85 + depth;
      const color = colorChoices[(index + 2) % colorChoices.length].clone().lerp(new THREE.Color("#8fb8ff"), 0.2);
      farColors[index * 3] = color.r;
      farColors[index * 3 + 1] = color.g;
      farColors[index * 3 + 2] = color.b;
    }

    for (let index = 0; index < dustCount; index += 1) {
      const point = spiralPoint(index, dustCount);
      dustPositions[index * 3] = point.x * 0.94 + Math.sin(index) * 0.55;
      dustPositions[index * 3 + 1] = point.y * 0.5 + (((index * 31) % 100) / 100 - 0.5) * 0.62;
      dustPositions[index * 3 + 2] = point.z + Math.cos(index * 0.17) * 0.62;
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
      groupRef.current.rotation.x = Math.cos(t * 0.02) * 0.026;
      groupRef.current.rotation.z = Math.sin(t * 0.018) * 0.022;
    }
    if (nearRef.current) nearRef.current.rotation.z = t * 0.0048;
    if (farRef.current) farRef.current.rotation.y = -t * 0.0055;
    if (dustRef.current) dustRef.current.rotation.z = -t * 0.008;
  });

  return (
    <group ref={groupRef} rotation={[0.22, -0.22, -0.08]} position={[0, 0, 1.2]}>
      <points ref={farRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[fields.farPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[fields.farColors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.034} vertexColors transparent opacity={0.52} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
      <points ref={dustRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[fields.dustPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[fields.dustColors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.064} vertexColors transparent opacity={0.14} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
      <points ref={nearRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[fields.nearPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[fields.nearColors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.056} vertexColors transparent opacity={0.72} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
    </group>
  );
}
